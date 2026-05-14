---
id: c6e82cef-8e2e
category: "[[10_Wiki/Decisions/Workflow]]"
confidence_score: 0.98
tags: [Workflow, Data Management, Archiving, System Design]
last_reinforced: 2026-05-04
github_commit: "pending"
---

# [[Optimal Hybrid Knowledge Archiving Workflow]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> The optimal knowledge workflow defines distinct roles for various storage locations (Local, GitHub, Google Drive, Obsidian) to achieve high speed, structure, and accessibility.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** A successful knowledge system requires defining clear responsibilities for each storage layer and automating transitions between them.
- **세부 내용:**
- Local PC (C:): Used as the primary, high-speed workspace for core development and AI agent processing.
- GitHub: Serves as the designated cloud version control repository for code and knowledge backup.
- Google Drive (G:): Functions as the highly accessible 'final knowledge viewing point,' particularly for mobile/family sharing.
- Obsidian: Used specifically for the visualization and interactive structuring of markdown-based knowledge.
- The proposed pipeline involves raw data processing (C: -> Wiki/C:) followed by scheduled synchronization (Meta Manager -> GitHub/Google Drive).

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** The note identifies a potential weakness: synchronization latency between the local PC and Google Drive, which is addressed by proposing an immediate automatic copy logic.
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/Workflow]]
- **Related:** [[Data Loss Prevention]], [[Version Control]], [[Obsidian]], [[System Design]]
- **Raw Source:** [[00_Raw/System_Structure_Review_2026-05-04.md]]
