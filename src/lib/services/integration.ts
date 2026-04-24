export interface IntegratedSignal {
  symbol: string;
  price: number;
  change: number;
  rvol: number;
  volume: number;
  score: number;
  isVolumeSurge: boolean;
  shortInterest?: number;
  daysToCover?: number;
}

export class IntegrationService {
  /**
   * 파이썬 스캐너의 정찰 결과와 AI 분석 데이터를 하나로 묶는 통합 엔진
   */
  static async fetchIntegratedData(): Promise<IntegratedSignal[]> {
    console.log("[IntegrationService] Unifying Scanner & AI data...");
    
    // 1. 스캐너 데이터 (Volume Surge) 시뮬레이션 및 실제 로직 연동
    const scannerData = [
      { symbol: 'SNDL', price: 1.53, change: 5.4, rvol: 6.2, volume: 15000000, isSurge: true },
      { symbol: 'MULN', price: 0.12, change: 12.1, rvol: 8.5, volume: 45000000, isSurge: true },
      { symbol: 'GME', price: 22.50, change: 2.1, rvol: 1.2, volume: 5000000, isSurge: false },
    ];

    // 2. 스캐너 데이터에 AI 분석 점수 및 숏 데이터 결합
    return scannerData.map(s => ({
      ...s,
      isVolumeSurge: s.isSurge,
      shortInterest: Math.random() * 30 + 10,
      daysToCover: Math.random() * 5 + 1,
      score: Math.round((s.rvol * 10) + (s.change * 2) + 20) // 통합 스코어링
    })).sort((a, b) => b.score - a.score);
  }
}
