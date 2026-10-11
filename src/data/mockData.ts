export interface EmailItem {
  id: string;
  sender: string;
  senderRole: string;
  senderEmail: string;
  avatarUrl: string;
  time: string;
  impactTag: string;
  impactColor: 'red' | 'blue' | 'gray';
  subject: string;
  digestType: string;
  digestDeadline?: string;
  digestSummary: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  tertiaryActionLabel?: string;
  attachment?: {
    name: string;
    size: string;
    verified: boolean;
  };
  status: 'pending' | 'approved' | 'delegated' | 'archived';
  category: 'priority' | 'action' | 'newsletter';
}

export interface AgendaEvent {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
  badgeText: string;
  badgeType: 'starts-soon' | 'ready' | 'focus' | 'session' | 'lunch';
  title: string;
  attendees?: Array<{ name: string; avatar: string }>;
  attendeeSummary?: string;
  briefingNote?: string;
  briefingSuggestedPoint?: string;
  hasMeetingLink?: boolean;
  notesSummary?: string;
  status?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'aura';
  time: string;
  text: string;
  draftCard?: {
    to: string;
    subject: string;
    body: string;
    source: string;
    confidence: number;
    status?: 'draft' | 'sent';
  };
  calendarCard?: {
    title: string;
    dateBadge: string;
    details: string;
    status: string;
    undone?: boolean;
  };
}

export const INITIAL_EMAILS: EmailItem[] = [
  {
    id: 'email-1',
    sender: 'David Vance',
    senderRole: 'CPO',
    senderEmail: 'david.v@novatech.io',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    time: '9:15 AM',
    impactTag: 'High Impact',
    impactColor: 'red',
    subject: 'Urgent: Feedback on Series B Investor Deck',
    digestType: 'Aura Quick Digest',
    digestDeadline: 'Deadline 11:30 AM',
    digestSummary: 'Wants approval on Slide 12 ARR projections ($18.4M) before the partner sync at 11:30 AM. Minor metric delta noted in customer churn rate.',
    primaryActionLabel: 'Approve & Send Draft',
    secondaryActionLabel: 'Review Full',
    tertiaryActionLabel: 'Delegate: Sarah',
    status: 'pending',
    category: 'priority'
  },
  {
    id: 'email-2',
    sender: 'Elena Rostova',
    senderRole: 'VP Eng',
    senderEmail: 'e.rostova@novatech.io',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    time: '8:40 AM',
    impactTag: 'Budget Approval',
    impactColor: 'blue',
    subject: 'Q4 Headcount Allocation Approval',
    digestType: 'Aura Synthesis',
    digestDeadline: 'Finance Impact',
    digestSummary: 'Requests green light for 2 senior platform roles to mitigate database latency before Black Friday. Budget impact: +$320k annual run-rate.',
    primaryActionLabel: 'One-Tap Approve',
    secondaryActionLabel: 'Request Details',
    status: 'pending',
    category: 'action'
  },
  {
    id: 'email-3',
    sender: 'Legal Operations',
    senderRole: 'Info Only',
    senderEmail: 'contracts@novatech.io',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    time: '8:05 AM',
    impactTag: 'Auto-Processed',
    impactColor: 'gray',
    subject: 'Vendor MSA Execution - Snowflake Agreement',
    digestType: 'Archived & Linked',
    digestSummary: 'Standard enterprise terms accepted with no redline discrepancies. Fully executed copy attached and mirrored to Google Drive/Finance-Contracts.',
    primaryActionLabel: 'View Executed Copy',
    attachment: {
      name: 'Snowflake_MSA_Signed.pdf',
      size: '1.2 MB',
      verified: true
    },
    status: 'archived',
    category: 'action'
  }
];

export const INITIAL_AGENDA: AgendaEvent[] = [
  {
    id: 'evt-1',
    startTime: '10:00',
    endTime: '10:45 AM',
    duration: '45 mins',
    badgeText: 'STARTS IN 35 MINS',
    badgeType: 'starts-soon',
    title: 'Product Strategy & Roadmap Sync',
    attendees: [
      { name: 'Elena', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' },
      { name: 'David', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { name: 'Mark', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
      { name: 'Maya', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80' }
    ],
    attendeeSummary: 'Elena, David, Mark, Maya',
    briefingNote: 'David wants to discuss delayed API milestone.',
    briefingSuggestedPoint: 'Phase 1 rollback plan.',
    hasMeetingLink: true
  },
  {
    id: 'evt-2',
    startTime: '11:30',
    endTime: '12:15 PM',
    duration: '45 mins',
    badgeText: 'Materials Ready',
    badgeType: 'ready',
    title: 'Series B Working Session w/ Partners',
    notesSummary: "Deck reviewed. Elena's financial notes and dilution targets incorporated.",
    hasMeetingLink: true
  },
  {
    id: 'evt-3',
    startTime: '1:00',
    endTime: '2:00 PM',
    duration: '60 mins',
    badgeText: 'Blocked by Aura',
    badgeType: 'lunch',
    title: 'Lunch & Recharge',
    notesSummary: 'Autonomous calendar protection buffer.'
  },
  {
    id: 'evt-4',
    startTime: '2:00',
    endTime: '3:30 PM',
    duration: '1 hr 30 mins',
    badgeText: 'DO NOT DISTURB',
    badgeType: 'focus',
    title: 'Focus Time: Q4 Strategic Objectives',
    notesSummary: 'Notifications muted. Autonomous email triage in progress.'
  },
  {
    id: 'evt-5',
    startTime: '4:00',
    endTime: '4:30 PM',
    duration: '30 mins',
    badgeText: '1:1 Session',
    badgeType: 'session',
    title: 'Sarah Lin (Design Lead)',
    attendeeSummary: 'Bi-weekly catchup',
    attendees: [
      { name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
    ],
    briefingNote: 'Sarah completed Design System v2. 2 blocker items for review.'
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    time: '10:42 AM',
    text: "Can you draft a reply to David's email about Slide 12 and reschedule my 4 PM 1:1 if needed?"
  },
  {
    id: 'msg-2',
    sender: 'aura',
    time: '10:42 AM',
    text: "Done! Here is the drafted response and schedule adjustment proposal:",
    draftCard: {
      to: "David Vance (VP Finance)",
      subject: "Re: Urgent: Feedback on Series B I...",
      body: "“Hi David, Reviewed Slide 12. The revised $14.2M ARR figure aligns with our Q3 close. You have my full approval to present to the board. Best, Maya”",
      source: "Context derived from 'Q3-Final-Audit.xlsx'",
      confidence: 99,
      status: 'draft'
    },
    calendarCard: {
      title: "Sarah Lin 1:1 Rescheduled",
      dateBadge: "FRI 25",
      details: "Moved to tomorrow, Friday at 10:30 AM. Both schedules cleared. Updated invite sent.",
      status: "Zero calendar conflicts",
      undone: false
    }
  }
];
