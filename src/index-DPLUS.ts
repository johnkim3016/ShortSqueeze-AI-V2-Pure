import { ResearcherAgent } from './agents/researcher';
import { CriticAgent } from './agents/critic';
import { ContentManagerAgent } from './agents/content-manager';
import { SearchService } from './utils/search';
import { StorageService, Insight } from './utils/storage';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * ShortSqueeze AI - Single Scan Runner
 * 대시보드에서 호출하거나 CLI에서 수동으로 실행할 때 사용합니다.
 */
async function main() {
  const ticker = process.argv[2]; // CLI 인자로 티커를 받을 수 있음
  
  const researcher = new ResearcherAgent();
  const critic = new CriticAgent();
  const contentManager = new ContentManagerAgent();
  const searchService = new SearchService();
  const storage = new StorageService();

  if (ticker) {
    // 1. 특정 티커 단일 분석 모드
    console.log(`🚀 [Manual Scan] ${ticker} 분석을 시작합니다...`);
    await processTicker(ticker, researcher, critic, contentManager, storage);
  } else {
    // 2. 시장 전체 탐색 및 상위 종목 스캔 모드
    console.log('🚀 [Market Scan] 시장 전체에서 숏스퀴즈 후보를 탐색합니다...');
    try {
      const searchResults = await searchService.searchTopShortCandidates();
      
      const selectionPrompt = `
다음 검색 결과에서 '네박자 신호(4대 조건)' 중 최소 2개 이상이 충족된 유망한 상위 3개 티커(Ticker)만 쉼표로 구분하여 출력하세요. (예: GME, AMC, CAR)
[검색 결과]:
${searchResults[0]}
`;
      const selection = await researcher.llm.generate(
        "티커만 추출하는 전문가입니다.",
        [{ role: 'user', content: selectionPrompt }],
        'default'
      );

      if (!selection) {
        console.log('[-] 유효한 후보를 찾지 못했습니다.');
        return;
      }

      const tickers = selection.split(',')
        .map((t: string) => t.trim().toUpperCase())
        .filter((t: string) => /^[A-Z]{1,5}$/.test(t));
      
      console.log(`[+] 탐색된 타겟: ${tickers.join(', ')}`);

      for (const t of tickers) {
        await processTicker(t, researcher, critic, contentManager, storage);
      }
    } catch (error) {
      console.error('[Error] 시장 스캔 중 오류:', error);
    }
  }
}

async function processTicker(ticker: string, researcher: ResearcherAgent, critic: CriticAgent, contentManager: ContentManagerAgent, storage: StorageService) {
  console.log(`\n--- [${ticker} 파이프라인 가동] ---`);
  
  // 1. 실시간 데이터 기반 연구원 분석
  const report = await researcher.analyzeStock(ticker);
  if (!report) return;

  // 2. 품질 검수 (QA)
  const review = await critic.reviewReport('Real-time Data', report);
  if (!review) return;
  
  const isApproved = review.includes('[승인]');
  console.log(`[QA 결과] ${isApproved ? '✅ 승인' : '❌ 반려'}`);

  // 3. 방송 대본 생성 (승인 시)
  let script = '';
  if (isApproved) {
    script = await contentManager.generateScript(ticker, report) || '';
  }

  // 4. 결과 저장
  const insight: Insight = {
    ticker,
    report,
    review,
    script,
    isApproved,
    timestamp: new Date().toISOString()
  };

  await storage.saveInsight(insight);
  console.log(`[완료] ${ticker} 분석 결과가 저장되었습니다.`);
}

main().catch(console.error);
