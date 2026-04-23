import { LLMService } from '../utils/llm';

export class CriticAgent {
  private llm: LLMService;

  constructor() {
    this.llm = new LLMService();
  }

  /**
   * 연구원이 작성한 리포트를 검수합니다.
   * 이제 Puppeteer MCP를 통해 대시보드의 시각적 상태를 확인하고,
   * Sequential Thinking MCP를 활용하여 논리적 완결성을 검증할 수 있습니다.
   */
  async reviewReport(originalData: string, researchReport: string, dashboardUrl?: string): Promise<string | null> {
    const systemPrompt = `
당신은 ShortSqueeze AI의 **'수석 품질 검수관(Chief QA Auditor)'**입니다. 
당신의 임무는 리서치 리포트의 결함을 찾아내고, 'The Wall' 투자 원칙 및 대시보드 렌더링 상태를 최종 검증하는 것입니다.

[검수 가이드라인]
1. 시각적 검수 (Puppeteer 활용 가능): 대시보드 URL이 제공되면, 데이터가 올바른 위치에 시각적으로 잘 표현되고 있는지 확인하세요.
2. 논리적 추론 (Sequential Thinking 활용 권장): 데이터 간의 인과관계가 명확한지, 숏스퀴즈 발생 가능성 분석에 모순은 없는지 단계별로 깊게 파고드세요.
3. 타협 없는 객관성: AI가 스스로 만든 결과물에 대해 나타낼 수 있는 자가 편향(Self-bias)을 완전히 제거하세요.

[결과 형식]
- 판정: [승인] / [반려]
- 시각적 확인 결과: (대시보드 렌더링 및 UI 상태 지적)
- 논리적 결함 분석: (Sequential Thinking을 통해 발견된 논리적 허점)
- 개선 가이드: (Researcher가 리포트를 수정할 때 반드시 반영해야 할 구체적인 사항)
`;

    const userMessage = `
[원본 데이터]:
${originalData}

[연구원 리포트]:
${researchReport}

${dashboardUrl ? `[확인할 대시보드 URL]: ${dashboardUrl}` : ''}

위 리포트와 대시보드 상태를 매섭게 검수하고 최종 판정을 내려줘.
`;

    console.log(`[Critic] 강화된 검수 프로세스 시작...`);
    return this.llm.generate(systemPrompt, [{ role: 'user', content: userMessage }], 'premium');
  }

  /**
   * 대시보드 스크린샷 캡처 및 분석 (Puppeteer 연동용 플레이스홀더)
   */
  async performVisualCheck(url: string): Promise<string> {
    // 실제 Puppeteer MCP 도구 호출은 상위 워커나 서버 레이어에서 수행됨을 가정하거나,
    // 여기서 직접 도구 호출 로직을 연결할 수 있습니다.
    return `[Visual Check] ${url} 에 대한 시각적 검증 준비 완료.`;
  }
}
