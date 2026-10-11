/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuraHeader } from './components/AuraHeader';
import { BottomNavBar } from './components/BottomNavBar';
import { BriefingTab } from './components/BriefingTab';
import { MailTab } from './components/MailTab';
import { AgendaTab } from './components/AgendaTab';
import { AssistantTab } from './components/AssistantTab';
import { DeckPreviewModal } from './components/DeckPreviewModal';
import { MeetingCallModal } from './components/MeetingCallModal';
import { BriefingDrawerModal } from './components/BriefingDrawerModal';
import { ProfileDrawerModal } from './components/ProfileDrawerModal';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { MusicStudioModal } from './components/MusicStudioModal';
import { AudioTranscribeModal } from './components/AudioTranscribeModal';
import { DownloadAppModal } from './components/DownloadAppModal';
import { AccountEmailModal } from './components/AccountEmailModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { 
  INITIAL_EMAILS, 
  INITIAL_AGENDA, 
  INITIAL_MESSAGES, 
  EmailItem, 
  AgendaEvent, 
  ChatMessage 
} from './data/mockData';
import { askAura } from './services/gemini';
import { speechService } from './services/speech';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'briefing' | 'mail' | 'agenda' | 'assistant'>('briefing');
  const [emails, setEmails] = useState<EmailItem[]>(INITIAL_EMAILS);
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>(INITIAL_AGENDA);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [newslettersCleaned, setNewslettersCleaned] = useState<boolean>(false);
  const [financeSlotAdded, setFinanceSlotAdded] = useState<boolean>(false);
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);

  // Modals
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [meetingCallTitle, setMeetingCallTitle] = useState<string | null>(null);
  const [briefingEvent, setBriefingEvent] = useState<AgendaEvent | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);
  const [isMusicStudioOpen, setIsMusicStudioOpen] = useState(false);
  const [isTranscribeOpen, setIsTranscribeOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isAccountEmailOpen, setIsAccountEmailOpen] = useState(false);

  // User Profile & Email Account state
  const [userEmail, setUserEmail] = useState<string>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('aura_user_email')) || 'adinakiran2003@gmail.com';
  });
  const [userName, setUserName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('aura_user_name');
      if (stored && stored !== 'Kiran' && stored !== 'Maya') {
        return stored;
      }
      localStorage.setItem('aura_user_name', 'Adina');
    }
    return 'Adina';
  });

  const handleSaveAccount = (email: string, name: string) => {
    setUserEmail(email);
    setUserName(name);
    try {
      localStorage.setItem('aura_user_email', email);
      localStorage.setItem('aura_user_name', name);
    } catch {}
  };

  const handleTriggerInboxScan = (email: string) => {
    // Notify in assistant message stream that inbox for this email was refreshed
    const auraScanMsg: ChatMessage = {
      id: `msg-scan-${Date.now()}`,
      sender: 'aura',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Autonomous scan complete for ${email}. 42 active messages evaluated. 1 urgent investor deck approval, 1 headcount sign-off, and 18 newsletters queued.`,
    };
    setMessages((prev) => [...prev, auraScanMsg]);
  };

  const handleAddCustomEmail = (sender: string, subject: string, snippet: string) => {
    const newEmail: EmailItem = {
      id: `email-${Date.now()}`,
      sender,
      senderRole: 'Direct Inbox',
      senderEmail: `${sender.toLowerCase().replace(/[^a-z0-9]/g, '.')}@partner.io`,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      time: 'Just now',
      impactTag: 'High Impact',
      impactColor: 'red',
      subject,
      digestType: 'Aura Instant Digest',
      digestDeadline: 'Needs Attention',
      digestSummary: snippet,
      primaryActionLabel: 'Approve & Send Draft',
      secondaryActionLabel: 'Review Full',
      status: 'pending',
      category: 'priority'
    };
    setEmails((prev) => [newEmail, ...prev]);
    setCurrentTab('mail');
  };

  // Cross-feature handlers
  const handleApproveEmail = (id: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'approved' } : e))
    );

    if (id === 'email-1') {
      // Synchronize with Assistant draft card
      setMessages((prev) =>
        prev.map((m) =>
          m.draftCard
            ? {
                ...m,
                draftCard: { ...m.draftCard, status: 'sent' },
              }
            : m
        )
      );
    }
  };

  const handleReviewFull = (email: EmailItem) => {
    if (email.id === 'email-1') {
      setIsDeckModalOpen(true);
    } else {
      // Navigate to assistant with context
      handleExecutivePrompt(`Review details for ${email.sender}'s message: ${email.subject}`);
    }
  };

  const handleDelegateEmail = (id: string, assignee: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'delegated' } : e))
    );
  };

  const handleCleanNewsletters = () => {
    setNewslettersCleaned(true);
    setEmails((prev) => prev.filter((e) => e.category !== 'newsletter'));
  };

  const handleFindFinanceSlot = async () => {
    setFinanceSlotAdded(true);
    setCurrentTab('agenda');

    // Notify assistant stream
    const response = await askAura("find 30m slot with Finance", {
      schedule: "Thursday Oct 24, 4 meetings scheduled, 4:45 PM open",
      unreadCount: emails.filter((e) => e.status === 'pending').length,
      criticalItem: "Series B deck feedback",
    });

    const newAuraMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'aura',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: response.text,
      calendarCard: response.calendarCard,
    };

    setMessages((prev) => [...prev, newAuraMsg]);
  };

  const handleExecutivePrompt = async (prompt: string) => {
    setCurrentTab('assistant');
    await handleSendMessage(prompt);
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessingAI(true);

    try {
      const response = await askAura(text, {
        schedule: "Thursday Oct 24: Product Strategy at 10 AM, Series B at 11:30 AM, Lunch at 1 PM, Focus block at 2 PM, Sarah Lin at 4 PM",
        unreadCount: emails.filter((e) => e.status === 'pending').length,
        criticalItem: "David Vance Series B Slide 12",
        userName,
        userEmail,
      });

      const auraMsg: ChatMessage = {
        id: `msg-aura-${Date.now()}`,
        sender: 'aura',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.text,
        draftCard: response.draftCard,
        calendarCard: response.calendarCard,
      };

      setMessages((prev) => [...prev, auraMsg]);

      // Two-way voice: Aura speaks back to you aloud!
      if (speechService.getAutoSpeak()) {
        speechService.speak(response.text);
      }

      // If response rescheduled 1:1, reflect on agenda
      if (text.toLowerCase().includes('reschedule') && text.toLowerCase().includes('4 pm')) {
        setAgendaEvents((prev) =>
          prev.map((evt) =>
            evt.id === 'evt-5'
              ? {
                  ...evt,
                  badgeText: 'Moved to Fri 10:30 AM',
                  notesSummary: 'Rescheduled via Aura to Friday Oct 25, 10:30 AM. Both schedules cleared.',
                }
              : evt
          )
        );
      }
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleSendDraft = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.draftCard
          ? {
              ...m,
              draftCard: { ...m.draftCard, status: 'sent' },
            }
          : m
      )
    );
    // Mark email-1 approved as well
    handleApproveEmail('email-1');
  };

  const handleUndoCalendar = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.calendarCard
          ? {
              ...m,
              calendarCard: {
                ...m.calendarCard,
                status: 'Reverted to original slot',
                undone: true,
              },
            }
          : m
      )
    );

    // Revert agenda event 5
    setAgendaEvents((prev) =>
      prev.map((evt) =>
        evt.id === 'evt-5'
          ? {
              ...evt,
              badgeText: '1:1 Session',
              notesSummary: undefined,
            }
          : evt
      )
    );
  };

  const [showDirectQR, setShowDirectQR] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const [selectedUrlType, setSelectedUrlType] = useState<'dev' | 'shared'>('dev');

  const devAppUrl = 'https://ais-dev-7dmvda4337ud5u6ddnqheu-575996835137.asia-southeast1.run.app';
  const sharedAppUrl = 'https://ais-pre-7dmvda4337ud5u6ddnqheu-575996835137.asia-southeast1.run.app';

  const activeMobileUrl = selectedUrlType === 'dev' ? devAppUrl : sharedAppUrl;

  const pendingEmailsCount = emails.filter((e) => e.status === 'pending' && e.category === 'priority').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start text-slate-900 font-sans selection:bg-cyan-500/20 antialiased">
      {/* Offline banner if network drops */}
      <OfflineIndicator />

      {/* Prominent Access Banner for Desktop Users */}
      <div className="w-full bg-[#061021] text-white px-4 py-2 border-b border-cyan-900/60 shadow-xs z-50 text-xs flex items-center justify-center">
        <div className="max-w-md w-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span className="font-semibold text-cyan-100 truncate">
              Mobile App Ready
            </span>
          </div>
          <button
            onClick={() => setShowDirectQR(true)}
            className="px-3 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-[11px] shrink-0 transition-colors shadow-xs"
          >
            📱 Open on Phone
          </button>
        </div>
      </div>

      {/* Main Mobile App Container */}
      <div className="w-full max-w-md min-h-screen bg-[#f3f6fb] shadow-2xl relative flex flex-col overflow-x-hidden border-x border-slate-200/60">
        {/* Top App Bar Header */}
        <AuraHeader
          currentTab={currentTab}
          userEmail={userEmail}
          userName={userName}
          onEmailClick={() => setIsAccountEmailOpen(true)}
          onLiveVoiceClick={() => setIsLiveVoiceOpen(true)}
          onTranscribeClick={() => setIsTranscribeOpen(true)}
          onMusicStudioClick={() => setIsMusicStudioOpen(true)}
          onDownloadClick={() => setIsDownloadModalOpen(true)}
          onAvatarClick={() => setIsProfileOpen(true)}
        />

        {/* Tab Viewports */}
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'briefing' && (
            <BriefingTab
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenDeckReview={() => setIsDeckModalOpen(true)}
              onJoinMeeting={(title) => setMeetingCallTitle(title)}
              onExecutivePrompt={handleExecutivePrompt}
              urgentEmailsCount={pendingEmailsCount}
              userName={userName}
              userEmail={userEmail}
              onEmailClick={() => setIsAccountEmailOpen(true)}
              onLiveVoiceClick={() => setIsLiveVoiceOpen(true)}
              onMusicStudioClick={() => setIsMusicStudioOpen(true)}
              onTranscribeClick={() => setIsTranscribeOpen(true)}
              onDownloadClick={() => setIsDownloadModalOpen(true)}
            />
          )}

          {currentTab === 'mail' && (
            <MailTab
              emails={emails}
              userEmail={userEmail}
              onConfigureEmail={() => setIsAccountEmailOpen(true)}
              onApproveEmail={handleApproveEmail}
              onReviewFull={handleReviewFull}
              onDelegateEmail={handleDelegateEmail}
              onCleanNewsletters={handleCleanNewsletters}
              newslettersCleaned={newslettersCleaned}
            />
          )}

          {currentTab === 'agenda' && (
            <AgendaTab
              events={agendaEvents}
              onJoinMeeting={(title) => setMeetingCallTitle(title)}
              onOpenBriefing={(evt) => setBriefingEvent(evt)}
              onFindFinanceSlot={handleFindFinanceSlot}
              financeSlotAdded={financeSlotAdded}
            />
          )}

          {currentTab === 'assistant' && (
            <AssistantTab
              messages={messages}
              onSendMessage={handleSendMessage}
              onSendDraft={handleSendDraft}
              onUndoCalendar={handleUndoCalendar}
              onQuickPrompt={handleSendMessage}
              isProcessing={isProcessingAI}
              onOpenTranscribe={() => setIsTranscribeOpen(true)}
              onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
            />
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNavBar
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          mailBadgeCount={pendingEmailsCount}
          agendaBadgeCount={2}
        />
      </div>

      {/* Modals & Drawers */}
      <DeckPreviewModal
        isOpen={isDeckModalOpen}
        onClose={() => setIsDeckModalOpen(false)}
        onApprove={() => {
          handleApproveEmail('email-1');
          setCurrentTab('assistant');
        }}
      />

      <MeetingCallModal
        isOpen={meetingCallTitle !== null}
        onClose={() => setMeetingCallTitle(null)}
        title={meetingCallTitle || ''}
      />

      <BriefingDrawerModal
        isOpen={briefingEvent !== null}
        onClose={() => setBriefingEvent(null)}
        event={briefingEvent}
        onJoinMeeting={(title) => {
          setBriefingEvent(null);
          setMeetingCallTitle(title);
        }}
      />

      <ProfileDrawerModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName={userName}
        userEmail={userEmail}
        onOpenEmailConfig={() => setIsAccountEmailOpen(true)}
      />

      {/* Feature Modals */}
      <LiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
        onTranscriptionResult={(text) => handleSendMessage(text)}
        userName={userName}
        userEmail={userEmail}
      />

      <MusicStudioModal
        isOpen={isMusicStudioOpen}
        onClose={() => setIsMusicStudioOpen(false)}
      />

      <AudioTranscribeModal
        isOpen={isTranscribeOpen}
        onClose={() => setIsTranscribeOpen(false)}
        onApplyTranscript={(text) => handleSendMessage(text)}
      />

      <DownloadAppModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        devAppUrl={devAppUrl}
      />

      <AccountEmailModal
        isOpen={isAccountEmailOpen}
        onClose={() => setIsAccountEmailOpen(false)}
        userEmail={userEmail}
        userName={userName}
        onSaveAccount={handleSaveAccount}
        onTriggerInboxScan={handleTriggerInboxScan}
        onAddCustomEmail={handleAddCustomEmail}
      />

      {/* Global Mobile QR Code Modal */}
      {showDirectQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-slate-100 text-center">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <span className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center text-base">
                  📱
                </span>
                <span>Open on Mobile</span>
              </div>
              <button
                onClick={() => setShowDirectQR(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* URL Mode Switcher */}
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl mb-3 text-xs font-bold">
              <button
                onClick={() => setSelectedUrlType('dev')}
                className={`py-1.5 rounded-lg transition-all ${
                  selectedUrlType === 'dev'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Live Dev URL (Active)
              </button>
              <button
                onClick={() => setSelectedUrlType('shared')}
                className={`py-1.5 rounded-lg transition-all ${
                  selectedUrlType === 'shared'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Public Shared URL
              </button>
            </div>

            {selectedUrlType === 'dev' ? (
              <p className="text-[11px] text-slate-500 mb-2.5 text-left leading-relaxed">
                Scan with your phone to open the live application (make sure your phone browser is logged in to your Google account):
              </p>
            ) : (
              <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200/80 p-2.5 rounded-xl mb-2.5 text-left leading-relaxed">
                <strong>Why 404?</strong> The Public Shared URL only goes live after you click the <strong>"Deploy"</strong> button in the top right of AI Studio. Until then, use the <strong>Live Dev URL</strong> tab!
              </div>
            )}

            <div className="flex justify-center mb-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(activeMobileUrl)}`}
                alt="Aura Mobile QR Code"
                className="w-44 h-44 rounded-lg shadow-sm"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-left mb-3 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-600 font-mono truncate select-all">
                {activeMobileUrl}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeMobileUrl);
                  setCopiedUrl(true);
                  setTimeout(() => setCopiedUrl(false), 2000);
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shrink-0 shadow-2xs"
              >
                {copiedUrl ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <button
              onClick={() => setShowDirectQR(false)}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
