import { ChatSession, VoiceSettings } from '../types';

const CHATS_STORAGE_KEY = 'greenstep_saved_chats_v1';
const VOICE_SETTINGS_KEY = 'greenstep_voice_settings_v1';

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  autoSpeak: true, // "text aaya matlab voice me bolaga"
  voiceURI: null,
  rate: 1.0,
  pitch: 1.05,
  volume: 1.0,
  language: 'hi-IN',
};

export function getSavedChats(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CHATS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load saved chats:", e);
    return [];
  }
}

export function saveChats(chats: ChatSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
  } catch (e) {
    console.error("Failed to save chats to localStorage:", e);
  }
}

export function getSavedVoiceSettings(): VoiceSettings {
  if (typeof window === 'undefined') return DEFAULT_VOICE_SETTINGS;
  try {
    const raw = localStorage.getItem(VOICE_SETTINGS_KEY);
    if (!raw) return DEFAULT_VOICE_SETTINGS;
    return { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_VOICE_SETTINGS;
  }
}

export function saveVoiceSettings(settings: VoiceSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VOICE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save voice settings:", e);
  }
}

export function createNewSession(firstPrompt?: string): ChatSession {
  const id = 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  let title = 'Nayi Baatcheet (New Chat)';
  if (firstPrompt) {
    title = firstPrompt.slice(0, 32).trim() + (firstPrompt.length > 32 ? '...' : '');
  }

  return {
    id,
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [
      {
        id: 'welcome_' + Date.now(),
        role: 'model',
        content: `Hello! Main **Green Step** ka AI hoon. Mujhse aap koi bhi sawaal pooch sakte hain! 🌿✨\n\nBataiye, aaj main aapki kya madad karoon?`,
        timestamp: Date.now(),
      }
    ]
  };
}
