# 🗓️ GEV Meeting Room Reservation System (사내 회의실 예약 시스템)
> **GEV Workspace Corporate Asset Hub**

본 시스템은 **Room 1 (Bigger - 12인실)** 및 **Room 2 (Smaller - 6인실)**의 실시간 현황을 모니터링하고 예약을 조율하는 사내 자원 전산망입니다. 
회사 PC의 까다로운 보안 환경(방화벽, DRM, 비인가 앱 실행 차단)을 완벽하게 통과하면서도, 별도의 웹 브라우저를 켤 필요 없이 **MS Teams 클라이언트 사이드바에 단독 앱 형태로 영구 이식하여 24시간 무중단 작동**하도록 설계되었습니다.

---

## 🎨 Design System & Colors
* **Theme:** GEV Signature White & Evergreen Minimalist
* **Evergreen Base Color:** `#054141`
* **Layout:** Room 1 & Room 2 좌우 페어(Pair) 레이아웃 및 캘린더 그리드 - 타임라인 양방향 연동

---

## 🛠️ Deployment Guide (사내 PC 배포 가이드)

회사 PC의 보안 규정을 충족하면서 팀원들이 24시간 공동 사용할 수 있도록 하는 **2가지 배포 방식**을 지원합니다.

### 🌟 [추천 - 24/7 클라우드 서버리스 배포] (회장님 PC가 꺼져도 작동 가능)
추가 비용이나 IT 부서의 무거운 API 승인 대기 없이, **회사 쉐어포인트 클라우드 서버**를 호스트로 삼아 전 직원이 즉시 공유 사용하는 방법입니다.

1. **쉐어포인트 문서함에 파일 업로드:**
   * 본 레포지토리의 [index.html](index.html) 파일을 GEV 회사 쉐어포인트(SharePoint) 내의 임의의 **문서 라이브러리(Shared Documents)** 폴더에 업로드합니다.
2. **보안 링크 복사:**
   * 업로드된 `index.html` 파일의 **공유 링크(Share Link) 또는 보기 전용 URL**을 복사합니다.
3. **MS Teams에 앱으로 이식:**
   * 사내 공동 Teams 채널 상단의 `+` 버튼(탭 추가)을 누릅니다.
   * **[웹사이트(Website)]** 앱을 선택한 뒤, 복사한 쉐어포인트의 `index.html` 공유 링크 주소를 붙여넣습니다.
4. **결과:**
   * 마이크로소프트의 공식 클라우드 인프라 위에서 구동되므로, **회장님의 컴퓨터가 완전히 꺼지거나 닫혀있어도 전 사원이 24시간 안정적으로 접속 및 활용**할 수 있습니다!

---

### 💻 [로컬 개발 및 단독 앱(PWA) 로컬 배포]
회장님 단독 또는 로컬 서버 환경에서 즉시 구동할 때 사용합니다.

#### 1. 로컬 HTTP 서버 실행
터미널을 열고 GEV 로컬 서버 스크립트를 기동합니다:
```bash
python 05_Scripts/run_room_server.py
```
* 서버가 켜지면 `http://localhost:8000/index.html`로 예약망이 즉시 가동됩니다.

#### 2. MS Teams 사이드바에 개인 단독 앱으로 설치 (보안 프리패스)
1. MS Teams 프로그램을 실행합니다.
2. 왼쪽 하단의 **[앱 (Apps)]** 메뉴 선택 후, 하단의 **[앱 관리 (Manage your apps)]**를 클릭합니다.
3. **[사용자 지정 앱 업로드 (Upload a custom app)]**를 클릭합니다.
4. 본 폴더에 생성되어 있는 `GEV_Room_App.zip` 파일을 선택하여 업로드합니다.
5. **완료:** Teams 왼쪽 사이드바에 GEV 고유 아이콘과 함께 단독 회의실 예약 탭이 고정됩니다.

---

## ⚡ Key Technical Architecture (핵심 기술 로직)
1. **Time-Checking Loop (실시간 상태 판정):**
   * 1초 단위로 시스템 메모리 상의 예약 데이터와 현재 기기 시간(Date)을 연산하여, 미팅룸 상태를 `Vacant(비어있음)` ↔ `Occupied(사용 중)`으로 동적으로 점멸 및 교체합니다.
2. **Collision Detection (시간대 충돌 차단):**
   * 신규 등록 또는 강제 변경 시, 선택된 시간이 기존 예약 테이블의 시간대 범위(`[Start, End]`)와 1분이라도 겹칠 경우 등록을 차단하고 팝업 경고를 송출합니다.
3. **M365 Hydration Sync Control:**
   * 로컬 스토리지 한계를 극복하기 위해, 하단부 컨트롤 패널을 통해 전산 예약 스트림을 `.json`으로 실시간 Export/Import 백업할 수 있으며, 향후 Power Automate와 다이렉트로 결합할 수 있습니다.
