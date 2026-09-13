// Browser Speech Recognition for Voice Search (Speech-to-Text)

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface VoiceSearchOptions {
  lang?: string;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export class VoiceSearchRecognizer {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    const SpeechRec = typeof window !== 'undefined' 
      ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
      : null;

    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
    }
  }

  public isSupported(): boolean {
    return !!(typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));
  }

  public startListening(options: VoiceSearchOptions) {
    if (!this.recognition) {
      options.onError("Aapke browser me Voice Recognition support uplabdh nahi hai. Kripya Chrome ya Edge ka prayas karein.");
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.lang = options.lang || 'hi-IN';

    this.recognition.onstart = () => {
      this.isListening = true;
      if (options.onStart) options.onStart();
    };

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      const isFinal = !!finalTranscript;
      options.onResult(text, isFinal);
    };

    this.recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      this.isListening = false;
      let msg = "Awaaz pehchanne me samasya aayi.";
      if (event.error === 'not-allowed') {
        msg = "Microphone access blocked hai. Kripya browser me mic permission allow karein.";
      } else if (event.error === 'no-speech') {
        msg = "Koi awaaz nahi suni gayi. Kripya punah bole.";
      }
      options.onError(msg);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (options.onEnd) options.onEnd();
    };

    try {
      this.recognition.start();
    } catch (e: any) {
      console.warn("Recognition start failed:", e);
      options.onError("Microphone shuru nahi ho saka: " + e.message);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const globalVoiceRecognizer = new VoiceSearchRecognizer();
