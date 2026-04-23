import { NextResponse } from 'next/server';
import { ResearcherAgent } from '@/lib/agents/researcher';
import { CriticAgent } from '@/lib/agents/critic';
import { ContentManagerAgent } from '@/lib/agents/content-manager';

export async function POST(request: Request) {
  try {
    const { ticker } = await request.json();
    if (!ticker) return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });

    console.log(`[Analyze API] ${ticker} 분석 시작...`);
    
    const researcher = new ResearcherAgent();
    const critic = new CriticAgent();
    const contentManager = new ContentManagerAgent();

    // 1. 분석
    const report = await researcher.analyzeStock(ticker);
    
    // 2. 검수
    const review = await critic.reviewReport('Manual Search Data', report || '');
    const isApproved = review?.includes('[승인]');

    // 3. 방송 대본 (승인 시)
    let script = '';
    if (isApproved) {
      script = await contentManager.generateScript(ticker, report || '') || '';
    }

    return NextResponse.json({
      ticker,
      report,
      review,
      script,
      isApproved,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[Analyze API Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
