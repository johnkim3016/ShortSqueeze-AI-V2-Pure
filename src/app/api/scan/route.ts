import { NextResponse } from 'next/server';
import { MarketService } from '@/lib/services/market';

// 임시 스캔 상태 저장소 (실제 운영 시에는 Redis나 DB 권장)
let scanStatus = {
  isScanning: false,
  progress: 0,
  results: []
};

export async function POST() {
  if (scanStatus.isScanning) {
    return NextResponse.json({ message: "이미 스캔이 진행 중입니다." }, { status: 400 });
  }

  // 스캔 시작 (비동기 시뮬레이션)
  scanStatus.isScanning = true;
  scanStatus.progress = 0;
  
  // 백그라운드 작업 시작 (실제 데이터 수집)
  (async () => {
    try {
      for (let i = 0; i <= 100; i += 10) {
        scanStatus.progress = i;
        await new Promise(r => setTimeout(r, 1000)); // 스캔 과정 시뮬레이션
      }
      scanStatus.results = await MarketService.getIntegratedCandidates() as any;
      scanStatus.isScanning = false;
    } catch (e) {
      console.error("Scan error:", e);
      scanStatus.isScanning = false;
    }
  })();

  return NextResponse.json({ message: "정찰이 시작되었습니다." });
}

export async function GET() {
  return NextResponse.json({
    status: scanStatus.isScanning ? "scanning" : "idle",
    progress: scanStatus.progress,
    results: scanStatus.results
  });
}
