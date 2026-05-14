# Implementation Plan: Zero-Touch Onboarding System (Greenfield Build)

기존의 모든 설정을 무시하고, 백지상태에서 가장 안정적이고 확장성 있는 방식으로 'Zero-Touch 온보딩 시스템'을 새로 구축하는 계획입니다. 이번에는 관리와 연동이 더 쉬운 **SharePoint List**를 데이터베이스로 사용하는 방식을 추천드립니다.

## User Review Required

> [!IMPORTANT]
> **SharePoint 사이트**: 데이터를 저장할 SharePoint 사이트가 준비되어야 합니다. (없을 경우 새로 생성 필요)
> **MS Forms**: 입사자용(PPE), Tool 신청용(Tool) 2개의 폼을 새로 생성해야 합니다.

## 1. Step-by-Step Infrastructure Setup

### [Step 1] 데이터베이스 (SharePoint List) 생성
Excel보다 안정적인 SharePoint List를 권장합니다. 'Onboarding Master'라는 이름의 리스트를 만들고 다음 컬럼을 추가합니다.
- **Title**: (기본값, 성으로 사용)
- **FirstName**: Single line of text
- **Email**: Single line of text (신입사원)
- **ManagerEmail**: Single line of text
- **Country**: Single line of text
- **DHL**: Single line of text
- **PPE_Status**: Choice (Pending, Approved, Declined)
- **Tool_Brand**: Single line of text
- **Tool_Model**: Single line of text
- **Tool_Price**: Number
- **Tool_Status**: Choice (Pending, Approved, Declined)

### [Step 2] MS Forms 상세 설계
각 폼은 데이터베이스와의 연동을 고려하여 질문 유형을 정확히 설정해야 합니다.

#### 1. Form 1: 신입사원 기초 정보 및 PPE 신청용
- **목적**: 신입사원의 인적사항 기록 및 1단계 승인 프로세스 시작
- **상세 질문 항목**:
  1. **Last Name** (텍스트/필수): "성(Surname)을 입력하세요."
  2. **First Name** (텍스트/필수): "이름(Given Name)을 입력하세요."
  3. **Your Email** (텍스트/필수): "신입사원 본인의 회사 또는 개인 이메일 주소를 입력하세요. (DB의 고유 Key로 사용됨)"
  4. **Your Manager Email** (텍스트/필수): "본인 라인 매니저의 공식 이메일 주소를 입력하세요. (2단계 자동 승인에 사용됨)"
  5. **Base Country** (선택 항목/필수): "근무 국가를 선택하세요." (옵션 예: Korea, USA, UK 등)
  6. **DHL Account Number** (텍스트/선택): "DHL 계정 번호가 있다면 입력하세요."

#### 2. Form 2: 업무용 Tool 구매 신청용 (대량 입력 최적화 버전)
- **개선된 방식**: 여러 품목을 하나씩 입력하는 대신, 가이드 엑셀 파일에 내용을 작성하여 **'파일 업로드'** 하는 방식을 채택합니다.
- **상세 질문 항목**:
  1. **Your Email** (텍스트/필수): "데이터 매칭용 이메일 주소"
  2. **Tool List File Upload** (파일 업로드/필수): "제공된 가이드 엑셀 파일(데이터 테이블)을 작성하여 업로드하세요."
  3. **Total Estimated Amount** (숫자/필수): "업로드한 리스트의 총 합계 금액"
  4. **Memo** (텍스트/선택): "추가 요청 사항"

---

## 2. Power Automate Flow: Step-by-Step Guide

### [Flow A] 신입 등록 및 PPE 승인 프로세스
이 플로우는 신입사원의 첫 번째 폼 제출 시 작동하며, DB 등록과 1단계 승인을 처리합니다.

1.  **Trigger**: `When a new response is submitted`
    - **Form Id**: [Form 1 선택]
2.  **Action 1**: `Get response details`
    - **Response Id**: `Response Id` (트리거에서 가져옴)
3.  **Action 2 (Notify)**: `Send an email (V2)` (신입사원에게)
    - **Body**: 프리미엄 프로그래스 바 (1단계 강조) + "환영합니다" 메시지
4.  **Action 3 (Approval)**: `Start and wait for an approval`
    - **Approval Type**: `Approve/Reject - First to respond`
    - **Title**: `[PPE Approval] New Engineer: [First Name] [Last Name]`
    - **Assigned To**: `taegyu.kim@gevernova.com`
5.  **Action 4 (Condition)**: `Condition` (Outcome이 `Approve`와 같은지 확인)
    - **If Yes**:
      - **Action 4.1 (DB)**: `Create item` (SharePoint List)
        - **Title**: `Last Name` / **FirstName**: `First Name` / **Email**: `Your Email` / **ManagerEmail**: `Your Manager Email` / **PPE_Status**: `Approved`
      - **Action 4.2 (Skanwear)**: `Send an email (V2)` (To: `MaciejOlesky@skanwear.com`)
        - **Subject**: `[New joiner] skanwear account creation request _[Last Name]_[First Name]`
        - **Body**: 입사자 정보 테이블 포함
      - **Action 4.3 (Next Step)**: `Send an email (V2)` (신입사원에게)
        - **Body**: 프로그래스 바 (2단계 강조) + **Form 2 링크** + **가이드 엑셀 파일 첨부**
    - **If No**:
      - **Action 4.4**: `Send an email (V2)` (신입사원에게 거절 안내)

---

### [Flow B] Tool 신청 및 대량 데이터 처리 프로세스
이 플로우는 신입사원이 업로드한 엑셀 파일을 읽어와 매니저를 자동으로 찾아 승인을 요청하는 'Zero-Touch'의 핵심입니다.

1.  **Trigger**: `When a new response is submitted`
    - **Form Id**: [Form 2 선택]
2.  **Action 1**: `Get response details`
    - **Response Id**: `Response Id`
3.  **Action 2 (User Lookup)**: `Get items` (SharePoint List)
    - **Site Address / List Name**: 온보딩 마스터 리스트 선택
    - **Filter Query**: `Email eq '[Your Email]'` (중요: 작은따옴표로 감싸야 함. Form 2에서 제출된 이메일과 일치하는 행을 찾습니다.)
4.  **Action 3 (Manager Variable)**: `Initialize variable`
    - **Name**: `varManagerEmail` / **Type**: `String`
    - **Value (Expression)**: `first(outputs('Get_items')?['body/value'])?['ManagerEmail']`
      - *설명*: DB에서 찾은 유저의 매니저 이메일만 쏙 뽑아내는 수식입니다.
5.  **Action 4 (Get File)**: `Get file content` (OneDrive 또는 SharePoint)
    - **File Identifier**: `first(json(outputs('Get_response_details')?['body/아이디_값']))?['id']`
      - *설명*: MS Forms를 통해 업로드된 파일의 고유 ID를 추출하여 파일 내용을 가져옵니다.
6.  **Action 5 (Extract Table)**: `List rows present in a table`
    - **Location**: 파일이 저장되는 '종착지'를 선택합니다.
      - *Case A (개인 폼)*: `OneDrive for Business` 선택
      - *Case B (그룹 폼)*: 해당 SharePoint 사이트 이름 검색 후 선택
    - **Document Library**: 
      - `OneDrive` (개인 폼일 경우) 또는 `Documents` (SharePoint일 경우)
    - **File**: (중요) 폴더 아이콘으로 직접 선택하지 말고, **Action 4의 동적 콘텐츠 `Id`**를 삽입하세요.
    - **Table**: 가이드 엑셀 파일 내 정의된 표 이름 (기본값: `Table1`)
7.  **Action 6 (UI Creation)**: `Create HTML table`
    - **From**: (Action 5의 `value`)
    - **Columns**: `Automatic` (또는 필요시 품목명, 가격 등만 Custom 설정)
      - *설명*: 매니저가 승인 메일에서 리스트를 한눈에 볼 수 있게 표로 만듭니다.
8.  **Action 7 (Approval Request)**: `Start and wait for an approval`
    - **Assigned To**: `varManagerEmail` (Action 3에서 만든 변수)
    - **Title**: `[Tool Approval] Purchase Request from: [Your Email]`
    - **Details**: "아래 품목 구매를 승인해 주세요." + (Action 6의 `Output` 삽입)
9.  **Action 8 (Condition)**: 매니저의 승인 여부 판정
    - **Value**: `Outcome` (Action 7의 승인 결과)
    - **Operator**: `is equal to` / **Value**: `Approve`
    - **If Yes (승인 시)**:
      - **Action 8.1 (Bulk Processing)**: `Apply to each` 액션 추가
        - **Output**: Action 5의 `value` (엑셀의 모든 행 데이터)
      - **Sub-Action (Update DB)**: 루프 내부에 `Update item` 추가
        - **Id**: Action 2(`Get items`)에서 찾은 유저의 `ID` (절대 고정값 아님!)
        - **Tool_Brand/Model/Price**: `items('Apply_to_each')?['엑셀_컬럼명']` 매핑
        - **Tool_Status**: `Approved`로 상태 변경
      - **Action 8.2 (Admin Alert)**: Teams 채널에 "구매 승인 완료" 포스팅
      - **Action 8.3 (Completion Notify)**: 신입사원에게 최종 완료 메일 발송 (Resource Kit의 3단계 HTML 코드 사용)

---

## 3. Resource Kit: Copy & Paste Materials

이 섹션의 코드를 Power Automate의 `Send an email (V2)` 액션 내 **'코드 보기(</>)'** 버튼을 누른 후 그대로 붙여넣으세요.

### [A] 이메일 프로그래스 바 HTML 코드

#### 1단계: PPE 신청 접수 완료 (신입사원 최초 수신용)
```html
<div style="font-family: 'Segoe UI', sans-serif; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px; background-color: #ffffff; max-width: 600px;">
  <h3 style="color: #004d40; margin-top: 0;">Onboarding Phase 1: PPE Request Received</h3>
  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 20px; display: table; width: 100%;">
    <div style="display: table-cell; text-align: center; width: 33%;">
      <div style="width: 30px; height: 30px; line-height: 30px; border-radius: 50%; background-color: #0078d4; color: white; margin: 0 auto; font-weight: bold;">1</div>
      <div style="font-size: 12px; margin-top: 8px; color: #0078d4; font-weight: bold;">PPE Account (In Progress)</div>
    </div>
    <div style="display: table-cell; text-align: center; width: 33%;">
      <div style="width: 30px; height: 30px; line-height: 30px; border-radius: 50%; background-color: #f3f2f1; color: #605e5c; margin: 0 auto;">2</div>
      <div style="font-size: 12px; margin-top: 8px; color: #605e5c;">Tool Request</div>
    </div>
    <div style="display: table-cell; text-align: center; width: 33%;">
      <div style="width: 30px; height: 30px; line-height: 30px; border-radius: 50%; background-color: #f3f2f1; color: #605e5c; margin: 0 auto;">3</div>
      <div style="font-size: 12px; margin-top: 8px; color: #605e5c;">Final Approval</div>
    </div>
  </div>
  <p style="margin-top: 20px; color: #333;">안녕하세요, 신입 엔지니어님. PPE 계정 생성 요청이 접수되었습니다. 관리자 승인 후 다음 단계 안내를 드릴 예정입니다.</p>
</div>
```

#### 2단계: PPE 승인 완료 및 Tool 신청 안내 (버튼 포함 최종 버전)
```html
<div style="font-family: 'Segoe UI', sans-serif; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px; background-color: #ffffff; max-width: 600px;">
  <h3 style="color: #004d40; margin-top: 0;">Onboarding Phase 2: Tool Procurement Request</h3>
  
  <div style="display: table; width: 100%; margin-top: 20px; border-bottom: 1px solid #f0f0f0; padding-bottom: 20px;">
    <div style="display: table-cell; text-align: center; width: 33%;">
      <div style="width: 30px; height: 30px; line-height: 30px; border-radius: 50%; background-color: #004d40; color: white; margin: 0 auto; font-weight: bold;">✓</div>
      <div style="font-size: 12px; margin-top: 8px; color: #004d40; font-weight: bold;">PPE Account (Done)</div>
    </div>
    <div style="display: table-cell; text-align: center; width: 33%;">
      <div style="width: 30px; height: 30px; line-height: 30px; border-radius: 50%; background-color: #0078d4; color: white; margin: 0 auto; font-weight: bold;">2</div>
      <div style="font-size: 12px; margin-top: 8px; color: #0078d4; font-weight: bold;">Tool Request (Active)</div>
    </div>
    <div style="display: table-cell; text-align: center; width: 33%;">
      <div style="width: 30px; height: 30px; line-height: 30px; border-radius: 50%; background-color: #f3f2f1; color: #605e5c; margin: 0 auto;">3</div>
      <div style="font-size: 12px; margin-top: 8px; color: #605e5c;">Final Approval</div>
    </div>
  </div>

  <p style="margin-top: 25px; color: #333; line-height: 1.6;">
    축하합니다! <b>1단계 PPE 승인이 완료</b>되었습니다. <br>
    이제 팀 합류를 위한 마지막 단계로 업무용 Tool 신청이 필요합니다.
  </p>
  
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="margin: 0; font-size: 14px; color: #555;">
      📌 <b>수행 방법:</b><br>
      1. 본 메일에 첨부된 <b>2개의 가이드 엑셀 파일</b>을 확인합니다.<br>
      2. 아래 버튼을 클릭하여 신청서(Form 2)를 작성해 주세요.
    </p>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="여기에_복사한_Form2_링크_붙여넣기" style="display: inline-block; padding: 15px 30px; background-color: #0078d4; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">업무용 Tool 신청하기 (Form 2)</a>
  </div>

  <p style="color: #888; font-size: 12px; text-align: center;">본 이메일은 시스템에 의해 자동 발송되었습니다.</p>
</div>
```

#### 3단계: 모든 온보딩 프로세스 최종 완료
```html
<div style="font-family: 'Segoe UI', sans-serif; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px; background-color: #f6fff8; max-width: 600px; border-left: 5px solid #004d40;">
  <h3 style="color: #004d40; margin-top: 0;">🎉 Onboarding Successfully Completed</h3>
  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 20px; display: table; width: 100%;">
    <div style="display: table-cell; text-align: center; width: 33%;">
      <div style="width: 30px; height: 30px; line-height: 30px; border-radius: 50%; background-color: #004d40; color: white; margin: 0 auto; font-weight: bold;">✓</div>
      <div style="font-size: 12px; margin-top: 8px; color: #004d40; font-weight: bold;">PPE Account</div>
    </div>
    <div style="display: table-cell; text-align: center; width: 33%;">
      <div style="width: 30px; height: 30px; line-height: 30px; border-radius: 50%; background-color: #004d40; color: white; margin: 0 auto; font-weight: bold;">✓</div>
      <div style="font-size: 12px; margin-top: 8px; color: #004d40; font-weight: bold;">Tool Request</div>
    </div>
    <div style="display: table-cell; text-align: center; width: 33%;">
      <div style="width: 35px; height: 35px; line-height: 35px; border-radius: 50%; background-color: #004d40; color: white; margin: 0 auto; font-weight: bold; border: 3px solid #ffca28;">★</div>
      <div style="font-size: 12px; margin-top: 8px; color: #004d40; font-weight: bold;">ALL DONE</div>
    </div>
  </div>
  <p style="margin-top: 20px; color: #333;">모든 온보딩 준비가 완료되었습니다. 팀에 합류하신 것을 진심으로 환영합니다!</p>
</div>
```

---

## 4. Visual & UX Elements

### 프로그래스 바 적용
각 메일 단계에서 아래 HTML 코드를 활용하여 시각적 직관성을 제공합니다.
![Onboarding Progress Bar Design](/C:/Users/cfpcl/.gemini/antigravity/brain/d88d02bb-49f9-4c93-be0e-bc25a0dbbd84/onboarding_progress_bar_design_1778738996565.png)

## Verification Plan
1. **데이터 저장 확인**: Form 1 제출 후 SharePoint List에 정확히 행이 생성되는지 확인.
2. **매니저 자동 매칭**: Form 2 제출 시 Flow가 DB를 조회하여 올바른 매니저에게 승인을 보내는지 확인.
3. **최종 승인 연동**: 매니저 승인 버튼 클릭 시 DB의 Tool 관련 컬럼만 정확히 업데이트되는지 확인.
