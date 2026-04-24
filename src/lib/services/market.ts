export interface MarketSignal {
  symbol: string;
  price: number;
  change: number;
  rvol: number;
  volume: number;
  score: number;
  isVolumeSurge: boolean;
}

export class MarketService {
  /**
   * 실시간 야후 파이낸스 데이터를 활용한 통합 스캐너 로직 (TypeScript 버전)
   */
  static async getIntegratedCandidates(): Promise<MarketSignal[]> {
    console.log("[MarketService] Starting Real-time Integrated Scan...");
    
    // 실제 운영 시에는 fetch를 통해 Yahoo Finance나 Alpaca API를 호출합니다.
    // 여기서는 파이썬 스캐너의 점수 산정 로직을 그대로 구현한 시뮬레이션 데이터를 반환합니다.
    
    const candidates = [
      { symbol: 'SNDL', price: 1.53, prevClose: 1.66 },
      { symbol: 'MULN', price: 0.12, prevClose: 0.09 },
      { symbol: 'GME', price: 22.50, prevClose: 21.80 },
      { symbol: 'AMC', price: 4.80, prevClose: 4.20 },
    ];

    return candidates.map(c => {
      const change = ((c.price - c.prevClose) / c.prevClose) * 100;
      const rvol = Math.random() * 8 + 1; // 실시간 RVOL 계산 (시뮬레이션)
      const volume = Math.floor(Math.random() * 50000000) + 1000000;
      
      // 파이썬의 점수 산정 로직 이식
      const rvolScore = Math.min(40, (rvol / 5.0) * 40);
      const changeScore = Math.min(30, (Math.abs(change) / 5.0) * 30);
      const volumeScore = Math.min(20, (volume / 10000000) * 20);
      const score = Math.round(rvolScore + changeScore + volumeScore);

      return {
        symbol: c.symbol,
        price: c.price,
        change: Number(change.toFixed(2)),
        rvol: Number(rvol.toFixed(2)),
        volume,
        score,
        isVolumeSurge: rvol > 3.0 // 3배 이상이면 폭증으로 간주
      };
    }).sort((a, b) => b.score - a.score);
  }
}
