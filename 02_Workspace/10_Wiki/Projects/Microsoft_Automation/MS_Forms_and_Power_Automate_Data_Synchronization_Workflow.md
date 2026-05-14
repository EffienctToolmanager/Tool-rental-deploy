---
id: 6c17f83b-e146
category: "[[10_Wiki/Projects/Microsoft_Automation]]"
confidence_score: 0.98
tags: [Power Automate, MS Forms, Excel Online, Automation, Workflow]
last_reinforced: 2026-05-06
github_commit: "pending"
---

# [[MS Forms and Power Automate Data Synchronization Workflow]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> This guide details the construction of an automated workflow that captures real-time equipment rental applications via MS Forms and systematically updates a centralized Excel master sheet.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** Automating structured data capture requires defining a trigger (Forms submission), parsing data, and using a key-based lookup (Equipment ID) to update specific records in a structured data source (Excel Table).
- **세부 내용:**
- **Goal:** To move beyond static dashboard reads by using MS Forms to capture rental applications and automatically update a master Excel sheet.
- **MS Forms Design:** The form must map its input fields (e.g., Equipment ID, Site Loc) directly to the corresponding columns in the master Excel sheet.
- **Power Automate Trigger:** The workflow is initiated by the 'When a new response is submitted' event in MS Forms.
- **Power Automate Logic:** It involves parsing the response details and then utilizing the 'Update a row' action in Excel Online.
- **Key Requirement:** The destination data range in Excel *must* be formatted as a 'Table' to enable structured lookups and updates.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/Microsoft_Automation]]
- **Related:** [[Excel Table Formatting]], [[Power Automate Triggers]], [[Teams Dashboard Integration]]
- **Raw Source:** [[00_Raw/20260505_MS_Forms_PowerAutomate_Guide.md]]
