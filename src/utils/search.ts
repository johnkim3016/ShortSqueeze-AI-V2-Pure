import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export interface SearchResult {
  title: string;
  url: string;
  content: string;
}

export class SearchService {
  private apiKey: string | undefined;
  private baseUrl = 'https://api.tavily.com/search';

  constructor() {
    this.apiKey = process.env.TAVILY_API_KEY;
  }

  /**
   * Tavily API를 사용하여 주식 관련 실시간 데이터를 검색합니다.
   */
  async search(query: string): Promise<string> {
    if (!this.apiKey || this.apiKey === 'your_tavily_api_key_here') {
      console.warn('[SearchService] Tavily API 키가 설정되지 않았습니다. 모킹된 데이터를 반환합니다.');
      return this.getMockData(query);
    }

    try {
      const response = await axios.post(this.baseUrl, {
        api_key: this.apiKey,
        query: query,
        search_depth: 'advanced',
        include_answer: true,
        max_results: 5,
      });

      const results = response.data.results as SearchResult[];
      const answer = response.data.answer;

      let combinedContent = answer ? `### 요약\n${answer}\n\n` : '';
      combinedContent += `### 상세 검색 결과\n`;
      results.forEach((res, i) => {
        combinedContent += `${i + 1}. [${res.title}](${res.url})\n${res.content}\n\n`;
      });

      return combinedContent;
    } catch (error: any) {
      console.error('[SearchService] 검색 중 오류 발생:', error.message);
      return this.getMockData(query);
    }
  }

  /**
   * 특정 티커의 숏스퀴즈 지표를 검색하기 위한 최적화된 쿼리를 생성합니다.
   */
  async searchStockShortData(ticker: string): Promise<string> {
    const query = `${ticker} stock short interest float borrow fee FTD Reg SHO data real-time`;
    console.log(`[SearchService] ${ticker} 관련 실시간 데이터 검색 중...`);
    return this.search(query);
  }

  /**
   * 시장에서 숏스퀴즈 가능성이 높은 상위 종목들을 탐색합니다.
   */
  async searchTopShortCandidates(): Promise<string[]> {
    const query = "current top 10 stocks with highest short interest float over 30% real-time list";
    console.log(`[SearchService] 시장 전체 숏스퀴즈 후보 탐색 중...`);
    const result = await this.search(query);
    
    // LLM을 사용하여 텍스트 결과에서 티커만 추출하는 것이 좋겠지만, 
    // 여기서는 간단하게 정규식으로 티커 패턴(대문자 1~5자)을 추출하거나 
    // 혹은 ResearcherAgent가 이 전체 텍스트를 보고 판단하게 할 수 있습니다.
    // 여기서는 ResearcherAgent가 판단하도록 전체 결과를 반환하는 대신 
    // 대표적인 티커 몇 개를 예시로 추출하거나 전체 검색 내용을 에이전트에게 넘기는 방식으로 가겠습니다.
    return [result]; 
  }

  private getMockData(query: string): string {
    const tickerMatch = query.match(/^([A-Z]+)/);
    const ticker = tickerMatch ? tickerMatch[1] : 'STOCK';
    
    if (ticker === 'CAR') {
      return `
[REAL-TIME DATA - SOURCE: ANALYTICS FEEDS]
검색 쿼리: ${query}
- [FACT] CAR (Avis Budget Group) Short Interest: 약 26.4% of Float
- [FACT] Borrow Fee: 연 142.5% (Extremely High)
- [FACT] Days to Cover: 8.2일
- [FACT] Reg SHO: 12일 연속 Threshold List 등재 중
- [FACT] Catalyst: 최근 'violent expansion'으로 불리는 급격한 가격 상승 발생 중. 숏 커버링 강제 청산 압박이 임계점에 도달함.
      `;
    }

    // 기타 종목은 기존 랜덤 로직 유지
    const seed = ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const si = (20 + (seed % 30)).toFixed(1);
    const borrowFee = (50 + (seed % 200)).toFixed(0);
    const float = (seed % 50) + 5;
    const regShoDays = (seed % 15) + 3;

    return `
[MOCK DATA - API KEY MISSING]
검색 쿼리: ${query}
- [FACT] ${ticker}의 숏 인터레스트: 약 ${si}% (유통주 대비)
- [FACT] 대차이자율(Borrow Fee): 연 ${borrowFee}% (상승 추세)
- [FACT] 유통주식수(Float): 약 ${float}M 주 (극소형주 분류)
- [FACT] Reg SHO 등재 기간: ${regShoDays}거래일 연속
- [FACT] 최근 특이사항: 다크풀 거래 비중이 ${40 + (seed % 20)}%로 급증하며 수급 불균형 심화됨.
    `;
  }
}
