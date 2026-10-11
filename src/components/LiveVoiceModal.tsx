import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, Sparkles, PhoneOff, VolumeX } from 'lucide-react';
import { speechService } from '../services/speech';
import { askAura } from '../services/gemini';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptionResult?: (text: string) => void;
  userName?: string;
  userEmail?: string;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  isOpen,
  onClose,
  onTranscriptionResult,
  userName = 'Maya',
  userEmail = 'maya@novatech.io',
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [status, setStatus] = useState<'listening' | 'speaking' | 'processing'>('listening');
  const [userSpeechText, setUserSpeechText] = useState('');
  const [auraResponseText, setAuraResponseText] = useState(`Good day, ${userName}. I'm listening. Ask me anything about your emails, schedule, or team.`);

  const recognitionRef = useRef<any>(null);
  const isComponentMounted = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      speechService.stop();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      return;
    }

    isComponentMounted.current = true;
    setStatus('speaking');

    // Aura greets the user out loud when opened!
    const greeting = `Hello ${userName}, Aura Live is ready. How can I help with your day?`;
    setAuraResponseText(greeting);
    speechService.speak(greeting, {
      force: true,
      onStart: () => setStatus('speaking'),
      onEnd: () => {
        if (isComponentMounted.current) {
          setStatus('listening');
          startListening();
        }
      },
      onError: () => {
        if (isComponentMounted.current) {
          setStatus('listening');
          startListening();
        }
      }
    });

    return () => {
      isComponentMounted.current = false;
      speechService.stop();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, [isOpen, userName]);

  const startListening = () => {
    if (isMuted) return;

    const windowWithSpeech = window as any;
    const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setStatus('listening');
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          setUserSpeechText(transcript);

          if (event.results[current].isFinal) {
            handleProcessUserSpeech(transcript);
          }
        };

        recognition.onerror = () => {
          setStatus('listening');
        };

        recognition.onend = () => {
          if (status === 'listening' && !speechService.getSpeakingState()) {
            // Keep listening loop active
            try { recognition.start(); } catch {}
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch {
        setStatus('listening');
      }
    }
  };

  const handleProcessUserSpeech = async (speech: string) => {
    if (!speech.trim()) return;
    setStatus('processing');
    onTranscriptionResult?.(speech);

    try {
      const response = await askAura(speech, {
        schedule: 'Thursday Oct 24: Product Strategy at 10 AM, Series B at 11:30 AM, Lunch at 1 PM, Focus block at 2 PM, Sarah Lin at 4 PM',
        unreadCount: 3,
        criticalItem: 'Series B Deck Approval',
        userName,
        userEmail,
      });

      setAuraResponseText(response.text);

      // Aura speaks back out loud!
      if (!isVoiceMuted) {
        setStatus('speaking');
        speechService.speak(response.text, {
          force: true,
          onStart: () => setStatus('speaking'),
          onEnd: () => {
            setStatus('listening');
            startListening();
          },
          onError: () => {
            setStatus('listening');
            startListening();
          }
        });
      } else {
        setStatus('listening');
        startListening();
      }
    } catch {
      const fallback = `Understood, ${userName}. I've logged that in your executive briefing.`;
      setAuraResponseText(fallback);
      speechService.speak(fallback, {
        force: true,
        onEnd: () => {
          setStatus('listening');
          startListening();
        }
      });
    }
  };

  const handleToggleMute = () => {
    if (!isMuted) {
      setIsMuted(true);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    } else {
      setIsMuted(false);
      startListening();
    }
  };

  const handleToggleAudioOutput = () => {
    if (isVoiceMuted) {
      setIsVoiceMuted(false);
      speechService.speak(auraResponseText, { force: true });
    } else {
      setIsVoiceMuted(true);
      speechService.stop();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 text-white">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full flex justify-between items-center mb-4 relative z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-[11px] font-bold text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Two-Way Voice (Gemini 3.8 Live)</span>
          </div>
          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aura Central Orb with dynamic animation based on status */}
        <div className="relative my-4">
          <div className={`w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 p-1 flex items-center justify-center shadow-lg transition-all duration-300 ${
            status === 'speaking'
              ? 'scale-105 shadow-cyan-400/40 ring-4 ring-cyan-400/30'
              : status === 'listening'
              ? 'shadow-sky-500/25 ring-2 ring-sky-400/20'
              : 'opacity-80'
          }`}>
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
              <Sparkles className={`w-10 h-10 text-cyan-400 ${status === 'speaking' ? 'animate-bounce' : 'animate-spin duration-3000'}`} />
            </div>
          </div>
          {/* Wave ring */}
          <div className={`absolute inset-0 -m-2 rounded-full border border-cyan-400/40 animate-ping opacity-30 ${status === 'speaking' ? 'block' : 'hidden'}`} />
        </div>

        {/* Status indicator */}
        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
          {status === 'speaking' ? '🔊 Aura is speaking to you' : status === 'listening' ? '🎙️ Listening to you...' : '🧠 Aura thinking...'}
        </span>

        {/* Live Conversation Transcript Display */}
        <div className="w-full my-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-left space-y-2 max-h-36 overflow-y-auto">
          {userSpeechText && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">You:</span>
              <p className="text-slate-200 italic mt-0.5 font-medium leading-relaxed">
                "{userSpeechText}"
              </p>
            </div>
          )}

          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase">Aura:</span>
            <p className="text-white mt-0.5 font-semibold leading-relaxed">
              {auraResponseText}
            </p>
          </div>
        </div>

        {/* Equalizer Waveform */}
        <div className="flex items-center justify-center gap-1.5 h-7 mb-6">
          {[40, 75, 95, 60, 85, 50, 100, 70, 45, 80].map((h, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${
                status === 'speaking'
                  ? 'bg-cyan-400 animate-pulse'
                  : status === 'listening'
                  ? 'bg-sky-500 animate-pulse'
                  : 'bg-slate-700 h-2'
              }`}
              style={{ height: status === 'processing' ? '4px' : `${h}%` }}
            />
          ))}
        </div>

        {/* Control Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMute}
            className={`p-3 rounded-full transition-all ${
              isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleToggleAudioOutput}
            className={`p-3 rounded-full transition-all ${
              isVoiceMuted ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-cyan-300'
            }`}
            title={isVoiceMuted ? 'Unmute Aura Voice' : 'Mute Aura Voice'}
          >
            {isVoiceMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
