import { ResearcherAgent } from '../../agents/researcher';
import { CriticAgent } from '../../agents/critic';
import { ContentManagerAgent } from '../../agents/content-manager';

export class AgentEngine {
  /**
   * 유폐되었던 진짜 정예 에이전트 연합을 다시 소환하여 구동
   */
  static async runAnalysis(ticker: string): Promise<string> {
    console.log(`[AgentEngine] SOVEREIGN COMMAND: Summoning Real Agents for ${ticker}...`);
    
    // 진짜 장군들 소환
    const researcher = new ResearcherAgent();
    const critic = new CriticAgent();
    const editor = new ContentManagerAgent();

    try {
      // 1. 진짜 Researcher: 실시간 SearchService와 LLMService를 사용하여 정밀 분석
      const researchReport = await researcher.analyzeStock(ticker);
      if (!researchReport) throw new Error("Researcher failed to generate report");
      
      // 2. 진짜 Critic: 'The Wall' 원칙에 따라 리포트 검수
      const critique = await critic.reviewReport("Real-time Data Sync", researchReport);
      
      // 3. 진짜 ContentManager: 최종 승인된 데이터를 바탕으로 대본 및 리포트 완성
      const finalReport = await editor.generateScript(ticker, `${researchReport}\n\n[CRITIQUE]: ${critique}`);
      
      return finalReport;
    } catch (e) {
      console.error("[AgentEngine] CRITICAL FAILURE:", e);
      return "분석 엔진의 진짜 심장을 가동하는 중 오류가 발생했습니다. 로직 연결 상태를 확인하십시오.";
    }
  }
}
