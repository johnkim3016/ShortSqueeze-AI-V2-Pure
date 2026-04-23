import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 저장된 insights.json 경로 (root/data/insights.json)
    const dataPath = path.resolve(process.cwd(), '../data/insights.json');
    
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json([]);
    }

    const data = fs.readFileSync(dataPath, 'utf-8');
    const insights = JSON.parse(data);

    return NextResponse.json(insights);
  } catch (error: any) {
    console.error('[Insights API Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
