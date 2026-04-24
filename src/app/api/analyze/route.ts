import { NextResponse } from 'next/server';
import { AgentEngine } from '@/lib/agents/engine';

export async function POST(req: Request) {
  try {
    const { ticker } = await req.json();
    if (!ticker) return NextResponse.json({ error: "Ticker is required" }, { status: 400 });

    console.log(`[API] Running AI analysis for ${ticker}...`);
    const report = await AgentEngine.runAnalysis(ticker);
    
    return NextResponse.json({ report });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
