import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check, QrCode, Copy } from 'lucide-react';

const SHARED_APP_URL = 'https://ais-pre-7dmvda4337ud5u6ddnqheu-575996835137.asia-southeast1.run.app';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' && window.location.href.startsWith('http')
    ? window.location.href
    : SHARED_APP_URL;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        {isInstallable && (
          <button
            onClick={install}
            className="flex items-center gap-1.5 rounded-full font-bold text-xs shadow-sm transition-all bg-[#0a4b64] hover:bg-[#073b4f] text-white px-3 py-1.5"
            title="Install Aura to your home screen"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
        )}

        {isIOS && (
          <button
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-600" />
            <span>Add to iPhone</span>
          </button>
        )}

        {/* Mobile QR quick access button */}
        <button
          onClick={() => setShowQR(true)}
          className="flex items-center gap-1.5 text-xs font-bold text-cyan-800 hover:text-cyan-900 bg-cyan-100/90 hover:bg-cyan-200/90 border border-cyan-300/80 rounded-full px-3 py-1.5 transition-all shadow-xs"
          title="Open Aura on your mobile phone"
        >
          <QrCode className="w-3.5 h-3.5 text-cyan-700" />
          <span>Mobile QR</span>
        </button>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Install on iPhone / iPad</h3>
              </div>
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <ol className="space-y-3 text-sm text-slate-600 mb-5">
              <li className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 font-semibold text-xs flex items-center justify-center">1</span>
                <span>Open this link in <strong>Safari</strong> on your iPhone.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 font-semibold text-xs flex items-center justify-center">2</span>
                <span>Tap the <strong>Share</strong> button (box with upward arrow) in the Safari toolbar.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 font-semibold text-xs flex items-center justify-center">3</span>
                <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal for Opening directly on Mobile */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-center">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Open on Your Mobile</h3>
              </div>
              <button 
                onClick={() => setShowQR(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-slate-600 mb-3">
              Scan with your phone's camera to open Aura directly in your mobile browser:
            </p>

            <div className="flex justify-center mb-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`} 
                alt="Scan to open on mobile"
                className="w-48 h-48 rounded-lg shadow-sm"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-left mb-3 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-600 font-mono truncate select-all">
                {currentUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shrink-0 flex items-center gap-1 shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={() => setShowQR(false)}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
