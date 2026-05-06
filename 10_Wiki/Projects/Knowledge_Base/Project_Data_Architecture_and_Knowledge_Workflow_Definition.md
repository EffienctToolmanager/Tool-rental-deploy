---
id: 6b097ad1-e289
category: "[[10_Wiki/Projects/Infrastructure]]"
confidence_score: 0.98
tags: [Data Flow, Architecture, Knowledge Management, Workflow, Synchronization]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[Project Data Architecture and Knowledge Workflow Definition]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> The document defines a hybrid data workflow by assigning specialized roles to various storage repositories (Local PC, GitHub, Google Drive, Obsidian) to optimize both development speed and accessibility.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** Effective knowledge systems require defining clear Separation of Concerns (SoC) for data storage based on intended access method (e.g., speed vs. mobile viewing).
- **세부 내용:**
- Local PC (C:): Designated as the core workspace for development and AI agent processing (prioritizing speed and technical stability).
- GitHub: Used strictly for cloud version control and code/knowledge backup.
- Google Drive (G:): Serves as the final, accessible knowledge archive optimized for mobile and family sharing.
- Obsidian: Acts as the primary interface for visualizing and interacting with structured Markdown knowledge.
- The data pipeline involves raw input landing on the local PC, subsequent analysis by the P-Reinforce Agent, and finally synchronization to cloud services.
- A critical proposed improvement is adding automated copy logic from the local processing stage to Google Drive to maximize real-time mobile viewing.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/Infrastructure]]
- **Related:** [[Workflow Automation]], [[Data Synchronization]], [[Git Version Control]], [[Obsidian Knowledge Graph]], [[Local vs Cloud Storage]]
- **Raw Source:** [[00_Raw/System_Structure_Review_2026-05-04.md]]
