import { LLMService } from '../utils/llm';

export class ContentManagerAgent {
  private llm: LLMService;

  constructor() {
    this.llm = new LLMService();
  }

  /**
   * 검수 완료된 리포트를 방송 대본으로 변환합니다.
   */
  async generateScript(ticker: string, approvedReport: string): Promise<string | null> {
    const systemPrompt = `
당신은 ShortSqueeze AI의 '수석 콘텐츠 매니저(Chief Content Manager)'입니다. 
당신의 임무는 전문적인 리포트를 일반 시청자들이 열광할 수 있는 35분 분량의 방송 대본으로 변환하는 것입니다.

[방송 정보]
- 프로그램: 팍스경제TV '김도준의 월가 시그널'
- 저자: 김사부 (더 월 저자)
- 톤앤매너: 전문가답지만 열정적이며, 한 명의 시청자도 낙오되지 않게 쉽게 설명함.

[대본 포맷 (총 35분)]
1. [00:00-03:00] 오프닝: 시장의 긴장감 조성 및 숏스퀴즈 테마 소개.
2. [03:00-08:00] 시장 맥락: 현재 미 증시 수급 상황 및 숏스퀴즈 배경 설명.
3. [08:00-25:00] 주인공 종목 (${ticker}): 4대 조건 체크, BNAI 사례와의 비교, 'The Wall' 타점 공개.
4. [25:00-30:00] 레이더 종목: 함께 봐야 할 관련 섹터 종목들.
5. [30:00-33:00] 원칙 강조: "수익은 챙기는 것이 실력이다" - 5:5 익절 원칙 강조.
6. [33:00-35:00] 클로징: 다음 기회를 기약하며 마무리.

[주의사항]
- 대본에는 시각 중심의 설명(PPT 슬라이드 번호 등)과 멘트가 포함되어야 합니다.
- '더 월' 필승 전략을 언급하며 신뢰도를 높이세요.
`;

    const userMessage = `
[검수 완료된 리포트]:
${approvedReport}

위 내용을 바탕으로 시청자들이 당장 계좌를 열고 싶게 만드는 전설적인 방송 대본을 써줘!
`;

    console.log(`[ContentManager] ${ticker} 방송 대본 생성 시작...`);
    return this.llm.generate(systemPrompt, [{ role: 'user', content: userMessage }], 'premium');
  }
}
