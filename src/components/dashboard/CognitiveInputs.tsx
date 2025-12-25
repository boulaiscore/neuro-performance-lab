import { useState, useEffect } from "react";
import { Headphones, Clock, Target, MapPin, Zap, ExternalLink, CheckCircle2, Circle } from "lucide-react";

interface CognitiveInput {
  id: string;
  title: string;
  duration: string;
  cognitivePurpose: string;
  usageContext: string;
  reflectionPrompt: string;
  spotifyUrl: string;
  applePodcastsUrl: string;
}

const COGNITIVE_INPUTS: CognitiveInput[] = [
  {
    id: "in-our-time",
    title: "In Our Time",
    duration: "35–55 min",
    cognitivePurpose: "Concettualizzazione rapida, distinzione tra tesi e prove, contesto storico/filosofico",
    usageContext: "Commute / walk a bassa arousal",
    reflectionPrompt: "Qual è la tesi principale? Che evidenze la sorreggono e cosa la falsificherebbe?",
    spotifyUrl: "https://open.spotify.com/show/17YfG23eMbfLBaDPqucgzZ",
    applePodcastsUrl: "https://podcasts.apple.com/us/podcast/in-our-time/id73330895",
  },
  {
    id: "partially-examined-life",
    title: "The Partially Examined Life",
    duration: "60–120 min",
    cognitivePurpose: "Seguire argomentazioni complesse senza scorciatoie; allenare slow thinking",
    usageContext: "Sera / long focus block",
    reflectionPrompt: "Riesco a ricostruire l'argomento in 5 frasi? Dove sono le premesse implicite?",
    spotifyUrl: "https://open.spotify.com/show/1APpUKebKOXJZjoCaCfoVk",
    applePodcastsUrl: "https://podcasts.apple.com/it/podcast/the-partially-examined-life-philosophy-podcast/id318345767",
  },
  {
    id: "very-bad-wizards",
    title: "Very Bad Wizards",
    duration: "45–90 min",
    cognitivePurpose: "Dilemmi morali + psicologia; tenere insieme intuizioni e rigore",
    usageContext: "Commute lungo / palestra post-allenamento",
    reflectionPrompt: "Quale principio morale stanno usando? Esiste un controesempio che lo rompe?",
    spotifyUrl: "https://open.spotify.com/show/4gGFerFYkDHnezTlwExEbu",
    applePodcastsUrl: "https://podcasts.apple.com/us/podcast/very-bad-wizards/id557975157",
  },
  {
    id: "mindscape",
    title: "Sean Carroll's Mindscape",
    duration: "60–120 min",
    cognitivePurpose: "Profondità + sintesi cross-disciplinare; ragionare su modelli del mondo",
    usageContext: "Weekend / deep work block",
    reflectionPrompt: "Quali assunzioni reggono la visione dell'ospite? Cosa cambierebbe se fossero false?",
    spotifyUrl: "https://open.spotify.com/show/622lvLwp8CVu6dvCsYAJhN",
    applePodcastsUrl: "https://podcasts.apple.com/us/podcast/sean-carrolls-mindscape-science-society-philosophy/id1406534739",
  },
  {
    id: "philosophy-bites",
    title: "Philosophy Bites",
    duration: "15–25 min",
    cognitivePurpose: "Concetti ad alta densità in poco tempo; allenare definizioni e distinzioni",
    usageContext: "Coffee / micro-moment",
    reflectionPrompt: "Definisci il concetto con parole tue e genera 1 esempio + 1 controesempio.",
    spotifyUrl: "https://open.spotify.com/show/6UmBytzR58EY4hN1jzQG2o",
    applePodcastsUrl: "https://podcasts.apple.com/gb/podcast/philosophy-bites/id257042117",
  },
  {
    id: "econtalk",
    title: "EconTalk",
    duration: "50–90 min",
    cognitivePurpose: "Causalità, incentivi, trade-off; ragionare su sistemi complessi",
    usageContext: "Commute / camminata",
    reflectionPrompt: "Qual è il meccanismo causale proposto? Quale variabile confondente manca?",
    spotifyUrl: "https://open.spotify.com/show/4M5Gb71lskQ0Rg6e08uQhi",
    applePodcastsUrl: "https://podcasts.apple.com/us/podcast/econtalk/id135066958",
  },
  {
    id: "conversations-with-tyler",
    title: "Conversations with Tyler",
    duration: "45–90 min",
    cognitivePurpose: "Esplorazione ampia + connessioni inattese; allenare sintesi e domande migliori",
    usageContext: "Commute lungo / sessione focus leggero",
    reflectionPrompt: "Qual è l'idea più non ovvia? Che implicazione pratica ha?",
    spotifyUrl: "https://open.spotify.com/show/0Z1234tGXD2hVhjFrrhJ7g",
    applePodcastsUrl: "https://podcasts.apple.com/us/podcast/conversations-with-tyler/id983795625",
  },
];

const STORAGE_KEY = "neuroloop-listened-podcasts";

function InputCard({ 
  input, 
  isListened, 
  onToggleListened 
}: { 
  input: CognitiveInput; 
  isListened: boolean;
  onToggleListened: () => void;
}) {
  return (
    <div className={`border border-border/40 bg-card/30 p-4 space-y-3 transition-all ${isListened ? 'opacity-60' : ''}`}>
      {/* Header: Toggle + Duration */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleListened}
            className="flex items-center gap-2 group"
            aria-label={isListened ? "Mark as not listened" : "Mark as listened"}
          >
            {isListened ? (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary/70 transition-colors" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-primary/70" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Podcast
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{input.duration}</span>
        </div>
      </div>

      {/* Title */}
      <h4 className={`text-sm font-medium leading-tight ${isListened ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
        {input.title}
      </h4>

      {/* Metadata Grid */}
      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-2">
          <Target className="h-3 w-3 text-primary/50 mt-0.5 shrink-0" />
          <span className="text-muted-foreground">{input.cognitivePurpose}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="h-3 w-3 text-primary/50 mt-0.5 shrink-0" />
          <span className="text-muted-foreground">{input.usageContext}</span>
        </div>
        <div className="flex items-start gap-2">
          <Zap className="h-3 w-3 text-amber-500/70 mt-0.5 shrink-0" />
          <span className="text-amber-600/80 dark:text-amber-400/80 italic text-[11px]">
            "{input.reflectionPrompt}"
          </span>
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center gap-3 pt-2 border-t border-border/30">
        <a
          href={input.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          Spotify
        </a>
        <a
          href={input.applePodcastsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          Apple Podcasts
        </a>
      </div>
    </div>
  );
}

export function CognitiveInputs() {
  const [listenedIds, setListenedIds] = useState<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setListenedIds(new Set(JSON.parse(stored)));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save to localStorage when changed
  const toggleListened = (id: string) => {
    setListenedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const listenedCount = listenedIds.size;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Cognitive Inputs
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Curated podcasts for cognitive development
          </p>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
          {listenedCount}/{COGNITIVE_INPUTS.length} Listened
        </div>
      </div>

      {/* Input Cards */}
      <div className="grid gap-3">
        {COGNITIVE_INPUTS.map((input) => (
          <InputCard 
            key={input.id} 
            input={input} 
            isListened={listenedIds.has(input.id)}
            onToggleListened={() => toggleListened(input.id)}
          />
        ))}
      </div>

      {/* Footer Note */}
      <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wide text-center pt-2">
        Tap circle to mark as listened
      </p>
    </section>
  );
}
