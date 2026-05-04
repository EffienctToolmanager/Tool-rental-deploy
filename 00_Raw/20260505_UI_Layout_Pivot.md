---
id: 20260505_UI_Layout_Pivot
category: Decision
tags: [ui, dashboard, ux, evergreen, high-density]
last_reinforced: 2026-05-05
---

# 🧠 [회사PC] 의사결정: 대시보드 UI 패러다임 전환

## 1. 개요
기존의 카드형(Grid Card) 인터페이스에서 엑셀 스타일의 고밀도 테이블(High-Density Table) 인터페이스로 디자인 패러다임을 전환함.

## 2. 배경 및 사유
- **정보 밀도 부족**: 장비가 160대 이상으로 늘어남에 따라 카드형 구조는 가독성이 떨어지고 스크롤 압박이 심함.
- **사용자 요구**: 실무자는 한 화면에서 최대한 많은 정보를 동시에 확인하고 필터링하는 방식을 선호함. (Excel-friendly UX)

## 3. 결정 사항
- **화이트 클린 테마**: 본문 배경을 하얀색으로, 텍스트를 검정색으로 설정하여 가시성 극대화.
- **Sticky Header**: 카테고리 헤더를 상단에 고정하여 데이터 탐색 편의성 제공.
- **1행 1장비 원칙**: 모든 상세 스펙(A~I열)을 가로 한 줄에 배치하여 시각적 인지 속도 개선.

## 4. 향후 계획
- SharePoint List 연동 시에도 이 고밀도 테이블 레이아웃을 표준으로 유지함.

---
[[20260505_Excel_Date_Header_Fix]]
[[20260505_Antigravity_Skill_Policy]]
[[System_Structure_Review_2026-05-04]]
