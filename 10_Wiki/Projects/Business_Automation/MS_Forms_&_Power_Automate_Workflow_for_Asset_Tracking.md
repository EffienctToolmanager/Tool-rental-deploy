---
id: abb272ce-dbc2
category: "[[10_Wiki/Projects/Business_Automation]]"
confidence_score: 1.0
tags: [Power Automate, MS Forms, Excel, Automation, Workflow, Asset Management]
last_reinforced: 2026-05-06
github_commit: "pending"
---

# [[MS Forms & Power Automate Workflow for Asset Tracking]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> The guide details building an automated workflow where submissions from MS Forms trigger Power Automate to parse data and update specific records (e.g., status, location) in an Excel master sheet.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** Successful workflow automation requires defining a clear trigger (Forms submission) and structuring the target data (Excel Table) with reliable key identifiers for updates.
- **세부 내용:**
- The process bypasses Teams dashboards and uses MS Forms as the primary input method for data collection.
- The MS Forms structure must mirror the critical data headers (e.g., Equipment ID, Site Loc) of the master Excel sheet.
- The Power Automate flow must be triggered 'When a new response is submitted' in MS Forms.
- Crucial step: Use the 'Update a row' action in Excel Online, identifying the record using a unique key column (Equipment ID) and the submitted value.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/Business_Automation]]
- **Related:** [[Teams]], [[MS Forms]], [[Power Automate]], [[Excel]], [[20260505_Excel_Date_Header_Fix]]
- **Raw Source:** [[00_Raw/20260505_MS_Forms_PowerAutomate_Guide.md]]
