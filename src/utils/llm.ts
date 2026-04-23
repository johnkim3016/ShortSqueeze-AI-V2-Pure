import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';

dotenv.config();

const MODELS = {
  default: "gemini-1.5-flash-latest",
  premium: "gemini-1.5-pro-latest",
};

type ModelType = keyof typeof MODELS;

export class LLMService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey || apiKey === 'your_google_api_key_here') {
      console.warn("[LLMService] GOOGLE_API_KEY가 설정되지 않았습니다. 분석 기능은 모의 데이터 모드로 작동합니다.");
      this.genAI = null as any;
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  /**
   * 텍스트 생성을 수행합니다.
   */
  async generate(system: string, userMessages: any[], modelType: ModelType = 'default'): Promise<string | null> {
    if (!this.genAI) {
      return this.getMockResponse(system, userMessages);
    }
    
    const modelName = MODELS[modelType];
    
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: system,
      });

      const history = userMessages.slice(0, -1).map(msg => ({
        role: (msg.role === 'assistant' ? 'model' : 'user') as "user" | "model",
        parts: [{ text: msg.content }]
      }));
      
      const lastMessage = userMessages[userMessages.length - 1].content;

      const chatSession = model.startChat({ history });
      const result = await chatSession.sendMessage(lastMessage);
      return result.response.text();
    } catch (error: any) {
      console.error(`[Gemini SDK 오류] generate 실패:`, error.message);
      
      // API 키 오루 또는 모델을 찾을 수 없는 경우 (404) 모의 데이터로 대응
      if (
        error.message.includes('API key not valid') || 
        error.message.includes('API_KEY_INVALID') ||
        error.message.includes('404') ||
        error.message.includes('not found')
      ) {
        console.warn('[LLM] API 호출 불가 (키 오류 또는 모델 부재). 개발용 모의 데이터를 반환합니다.');
        return this.getMockResponse(system, userMessages);
      }

      if (modelType === 'default') {
        console.log('[LLM] 프리미엄 모델로 재시도 중...');
        return this.generate(system, userMessages, 'premium');
      }
      throw error;
    }
  }

  /**
   * API 키가 없을 때를 위한 고품질 모의 응답 생성
   */
  private getMockResponse(system: string, userMessages: any[]): string {
    const lastMessage = userMessages[userMessages.length - 1].content;
    const tickerMatch = lastMessage.match(/\[분석 대상 종목\]: ([A-Z]+)/);
    const ticker = tickerMatch ? tickerMatch[1] : 'STOCK';

    // 검색 데이터에서 수치 추출 시도
    const siMatch = lastMessage.match(/숏 인터레스트: 약 ([\d.]+)%/);
    const feeMatch = lastMessage.match(/대차이자율\(Borrow Fee\): 연 (\d+)%/);
    const floatMatch = lastMessage.match(/유통주식수\(Float\): 약 ([\d.]+)M/);
    const regShoMatch = lastMessage.match(/Reg SHO 등재 기간: (\d+)거래일/);

    const si = siMatch ? siMatch[1] : '30.0';
    const fee = feeMatch ? feeMatch[1] : '100';
    const float = floatMatch ? floatMatch[1] : '10';
    const regSho = regShoMatch ? regShoMatch[1] : '5';

    if (system.includes('티커만 추출')) {
      return 'GME, AMC, CAR';
    }

    if (system.includes('연구원')) {
      return `
# [SIMULATION REPORT] ${ticker} 숏스퀴즈 분석 리포트
> **주의**: 본 리포트는 AI API 키가 비활성화된 상태에서 검색 데이터를 바탕으로 생성된 시뮬레이션 결과입니다.

## 1. 네박자 신호 (4대 조건) 분석
- **유통주식수 (Micro-float)**: [O] 약 ${float}M 주. 유통 물량이 매우 적어 수급 폭발 시 제어가 불가능한 구조입니다.
- **높은 숏 플로트**: [O] 현재 Float 대비 ${si}% 수준입니다. 공매도 세력의 탈출구가 극히 제한적입니다.
- **살인적 대차이자율**: [O] 연 ${fee}%를 기록 중입니다. 공매도 포지션 유지 비용이 한계치에 도달했습니다.
- **Reg SHO 등재**: [O] ${regSho}일 연속 등재. FTD(결제 불이행) 물량이 시장 시스템에 누적되어 강제 상환 압박이 거셉니다.

## 2. 'The Wall' 타점 및 전략
- **진입 전략**: 현재 검색 데이터상 ${ticker}는 수급 불균형이 임계점을 넘었습니다. 
- **1차 진입**: 주요 매물대(The Wall) 돌파 확인 시 진입.
- **리스크**: 시뮬레이션 모드이므로 실제 거래 데이터와 오차가 있을 수 있습니다.

## 3. 결론
본 종목은 현재 ${si}%의 높은 숏 비중과 ${fee}%의 대차이자율이라는 '비대칭적 수급 외통수'에 걸려 있습니다. 팩트 기반 데이터상 숏스퀴즈 발생 확률이 매우 높게 산출됩니다.
      `;
    }

    if (system.includes('콘텐츠 매니저')) {
      return `
[00:00-05:00] 안녕하세요, 숏스퀴즈 AI 방송입니다. 오늘의 주인공은 ${ticker}입니다.
[05:00-15:00] 수치로 보는 팩트: 숏 플로트 ${si}%, 대차이자율 ${fee}%. 이건 폭발할 수밖에 없는 숫자들입니다.
[15:00-20:00] 전략 제안: ${ticker}의 유통물량은 단 ${float}M 주에 불과합니다. 적은 매수세로도 상한가를 뚫을 수 있습니다.
      `;
    }

    return `[SIMULATION RESPONSE] ${ticker}에 대한 분석이 완료되었습니다. (SI: ${si}%, Fee: ${fee}%)`;
  }
}
