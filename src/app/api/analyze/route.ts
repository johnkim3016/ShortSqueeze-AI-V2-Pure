import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  const { ticker } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      report: `[Demo Mode] ${ticker} AI Analysis\n\n` +
        `⚠️ GEMINI_API_KEY not configured.\n\n` +
        `To enable real AI analysis:\n` +
        `1. Go to Netlify → Site Settings → Environment Variables\n` +
        `2. Add GEMINI_API_KEY = your Google AI Studio key\n` +
        `3. Redeploy the site`,
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const researchPrompt = `You are a stock research analyst. Analyze ${ticker} for short squeeze potential. Cover: current short interest, float size, recent catalysts, volume pattern, and squeeze probability. Be concise.`;
    const researchResult = await model.generateContent(researchPrompt);
    const research = researchResult.response.text();

    const criticPrompt = `You are a risk-focused critic. Review this analysis and add key risks:\n\n${research}`;
    const criticResult = await model.generateContent(criticPrompt);
    const critique = criticResult.response.text();

    const editorPrompt = `You are an editor. Combine into a final intelligence report for ${ticker}. Clear sections. Max 400 words.\n\nResearch:\n${research}\n\nCritique:\n${critique}`;
    const editorResult = await model.generateContent(editorPrompt);
    const report = editorResult.response.text();

    return NextResponse.json({ report });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ report: `Analysis error for ${ticker}: ${message}` }, { status: 500 });
  }
}
