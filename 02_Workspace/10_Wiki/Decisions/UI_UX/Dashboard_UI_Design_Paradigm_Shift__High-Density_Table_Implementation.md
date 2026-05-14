---
id: dbf08255-cb1d
category: "[[10_Wiki/Decisions/UI_UX]]"
confidence_score: 1.0
tags: [UI, UX, Dashboard, Data Visualization, High-Density]
last_reinforced: 2026-05-06
github_commit: "pending"
---

# [[Dashboard UI Design Paradigm Shift: High-Density Table Implementation]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> The UI design is shifting from a low-density card-based system to a high-density, Excel-style table format to manage increasing data volumes and improve information accessibility.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** When data volume significantly increases, optimizing screen real estate and adopting a columnar, comparative visualization (table format) is superior to discrete card-based component displays.
- **세부 내용:**
- **Problem:** The existing card-based interface suffers from poor readability and excessive scrolling when dealing with over 160 pieces of equipment.
- **User Preference:** Users prefer an Excel-friendly UX that allows viewing and filtering maximum data points on a single screen.
- **Key Decisions Implemented:** Adopting a clean white theme for maximum visibility, implementing sticky headers for navigation comfort, and adhering to the 'One Row Per Device' principle for faster visual processing.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/UI_UX]]
- **Related:** [[SharePoint List Integration]], [[High-Density Layout Principles]], [[Information Density]]
- **Raw Source:** [[00_Raw/20260505_UI_Layout_Pivot.md]]
