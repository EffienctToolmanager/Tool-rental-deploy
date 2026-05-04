<#
.SYNOPSIS
    Tool Rental Management System (PowerShell Edition - FIXED)
    - No Python required. Works with MS Excel on Windows.
    - Optimized for BOX Drive and Corporate Environments.
#>

$boxPath = "C:\Users\$env:USERNAME\Box\Tool_Rental_System" # 실제 BOX 드라이브 경로에 맞춰 수정 필요
$dbPath = "$boxPath\Tool_Rental_DB.xlsx"
$mediaPath = "$boxPath\Rental_Photos"

# 1. 환경 체크 및 폴더 생성
if (!(Test-Path $boxPath)) { New-Item -ItemType Directory -Path $boxPath -Force }
if (!(Test-Path $mediaPath)) { New-Item -ItemType Directory -Path $mediaPath -Force }

function Initialize-ExcelDB {
    if (!(Test-Path $dbPath)) {
        Write-Host "Excel DB를 생성하고 있습니다..." -ForegroundColor Cyan
        $excel = New-Object -ComObject Excel.Application
        $workbook = $excel.Workbooks.Add()
        $sheet = $workbook.Worksheets.Item(1)
        
        # 헤더 작성
        $headers = @("CaseCode", "Date", "Borrower", "Email", "SSO", "ToolName", "ProjectName", "ProjectCode", "Purpose", "PickupDate", "ReturnDate", "Status")
        for ($i = 1; $i -le $headers.Count; $i++) {
            $sheet.Cells.Item(1, $i) = $headers[$i-1]
            $sheet.Cells.Item(1, $i).Font.Bold = $true
        }
        
        $workbook.SaveAs($dbPath)
        $workbook.Close()
        $excel.Quit()
        Write-Host "Excel DB 생성 완료: $dbPath" -ForegroundColor Green
    }
}

function Get-NextCaseCode {
    $date = Get-Date -Format "yyyyMMdd"
    $count = 0
    if (Test-Path $dbPath) {
        $excel = New-Object -ComObject Excel.Application
        $excel.Visible = $false
        $workbook = $excel.Workbooks.Open($dbPath)
        $sheet = $workbook.Worksheets.Item(1)
        $count = $sheet.UsedRange.Rows.Count - 1
        $workbook.Close()
        $excel.Quit()
    }
    $id = ($count + 1).ToString("D3")
    return "RNT-$date-$id"
}

function Export-ToJson {
    Write-Host "대시보드 데이터를 갱신하고 있습니다..." -ForegroundColor Gray
    try {
        $excel = New-Object -ComObject Excel.Application
        $excel.Visible = $false
        $workbook = $excel.Workbooks.Open($dbPath)
        $sheet = $workbook.Worksheets.Item(1)
        
        $lastRow = $sheet.UsedRange.Rows.Count
        $data = @()
        
        if ($lastRow -gt 1) {
            for ($i = 2; $i -le $lastRow; $i++) {
                $row = [PSCustomObject]@{
                    id         = if($sheet.Cells.Item($i, 1).Value2) { $sheet.Cells.Item($i, 1).Value2.ToString() } else { "" }
                    name       = if($sheet.Cells.Item($i, 6).Value2) { $sheet.Cells.Item($i, 6).Value2.ToString() } else { "" }
                    category   = "Tools"
                    status     = if($sheet.Cells.Item($i, 12).Value2) { $sheet.Cells.Item($i, 12).Value2.ToString() } else { "Available" }
                    lastRenter = if($sheet.Cells.Item($i, 3).Value2) { $sheet.Cells.Item($i, 3).Value2.ToString() } else { "-" }
                }
                $data += $row
            }
        }
        
        $data | ConvertTo-Json | Out-File "$boxPath\data.json" -Encoding utf8
        $workbook.Close($false)
        $excel.Quit()
    } catch {
        Write-Host "JSON 내보내기 중 오류 발생: $_" -ForegroundColor Red
    }
}

function Show-Menu {
    Clear-Host
    Write-Host "==========================================" -ForegroundColor Yellow
    Write-Host "   🛠️ Tool Rental Management System (PS) " -ForegroundColor Yellow
    Write-Host "==========================================" -ForegroundColor Yellow
    Write-Host "1. 대여 신청 (New Rental)"
    Write-Host "2. 반납 처리 (Return Tool)"
    Write-Host "3. 대시보드 데이터 갱신 (Sync)"
    Write-Host "4. 종료 (Exit)"
    Write-Host "------------------------------------------"
}

# --- 메인 실행 로직 ---
Initialize-ExcelDB
Export-ToJson

while ($true) {
    Show-Menu
    $choice = Read-Host "원하시는 작업 번호를 입력하세요"
    
    switch ($choice) {
        "1" {
            Write-Host "`n[대여 신청 등록]" -ForegroundColor Cyan
            $caseCode = Get-NextCaseCode
            $borrower = Read-Host "대여자 성명"
            $tool = Read-Host "장비명"
            $project = Read-Host "프로젝트명"
            
            $excel = New-Object -ComObject Excel.Application
            $workbook = $excel.Workbooks.Open($dbPath)
            $sheet = $workbook.Worksheets.Item(1)
            $nextRow = $sheet.UsedRange.Rows.Count + 1
            
            $sheet.Cells.Item($nextRow, 1) = $caseCode
            $sheet.Cells.Item($nextRow, 2) = Get-Date -Format "yyyy-MM-dd"
            $sheet.Cells.Item($nextRow, 3) = $borrower
            $sheet.Cells.Item($nextRow, 6) = $tool
            $sheet.Cells.Item($nextRow, 7) = $project
            $sheet.Cells.Item($nextRow, 12) = "In Use"
            
            $workbook.Save()
            $workbook.Close()
            $excel.Quit()
            
            Export-ToJson
            Write-Host "`n등록 완료! Case Code: $caseCode" -ForegroundColor Green
            Read-Host "엔터를 누르면 메뉴로 돌아갑니다..."
        }
        "2" {
            $code = Read-Host "반납할 Case Code를 입력하세요"
            Write-Host "기능 구현 중..."
            Read-Host "엔터를 누르면 메뉴로 돌아갑니다..."
        }
        "3" {
            Export-ToJson
            Read-Host "동기화 완료! 엔터를 누르세요..."
        }
        "4" { exit }
        default { Write-Host "잘못된 입력입니다." -ForegroundColor Red; Start-Sleep -Seconds 1 }
    }
}
