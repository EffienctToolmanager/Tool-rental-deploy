---
id: 0b5500ec-99fb
category: "[[10_Wiki/Projects/Teams_App_Development]]"
confidence_score: 0.98
tags: [Teams, Development, UI/UX, Azure AD, Frontend]
last_reinforced: 2026-05-04
github_commit: "pending"
---

# [[Teams 앱 개발 환경 설정 및 UI 개선 기록]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> 이 문서는 Teams 앱의 기술적 환경 오류를 해결하고, 인증 프로세스를 우회하여 사용자 친화적인 UI를 개선한 개발 과정을 기록한 로그이다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 실제 서비스 개발 과정은 환경 설정 문제 해결(의존성 관리)와 사용자 경험 개선(UI/UX 강화)이 순차적이고 반복적으로 이루어진다.
- **세부 내용:**
- 기술적 문제 해결: `npm install` 시 발생한 경로 오류는 해당 프로젝트 디렉토리(`Tool_Rental_App/teams-app`)로 이동하여 재실행함으로써 해결되었다.
- 개발 효율성 증대: 인증 로직을 분리하여 Microsoft Entra ID 설정 없이 브라우저에서 디자인을 미리 확인할 수 있도록 구현했다.
- UI/UX 개선: `App.css`를 통해 현대적인 그라데이션, 그림자 효과, 카드 레이아웃을 적용하여 전문적인 대시보드 형태를 갖추었다.
- 향후 연결 작업: Streamlit 백엔드와의 연동 및 위키 에이전트의 자동화 기능을 구현해야 한다.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/Teams_App_Development]]
- **Related:** [[npm]], [[React]], [[UI/UX 디자인 원칙]], [[Microsoft Entra ID]]
- **Raw Source:** [[00_Raw/Conversation_Log_2026-05-04.md]]
