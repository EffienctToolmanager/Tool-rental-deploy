---
id: de3b22a3-7a9e
category: "[[10_Wiki/Projects/Data_Handling]]"
confidence_score: 0.98
tags: [PowerShell, Excel-COM, Data_Extraction, Dynamic_Header, JSON, React]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[PowerShell 기반 엑셀 데이터 추출 및 동적 헤더 구현]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> PowerShell과 React를 결합하여 엑셀의 날짜 형식 변형 및 헤더 불일치 문제를 해결하고, 코드를 수정할 필요 없는 자율 동기화 데이터 파이프라인을 구축했다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 데이터 파이프라인의 안정성은 시각적 서식(Formatting)을 유지하는 추출 메커니즘과 데이터 구조화 계층(JSON/Front-end Mapping)의 분리에 달려있다.
- **세부 내용:**
- 기존에는 PowerShell의 `.Value2` 사용 시 날짜가 엑셀 일련번호(Serial Number) 정수로 변환되는 문제가 발생했다.
- 이 문제를 해결하기 위해 PowerShell 스크립트에서 `.Text` 속성을 호출하여 셀에 보이는 문자열 서식 그대로 데이터를 수집하는 방식을 채택했다.
- 데이터 헤더의 경직성을 해결하기 위해 백엔드에서는 엑셀 첫 행을 키로 하는 JSON 구조를 생성하고, 프론트엔드(React)에서 이 첫 행을 자동으로 감지하여 테이블 헤더로 사용하는 로직을 구현했다.
- 결과적으로, 원본 엑셀 파일의 구조가 변경되어도 코드를 수정할 필요가 없는 완전 자율 동기화 구조를 확립했다.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/Data_Handling]]
- **Related:** [[PowerShell]], [[React]], [[JSON]], [[Excel Automation]]
- **Raw Source:** [[00_Raw/20260505_Excel_Date_Header_Fix.md]]
