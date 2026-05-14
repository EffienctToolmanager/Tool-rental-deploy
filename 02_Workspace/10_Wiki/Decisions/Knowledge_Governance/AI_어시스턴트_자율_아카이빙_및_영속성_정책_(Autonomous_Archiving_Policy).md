---
id: aadc2bf3-4536
category: "[[10_Wiki/Decisions/Knowledge_Governance]]"
confidence_score: 0.98
tags: [Policy, AI, Archiving, Permanence, Knowledge Management]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[AI 어시스턴트 자율 아카이빙 및 영속성 정책 (Autonomous Archiving Policy)]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> AI 어시스턴트가 사용자 명령 없이도 대화의 핵심 맥락과 주요 마일스톤을 자율적으로 판단하고 기록하여 프로젝트의 영속성을 확보하는 정책을 수립하였다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** AI 지식 아카이빙의 영속성을 확보하기 위해서는 의무적인 자동화된 로깅 루프와 중앙 집중식 정책 공유 메커니즘이 필수적이다.
- **세부 내용:**
- AI 어시스턴트는 명시적 명령 없이도 주요 맥락과 마일스톤을 자율적으로 판단하여 기록하고 업로드한다.
- 자율성이 요구되는 의사결정, 기술적 해결, 정책 수립 내용은 즉시 `00_Raw`에 기록된다.
- 핵심 규칙은 `.clinerules` 및 `20_Meta/Policy.md`에 명문화되어 모든 AI 인스턴스가 공유하는 영속성을 갖는다.
- 모든 기록은 위키 에이전트(`agent.py`)를 통해 지식화되고 GitHub에 자동으로 동기화되는 프로세스를 거친다.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/Knowledge_Governance]]
- **Related:** [[Wiki Agent (agent.py)]], [[Knowledge Persistence Model]], [[Operational Policy Documents]]
- **Raw Source:** [[00_Raw/Policy_Update_2026-05-04_1018.md]]
