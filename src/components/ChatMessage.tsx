import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Sparkles, 
  User, 
  Code2, 
  Share2,
  Volume1
} from 'lucide-react';
import { Message } from '../types';
import { GreenStepLogo } from './GreenStepLogo';

interface ChatMessageProps {
  message: Message;
  isCurrentlySpeaking: boolean;
  activeSpokenText?: string;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentlySpeaking,
  activeSpokenText,
  onSpeak,
  onStopSpeak,
}) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [copiedFull, setCopiedFull] = useState(false);

  const isModel = message.role === 'model';

  const handleCopyText = async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (typeof index === 'number') {
        setCopiedCodeIndex(index);
        setTimeout(() => setCopiedCodeIndex(null), 2000);
      } else {
        setCopiedFull(true);
        setTimeout(() => setCopiedFull(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      id={`message-${message.id}`}
      className={`group w-full py-4 px-3 sm:px-6 transition-colors duration-200 ${
        isModel ? 'bg-white border-y border-emerald-50/60' : 'bg-slate-50/70'
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          {isModel ? (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 flex items-center justify-center shadow-xs">
              <GreenStepLogo size="sm" showSubtitle={false} />
            </div>
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5 text-slate-200" />
            </div>
          )}
        </div>

        {/* Content Box */}
        <div className="flex-1 min-w-0">
          {/* Header info */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm sm:text-base text-slate-800">
                {isModel ? 'Green Step' : 'Aap'}
              </span>
            </div>

            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="text-[11px] text-slate-400">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

              {/* Action buttons */}
              {isModel && (
                <div className="flex items-center ml-2 space-x-1">
                  {isCurrentlySpeaking ? (
                    <button
                      id={`btn-stop-speak-${message.id}`}
                      onClick={onStopSpeak}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1 text-xs"
                      title="Awaaz rokein (Stop speaking)"
                    >
                      <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                      <span className="hidden sm:inline font-medium">Rokey</span>
                    </button>
                  ) : (
                    <button
                      id={`btn-speak-${message.id}`}
                      onClick={() => onSpeak(message.content)}
                      className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors flex items-center gap-1 text-xs"
                      title="Female voice me sunein (Listen aloud line by line)"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Sunein</span>
                    </button>
                  )}

                  <button
                    id={`btn-copy-${message.id}`}
                    onClick={() => handleCopyText(message.content)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Poora message copy karein"
                  >
                    {copiedFull ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active Speaking Indicator Banner */}
          {isModel && isCurrentlySpeaking && (
            <div className="mb-2.5 p-2 bg-emerald-50/90 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-900 animate-fadeIn">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold">Awaaz me padha ja raha hai:</span>
              <span className="truncate italic text-emerald-800">
                "{activeSpokenText || 'Bol rahe hain...'}"
              </span>
            </div>
          )}

          {/* Markdown Content */}
          <div className="text-slate-800 text-sm sm:text-base leading-relaxed break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="pl-1">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-emerald-500 pl-3 italic text-slate-600 my-2 bg-emerald-50/40 py-1 rounded-r">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3 border border-slate-200 rounded-lg">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="bg-slate-100 px-3 py-2 text-left font-semibold text-slate-700">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 border-t border-slate-100 text-slate-700">{children}</td>
                ),
                code: ({ node, inline, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');

                  if (!inline && (match || codeString.includes('\n') || codeString.length > 40)) {
                    const lang = match ? match[1] : 'code';
                    const codeIndex = Math.floor(Math.random() * 100000);

                    return (
                      <div className="my-3.5 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 text-slate-100 shadow-md">
                        {/* Code Header with copy & TTS note */}
                        <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs">
                          <div className="flex items-center gap-2">
                            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="font-mono uppercase font-medium text-emerald-400">
                              {lang}
                            </span>
                            <span className="text-[10px] text-slate-400 hidden sm:inline">
                              (Code voice me nahi padha jayega)
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopyText(codeString, codeIndex)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
                            title="Code copy karein"
                          >
                            {copiedCodeIndex === codeIndex ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-medium">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                        {/* Code Body */}
                        <pre className="p-3.5 overflow-x-auto text-xs sm:text-sm font-mono leading-normal">
                          <code className={className} {...props}>
                            {codeString}
                          </code>
                        </pre>
                      </div>
                    );
                  }

                  return (
                    <code
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-emerald-800 font-mono text-xs sm:text-sm border border-slate-200/80 font-medium"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};
