import cron from 'node-cron';
import { ResearcherAgent } from './agents/researcher';
import { CriticAgent } from './agents/critic';
import { ContentManagerAgent } from './agents/content-manager';
import { SearchService } from './utils/search';
import { StorageService, Insight } from './utils/storage';
import * as dotenv from 'dotenv';

dotenv.config();

class AutonomousWorker {
  private researcher = new ResearcherAgent();
  private critic = new CriticAgent();
  private contentManager = new ContentManagerAgent();
  private searchService = new SearchService();
  private storage = new StorageService();

  /**
   * 전체 시스템 구동
   */
  async start() {
    console.log('🤖 ShortSqueeze AI 자율 워커 가동 시작...');
    
    // 1. 즉시 한 번 실행
    await this.runAutomationCycle();

    // 2. 스케줄러 등록 (매 정시마다 실행: 0 * * * *)
    // 미 증시 시간(한국 시간 밤~새벽)에 맞춰 조정 가능
    cron.schedule('0 * * * *', async () => {
      console.log(`[${new Date().toISOString()}] 주기적 자동 스캔 시작...`);
      await this.runAutomationCycle();
    });

    console.log('✅ 스케줄러 등록 완료. 시스템이 상시 감시 모드에 진입했습니다.');
  }

  /**
   * 한 번의 자동화 사이클 수행
   */
  private async runAutomationCycle() {
    try {
      // 1. 시장 전체 탐색 및 종목 리스트 확보
      const searchResults = await this.searchService.searchTopShortCandidates();
      
      // Researcher가 검색 결과에서 상위 티커 3개를 골라내도록 요청
      const selectionPrompt = `
당신은 최고의 숏스퀴즈 분석가입니다. 
다음 검색 결과에서 '네박자 신호(4대 조건)' 중 최소 2개 이상이 충족된 유망한 상위 3개 티커(Ticker)만 쉼표로 구분하여 출력하세요. (예: GME, AMC, CAR)

[4대 조건]: 극소형 유통주, 높은 숏플로트, 높은 대차이자율, Reg SHO 등재

[검색 결과]:
${searchResults[0]}
`;
      const selection = await this.researcher.llm.generate(
        "사용자의 요청에 따라 티커만 추출하세요.",
        [{ role: 'user', content: selectionPrompt }],
        'default'
      );

      if (!selection) return;
      const tickers = selection.split(',').map((t: string) => t.trim().toUpperCase()).filter((t: string) => /^[A-Z]{1,5}$/.test(t));
      
      console.log(`[Worker] 포착된 타겟 티커: ${tickers.join(', ')}`);

      // 2. 각 티커별 파이프라인 가동
      for (const ticker of tickers) {
        await this.processTicker(ticker);
      }

    } catch (error) {
      console.error('[Worker Error] 사이클 실행 중 오류:', error);
    }
  }

  private async processTicker(ticker: string) {
    console.log(`[Worker] ${ticker} 자동 분석 및 자율 QA 개선 루프 시작...`);
    
    let currentReport = '';
    let currentReview = '';
    let isApproved = false;
    let iterations = 0;
    const maxIterations = 3;
    const qaHistory = [];

    try {
      while (!isApproved && iterations < maxIterations) {
        iterations++;
        console.log(`[Worker] ${ticker} 분석 시도 #${iterations}...`);

        // 1. 분석 (첫 시도는 데이터만, 이후는 피드백 포함)
        currentReport = await this.researcher.analyzeStock(ticker, currentReview) || '';
        if (!currentReport) break;

        // 2. 냉정한 QA 검수
        const reviewResult = await this.critic.reviewReport('Autonomous Search Data', currentReport);
        if (!reviewResult) break;
        
        currentReview = reviewResult;
        isApproved = currentReview.includes('[승인]');
        
        console.log(`[Worker] ${ticker} QA 결과: ${isApproved ? '✅ 승인' : '❌ 반려 (수정 지시)'}`);

        // 히스토리 기록
        qaHistory.push({
          iteration: iterations,
          feedback: currentReview,
          report: currentReport
        });

        if (isApproved) break;
      }

      // 3. 방송 대본 생성 (최종 승인된 경우에만)
      let script = '';
      if (isApproved) {
        script = await this.contentManager.generateScript(ticker, currentReport) || '';
      }

      // 4. 최종 결과 저장
      const insight: Insight = {
        ticker,
        report: currentReport,
        review: currentReview,
        script,
        isApproved,
        timestamp: new Date().toISOString(),
        qaHistory
      };

      await this.storage.saveInsight(insight);

    } catch (e) {
      console.error(`[Worker Error] ${ticker} 루프 처리 실패:`, e);
    }
  }
}

// 워커 실행
const worker = new AutonomousWorker();
worker.start().catch(console.error);
