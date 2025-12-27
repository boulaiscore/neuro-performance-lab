import { useState, useEffect, useCallback } from 'react';
import AppBlocker, { isNativeAndroid, SocialApp, AppUsageStat } from '@/lib/capacitor/appBlocker';

interface BlockerState {
  isNative: boolean;
  hasUsagePermission: boolean;
  hasOverlayPermission: boolean;
  isBlockingActive: boolean;
  remainingMinutes: number;
  socialApps: SocialApp[];
  usageStats: AppUsageStat[];
  isLoading: boolean;
}

export function useAppBlocker() {
  const [state, setState] = useState<BlockerState>({
    isNative: false,
    hasUsagePermission: false,
    hasOverlayPermission: false,
    isBlockingActive: false,
    remainingMinutes: 0,
    socialApps: [],
    usageStats: [],
    isLoading: true,
  });

  const checkPermissions = useCallback(async () => {
    if (!isNativeAndroid()) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const [usageResult, overlayResult] = await Promise.all([
        AppBlocker.hasUsageAccessPermission(),
        AppBlocker.hasOverlayPermission(),
      ]);

      setState(prev => ({
        ...prev,
        isNative: true,
        hasUsagePermission: usageResult.granted,
        hasOverlayPermission: overlayResult.granted,
        isLoading: false,
      }));
    } catch (error) {
      console.error('[useAppBlocker] Error checking permissions:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const loadSocialApps = useCallback(async () => {
    try {
      const result = await AppBlocker.getSocialApps();
      setState(prev => ({ ...prev, socialApps: result.apps }));
    } catch (error) {
      console.error('[useAppBlocker] Error loading social apps:', error);
    }
  }, []);

  const loadUsageStats = useCallback(async () => {
    if (!state.hasUsagePermission) return;
    
    try {
      const result = await AppBlocker.getUsageStats();
      setState(prev => ({ ...prev, usageStats: result.stats }));
    } catch (error) {
      console.error('[useAppBlocker] Error loading usage stats:', error);
    }
  }, [state.hasUsagePermission]);

  const checkBlockingStatus = useCallback(async () => {
    try {
      const result = await AppBlocker.isBlockingActive();
      setState(prev => ({
        ...prev,
        isBlockingActive: result.active,
        remainingMinutes: result.remainingMinutes,
      }));
    } catch (error) {
      console.error('[useAppBlocker] Error checking blocking status:', error);
    }
  }, []);

  const requestUsagePermission = useCallback(async () => {
    try {
      await AppBlocker.requestUsageAccessPermission();
      // Permission is granted in system settings, so we need to re-check
      setTimeout(checkPermissions, 1000);
    } catch (error) {
      console.error('[useAppBlocker] Error requesting usage permission:', error);
    }
  }, [checkPermissions]);

  const requestOverlayPermission = useCallback(async () => {
    try {
      await AppBlocker.requestOverlayPermission();
      setTimeout(checkPermissions, 1000);
    } catch (error) {
      console.error('[useAppBlocker] Error requesting overlay permission:', error);
    }
  }, [checkPermissions]);

  const startBlocking = useCallback(async (
    packageNames: string[],
    durationMinutes: number,
    message?: string
  ) => {
    try {
      await AppBlocker.startBlocking({ packageNames, durationMinutes, message });
      setState(prev => ({
        ...prev,
        isBlockingActive: true,
        remainingMinutes: durationMinutes,
      }));
      return true;
    } catch (error) {
      console.error('[useAppBlocker] Error starting blocking:', error);
      return false;
    }
  }, []);

  const stopBlocking = useCallback(async () => {
    try {
      await AppBlocker.stopBlocking();
      setState(prev => ({
        ...prev,
        isBlockingActive: false,
        remainingMinutes: 0,
      }));
      return true;
    } catch (error) {
      console.error('[useAppBlocker] Error stopping blocking:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    checkPermissions();
    loadSocialApps();
  }, [checkPermissions, loadSocialApps]);

  useEffect(() => {
    if (state.hasUsagePermission) {
      loadUsageStats();
    }
  }, [state.hasUsagePermission, loadUsageStats]);

  useEffect(() => {
    checkBlockingStatus();
    const interval = setInterval(checkBlockingStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkBlockingStatus]);

  return {
    ...state,
    requestUsagePermission,
    requestOverlayPermission,
    startBlocking,
    stopBlocking,
    refreshPermissions: checkPermissions,
    refreshUsageStats: loadUsageStats,
  };
}
