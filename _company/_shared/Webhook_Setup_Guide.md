# ⚡ Power Automate Webhook 설정 가이드

본 문서는 IT 보안 부서의 MS Entra API 승인을 우회하고, 사내 M365 클라우드 환경에서 즉시 24시간 무인 렌탈 시스템을 구동하기 위한 'HTTP Webhook' 설정 절차를 안내합니다.

## 1. 트리거 블록 설정

1. Power Automate의 **`HTTP 요청을 수신할 때 (When an HTTP request is received)`** 블록을 클릭합니다.
2. **`요청 본문 JSON 스키마 (Request Body JSON Schema)`** 입력란에 아래의 JSON 코드를 정확히 복사하여 붙여넣습니다.

```json
{
    "type": "object",
    "properties": {
        "equipmentCode": {
            "type": "string"
        },
        "projectName": {
            "type": "string"
        },
        "returnDate": {
            "type": "string"
        }
    }
}
```

## 2. 메서드 및 저장

3. 블록 하단 (또는 고급 옵션)의 **`메서드(Method)`**를 `POST`로 지정합니다.
4. 우측 상단의 **[저장(Save)]** 버튼을 클릭합니다.

## 3. 웹훅 URL 발급 (Next Step)

5. 저장이 완료되면 블록 상단에 `https://prod-...` 로 시작하는 **매우 긴 HTTP POST URL**이 생성됩니다.
6. 해당 URL을 복사하여 `App.tsx` 또는 환경 변수에 주입하면, 파이썬 서버 없이 프론트엔드에서 즉시 클라우드로 데이터를 전송하는 파이프라인이 완성됩니다.
