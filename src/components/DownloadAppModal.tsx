import React, { useState } from 'react';
import { X, Download, Smartphone, Check, Copy, ExternalLink, Globe, FileCode } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  devAppUrl: string;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
  isOpen,
  onClose,
  devAppUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const { install, isInstallable } = usePWAInstall();

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(devAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadOfflineHTML = () => {
    // Generate an offline launcher HTML file for the user to download
    const offlineLauncher = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Aura - Executive Assistant</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=${devAppUrl}">
  <script>window.location.href = "${devAppUrl}";</script>
</head>
<body style="font-family:sans-serif; text-align:center; padding:40px; background:#061021; color:#fff;">
  <h2>Opening Aura Executive Assistant...</h2>
  <p><a href="${devAppUrl}" style="color:#38bdf8;">Click here if not redirected automatically</a></p>
</body>
</html>`;

    const blob = new Blob([offlineLauncher], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Aura-Executive-Assistant.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-sm">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Download & Access Aura</h3>
              <p className="text-[10px] text-slate-500">Install directly onto your mobile phone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Direct Link Box */}
        <div className="p-3.5 rounded-2xl bg-cyan-50/80 border border-cyan-200 mb-4 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-900 block">
            Direct Mobile Access URL
          </span>
          <div className="p-2 rounded-xl bg-white border border-cyan-200 text-left flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-cyan-950 font-bold truncate select-all">
              {devAppUrl}
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-cyan-700 text-white text-xs font-bold hover:bg-cyan-800 shrink-0 flex items-center gap-1 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* 3 Download / Install Options */}
        <div className="space-y-2.5 mb-4">
          {/* Option 1: PWA Install */}
          {isInstallable && (
            <button
              onClick={() => {
                install();
                onClose();
              }}
              className="w-full p-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center justify-between shadow-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>Install App to Home Screen</span>
              </div>
              <span>Tap to Install →</span>
            </button>
          )}

          {/* Option 2: Download Offline Launcher */}
          <button
            onClick={handleDownloadOfflineHTML}
            className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-between shadow-xs transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>Download Offline App Launcher</span>
            </div>
            <span>.html file ↓</span>
          </button>

          {/* Option 3: Open in New Browser Tab */}
          <a
            href={devAppUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-600" />
              <span>Open Fullscreen in New Tab</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Instructions */}
        <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed space-y-1">
          <p><strong>iPhone / Safari:</strong> Open link in Safari → Tap Share icon → Tap "Add to Home Screen".</p>
          <p><strong>Android / Chrome:</strong> Open link in Chrome → Tap Menu (3 dots) → Tap "Install App".</p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
