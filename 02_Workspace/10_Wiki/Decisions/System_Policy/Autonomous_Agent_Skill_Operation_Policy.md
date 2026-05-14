---
id: 59df9a44-80cb
category: "[[10_Wiki/Decisions/System_Policy]]"
confidence_score: 0.98
tags: [agent, skill, policy, UI/UX, MS365, architecture]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[Autonomous Agent Skill Operation Policy]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> This policy establishes a structured, modular skill system to ensure that autonomous agents maintain consistent quality, professional standards, and predictable business logic across all workflows.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** Achieving agent robustness requires defining strict boundaries for skill scope (global vs. workspace) and mandating standardized output formats (Markdown) and data sources (MS 365).
- **세부 내용:**
- **Skill Scoping:** Skills are categorized into Global Scope (universal design/branding) and Workspace Scope (project-specific business logic).
- **Design Standards:** Mandatory use of GEV Blue and GE Evergreen themes, prioritizing white backgrounds and high-density tables in UI design.
- **Data Connectivity:** MS 365 SharePoint List is mandated as the standard protocol for all future database integrations, adhering to defined naming conventions.
- **Knowledge Persistence:** All agent outputs must utilize Markdown Table formats to guarantee compatibility and seamless integration with the Obsidian knowledge base.
- **Expected Outcome:** The system aims to reduce user intervention and increase the agent's self-sufficiency, ensuring continuity regardless of session resets or agent replacement.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/System_Policy]]
- **Related:** [[20260505_UI_Layout_Pivot]], [[20260505_Excel_Date_Header_Fix]], [[Policy_Update_2026-05-04_1018]]
- **Raw Source:** [[00_Raw/20260505_Antigravity_Skill_Policy.md]]
