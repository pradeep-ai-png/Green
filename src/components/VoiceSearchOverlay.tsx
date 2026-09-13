import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Send, X, Globe, Sparkles } from 'lucide-react';
import { globalVoiceRecognizer } from '../utils/speechRecognition';

interface VoiceSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSendQuery: (query: string) => void;
  defaultLang?: string;
}

export const VoiceSearchOverlay: React.FC<VoiceSearchOverlayProps> = ({
  isOpen,
  onClose,
  onSendQuery,
  defaultLang = 'hi-IN',
}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState(defaultLang);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setErrorMessage(null);
      startVoiceListening(selectedLang);
    } else {
      globalVoiceRecognizer.stopListening();
      setIsListening(false);
    }
    return () => {
      globalVoiceRecognizer.stopListening();
    };
  }, [isOpen, selectedLang]);

  const startVoiceListening = (lang: string) => {
    setErrorMessage(null);
    globalVoiceRecognizer.startListening({
      lang,
      onStart: () => setIsListening(true),
      onResult: (text) => {
        setTranscript(text);
      },
      onError: (err) => {
        setErrorMessage(err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
  };

  const handleToggleMic = () => {
    if (isListening) {
      globalVoiceRecognizer.stopListening();
      setIsListening(false);
    } else {
      startVoiceListening(selectedLang);
    }
  };

  const handleSend = () => {
    if (transcript.trim()) {
      onSendQuery(transcript.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-emerald-100 p-6 flex flex-col items-center text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Green Step Voice Search</span>
        </div>

        {/* Animated Mic Button & Waveform */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Animated sound waves when listening */}
          {isListening && (
            <>
              <div className="absolute w-28 h-28 rounded-full bg-emerald-400/20 animate-ping" />
              <div className="absolute w-36 h-36 rounded-full bg-emerald-500/10 animate-pulse" />
            </>
          )}

          <button
            onClick={handleToggleMic}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              isListening
                ? 'bg-gradient-to-tr from-emerald-500 to-green-500 text-white shadow-emerald-500/40'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {isListening ? (
              <Mic className="w-9 h-9 animate-bounce" />
            ) : (
              <MicOff className="w-9 h-9" />
            )}
          </button>
        </div>

        <p className="text-sm font-medium text-slate-700 mb-1">
          {isListening ? 'Sun rahe hain... Kripya bole (Listening...)' : 'Microphone band hai. Tap karke bole.'}
        </p>

        {/* Real-time transcript box */}
        <div className="w-full min-h-[90px] max-h-[140px] overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-sm sm:text-base my-3 flex items-center justify-center text-center">
          {transcript ? (
            <span className="font-medium text-slate-900">{transcript}</span>
          ) : (
            <span className="text-slate-400 italic text-xs sm:text-sm">
              "Kuch bhi poochein — jaise: Green Step Team kaun hai, ya Python me loop kaise likhein..."
            </span>
          )}
        </div>

        {/* Error message if any */}
        {errorMessage && (
          <p className="text-xs text-rose-500 mb-3 px-2">
            {errorMessage}
          </p>
        )}

        {/* Language selector */}
        <div className="flex items-center gap-2 mb-5">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Bhasha:</span>
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
            <button
              onClick={() => setSelectedLang('hi-IN')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedLang === 'hi-IN'
                  ? 'bg-white text-emerald-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी / Hinglish
            </button>
            <button
              onClick={() => setSelectedLang('en-IN')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedLang === 'en-IN'
                  ? 'bg-white text-emerald-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Send / Action buttons */}
        <div className="w-full flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            Radd Karein (Cancel)
          </button>
          <button
            onClick={handleSend}
            disabled={!transcript.trim()}
            className={`flex-1 py-2.5 px-4 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              transcript.trim()
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-sm cursor-pointer'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <span>Bhejein (Send)</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
