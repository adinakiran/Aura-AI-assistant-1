import React, { useState } from 'react';
import { X, Mail, CheckCircle2, RefreshCw, Sparkles, Shield, User, Send, ArrowRight } from 'lucide-react';

interface AccountEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
  onSaveAccount: (email: string, name: string) => void;
  onTriggerInboxScan: (email: string) => void;
  onAddCustomEmail: (sender: string, subject: string, snippet: string) => void;
}

export const AccountEmailModal: React.FC<AccountEmailModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  userName,
  onSaveAccount,
  onTriggerInboxScan,
  onAddCustomEmail,
}) => {
  const [emailInput, setEmailInput] = useState(userEmail);
  const [nameInput, setNameInput] = useState(userName);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string | null>(null);

  // Custom email ingest state
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [customSender, setCustomSender] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const finalName = nameInput.trim() || emailInput.split('@')[0];
    onSaveAccount(emailInput.trim(), finalName);
    onClose();
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanStatus(`Scanning incoming messages for ${emailInput}...`);
    setTimeout(() => {
      setScanStatus(`Scanned 42 unread messages for ${emailInput}. 3 urgent executive actions identified.`);
      setIsScanning(false);
      onTriggerInboxScan(emailInput);
    }, 1500);
  };

  const handleIngestEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSender || !customSubject) return;
    onAddCustomEmail(customSender, customSubject, customBody || 'Urgent executive decision required before 11:30 AM.');
    setShowAddEmail(false);
    setCustomSender('');
    setCustomSubject('');
    setCustomBody('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col p-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Configure Your Email</h3>
              <p className="text-[10px] text-cyan-700 font-semibold">Aura Autonomous Inbox Triage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Info Form */}
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Your Email Address
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-cyan-500 focus-within:bg-white transition-all">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. adinakiran2003@gmail.com"
                required
                className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Aura will monitor this address, prioritize urgent messages, and draft executive responses for you.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Your Name / Title
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-cyan-500 focus-within:bg-white transition-all">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Adina"
                className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Inbox Scan Action */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-50 to-sky-50 border border-cyan-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-950">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                <span>Inbox AI Status</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                Active Sync
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Connected to <strong>{emailInput}</strong>. Aura automatically weeds out newsletters and queues high-impact approvals.
            </p>

            <button
              type="button"
              onClick={handleScan}
              disabled={isScanning}
              className="w-full py-2 px-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning Inbox...' : 'Scan My Inbox Now'}</span>
            </button>

            {scanStatus && (
              <p className="text-[10px] text-cyan-900 bg-white/80 p-2 rounded-lg border border-cyan-100 leading-tight font-medium">
                {scanStatus}
              </p>
            )}
          </div>

          {/* Feed a custom incoming email */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAddEmail(!showAddEmail)}
              className="text-xs font-bold text-cyan-800 hover:text-cyan-950 flex items-center gap-1"
            >
              <span>+ Ingest a Test Email to Triage</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            {showAddEmail && (
              <div className="mt-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Sender</span>
                  <input
                    type="text"
                    value={customSender}
                    onChange={(e) => setCustomSender(e.target.value)}
                    placeholder="e.g. Satya Nadella (Microsoft)"
                    className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 mt-0.5"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Subject</span>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="e.g. Partnership Agreement Q4"
                    className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 mt-0.5"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Message Note</span>
                  <textarea
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    placeholder="What requires your approval or attention?"
                    className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 mt-0.5 resize-none h-14"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleIngestEmail}
                  className="w-full py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Add to Inbox
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
            >
              Save Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
