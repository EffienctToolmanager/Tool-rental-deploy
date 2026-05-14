---
id: ad9b103e-44f2
category: "[[10_Wiki/Decisions/UI_UX]]"
confidence_score: 0.98
tags: [UI, UX, Dashboard, Design, Information Density]
last_reinforced: 2026-05-06
github_commit: "pending"
---

# [[Dashboard UI Paradigm Shift: Grid Card to High-Density Table]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> The design paradigm for internal dashboards is shifting from an insufficient grid card layout to a high-density, Excel-style table to accommodate large numbers of devices and enhance information readability.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** When data volume exceeds current display capacity, optimal UX prioritizes information density, fixed headers, and tabular, row-by-row data display over compartmentalized cards.
- **세부 내용:**
- The change involves moving from a 'Grid Card' interface to a 'High-Density Table' layout, mimicking Excel for enhanced efficiency.
- Reasons include insufficient information density in the card format when tracking over 160 devices, leading to poor readability and excessive scrolling.
- Key decisions include maintaining a white/black contrast theme for maximum visibility, implementing sticky headers for navigation ease, and adopting the 'One Row Per Device' principle.
- This high-density table standard must be maintained even when integrating with systems like SharePoint Lists.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/UI_UX]]
- **Related:** [[UI/UX Principles]], [[Data Visualization Best Practices]]
- **Raw Source:** [[00_Raw/20260505_UI_Layout_Pivot.md]]
