---
id: 141cc7d4-3fde
category: "[[10_Wiki/HowTo/Microsoft_365]]"
confidence_score: 0.98
tags: [PowerAutomate, MSForms, Automation, Excel, Integration]
last_reinforced: 2026-05-06
github_commit: "pending"
---

# [[MS Forms to Excel Automation Workflow Guide]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> This guide outlines an automated workflow using Power Automate to collect equipment rental requests via MS Forms and update a master inventory Excel sheet in real time.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** Structured business processes (like forms submission) can be seamlessly integrated with data management tools (Excel) using low-code automation platforms (Power Automate).
- **세부 내용:**
- The goal is to automate the transfer of rental application data from MS Forms to a centralized Excel master sheet.
- MS Forms fields must be mapped 1:1 to Excel data headers (e.g., Equipment ID, Site Location, Rent Period).
- The Power Automate flow is triggered 'When a new response is submitted' in MS Forms.
- The flow then uses 'Update a row' in Excel Online, leveraging a key column (Equipment ID) to precisely target and update the correct record.
- Prerequisites include: creating the MS Form, ensuring the Excel data is formatted as a structured 'Table', and verifying Power Automate permissions.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/HowTo/Microsoft_365]]
- **Related:** [[20260505_Excel_Date_Header_Fix]], [[20260505_Teams_App_Packaging_and_Branding]], [[Power Automate]]
- **Raw Source:** [[00_Raw/20260505_MS_Forms_PowerAutomate_Guide.md]]
