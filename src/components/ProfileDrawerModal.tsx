import React from 'react';
import { X, Shield, Smartphone, Bell, Check, Sparkles, LogOut, CheckCircle2, Mail, Edit3 } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface ProfileDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
  onOpenEmailConfig?: () => void;
}

export const ProfileDrawerModal: React.FC<ProfileDrawerModalProps> = ({
  isOpen,
  onClose,
  userName = 'Maya Sterling',
  userEmail = 'adinakiran2003@gmail.com',
  onOpenEmailConfig,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Profile Card Header */}
        <div className="p-5 bg-gradient-to-br from-[#061021] to-[#0e2747] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5 mb-2">
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=180&auto=format&fit=crop&q=80"
              alt={userName}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-cyan-400 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white truncate">{userName}</h3>
              <p className="text-xs text-cyan-200 truncate">{userEmail}</p>
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Aura Pro Autonomous
              </span>
            </div>
          </div>
        </div>

        {/* Connected Services */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto text-xs">
          {/* Quick email config callout */}
          <div className="p-3 rounded-2xl bg-cyan-50/90 border border-cyan-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-700" />
              <div>
                <span className="font-bold text-slate-900 block text-xs">Monitored Email</span>
                <span className="text-[11px] text-slate-600 block font-mono truncate max-w-[160px]">{userEmail}</span>
              </div>
            </div>
            {onOpenEmailConfig && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEmailConfig();
                }}
                className="px-2.5 py-1 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2.5">
              Live Connected Workspaces
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-800">Google Workspace (Gmail & Calendar)</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-800">Slack Executive Triage</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  Synced
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-800">Google Meet & Zoom Telemetry</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Autonomous Assistant Preferences */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2.5">
              Autonomous Policies
            </h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Auto-protect Focus Blocks</span>
                  <span className="text-[11px] text-slate-500 block">Mute low priority notifications</span>
                </div>
                <input type="checkbox" defaultChecked className="rounded accent-cyan-600 w-4 h-4" />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Draft Replies on Decisions</span>
                  <span className="text-[11px] text-slate-500 block">Generate high-confidence executive drafts</span>
                </div>
                <input type="checkbox" defaultChecked className="rounded accent-cyan-600 w-4 h-4" />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Two-Way Voice Output</span>
                  <span className="text-[11px] text-slate-500 block">Speak answers aloud when you talk</span>
                </div>
                <input type="checkbox" defaultChecked className="rounded accent-cyan-600 w-4 h-4" />
              </label>
            </div>
          </div>

          {/* Mobile Install */}
          <div className="p-3 rounded-2xl bg-cyan-50/80 border border-cyan-200 space-y-2">
            <div className="flex items-center gap-2 text-cyan-900 font-bold text-xs">
              <Smartphone className="w-4 h-4 text-cyan-700" />
              <span>Use Aura On Mobile</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Install Aura to your phone home screen for offline access and full native executive experience.
            </p>
            <PWAInstallButton />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
