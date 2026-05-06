---
id: 1038c560-b500
category: "[[10_Wiki/Decisions/Policy_Automation]]"
confidence_score: 0.98
tags: [Policy, AI, Archiving, Persistence, Workflow]
last_reinforced: 2026-05-06
github_commit: "pending"
---

# [[AI Assistant Autonomous Archiving and Persistence Policy]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> AI assistants must autonomously capture conversation context and key project milestones into structured, persistent knowledge bases without requiring explicit user prompts.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** True project persistence requires decoupling knowledge capture from immediate user interaction by automating state logging and formalizing shared operational rules.
- **세부 내용:**
- The AI assistant (AntiGravity) is mandated to autonomously record dialogue context and major milestones.
- This minimizes knowledge loss and eliminates the burden of manual logging on the user.
- Key rules must be formalized in dedicated persistence files (e.g., .clinerules and 20_Meta/Policy.md) for global AI instance sharing.
- All recorded information must flow through the Wiki Agent (agent.py) for knowledge structuring and synchronization to GitHub.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/Policy_Automation]]
- **Related:** [[AI_Workflow]], [[Knowledge_Persistence]], [[Git_Synchronization]], [[AntiGravity_Assistant]]
- **Raw Source:** [[00_Raw/Policy_Update_2026-05-04_1018.md]]
