'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntegrationService } from '@/lib/services/integration';

export default function UnifiedDashboard() {
  const [signals, setSignals] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    IntegrationService.fetchIntegratedData().then(setSignals);
  }, []);

  const runFullAnalysis = async (ticker: string) => {
    setLoading(true);
    setReport('');
    // 통합 API 호출 (Scanner + AI)
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker })
    });
    const data = await res.json();
    setReport(data.report);
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#020202] text-white font-sans overflow-hidden">
      {/* Integrated Control Panel */}
      <div className="w-[400px] border-r border-white/5 bg-[#050505] flex flex-col">
        <div className="p-8 border-b border-white/5">
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
            UNIFIED COMMAND 2.0
          </h1>
          <p className="text-[10px] text-white/30 tracking-[0.3em] mt-2 font-bold">SCANNER + AI AGENTS</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {signals.map((s) => (
            <motion.div
              key={s.symbol}
              onClick={() => { setSelected(s); runFullAnalysis(s.symbol); }}
              className={`p-6 rounded-[2.5rem] cursor-pointer border transition-all ${
                selected?.symbol === s.symbol ? 'bg-blue-600/10 border-blue-500 shadow-2xl' : 'bg-[#0a0a0a] border-white/5'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter">{s.symbol}</h3>
                  {s.isVolumeSurge && <span className="text-[9px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full animate-pulse">VOLUME SURGE</span>}
                </div>
                <div className={`text-xl font-black ${s.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{s.change}%</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                 <StatBox label="RVOL" value={`${s.rvol}x`} color="text-blue-400" />
                 <StatBox label="SI %" value={`${s.shortInterest?.toFixed(1)}%`} color="text-purple-400" />
                 <StatBox label="SCORE" value={s.score} color="text-emerald-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Unified Intelligence View */}
      <div className="flex-1 relative flex flex-col p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
               <div className="text-9xl mb-8">🛰️</div>
               <p className="text-2xl font-thin tracking-[1em]">SYSTEM READY</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={selected.symbol}>
               <div className="mb-12">
                 <h2 className="text-7xl font-black tracking-tighter mb-2">{selected.symbol}</h2>
                 <div className="flex gap-4 text-xs font-bold tracking-widest text-white/30 uppercase">
                    <span>Scanner Detected: {selected.isVolumeSurge ? 'YES' : 'NO'}</span>
                    <span>•</span>
                    <span>AI Analysis: {loading ? 'IN PROGRESS...' : 'COMPLETE'}</span>
                 </div>
               </div>

               {loading ? (
                 <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-white/5 rounded-full w-full" />
                    <div className="h-4 bg-white/5 rounded-full w-[80%]" />
                    <div className="h-4 bg-white/5 rounded-full w-[90%]" />
                 </div>
               ) : (
                 <div className="bg-[#080808] border border-white/5 rounded-[3rem] p-12 text-xl font-light leading-relaxed text-white/80 whitespace-pre-wrap">
                    {report}
                 </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: any) {
  return (
    <div className="bg-white/5 p-2 rounded-2xl text-center">
      <div className="text-[8px] text-white/20 font-bold uppercase">{label}</div>
      <div className={`text-xs font-mono font-bold ${color}`}>{value}</div>
    </div>
  );
}
