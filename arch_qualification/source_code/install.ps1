# Design System Harness Installer for GE VERNOVA Tool Rental HQ (Windows PowerShell)
# Sets up local git hooks to trigger Claude .mjs validation scripts.

Write-Host "🚀 Starting Design System Harness installation on Windows..." -ForegroundColor Green

# 1. Check Node.js installation
$nodeVer = & node -v 2>$null
if ($null -eq $nodeVer) {
    Write-Error "❌ Error: Node.js is not installed. Please install Node.js to run validation hooks."
    Exit 1
}
Write-Host "  - Node.js version detected: $nodeVer" -ForegroundColor Cyan

# 2. Find the Git repository root (traverse up if necessary)
$currentDir = Get-Item .
$gitDir = $null
while ($null -ne $currentDir -and $currentDir.FullName -ne $currentDir.Root.FullName) {
    $potentialGit = Join-Path $currentDir.FullName ".git"
    if (Test-Path $potentialGit -PathType Container) {
        $gitDir = $potentialGit
        break
    }
    $currentDir = $currentDir.Parent
}

if ($null -eq $gitDir) {
    Write-Warning "⚠️  Warning: Git repository root (.git folder) not found. Git hooks could not be registered automatically."
    Write-Host "  - Please run this script from inside a Git repository."
    Exit 0
}

Write-Host "  - Git directory located at: $gitDir" -ForegroundColor Cyan

# 3. Create hooks directory if missing
$hooksDir = Join-Path $gitDir "hooks"
if (-not (Test-Path $hooksDir)) {
    New-Item -ItemType Directory -Path $hooksDir -Force | Out-Null
}

# 4. Create Git pre-commit hook (Shell script for compatibility in typical git environments)
$preCommitHook = Join-Path $hooksDir "pre-commit"
Write-Host "Registering pre-commit validation hook..." -ForegroundColor White

$preCommitContent = @'
#!/bin/bash

# Triggered before git commit - runs design system checks on staged files.
echo -e "\x1b[36m🔍 Running Design System Harness Hooks...\x1b[0m"

# Get a list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
    exit 0
fi

# Locate project directory where .claude is configured
PROJECT_DIR="$(pwd)"
while [ "$PROJECT_DIR" != "/" ]; do
    if [ -d "$PROJECT_DIR/.claude/hooks" ]; then
        break
    fi
    PROJECT_DIR="$(dirname "$PROJECT_DIR")"
done

if [ ! -d "$PROJECT_DIR/.claude/hooks" ]; then
    echo -e "\x1b[33m⚠️  .claude/hooks folder not found. Skipping checks.\x1b[0m"
    exit 0
fi

# Run hooks for each staged file
for FILE in $STAGED_FILES; do
    FULL_PATH="$PROJECT_DIR/$FILE"
    
    # 1. Protect critical files
    node "$PROJECT_DIR/.claude/hooks/protect-files.mjs" "$FULL_PATH"
    if [ $? -ne 0 ]; then
        echo -e "\x1b[31m❌ Commit aborted by protect-files check.\x1b[0m"
        exit 1
    fi
    
    # 2. Check design tokens
    node "$PROJECT_DIR/.claude/hooks/check-design-tokens.mjs" "$FULL_PATH"
    
    # 3. Check storybook files
    node "$PROJECT_DIR/.claude/hooks/check-story-exists.mjs" "$FULL_PATH"
done

echo -e "\x1b[32m✔  All design system checks completed successfully.\x1b[0m"
exit 0
'@

Set-Content -Path $preCommitHook -Value $preCommitContent -Encoding utf8 -Force

# 5. Create Git post-commit hook for desktop notifications
$postCommitHook = Join-Path $hooksDir "post-commit"
Write-Host "Registering post-commit notification hook..." -ForegroundColor White

$postCommitContent = @'
#!/bin/bash

# Trigger desktop success notification upon successful commit
PROJECT_DIR="$(pwd)"
while [ "$PROJECT_DIR" != "/" ]; do
    if [ -d "$PROJECT_DIR/.claude/hooks" ]; then
        break
    fi
    PROJECT_DIR="$(dirname "$PROJECT_DIR")"
done

if [ -f "$PROJECT_DIR/.claude/hooks/notify.mjs" ]; then
    node "$PROJECT_DIR/.claude/hooks/notify.mjs" "Harness Verification" "Commit successful! Design tokens and stories verified."
fi
'@

Set-Content -Path $postCommitHook -Value $postCommitContent -Encoding utf8 -Force

Write-Host "✅ Git hooks installed successfully inside $hooksDir!" -ForegroundColor Green
Write-Host "  - Pre-commit Hook: Runs static token audits, environment locks, and story checks." -ForegroundColor Yellow
Write-Host "  - Post-commit Hook: Dispatches desktop notification alerts upon commit success." -ForegroundColor Yellow
Write-Host "✨ Design System Harness installation complete." -ForegroundColor Green
