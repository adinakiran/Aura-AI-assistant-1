import React from 'react';
import { X, Sparkles, CheckCircle2, Users, FileText, Calendar, Video } from 'lucide-react';
import { AgendaEvent } from '../data/mockData';

interface BriefingDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: AgendaEvent | null;
  onJoinMeeting: (title: string) => void;
}

export const BriefingDrawerModal: React.FC<BriefingDrawerModalProps> = ({
  isOpen,
  onClose,
  event,
  onJoinMeeting,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{event.title}</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {event.startTime} – {event.endTime} ({event.duration})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Executive Summary */}
          <div className="rounded-2xl bg-[#eef5fc] border border-cyan-100 p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-900">
              Aura Strategic Objective
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Align team on the revised Q4 milestones and secure agreement on the database latency mitigation strategy. Keep meeting under 40 minutes to preserve deep focus buffer.
            </p>
          </div>

          {/* Key Talking Points */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Suggested Talking Points
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Phase 1 Rollback Plan:</strong> David and Elena need fallback assurance before Black Friday code freeze.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Headcount Allocation:</strong> +$320k budget impact already cleared through Q3 financial audit.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Board Deck Approval:</strong> Final ARR figure of $18.4M ready for 11:30 AM partner sync.
                </span>
              </li>
            </ul>
          </div>

          {/* Attendees */}
          {event.attendees && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Confirmed Attendees
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.attendees.map((att, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                    <img src={att.avatar} alt={att.name} className="w-4 h-4 rounded-full object-cover" />
                    <span className="font-semibold">{att.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onJoinMeeting(event.title);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#094c63] hover:bg-[#07394b] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Join Meet Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
