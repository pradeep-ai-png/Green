// Advanced Indian Female Voice TTS Engine for Green Step AI
// Focused exclusively on Indian Languages (Hindi / Indian English / Hinglish)
// Prioritizes genuine Indian female voices: Google हिन्दी, Swara, Heera, Kalpana, Neerja, Priya, Veena, etc.

export interface SpokenSegment {
  text: string;
  originalIndex: number;
}

// Clean and prepare response text specifically for smooth, natural Indian speech
export function prepareTextForTTS(rawText: string): string[] {
  if (!rawText) return [];

  // 1. Completely omit full code blocks (\`\`\`...\`\`\`)
  // Replaced with a friendly Hindi transition sentence
  let cleaned = rawText.replace(/```[\s\S]*?```/g, " यहाँ कोड दिया गया है, जिसे आप स्क्रीन पर देख सकते हैं। ");

  // 2. Remove inline code snippets (`code`)
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1");

  // 3. Remove URLs/links
  cleaned = cleaned.replace(/https?:\/\/\S+/g, "");

  // 4. Remove Markdown syntax (headers, bold, italics, bullets, blockquotes)
  cleaned = cleaned.replace(/#{1,6}\s+/g, "");
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, "$1");
  cleaned = cleaned.replace(/\*([^*]+)\*/g, "$1");
  cleaned = cleaned.replace(/__([^_]+)__/g, "$1");
  cleaned = cleaned.replace(/_([^_]+)_/g, "$1");
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  cleaned = cleaned.replace(/^>\s+/gm, "");
  cleaned = cleaned.replace(/^[-*•+]\s+/gm, "");
  cleaned = cleaned.replace(/^\d+\.\s+/gm, "");

  // 5. Clean strange programming symbols so speech synthesis doesn't read brackets/braces
  cleaned = cleaned.replace(/[{}\[\]<>\\\/=~^|]/g, " ");

  // 6. Clean common emojis
  cleaned = cleaned.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    ""
  );

  // 7. Split into pleasant, bite-sized natural sentence segments
  const rawSegments = cleaned.split(/(?<=[।.?!])\s+|\n{2,}/);

  const sentences: string[] = [];
  for (const seg of rawSegments) {
    const trimmed = seg.replace(/\s+/g, " ").trim();
    if (trimmed.length > 1 && !/^[^\w\u0900-\u097F]+$/.test(trimmed)) {
      sentences.push(trimmed);
    }
  }

  return sentences;
}

// Indian female voice priority indicators
// Specifically tuned for Indian Hindi & Indian English voices
const INDIAN_FEMALE_PRIORITY = [
  'google हिन्दी',
  'google hindi',
  'swara',
  'heera',
  'kalpana',
  'neerja',
  'priya',
  'veena',
  'aditi',
  'ananya',
  'hindi',
  'en-in',
  'hi-in',
  'india',
  'natural',
  'neural',
  'samantha',
  'zira',
  'aria',
  'female',
  'woman'
];

export function getAvailableFemaleVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }

  const allVoices = window.speechSynthesis.getVoices();
  if (!allVoices || allVoices.length === 0) return [];

  // Filter and sort voices with Indian female voices on top
  const scored = allVoices.map((voice) => {
    let score = 0;
    const nameLower = voice.name.toLowerCase();
    const langLower = voice.lang.toLowerCase();

    // Indian Hindi Female (highest score)
    if (langLower.includes('hi') || langLower === 'hi-in') score += 50;
    if (langLower.includes('en-in')) score += 40;

    if (nameLower.includes('google हिन्दी') || nameLower.includes('google hindi')) score += 60;
    if (/swara|kalpana|heera|priya|neerja|veena|aditi/i.test(nameLower)) score += 50;
    if (nameLower.includes('female') || nameLower.includes('woman')) score += 20;
    if (nameLower.includes('natural') || nameLower.includes('neural')) score += 15;

    return { voice, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Return voices that have relevance to female or Indian locale
  const relevant = scored.filter((item) => item.score > 10).map((item) => item.voice);

  if (relevant.length > 0) {
    return relevant;
  }

  return allVoices;
}

export function pickBestIndianFemaleVoice(
  voices: SpeechSynthesisVoice[],
  hasHindiText: boolean
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // 1. Search for dedicated Indian Hindi voices
  const hindiFemaleVoice = voices.find(
    (v) =>
      (v.lang.startsWith('hi') || v.lang.toLowerCase() === 'hi-in') &&
      /google|swara|kalpana|heera|priya|neerja|veena|female|natural/i.test(v.name)
  ) || voices.find((v) => v.lang.startsWith('hi') || v.lang.toLowerCase() === 'hi-in');

  if (hasHindiText && hindiFemaleVoice) {
    return hindiFemaleVoice;
  }

  // 2. Search for Indian English female voices (en-IN)
  const indianEnglishFemaleVoice = voices.find(
    (v) =>
      v.lang.toLowerCase().includes('en-in') &&
      /swara|heera|neerja|priya|veena|aditi|female|natural|google/i.test(v.name)
  ) || voices.find((v) => v.lang.toLowerCase().includes('en-in'));

  if (indianEnglishFemaleVoice) {
    return indianEnglishFemaleVoice;
  }

  // 3. If Hindi text exists and we found a Hindi voice, return it
  if (hindiFemaleVoice) {
    return hindiFemaleVoice;
  }

  // 4. Any female voice with natural/neural quality
  const generalFemaleVoice = voices.find(
    (v) => /natural|neural|aria|jenny|samantha|zira|female|woman/i.test(v.name)
  );
  if (generalFemaleVoice) return generalFemaleVoice;

  return voices[0] || null;
}

class VoiceManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private isPaused = false;
  private currentSegments: string[] = [];
  private currentSegmentIndex = -1;
  private onSegmentChangeCallback: ((index: number, text: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  // Optimized for smooth, sweet, and calm Indian female speech
  private rate = 0.98; // Comfortable Indian speech pace
  private pitch = 1.08; // Sweet, warm female pitch
  private voiceURI: string | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded in browser
      };
    }
  }

  public setSettings(rate: number, pitch: number, voiceURI: string | null) {
    this.rate = Math.max(0.7, Math.min(rate, 1.5));
    this.pitch = Math.max(0.8, Math.min(pitch, 1.4));
    this.voiceURI = voiceURI;
  }

  public speakTextLineByLine(
    text: string,
    onSegmentChange?: (index: number, text: string) => void,
    onEnd?: () => void
  ) {
    this.stop();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    const segments = prepareTextForTTS(text);
    if (segments.length === 0) {
      if (onEnd) onEnd();
      return;
    }

    this.currentSegments = segments;
    this.currentSegmentIndex = -1;
    this.onSegmentChangeCallback = onSegmentChange || null;
    this.onEndCallback = onEnd || null;
    this.isSpeaking = true;
    this.isPaused = false;

    this.speakNextSegment();
  }

  private speakNextSegment() {
    if (!this.isSpeaking) return;

    this.currentSegmentIndex++;
    if (this.currentSegmentIndex >= this.currentSegments.length) {
      this.isSpeaking = false;
      this.currentSegmentIndex = -1;
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const segmentText = this.currentSegments[this.currentSegmentIndex];
    if (this.onSegmentChangeCallback) {
      this.onSegmentChangeCallback(this.currentSegmentIndex, segmentText);
    }

    const utterance = new SpeechSynthesisUtterance(segmentText);
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    const hasHindiChars = /[\u0900-\u097F]/.test(segmentText);
    const allVoices = window.speechSynthesis.getVoices();
    let selectedVoice: SpeechSynthesisVoice | null = null;

    if (this.voiceURI) {
      selectedVoice = allVoices.find((v) => v.voiceURI === this.voiceURI) || null;
    }

    if (!selectedVoice) {
      selectedVoice = pickBestIndianFemaleVoice(allVoices, hasHindiChars);
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || (hasHindiChars ? 'hi-IN' : 'en-IN');
    } else {
      utterance.lang = hasHindiChars ? 'hi-IN' : 'en-IN';
    }

    utterance.onend = () => {
      // Natural 90ms breathing pause between sentences
      setTimeout(() => {
        if (this.isSpeaking && !this.isPaused) {
          this.speakNextSegment();
        }
      }, 90);
    };

    utterance.onerror = (err) => {
      console.warn("Indian TTS utterance error:", err);
      setTimeout(() => {
        if (this.isSpeaking && !this.isPaused) {
          this.speakNextSegment();
        }
      }, 80);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.isPaused = true;
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.isPaused = false;
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentSegmentIndex = -1;
    this.currentSegments = [];
    if (this.onEndCallback) {
      this.onEndCallback();
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public getCurrentIndex(): number {
    return this.currentSegmentIndex;
  }
}

export const globalVoiceManager = new VoiceManager();
