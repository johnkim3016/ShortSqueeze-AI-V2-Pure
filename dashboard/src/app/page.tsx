'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  Tv, 
  Menu, 
  ChevronRight, 
  Zap, 
  BarChart3,
  Search,
  Settings,
  Bell
} from 'lucide-react';

export default function LiveBookPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activeTicker, setActiveTicker] = useState('CAR');
  const [autonomousInsights, setAutonomousInsights] = useState<any[]>([]);
  const [activeView, setActiveView] = useState('prologue');
  const [isScanning, setIsScanning] = useState(false);
  const [tickerInput, setTickerInput] = useState('');

  // 자율 분석 결과 로드
  const fetchInsights = async () => {
    try {
      const response = await fetch('/api/insights');
      const data = await response.json();
      setAutonomousInsights(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch insights', e);
    }
  };

  React.useEffect(() => {
    fetchInsights();
    const interval = setInterval(fetchInsights, 30000); // 30초마다 갱신
    return () => clearInterval(interval);
  }, []);

  const triggerScan = async () => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/scan', { method: 'POST' });
      const data = await response.json();
      alert(data.message || '스캔이 시작되었습니다.');
    } catch (e) {
      console.error('Scan trigger failed', e);
    } finally {
      setIsScanning(false);
    }
  };

  const runAnalysis = async (ticker: string) => {
    setIsAnalyzing(true);
    setActiveTicker(ticker);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker })
      });
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-zinc-100 font-sans overflow-hidden">
      {/* --- Sidebar (Navigation) --- */}
      <aside className="w-64 border-r border-zinc-800/50 bg-[#0d0d0f] flex flex-col hidden md:flex">
        <div className="p-6 border-b border-zinc-800/50">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xl tracking-tighter italic">
            <Zap className="fill-amber-500" size={24} />
            ShortSqueeze AI
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">Table of Contents</div>
          <SidebarItem icon={<BookOpen size={18} />} label="프롤로그: 왜 지금 '더 월'인가?" active={activeView === 'prologue'} onClick={() => setActiveView('prologue')} />
          <SidebarItem icon={<ChevronRight size={18} />} label="제1장. 월가의 설계자들" active={activeView === 'chapter1'} onClick={() => setActiveView('chapter1')} />
          <SidebarItem icon={<TrendingUp size={18} />} label="제2장. 승자의 공식: 세력 차트" active={activeView === 'chapter2'} onClick={() => setActiveView('chapter2')} />
          <SidebarItem icon={<Zap size={18} />} label="제3장. 숏스퀴즈 마스터" active={activeView === 'chapter3'} onClick={() => setActiveView('chapter3')} />
          <SidebarItem icon={<BarChart3 size={18} />} label="제5장. 실전 수익의 법칙" active={activeView === 'chapter5'} onClick={() => setActiveView('chapter5')} />
          
          <div className="pt-8 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">AI Agents</div>
          <SidebarItem icon={<Search size={18} />} label="Researcher Dashboard" color="text-blue-400" active={activeView === 'researcher'} onClick={() => setActiveView('researcher')} />
          <SidebarItem icon={<Tv size={18} />} label="Broadcast Automation" color="text-purple-400" active={activeView === 'broadcast'} onClick={() => setActiveView('broadcast')} />
          <SidebarItem icon={<ShieldCheck size={18} />} label="QA Verification" color="text-emerald-400" active={activeView === 'qa'} onClick={() => setActiveView('qa')} />
        </nav>

        <div className="p-4 border-t border-zinc-800/50">
          <div className="bg-zinc-900/50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-black text-xs">KS</div>
            <div className="text-sm">
              <div className="font-semibold text-zinc-200">Kim Sabu</div>
              <div className="text-xs text-zinc-500">Super Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-zinc-800/50 bg-[#0a0a0c]/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-zinc-500">Book</span>
            <ChevronRight size={14} className="text-zinc-700" />
            <span className="text-zinc-200 font-medium">프롤로그: 왜 지금 '더 월'인가?</span>
          </div>
          
            <div className="flex items-center gap-6">
              <button 
                onClick={triggerScan}
                disabled={isScanning}
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20 text-xs hover:bg-amber-500/20 transition-all disabled:opacity-50"
              >
                <Search size={14} className="text-amber-500" />
                <span className="text-amber-500 font-bold uppercase tracking-widest">{isScanning ? 'Scanning...' : 'Manual Scan'}</span>
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-xs">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-indigo-400 font-bold uppercase tracking-widest">Autonomous Monitoring: <b className="text-white">ACTIVE</b></span>
              </div>
              <Bell size={20} className="text-zinc-400 cursor-pointer" />
            </div>
        </header>

        {/* --- Render Conditional Content --- */}
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-20">
            {activeView === 'prologue' ? (
              <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 p-8">
                {/* The Book Content (Left/Center) */}
                <article className="lg:w-2/3 space-y-8">
                  <div className="prose prose-invert prose-zinc max-w-none">
                    <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-500 bg-clip-text text-transparent">
                      프롤로그: 왜 지금 '더 월(The Wall)'인가?
                    </h1>
                    
                    <p className="text-xl text-zinc-400 leading-relaxed italic border-l-4 border-amber-500/50 pl-6 py-2">
                      "자본 시장의 마이크로스트럭처(Market Microstructure) 관점에서 볼 때, 주가 형성은 단순히 기업 가치의 수렴 과정이 아닌 '유동성의 전쟁'입니다."
                    </p>
                  </div>

                  {/* AI Insight Box (Main Analysis) */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                      <Zap size={80} className="text-amber-500" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-amber-500 font-bold mb-4 uppercase tracking-widest text-xs">
                        <Search size={16} />
                        AI Live Analysis Engine
                      </div>
                      {analysisResult ? (
                        <div className="space-y-4 animate-in fade-in duration-700">
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-amber-500">{analysisResult.ticker} 분석이 완료되었습니다.</h3>
                            {analysisResult.report.includes('[SIMULATION REPORT]') && (
                              <span className="px-2 py-1 bg-zinc-800 text-zinc-500 text-[10px] font-bold rounded-md border border-zinc-700 animate-pulse">
                                SIMULATION MODE
                              </span>
                            )}
                          </div>
                          <div className="bg-black/30 p-4 rounded-xl border border-zinc-800 max-h-96 overflow-y-auto text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {analysisResult.report}
                          </div>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => {
                                setAnalysisResult(null);
                                setTickerInput('');
                              }}
                              className="px-4 py-2 border border-zinc-700 text-zinc-400 rounded-lg hover:bg-zinc-800 text-sm font-bold"
                            >
                              닫기
                            </button>
                            {analysisResult.isApproved && (
                              <button 
                                onClick={() => setActiveView('broadcast')}
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 text-sm font-bold flex items-center gap-2"
                              >
                                <Tv size={16} /> 방송 대본 보기
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-2xl font-bold mb-4">현재 숏스퀴즈 테마가 강력하게 형성 중입니다.</h3>
                          <p className="text-zinc-400 mb-6 font-medium">
                            Market Pulse에 등재된 종목이나 분석하고 싶은 티커를 입력하세요. 
                            Researcher Agent가 실시간 데이터를 즉시 분석합니다.
                          </p>
                          
                          <div className="flex gap-3 max-w-md w-full">
                            <div className="flex-1 relative">
                              <input 
                                type="text"
                                value={tickerInput}
                                onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                                onKeyDown={(e) => e.key === 'Enter' && tickerInput && runAnalysis(tickerInput)}
                                placeholder="Enter Ticker (eg. GME, AMC)"
                                className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-all font-bold tracking-widest text-amber-500 placeholder:text-zinc-700"
                              />
                            </div>
                            <button 
                              onClick={() => tickerInput && runAnalysis(tickerInput)}
                              disabled={isAnalyzing || !tickerInput}
                              className="px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                            >
                              {isAnalyzing ? (
                                <><span className="animate-spin text-xl">⏳</span></>
                              ) : (
                                <>분석 시작 <Search size={18} /></>
                              )}
                            </button>
                          </div>
                          
                          <div className="mt-6 flex flex-wrap gap-2">
                             <span className="text-[10px] text-zinc-600 font-bold uppercase py-1">Quick Scan:</span>
                             {['GME', 'AMC', 'CAR', 'AI'].map(t => (
                               <button 
                                 key={t}
                                 onClick={() => runAnalysis(t)}
                                 className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] text-zinc-500 hover:text-amber-500 hover:border-amber-500/30 transition-all"
                               >
                                 ${t}
                               </button>
                             ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Autonomous Intelligence Feed */}
                  <div className="space-y-6 mt-12">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Zap className="text-indigo-400" size={20} />
                        자율 지능 감시 피드 (Latest Autonomous Insights)
                      </h3>
                      <span className="text-xs text-zinc-500 font-medium">Auto-refresh every 30s</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {autonomousInsights.length > 0 ? autonomousInsights.map((insight, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setAnalysisResult(insight)}
                          className="p-5 rounded-2xl bg-[#0d0d0f] border border-zinc-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                {insight.ticker}
                              </div>
                              <div className="text-xs">
                                <div className="font-bold text-zinc-200">AI Autonomous Scan</div>
                                <div className="text-zinc-500 text-[10px]">{new Date(insight.timestamp).toLocaleString()}</div>
                              </div>
                            </div>
                            {insight.isApproved && <ShieldCheck size={16} className="text-emerald-500" />}
                          </div>

                          <div className="flex gap-1.5 mb-3">
                            <SignalBadge label="유통" active={insight.review.includes('유통')} />
                            <SignalBadge label="숏" active={insight.review.includes('숏')} />
                            <SignalBadge label="이자" active={insight.review.includes('이자')} />
                            <SignalBadge label="SHO" active={insight.review.includes('SHO')} />
                          </div>

                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                            {insight.report}
                          </p>
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className={insight.isApproved ? "text-emerald-500" : "text-amber-500"}>
                              {insight.isApproved ? "검수 승인 완료" : "검수 대기/반려"}
                            </span>
                            <span className="text-zinc-600 group-hover:text-indigo-400 flex items-center gap-1 transition-colors">
                              VIEW REPORT <ChevronRight size={10} />
                            </span>
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-2 py-12 border-2 border-dashed border-zinc-800/50 rounded-3xl flex flex-col items-center justify-center text-zinc-600 italic text-sm">
                          <Zap size={32} className="mb-4 opacity-20" />
                          자율 분석 데이터가 아직 없습니다. 워커를 가동해 주세요.
                        </div>
                      )}
                    </div>
                  </div>
                </article>

                {/* Dashboard Widgets (Right) */}
                <aside className="lg:w-1/3 space-y-6">
                <div className="p-6 rounded-2xl bg-[#0d0d0f] border border-zinc-800/50 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <TrendingUp size={20} className="text-amber-500" />
                      Market Pulse
                    </h3>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Updated Now</span>
                  </div>
                  
                  <div className="space-y-4">
                    <SqueezeCard ticker="CAR" float="52%" change="+12.4%" status="Critical" onClick={() => runAnalysis('CAR')} active={activeTicker === 'CAR'} />
                    <SqueezeCard ticker="AI" float="38.5%" change="+4.2%" status="Warning" onClick={() => runAnalysis('AI')} active={activeTicker === 'AI'} />
                    <SqueezeCard ticker="SOUN" float="35.2%" change="-1.2%" status="Watching" onClick={() => runAnalysis('SOUN')} active={activeTicker === 'SOUN'} />
                    <SqueezeCard ticker="BTDR" float="30.1%" change="+8.1%" status="Watching" onClick={() => runAnalysis('BTDR')} active={activeTicker === 'BTDR'} />
                  </div>
                </div>

                <div className={`p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-red-500/10 border border-amber-500/20 transition-all duration-500 ${analysisResult ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-amber-500" />
                    분석 보고서
                  </h3>
                  <p className="text-sm text-zinc-400 mb-4 font-medium leading-relaxed">
                    {analysisResult ? 'AI 에이전트의 냉정한 분석이 완료되었습니다.' : '입력된 종목이 없거나 분석 대기 중입니다.'}
                  </p>
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5 text-sm text-zinc-300 font-medium leading-relaxed h-32 overflow-y-auto scrollbar-hide">
                    {analysisResult?.report ? (
                      <div className="space-y-2">
                        <div className="text-amber-500 font-bold mb-1">🎯 핵심 요약</div>
                        {analysisResult.report.split('## 3. 결론')[1] || analysisResult.report.split('결론')[1] || analysisResult.report.slice(0, 100) + '...'}
                      </div>
                    ) : '"현재 분석 대기 중입니다."'}
                  </div>
                  <button 
                    disabled={!analysisResult}
                    onClick={() => {
                       // 보고서 탭으로 이동하거나 모달을 다시 띄우는 용도로 활용 가능
                       // 현재는 메인 영역의 분석 결과를 유지하도록 함
                    }}
                    className="w-full mt-4 py-2 border border-amber-500/30 text-amber-500 text-sm font-bold rounded-xl hover:bg-amber-500/10 active:scale-95 transition-all disabled:opacity-30"
                  >
                    보고서 전문 보기
                  </button>
                </div>
              </aside>
            </div>
            ) : activeView === 'chapter1' ? (
              <div className="max-w-4xl mx-auto p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                    Chapter 01
                  </div>
                  <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase">
                    월가의 <span className="text-amber-500">설계자들</span>
                  </h1>
                  <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl font-medium">
                    월스트리트의 보이지 않는 손, 마켓 메이커와 기관들의 알고리즘이 어떻게 개인 투자자들의 심리를 이용해 '유동성 함정'을 설계하는지 분석합니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TheoryCard 
                    title="알고리즘 매매의 본질" 
                    desc="단순한 매수/매도가 아닌, 호가창의 빈틈을 이용한 '유동성 공급'의 가면을 쓴 수익 극대화 전략입니다."
                    icon={<Settings size={20} />}
                  />
                  <TheoryCard 
                    title="패닉 셀 유도(Stop Hunting)" 
                    desc="주요 지지선(The Wall) 아래로 가격을 순간적으로 밀어내어 대량의 손절 물량을 받아내는 기법입니다."
                    icon={<Zap size={20} />}
                  />
                  <TheoryCard 
                    title="전환사채(CB)의 덫" 
                    desc="기업의 부채가 주식으로 전환되는 과정에서 발생하는 공매도 세력의 인위적인 주가 억제 메커니즘입니다."
                    icon={<BarChart3 size={20} />}
                  />
                </div>

                <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <ShieldCheck className="text-amber-500" />
                    설계자의 관점에서 시장 보기
                  </h3>
                  <div className="space-y-4 text-zinc-400 leading-relaxed">
                    <p>시장은 효율적이지 않습니다. 특히 소형주 시장은 <b>비대칭적 정보</b>와 <b>수급의 편향</b>이 지배하는 공간입니다. 우리가 '차트'라고 부르는 것은 사실 설계자들이 남긴 '유동성의 흔적'에 불과합니다.</p>
                    <p>제1장에서는 그들의 '수학적 하한선'을 역산하여, 그들이 물량을 털기 위해 반드시 가격을 올려야만 하는 지점을 찾아내는 법을 배웁니다.</p>
                  </div>
                </div>
              </div>
            ) : activeView === 'chapter2' ? (
              <div className="max-w-4xl mx-auto p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                    Chapter 02
                  </div>
                  <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase">
                    승자의 공식: <span className="text-amber-500">세력 차트</span>
                  </h1>
                  <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl font-medium">
                    공식 지표 뒤에 숨겨진 실질적인 수급 불균형을 포착하십시오. 다크풀 데이터와 FTD(결제불이행) 물량을 역산하여 월가의 진짜 빚을 찾아냅니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-blue-400">
                      <BarChart3 size={24} /> 다크풀 & FTD 역산
                    </h3>
                    <div className="p-6 rounded-2xl bg-black/50 border border-blue-500/20 font-mono text-sm space-y-3">
                      <div className="text-zinc-500">// 실질 FTD 산출 공식</div>
                      <div className="text-zinc-300">
                        <span className="text-amber-500">const</span> potentialFTD = <br/>
                        &nbsp;&nbsp;누적거래량 * 다크풀비중(45%) * 결제실패율(2%);
                      </div>
                      <div className="pt-4 text-xs text-zinc-500">
                        * 산출된 물량이 Float의 20% 이상일 때 임계점 도달
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        무차입 공매도 포착
                      </h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        공식 숏 플로트가 낮더라도 Reg SHO에 장기 등재된 종목은 다크풀 내 MM들의 무차입 공매도가 누적되었을 확률이 매우 높습니다.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Zap size={16} className="text-amber-500" />
                        Exit Liquidity 분석
                      </h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        FTD가 아무리 높더라도 전환사채(CB) 등이 엑시트 구멍이 된다면 스퀴즈는 약해집니다. RW(증권철회) 공시를 반드시 동반 체크하십시오.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeView === 'chapter3' ? (
              <div className="max-w-4xl mx-auto p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                    Chapter 03
                  </div>
                  <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase">
                    The Wall: <span className="text-amber-500">Master Theory</span>
                  </h1>
                  <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl font-medium">
                    숏스퀴즈의 본질은 '수급의 외통수'입니다. 공매도 세력이 물리적 퇴로를 잃고 시장가로 주식을 되사야만 하는 폭발적 메커니즘을 마스터하십시오.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6 group hover:border-amber-500/30 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Zap size={24} />
                    </div>
                    <h3 className="text-2xl font-bold">4대 필수 조건 (The Quad)</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 text-[10px] font-bold shrink-0 mt-0.5">1</div>
                        <div>
                          <div className="text-zinc-200 font-bold text-sm">극소형 유통주식수 (Micro Float)</div>
                          <div className="text-zinc-500 text-xs">유동 물량이 적을수록 폭발력은 수십 배로 증폭됩니다.</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 text-[10px] font-bold shrink-0 mt-0.5">2</div>
                        <div>
                          <div className="text-zinc-200 font-bold text-sm">높은 숏 플로트 (30%+)</div>
                          <div className="text-zinc-500 text-xs">공매도 비중이 높을수록 탈출구는 좁아집니다.</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 text-[10px] font-bold shrink-0 mt-0.5">3</div>
                        <div>
                          <div className="text-zinc-200 font-bold text-sm">살인적 대차이자율 (100%+)</div>
                          <div className="text-zinc-500 text-xs">공매도 유지 비용이 한계를 넘어서는 순간 투매가 시작됩니다.</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 text-[10px] font-bold shrink-0 mt-0.5">4</div>
                        <div>
                          <div className="text-zinc-200 font-bold text-sm">Reg SHO 결제 불이행 등재</div>
                          <div className="text-zinc-500 text-xs">FTD(결제 불이행) 누적은 시간 폭탄의 타이머입니다.</div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-8">
                    <div className="p-8 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                      <h3 className="text-2xl font-bold flex items-center gap-2">
                        <TrendingUp className="text-indigo-400" />
                        비대칭 수익 구간
                      </h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        감정을 버리십시오. 세력이 전환사채를 털어내기 위해 억지로라도 가격을 올려야만 하는 <b>'수학적 하한선'</b>을 계산하여, 하락 리스크는 10% 미만이나 상승 기댓값은 200% 이상인 구간에서만 방아쇠를 당깁니다.
                      </p>
                    </div>

                    <div className="p-8 rounded-3xl border border-zinc-800 space-y-4 bg-black/40">
                      <h3 className="text-xl font-bold">진짜 vs 가짜 구분법</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                          <span className="text-emerald-400 text-xs font-bold uppercase">Real Squeeze</span>
                          <span className="text-zinc-500 text-[10px]">공매도 퇴로 물리적 차단</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                          <span className="text-red-400 text-xs font-bold uppercase">Liquidity Trap</span>
                          <span className="text-zinc-500 text-[10px]">비정상적 회전율 + 설거지</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeView === 'chapter5' ? (
              <div className="max-w-4xl mx-auto p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                    Chapter 05
                  </div>
                  <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase">
                    실전 <span className="text-amber-500">수익의 법칙</span>
                  </h1>
                  <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl font-medium">
                    스나이퍼처럼 기다리고, 세력처럼 생각하며, 기계적으로 탈출하십시오. 실전에서 즉시 적용 가능한 3:3:3 매매 시스템을 공개합니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-emerald-400">
                      <Zap size={20} /> 분할 진입 원칙 (3:3:3)
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-black/30 border border-zinc-800">
                        <div className="text-xs font-bold text-zinc-500 mb-1">1차 진입 (30%)</div>
                        <div className="text-sm text-zinc-300">대차이자율 임계치 돌파 및 Reg SHO 확인</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-black/30 border border-zinc-800">
                        <div className="text-xs font-bold text-zinc-500 mb-1">2차 진입 (30%)</div>
                        <div className="text-sm text-zinc-300">The Wall(주요 저항선) 거래량 돌파 포인트</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-black/30 border border-zinc-800">
                        <div className="text-xs font-bold text-zinc-500 mb-1">3차 진입 (30%)</div>
                        <div className="text-sm text-zinc-300">본격 스퀴즈 징후 및 방송 자동화 신호 포착</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-amber-500">
                      <ShieldCheck size={20} /> 수익 확정 시스템 (5:5)
                    </h3>
                    <div className="space-y-6">
                      <div className="relative pl-8 border-l-2 border-amber-500/20 py-2">
                        <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-amber-500" />
                        <div className="font-bold text-lg mb-1">1단계: 50% 분기점</div>
                        <p className="text-sm text-zinc-400">수익률 30~50% 도달 시 절반을 기계적으로 익절하여 심리적 우위를 점합니다.</p>
                      </div>
                      <div className="relative pl-8 border-l-2 border-amber-500/20 py-2">
                        <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-amber-500" />
                        <div className="font-bold text-lg mb-1">2단계: 광기의 정점</div>
                        <p className="text-sm text-zinc-400">거래량이 유통물량을 상회하는 '광기의 폭발' 구간에서 남은 전량을 미련 없이 털고 나옵니다.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeView === 'researcher' ? (
              <div className="max-w-6xl mx-auto p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                      Agent Center
                    </div>
                    <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase">
                      Researcher <span className="text-amber-500">Dashboard</span>
                    </h1>
                  </div>
                  <div className="flex gap-4">
                    <StatBox label="Ticks Scanned" value="2,450" color="text-zinc-100" />
                    <StatBox label="AI Confidence" value="98.2%" color="text-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Search size={20} className="text-blue-400" />
                        Live Monitoring Logs
                      </h3>
                      <div className="space-y-3 font-mono text-[11px] h-96 overflow-y-auto scrollbar-hide bg-black/40 p-6 rounded-2xl border border-white/5 leading-relaxed">
                        <div className="text-blue-400">[07:12:45] Researcher Agent initialized...</div>
                        <div className="text-zinc-500">[07:12:46] Scanning Reg SHO FTD lists for Micro-caps...</div>
                        <div className="text-emerald-500">[07:13:02] Potential Candidate Found: BTDR (Short Float: 30.1%)</div>
                        <div className="text-zinc-500">[07:13:05] Analyzing Dark Pool volume for BTDR...</div>
                        <div className="text-amber-500">[07:13:20] Alert: Borrow Fee for CAR exceeds 150%!</div>
                        <div className="text-zinc-500">[07:14:01] Processing Ticker: GME - Cross-referencing with Master Theory...</div>
                        <div className="text-blue-400 animate-pulse">[07:14:15] Critic Agent reviewing GME report...</div>
                        <div className="text-zinc-600">[07:14:20] Wait... Waiting for API update...</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-blue-400">Agent Performance</h4>
                      <div className="space-y-4">
                        <ProgressBar label="Scanning Accuracy" value={95} />
                        <ProgressBar label="Data Integrity" value={88} />
                        <ProgressBar label="Response Time" value={92} />
                      </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Active Tasks</h4>
                      <div className="space-y-2">
                        {['FTD Calculation', 'Dark Pool Analysis', 'Option Flow Scan'].map(task => (
                          <div key={task} className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/5 text-xs">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                             {task}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeView === 'broadcast' ? (
              <div className="max-w-5xl mx-auto p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest">
                    Automation Engine
                  </div>
                  <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase">
                    Broadcast <span className="text-amber-500">Automation</span>
                  </h1>
                </div>

                <div className="grid grid-cols-1 gap-8">
                   <div className="p-1 rounded-[40px] bg-gradient-to-br from-purple-500/20 to-amber-500/20 border border-white/10 shadow-2xl overflow-hidden">
                      <div className="bg-[#0a0a0c] rounded-[39px] p-12 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#0a0a0c] to-transparent z-10" />
                         <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0a0a0c] to-transparent z-10" />
                         
                         <div className="h-[500px] overflow-y-auto scrollbar-hide py-32 text-center space-y-12 teleprompter-container">
                            <p className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                               {analysisResult?.script || '"현재 대기 중인 방송 대본이 없습니다. 종목을 분석하여 대본을 생성하세요."'}
                            </p>
                         </div>
                      </div>
                   </div>

                   <div className="flex justify-center gap-6">
                      <button className="px-8 py-4 bg-purple-500 text-white font-bold rounded-2xl hover:bg-purple-600 transition-all flex items-center gap-3 active:scale-95 shadow-lg shadow-purple-500/20">
                         <Tv size={20} /> Start Live Stream
                      </button>
                      <button className="px-8 py-4 border border-zinc-800 text-zinc-400 font-bold rounded-2xl hover:bg-zinc-900 transition-all active:scale-95">
                         Download Full Script (PDF)
                      </button>
                   </div>
                </div>
              </div>
            ) : activeView === 'qa' ? (
              <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in slide-in-from-bottom duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                      <ShieldCheck className="text-emerald-400" size={32} />
                      자율 QA 팀 검수 대시보드
                    </h2>
                    <p className="text-zinc-500 mt-2">AI가 스스로의 허점을 찾아내고 개선하는 '냉정한 피드백'의 기록입니다.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl w-40 text-center">
                      <div className="text-xs text-zinc-500 uppercase font-bold mb-1">총 검수 횟수</div>
                      <div className="text-2xl font-bold">{autonomousInsights.length}</div>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl w-40 text-center">
                      <div className="text-xs text-zinc-500 uppercase font-bold mb-1">자율 승인율</div>
                      <div className="text-2xl font-bold text-emerald-500">
                        {autonomousInsights.length > 0 
                          ? Math.round((autonomousInsights.filter(i => i.isApproved).length / autonomousInsights.length) * 100) 
                          : 0}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {autonomousInsights.map((insight, idx) => (
                    <div key={idx} className="bg-[#0d0d0f] border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-all">
                      <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/30">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center font-black text-xl">
                            {insight.ticker}
                          </div>
                          <div>
                            <div className="font-bold flex items-center gap-2 uppercase tracking-widest text-sm">
                              QA Verification Process
                              <span className={`px-2 py-0.5 rounded text-[10px] ${insight.isApproved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                {insight.isApproved ? 'FINAL APPROVED' : 'REJECTED'}
                              </span>
                            </div>
                            <div className="text-xs text-zinc-500 mt-1">{new Date(insight.timestamp).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="text-xs font-mono text-zinc-500">
                          Revisions: {insight.qaHistory?.length || 1}
                        </div>
                      </div>

                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Search size={14} /> Researcher Draft (Final)
                          </h4>
                          <div className="bg-black/30 p-4 rounded-xl border border-zinc-800 text-sm text-zinc-400 h-64 overflow-y-auto leading-relaxed">
                            {insight.report}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-400" /> Independent QA Feedback
                          </h4>
                          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-sm text-emerald-500/80 h-64 overflow-y-auto italic font-medium leading-relaxed">
                            {insight.review}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
                <div className="p-8 rounded-full bg-zinc-900/50 border border-zinc-800 animate-pulse">
                  <TrendingUp size={48} className="opacity-20" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight uppercase bg-gradient-to-r from-zinc-500 to-zinc-800 bg-clip-text text-transparent">
                  View Currently Under Construction
                </h2>
                <p className="text-sm italic">사부님, 이 공간은 현재 AI 에이전트들이 데이터를 구축 중입니다.</p>
                <button 
                  onClick={() => setActiveView('prologue')}
                  className="px-6 py-2 border border-zinc-700 rounded-xl hover:bg-zinc-800 hover:text-white transition-all text-xs font-bold"
                >
                  메인 화면으로 돌아가기
                </button>
              </div>
            )}
          </main>

        {/* --- Bottom Ticker (Breaking News) --- */}
        <footer className="h-10 bg-amber-500 text-black flex items-center overflow-hidden whitespace-nowrap font-bold text-xs uppercase tracking-tighter">
          <div className="animate-marquee flex gap-12 px-4 italic">
            <span>[BREAKING] CAR SHORT INTEREST HITS 52.4% - MAGIN CALL RISK ACCELERATING</span>
            <span className="opacity-50">•</span>
            <span>[NEWS] BNAI ANNOUNCES REVERSE SPLIT - POTENTIAL 2400% SQUEEZE ARCHETYPE</span>
            <span className="opacity-50">•</span>
            <span>[BROADCAST] KIM SABU WALGA SIGNAL STARTING IN 5 MINUTES</span>
            <span className="opacity-50">•</span>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

function SqueezeCard({ ticker, float, change, status, onClick, active }: { ticker: string, float: string, change: string, status: string, onClick?: () => void, active?: boolean }) {
  const statusColor = {
    'Critical': 'text-red-500 bg-red-500/10 border-red-500/20',
    'Warning': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    'Watching': 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  }[status as 'Critical' | 'Warning' | 'Watching'];

  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all cursor-pointer group ${active ? 'bg-amber-500/5 border-amber-500/50' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`font-bold text-lg transition-colors ${active ? 'text-amber-500' : 'text-white group-hover:text-amber-500'}`}>{ticker}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${statusColor}`}>
          {status}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className="flex flex-col">
          <span className="text-zinc-500 font-medium">Short Float</span>
          <span className="text-zinc-100 font-bold">{float}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-zinc-500 font-medium">24h Change</span>
          <span className={change.startsWith('+') ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
            {change}
          </span>
        </div>
      </div>
    </div>
  );
}
function SidebarItem({ icon, label, active = false, color = "text-zinc-400", onClick }: { icon: React.ReactNode, label: string, active?: boolean, color?: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group ${active ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-zinc-800/30 text-zinc-400 hover:text-zinc-200'}`}
    >
      <span className={active ? 'text-amber-500' : `${color} group-hover:text-zinc-200 transition-colors`}>{icon}</span>
      <span className="text-sm font-medium tracking-tight truncate">{label}</span>
      {active && <div className="ml-auto w-1 h-4 bg-amber-500 rounded-full" />}
    </div>
  );
}

function SignalBadge({ label, active }: { label: string, active: boolean }) {
  return (
    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border transition-all ${active ? 'bg-amber-500/10 border-amber-500/40 text-amber-500' : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-600'}`}>
      {label}
    </span>
  );
}

function TheoryCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/30 transition-all group">
      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="font-bold text-zinc-200 mb-2">{title}</h4>
      <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl min-w-32 text-center">
      <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1 tracking-widest">{label}</div>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
    </div>
  );
}

function ProgressBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 bg-black rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
