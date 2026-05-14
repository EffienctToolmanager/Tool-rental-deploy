# GEV Tool Rental System Backend Provisioning Script (Robust Version)
param(
    [string]$SiteUrl = "https://gevernova.sharepoint.com/sites/ToolManagement"
)

Import-Module PnP.PowerShell -ErrorAction SilentlyContinue

Write-Host "`n>>> 🔐 SharePoint($SiteUrl)에 연결합니다..." -ForegroundColor Cyan
Write-Host ">>> 로그인 창이 뜨지 않으면 표시되는 코드를 https://microsoft.com/devicelogin 에 입력해 주세요." -ForegroundColor Yellow

# 최신 환경에서 가장 안정적인 DeviceLogin 방식 시도
try {
    Connect-PnPOnline -Url $SiteUrl -DeviceLogin
} catch {
    Write-Host "❌ 로그인 시도 중 오류 발생: $($_.Exception.Message)" -ForegroundColor Red
    return
}

$ListName = "Tool_Rental_Records"
$DocLibName = "Tool_Rental_Photos"

Write-Host "`n>>> 🛠 인프라 구성을 시작합니다..." -ForegroundColor White

# 1. Document Library 생성
if (!(Get-PnPList -Identity $DocLibName -ErrorAction SilentlyContinue)) {
    New-PnPList -Title $DocLibName -Template DocumentLibrary
    Write-Host "✅ Document Library '$DocLibName' 생성 완료." -ForegroundColor Green
} else {
    Write-Host "ℹ️ '$DocLibName'이 이미 존재합니다." -ForegroundColor Yellow
}

# 2. SharePoint List 생성
if (!(Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue)) {
    New-PnPList -Title $ListName -Template GenericList
    Write-Host "✅ List '$ListName' 생성 완료. 컬럼 구성을 시작합니다..." -ForegroundColor Green
    
    # 컬럼 생성 (에러 방지를 위해 하나씩 처리)
    $fields = @(
        @{Type="Text"; InternalName="ToolCode"; DisplayName="ToolCode"},
        @{Type="Choice"; InternalName="Status"; DisplayName="Status"; Choices="Available","In Use","Maintenance"},
        @{Type="Text"; InternalName="Location"; DisplayName="Location"},
        @{Type="Text"; InternalName="UserName"; DisplayName="UserName"},
        @{Type="Text"; InternalName="UserEmail"; DisplayName="UserEmail"},
        @{Type="Text"; InternalName="PM_Email"; DisplayName="PM_Email"},
        @{Type="Text"; InternalName="Project"; DisplayName="Project"},
        @{Type="Text"; InternalName="ProjectCode"; DisplayName="ProjectCode"},
        @{Type="Note"; InternalName="Purpose"; DisplayName="Purpose"},
        @{Type="DateTime"; InternalName="Date"; DisplayName="Date"},
        @{Type="DateTime"; InternalName="ReturnDate"; DisplayName="ReturnDate"},
        @{Type="Text"; InternalName="CaseID"; DisplayName="CaseID"},
        @{Type="Choice"; InternalName="Action"; DisplayName="Action"; Choices="Rental","Return"},
        @{Type="URL"; InternalName="PhotoUrl"; DisplayName="PhotoUrl"}
    )

    foreach ($field in $fields) {
        Write-Host "   - $($field.DisplayName) 생성 중..." -ForegroundColor Gray
        if ($field.Type -eq "Choice") {
            Add-PnPField -List $ListName -Type $field.Type -InternalName $field.InternalName -DisplayName $field.DisplayName -Choices $field.Choices -AddToDefaultView | Out-Null
        } else {
            Add-PnPField -List $ListName -Type $field.Type -InternalName $field.InternalName -DisplayName $field.DisplayName -AddToDefaultView | Out-Null
        }
    }

    Write-Host "🚀 모든 필드 구성이 완벽하게 완료되었습니다!" -ForegroundColor Cyan
} else {
    Write-Host "ℹ️ '$ListName' 리스트가 이미 존재합니다. 설정을 건너뜁니다." -ForegroundColor Yellow
}

Write-Host "`n🎉 [성공] 백엔드 시스템 구축이 완료되었습니다." -ForegroundColor Green
Disconnect-PnPOnline
