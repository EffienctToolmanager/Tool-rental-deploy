---
id: 509d4e5e-cf8f
category: "[[10_Wiki/Decisions/UI_UX]]"
confidence_score: 0.99
tags: [UI, UX, Dashboard, Data Visualization, High-Density]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[High-Density Dashboard Layout Adoption]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> The dashboard interface is pivoting from an easily readable but spatially limited card grid to a high-density, spreadsheet-style table to accommodate large datasets and improve comparative data analysis.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** When managing large volumes of technical data, prioritizing information density and efficient columnar comparison over visual separation dramatically improves operational user experience and system scalability.
- **세부 내용:**
- The core decision involves switching the display paradigm from card-based grids (Grid Card) to high-density, Excel-like tables.
- The shift is necessitated by the scaling issues (over 160 devices) where card layouts suffered from poor readability and excessive scrolling.
- Key UX improvements mandate a white background/black text theme for maximum visibility and a 'Sticky Header' for consistent data navigation.
- The design adheres to the 'One Row, One Device' principle, placing all detailed specifications on a single horizontal line to boost cognitive speed.
- This high-density table layout must be standardized and maintained even when integrating with future platforms like SharePoint.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/UI_UX]]
- **Related:** [[20260505_Excel_Date_Header_Fix]], [[20260505_Antigravity_Skill_Policy]], [[System_Structure_Review_2026-05-04]]
- **Raw Source:** [[00_Raw/20260505_UI_Layout_Pivot.md]]
