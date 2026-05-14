---
title: "[회사PC] 팀즈 앱 패키징 완성 및 GEV 브랜드 통합 가이드"
date: 2026-05-05
tags: ["#GEV", "#TeamsApp", "#Deployment", "#Branding", "#Automation"]
type: "guide"
status: "completed"
---

# 🧠 [[Teams]] 앱 패키징 완성 및 [[GEV]] 브랜드 통합 가이드

## 🔍 개요
사용자 재접속 후 중단되었던 팀즈 앱 배포 작업을 재개함. `manifest.json` 및 아이콘 파일 누락으로 인한 패키징 오류를 해결하고, 신규 브랜드 정책([[20260505_Antigravity_Skill_Policy]])을 반영하여 GEV 전용 대시보드 환경을 완성함.

## 🛠️ 해결 과정
### 1. 패키징 리커버리 (Packaging Recovery)
- `deploy_tmp` 내의 `manifest.json`을 `teams-app/public`으로 복구.
- **AI 자율 아이콘 생성**: GEV Blue(#0047AB)와 Evergreen 컬러를 조합한 고해상도 앱 아이콘 2종(Color/Outline)을 생성하여 패키지에 통합.
- `Compress-Archive` 명령을 통한 `GEV_Tool_App.zip` 생성 자동화.

### 2. 브랜드 가이드라인 적용 (Branding)
- `index.css`를 수정하여 GEV 전용 컬러 시스템 구축.
- 헤더에 `linear-gradient` 적용 및 고밀도 테이블 레이아웃 최적화.
- 배포용 CSS(`assets/index-C8bbgLDR.css`)를 직접 업데이트하여 실시간 웹 대시보드 반영.

### 3. 멀티-PC 동기화 체계 (Deployment Workflow)
- **개인 PC**: 안티그래비티와 함께 개발 및 패키징 수행.
- **GitHub**: `Tool-rental-deploy` 저장소를 매개체로 파일 이동.
- **회사 PC**: 깃허브에서 Zip 파일을 다운로드하여 팀즈에 커스텀 앱으로 업로드.

## ✅ 최종 결과
- **배포 파일**: [GEV_Tool_App.zip](https://github.com/EffienctToolmanager/Tool-rental-deploy/blob/main/GEV_Tool_App.zip)
- **라이브 대시보드**: [GEV Tool Dashboard](https://effiencttoolmanager.github.io/Tool-rental-deploy/)
- **업데이트 상태**: 엑셀 날짜 추출(V4.9) 및 다이내믹 헤더(V6.2) 검증 완료.

## 🔗 연결 문서
- [[20260505_Excel_Date_Header_Fix]]
- [[20260505_Antigravity_Skill_Policy]]
- [[deployment_guide]]

---
*Created by Antigravity on 2026-05-05. 모든 데이터는 G: 드라이브 및 GitHub로 자동 동기화됨.*
