# 🧠 [UI/UX] 장비 코드 자동 복사 및 피드백 시스템 구현

#Knowledge #React #UX #GEV #Automation

## 🔍 개요
사용자가 MS Forms를 통해 대여 신청을 할 때, 장비 코드(Equipment ID)를 오타 없이 입력할 수 있도록 지원하는 'Click-to-Copy' 기능을 대시보드에 통합함.

## 🛠️ 구현 상세
### 1. Clipboard API 통합
- `navigator.clipboard.writeText`를 활용하여 장비 ID(Column1) 셀 클릭 시 클립보드에 자동 복사되도록 구현.
- 사용자가 클릭 가능한 영역임을 알 수 있도록 `cursor: pointer` 및 `title` 속성 추가.

### 2. 시각적 피드백 (Toast Message)
- 복사 완료 시 헤더 영역에 `✅ Copied: [ID]` 메시지가 나타나는 상태(`copyMsg`) 관리 로직 추가.
- `setTimeout`을 통해 2초 후 자동으로 사라지도록 설정하여 깔끔한 UX 유지.

### 3. 브랜드 디자인 정렬
- GEV Blue 컬러를 ID 텍스트에 적용하여 핵심 데이터임을 강조.
- 유리 질감(`backdrop-filter: blur`)의 세련된 알림창 디자인 적용.

## ✅ 기대 효과
- **데이터 정확성**: 수동 타이핑으로 인한 장비 ID 입력 오류 원천 차단.
- **업무 효율**: 신청서 작성 시간 단축 및 사용자 경험 개선.

## 🔗 연결 문서
- [[20260505_MS_Forms_PowerAutomate_Guide]]
- [[20260505_Teams_App_Packaging_and_Branding]]

---
*Created by Antigravity on 2026-05-05. 실시간 UI 고도화 기록 완료.*
