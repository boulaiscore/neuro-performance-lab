import { Capacitor, registerPlugin } from '@capacitor/core';

export interface AppBlockerPlugin {
  // Check if usage access permission is granted
  hasUsageAccessPermission(): Promise<{ granted: boolean }>;
  
  // Request usage access permission (opens system settings)
  requestUsageAccessPermission(): Promise<void>;
  
  // Check if overlay permission is granted
  hasOverlayPermission(): Promise<{ granted: boolean }>;
  
  // Request overlay permission (opens system settings)
  requestOverlayPermission(): Promise<void>;
  
  // Get list of installed social apps
  getSocialApps(): Promise<{ apps: SocialApp[] }>;
  
  // Start blocking specified apps
  startBlocking(options: { 
    packageNames: string[]; 
    durationMinutes: number;
    message?: string;
  }): Promise<void>;
  
  // Stop blocking all apps
  stopBlocking(): Promise<void>;
  
  // Check if blocking is currently active
  isBlockingActive(): Promise<{ active: boolean; remainingMinutes: number }>;
  
  // Get usage stats for today
  getUsageStats(): Promise<{ stats: AppUsageStat[] }>;
}

export interface SocialApp {
  packageName: string;
  appName: string;
  icon?: string; // Base64 encoded
}

export interface AppUsageStat {
  packageName: string;
  appName: string;
  usageMinutes: number;
  lastUsed: number;
}

// Common social media package names
export const SOCIAL_APP_PACKAGES = [
  'com.instagram.android',
  'com.facebook.katana',
  'com.facebook.orca', // Messenger
  'com.twitter.android',
  'com.zhiliaoapp.musically', // TikTok
  'com.snapchat.android',
  'com.whatsapp',
  'org.telegram.messenger',
  'com.linkedin.android',
  'com.pinterest',
  'com.reddit.frontpage',
  'com.discord',
  'com.youtube',
];

// Register the plugin - will be implemented natively on Android
const AppBlocker = registerPlugin<AppBlockerPlugin>('AppBlocker', {
  web: {
    async hasUsageAccessPermission() {
      console.log('[AppBlocker] Web: Usage access not available');
      return { granted: false };
    },
    async requestUsageAccessPermission() {
      console.log('[AppBlocker] Web: Cannot request usage access');
    },
    async hasOverlayPermission() {
      console.log('[AppBlocker] Web: Overlay not available');
      return { granted: false };
    },
    async requestOverlayPermission() {
      console.log('[AppBlocker] Web: Cannot request overlay');
    },
    async getSocialApps() {
      // Return mock data for web testing
      return {
        apps: [
          { packageName: 'com.instagram.android', appName: 'Instagram' },
          { packageName: 'com.facebook.katana', appName: 'Facebook' },
          { packageName: 'com.twitter.android', appName: 'X (Twitter)' },
          { packageName: 'com.zhiliaoapp.musically', appName: 'TikTok' },
          { packageName: 'com.snapchat.android', appName: 'Snapchat' },
          { packageName: 'com.whatsapp', appName: 'WhatsApp' },
          { packageName: 'com.youtube', appName: 'YouTube' },
        ]
      };
    },
    async startBlocking() {
      console.log('[AppBlocker] Web: Blocking simulated');
    },
    async stopBlocking() {
      console.log('[AppBlocker] Web: Blocking stopped');
    },
    async isBlockingActive() {
      return { active: false, remainingMinutes: 0 };
    },
    async getUsageStats() {
      return { stats: [] };
    },
  },
});

export const isNativeAndroid = () => Capacitor.getPlatform() === 'android';

export default AppBlocker;
