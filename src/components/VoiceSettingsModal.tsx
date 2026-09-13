import React, { useEffect, useState } from 'react';
import { Volume2, Sparkles, X, Check, Play, Settings2 } from 'lucide-react';
import { VoiceSettings } from '../types';
import { getAvailableFemaleVoices, globalVoiceManager } from '../utils/textToSpeech';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onSaveSettings: (newSettings: VoiceSettings) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<VoiceSettings>(settings);
  const [femaleVoices, setFemaleVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = getAvailableFemaleVoices();
        setFemaleVoices(voices);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleTestVoice = () => {
    setIsTesting(true);
    globalVoiceManager.setSettings(localSettings.rate, localSettings.pitch, localSettings.voiceURI);
    const testLine = "नमस्ते! मैं ग्रीन स्टेप की एआई असिस्टेंट हूँ। आप मुझसे कोई भी सवाल पूछ सकते हैं।";
    globalVoiceManager.speakTextLineByLine(
      testLine,
      undefined,
      () => setIsTesting(false)
    );
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Indian Female Voice Settings</h3>
              <p className="text-xs text-slate-500">भारतीय महिला आवाज (Hindi / Indian English)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm text-slate-700 max-h-[65vh] overflow-y-auto pr-1">
          {/* 1. Auto-Voice Toggle */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900 block text-xs sm:text-sm">
                जवाब आते ही आवाज में बोले (Auto-Speak)
              </span>
              <span className="text-[11px] text-slate-600 block">
                नया मैसेज आते ही भारतीय महिला आवाज में सुनना शुरू होगा।
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-3">
              <input
                type="checkbox"
                checked={localSettings.autoSpeak}
                onChange={(e) =>
                  setLocalSettings((prev) => ({ ...prev, autoSpeak: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* 2. Voice Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              आवाज चुनें (Indian Female Voice Model)
            </label>
            <select
              value={localSettings.voiceURI || ''}
              onChange={(e) =>
                setLocalSettings((prev) => ({ ...prev, voiceURI: e.target.value || null }))
              }
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500"
            >
              <option value="">Auto-Select (Best Indian Female Voice - हिन्दी / English)</option>
              {femaleVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Google हिन्दी, Swara, Heera या Indian English आवाज प्राथमिकता पर रहती है।
            </p>
          </div>

          {/* 3. Speed / Rate */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
              <span>बोलने की गति (Speech Speed)</span>
              <span className="text-emerald-700 font-mono">{localSettings.rate}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.3"
              step="0.05"
              value={localSettings.rate}
              onChange={(e) =>
                setLocalSettings((prev) => ({ ...prev, rate: parseFloat(e.target.value) }))
              }
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>धीरे (0.75x)</span>
              <span>सामान्य (1.0x)</span>
              <span>तेज (1.3x)</span>
            </div>
          </div>

          {/* 4. Pitch */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
              <span>आवाज का सुरीलापन (Tone / Pitch)</span>
              <span className="text-emerald-700 font-mono">{localSettings.pitch}</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.3"
              step="0.05"
              value={localSettings.pitch}
              onChange={(e) =>
                setLocalSettings((prev) => ({ ...prev, pitch: parseFloat(e.target.value) }))
              }
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>गंभीर</span>
              <span>नेचुरल (1.08)</span>
              <span>पतली / सुरीली</span>
            </div>
          </div>

          {/* 5. Voice Test */}
          <div className="pt-2">
            <button
              onClick={handleTestVoice}
              disabled={isTesting}
              className="w-full py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4 text-emerald-600" />
              <span>{isTesting ? "आवाज सुना रहे हैं..." : "आवाज टेस्ट करें (Test Indian Voice)"}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-medium transition-colors"
          >
            रद्द करें (Cancel)
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>सेव करें (Save)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
