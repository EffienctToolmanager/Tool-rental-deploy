---
id: 37c702cd-1d98
category: "[[10_Wiki/Topics/Automation]]"
confidence_score: 0.98
tags: [PowerAutomate, MSForms, Excel, Microsoft365, LowCode]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[MS Forms to Excel Automation Workflow (Power Automate)]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> This guide details an automated workflow that captures equipment loan requests via MS Forms and updates the corresponding status and location in an Excel master sheet using Power Automate.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** Low-code integration (Forms -> Power Automate) is used to enforce structured data updates in flat file databases (Excel), enabling real-time system tracking.
- **세부 내용:**
- The workflow triggers when a new response is submitted through MS Forms.
- The process requires matching the MS Forms headers 1:1 with the Excel data structure.
- The core logic uses Power Automate to parse the response and then perform an 'Update a row' action in Excel Online.
- Successful automation requires the target data range in the Excel file to be properly formatted as a 'Table' and requires a unique key (Equipment ID) for row identification.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Topics/Automation]]
- **Related:** [[20260505_Excel_Date_Header_Fix]], [[20260505_Teams_App_Packaging_and_Branding]], [[Power Automate Triggers]], [[MS Forms Data Mapping]]
- **Raw Source:** [[00_Raw/20260505_MS_Forms_PowerAutomate_Guide.md]]
