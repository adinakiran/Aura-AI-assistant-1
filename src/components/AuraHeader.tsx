import React from 'react';
import { Mic, Search, Radio, Music, Download, Mail } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface AuraHeaderProps {
  currentTab: 'briefing' | 'mail' | 'agenda' | 'assistant';
  userEmail?: string;
  userName?: string;
  onLiveVoiceClick: () => void;
  onTranscribeClick: () => void;
  onMusicStudioClick: () => void;
  onDownloadClick: () => void;
  onEmailClick: () => void;
  onAvatarClick?: () => void;
}

export const AuraHeader: React.FC<AuraHeaderProps> = ({
  currentTab,
  userEmail = 'adinakiran2003@gmail.com',
  userName = 'Adina',
  onLiveVoiceClick,
  onTranscribeClick,
  onMusicStudioClick,
  onDownloadClick,
  onEmailClick,
  onAvatarClick,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'briefing':
        return 'Briefing';
      case 'mail':
        return 'Mail';
      case 'agenda':
        return 'Agenda';
      case 'assistant':
        return 'Assistant';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 py-2.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand & Tab indicator */}
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full bg-[#061021] flex items-center justify-center p-1 shadow-sm border border-cyan-500/30 shrink-0">
            {/* Inner pin emblem */}
            <svg viewBox="0 0 512 512" className="w-full h-full" fill="none">
              <circle cx="256" cy="256" r="230" fill="#061021" />
              <path
                d="M 256 110 C 192 110, 142 160, 142 226 C 142 292, 220 376, 256 404 C 292 376, 370 292, 370 226 C 370 160, 320 110, 256 110 Z"
                fill="#0ea5e9"
              />
              <circle cx="256" cy="230" r="46" fill="#ffffff" />
              <rect x="206" y="328" width="100" height="16" rx="8" fill="#38bdf8" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-white animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm tracking-tight">Aura</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-cyan-50 text-cyan-600 border border-cyan-200">
                <span className="w-1 h-1 rounded-full bg-cyan-500" />
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 -mt-0.5">
              {getTabTitle()}
            </p>
          </div>
        </div>

        {/* Feature Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Configure Email button */}
          <button
            onClick={onEmailClick}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-cyan-100 text-slate-700 hover:text-cyan-800 transition-colors flex items-center gap-1 text-[11px] font-bold px-2 border border-slate-200"
            title={`Configure monitored email: ${userEmail}`}
          >
            <Mail className="w-3.5 h-3.5 text-cyan-700" />
            <span className="hidden sm:inline max-w-[80px] truncate">{userName || userEmail.split('@')[0]}</span>
          </button>

          {/* Live Voice button (gemini-3.8-live) */}
          <button
            onClick={onLiveVoiceClick}
            className="p-1.5 rounded-full bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 shadow-2xs transition-colors flex items-center gap-1 text-[11px] font-bold px-2"
            title="Live Voice Conversation (gemini-3.8-live)"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
            <span className="hidden sm:inline">Live</span>
          </button>

          {/* Music Studio button (lyria-3-clip-preview) */}
          <button
            onClick={onMusicStudioClick}
            className="p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors"
            title="Generate Focus Music (Lyria Clip)"
          >
            <Music className="w-3.5 h-3.5" />
          </button>

          {/* Transcribe audio button (gemini-3.5-transcribe) */}
          <button
            onClick={onTranscribeClick}
            className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Transcribe Audio (gemini-3.5-transcribe)"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>

          {/* Download App button */}
          <button
            onClick={onDownloadClick}
            className="p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1 px-2.5"
            title="Download App URL & Package"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[10px]">App</span>
          </button>

          {/* Avatar Profile */}
          <button
            onClick={onAvatarClick}
            className="relative ml-0.5 group focus:outline-none"
            title={`${userName} (${userEmail})`}
          >
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
              alt={userName}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-cyan-500 transition-all shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
};
