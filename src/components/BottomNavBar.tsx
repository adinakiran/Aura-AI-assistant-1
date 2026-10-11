import React from 'react';
import { LayoutGrid, Mail, Calendar, Sparkles } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: 'briefing' | 'mail' | 'agenda' | 'assistant';
  onTabChange: (tab: 'briefing' | 'mail' | 'agenda' | 'assistant') => void;
  mailBadgeCount?: number;
  agendaBadgeCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  mailBadgeCount = 3,
  agendaBadgeCount = 2,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center">
        {/* Tab 1: Briefing */}
        <button
          onClick={() => onTabChange('briefing')}
          className={`flex flex-col items-center justify-center py-1 transition-all ${
            currentTab === 'briefing'
              ? 'text-cyan-700 font-semibold'
              : 'text-slate-500 hover:text-slate-700 font-normal'
          }`}
        >
          <div className="relative p-1">
            <LayoutGrid className={`w-5 h-5 transition-transform ${currentTab === 'briefing' ? 'scale-110' : ''}`} />
          </div>
          <span className="text-[11px] tracking-tight mt-0.5">Briefing</span>
        </button>

        {/* Tab 2: Mail */}
        <button
          onClick={() => onTabChange('mail')}
          className={`flex flex-col items-center justify-center py-1 transition-all ${
            currentTab === 'mail'
              ? 'text-cyan-700 font-semibold'
              : 'text-slate-500 hover:text-slate-700 font-normal'
          }`}
        >
          <div className="relative p-1">
            <Mail className={`w-5 h-5 transition-transform ${currentTab === 'mail' ? 'scale-110' : ''}`} />
            {mailBadgeCount > 0 && (
              <span className="absolute 0 top-0.5 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-cyan-700 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {mailBadgeCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-0.5">Mail</span>
        </button>

        {/* Tab 3: Agenda */}
        <button
          onClick={() => onTabChange('agenda')}
          className={`flex flex-col items-center justify-center py-1 transition-all ${
            currentTab === 'agenda'
              ? 'text-cyan-700 font-semibold'
              : 'text-slate-500 hover:text-slate-700 font-normal'
          }`}
        >
          <div className="relative p-1">
            <Calendar className={`w-5 h-5 transition-transform ${currentTab === 'agenda' ? 'scale-110' : ''}`} />
            {agendaBadgeCount > 0 && (
              <span className="absolute top-0.5 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {agendaBadgeCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-0.5">Agenda</span>
        </button>

        {/* Tab 4: Assistant */}
        <button
          onClick={() => onTabChange('assistant')}
          className={`flex flex-col items-center justify-center py-1 transition-all ${
            currentTab === 'assistant'
              ? 'text-cyan-700 font-semibold'
              : 'text-slate-500 hover:text-slate-700 font-normal'
          }`}
        >
          <div className="relative p-1">
            <Sparkles className={`w-5 h-5 transition-transform ${currentTab === 'assistant' ? 'scale-110' : ''}`} />
          </div>
          <span className="text-[11px] tracking-tight mt-0.5">Assistant</span>
        </button>
      </div>
    </nav>
  );
};
