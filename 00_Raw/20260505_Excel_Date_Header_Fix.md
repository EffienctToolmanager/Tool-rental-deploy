---
id: 20260505_Excel_Date_Header_Fix
category: Technical_Solution
tags: [powershell, excel-com, date-format, dynamic-header, json]
last_reinforced: 2026-05-05
---

# 🧠 [회사PC] 기술적 해결: 엑셀 데이터 정밀 추출 및 다이내믹 헤더 구현

## 1. 개요
PowerShell을 이용한 엑셀 데이터 추출 시 발생하는 데이터 타입 변형 및 헤더 불일치 문제를 해결함.

## 2. 발생한 문제
- **날짜 변형**: `.Value2` 속성 사용 시 엑셀의 날짜 형식이 정수(Serial Number)로 변환되어 출력됨. (예: 2024-05-01 -> 45413)
- **헤더 경직성**: UI의 카테고리 이름이 엑셀 시트의 실제 이름과 일치하지 않아 사용자가 혼란을 느낌.

## 3. 해결 방법
- **`.Text` 속성 활용**: 파워쉘 스크립트에서 `.Value2` 대신 `.Text` 속성을 호출하여 엑셀 셀에 보이는 서식 그대로(String) 데이터를 수집함. (V4.9 엔진 반영)
- **지능형 헤더 매칭**: 
    - **Back-end**: 엑셀 1행의 값을 키(Key)로 하는 JSON 생성.
    - **Front-end**: React 앱에서 데이터의 첫 번째 행을 자동으로 감지하여 테이블 헤더로 변환하는 로직 구현. (V6.2 UI 반영)

## 4. 성과
- 엑셀 데이터를 수정하거나 헤더 이름을 바꿔도 개발자가 코드를 수정할 필요 없는 **완전 자율 동기화 구조** 확립.

---
[[20260505_UI_Layout_Pivot]]
[[Sync_Policy_Implementation_2026-05-04]]
[[Graphify_Skill_Guide_2026-05-04]]
