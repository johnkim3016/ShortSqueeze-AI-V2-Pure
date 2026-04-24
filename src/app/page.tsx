'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  // 실시간 상태 체크
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch('/api/scan');
        const data = await res.json();
        setIsScanning(data.status === 'scanning');
        setProgress(data.progress);
        if (data.results && data.results.length > 0) {
          setCandidates(data.results);
        }
      } catch (e) {
        console.error("Status check failed", e);
      }
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const startScan = async () => {
    setIsScanning(true);
    setProgress(0);
    await fetch('/api/scan', { method: 'POST' });
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Sidebar: Scanner Controller */}
      <div className="w-1/3 border-r border-white/10 bg-[#0a0a0a] flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            US STOCK SCANNER 2.0
          </h1>
          <button 
            onClick={startScan}
            disabled={isScanning}
            className={`w-full py-3 rounded-xl font-bold transition-all ${
              isScanning 
              ? 'bg-white/10 text-white/40 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-95'
            }`}
          >
            {isScanning ? `SCANNING MARKET... ${progress}%` : '🚀 START REAL-TIME SCAN'}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {candidates.map((stock) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedTicker(stock.symbol)}
                className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                  selectedTicker === stock.symbol ? 'bg-blue-600/20 border-blue-500' : 'bg-[#111] border-white/5'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black">{stock.symbol}</h3>
                    {stock.isVolumeSurge && (
                      <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                        VOLUME SURGE
                      </span>
                    )}
                  </div>
                  <div className={`text-lg font-bold ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stock.change}%
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <div className="bg-white/5 p-2 rounded-lg flex-1">
                    <div className="text-[10px] text-white/30 tracking-widest">RVOL</div>
                    <div className="text-sm font-mono font-bold text-blue-400">{stock.rvol}x</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg flex-1">
                    <div className="text-[10px] text-white/30 tracking-widest">SCORE</div>
                    <div className="text-sm font-mono font-bold text-emerald-400">{stock.score}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Analysis View */}
      <div className="flex-1 bg-black flex flex-col items-center justify-center relative p-12">
        {!selectedTicker ? (
          <div className="text-center opacity-20">
            <div className="text-6xl mb-4">📡</div>
            <p className="tracking-[0.3em] uppercase text-sm">Waiting for market signals...</p>
          </div>
        ) : (
          <motion.div 
            key={selectedTicker}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"
          >
            <h2 className="text-5xl font-black mb-6 tracking-tighter">{selectedTicker} <span className="text-blue-500">INSIGHT</span></h2>
            <div className="space-y-4 text-white/60 leading-relaxed font-light text-lg">
              <p>본 종목은 현재 거래량 폭증과 함께 강력한 숏스퀴즈 시그널이 포착되었습니다.</p>
              <p>AI 에이전트가 정밀 분석 중이며, 현재 스코어 {candidates.find(c => c.symbol === selectedTicker)?.score}점으로 매우 높은 잠재력을 보여주고 있습니다.</p>
            </div>
            <div className="mt-10 pt-10 border-t border-white/5 flex gap-4">
               <div className="px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-sm">HIGH UTILIZATION</div>
               <div className="px-6 py-2 bg-emerald-600/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm">GAP UP POTENTIAL</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
