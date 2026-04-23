import { LLMService } from '../utils/llm';
import { SearchService } from '../utils/search';
import { MemoryService } from '../utils/memory';
import * as fs from 'fs';
import * as path from 'path';

export class ResearcherAgent {
  public llm: LLMService;
  private searchService: SearchService;
  private memory: MemoryService;
  private wikiPath: string;

  constructor() {
    this.llm = new LLMService();
    this.searchService = new SearchService();
    this.memory = new MemoryService();
    // 기존 하네스의 위키를 지식 베이스로 사용
    // 내부로 복사된 위키 데이터 사용
    this.wikiPath = path.resolve(process.cwd(), 'src/lib/data/wiki');
  }

  /**
   * 핵심 투자 원칙 및 숏스퀴즈 지식 로드
   */
  private getMasterKnowledge(): string {
    try {
      const theory = fs.readFileSync(path.join(this.wikiPath, 'master-theory.md'), 'utf-8');
      const tactics = fs.readFileSync(path.join(this.wikiPath, 'tactics-guide.md'), 'utf-8');
      return `
# 핵심 투자 원칙 및 숏스퀴즈 지식 입계치
${theory}

---
# 실전 구축 전략 (The Wall 연동)
${tactics}
      `;
    } catch (e) {
      console.warn('[경고] 위키 지식 로드 실패. 기본 지식을 사용합니다.');
      return '숏스퀴즈는 공매도 세력의 강제 청산을 이용하는 전략입니다.';
    }
  }

  /**
   * 특정 종목분석 수행
   */
  async analyzeStock(ticker: string, manualData?: string): Promise<string | null> {
    const knowledge = this.getMasterKnowledge();
    
    // 1. 실시간 데이터 검색
    const realTimeData = await this.searchService.searchStockShortData(ticker);

    // 2. 과거 기억 소환 (Memory MCP)
    const pastMemory = await this.memory.recallPastInsights(ticker);

    const systemPrompt = `
당신은 ShortSqueeze AI의 '수석 연구원(Lead Researcher)'입니다. 
당신의 지능은 이제 **Memory MCP(장기 기억)**와 **Context7 MCP(최신 기술 컨텍스트)**를 통해 강화되었습니다.

[지식 베이스 및 과거 기억]
${knowledge}

---
[이 티커에 대한 과거 분석 기록]
${pastMemory}

[작성 가이드라인]
1. 해당 종목이 '진짜'인지 '가짜(유동성 함정)'인지 판별하세요. 과거 분석과 비교하여 변화가 있는지 확인하세요.
2. 다음의 '네박자 신호(4대 조건)' 충족 여부를 [O/X]로 명확히 표시하세요.
3. **Context7 활용**: 만약 새로운 금융 데이터 API나 분석 도구의 최신 사용법이 필요하다면, 관련 공식 문서를 찾아보라고 권고할 수 있습니다.
4. 'The Wall' 전략에 따른 진입 타점을 제시하세요.
5. 분석 결과의 핵심 요약은 나중에 **Memory MCP**에 저장될 예정이므로, 요약(Entity)과 특징(Observation)을 명확히 구분하여 작성하세요.
`;

    const userMessage = `
[분석 대상 종목]: ${ticker}

[검색된 실시간 데이터]:
${realTimeData}

${manualData ? `[QA 팀의 개선 피드백]:\n${manualData}\n\n위 피드백과 과거 기록을 모두 반영하여 리포트를 수정 및 완성하세요.` : '위 데이터를 바탕으로 전문적인 리서치 보고서를 작성해줘.'}
`;

    console.log(`[Researcher] ${ticker} 분석 시작 (Memory 기반)...`);
    return this.llm.generate(systemPrompt, [{ role: 'user', content: userMessage }], 'premium');
  }
}

// 테스트 실행 (CLI)
if (require.main === module) {
  const agent = new ResearcherAgent();
  const sampleData = `
    - Ticker: CAR (Avis Budget Group)
    - Short Interest % of Float: 52%
    - Days to Cover: 8.4
    - Borrow Fee: 125%
    - Reg SHO: 8일 연속 등재
    - Catalyst: 어닝 서프라이즈 및 자사주 매입 발표 예정
  `;
  
  agent.analyzeStock('CAR', sampleData).then(report => {
    console.log('\n--- [Researcher 리포트 주초안] ---');
    console.log(report);
  });
}
