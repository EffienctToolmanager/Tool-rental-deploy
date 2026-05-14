---
id: 2e53770a-be17
category: "[[10_Wiki/Decisions/UX_Design]]"
confidence_score: 0.98
tags: [UI, Dashboard, UX, Information Density, Data Visualization]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[Dashboard UI Paradigm Shift: Grid to High-Density Table]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> Due to increasing equipment count, the UI design has pivoted from a low-density card grid to a high-density, Excel-style table for improved information throughput and readability.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** When data volume exceeds a manageable threshold (e.g., 160+ items), maximizing information density (Excel-style) significantly improves usability over purely card-based interfaces.
- **세부 내용:**
- The design paradigm is shifting from a Grid Card interface to a High-Density Table (Excel-style).
- The shift is necessary because the existing card layout fails to maintain readability and creates excessive scroll fatigue with more than 160 devices.
- Key design decisions include using a white/black color scheme for maximum visibility.
- Implementing a Sticky Header feature to aid data navigation and retention.
- Adopting a '1 Row = 1 Device' principle, arranging all specifications (A~I columns) horizontally to improve visual recognition speed.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/UX_Design]]
- **Related:** [[UI/UX Principles]], [[Data Visualization Patterns]], [[SharePoint List]]
- **Raw Source:** [[00_Raw/20260505_UI_Layout_Pivot.md]]
