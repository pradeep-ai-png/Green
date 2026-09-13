export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

export interface VoiceSettings {
  autoSpeak: boolean; // "text aaya matlab voice me bolaga"
  voiceURI: string | null;
  rate: number; // 0.85 - 1.2
  pitch: number; // 0.9 - 1.2
  volume: number; // 0 - 1
  language: 'hi-IN' | 'en-IN' | 'en-US' | 'auto';
}
