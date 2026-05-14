---
id: 17ea0a32-7c55
category: "[[10_Wiki/Decisions/AI_Operation]]"
confidence_score: 0.98
tags: [AI, Policy, Persistence, Automation, Knowledge Management]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[AI 어시스턴트 자율 아카이빙 및 운영 정책]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> AI 어시스턴트는 사용자의 수동 명령 없이도 대화 맥락과 주요 마일스톤을 자율적으로 판단하여 기록하고 업로드함으로써 프로젝트의 지식 영속성을 확보해야 한다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 시스템의 장기적 운영 원칙(Persistence)은 사용자 개입을 최소화하는 자율 아카이빙 메커니즘과 공식적인 규칙 정의(Formalization)를 통해 달성된다.
- **세부 내용:**
- AI 어시스턴트는 명시적 명령 없이 대화의 맥락과 핵심 마일스톤을 자율적으로 판단하여 기록 및 업로드해야 한다.
- 프로젝트의 영속성을 위해 세션이 바뀌어도 일관된 운영 원칙이 유지되도록 해야 한다.
- 핵심 규칙은 자율적인 기록(`00_Raw`)과 시스템 공유 파일(`.clinerules`, `20_Meta/Policy.md`)에 명문화되어 모든 AI 인스턴스에 공유되어야 한다.
- 모든 기록된 지식은 위키 에이전트(`agent.py`)를 통해 구조화되고 GitHub에 동기화되어야 한다.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/AI_Operation]]
- **Related:** [[AI Agent]], [[지식베이스 설계]], [[위키 시스템]], [[운영 정책 수립]]
- **Raw Source:** [[00_Raw/Policy_Update_2026-05-04_1018.md]]
