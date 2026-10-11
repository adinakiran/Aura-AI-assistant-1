import React, { useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageSquare } from 'lucide-react';

interface MeetingCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const MeetingCallModal: React.FC<MeetingCallModalProps> = ({
  isOpen,
  onClose,
  title,
}) => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Top header */}
        <div className="px-5 py-3.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-white truncate max-w-[280px]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video grid preview */}
        <div className="p-4 grid grid-cols-2 gap-3 min-h-[260px] bg-slate-950/40">
          <div className="relative rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center border border-slate-700/60 aspect-video">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
              alt="Elena"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 text-[10px] font-medium bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-white">
              Elena Rostova
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center border border-slate-700/60 aspect-video">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
              alt="David"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 text-[10px] font-medium bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-white">
              David Vance
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center border border-slate-700/60 aspect-video">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
              alt="Mark"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 text-[10px] font-medium bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-white">
              Mark (PM)
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center border border-cyan-500/50 aspect-video">
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80"
              alt="Maya"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-cyan-600/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-white">
              You (Maya)
            </span>
          </div>
        </div>

        {/* Aura In-call co-pilot note */}
        <div className="mx-4 mb-3 p-3 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 text-xs text-cyan-200 flex items-start gap-2">
          <span className="text-cyan-400 font-bold text-sm">✦</span>
          <div>
            <strong className="text-cyan-100">Aura Live Meeting Telemetry:</strong>
            <p className="text-[11px] text-cyan-300 mt-0.5">
              Live transcription active. Talking point queued: "Phase 1 rollback plan & headcount allocation".
            </p>
          </div>
        </div>

        {/* Call Controls */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-center gap-3">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`p-3 rounded-full transition-colors ${
              micOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-500 text-white'
            }`}
          >
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setVideoOn(!videoOn)}
            className={`p-3 rounded-full transition-colors ${
              videoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-500 text-white'
            }`}
          >
            {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
            <span>Leave Meet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
