---
id: d1d92515-dd63
category: "[[10_Wiki/Decisions/Policy_Management]]"
confidence_score: 0.98
tags: [AI, Policy, Archiving, Autonomy, Governance, Knowledge Management]
last_reinforced: 2026-05-04
github_commit: "pending"
---

# [[Autonomous Archiving Policy for AI Assistants]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> AI assistants must autonomously capture and archive conversational context and key project milestones to ensure operational memory and knowledge continuity without explicit user prompting.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** Knowledge persistence in complex systems requires explicit, automated mechanisms for logging, institutionalizing rules, and synchronizing data.
- **세부 내용:**
- AI assistants (e.g., AntiGravity) are mandated to autonomously identify and record dialogue context and key project milestones.
- The policy aims to prevent knowledge loss (data leakage) and minimize user burden associated with manual logging.
- Autonomy requires immediate logging of decisions, technical solutions, and policy changes into the designated `00_Raw` area.
- System Permanence is achieved by codifying these rules into shared resources: `.clinerules` and `20_Meta/Policy.md`.
- All archived data must pass through the Wiki Agent (`agent.py`) for knowledge structuring and subsequent synchronization to GitHub.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/Policy_Management]]
- **Related:** [[Agent Workflow]], [[Knowledge Graph]], [[Wiki Agent]], [[Policy Enforcement]]
- **Raw Source:** [[00_Raw/Policy_Update_2026-05-04_1018.md]]
