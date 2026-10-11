import React, { useState, useEffect, useRef } from 'react';
import { 
  CloudSun, 
  Sparkles, 
  Play, 
  Pause, 
  Clock, 
  FileText, 
  Send, 
  Video, 
  Share2, 
  BookOpen, 
  Moon, 
  Calendar, 
  Bell, 
  Mic, 
  ArrowUp, 
  Mail, 
  Paperclip,
  Check,
  ChevronRight
} from 'lucide-react';

interface BriefingTabProps {
  onNavigateTab: (tab: 'briefing' | 'mail' | 'agenda' | 'assistant') => void;
  onOpenDeckReview: () => void;
  onJoinMeeting: (title: string) => void;
  onExecutivePrompt: (prompt: string) => void;
  urgentEmailsCount: number;
  userName?: string;
  userEmail?: string;
  onLiveVoiceClick?: () => void;
  onMusicStudioClick?: () => void;
  onTranscribeClick?: () => void;
  onDownloadClick?: () => void;
  onEmailClick?: () => void;
}

export const BriefingTab: React.FC<BriefingTabProps> = ({
  onNavigateTab,
  onOpenDeckReview,
  onJoinMeeting,
  onExecutivePrompt,
  urgentEmailsCount,
  userName = 'Adina',
  userEmail = 'adinakiran2003@gmail.com',
  onLiveVoiceClick,
  onMusicStudioClick,
  onTranscribeClick,
  onDownloadClick,
  onEmailClick,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [davidDeckApproved, setDavidDeckApproved] = useState(false);
  const [focusAdjusted, setFocusAdjusted] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Audio briefing narrator using Web Speech API
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Good morning, ${userName}. Your day is 78 percent scheduled. Key focus is securing the Board Deck approval with David Vance before noon. You have a 90-minute protected focus block carved out this afternoon.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 4000);
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    onExecutivePrompt(promptInput.trim());
    setPromptInput('');
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Date & Greeting Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            THURSDAY, OCT 24
          </div>
          {onEmailClick && (
            <button
              onClick={onEmailClick}
              className="text-[10px] font-bold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 px-2 py-0.5 rounded-full transition-colors flex items-center gap-1"
              title="Change email configuration"
            >
              <span>✉ {userEmail}</span>
            </button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {userName}
          </h1>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-xs">
            <CloudSun className="w-3.5 h-3.5 text-amber-500" />
            <span>64°F • Clear</span>
          </div>
        </div>
      </div>

      {/* Aura Executive Digest Card */}
      <div className="rounded-3xl bg-gradient-to-b from-[#e8f1fc] via-[#edf4fd] to-white border border-[#d2e4f8] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-900">
              AURA EXECUTIVE DIGEST
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Updated 6m ago</span>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-1.5">
            Your day is 78% scheduled
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Key focus is securing the Board Deck approval before noon. You have a 90-minute protected focus buffer carved out for deep strategy work this afternoon.
          </p>
        </div>

        {/* Audio Summary Card */}
        <div className="rounded-2xl bg-white/90 border border-cyan-100 p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleAudio}
              className="w-10 h-10 rounded-full bg-[#0a4b64] hover:bg-[#073b4f] text-white flex items-center justify-center shadow-md transition-all active:scale-95 shrink-0"
              title="Play briefing audio"
            >
              {isPlayingAudio ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>
            <div>
              <p className="text-xs font-bold text-slate-900">Listen to 2-min Audio Summary</p>
              <p className="text-[11px] text-slate-500">Narrated by Aura Studio Voice</p>
            </div>
          </div>

          {/* Equalizer animation */}
          <div className="flex items-end gap-1 h-5 px-2">
            {[40, 75, 55, 95, 60, 30].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full bg-cyan-600 transition-all duration-300 ${
                  isPlayingAudio ? 'animate-pulse' : 'opacity-40'
                }`}
                style={{ height: isPlayingAudio ? `${h}%` : '25%' }}
              />
            ))}
          </div>
        </div>

        {/* 3 Quick Stats Pills */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => onNavigateTab('mail')}
            className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-center hover:border-rose-300 transition-all group"
          >
            <div className="flex items-center justify-center gap-1.5 text-rose-600 text-xs font-bold mb-0.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping opacity-75" />
              <span>{urgentEmailsCount}</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-600 group-hover:text-slate-900">Urgent Emails</p>
          </button>

          <button
            onClick={() => onNavigateTab('agenda')}
            className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-center hover:border-cyan-300 transition-all group"
          >
            <div className="flex items-center justify-center gap-1 text-cyan-700 text-xs font-bold mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
              <span>4</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-600 group-hover:text-slate-900">Meetings Today</p>
          </button>

          <button
            onClick={() => onNavigateTab('assistant')}
            className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-center hover:border-violet-300 transition-all group"
          >
            <div className="flex items-center justify-center gap-1 text-violet-700 text-xs font-bold mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
              <span>2</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-600 group-hover:text-slate-900">Action Items Due</p>
          </button>
        </div>
      </div>

      {/* PRIORITY ATTENTION NOW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-rose-600 font-bold text-sm">!</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              PRIORITY ATTENTION NOW
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">2 Urgent</span>
        </div>

        {/* Item 1: David Vance */}
        <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="David Vance"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">David Vance</h4>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    By 11:30 AM
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Board Deck Approval needed</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600">
              <Clock className="w-3.5 h-3.5" />
              <span>1h left</span>
            </div>
          </div>

          {/* Subcard with Deck highlight */}
          <div className="rounded-2xl bg-[#eef5fc] border border-cyan-100 p-3 flex items-center justify-between text-xs text-slate-700">
            <span className="text-slate-700 font-medium">Deck v4.2 highlights 18% ARR growth in Europe.</span>
            <Paperclip className="w-3.5 h-3.5 text-cyan-600 shrink-0 ml-2" />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenDeckReview}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#094c63] hover:bg-[#07394b] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{davidDeckApproved ? 'Deck Approved ✓' : 'Review Draft'}</span>
            </button>
            <button
              onClick={() => onExecutivePrompt("Forward David Vance's slide 12 draft to Sarah Lin for quick review")}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Share / Delegate"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Item 2: Product Strategy Sync */}
        <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Product Strategy Sync</h4>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-semibold">
                    In 45 mins
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-1.5 py-0.2 rounded-full border border-violet-200">
                    ‹ Prep Ready
                  </span>
                  <p className="text-xs text-slate-500 truncate">with Elena Rostova (VP of Product)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Aura Prep Briefing Subcard */}
          <div className="rounded-2xl bg-[#eef5fc] border border-cyan-100 p-3 text-xs text-slate-700 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-900">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-600" />
                <span>Aura Prep Briefing</span>
              </div>
              <span className="text-slate-400 font-normal">3 bullet summary</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Elena requested sign-off on AI roadmap restructuring and headcount reallocation for Q1.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onExecutivePrompt("Show Elena's headcount spreadsheet and notes for Product Strategy Sync")}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>View Notes</span>
            </button>
            <button
              onClick={() => onJoinMeeting('Product Strategy & Roadmap Sync')}
              className="py-2.5 px-5 rounded-xl bg-[#094c63] hover:bg-[#07394b] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Join</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI SUGGESTED FOCUS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Moon className="w-4 h-4 text-violet-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              AI SUGGESTED FOCUS
            </h3>
          </div>
          <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
            PROTECTED FLOW
          </span>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <span className="font-bold text-base leading-none">⊖</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Focus Block: 2:00 PM – 3:30 PM
                </h4>
                <p className="text-xs text-slate-500">Reserved for Q4 Strategic Planning</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold">
              90 Mins
            </span>
          </div>

          {/* Conflict resolution subcard */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 flex items-center gap-2.5 text-xs text-slate-600">
            <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Rescheduled conflicting low-priority vendor demo to Friday at 10 AM.</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-slate-400" />
              <span>Slack & Email muted during block</span>
            </div>
            <button
              onClick={() => {
                setFocusAdjusted(!focusAdjusted);
                onExecutivePrompt("Adjust my 2:00 PM focus block to 45 minutes and unmute notifications");
              }}
              className="text-cyan-700 font-bold hover:text-cyan-800 flex items-center gap-0.5"
            >
              <span>{focusAdjusted ? 'Adjusted' : 'Adjust'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* EXECUTIVE CO-PILOT INPUT */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Mic className="w-3.5 h-3.5 text-cyan-600" />
          <span>EXECUTIVE CO-PILOT</span>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-3 shadow-sm space-y-2.5">
          <form onSubmit={handleSubmitPrompt} className="relative flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#0a4b64] text-white flex items-center justify-center shrink-0 shadow-xs mr-2">
              <Mic className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Ask Aura anything about your day..."
              className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none pr-8 font-medium"
            />
            <button
              type="submit"
              className="p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick prompt chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {onLiveVoiceClick && (
              <button
                type="button"
                onClick={onLiveVoiceClick}
                className="px-3 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>🎙️ Live Voice (3.8)</span>
              </button>
            )}

            {onMusicStudioClick && (
              <button
                type="button"
                onClick={onMusicStudioClick}
                className="px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>🎵 Focus Music (Lyria)</span>
              </button>
            )}

            {onTranscribeClick && (
              <button
                type="button"
                onClick={onTranscribeClick}
                className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>📝 Transcribe (3.5)</span>
              </button>
            )}

            <button
              onClick={() => onExecutivePrompt("Summarize today's emails")}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Summarize today's emails</span>
            </button>
            <button
              onClick={() => onExecutivePrompt("Draft decline for 4pm Sarah Lin session")}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Draft decline for 4pm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
