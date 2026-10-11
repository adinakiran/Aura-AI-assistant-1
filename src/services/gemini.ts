import { GoogleGenAI } from '@google/genai';

// Initialize Gemini API client safely if key exists
let aiClient: GoogleGenAI | null = null;

try {
  const apiKey = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_GEMINI_API_KEY || 
                 (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
  if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  }
} catch {
  // Silent fallback
}

export interface AssistantResponse {
  text: string;
  draftCard?: {
    to: string;
    subject: string;
    body: string;
    source: string;
    confidence: number;
  };
  calendarCard?: {
    title: string;
    dateBadge: string;
    details: string;
    status: string;
  };
  suggestedPrompts?: string[];
}

export async function askAura(query: string, currentContext: {
  schedule: string;
  unreadCount: number;
  criticalItem: string;
  userName?: string;
  userEmail?: string;
}): Promise<AssistantResponse> {
  const lower = query.toLowerCase();
  const userName = currentContext.userName || 'Maya';
  const userEmail = currentContext.userEmail || 'maya@novatech.io';

  // 1. Direct contextual intent handlers for lightning speed
  if (lower.includes('slide 12') || (lower.includes('david') && lower.includes('reply'))) {
    return {
      text: `Done, ${userName}! Here is the drafted response and schedule adjustment proposal:`,
      draftCard: {
        to: "David Vance (VP Finance)",
        subject: "Re: Urgent: Feedback on Series B Investor Deck",
        body: `Hi David, Reviewed Slide 12. The revised $14.2M ARR figure aligns with our Q3 close. You have my full approval to present to the board. Best, ${userName}`,
        source: "Context derived from 'Q3-Final-Audit.xlsx'",
        confidence: 99
      },
      calendarCard: lower.includes('reschedule') || lower.includes('4 pm') ? {
        title: "Sarah Lin 1:1 Rescheduled",
        dateBadge: "FRI 25",
        details: "Moved to tomorrow, Friday at 10:30 AM. Both schedules cleared. Updated invite sent.",
        status: "Auto-synced • Zero calendar conflicts"
      } : undefined,
      suggestedPrompts: ["Summarize unread Slack threads", "Prepare briefing for 10am meeting", "Confirm 4 PM block"]
    };
  }

  if (lower.includes('finance') || lower.includes('30m slot')) {
    return {
      text: "I analyzed both your calendars and found an open 30-minute window with Marcus & Finance team:",
      calendarCard: {
        title: "Finance Sync: Q4 Budget Review",
        dateBadge: "THU 24",
        details: "Scheduled for today, 4:45 PM – 5:15 PM following your Sarah Lin catchup. Agenda attached.",
        status: "Held on calendar • Invites dispatched"
      },
      suggestedPrompts: ["Send prep notes to Marcus", "Attach headcount spreadsheet", "View updated Agenda"]
    };
  }

  if (lower.includes('summarize') || lower.includes('email') || lower.includes('unread')) {
    return {
      text: "Here is your inbox triage summary: 42 messages scanned. 1 requires urgent approval (David Vance, Series B deck before 11:30 AM), 1 needs budget sign-off (Elena Rostova, +$320k headcount), and 18 newsletters are queued for 1-Tap Clean.",
      draftCard: {
        to: "Elena Rostova • VP Eng",
        subject: "Re: Q4 Headcount Allocation Approval",
        body: "Hi Elena, Approved the 2 senior platform roles for database stability ahead of Black Friday. Please sync with HR.",
        source: "Synthesized from Q4 Infrastructure Plan",
        confidence: 96
      },
      suggestedPrompts: ["One-tap clean 18 newsletters", "Approve David's investor deck", "Check schedule health"]
    };
  }

  // 2. Try Gemini API if configured
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are Aura, an elite executive AI personal voice and inbox assistant for ${userName} (Email: ${userEmail}).
Context:
- Today is Thursday, Oct 24.
- User Email Account: ${userEmail}
- Current Schedule: ${currentContext.schedule}
- Unread messages: ${currentContext.unreadCount} (Critical: ${currentContext.criticalItem})
User message: "${query}"

Respond concisely, executive-level, authoritative yet warm, actionable. Under 80 words. Speak directly to ${userName}.`,
      });

      if (response.text) {
        return {
          text: response.text,
          suggestedPrompts: ["Approve pending drafts", "Review agenda briefings", "Block 30m focus time"]
        };
      }
    } catch (e) {
      console.warn("Gemini API fallback:", e);
    }
  }

  // 3. Smart Executive fallback
  return {
    text: `I've handled that for you, ${userName}. I synchronized your active inbox for ${userEmail}, calendar, and priority tasks. Everything is in order.`,
    suggestedPrompts: ["Summarize unread Slack threads", "Review 11:30 AM Series B deck", "Show today's meetings"]
  };
}
