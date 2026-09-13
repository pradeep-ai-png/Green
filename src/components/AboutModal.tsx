import React from 'react';
import { X, ShieldCheck, Heart, Sparkles, Mic, Volume2, Database, Code } from 'lucide-react';
import { GreenStepLogo } from './GreenStepLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
        {/* Decorative Top Banner */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-2">
            <div className="bg-white/95 p-3 rounded-2xl shadow-md">
              <GreenStepLogo size="md" showSubtitle={false} />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Green Step AI</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-0.5 font-medium">
            Small Steps • Big Change
          </p>

          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-400/30 text-xs font-semibold text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Owner & Creator: Green Step Team</span>
          </div>
        </div>

        {/* Details List */}
        <div className="p-6 space-y-4 text-sm text-slate-700 max-h-[60vh] overflow-y-auto">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-start gap-3">
            <Heart className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Green Step Team ka AI</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Green Step AI ka nirman aur ownership <strong>Green Step Team</strong> ke paas hai. Yeh har prakar ke prashnon ka uttar dene me saksham hai — Coding, Shiksha, Vigyaan, aur Dainik Samasyaayein.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
              <Mic className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 font-semibold">Voice Search</strong>
                <span className="text-slate-500">Awaaz me bole aur turant uttar paayein (Hindi/English).</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
              <Volume2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 font-semibold">Smooth Female Voice</strong>
                <span className="text-slate-500">Emotional, friendly aur line-by-line padhne wali awaaz.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
              <Database className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 font-semibold">Free Multiple Chat Save</strong>
                <span className="text-slate-500">Aapki sabhi purani chats bina kisi charges ke save rehti hain.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 font-semibold">Security & Source Code</strong>
                <span className="text-slate-500">Green Step ka internal source code secure aur safe rehta hai.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
              <Code className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 font-semibold">Code Silent Protection</strong>
                <span className="text-slate-500">Code screen par aayega par awaaz me use padha nahi jayega.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm shadow-xs transition-colors"
          >
            Theek Hai (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
