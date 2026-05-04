---
id: 8dc3fddb-bf35
category: "[[10_Wiki/Decisions/System_Policy]]"
confidence_score: 0.98
tags: [정책, AI 어시스턴트, 지식관리, 영속성, 자동화]
last_reinforced: 2026-05-04
github_commit: "pending"
---

# [[AI 어시스턴트 자율 아카이빙 및 영속성 정책 수립]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> AI 어시스턴트가 사용자 명령 없이도 대화의 주요 맥락과 마일스톤을 자율적으로 판단하여 기록하고 공유 지식베이스에 업로드하는 정책을 수립한다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 시스템의 장기적인 지식 보존(영속성)을 위해서는 사용자의 개입을 최소화하고 AI 주도 하에 아카이빙 및 규칙 명문화가 필수적이다.
- **세부 내용:**
- AI 어시스턴트(안티그라비티)가 대화 맥락과 주요 마일스톤을 자율적으로 판단하여 기록 및 업로드함.
- 사용자 개입에 따른 누락 방지 및 프로젝트 영속성 유지를 목표로 함.
- 자율성은 의사결정, 기술적 해결, 정책 수립 시 즉시 `00_Raw`에 기록하는 원칙을 따름.
- 영속성 확보를 위해 핵심 규칙을 `.clinerules` 및 `20_Meta/Policy.md`에 명문화하고 모든 AI 인스턴스가 공유함.
- 모든 기록은 위키 에이전트(`agent.py`)를 통해 지식화되고 GitHub에 동기화되는 체계를 갖춤.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/System_Policy]]
- **Related:** [[지식베이스]], [[AI 어시스턴트]], [[위키 에이전트]], [[정책 명문화]]
- **Raw Source:** [[00_Raw/Policy_Update_2026-05-04_1018.md]]
