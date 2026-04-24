import { ResearcherAgent } from './agents/researcher';
import { CriticAgent } from './agents/critic';
import { ContentManagerAgent } from './agents/content-manager';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

async function main() {
  console.log('🚀 ShortSqueeze AI 가동 시작...');

  const researcher = new ResearcherAgent();
  const critic = new CriticAgent();
  const contentManager = new ContentManagerAgent();

  const ticker = 'CAR'; // Avis Budget Group
  const sampleData = `
    - Ticker: CAR (Avis Budget Group)
    - Short Interest % of Float: 52%
    - Days to Cover: 8.4
    - Borrow Fee: 125%
    - Reg SHO: 8일 연속 등재
    - 현재 주가: $105.20
    - 'The Wall' 관점: $110 피벗 저항선 근접, 거래량 급증 중.
  `;

  // 1. 연구원 분석
  const report = await researcher.analyzeStock(ticker, sampleData);
  if (!report) return;

  // 2. 품질 검수 (QA)
  const review = await critic.reviewReport(sampleData, report);
  if (!review) return;
  console.log('\n--- [Critic 검수 결과] ---');
  console.log(review);

  // 3. 방송 대본 생성 (승인 가정)
  if (review.includes('승인')) {
    const script = await contentManager.generateScript(ticker, report);
    console.log('\n--- [최종 방송 대본: 월가 시그널] ---');
    console.log(script);
  } else {
    console.log('[경고] 리포트가 반려되었습니다. 다시 리서치를 수행하세요.');
  }
}

main().catch(console.error);
