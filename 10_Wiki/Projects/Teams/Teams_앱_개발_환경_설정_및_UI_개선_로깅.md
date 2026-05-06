---
id: ba95ba16-66b8
category: "[[10_Wiki/Projects/Teams_App_Development]]"
confidence_score: 0.98
tags: [FrontEnd, Azure AD, DevTools, React, Koreanization]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[Teams 앱 개발 환경 설정 및 UI 개선 로깅]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> 이 문서는 개발 환경 설정(경로 오류 해결) 및 인증 로직을 우회하여 Teams 앱의 UI를 디자인적으로 크게 개선하고 검증한 과정을 기록한다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 개발 워크플로우의 효율성 향상은 종종 임시적인 기술적 우회(Dev Mode)를 통해 핵심 기능의 시각적/사용자 경험(UX)을 먼저 확보하는 방식으로 이루어진다.
- **세부 내용:**
- 개발 초기 단계에서 `npm install` 시 발생한 경로 오류는 정확한 서브 디렉토리(`Tool_Rental_App/teams-app`)로 이동하여 해결했다.
- 개발 효율성을 위해 Microsoft Entra ID 인증 로직을 임시로 분리하여, 실제 인증 없이도 브라우저에서 최신 UI를 즉시 확인할 수 있도록 했다 (Dev Mode).
- UI/UX 개선 작업으로 현대적인 그라데이션, 그림자, 카드 레이아웃을 적용하고 장비 인벤토리 및 통계 대시보드를 구현했다.
- 향후 과제로는 Streamlit 백엔드 연동과 위키 에이전트의 자동화된 대화 로그 아카이빙 기능을 활성화하는 것이 남아있다.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/Teams_App_Development]]
- **Related:** [[npm]], [[Microservice Architecture]], [[Dev Mode]], [[Azure AD]]
- **Raw Source:** [[00_Raw/Conversation_Log_2026-05-04.md]]
