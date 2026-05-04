---
id: 573adc52-12cc
category: "[[10_Wiki/Decisions/System_Policy]]"
confidence_score: 0.98
tags: [AI, Agent, Policy, Persistence, Automation, Knowledge_Management]
last_reinforced: 2026-05-04
github_commit: "pending"
---

# [[AI 어시스턴트 자율 아카이빙 및 영속성 정책 수립]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> AI 어시스턴트는 사용자 명시적 지시 없이도 대화의 중요 마일스톤과 핵심 의사결정 과정을 자율적으로 기록하고 공유함으로써 지식의 영속성을 확보해야 한다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 지속 가능한 지식 시스템을 구축하려면, 프로세스 자체가 아카이빙을 주도하는 자율적인 메커니즘(Self-Documenting Loop)이 필수적이다.
- **세부 내용:**
- 자율성 원칙: 모든 주요 의사결정, 기술적 해결 방안, 정책 수립 내용은 즉시 지정된 `00_Raw` 채널에 기록되어야 한다.
- 영속성 확보: 핵심 운영 원칙은 `.clinerules` 파일과 `20_Meta/Policy.md`를 통해 명문화되어 모든 AI 인스턴스가 공유하는 공통 자산이 되어야 한다.
- 연동 및 지식화: 모든 기록은 위키 에이전트(`agent.py`)를 경유하여 공식 지식으로 체계화되고 GitHub에 동기화되는 프로세스를 거친다.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/System_Policy]]
- **Related:** [[AI Agent Workflow]], [[Knowledge Persistence]], [[Policy Implementation]], [[GitHub Synchronization]]
- **Raw Source:** [[00_Raw/Policy_Update_2026-05-04_1018.md]]
