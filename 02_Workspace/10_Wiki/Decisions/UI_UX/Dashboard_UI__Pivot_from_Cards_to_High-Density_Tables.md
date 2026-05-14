---
id: 84322ba1-b4aa
category: "[[10_Wiki/Decisions/UI_UX]]"
confidence_score: 0.98
tags: [UI, UX, Dashboard, Information Design, High-Density]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[Dashboard UI: Pivot from Cards to High-Density Tables]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> The decision was made to transition the primary dashboard interface from a card-based grid to a high-density, Excel-style table to accommodate increasing data volume and enhance practical usability.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** When data volume scales significantly, increasing information density and adopting spreadsheet-like views (tabular formats) often improves real-world operational workflow and information parsing speed.
- **세부 내용:**
- Transitioned design paradigm from 'Grid Card' to 'High-Density Table' (Excel style).
- The change was driven by poor readability and excessive scrolling in card views with over 160 devices.
- Key design decisions include maintaining a white/black theme for maximum visibility and implementing sticky headers for easier data exploration.
- The 'One Row Per Device' principle was established to place all detailed specs (A-I columns) horizontally for improved visual processing.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/UI_UX]]
- **Related:** [[UI/UX Principles]], [[Information Architecture]], [[SharePoint List Integration]]
- **Raw Source:** [[00_Raw/20260505_UI_Layout_Pivot.md]]
