import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  Clock, 
  Send, 
  Eye, 
  UserPlus, 
  Check, 
  HelpCircle, 
  FileText, 
  Paperclip, 
  Trash2, 
  Layers, 
  CheckCircle2,
  Undo2
} from 'lucide-react';
import { EmailItem } from '../data/mockData';

interface MailTabProps {
  emails: EmailItem[];
  userEmail?: string;
  onConfigureEmail?: () => void;
  onApproveEmail: (id: string) => void;
  onReviewFull: (email: EmailItem) => void;
  onDelegateEmail: (id: string, assignee: string) => void;
  onCleanNewsletters: () => void;
  newslettersCleaned: boolean;
}

export const MailTab: React.FC<MailTabProps> = ({
  emails,
  userEmail = 'adinakiran2003@gmail.com',
  onConfigureEmail,
  onApproveEmail,
  onReviewFull,
  onDelegateEmail,
  onCleanNewsletters,
  newslettersCleaned,
}) => {
  const [activeCategory, setActiveCategory] = useState<'priority' | 'action' | 'newsletters'>('priority');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredEmails = emails.filter((item) => {
    if (activeCategory === 'priority') return item.category === 'priority';
    if (activeCategory === 'action') return item.category === 'action';
    return item.category === 'newsletter';
  });

  return (
    <div className="pb-32 pt-2 px-4 max-w-md mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AI Triage Digest Header Card */}
      <div className="rounded-3xl bg-gradient-to-b from-[#e8f1fc] via-[#edf4fd] to-white border border-[#d2e4f8] p-4.5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-1 text-[11px] font-bold text-cyan-800 uppercase tracking-wider hover:text-cyan-900">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>AI TRIAGE DIGEST</span>
          </button>
          <span className="text-[11px] text-slate-500 font-medium">Updated 2m ago</span>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-cyan-500/40 p-1 shrink-0 shadow-sm relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/30 to-purple-600/30 animate-pulse" />
            <Sparkles className="w-6 h-6 text-cyan-400 relative z-10" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-snug">
              Aura scanned <span className="text-cyan-700 font-extrabold">42 unread messages</span>.
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-slate-600 truncate max-w-[200px]">
                Monitored: <strong className="text-cyan-900">{userEmail}</strong>
              </span>
              {onConfigureEmail && (
                <button
                  type="button"
                  onClick={onConfigureEmail}
                  className="text-[10px] font-bold text-cyan-700 hover:text-cyan-900 underline"
                >
                  Change
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              3 require your direct decision today before your 11:30 AM executive briefing.
            </p>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2 rounded-2xl bg-white border border-slate-200/90 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">CRITICAL</span>
            <span className="text-xs font-bold text-rose-600">1 urgent</span>
          </div>

          <div className="p-2 rounded-2xl bg-white border border-slate-200/90 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">DECISIONS</span>
            <span className="text-xs font-bold text-cyan-800">2 actions</span>
          </div>

          <div className="p-2 rounded-2xl bg-white border border-slate-200/90 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">INBOX NOISE</span>
            <span className="text-xs font-bold text-cyan-600">-64% cut</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setActiveCategory('priority')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeCategory === 'priority'
              ? 'bg-[#0a4b64] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>AI Priority</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            activeCategory === 'priority' ? 'bg-cyan-500/30 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            3
          </span>
        </button>

        <button
          onClick={() => setActiveCategory('action')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeCategory === 'action'
              ? 'bg-[#0a4b64] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>Action Required</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            activeCategory === 'action' ? 'bg-cyan-500/30 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            5
          </span>
        </button>

        <button
          onClick={() => setActiveCategory('newsletters')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeCategory === 'newsletters'
              ? 'bg-[#0a4b64] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Newsletters</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            activeCategory === 'newsletters' ? 'bg-cyan-500/30 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            18
          </span>
        </button>
      </div>

      {/* Emails Stream */}
      <div className="space-y-3.5">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            className="rounded-3xl bg-white border border-slate-200/90 p-4 shadow-xs space-y-3 transition-all hover:border-cyan-300"
          >
            {/* Sender row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={email.avatarUrl}
                  alt={email.sender}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900">{email.sender}</h3>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">{email.senderRole}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">{email.senderEmail}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-[11px] font-semibold text-rose-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>{email.time}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{email.impactTag}</span>
              </div>
            </div>

            {/* Email Subject */}
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              {email.subject}
            </h4>

            {/* Aura Digest Subcard */}
            <div className="rounded-2xl bg-[#eef5fc] border border-cyan-100 p-3 text-xs text-slate-700 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-900">
                <div className="flex items-center gap-1">
                  <span className="text-cyan-600 font-bold">⚡</span>
                  <span>{email.digestType}</span>
                </div>
                {email.digestDeadline && (
                  <span className="text-cyan-800 bg-cyan-100 px-2 py-0.2 rounded-full font-bold text-[10px]">
                    {email.digestDeadline}
                  </span>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed pt-0.5">
                {email.digestSummary}
              </p>
            </div>

            {/* Attachment preview if present */}
            {email.attachment && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-cyan-600" />
                  <span className="font-medium text-slate-800">{email.attachment.name}</span>
                  <span className="text-slate-400">({email.attachment.size})</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              {email.status === 'approved' ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approved & Draft Dispatched</span>
                </div>
              ) : email.status === 'delegated' ? (
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-purple-200">
                  <UserPlus className="w-4 h-4" />
                  <span>Delegated to Sarah Lin</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onApproveEmail(email.id);
                      showToast(`Dispatched response to ${email.sender}`);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#094c63] hover:bg-[#07394b] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{email.primaryActionLabel}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {email.secondaryActionLabel && (
                      <button
                        onClick={() => onReviewFull(email)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{email.secondaryActionLabel}</span>
                      </button>
                    )}

                    {email.tertiaryActionLabel && (
                      <button
                        onClick={() => {
                          onDelegateEmail(email.id, 'Sarah');
                          showToast('Delegated to Sarah with executive context notes');
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-purple-200/60"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{email.tertiaryActionLabel}</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Quick Triage Floating Footer Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-3 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Trash2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">AI Quick Triage</h4>
            <p className="text-[11px] text-slate-500">
              {newslettersCleaned ? '18 newsletters archived safely' : 'Batch archive 18 newsletters...'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onCleanNewsletters();
            showToast('Archived 18 newsletter promos');
          }}
          disabled={newslettersCleaned}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm transition-all ${
            newslettersCleaned
              ? 'bg-slate-200 text-slate-500 cursor-default'
              : 'bg-purple-700 hover:bg-purple-800 text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{newslettersCleaned ? 'Cleaned' : '1-Tap Clean'}</span>
        </button>
      </div>
    </div>
  );
};
