import * as fs from 'fs';
import * as path from 'path';

export interface Insight {
  ticker: string;
  report: string;
  review: string;
  script: string;
  isApproved: boolean;
  timestamp: string;
  qaHistory?: {
    iteration: number;
    feedback: string;
    report: string;
  }[];
}

export class StorageService {
  private dataPath: string;

  constructor() {
    this.dataPath = path.resolve(__dirname, '../../data/insights.json');
    this.ensureDataDirectory();
  }

  private ensureDataDirectory() {
    const dir = path.dirname(this.dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, JSON.stringify([], null, 2));
    }
  }

  /**
   * 새로운 통찰 결과 저장
   */
  async saveInsight(insight: Insight): Promise<void> {
    const insights = await this.getAllInsights();
    
    // 중복 제거: 동일한 티커가 있으면 기존 항목 삭제 (최신 정보로 갱신하기 위함)
    const filteredInsights = insights.filter(item => item.ticker !== insight.ticker);
    
    filteredInsights.unshift(insight); // 최신 항목을 상단에 추가
    
    // 최대 100개까지만 보관
    const limitedInsights = filteredInsights.slice(0, 100);
    
    fs.writeFileSync(this.dataPath, JSON.stringify(limitedInsights, null, 2));
    console.log(`[Storage] ${insight.ticker} 분석 결과 저장 및 중복 제거 완료.`);
  }

  /**
   * 모든 통찰 결과 로드
   */
  async getAllInsights(): Promise<Insight[]> {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('[Storage] 데이터 로드 실패:', e);
      return [];
    }
  }

  /**
   * 최신 통찰 결과 1개 로드
   */
  async getLatestInsight(): Promise<Insight | null> {
    const insights = await this.getAllInsights();
    return insights.length > 0 ? insights[0] : null;
  }
}
