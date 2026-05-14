---
title: "심문 보고서: GEV Tool Rental System 최적화 및 DB 전환"
date: 2026-05-06
tags: ["#Investigation", "#GEV", "#TeamsApp", "#SharePointLists", "#BugFix"]
type: "report"
status: "completed"
---

# 🕵️ 심문 보고서: GEV Tool Rental System 최적화 및 DB 전환 (2026-05-06)

## 🔍 심문 개요
Teams 내 삽입된 GEV Tool Rental 앱의 고질적인 기능 장애(Forms 연결 실패, PC판 리스트 소멸)를 해결하고, 장기적인 데이터 거버넌스 정책([[Antigravity_Autonomous_Skill_Policy]])에 따라 로컬 엑셀 DB를 **SharePoint Lists**로 전환하기 위한 심문을 진행함.

## 🛠️ 발견된 문제 및 해결 (Findings)

### 1. MS Forms 연결 오류 (Rent 버튼)
- **원인**: `App.tsx`에 기록된 Forms ID(`...QUVR...`)가 최신 패치 기록과 불일치함. 또한 URL 파라미터 전달 시 `?id=`를 중복 사용하여 링크가 깨짐.
- **조치**: 최신 유효 ID(`...QUTV...`)로 업데이트하고, 파라미터 구분자를 `&id=`로 정정함.

### 2. PC 버전 리스트 소멸 현상
- **원인**: Teams 데스크톱 클라이언트의 강력한 브라우저 캐싱으로 인해 이전 버전의 `data.json`이 로드됨. 또한 테이블 렌더링 시 엄격한 데이터 검증 부족으로 인한 잠재적 오류.
- **조치**: 데이터 호출 시 타임스탬프(`?t=Date.now()`)를 추가하여 캐시를 강제 우회(Cache Busting)하고, 렌더링 로직의 안정성을 보강함.

### 3. DB 아키텍처 전환 (Excel → SharePoint Lists)
- **결정**: 기존 로컬 엑셀 동기화 방식(`Rental_Manager.ps1`)은 동시성 및 실시간성이 떨어지므로, M365 표준인 **SharePoint Lists**(`ToolRentalDB`)로 완전 전환하기로 함.
- **구현**: `SharePointService.ts`를 신설하여 MS Graph API 연동 기반을 마련함.

## 📈 향후 로드맵 (Next Steps)
- [ ] SharePoint 사이트 URL 및 List ID 최종 매핑 (`.env` 최신화)
- [ ] `App.tsx`의 `fetchData` 로직을 `SharePointService`로 교체
- [ ] Power Automate를 통한 Forms 응답 데이터의 실시간 List 반영 테스트

---
*Created by Antigravity (Interrogator 0). 모든 지식은 [[10_Wiki]]로 자동 분류 및 최적화되었습니다.*
