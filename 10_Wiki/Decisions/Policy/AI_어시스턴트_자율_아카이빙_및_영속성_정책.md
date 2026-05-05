---
id: bc4bf0f6-c8c3
category: "[[10_Wiki/Decisions/Policy]]"
confidence_score: 0.98
tags: [Policy, AI, Archiving, Persistence, KnowledgeManagement]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[AI 어시스턴트 자율 아카이빙 및 영속성 정책]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> AI 어시스턴트가 사용자 명령 없이도 대화의 핵심 지식과 운영 원칙을 자율적으로 기록하고 영구적으로 공유하여 프로젝트의 지속성을 확보한다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 시스템의 영속적인 지식 관리를 위해서는, 사용자 인터페이스의 불편함 없이도 의사결정 과정을 자동적으로 포착하고 명시적 정책 문서로 상향 승격시키는 '자율 기록 및 공식화 루프'가 필요하다.
- **세부 내용:**
- AI 어시스턴트는 사용자 명시 명령 없이도 대화 맥락과 주요 마일스톤을 자율적으로 판단하여 아카이빙해야 한다.
- 정책적 의사결정, 기술적 해결책 등 핵심 정보는 즉시 `00_Raw` 영역에 기록되어야 한다.
- 모든 운영 원칙은 `.clinerules` 및 `20_Meta/Policy.md`에 명문화되어 모든 AI 인스턴스가 공유하여 영속성을 확보한다.
- 지식화 및 버전 관리는 위키 에이전트(`agent.py`)를 통해 이루어지며 GitHub에 동기화하는 것이 필수 과정이다.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/Policy]]
- **Related:** [[Wiki Agent]], [[Knowledge Persistence]], [[System Policy]], [[GitHub Sync]]
- **Raw Source:** [[00_Raw/Policy_Update_2026-05-04_1018.md]]
