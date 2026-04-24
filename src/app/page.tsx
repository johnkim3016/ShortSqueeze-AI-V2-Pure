'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MarketService, MarketSignal } from '@/lib/services/market';
import { AgentEngine } from '@/lib/agents/engine';

export default function Dashboard() {
  const [candidates, setCandidates] = useState<MarketSignal[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // 통합 스캐너 서비스에서 실시간 데이터 로드
    MarketService.getIntegratedCandidates().then(setCandidates);
  }, []);

  const handleAnalyze = async (ticker: string) => {
    setSelectedTicker(ticker);
    setIsAnalyzing(true);
    setAnalysis('');
    
    // 에이전트 엔진 구동 (Researcher -> Critic -> Editor)
    const result = await AgentEngine.runAnalysis(ticker);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Sidebar: Market Scanner Results */}
      <div className="w-1/3 border-r border-white/10 bg-[#0a0a0a] flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            INTEGRATED SCANNER 2.0
          </h1>
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30 animate-pulse">
            LIVE
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {candidates.map((stock) => (
            <motion.div
              key={stock.symbol}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleAnalyze(stock.symbol)}
              className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                selectedTicker === stock.symbol 
                ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                : 'bg-[#111] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter">{stock.symbol}</h3>
                  {stock.isVolumeSurge && (
                    <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                      VOLUME SURGE
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </div>
                  <div className="text-xs text-white/40">${stock.price}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white/5 p-2 rounded-lg">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest">RVOL</div>
                  <div className="text-sm font-mono font-bold text-blue-400">{stock.rvol}x</div>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest">AI Score</div>
                  <div className="text-sm font-mono font-bold text-emerald-400">{stock.score}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main: AI Intelligence Report */}
      <div className="flex-1 bg-black flex flex-col relative overflow-hidden">
        {/* Background Aura */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar z-10">
          <AnimatePresence mode="wait">
            {!selectedTicker ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-white/20"
              >
                <div className="w-20 h-20 border-2 border-dashed border-white/10 rounded-full mb-6 flex items-center justify-center">
                  <span className="text-4xl">🎯</span>
                </div>
                <p className="text-lg font-light tracking-widest uppercase">Select a signal to begin AI analysis</p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedTicker}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
              >
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-600/40">
                    {selectedTicker[0]}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black">{selectedTicker} Intelligence Report</h2>
                    <p className="text-white/40 text-sm">Generated by Managing Editor Agent v2.0</p>
                  </div>
                </div>

                {isAnalyzing ? (
                  <div className="space-y-6">
                    <div className="h-4 bg-white/5 rounded-full w-full overflow-hidden">
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="h-full w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-4 bg-white/5 rounded-full w-full animate-pulse" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="prose prose-invert max-w-none"
                  >
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl leading-relaxed text-white/80 whitespace-pre-wrap font-light text-lg">
                      {analysis}
                    </div>
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
