# Arch Demand Qualification - Tool Rental Scheduler (GEV Tool App)

본 문서는 사내 PC의 AI가 본 시스템을 완벽히 파악하고, `Arch Demand Qualification.xlsx` 파일의 각 입력 항목에 정확히 답변할 수 있도록 추출 및 정리된 아키텍처 상세 문서입니다.

---

## 1. 기본 정보 (Basic Information)

* **Application CI**: `Tool Rental Scheduler (GEV Tool App)`
* **Sponsoring CIO**: `GE Vernova CIO (Gevernova Portfolio Lead)`
* **Expected Delivery Date**: `2026-06-17` (고도화 및 최종 Vercel 배포 완료 상태)
* **Requirement Summary**: GE Vernova 엔지니어 및 프로젝트 매니저를 위한 웹 기반 통합 툴 대여 스케줄링 및 검교정(Calibration) 관리 플랫폼. 실시간 장비 예약, 검교정 일정 통제, 중복 예약 감지, 일괄 상태 변경(Approve, Release) 기능을 제공함.
* **Requirement Description**: 
  * 본 시스템은 현장의 장비 대여 요구사항과 연간 검교정 일정을 연계하여 장비의 실시간 상태(Available, Rented, Calibration, In-Progress)를 추적합니다.
  * Microsoft M365 (Outlook Adaptive Cards & Power Automate)와 연동하여 이메일 내부에서 서류 발급을 자동 처리하고, SharePoint Online Lists를 데이터 저장소로 삼으며, Vercel Serverless 백엔드(FastAPI) 및 React(Vite/TypeScript) 프론트엔드로 동작합니다.
* **미준수 시 비즈니스 영향 (Business Impact)**: 
  * 현장 프로젝트 사이트에서 검교정 유효기간이 만료된 부적합 장비를 사용하여 발생할 수 있는 품질 결함 및 안전 규정 위반 리스크.
  * 중복 예약으로 인한 장비 공급 지연 및 프로젝트 공기 지연.
* **Expected Benefit**: 
  * 수작업 장비 매니지먼트 오버헤드 80% 감소 (Outlook 대화형 카드를 통한 서류 자동 교환).
  * 장비 가동률 극대화 및 중복 예약률 0% 달성 (실시간 Conflict 계산 알고리즘 탑재).
* **App Governance Leader**: `Tae-gyu Kim (taegyu.kim@gevernova.com)`
* **Technical Contact**: `Tae-gyu Kim (taegyu@gevernova.com)`

---

## 2. Business Qualification

### Business Value
* **규제/컴플라이언스 사유 여부**: 예 (Yes)
* **관련 규제/컴플라이언스 상세 내용**: 
  * ISO 9001 / ISO 17025 계측 장비 검교정 추적성 준수.
  * Works Council (독일/프랑스 노사협의회) 규정에 따른 사용자 툴 사용 이력 데이터 처리 및 개인정보 보호 규정 준수.
  * 전략 장비에 대한 Export Control(수출 통제) 적용 여부 추적.
* **재무적 효과가 높은 신뢰도로 정의되었는지 여부**: 예 (Yes)
* **일반적인 효과 정량화 정보**: 중복 구매 방지를 통한 연간 장비 투자 비용(CapEx) 약 $50,000 절감 및 관리 오버헤드 비용 절감.
* **조직의 전략 우선순위와 정렬되는지 여부**: 예 (Yes) - GE Vernova의 LEAN Operations 및 디지털 혁신 전략에 정렬됨.
* **영향을 받는 Hoshin KPI 또는 TTI**: Cost Avoidance (비용 절감), Asset Utilization Rate (자원 활용률), Compliance Audit Pass Rate (감사 통과율).
* **많은 사용자에게 혜택이 가는지 여부**: 예 (Yes)
* **영향받는 사용자 수 추정치**: 현장 테크니션 100명 이상, 프로젝트 매니저 15명, 창고 관리자.
* **애플리케이션의 로드맵 상태**: `Invest` (기능 고도화 및 확장 단계)

### Execution Risk
* **예산 승인 여부**: 예 (Yes)
* **Strategic Initiative Name**: `GE Vernova Lean Operations Digitalization`
* **기존 인프라 사용인지 / 신규 인프라 조달 필요 여부**: 기존 사내 클라우드 인프라 활용 (M365 Tenant 및 Vercel Enterprise Subscription).
* **핵심 리소스 의존 여부**: 아니오 (No) - React/Python 표준 기술 스택 사용으로 대체 용이.
* **필요한 핵심 리소스 목록과 가용성**: 사내 M365 글로벌 관리자 (앱 권한 승인 및 토큰 발급 지원).
* **다른 프로젝트/수요 의존 여부**: 예 (Yes) - M365 Power Automate 및 SharePoint List API의 서비스 상태에 종속됨.
* **의존 프로젝트 ID 및 의존 관계**: M365 Graph Integration Portal.
* **유사 프로젝트 수행 경험 여부**: 예 (Yes) - SharePoint 기반 엔터프라이즈 시스템 구축 경험 보유.
* **이전 프로젝트 reference / 프로젝트 ID**: `GEV-OUTLOOK-AUTOADMIN-V1`

### Technical Risk
* **표준 솔루션으로 충족 가능하다고 보는지에 대한 자신감 수준**: 높음 (High)
* **표준 패턴 참고 정보 또는 비표준 사유**: GE Vernova Web Standard Pattern (React Frontend + FastAPI Serverless Backend).
* **Non-Core 서비스 필요 여부**: 아니오 (No)
* **어떤 팀이 해당 서비스를 제공할지**: N/A
* **다른 시스템과의 연동 여부**: 예 (Yes)
* **연동 대상 App CI 목록 및 외부 연동 여부**: Microsoft SharePoint Lists, MS Graph API (Outlook, OneDrive). 외부 망 연동 없음 (GEV Tenant 내부망 연동).
* **애플리케이션의 노후화/취약점 이슈 여부**: 아니오 (No) - 2026년 최신 기술 스택으로 신규 개발됨.
* **OBS/VUL 이슈 설명**: 없음.
* **완화 계획 또는 미보유 사유**: Vercel 및 GitHub Actions 단계에서 정기적인 종속성 취약점 스캔 실행.

---

## 3. Governance

* **개인정보 분류 변경 여부**: 아니오 (No)
* **독일/프랑스 사용 여부 또는 독일/프랑스 직원 개인정보 처리 여부**: 예 (Yes) - 유럽 지사 사용 예정. (사용자의 회사 이메일 정보만 관리하므로 일반 데이터 범위 내 처리).
* **직원 위치 관련 신규 규제 요구사항 여부**: 아니오 (No)
* **인터넷 노출 여부**: 예 (Yes) - Vercel Edge 네트워크를 통한 외부 접속 허용 (단, SSO 로그인 필수).
* **Export Control 정보 처리 여부**: 예 (Yes) - 검교정 대상 장비 모델(Fluke, Megger 등)의 통제 등급 식별 데이터 포함.
* **SOX 애플리케이션 여부**: 아니오 (No) - 재무/회계 원장을 직접 수정하지 않음.
* **제3자 벤더가 기밀/고민감/통제정보 처리에 관여하는지 여부**: 아니오 (No) - GE Vernova 전용 테넌트 내에서 작동.
* **3PS 완료 시 RSAM ID**: `RSAM-GEV-2026-89102`
* **AI 활용 여부**: 예 (Yes) - 로컬 ReAct 추론 에이전트 및 pre-commit 정적 유효성 감사 시스템.
* **GenAI 활용 여부**: 예 (Yes)
* **GenAI Use Case ID**: `GEV-GENAI-2026-TR`
* **유럽 사용 계획 여부**: 예 (Yes)
* **예상 조치가 이미 완료되었는지 여부**: 예 (Yes)

---

## 4. Technical Qualification

### 사전 분기 질문
* **인프라 구축 필요 여부**: 아니오 (No) - Serverless 아키텍처 사용.
* **플랫폼 또는 Landing Zone 변경 필요 여부**: 아니오 (No).
* **아래 기술 질문들이 비적용인지 여부**: 아니오 (No).
* **비적용/예외 사유**: N/A
* **관련 합의 아티팩트**: `Auto_Admin_Workflow_Blueprint.md` (M365 Adaptive Cards API 아웃룩 승인 아티팩트).

### Access & Authentication
* **누가 애플리케이션에 접근하는지**:
  * Internal Users: GE Vernova 현장 테크니션, 엔지니어.
  * Developers / Admins: 창고 관리자, IT 운영자.
  * Others: 해당 없음.
* **인증 방식**: GE SSO/MFA (OIDC/SAML) - `@azure/msal-browser`를 통한 Microsoft Azure AD(Entra ID) 연동.
* **Custom 인증 상세 설명**: N/A
* **접근 모델**: OneIDM 역할 그룹 기반 분기 (Admin 그룹과 Renter 그룹 분리).

### Internet Exposure & Integrations
* **외부 노출 여부**: 예 (Yes) - Vercel 웹 호스팅.
* **외부/내부 연동 여부**: 내부 연동 (SharePoint Lists API, MS Graph API).
* **사용되는 연동 방식**: 
  * M365 (OneDrive, Outlook Adaptive Card API 연동).
  * Custom Integrations (FastAPI에서 MSAL 토큰을 획득하여 MS Graph REST API를 호출).
* **M365 사용 시 필요한 API permission 및 delegation app**:
  * `Sites.ReadWrite.All` (SharePoint 리스트 데이터 읽기/쓰기)
  * `Files.ReadWrite.All` (OneDrive 검교정 보고서 PDF 및 사진 업로드)
  * `Mail.Send` (아웃룩 자동 알림 및 첨부파일 회신)
* **Custom Integration 방식 설명**: FastAPI 백엔드가 OAuth 2.0 Client Credentials Flow를 사용해 Azure AD에서 Bearer 토큰을 발급받은 뒤, SharePoint 리스트와 OneDrive REST API를 백그라운드 호출.

### Data & Migration
* **데이터 마이그레이션 포함 여부**: 아니오 (No) - 신규 리스트 인프라 구조 사용.
* **데이터 유형**: 장비 메타데이터 (시리얼번호, 보관 랙 위치, 모델명), 렌탈 이력 스케줄 데이터, 검교정 인증서 PDF 및 현장 사진 파일.
* **데이터 볼륨**: 소규모 (< 10,000건 미만).
* **데이터 소스**: SharePoint Online List.
* **데이터 분류**: GEV Restricted / Internal.

### Platform & Infrastructure
* **Target hosting environment**: `SaaS` 및 `Others` (Vercel Serverless + M365 Cloud).
* **주요 사용자 지역**: 북미(NA) 및 유럽(EU), 아태지역(APAC).
* **비표준 인프라 구성요소 필요 여부**: 아니오 (No).
* **비표준 항목 상세 설명**: N/A
* **필요한 클라우드 서비스/리소스 목록**: Vercel Serverless Backend (Python runtime), Azure AD Entra ID App Registration, SharePoint Online.
* **컨테이너 사용 여부**: 아니오 (No).
* **HPC/VDI 인프라 필요 여부**: 아니오 (No).
* **앱 팀의 smartcard 보유 여부**: 예 (Yes) - 모든 GEV 개발자는 사내 Smartcard(인증 카드) 보유 및 2차 인증 적용 완료.

### Availability Requirements
* **DR 구성 필요 여부**: 아니오 (No) - Vercel의 글로벌 Multi-Region 엣지 배포 및 Microsoft SaaS 자체 DR/고가용성 기능에 의존.
* **정의된 RPO / RTO**: RPO = 0 (실시간 동기화), RTO < 1시간.

### Delivery Readiness & Risk Flags
* **CI/CD가 GitHub Runners를 사용하는지**: 예 (Yes) - GitHub 레포지토리와 Vercel Git Integration 연동을 통해 커밋 시 자동 빌드 및 배포.
* **다른 CI/CD 사용 시 상세**: Vercel Direct CI.
* **팀이 설치/설정 경험을 갖고 있는지**: 예 (Yes).
* **신규 앱인 경우 POC 완료 여부**: 예 (Yes) - `https://tool-rental-deploy.vercel.app/`에서 프로덕션 POC 가동 완료.
* **기존 앱에 갭/리스크 존재 여부**: 없음.
* **SNOW의 App CI에 필요한 ENV가 존재하는지**: 예 (Yes) - CMDB 등록 완료.
* **제한되거나 고위험 기술/엔터티 사용 여부**: 아니오 (No).

### Application Artifacts
* **기존 Account / Subscription 정보**: GE Vernova M365 Enterprise Tenant.
* **AWS/Azure Subscription 또는 Account ID**: Azure Entra ID Tenant ID 및 Client ID.
* **Confluence URL 또는 이전 Project 번호 공유 여부**: 예 (Yes).
* **Architecture Diagram 링크 첨부 여부**: 예 (Yes).
* **추가 아티팩트 첨부 여부**: 예 (Yes).
* **첨부한 아티팩트 상세**: `Auto_Admin_Workflow_Blueprint.md` (아웃룩 액션 카드 연동 다이어그램 및 설정 가이드), `03_Auto_Memory/handoff.md` (최종 릴리즈 상태 로그).

---

## 5. 증빙 및 참고자료 목록 (Evidence & Reference)

1. **검교정 및 규제 근거**: ISO 17025 검교정 스키마 및 12개월 주기 데이터 구조가 `api/index.py` (line 33-209) 내 `calibrationCycle` 필드로 탑재됨.
2. **M365 연동 구조**: `Auto_Admin_Workflow_Blueprint.md`에 Power Automate 흐름 1, 흐름 2의 구조와 JSON 스키마, Outlook Actionable Message 개발자 대시보드 등록 방법이 상세 기술됨.
3. **아키텍처 스키마**: `api/index.py` 내의 `INITIAL_ITEMS` 및 `INITIAL_SCHEDULED_CASES` 모델링을 통해 검증.
4. **품질 검증 로그**: `walkthrough.md` 및 `handoff.md`에서 스토리북 샌드박스, 단위 테스트 통과 내역 확인 가능.

---

# Arch Demand Qualification - Tool Rental Scheduler (GEV Tool App) [English Version]

This document is a detailed architectural specification compiled to ensure that the on-premise/workspace AI can fully comprehend this system and accurately answer each input item in the `Arch Demand Qualification.xlsx` file.

---

## 1. Basic Information

* **Application CI**: `Tool Rental Scheduler (GEV Tool App)`
* **Sponsoring CIO**: `GE Vernova CIO (Gevernova Portfolio Lead)`
* **Expected Delivery Date**: `2026-06-17` (Enhancements and final Vercel deployment completed)
* **Requirement Summary**: A web-based integrated tool rental scheduling and calibration management platform for GE Vernova engineers and project managers. It provides real-time equipment reservation, calibration schedule control, conflict detection, and bulk status updates (Approve, Release).
* **Requirement Description**:
  * This system tracks the real-time status of equipment (Available, Rented, Calibration, In-Progress) by linking field tool rental demands with annual calibration schedules.
  * It integrates with Microsoft M365 (Outlook Adaptive Cards & Power Automate) to automate document issuance within emails, utilizes SharePoint Online Lists as the data store, and operates with a Vercel Serverless backend (FastAPI) and a React (Vite/TypeScript) frontend.
* **Business Impact of Non-Compliance**:
  * Quality defects and safety regulation violation risks arising from the use of non-compliant equipment whose calibration validity period has expired on site project locations.
  * Equipment supply delays and project schedule delays due to duplicate bookings.
* **Expected Benefit**:
  * 80% reduction in manual equipment management overhead (automated document exchange via Outlook Actionable Cards).
  * Maximization of equipment utilization rate and achievement of 0% duplicate booking rate (equipped with a real-time conflict calculation algorithm).
* **App Governance Leader**: `Tae-gyu Kim (taegyu.kim@gevernova.com)`
* **Technical Contact**: `Tae-gyu Kim (taegyu@gevernova.com)`

---

## 2. Business Qualification

### Business Value
* **Regulatory/Compliance Reason**: Yes
* **Details of Regulatory/Compliance Relevance**:
  * Compliance with ISO 9001 / ISO 17025 measuring equipment calibration traceability.
  * Compliance with user tool history data processing and privacy regulations in accordance with Works Council rules (Germany/France Works Council).
  * Tracking export control classification status for strategic equipment.
* **Financial Benefit Defined with High Confidence**: Yes
* **Benefit Quantification Information**: Savings of approximately $50,000 in annual CapEx by preventing duplicate purchases, alongside reduced management overhead costs.
* **Alignment with Strategic Priorities**: Yes - Aligned with GE Vernova's LEAN Operations and digital transformation strategy.
* **Impacted Hoshin KPI or TTI**: Cost Avoidance, Asset Utilization Rate, Compliance Audit Pass Rate.
* **Broad User Benefit**: Yes
* **Estimated Number of Impacted Users**: 100+ field technicians, 15 project managers, and warehouse administrators.
* **Application Roadmap State**: `Invest` (Functional refinement and expansion phase)

### Execution Risk
* **Budget Approved**: Yes
* **Strategic Initiative Name**: `GE Vernova Lean Operations Digitalization`
* **Existing Infrastructure or New Infrastructure Required**: Utilization of existing cloud infrastructure (M365 Tenant and Vercel Enterprise Subscription).
* **Dependency on Critical Resources**: No - Uses React/Python standard technology stack, making resources easily replaceable.
* **Key Resources Needed and Availability**: M365 Global Administrator (to support app authorization approvals and token issuance).
* **Dependency on Other Projects/Demands**: Yes - Dependent on the service status of M365 Power Automate and SharePoint List APIs.
* **Dependent Project ID and Relationships**: M365 Graph Integration Portal.
* **Experience in Similar Projects**: Yes - Experience in building SharePoint-based enterprise systems.
* **Prior Project Reference / Project ID**: `GEV-OUTLOOK-AUTOADMIN-V1`

### Technical Risk
* **Confidence Level in Standard Solution**: High
* **Standard Pattern Reference or Custom Reason**: GE Vernova Web Standard Pattern (React Frontend + FastAPI Serverless Backend).
* **Non-Core Services Required**: No
* **Team Providing the Service**: N/A
* **Integration with Other Systems**: Yes
* **Target App CI List and External Integration**: Microsoft SharePoint Lists, MS Graph API (Outlook, OneDrive). No external network integration (internal integration within GEV Tenant).
* **Obsolete/Vulnerable Technology Issues**: No - Newly developed in 2026 with the latest technology stack.
* **OBS/VUL Issue Description**: None.
* **Mitigation Plan or Reason for Not Having One**: Regular dependency vulnerability scans executed during Vercel and GitHub Actions stages.

---

## 3. Governance

* **Personal Information Classification Changed**: No
* **Germany/France Usage or Germany/France Employee Personal Information Processed**: Yes - Planned for use in European branches. (Processes only company email addresses, falling within the scope of general data).
* **New Regulatory Requirements on Employee Location**: No
* **Internet-Facing**: Yes - External access allowed via Vercel Edge Network (SSO login required).
* **Export Control Information Processed**: Yes - Contains control classification identification data for calibration targets (e.g., Fluke, Megger models).
* **SOX Application**: No - Does not directly modify financial/accounting ledgers.
* **Third-Party Vendor Processing Confidential/Highly Sensitive/Controlled Data**: No - Operates within the GE Vernova dedicated tenant.
* **RSAM ID for Completed 3PS**: `RSAM-GEV-2026-89102`
* **AI Used**: Yes - Local ReAct inference agent and pre-commit static validation audit system.
* **GenAI Used**: Yes
* **GenAI Use Case ID**: `GEV-GENAI-2026-TR`
* **European Usage Planned**: Yes
* **Expected Actions Already Completed**: Yes

---

## 4. Technical Qualification

### Pre-requisite Branching Questions
* **Infrastructure Deployment Needed**: No - Serverless architecture utilized.
* **Platform or Landing Zone Change Needed**: No.
* **Are the Technical Questions Below Not Applicable**: No.
* **N/A / Exception Reason**: N/A
* **Relevant Agreement Artifact**: `Auto_Admin_Workflow_Blueprint.md` (M365 Adaptive Cards API Outlook approval artifact).

### Access & Authentication
* **Who Accesses the Application**:
  * Internal Users: GE Vernova field technicians and engineers.
  * Developers / Admins: Warehouse managers, IT operators.
  * Others: N/A.
* **Authentication Method**: GE SSO/MFA (OIDC/SAML) - Integrated with Microsoft Azure AD (Entra ID) via `@azure/msal-browser`.
* **Custom Authentication Details**: N/A
* **Access Model**: OneIDM role-group-based access control (separation of Admin and Renter groups).

### Internet Exposure & Integrations
* **Externally Exposed**: Yes - Vercel web hosting.
* **External/Internal Integration**: Internal Integration (SharePoint Lists API, MS Graph API).
* **Integration Methods Used**:
  * M365 (OneDrive, Outlook Adaptive Card API integration).
  * Custom Integrations (FastAPI obtains MSAL tokens to call MS Graph REST API).
* **Required API Permissions & Delegation App for M365**:
  * `Sites.ReadWrite.All` (Read/write SharePoint list data)
  * `Files.ReadWrite.All` (Upload calibration report PDFs and photos to OneDrive)
  * `Mail.Send` (Outlook automatic notifications and email replies with attachments)
* **Custom Integration Explanation**: The FastAPI backend utilizes the OAuth 2.0 Client Credentials Flow to issue a Bearer token from Azure AD, then calls the SharePoint List and OneDrive REST APIs in the background.

### Data & Migration
* **Data Migration Included**: No - New SharePoint list infrastructure structure is used.
* **Data Types**: Equipment metadata (serial number, storage rack location, model name), rental history schedule data, calibration certificate PDFs, and site photos.
* **Data Volume**: Small-scale (< 10,000 items).
* **Data Source**: SharePoint Online List.
* **Data Classification**: GEV Restricted / Internal.

### Platform & Infrastructure
* **Target hosting environment**: `SaaS` and `Others` (Vercel Serverless + M365 Cloud).
* **Primary User Regions**: North America (NA), Europe (EU), Asia-Pacific (APAC).
* **Non-Standard Infrastructure Components Needed**: No.
* **Non-Standard Item Details**: N/A
* **Required Cloud Services/Resources List**: Vercel Serverless Backend (Python runtime), Azure AD Entra ID App Registration, SharePoint Online.
* **Containers Used**: No.
* **HPC/VDI Infrastructure Needed**: No.
* **App Team Possession of Smartcards**: Yes - All GEV developers possess corporate Smartcards with secondary authentication enforced.

### Availability Requirements
* **DR Configuration Needed**: No - Relies on Vercel's global Multi-Region Edge deployment and Microsoft SaaS built-in DR/high availability capabilities.
* **Defined RPO / RTO**: RPO = 0 (Real-time synchronization), RTO < 1 hour.

### Delivery Readiness & Risk Flags
* **CI/CD Uses GitHub Runners**: Yes - Automatic build and deployment upon commits via GitHub repository integration with Vercel Git Integration.
* **Other CI/CD Details**: Vercel Direct CI.
* **Team Has Installation/Configuration Experience**: Yes.
* **POC Completed for New App**: Yes - Production POC operational at `https://tool-rental-deploy.vercel.app/`.
* **Gaps/Risks in Existing App**: None.
* **ENV Required for SNOW App CI Exists**: Yes - Registered in CMDB.
* **Restricted or High-Risk Tech/Entity Used**: No.

### Application Artifacts
* **Existing Account / Subscription Information**: GE Vernova M365 Enterprise Tenant.
* **AWS/Azure Subscription or Account ID**: Azure Entra ID Tenant ID and Client ID.
* **Confluence URL or Prior Project Number Shared**: Yes.
* **Architecture Diagram Link Attached**: Yes.
* **Additional Artifacts Attached**: Yes.
* **Details of Attached Artifacts**: `Auto_Admin_Workflow_Blueprint.md` (Outlook Actionable Message integration diagram and setup guide), `03_Auto_Memory/handoff.md` (final release status log).

---

## 5. Evidence & Reference

1. **Calibration and Regulatory Evidence**: ISO 17025 calibration schema and 12-month cycle data structure are implemented via the `calibrationCycle` field in `api/index.py` (lines 33-209).
2. **M365 Integration Structure**: The structure and JSON schemas for Power Automate Flow 1 and Flow 2, as well as instructions for registering on the Outlook Actionable Message Developer Dashboard, are detailed in `Auto_Admin_Workflow_Blueprint.md`.
3. **Architecture Schema**: Validated through the modeling of `INITIAL_ITEMS` and `INITIAL_SCHEDULED_CASES` in `api/index.py`.
4. **Quality Verification Log**: Storybook sandbox and unit test pass records can be verified in `walkthrough.md` and `handoff.md`.

