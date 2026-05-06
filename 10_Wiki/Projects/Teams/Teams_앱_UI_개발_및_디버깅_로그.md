---
id: eec98e40-d20e
category: "[[10_Wiki/Projects/Teams_Integration]]"
confidence_score: 0.95
tags: [Frontend, Teams, React, Development, Debugging, UI/UX]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[Teams 앱 UI 개발 및 디버깅 로그]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> 개발 초기 단계에서 발생하는 의존성 및 인증 문제를 해결하는 동시에, 현대적인 디자인과 사용자 친화적인 UI를 성공적으로 적용하였다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 개발 프로세스는 환경 설정 문제 해결(Fixing the setup)과 기능 구현/개선(Feature iteration)이 순환적으로 이루어진다. 특히, 개발 초기에는 기능 검증을 위해 인증 로직을 분리하는 것이 효율적이다.
- **세부 내용:**
- 기술적 문제 해결: 루트 디렉토리의 `npm install` 오류를 디렉토리 경로 지정 및 필수 패키지(`@azure/msal-*`, `@microsoft/teams-js`) 설치를 통해 해결함.
- 개발 편의성 확보: Microsoft Entra ID 키 없이 UI를 미리 볼 수 있도록 인증 로직을 분리하여 개발 모드(Dev Mode)를 구현함.
- UI/UX 개선: `App.css`에 그라데이션, 그림자, 카드 레이아웃 등 시각적 요소를 적용하고, 장비 인벤토리 및 통계 대시보드를 추가 구현함.
- 현지화 및 검증: 모든 UI 텍스트를 한국어로 적용하고, 로컬 호스트를 통해 프리미엄 수준의 UI가 정상 출력됨을 확인함.
- 향후 연동 계획: Streamlit 백엔드(`app.py`) 및 위키 에이전트(`agent.py`)와의 연동과 배포 환경(`.env` 설정) 복구 작업이 필요함.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/Teams_Integration]]
- **Related:** [[Streamlit]], [[Azure AD / MSAL]], [[Web Development Lifecycle]], [[Environment Variables]]
- **Raw Source:** [[00_Raw/Conversation_Log_2026-05-04.md]]
