import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  FolderArchive,
  ChevronLeft
} from 'lucide-react';
import { ChatSession } from '../types';
import { GreenStepLogo } from './GreenStepLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onClearAll: () => void;
  onOpenAbout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onClearAll,
  onOpenAbout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditingTitle(session.title);
  };

  const submitRename = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editingTitle.trim()) {
      onRenameSession(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 sm:w-80 bg-slate-900 text-slate-200 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header / Branding */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GreenStepLogo size="sm" showSubtitle={false} />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-white text-base tracking-tight">Green Step</span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/50">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Green Step Team</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Sidebar band karein"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Action: New Chat */}
        <div className="p-3 border-b border-slate-800/60">
          <button
            id="btn-new-chat"
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full py-2.5 px-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Nayi Baatcheet (New Chat)</span>
          </button>
        </div>

        {/* Search Saved Chats */}
        <div className="px-3 pt-3 pb-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chat khojein..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-800/90 text-slate-200 placeholder-slate-400 border border-slate-700/60 focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Saved Chats Title & Count */}
        <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold tracking-wider uppercase text-[11px] text-slate-300">
            Aapki Saved Chats ({filteredSessions.length})
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
            Free Save
          </span>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
          {filteredSessions.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-slate-400">
              <FolderArchive className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              {searchQuery ? 'Koi chat nahi mili.' : 'Abhi tak koi purani chat nahi hai.'}
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === currentSessionId;
              const isEditing = editingId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 font-medium border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                    <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    
                    {isEditing ? (
                      <form
                        onSubmit={(e) => submitRename(session.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 flex-1"
                      >
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          autoFocus
                          className="w-full bg-slate-950 px-2 py-0.5 text-xs text-white rounded border border-emerald-500 focus:outline-hidden"
                        />
                        <button type="submit" className="p-1 text-emerald-400 hover:text-emerald-300">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1 text-slate-400 hover:text-slate-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <span className="truncate">{session.title}</span>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => startRename(session, e)}
                        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/60"
                        title="Naam badlein (Rename)"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700/60"
                        title="Chat delete karein"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info: Malik & Clear Chats */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-xs space-y-2">
          <button
            onClick={onOpenAbout}
            className="w-full py-2 px-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-300 flex items-center justify-between text-xs transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Owner: <strong>Green Step Team</strong></span>
            </div>
            <span className="text-[10px] text-emerald-400">Janiye</span>
          </button>

          {sessions.length > 1 && (
            <button
              onClick={onClearAll}
              className="w-full py-1.5 px-2 text-[11px] text-slate-400 hover:text-rose-400 transition-colors text-center"
            >
              Sabhi chat saaf karein (Clear all)
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
