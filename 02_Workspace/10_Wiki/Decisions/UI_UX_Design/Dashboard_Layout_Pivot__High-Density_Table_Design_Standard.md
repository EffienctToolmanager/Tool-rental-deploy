---
id: 567021dd-e576
category: "[[10_Wiki/Decisions/UI_UX_Design]]"
confidence_score: 0.98
tags: [UI, UX, Dashboard, High-Density, Information Architecture]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[Dashboard Layout Pivot: High-Density Table Design Standard]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> The dashboard design pattern is shifting from space-intensive card grids to a high-density, Excel-style table structure to manage and display large volumes of equipment data efficiently.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** When scaling data visualization beyond a few dozen entries, maximizing information density and structural predictability (like a spreadsheet) is superior to relying on visually distinct card components.
- **세부 내용:**
- The design pivot is from the current Grid Card interface to a High-Density Table layout, mirroring Excel usability.
- This shift was necessitated by the increase in inventory (160+ devices), where card structures compromised readability and caused excessive scrolling.
- Key design standards established include: a white/black high contrast theme for maximum visibility, a Sticky Header for persistent navigation, and adhering to a 'One Row, One Device' principle for rapid data consumption.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/UI_UX_Design]]
- **Related:** [[UX/UI Principles]], [[Information Density]], [[Data Visualization]], [[SharePoint Integration Standards]]
- **Raw Source:** [[00_Raw/20260505_UI_Layout_Pivot.md]]
