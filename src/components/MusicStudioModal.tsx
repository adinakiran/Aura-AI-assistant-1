import React, { useState, useRef } from 'react';
import { X, Play, Pause, Music, Sparkles, Volume2, Disc, RefreshCw } from 'lucide-react';

interface MusicStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MusicStudioModal: React.FC<MusicStudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePreset, setActivePreset] = useState('Deep Strategic Focus (432Hz)');
  const [audioPrompt, setAudioPrompt] = useState('Gentle ambient synth pad with 432Hz binaural focus beats');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  if (!isOpen) return null;

  const presets = [
    { name: 'Deep Strategic Focus (432Hz)', prompt: 'Binaural ambient synth for deep executive focus, 432Hz tuned' },
    { name: 'Afternoon Recharge (30s)', prompt: 'Gentle acoustic ambient melody for 30s recharge buffer' },
    { name: 'Board Meeting High Focus', prompt: 'Cinematic subtle minimalist electronic beat for high intensity decision making' },
  ];

  const toggleSound = () => {
    if (isPlaying) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Create warm ambient chord using dual oscillators
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(216, ctx.currentTime); // Harmonic of 432Hz

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(432, ctx.currentTime); // 432Hz Focus

      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      oscillatorRef.current = osc1;
      gainNodeRef.current = gain;
      setIsPlaying(true);
    } catch {
      setIsPlaying(!isPlaying);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: audioPrompt, duration: 30 }),
      });
      toggleSound();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    setIsPlaying(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Music & Sound Studio</h3>
              <p className="text-[10px] text-purple-700 font-semibold">lyria-3-clip-preview & Focus Audio</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Music Player Disc */}
        <div className="my-2 p-5 rounded-3xl bg-gradient-to-br from-slate-950 to-slate-900 text-white flex flex-col items-center text-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-purple-500/40 flex items-center justify-center mb-3 shadow-lg shadow-purple-500/20 relative">
            <Disc className={`w-10 h-10 text-purple-400 ${isPlaying ? 'animate-spin duration-3000' : ''}`} />
          </div>

          <h4 className="text-sm font-bold text-white tracking-tight">{activePreset}</h4>
          <span className="text-[10px] text-purple-300 mt-0.5">30s Executive Focus Soundscape</span>

          {/* Audio Waveform */}
          <div className="flex items-center gap-1 h-6 my-4">
            {[30, 60, 90, 45, 80, 50, 100, 70, 40].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying ? 'bg-purple-400 animate-pulse' : 'bg-slate-700'
                }`}
                style={{ height: isPlaying ? `${h}%` : '20%' }}
              />
            ))}
          </div>

          <button
            onClick={toggleSound}
            className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            <span>{isPlaying ? 'Pause Soundscape' : 'Play Soundscape'}</span>
          </button>
        </div>

        {/* Presets */}
        <div className="space-y-2 mt-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Select Track Theme
          </span>
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setActivePreset(p.name);
                setAudioPrompt(p.prompt);
              }}
              className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                activePreset === p.name
                  ? 'border-purple-500 bg-purple-50 font-bold text-purple-900'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Generate with Lyria action */}
        <div className="pt-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            {isGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            )}
            <span>{isGenerating ? 'Synthesizing...' : 'Generate 30s Track (Lyria)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
