---
id: 5e43f441-38d1
category: "[[10_Wiki/Decisions/UI_UX]]"
confidence_score: 0.98
tags: [UI, UX, Dashboard, High-Density, Data Visualization, Product Design]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[Dashboard UI Layout: Pivot to High-Density Table]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> The product decided to migrate the dashboard UI paradigm from restrictive card layouts to a high-density, Excel-style table structure to accommodate high volumes of equipment data.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** As data volume and complexity increase, static, component-based visualization (cards) fails, necessitating a scalable, tabular representation for efficient information density.
- **세부 내용:**
- The primary change is moving from a Grid Card interface to a High-Density Table format.
- The shift addresses poor readability and excessive scrolling caused by increasing equipment count (160+ units).
- The resulting layout enforces the '1 row per device' principle (A-I columns) for improved visual processing speed.
- Key design features include a white clean theme (maximum visibility) and a Sticky Header for consistent navigation.
- This high-density table standard must be maintained even when integrating with systems like SharePoint Lists.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/UI_UX]]
- **Related:** [[20260505_Excel_Date_Header_Fix]], [[20260505_Antigravity_Skill_Policy]], [[System_Structure_Review_2026-05-04]]
- **Raw Source:** [[00_Raw/20260505_UI_Layout_Pivot.md]]
