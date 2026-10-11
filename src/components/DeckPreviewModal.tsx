import React from 'react';
import { X, CheckCircle, TrendingUp, AlertCircle, FileText, Send } from 'lucide-react';

interface DeckPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
}

export const DeckPreviewModal: React.FC<DeckPreviewModalProps> = ({
  isOpen,
  onClose,
  onApprove,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xs">
              S12
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Series B Investor Deck v4.2</h3>
              <p className="text-xs text-slate-500">Slide 12: Global ARR & Retention Trajectory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content Preview */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Mock Slide Viewport */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-5 shadow-lg border border-slate-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] tracking-wider uppercase text-cyan-400 font-semibold">Financial Milestone</span>
                <h4 className="text-lg font-bold">ARR Expansion Trajectory</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Audit Verified
              </span>
            </div>

            {/* Slide Chart Mock */}
            <div className="grid grid-cols-3 gap-2 my-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400">Q1 Actual</span>
                <p className="text-base font-bold text-white">$10.2M</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400">Q2 Actual</span>
                <p className="text-base font-bold text-white">$14.2M</p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40">
                <span className="text-[10px] text-cyan-300 font-medium">Q3 Close Projected</span>
                <p className="text-base font-bold text-cyan-200">$18.4M</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 pt-2 border-t border-white/10">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Highlights 18% ARR growth in Europe. Net revenue retention at 124%.</span>
            </div>
          </div>

          {/* Aura Analysis Note */}
          <div className="p-3.5 rounded-2xl bg-cyan-50/80 border border-cyan-200/80 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-cyan-900">
              <CheckCircle className="w-4 h-4 text-cyan-600" />
              <span>Aura Analysis & Recommendation</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              David's revised Slide 12 figures match the audited numbers from <code>Q3-Final-Audit.xlsx</code>. Minor churn delta is already addressed in slide 14 appendix. Safe to approve for partner presentation.
            </p>
          </div>

          {/* David's email snippet */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>David Vance note (9:15 AM)</span>
            </div>
            <p className="italic text-slate-500">
              "Need your direct sign-off on Slide 12 before the 11:30 AM partner sync so we can export the finalized deck."
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onApprove();
              onClose();
            }}
            className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Approve & Send Draft</span>
          </button>
        </div>
      </div>
    </div>
  );
};
