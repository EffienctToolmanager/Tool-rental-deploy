---
title: "MS Forms & Power Automate 자동화 가이드"
date: 2026-05-05
tags: ["#Automation", "#MSForms", "#PowerAutomate", "#GEV", "#Teams"]
type: "guide"
status: "completed"
---

# 📘 MS Forms & Power Automate 자동화 가이드 (V1.1)

## 🔍 개요
팀즈([[Teams]]) 대시보드(`Read-only`)에서 한 단계 나아가, [[MS Forms]]를 통해 실시간으로 대여 신청을 받고 이를 엑셀([[Excel]]) 마스터 시트에 자동 반영하는 [[Power Automate]] 워크플로우를 구축함.

## 📋 MS Forms 항목 설계 (대시보드 동기화)
대시보드의 데이터 헤더와 1:1 매칭되도록 설계함.

1. **Equipment ID** (Column1): 필수 입력. 엑셀 행 검색의 Key.
2. **Item Description** (Column4): 사용자 확인용.
3. **Site Loc** (Column3): 장비가 이동할 목적지 업데이트.
4. **Rent Period**: 대여 기간 관리.

## 🛠️ Power Automate 로직 (Logic Flow)
1. **Trigger**: `When a new response is submitted` ([[MS Forms]])
2. **Action 1**: `Get response details` (응답 내용 파싱)
3. **Action 2**: `Update a row` ([[Excel]] Online)
    - **Table**: 엑셀 마스터 데이터가 '표'로 지정되어 있어야 함.
    - **Key Column**: `Column1` (Equipment ID)
    - **Key Value**: [[MS Forms]]의 장비 ID 응답값
    - **Update Fields**: `Status` -> 'In Use', `Location` -> 신청 위치 등

## ✅ 사전 준비 사항 (Checklist)
- [ ] MS Forms 양식 생성 완료
- [ ] 엑셀 파일 내 데이터 영역이 **'표(Table)'**로 서식 지정되어 있는지 확인
- [ ] Power Automate에서 해당 엑셀 파일 접근 권한 확인

## 🔗 연결 문서
- [[20260505_Excel_Date_Header_Fix]]
- [[20260505_Teams_App_Packaging_and_Branding]]

---
*Created by Antigravity on 2026-05-05. 실시간 가이드 문서화 완료.*
