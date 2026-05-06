---
id: 34e39462-9450
category: "[[10_Wiki/Projects/Teams_App_Development]]"
confidence_score: 0.98
tags: [Development, UI/UX, React, Dependency, Authentication]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[Teams 앱 개발 환경 설정 및 UI/UX 개선 로그]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> 본 작업 로그는 Teams 애플리케이션의 개발 환경 설정 오류를 해결하고, 인증 절차를 우회하여 브라우저에서 디자인을 개선 및 검증하는 과정에 대한 기록입니다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 프로젝트 진행 시 환경설정(Dependency)과 인증(Auth) 문제를 먼저 해결한 후, 사용자 경험(UX) 향상(UI/Design)을 단계적으로 적용하는 것이 일반적인 워크플로우이다.
- **세부 내용:**
- npm 설치 오류 해결: `npm install` 시 경로 오류를 `Tool_Rental_App/teams-app` 디렉토리 지정으로 해결함.
- 의존성 패키지 설치: `@azure/msal-browser`, `@azure/msal-react`, `@microsoft/teams-js` 등 핵심 인증 패키지를 설치함.
- 개발 환경 구축: 인증 로직을 분리하여 Entra ID 키 없이도 UI를 테스트할 수 있도록 인증 과정을 우회함.
- UI/UX 개선: 현대적인 그라데이션, 그림자, 카드 레이아웃을 적용하여 장비 인벤토리 및 통계 대시보드를 구현하고 모든 텍스트를 한국어로 로컬라이징함.
- 향후 연동 과제: Streamlit 백엔드 연동 및 위키 에이전트를 통한 대화 로그 아카이빙 자동화가 필요함.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/Teams_App_Development]]
- **Related:** [[npm]], [[Microsoft Entra ID]], [[UI/UX Design Principles]], [[Dev Mode]]
- **Raw Source:** [[00_Raw/Conversation_Log_2026-05-04.md]]
