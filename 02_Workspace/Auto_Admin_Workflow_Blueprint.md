# GEV 아웃룩 대화형 메일(Adaptive Cards) 미세 단위 실행 가이드

본 문서는 외부 브라우저 창이나 링크 클릭 없이, **아웃룩 메일창 내부에서 체크박스로 파일을 선택하고 즉시 제출하여 첨부파일로 돌려받는 순정 엔터프라이즈 시스템**의 미세 단위(Micro-Level) 구축 매뉴얼입니다.

M365 Power Automate에서 아래 단계를 1에서 10까지 그대로 따라 하시면 세팅이 완료됩니다.

---

## 🏗️ 전체 흐름 요약
이 시스템은 2개의 독립적인 클라우드 흐름(Flow)이 유기적으로 통신하며 작동합니다.
1. **[흐름 1: 백엔드 처리기]**: 요청자가 이메일에서 [제출] 버튼을 눌렀을 때 백그라운드에서 실행되어 파일을 꺼내 메일로 쏴주는 API 흐름 (HTTP Request 기반).
2. **[흐름 2: 포탈 발송기]**: 상대방이 `#자료요청` 메일을 보냈을 때 실시간 OneDrive 파일을 검색하여 이메일 내부 적응형 카드를 렌더링해 1차 발송하는 흐름.

---

## 🛠️ [PART 1] 흐름 1: 백엔드 처리기 구축 (미세 단계)

요청자가 이메일 내부에서 체크박스를 누르고 [제출]을 클릭했을 때 작동할 API 백엔드를 먼저 만듭니다. (이 흐름의 Endpoint URL이 흐름 2의 카드에 삽입되어야 하기 때문입니다.)

### 1단계: 트리거 생성
1. **Power Automate 포탈**(`make.powerautomate.com`)에 접속합니다.
2. `만들기(Create)` ➜ **`인스턴트 클라우드 흐름(Instant cloud flow)`**을 선택합니다.
3. 흐름 이름을 `GEV_AutoAdmin_Backend`로 입력하고, 트리거 목록에서 **`HTTP 요청이 수신되는 경우(When an HTTP request is received)`**를 선택한 뒤 `만들기`를 클릭합니다.
4. **요청 본문 JSON 스키마(Request Body JSON Schema)** 항목에 아래 JSON을 그대로 붙여넣습니다:
   ```json
   {
     "type": "object",
     "properties": {
       "requested_files": { "type": "string" },
       "sender": { "type": "string" }
     },
     "required": ["requested_files", "sender"]
   }
   ```
5. **[중요]** 흐름을 임시 저장하면 `HTTP POST URL`이 자동 생성됩니다. 이 URL을 메모장 등에 복사해 둡니다.

### 2단계: 파일 처리 조건문(Condition) 작성
1. `새 단계(New step)`를 눌러 **`제어(Control) - 적용 대상 각각(Apply to each)`** 액션을 추가합니다.
2. **이전 단계에서 출력값 선택** 란에 식(Expression)을 삽입합니다:
   * 식: `split(triggerBody()?['requested_files'], ',')`
   * *(설명: 요청자가 다중 선택한 파일명 문자열 "사업자등록증.pdf,통장사본.pdf"을 쉼표 기준으로 쪼개어 루프를 돕니다.)*

### 3단계: 루프 내부의 파일 콘텐츠 획득 및 배열 변수 추가
1. 흐름의 맨 처음(HTTP 트리거 바로 아래)에 **`변수 초기화(Initialize variable)`** 액션을 추가합니다.
   * 이름: `AttachmentList`
   * 형식: `배열(Array)`
2. `Apply to each` 루프 내부에 **`OneDrive for Business - 경로를 사용하여 파일 콘텐츠 가져오기(Get file content using path)`** 액션을 추가합니다.
   * 파일 경로: `/admin_shared_docs/@{items('Apply_to_each')}`
3. 루프 내부 파일 콘텐츠 가져오기 아래에 **`배열 변수에 추가(Append to array variable)`** 액션을 추가합니다.
   * 이름: `AttachmentList`
   * 값:
     ```json
     {
       "Name": "@{items('Apply_to_each')}",
       "ContentBytes": @{body('경로를_사용하여_파일_콘텐츠_가져오기')}
     }
     ```

### 4단계: 2차 메일 직접 첨부 발송 및 HTTP 응답 처리
1. 루프(`Apply to each`)가 완전히 끝난 바깥 아래에 **`Office 365 Outlook - 이메일 보내기(V2)`** 액션을 추가합니다.
   * 받는 사람: 트리거의 `sender` 동적 값 (`@{triggerBody()?['sender']}`)
   * 제목: `[발급완료] GEV 요청하신 행정 서류가 첨부되었습니다.`
   * 본문: `"요청하신 서류를 첨부파일로 안전하게 발송해 드립니다. 메일 창을 이탈하지 않고 즉시 받아보실 수 있습니다."`
   * 우측 하단 **`고급 옵션 표시(Show advanced options)`** 클릭 ➜ **`첨부파일(Attachments)`** 입력 칸 우측의 `배열 전체 전환` 아이콘(T자 모양 옆 아이콘)을 클릭한 뒤 변수 `AttachmentList`를 통째로 매핑합니다.
2. 메일 발송 액션 바로 아래에 **`응답(Response)`** 액션을 추가하여 아웃룩에 성공 메시지를 반환합니다.
   * 상태 코드: `200`
   * 헤더:
     * `CARD-UPDATE-IN-BODY`: `true`
   * 본문 (제출 완료 후 메일 창의 디자인이 바뀔 최종 화면을 의미함):
     ```json
     {
       "type": "AdaptiveCard",
       "version": "1.4",
       "body": [
         {
           "type": "TextBlock",
           "text": "서류 발급 성공!",
           "weight": "Bolder",
           "color": "Good",
           "size": "Medium"
         },
         {
           "type": "TextBlock",
           "text": "요청하신 서류가 회원님의 메일함으로 즉시 첨부되어 안전하게 발송되었습니다.",
           "wrap": true
         }
       ]
     }
     ```
3. 흐름을 **저장**합니다.

---

## 🛠️ [PART 2] 흐름 2: 포탈 발송기 구축 (미세 단계)

상대방의 트리거 메일을 수신하여 실시간 폴더 리스트가 반영된 대화형 메일을 작성해 보내는 흐름입니다.

### 5단계: 이메일 감지 트리거 설정
1. `만들기(Create)` ➜ **`자동화된 클라우드 흐름(Automated cloud flow)`**을 선택합니다.
2. 흐름 이름을 `GEV_AutoAdmin_Portal_Dispatcher`로 지정합니다.
3. 트리거로 **`Office 365 Outlook - 새 이메일이 도착할 때(V3)`**를 선택하고 `만들기`를 누릅니다.
4. 트리거 설정에서:
   * 폴더: `Inbox`
   * 제목 필터: `#자료요청`
   * 중요도: `임의`

### 6단계: OneDrive 실시간 파일 검색
1. 트리거 바로 아래에 **`OneDrive for Business - 폴더 내 파일 나열(List files in folder)`** 액션을 추가합니다.
   * 폴더: `/admin_shared_docs`

### 7단계: 적응형 카드용 선택지 JSON 동적 조립
1. 아래에 **`데이터 작업 - Select`** 액션을 추가합니다.
   * From: `폴더 내 파일 나열`의 출력값 (`value`)
   * Map (텍스트 모드로 전환 후 작성):
     ```json
     {
       "title": "@{item()?['Name']}",
       "value": "@{item()?['Name']}"
     }
     ```
2. 바로 아래에 **`데이터 작업 - 작성(Compose)`** 액션을 추가하여 전체 적응형 카드(Adaptive Card)의 HTML 껍데기를 정의합니다.
   * **[매우 중요]** 아웃룩 대화형 메일을 발송할 때는 메일 본문의 `<script type="application/adaptivecard+json">` 태그 안에 적응형 카드가 삽입되어야 작동합니다.
   * **입력값(Input)**에 다음 코드를 입력하되, `{HTTP_POST_URL}` 부분은 **1단계에서 메모장에 적어둔 흐름 1의 HTTP POST URL**로 교체합니다:
     ```html
     <html>
     <head>
       <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
     </head>
     <body>
       <script type="application/adaptivecard+json">
       {
         "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
         "type": "AdaptiveCard",
         "version": "1.4",
         "body": [
           {
             "type": "TextBlock",
             "text": "GEV 행정 서류 발급 포탈",
             "weight": "Bolder",
             "size": "Large",
             "color": "Accent"
           },
           {
             "type": "TextBlock",
             "text": "아웃룩 메일 내에서 필요한 서류를 체크하신 후 하단의 제출 버튼을 누르시면, 본 메일로 즉시 서류 파일들이 첨부되어 회신됩니다. (외부 브라우저나 웹페이지가 열리지 않습니다.)",
             "wrap": true,
             "isSubtle": true
           },
           {
             "type": "Input.ChoiceSet",
             "id": "SelectedDocs",
             "isMultiSelect": true,
             "value": "",
             "choices": @{body('Select')},
             "style": "expanded"
           }
         ],
         "actions": [
           {
             "type": "Action.Http",
             "title": "선택 서류 안전 발급",
             "url": "{HTTP_POST_URL}",
             "method": "POST",
             "body": "{\"requested_files\": \"{{SelectedDocs.value}}\", \"sender\": \"@{triggerBody()?['from']}\"}",
             "headers": [
               {
                 "name": "Authorization",
                 "value": ""
               }
             ]
           }
         ]
       }
       </script>
     </body>
     </html>
     ```

### 8단계: 아웃룩 1차 회신 발송
1. **`Office 365 Outlook - 회신 메일 보내기(V2)`** 액션을 추가합니다.
   * 메시지 ID: 트리거의 `메시지 ID(Message Id)` 동적 값 매핑
   * 본문: **7단계의 `작성(Compose)` 출력값**을 통째로 삽입합니다.
   * 고급 옵션 표시 ➜ **`HTML 여부`**를 **`예(Yes)`**로 강제 지정합니다.
2. 흐름을 **저장**하고 활성화합니다.

---

## 🔒 [PART 3] 사내 테넌트 사용 승인 처리 (최종 등록)

보안 정책상, Outlook 내부에서 백그라운드 HTTP API를 직접 제어하는 Actionable Message를 수신하기 위해 조직 내부의 승인을 거쳐야 합니다. (외부 테스트를 하기 위한 전제조건)

### 9단계: 아웃룩 개발자 포탈 등록
1. [Actionable Email Developer Dashboard](https://outlook.office.com/connectors/publish) 에 접속합니다.
2. **`New Provider`**를 생성합니다.
   * Friendly Name: `GEV Auto Admin Portal`
   * Provider ID: 자동 생성됨
   * Sender Email addresses from which actionable emails will originate: `taegyu.kim@gevernova.com` (보내는 이 메일 주소)
   * Target URL: **1단계에서 획득한 백엔드 흐름 1의 HTTP POST URL** 입력
   * Scope of submission: **`Organization`** (사내 전체 조직 배포용) 또는 **`Test Users`** (우선 김대표님 단독 테스트용)를 선택합니다.
3. 등록 완료 후 **Save**를 하면 즉시 보안 토큰 및 연동 허가가 떨어지며 즉시 전체 기능이 가동됩니다.
