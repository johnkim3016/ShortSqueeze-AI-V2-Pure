# AGENTS.md — ShortSqueeze AI V2 Pure

이 저장소는 **Antigravity(Hermes)** 가 오케스트레이션하는 4개 에이전트 팀이 구축한 숏스퀴즈 분석 대시보드입니다.

## 에이전트 팀 구성

| 에이전트 | 역할 |
|---|---|
| 🕵️ Researcher | 실시간 숏 인터레스트 / FTD / 대차이자율 수집 및 분석 |
| 💻 Developer | Next.js 15 대시보드 구축 + Netlify 배포 관리 |
| ✍️ Content Manager | 분석 결과를 방송 대본 / 유튜브 스크립트로 변환 |
| 🛡️ QA/Critic | The Wall 원칙 기반 팩트체크 및 최종 검증 |

## 신규 에이전트 빠른 시작

1. **저장소 클론**
   ```bash
   git clone https://github.com/johnkim3016/ShortSqueeze-AI-V2-Pure.git
   cd ShortSqueeze-AI-V2-Pure
   npm install
   ```

2. **환경변수 설정** (`.env` 파일)
   ```
   GEMINI_API_KEY=your_google_ai_studio_key
   ```

3. **로컬 실행**
   ```bash
   npm run dev
   # → http://localhost:3000
   ```

4. **배포 상태 확인**
   - Netlify 대시보드에서 `ShortSqueeze-AI-V2-Pure` 저장소 연결 여부 확인

## 아키텍처

```
사용자 요청
  → Scanner (RVOL/Volume Surge 감지)
  → IntegrationService (데이터 통합)
  → /api/analyze (Gemini 3단계 분석: Researcher → Critic → Editor)
  → UnifiedDashboard (결과 렌더링)
```

## 핵심 원칙 (The Wall)
- 모든 분석은 QA/Critic 에이전트의 검증을 통과해야 함
- 할루시네이션 방지: 실제 데이터 기반 분석 우선
- 사부님(김도준) 승인 없이 배포 금지

---
*Antigravity (오케스트레이터) 작성 | 2026-05-03*
