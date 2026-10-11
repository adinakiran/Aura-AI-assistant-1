import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  Sparkles, 
  Video, 
  FileText, 
  Utensils, 
  Moon, 
  PlusCircle, 
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { AgendaEvent } from '../data/mockData';

interface AgendaTabProps {
  events: AgendaEvent[];
  onJoinMeeting: (title: string) => void;
  onOpenBriefing: (evt: AgendaEvent) => void;
  onFindFinanceSlot: () => void;
  financeSlotAdded?: boolean;
}

export const AgendaTab: React.FC<AgendaTabProps> = ({
  events,
  onJoinMeeting,
  onOpenBriefing,
  onFindFinanceSlot,
  financeSlotAdded = false,
}) => {
  const [selectedDay, setSelectedDay] = useState<'THU 24' | string>('THU 24');

  const days = [
    { day: 'MON', date: 21, dots: 2 },
    { day: 'TUE', date: 22, dots: 2 },
    { day: 'WED', date: 23, dots: 3 },
    { day: 'THU', date: 24, dots: 3, isToday: true },
    { day: 'FRI', date: 25, dots: 2 },
    { day: 'SAT', date: 26, dots: 0 },
    { day: 'SUN', date: 27, dots: 0 },
  ];

  return (
    <div className="pb-32 pt-2 px-4 max-w-md mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Date Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Today, Oct 24</h1>
          <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold">
            Thu
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Selector Strip */}
      <div className="grid grid-cols-7 gap-1.5 p-1 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        {days.map((item) => {
          const isSelected = selectedDay === `${item.day} ${item.date}` || (item.isToday && selectedDay === 'THU 24');
          return (
            <button
              key={item.day}
              onClick={() => setSelectedDay(`${item.day} ${item.date}`)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                isSelected
                  ? 'bg-[#0a4b64] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-[10px] font-semibold opacity-80">{item.day}</span>
              <span className="text-sm font-extrabold my-0.5">{item.date}</span>
              <div className="flex items-center gap-0.5 h-1">
                {Array.from({ length: item.dots }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1 h-1 rounded-full ${isSelected ? 'bg-cyan-200' : 'bg-slate-300'}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* SCHEDULE HEALTH Banner */}
      <div className="rounded-3xl bg-gradient-to-b from-[#e8f1fc] via-[#edf4fd] to-white border border-[#d2e4f8] p-4 shadow-xs space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-600" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-900">
              SCHEDULE HEALTH
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Optimal Balance
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          <strong className="text-cyan-900">4 hrs 30 mins</strong> meeting time • <strong className="text-cyan-900">2 hrs</strong> focus time scheduled • No conflicts detected
        </p>
      </div>

      {/* Timeline Events */}
      <div className="space-y-4 pt-1">
        {events.map((evt) => (
          <div key={evt.id} className="flex gap-3">
            {/* Left time column */}
            <div className="w-14 text-right pt-2 shrink-0">
              <span className="text-xs font-bold text-slate-900 block">{evt.startTime}</span>
              <span className="text-[10px] text-slate-400 font-medium block">{evt.endTime}</span>
            </div>

            {/* Event Card */}
            <div className="flex-1 rounded-3xl bg-white border border-slate-200/90 p-4 shadow-xs space-y-3 hover:border-cyan-300 transition-all">
              {/* Badge & Duration */}
              <div className="flex items-center justify-between">
                {evt.badgeType === 'starts-soon' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0a4b64] text-white text-[10px] font-bold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                    {evt.badgeText}
                  </span>
                ) : evt.badgeType === 'focus' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold border border-purple-200">
                    <Moon className="w-3 h-3 text-purple-600" />
                    {evt.badgeText}
                  </span>
                ) : evt.badgeType === 'lunch' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    <Utensils className="w-3 h-3 text-slate-500" />
                    {evt.badgeText}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 text-[10px] font-bold border border-cyan-200">
                    <CheckCircle2 className="w-3 h-3 text-cyan-600" />
                    {evt.badgeText}
                  </span>
                )}

                <span className="text-[11px] font-semibold text-slate-400">{evt.duration}</span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">{evt.title}</h3>

              {/* Attendees if any */}
              {evt.attendees && evt.attendees.length > 0 && (
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2 overflow-hidden">
                    {evt.attendees.map((att, i) => (
                      <img
                        key={i}
                        src={att.avatar}
                        alt={att.name}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{evt.attendeeSummary}</span>
                </div>
              )}

              {/* Briefing Subcard */}
              {evt.briefingNote && (
                <div className="rounded-2xl bg-[#eef5fc] border border-cyan-100 p-3 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-cyan-900">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Aura Briefing:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {evt.briefingNote} {evt.briefingSuggestedPoint && (
                      <span className="font-semibold text-cyan-900">
                        Suggested talking point: {evt.briefingSuggestedPoint}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Notes summary for regular cards */}
              {evt.notesSummary && !evt.briefingNote && (
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-2.5 text-xs text-slate-600">
                  {evt.notesSummary}
                </div>
              )}

              {/* Action buttons if meeting link */}
              {evt.hasMeetingLink && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onJoinMeeting(evt.title)}
                    className="flex-1 py-2 px-4 rounded-xl bg-[#094c63] hover:bg-[#07394b] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Meet</span>
                  </button>
                  <button
                    onClick={() => onOpenBriefing(evt)}
                    className="flex-1 py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Full Briefing</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Dynamic Finance Slot if Added */}
        {financeSlotAdded && (
          <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="w-14 text-right pt-2 shrink-0">
              <span className="text-xs font-bold text-emerald-600 block">4:45</span>
              <span className="text-[10px] text-emerald-500 font-medium block">5:15 PM</span>
            </div>
            <div className="flex-1 rounded-3xl bg-emerald-50/80 border border-emerald-200 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  Just Scheduled
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">30 mins</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Finance Sync: Q4 Budget Review</h3>
              <p className="text-xs text-slate-600">
                With Marcus (Finance). Held on calendar with zero conflicts.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action: Ask Aura to find 30m slot */}
      <button
        onClick={onFindFinanceSlot}
        className="w-full rounded-2xl bg-[#dbeefd] hover:bg-[#d0e8fc] border border-cyan-200/80 p-3.5 flex items-center justify-between text-xs font-bold text-cyan-900 shadow-xs transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-2.5">
          <PlusCircle className="w-5 h-5 text-cyan-700" />
          <span>Ask Aura to find 30m slot with Finance</span>
        </div>
        <ArrowRight className="w-4 h-4 text-cyan-700" />
      </button>
    </div>
  );
};
