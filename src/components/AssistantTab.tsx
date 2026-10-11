import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  Edit3, 
  Undo2, 
  CheckCircle2, 
  SlidersHorizontal, 
  MessageSquare, 
  BookOpen, 
  ChevronRight,
  ArrowUp,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ChatMessage } from '../data/mockData';
import { speechService } from '../services/speech';

interface AssistantTabProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSendDraft: (msgId: string) => void;
  onUndoCalendar: (msgId: string) => void;
  onQuickPrompt: (prompt: string) => void;
  isProcessing?: boolean;
  onOpenTranscribe?: () => void;
  onOpenLiveVoice?: () => void;
}

export const AssistantTab: React.FC<AssistantTabProps> = ({
  messages,
  onSendMessage,
  onSendDraft,
  onUndoCalendar,
  onQuickPrompt,
  isProcessing = false,
  onOpenTranscribe,
  onOpenLiveVoice,
}) => {
  const [inputText, setInputText] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleVoiceToggle = () => {
    // If Web Speech Recognition is available, start it
    const windowWithSpeech = window as unknown as {
      webkitSpeechRecognition?: new () => {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onstart: () => void;
        onresult: (e: { results: Array<Array<{ transcript: string }>> }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
      SpeechRecognition?: new () => {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onstart: () => void;
        onresult: (e: { results: Array<Array<{ transcript: string }>> }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
    };
    const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (SpeechRecognition) {
      if (isVoiceRecording) {
        setIsVoiceRecording(false);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsVoiceRecording(true);
        recognition.onresult = (event: { results: Array<Array<{ transcript: string }>> }) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            onSendMessage(transcript);
          }
          setIsVoiceRecording(false);
        };
        recognition.onerror = () => setIsVoiceRecording(false);
        recognition.onend = () => setIsVoiceRecording(false);
        recognition.start();
      } catch {
        setIsVoiceRecording(false);
      }
    } else {
      // Toggle simulation
      setIsVoiceRecording(true);
      setTimeout(() => {
        setIsVoiceRecording(false);
        onSendMessage("Summarize today's executive priorities");
      }, 2500);
    }
  };

  return (
    <div className="pb-36 pt-2 px-4 max-w-md mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Live Context Sync Header Chip */}
      <div className="rounded-2xl bg-gradient-to-r from-[#eaf2fd] to-[#eff5fe] border border-cyan-200/80 p-2.5 flex items-center justify-between text-xs shadow-xs">
        <div className="flex items-center gap-2 text-slate-700 font-medium truncate pr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="truncate">
            <span className="font-bold text-slate-900 block truncate">Oct 24 Schedule & Active Inboxes</span>
            <span className="text-[10px] text-slate-500 block truncate">Live Context Sync • 4 apps connected</span>
          </div>
        </div>

        <button className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 hover:bg-slate-50 shrink-0 shadow-2xs">
          <span>Scope</span>
          <SlidersHorizontal className="w-3 h-3 text-cyan-600" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-3">
            {msg.sender === 'user' ? (
              /* User Bubble */
              <div className="flex items-end justify-end gap-2">
                <div className="max-w-[85%] rounded-3xl rounded-br-xs bg-[#c9e6fc] border border-cyan-300/80 p-3.5 text-xs text-slate-900 shadow-xs font-medium space-y-1">
                  <p className="leading-relaxed">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500">
                    <span>{msg.time}</span>
                    <span className="text-cyan-700 font-bold">✓✓</span>
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80"
                  alt="Maya"
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-200 shrink-0"
                />
              </div>
            ) : (
              /* Aura Assistant Message */
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#0a4b64] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                </div>

                <div className="flex-1 space-y-3 max-w-[92%]">
                  {/* Text bubble with listen button */}
                  <div className="rounded-3xl rounded-tl-xs bg-white border border-slate-200/90 p-3.5 text-xs text-slate-800 shadow-xs leading-relaxed font-medium flex items-start justify-between gap-2">
                    <p className="flex-1">{msg.text}</p>
                    <button
                      type="button"
                      onClick={() => speechService.speak(msg.text, { force: true })}
                      className="p-1 rounded-full text-slate-400 hover:text-cyan-700 hover:bg-cyan-50 shrink-0 transition-colors"
                      title="Speak response aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Draft Ready For Review Card */}
                  {msg.draftCard && (
                    <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center">
                            <span className="font-bold text-xs">✉</span>
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-900">
                            DRAFT READY FOR REVIEW
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Confidence {msg.draftCard.confidence}%
                        </span>
                      </div>

                      {/* Header details */}
                      <div className="text-xs space-y-1 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-medium">To:</span>
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80"
                            alt="David"
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="font-bold text-slate-900">{msg.draftCard.to}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-slate-400 font-medium">Subject:</span>
                          <span className="font-semibold text-slate-700 truncate">{msg.draftCard.subject}</span>
                        </div>
                      </div>

                      {/* Draft content */}
                      <div className="rounded-2xl bg-[#f7faff] border border-cyan-100/80 p-3.5 text-xs text-slate-800 italic leading-relaxed space-y-2">
                        <p>{msg.draftCard.body}</p>
                        <div className="flex items-center gap-1 text-[11px] text-cyan-800 not-italic font-semibold pt-1 border-t border-cyan-100">
                          <span>🪄</span>
                          <span>{msg.draftCard.source}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        {msg.draftCard.status === 'sent' ? (
                          <div className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approved & Sent to David</span>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => onSendDraft(msg.id)}
                              className="flex-1 py-2.5 px-4 rounded-xl bg-[#094c63] hover:bg-[#07394b] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Send Now</span>
                            </button>
                            <button
                              onClick={() => onQuickPrompt("Edit drafted response to include +2% margin cushion")}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Draft</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Calendar Automated Card */}
                  {msg.calendarCard && (
                    <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-xs">
                            📅
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900">
                            CALENDAR AUTOMATED
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500">Auto-synced</span>
                      </div>

                      <div className="rounded-2xl bg-purple-50/60 border border-purple-100 p-3 flex items-start gap-3">
                        <div className="px-2 py-1 rounded-xl bg-white border border-purple-200 text-center shrink-0">
                          <span className="text-[9px] font-bold text-purple-600 block">FRI</span>
                          <span className="text-sm font-extrabold text-slate-900 block leading-tight">25</span>
                        </div>
                        <div className="text-xs space-y-0.5">
                          <h4 className="font-bold text-slate-900">{msg.calendarCard.title}</h4>
                          <p className="text-slate-600 leading-relaxed text-[11px]">{msg.calendarCard.details}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center gap-1 text-slate-600 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{msg.calendarCard.status}</span>
                        </div>
                        {!msg.calendarCard.undone && (
                          <button
                            onClick={() => onUndoCalendar(msg.id)}
                            className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 text-xs"
                          >
                            <Undo2 className="w-3.5 h-3.5" />
                            <span>Undo Changes</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-slate-500 p-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-cyan-600 animate-spin" />
            <span>Aura is synchronizing across Gmail and Calendar...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* SUGGESTED NEXT STEPS */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
          <span>SUGGESTED NEXT STEPS</span>
          <button className="text-cyan-700 hover:text-cyan-800 flex items-center gap-0.5 font-bold">
            <span>More</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => onQuickPrompt("Summarize unread Slack threads")}
            className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200/90 hover:border-cyan-300 text-slate-700 text-xs font-semibold shrink-0 flex items-center gap-2 shadow-2xs transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
            <span>Summarize unread Slack threads</span>
          </button>

          <button
            onClick={() => onQuickPrompt("Prepare briefing for 11:30 AM Series B session")}
            className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200/90 hover:border-cyan-300 text-slate-700 text-xs font-semibold shrink-0 flex items-center gap-2 shadow-2xs transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-violet-600" />
            <span>Prepare briefing...</span>
          </button>
        </div>
      </div>

      {/* Floating Bottom Input Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 px-4">
        <div className="max-w-md mx-auto rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-3 shadow-lg space-y-2">
          {/* Status Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-600" />
              <span>AURA READY</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const next = !speechService.getAutoSpeak();
                  speechService.setAutoSpeak(next);
                  if (!next) speechService.stop();
                }}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1"
                title="Toggle Aura voice auto-speaking"
              >
                <span>Voice:</span>
                <span className="text-cyan-700 font-extrabold">{speechService.getAutoSpeak() ? 'ON' : 'OFF'}</span>
              </button>

              {onOpenLiveVoice && (
                <button
                  type="button"
                  onClick={onOpenLiveVoice}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 hover:bg-cyan-200 transition-colors"
                >
                  Live 3.8
                </button>
              )}
              {/* Audio Waveform Indicators */}
              <div className="flex items-center gap-0.5 h-3">
                {[60, 90, 45, 100, 70].map((h, i) => (
                  <span
                    key={i}
                    className={`w-0.5 rounded-full transition-all ${
                      isVoiceRecording ? 'bg-rose-500 animate-pulse' : 'bg-cyan-700'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-[#eef5fc] rounded-2xl px-3.5 py-2.5 border border-cyan-100 focus-within:border-cyan-400 focus-within:bg-white transition-colors">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message Aura or tap mic..."
                className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
              />
            </div>

            {/* Mic / Transcribe Button */}
            <button
              type="button"
              onClick={onOpenTranscribe || handleVoiceToggle}
              className={`p-2.5 rounded-2xl transition-colors ${
                isVoiceRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200'
              }`}
              title="Transcribe Audio with gemini-3.5-transcribe"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-2xl bg-[#094c63] hover:bg-[#07394b] disabled:opacity-40 text-white shadow-xs transition-all active:scale-95"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
