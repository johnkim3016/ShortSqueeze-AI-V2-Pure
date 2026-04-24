'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const handleAnalyze = async (ticker: string) => {
    setSelectedTicker(ticker);
    setIsAnalyzing(true);
    setAnalysis('');
    
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker })
      });
      const data = await res.json();
      setAnalysis(data.report || "분석 결과를 가져오지 못했습니다.");
    } catch (e) {
      setAnalysis("서버 연결 실패");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <div className="w-1/3 border-r border-white/10 bg-[#0a0a0a] flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/10 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent mb-6 tracking-tighter">
            INTEGRATED PURE 2.0
          </h1>
          <button 
            onClick={() => fetch('/api/scan', { method: 'POST' })}
            disabled={isScanning}
            className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all ${
              isScanning 
              ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95'
            }`}
          >
            {isScanning ? `SCANNING... ${progress}%` : '🚀 ACTIVATE REAL-TIME SCAN'}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {candidates.map((stock) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleAnalyze(stock.symbol)}
                className={`p-6 rounded-[2rem] cursor-pointer border transition-all ${
                  selectedTicker === stock.symbol 
                  ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                  : 'bg-[#151515] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">{stock.symbol}</h3>
                    {stock.isVolumeSurge && (
                      <span className="text-[10px] font-bold text-orange-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                        VOL SURGE 포착
                      </span>
                    )}
                  </div>
                  <div className={`text-xl font-black ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stock.change}%
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-white/5 px-3 py-2 rounded-xl flex-1 text-center">
                    <div className="text-[9px] text-white/30 uppercase font-bold">RVOL</div>
                    <div className="text-sm font-mono font-bold text-blue-400">{stock.rvol}x</div>
                  </div>
                  <div className="bg-white/5 px-3 py-2 rounded-xl flex-1 text-center">
                    <div className="text-[9px] text-white/30 uppercase font-bold">SCORE</div>
                    <div className="text-sm font-mono font-bold text-emerald-400">{stock.score}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 bg-[#020202] flex flex-col relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="p-12 flex-1 overflow-y-auto z-10">
          <AnimatePresence mode="wait">
            {!selectedTicker ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center opacity-20"
              >
                <div className="text-8xl mb-8">🔭</div>
                <p className="text-xl font-light tracking-[0.5em] uppercase">Ready for Analysis</p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedTicker}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-4xl mx-auto"
              >
                <div className="flex items-end gap-6 mb-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl shadow-blue-600/40">
                    {selectedTicker[0]}
                  </div>
                  <div className="pb-2">
                    <h2 className="text-6xl font-black tracking-tighter">{selectedTicker} <span className="text-white/20">REPORT</span></h2>
                    <p className="text-blue-400 font-mono text-sm tracking-widest mt-2 uppercase">Autonomous AI Intelligence v2.0</p>
                  </div>
                </div>

                {isAnalyzing ? (
                  <div className="space-y-8">
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ x: '-100%' }} animate={{ x: '100%' }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className="h-full w-1/3 bg-blue-500 blur-sm"
                        />
                     </div>
                     <div className="grid grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-32 bg-white/5 rounded-[2rem] animate-pulse border border-white/5" />
                        ))}
                     </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 shadow-2xl leading-relaxed text-white/90 whitespace-pre-wrap font-light text-xl"
                  >
                    {analysis}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
