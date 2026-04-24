import { ResearcherAgent } from '../agents/researcher';
import { CriticAgent } from '../agents/critic';
import { ContentManagerAgent } from '../agents/content-manager';

export class AgentEngine {
  /**
   * 정예 에이전트 연합(Researcher-Critic-Editor) 구동
   */
  static async runAnalysis(ticker: string): Promise<string> {
    console.log(`[AgentEngine] Starting autonomous analysis for ${ticker}...`);
    
    const researcher = new ResearcherAgent();
    const critic = new CriticAgent();
    const editor = new ContentManagerAgent();

    try {
      // 1. Researcher: 데이터 수집 및 초안 작성
      const rawData = `Real-time Market Data for ${ticker}: Volume Surge Detected, Short Interest High.`;
      const researchReport = await researcher.analyzeStock(ticker, rawData);
      
      // 2. Critic: 리포트 검증 및 비평
      const critique = await critic.reviewReport(rawData, researchReport);
      
      // 3. Editor: 최종 리포트 완성 및 대본 생성
      const finalReport = await editor.generateScript(ticker, `${researchReport}\n\n[Critique]: ${critique}`);
      
      return finalReport;
    } catch (e) {
      console.error("Agent Engine failed:", e);
      return "분석 엔진 가동 중 오류가 발생했습니다. MCP 연결을 확인하십시오.";
    }
  }
}
