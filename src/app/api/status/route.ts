import { NextResponse } from 'next/server';

export async function GET() {
  // 간단한 상태 확인용
  return NextResponse.json({
    online: true,
    version: "2.0.0-pure"
  });
}
