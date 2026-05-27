# GEV 자동 행정 문서 발급 포탈 구축 가이드 (Blueprint)

본 가이드는 Microsoft Power Automate를 사용하여 **관리 공수가 전혀 발생하지 않는 대화식 행정 서류 자동 발급 시스템(Zero-Maintenance Interactive Document Portal)**을 구축하기 위한 구체적인 구성 명세서, 단계별 액션 설정 및 이메일 본문용 프리미엄 반응형 HTML 코드 원본입니다.

---

## 🏗️ End-to-End Power Automate 전체 설계도

```
[흐름 A: 목록 제공 루프 (Discovery Loop)]
트리거: Outlook - 새 이메일이 도착할 때 (V3)
  └─ 제목 필터: "#자료요청" 또는 "#행정서류"
액션 1: OneDrive for Business - 폴더 내 파일 나열 (List files in folder)
  └─ 폴더 경로: "/admin_shared_docs"
액션 2: 데이터 작업 - Select (데이터 매핑 및 HTML 링크화)
  └─ From: 액션 1의 출력값 (body/value)
  └─ Map (키-값 매핑):
       - Name: item()?['Name']
       - MailToLink: concat('mailto:taegyu.kim@gevernova.com?subject=[자료요청] ', item()?['Name'], '&body=아래 전송 버튼을 누르시면 자료가 즉시 메일 첨부로 자동 발송됩니다.')
액션 3: 데이터 작업 - 작성 (Compose - HTML 빌드)
  └─ 입력값: [아래 제공된 프리미엄 HTML 템플릿 코드 붙여넣기]
액션 4: Outlook - 회신 메일 보내기 (V2)
  └─ 본문: 액션 3의 결과물 (Compose HTML)
  └─ HTML 여부: 예 (IsHTML = True)

---------------------------------------------------------

[흐름 B: 서류 전달 루프 (Delivery Loop)]
트리거: Outlook - 새 이메일이 도착할 때 (V3)
  └─ 제목 필터: "[자료요청]"
액션 1: 데이터 작업 - 작성 (파일명 안전 추출)
  └─ 입력값 (식/Expression): trim(replace(triggerBody()?['subject'], '[자료요청]', ''))
액션 2: OneDrive for Business - 경로를 사용하여 파일 콘텐츠 가져오기 (Get file content)
  └─ 파일 경로: concat('/admin_shared_docs/', outputs('작성_파일명_안전_추출'))
액션 3: Outlook - 회신 메일 보내기 (V2)
  └─ 본문: "요청하신 서류를 첨부파일로 발송해 드립니다."
  └─ 첨부파일 이름: outputs('작성_파일명_안전_추출')
  └─ 첨부파일 콘텐츠: outputs('파일_콘텐츠_가져오기')
```

---

## 🎨 프리미엄 HTML 대화식 이메일 템플릿

Power Automate의 **HTML 빌드 (Compose)** 액션에 아래의 한글화된 고품격 HTML 코드를 그대로 붙여넣어 사용하시면 됩니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GEV Corporate Document Portal</title>
    <style>
        body {
            font-family: '맑은 고딕', 'Malgun Gothic', Arial, sans-serif;
            background-color: #F4F6F9;
            margin: 0;
            padding: 0;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #FFFFFF;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            border-top: 6px solid #1F497D;
            overflow: hidden;
        }
        .header {
            background-color: #1F497D;
            padding: 25px;
            text-align: center;
        }
        .header h1 {
            color: #FFFFFF;
            font-size: 20px;
            margin: 0;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .header p {
            color: #D6B656;
            margin: 5px 0 0 0;
            font-size: 13px;
            font-weight: bold;
        }
        .content {
            padding: 30px 25px;
        }
        .instruction {
            font-size: 14px;
            line-height: 1.6;
            color: #555555;
            margin-bottom: 25px;
            text-align: center;
        }
        .file-list {
            margin: 20px 0;
        }
        .file-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 20px;
            background-color: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            margin-bottom: 12px;
            transition: all 0.2s ease;
        }
        .file-info {
            display: flex;
            align-items: center;
        }
        .file-icon {
            font-size: 24px;
            margin-right: 12px;
            color: #1F497D;
        }
        .file-name {
            font-size: 14px;
            font-weight: bold;
            color: #2D3748;
        }
        .btn-request {
            display: inline-block;
            padding: 8px 16px;
            background-color: #1F497D;
            color: #FFFFFF !important;
            text-decoration: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
            transition: background-color 0.2s ease;
            text-align: center;
        }
        .btn-request:hover {
            background-color: #D6B656;
        }
        .footer {
            background-color: #F8FAFC;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #E2E8F0;
            font-size: 11px;
            color: #718096;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>GEV 행정 문서 자동 발급 포탈</h1>
            <p>GEV_Admin_Auto_Portal v1.0</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <p class="instruction">
                안녕하세요.<br>
                현재 공유 가능한 법인 서류 목록입니다.<br>
                <strong>필요한 서류 옆의 [이메일 발급] 버튼을 눌러 즉시 전송받으세요.</strong>
            </p>
            
            <div class="file-list">
                <!--이 구간은 Power Automate의 'Apply to each' 루프 또는 HTML Table 생성 액션에 의해 동적 렌더링됩니다-->
                <div class="file-card">
                    <div class="file-info">
                        <span class="file-icon">📄</span>
                        <span class="file-name">사업자등록증.pdf</span>
                    </div>
                    <a href="mailto:taegyu.kim@gevernova.com?subject=[자료요청] 사업자등록증.pdf&body=아래 전송 버튼을 누르시면 자료가 즉시 메일 첨부로 자동 발송됩니다." class="btn-request">이메일 발급</a>
                </div>
                
                <div class="file-card">
                    <div class="file-info">
                        <span class="file-icon">📄</span>
                        <span class="file-name">통장사본.pdf</span>
                    </div>
                    <a href="mailto:taegyu.kim@gevernova.com?subject=[자료요청] 통장사본.pdf&body=아래 전송 버튼을 누르시면 자료가 즉시 메일 첨부로 자동 발송됩니다." class="btn-request">이메일 발급</a>
                </div>
                
                <div class="file-card">
                    <div class="file-info">
                        <span class="file-icon">📄</span>
                        <span class="file-name">법인등기부등본.pdf</span>
                    </div>
                    <a href="mailto:taegyu.kim@gevernova.com?subject=[자료요청] 법인등기부등본.pdf&body=아래 전송 버튼을 누르시면 자료가 즉시 메일 첨부로 자동 발송됩니다." class="btn-request">이메일 발급</a>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            본 메일은 GEV AI Auto-Admin 시스템에 의해 실시간 자동 처리되고 있습니다.<br>
            © 2026 GEV Corp. All rights reserved.
        </div>
    </div>
</body>
</html>
```

---

## 🔒 이중 보안 필터 적용 구성 (Security)

### 1. 상위 경로 이탈 방지 (Directory Traversal 방어)
사용자가 제목을 해킹하여 비공유 폴더의 중요 문서를 취득하려는 행위를 감지 및 차단합니다.
* **차단 조건식(Condition)**:
  `outputs('작성_파일명_안전_추출')` 값에 `/`, `\`, 또는 `..` 문자가 포함되어 있을 경우 ➜ **흐름 즉시 종료(Terminate Flow)**.

### 2. 허용 확장자 필터 (Whitelisting)
의도하지 않은 실행 파일(`.exe`, `.bat` 등)이나 엉뚱한 임시 파일 전송을 방어합니다.
* **통과 조건식(Condition)**:
  ```text
  Or(
      endsWith(outputs('작성_파일명_안전_추출'), '.pdf'),
      endsWith(outputs('작성_파일명_안전_추출'), '.jpg'),
      endsWith(outputs('작성_파일명_안전_추출'), '.png'),
      endsWith(outputs('작성_파일명_안전_추출'), '.xlsx')
  )
  ```
  위 조건식에 참(True)일 때만 발송 단계를 진행하고, 그렇지 않으면 이메일 반려 처리합니다.
