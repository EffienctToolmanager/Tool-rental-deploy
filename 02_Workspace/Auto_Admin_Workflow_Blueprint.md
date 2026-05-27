# GEV Auto-Admin Document Portal Configuration Blueprint

This document contains the exact technical configurations, step-by-step actions, and the premium responsive HTML template required to build the **Zero-Maintenance Interactive Document Portal** in Microsoft Power Automate.

---

## 🏗️ End-to-End Power Automate Architecture

```
[Flow A: Discovery Loop (목록 제공)]
Trigger: Outlook - 새 이메일이 도착할 때 (V3)
  └─ Subject filter: "#자료요청" or "#행정서류"
Action 1: OneDrive for Business - 폴더 내 파일 나열 (List files in folder)
  └─ Folder path: "/admin_shared_docs"
Action 2: Data Operations - Select (데이터 가공)
  └─ From: Outputs of Action 1
  └─ Map: 
       - Name: item()?['Name']
       - MailToLink: concat('mailto:taegyu.kim@gevernova.com?subject=[자료요청] ', item()?['Name'], '&body=아래 전송 버튼을 누르시면 자료가 즉시 메일 첨부로 자동 발송됩니다.')
Action 3: Data Operations - Compose (HTML 빌드)
  └─ Inputs: [Premium HTML Template (below)]
Action 4: Outlook - 회신 메일 보내기 (V2)
  └─ Body: Output of Action 3 (IsHTML = True)

---------------------------------------------------------

[Flow B: Delivery Loop (서류 발급)]
Trigger: Outlook - 새 이메일이 도착할 때 (V3)
  └─ Subject filter: "[자료요청]"
Action 1: Data Operations - Compose (파일명 추출)
  └─ Inputs (Expression): trim(replace(triggerBody()?['subject'], '[자료요청]', ''))
Action 2: OneDrive for Business - 파일 콘텐츠 가져오기 (Get file content using path)
  └─ File Path: concat('/admin_shared_docs/', outputs('Compose_파일명_추출'))
Action 3: Outlook - 회신 메일 보내기 (V2)
  └─ Body: "요청하신 서류를 첨부파일로 발송해 드립니다."
  └─ Attachments Name: outputs('Compose_파일명_추출')
  └─ Attachments Content: outputs('Get_file_content')
```

---

## 🎨 Premium HTML Interactive Email Template

Copy and paste the following HTML block directly into the **Compose HTML** action in Power Automate:

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

## 🔒 Security & Defense Enforcements

### Directory Traversal Prevention
To guarantee that users cannot request files outside the directory, place a **Condition** check before retrieving the file:
```text
If Expression: contains(outputs('Compose_파일명_추출'), '/') 
            or contains(outputs('Compose_파일명_추출'), '\') 
            or contains(outputs('Compose_파일명_추출'), '..')
Then: Terminate Flow (Abused request detected)
```

### Supported Extensions Whitelisting
Enforce file extensions validation:
```text
If Expression: or(
    endsWith(outputs('Compose_파일명_추출'), '.pdf'),
    endsWith(outputs('Compose_파일명_추출'), '.jpg'),
    endsWith(outputs('Compose_파일명_추출'), '.png'),
    endsWith(outputs('Compose_파일명_추출'), '.xlsx')
)
Then: Continue processing
Else: Terminate Flow (Unsupported file type)
```
