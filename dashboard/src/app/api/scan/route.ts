import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST() {
  try {
    // 프로젝트 루트 경로 (dashboard의 상위 폴더)
    const rootDir = path.resolve(process.cwd(), '..');
    
    // 워커 실행 명령어
    // 주의: 실무 환경에서는 큐 시스템(Redis/BullMQ)을 쓰는 것이 좋지만, 
    // 여기서는 간단하게 자식 프로세스로 워커의 단발성 실행을 트리거합니다.
    const workerPath = path.join(rootDir, 'src', 'index.ts');
    
    console.log('[Scan API] 트리거 시작:', workerPath);

    // 비동기로 실행 (결과를 기다리지 않고 즉시 응답)
    // 실제 로직은 src/index.ts 또는 독립된 analyzer 스크립트를 실행
    const command = `npx ts-node "${workerPath}"`;
    
    exec(command, { cwd: rootDir }, (error, stdout, stderr) => {
      if (error) {
        console.error(`[Scan API Error] ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`[Scan API Stderr] ${stderr}`);
        return;
      }
      console.log(`[Scan API Success] ${stdout}`);
    });

    return NextResponse.json({ 
      success: true, 
      message: '시장 스캔이 백그라운드에서 시작되었습니다. 결과는 몇 분 후 대시보드에 나타납니다.' 
    });
  } catch (error: any) {
    console.error('[Scan API Global Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
