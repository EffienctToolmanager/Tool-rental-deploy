# Tool Automate System - All-In-One Source Code

본 문서는 사내 PC의 AI가 전체 코드베이스를 하나의 파일로 다운로드받아 쉽게 파싱하고 복사할 수 있도록 모아둔 소스 코드 파일집입니다.

## File: `CLAUDE.md`

```markdown
# CLAUDE.md - Unified Design System Harness Rules

> [!IMPORTANT]
> **Unified Agent Constraints**
> This specification applies universally to **all active agents**:
> 1. **CLAUDE**: The primary LLM developer interface.
> 2. **김대표 (Antigravity CLI Agent / Gemini 3.5 Flash)**: Local Windows-based orchestrator.
> 3. **헤비서 (Hermes Agent / Codex)**: Remote VPS-based background daemon.
>
> Every agent must strictly adhere to these rules when building or modifying components.

---

## 💻 Core Commands & Workflows

- **Start Development Server**: `npm run dev`
- **Build Production Bundle**: `npm run build`
- **Preview Production Build**: `npm run preview`
- **Lint Check**: (N/A - use custom save hooks)
- **TypeScript Compilation Check**: `npx tsc --noEmit`

---

## 🎨 Design System & Styling Rules

### 1. Color Token Compliance
* **ABSOLUTE PROHIBITION of hardcoded color values** (Hex, RGB, HSL, or named CSS colors like `bg-white`, `text-black`, `bg-red-500`, `#ff0000`, etc.).
* **Mandatory Custom Color Properties**: All colors must use Tailwind v4 theme variables mapped to our semantic variables:
  * For CSS files: Use `var(--color-*)` (e.g., `color: var(--color-evergreen-800)` or custom theme semantic properties like `var(--f-bg-main)`).
  * For Tailwind classes: Use corresponding tailwind properties configuration (e.g., `text-evergreen-800` or `bg-accent-violet`).

### 2. Component Structure (1 Component = 4 Files)
Every new UI component must reside in its own folder under `src/components/` and contain exactly these 4 files:
1. `ComponentName.tsx`: Main React component using TypeScript.
2. `ComponentName.stories.tsx`: Storybook 8 specification file containing mock data scenarios.
3. `ComponentName.css`: Modular custom css variable mappings or overrides.
4. `ComponentName.test.tsx`: Unit/Integration test file verifying key user interactions.

### 3. Component Sizing Rules (Widths & Heights)
* **No hardcoded width px** (e.g., `width: 350px` or `w-[320px]` is strictly forbidden).
* **Parent-Driven Sizing**: Components must be designed with `w-full` (100% width) and responsive flex/grid layouts. Control horizontal bounds using parent margin/padding container structures.

### 4. Figma Fidelity & Prohibitions
* **Text Exactness**: All text strings, labels, status values, and button titles must match Figma designs verbatim. Do not paraphrase or translate.
* **Variant Constraint**: Implement ONLY the variant properties (`disabled`, `hover`, `active`, sizes) defined in the Figma file. DO NOT invent custom UI states or add non-standard styling options.

---

## 🤖 Agent Delegation & Roles

When delegating tasks or running workflows, roles are assigned as follows:

| Agent / Model | Primary Responsibility | Workspace Context |
| :--- | :--- | :--- |
| **CLAUDE** | Interactive code generation, refactoring, and inline file edits. | Local IDE workspace |
| **김대표 (Gemini 3.5 Flash)** | Local build verification, workspace command execution, and plan approval audits. | Local Antigravity CLI |
| **헤비서 (Hermes / Codex)** | Bidirectional knowledge synchronization, remote VPS deployment, and background hook triggers. | Remote SSH / Rclone daemon |

### Sub-Agent Delegations (.claude/agents/)
* **`figma-implementer`**: Code generation based on Figma URLs using Figma MCP.
* **`token-checker` & `design-qa`**: Spacing/color token compliance, layout audits, and test suites.
* **`design-reviewer`**: Offline local checks for code style anti-patterns.


```

---

## File: `package.json`

```json
{
  "name": "tool_rental_hq",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "directories": {
    "doc": "docs"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@azure/msal-browser": "^5.10.1",
    "@azure/msal-react": "^5.4.1",
    "@google/stitch-sdk": "^0.3.5",
    "framer-motion": "^12.38.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-icons": "^5.6.0",
    "recharts": "^3.8.1"
  },
  "devDependencies": {
    "@storybook/react": "^10.4.4",
    "@tailwindcss/postcss": "^4.3.0",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/node": "^25.9.3",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.2",
    "autoprefixer": "^10.5.0",
    "jsdom": "^29.1.1",
    "postcss": "^8.5.14",
    "tailwindcss": "^4.3.0",
    "typescript": "^6.0.3",
    "vite": "^8.0.13",
    "vitest": "^4.1.8"
  }
}

```

---

## File: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}

```

---

## File: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
  }
})


```

---

## File: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

---

## File: `postcss.config.js`

```javascript
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
}

```

---

## File: `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.py"
    }
  ]
}

```

---

## File: `requirements.txt`

```text
fastapi
pydantic
requests
python-multipart

```

---

## File: `install.ps1`

```powershell
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

```

---

## File: `install.sh`

```bash
#!/bin/bash

# Design System Harness Installer for GE VERNOVA Tool Rental HQ
# Sets up local git hooks to trigger Claude .mjs validation scripts.

echo -e "\x1b[32m🚀 Starting Design System Harness installation...\x1b[0m"

# 1. Check Node.js installation
if ! command -v node &> /dev/null; then
    echo -e "\x1b[31m❌ Error: Node.js is not installed. Please install Node.js to run validation hooks.\x1b[0m"
    exit 1
fi
echo -e "  - Node.js version detected: \x1b[36m$(node -v)\x1b[0m"

# 2. Find the Git repository root (traverse up if necessary)
CURRENT_DIR="$(pwd)"
GIT_DIR=""
while [ "$CURRENT_DIR" != "/" ] && [ -string "$CURRENT_DIR" ]; do
    if [ -d "$CURRENT_DIR/.git" ]; then
        GIT_DIR="$CURRENT_DIR/.git"
        break
    fi
    CURRENT_DIR="$(dirname "$CURRENT_DIR")"
done

if [ -z "$GIT_DIR" ]; then
    echo -e "\x1b[33m⚠️  Warning: Git repository root (.git folder) not found. Git hooks could not be registered automatically.\x1b[0m"
    echo -e "  - Please run this script from inside a Git repository."
    exit 0
fi

echo -e "  - Git directory located at: \x1b[36m$GIT_DIR\x1b[0m"

# 3. Create hooks directory if missing
HOOKS_DIR="$GIT_DIR/hooks"
mkdir -p "$HOOKS_DIR"

# 4. Create Git pre-commit hook
PRE_COMMIT_HOOK="$HOOKS_DIR/pre-commit"
echo "Registering pre-commit validation hook..."

cat << 'EOF' > "$PRE_COMMIT_HOOK"
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
EOF

# 5. Create Git post-commit hook for desktop notifications
POST_COMMIT_HOOK="$HOOKS_DIR/post-commit"
echo "Registering post-commit notification hook..."

cat << 'EOF' > "$POST_COMMIT_HOOK"
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
EOF

# 6. Make hook scripts executable
chmod +x "$PRE_COMMIT_HOOK"
chmod +x "$POST_COMMIT_HOOK"

echo -e "\x1b[32m✅ Git hooks installed successfully inside $HOOKS_DIR!\x1b[0m"
echo -e "  - Pre-commit Hook: Runs static token audits, environment locks, and story checks."
echo -e "  - Post-commit Hook: Dispatches desktop notification alerts upon commit success."
echo -e "\x1b[35m✨ Design System Harness installation complete.\x1b[0m"

```

---

## File: `scripts/design_audit.mjs`

```javascript
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('Starting Figma design and token audit for Tool Rental HQ...');

// Components to scan
const components = [
  'ActiveRentals',
  'InventoryTable',
  'RentalForm',
  'SchedulingTab'
];

const report = {
  gates: [],
  discrepancies: [],
  structure: []
};

// 1. Structure Check (1 Component = 4 Files)
components.forEach(name => {
  const compDir = path.join(ROOT, 'src', 'components');
  const files = {
    tsx: path.join(compDir, `${name}.tsx`),
    stories: path.join(compDir, `${name}.stories.tsx`),
    css: path.join(compDir, `${name}.css`),
    test: path.join(compDir, `${name}.test.tsx`)
  };

  const status = {
    name,
    tsx: fs.existsSync(files.tsx),
    stories: fs.existsSync(files.stories),
    css: fs.existsSync(files.css),
    test: fs.existsSync(files.test)
  };

  report.structure.push(status);
});

// 2. Token Compliance Check (colors & layouts)
components.forEach(name => {
  const filePath = path.join(ROOT, 'src', 'components', `${name}.tsx`);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Hex color regex: #[0-9a-fA-F]{3,6} (excluding CSS vars/variables)
  const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;
  // Standard tailwind color regex: (bg|text|border)-(red|blue|green|gray|yellow|orange|purple|pink|indigo|emerald|teal|cyan|amber|lime|violet|fuchsia|rose|sky)-[0-9]{3}/g
  const twColorRegex = /\b(bg|text|border|accent|shadow|ring)-(red|blue|green|gray|yellow|orange|purple|pink|indigo|emerald|teal|cyan|amber|lime|violet|fuchsia|rose|sky)-[0-9]{3}\b/g;
  // Hardcoded pixel dimensions: e.g. p-[12px], w-[300px], style={{ width: '120px' }}
  const inlinePxRegex = /style=\{\{\s*[^}]*\b(width|height|padding|margin|gap|fontSize)\s*:\s*['"]\d+px['"]\s*[^}]*\}\}/gi;

  lines.forEach((line, index) => {
    // Avoid comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;

    let match;
    
    // Hex colors
    while ((match = hexRegex.exec(line)) !== null) {
      report.discrepancies.push({
        file: `src/components/${name}.tsx`,
        line: index + 1,
        type: 'Hardcoded Hex Color',
        value: match[0],
        suggestion: 'Replace with semantic CSS variable var(--color-*)'
      });
    }

    // Tailwind colors
    while ((match = twColorRegex.exec(line)) !== null) {
      report.discrepancies.push({
        file: `src/components/${name}.tsx`,
        line: index + 1,
        type: 'Tailwind Color Utility',
        value: match[0],
        suggestion: 'Use custom Tailwind configurations mapped to GEV brand style tokens or var(--color-*)'
      });
    }
  });
});

// 3. Build & TypeScript Compilation Checks
let buildStatus = 'PASS';
let buildLogs = '';
try {
  console.log('Running npm run build...');
  execSync('npm run build', { cwd: ROOT, stdio: 'pipe' });
  buildLogs = 'Build successful without warnings.';
} catch (error) {
  buildStatus = 'FAIL';
  buildLogs = error.stderr ? error.stderr.toString() : error.message;
}

let tsStatus = 'PASS';
let tsLogs = '';
try {
  console.log('Running TypeScript type check (tsc --noEmit)...');
  execSync('npx tsc --noEmit', { cwd: ROOT, stdio: 'pipe' });
  tsLogs = 'TypeScript compilation completed with no errors.';
} catch (error) {
  tsStatus = 'FAIL';
  tsLogs = error.stdout ? error.stdout.toString() : error.message;
}

// 4. Print Audit Report
console.log('\n======================================');
console.log('           DESIGN AUDIT REPORT        ');
console.log('======================================\n');

console.log('### 1. Build & TypeScript Gates');
console.log(`- Build Gate: ${buildStatus}`);
console.log(`- TypeScript Type Gate: ${tsStatus}\n`);

console.log('### 2. Component Structure (1 Component = 4 Files)');
console.log('| Component | TSX | Stories | CSS | Tests |');
console.log('|---|---|---|---|---|');
report.structure.forEach(s => {
  console.log(`| ${s.name} | ${s.tsx ? '✅ PASS' : '❌ FAIL'} | ${s.stories ? '✅ PASS' : '❌ FAIL'} | ${s.css ? '✅ PASS' : '❌ FAIL'} | ${s.test ? '✅ PASS' : '❌ FAIL'} |`);
});
console.log('\n');

console.log('### 3. Hardcoded Token Discrepancies');
if (report.discrepancies.length === 0) {
  console.log('No hardcoded styling variables detected. Excellent!');
} else {
  console.log('| File | Line | Type | Value | Suggestion |');
  console.log('|---|---|---|---|---|');
  report.discrepancies.forEach(d => {
    console.log(`| ${d.file} | ${d.line} | ${d.type} | \`${d.value}\` | ${d.suggestion} |`);
  });
}
console.log('\n======================================');

```

---

## File: `api/index.py`

```python
import os
import time
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vercel_serverless_backend")

app = FastAPI(title="Staging Tool Rental Serverless Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TENANT_ID = os.getenv("MS_TENANT_ID", "dummy_tenant_id")
CLIENT_ID = os.getenv("MS_CLIENT_ID", "dummy_client_id")
CLIENT_SECRET = os.getenv("MS_CLIENT_SECRET", "dummy_client_secret")

def get_msal_token():
    if TENANT_ID == "dummy_tenant_id":
        return "dummy_access_token_12345"
    return "real_token"

# --- In-Memory Persistent Database for Premium Staging Demo ---
# In-memory mock database to allow seamless serverless state updates
INITIAL_ITEMS = [
    {
        "id": "1", "toolCode": "CCP01", "brand": "Fluke", "model": "87V",
        "name": "Fluke 87V Industrial Multimeter", "equipmentType": "Industrial Digital Multimeter",
        "projectName": "Project Site A", "returnDate": "2026-06-30", "status": "Rented",
        "userEmail": "pm@ge.com", "pmEmail": "pm@ge.com", "caseId": "TR-20260613-0001",
        "datasheetUrl": "https://www.fluke.com/en-us/product/electrical-testing/digital-multimeters/fluke-87v",
        "serialNumber": "SN-FLK87V-93812", "rack": "A1",
        "specSummary": {
            "equipmentType": "Industrial Digital Multimeter",
            "measurementRange": "DC/AC Voltage: 1000V, Current: 10A (20A for 30s max), Resistance: 50 MΩ, Capacitance: 9,999 µF, Frequency: 200 kHz",
            "accuracy": "DC Voltage: ±0.05% + 1 digit, AC Voltage: ±0.7% + 2 digits (True-RMS)",
            "voltageRating": "1000 V AC/DC",
            "currentRating": "10 A continuous (20 A overload protection for 30s max)",
            "safetyCategory": "CAT III 1000 V, CAT IV 600 V",
            "connectivity": "None (Optical-to-USB optional adapter)",
            "powerSource": "9V Alkaline battery (approx. 400 hours continuous without backlight)",
            "calibrationCycle": "12 Months",
            "keyFeatures": [
                "Unique low-pass filter for accurate voltage and frequency measurements on adjustable speed motor drives (VFDs)",
                "Peak capture for intermittent signals and glitches as short as 250 µs",
                "Large, high-contrast two-level backlit display with analog bar graph"
            ],
            "typicalUse": "General industrial troubleshooting, motor drive and power distribution cabinet maintenance"
        },
    },
    {
        "id": "2", "toolCode": "CCP02", "brand": "Fluke", "model": "1738",
        "name": "Fluke 1738 Power Logger", "equipmentType": "Power Quality Logger",
        "projectName": "Project Site A", "returnDate": "2026-06-30", "status": "Rented",
        "userEmail": "pm@ge.com", "pmEmail": "pm@ge.com", "caseId": "TR-20260613-0001",
        "datasheetUrl": "https://example.com/mock-datasheets/fluke-1738.pdf",
        "serialNumber": "SN-FLK1738-48291", "rack": "A1",
        "specSummary": {
            "equipmentType": "Power Quality Logger",
            "measurementRange": "Voltage: 1000 V, Current Range: 4 A to 6000 A (sensor dependent), Power/Energy Trend",
            "accuracy": "Voltage: ±0.1% of nominal, Current: ±0.2% of range, Power: ±0.2% of range",
            "voltageRating": "1000 V CAT III / 600 V CAT IV",
            "currentRating": "Supports flexible current probes up to 6000 A",
            "safetyCategory": "CAT III 1000 V, CAT IV 600 V",
            "connectivity": "USB, Wi-Fi, Ethernet, Bluetooth",
            "powerSource": "100 V to 500 V line power or rechargeable Li-ion battery backup",
            "calibrationCycle": "12 Months",
            "keyFeatures": [
                "Automatically measure and log voltage, current, power, harmonics, and associated values",
                "Power instrument directly from the measured circuit",
                "Convenient in-field setup through touch screen and wireless download link"
            ],
            "typicalUse": "Load studies, energy assessments, and power quality analysis in distribution boards"
        },
    },
    {
        "id": "3", "toolCode": "PSU01", "brand": "Keysight", "model": "U1282A",
        "name": "Keysight U1282A Handheld Digital Multimeter", "equipmentType": "Handheld Digital Multimeter",
        "projectName": "Project Site B", "returnDate": "2026-07-05", "status": "Rented",
        "userEmail": "tech@ge.com", "pmEmail": "pm@ge.com", "caseId": "TR-20260613-0002",
        "datasheetUrl": "https://example.com/mock-datasheets/keysight-u1282a.pdf",
        "serialNumber": "SN-KEYU1282A-39128", "rack": "B2",
        "specSummary": {
            "equipmentType": "Handheld Digital Multimeter",
            "measurementRange": "DC/AC Voltage: 1000V, Current: 10A, Resistance: 600 MΩ, Capacitance: 10 mF, Frequency: 20 MHz",
            "accuracy": "DC Voltage: ±0.025% + 5 digits, AC Voltage: ±0.3% + 25 digits (True-RMS)",
            "voltageRating": "1000 V AC/DC",
            "currentRating": "10 A continuous",
            "safetyCategory": "CAT III 1000 V, CAT IV 600 V",
            "connectivity": "IR-to-USB / Bluetooth optional adapter",
            "powerSource": "4 x AAA batteries (approx. 800 hours battery life)",
            "calibrationCycle": "12 Months",
            "keyFeatures": [
                "60,000 counts dual display with analog bar graph",
                "Built-in frequency counter and square wave generator",
                "IP67 certified water and dust protection with rugged shell design"
            ],
            "typicalUse": "Precision bench and field electrical measurements and device tuning"
        },
    },
    {
        "id": "4", "toolCode": "PSU02", "brand": "Keysight", "model": "U1461A",
        "name": "Keysight U1461A Insulation Resistance Tester", "equipmentType": "Insulation Resistance Tester",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/keysight-u1461a.pdf",
        "serialNumber": "SN-KEYU1461A-28491", "rack": "B2",
        "specSummary": {
            "equipmentType": "Insulation Resistance Tester",
            "measurementRange": "Test Voltage: 50V to 1000V, Resistance range up to 200 GΩ",
            "accuracy": "Insulation Resistance: ±5% of reading, Test Voltage: +20% / -0%",
            "voltageRating": "1000 V insulation class",
            "currentRating": "Leakage current: 1 nA to 2 mA",
            "safetyCategory": "CAT III 1000V, CAT IV 600V",
            "connectivity": "USB style mock export",
            "powerSource": "Battery powered",
            "calibrationCycle": "12 Months",
            "keyFeatures": ["PI/DAR style test", "Timed insulation test", "Continuity check"],
            "typicalUse": "Motor, cable, and panel insulation condition check"
        },
    },
    {
        "id": "5", "toolCode": "CCP03", "brand": "Hioki", "model": "IR4056",
        "name": "Hioki IR4056 Insulation Tester", "equipmentType": "Insulation Tester",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/hioki-ir4056.pdf",
        "serialNumber": "SN-HIOIR4056-59102", "rack": "B1",
        "specSummary": {
            "equipmentType": "Insulation Tester",
            "measurementRange": "Test Voltage: 50V to 1000V, Resistance range up to 4000 MΩ",
            "accuracy": "Insulation Resistance: ±4% of reading, Test Voltage: ±10%",
            "voltageRating": "1000 V insulation class",
            "currentRating": "Continuity current function",
            "safetyCategory": "CAT III 600V",
            "connectivity": "No connectivity in mock profile",
            "powerSource": "Battery powered",
            "calibrationCycle": "12 Months",
            "keyFeatures": ["Fast comparator style judgement", "Bright indication", "Continuity test"],
            "typicalUse": "Routine electrical insulation screening"
        },
    },
    {
        "id": "6", "toolCode": "CCP04", "brand": "Hioki", "model": "CM4375",
        "name": "Hioki CM4375 AC/DC Clamp Meter", "equipmentType": "AC/DC Clamp Meter",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/hioki-cm4375.pdf",
        "serialNumber": "SN-HIOCM4375-72819", "rack": "C2",
        "specSummary": {
            "equipmentType": "AC/DC Clamp Meter",
            "measurementRange": "AC/DC Current: 1000 A, AC/DC Voltage: 1000 V",
            "accuracy": "Current: ±1.3% rdg + 3 dgt, Voltage: ±0.9% rdg + 3 dgt",
            "voltageRating": "1000 V AC/DC",
            "currentRating": "1000 A clamp jaw rating",
            "safetyCategory": "CAT III 1000 V, CAT IV 600 V",
            "connectivity": "Bluetooth-style mock connectivity",
            "powerSource": "Battery powered",
            "calibrationCycle": "12 Months",
            "keyFeatures": ["Clamp current measurement", "Inrush style capture", "Rugged jaw design"],
            "typicalUse": "Current measurement without circuit interruption"
        },
    },
    {
        "id": "7", "toolCode": "MEG01", "brand": "Megger", "model": "MIT525",
        "name": "Megger MIT525 Insulation Resistance Tester", "equipmentType": "High Voltage Insulation Tester",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/megger-mit525.pdf",
        "serialNumber": "SN-MEGMIT525-48291", "rack": "D1",
        "specSummary": {
            "equipmentType": "High Voltage Insulation Tester",
            "measurementRange": "Test Voltage: up to 5 kV, Resistance range up to 10 TΩ",
            "accuracy": "Insulation Resistance: ±5% of reading, Test Voltage: +20% / -0%",
            "voltageRating": "5000 V high-voltage class",
            "currentRating": "Leakage current display",
            "safetyCategory": "CAT IV 600V",
            "connectivity": "USB style mock result transfer",
            "powerSource": "Rechargeable battery / mains",
            "calibrationCycle": "12 Months",
            "keyFeatures": ["PI/DAR/DD style tests", "Guard terminal", "Large asset diagnostics"],
            "typicalUse": "Generator, transformer, cable insulation verification"
        },
    },
    {
        "id": "8", "toolCode": "MEG02", "brand": "Megger", "model": "DLRO10HD",
        "name": "Megger DLRO10HD Low Resistance Ohmmeter", "equipmentType": "Low Resistance Ohmmeter",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/megger-dlro10hd.pdf",
        "serialNumber": "SN-MEGDLRO10HD-28190", "rack": "D2",
        "specSummary": {
            "equipmentType": "Low Resistance Ohmmeter",
            "measurementRange": "micro-ohm to low-ohm resistance checks",
            "accuracy": "bonding/contact resistance grade",
            "voltageRating": "low-voltage resistance test output",
            "currentRating": "10 A class test current",
            "safetyCategory": "CAT III 300 V",
            "connectivity": "No connectivity in mock profile",
            "powerSource": "Rechargeable battery / mains",
            "calibrationCycle": "12 Months",
            "keyFeatures": ["High current continuity test", "Bidirectional measurement", "Rugged field case"],
            "typicalUse": "Grounding, bonding, breaker contact, and busbar resistance checks"
        },
    },
]

ADDITIONAL_MOCK_MODELS = [
    ("FLK", "Fluke", "179", "True-RMS Digital Multimeter", "Industrial Digital Multimeter"),
    ("FLK", "Fluke", "289", "Logging Multimeter", "Advanced Logging Multimeter"),
    ("FLK", "Fluke", "376 FC", "AC/DC Clamp Meter", "AC/DC Clamp Meter"),
    ("FLK", "Fluke", "1507", "Insulation Resistance Tester", "Insulation Tester"),
    ("FLK", "Fluke", "1587 FC", "Insulation Multimeter", "Insulation Multimeter"),
    ("FLK", "Fluke", "435-II", "Power Quality Analyzer", "Power Quality Analyzer"),
    ("FLK", "Fluke", "1625-2", "Earth Ground Tester", "Earth Ground Tester"),
    ("FLK", "Fluke", "TiS75+", "Thermal Camera", "Thermal Imaging Camera"),
    ("FLK", "Fluke", "BT521", "Battery Analyzer", "Battery Analyzer"),
    ("FLK", "Fluke", "754", "Documenting Process Calibrator", "Process Calibrator"),
    ("KEY", "Keysight", "U1273A", "Handheld Digital Multimeter", "Handheld Digital Multimeter"),
    ("KEY", "Keysight", "U1242C", "Handheld Digital Multimeter", "Handheld Digital Multimeter"),
    ("KEY", "Keysight", "U1213A", "Clamp Meter", "Clamp Meter"),
    ("KEY", "Keysight", "U1453A", "Insulation Resistance Tester", "Insulation Tester"),
    ("KEY", "Keysight", "34465A", "Bench Digital Multimeter", "Bench Digital Multimeter"),
    ("KEY", "Keysight", "E4980AL", "Precision LCR Meter", "LCR Meter"),
    ("KEY", "Keysight", "N6705C", "DC Power Analyzer", "DC Power Analyzer"),
    ("KEY", "Keysight", "U5855A", "TrueIR Thermal Imager", "Thermal Imaging Camera"),
    ("KEY", "Keysight", "U8903B", "Audio Analyzer", "Signal Analyzer"),
    ("KEY", "Keysight", "DAQ970A", "Data Acquisition System", "Data Acquisition Unit"),
    ("HIO", "Hioki", "DT4282", "Digital Multimeter", "Industrial Digital Multimeter"),
    ("HIO", "Hioki", "DT4256", "Digital Multimeter", "Field Digital Multimeter"),
    ("HIO", "Hioki", "CM3289", "AC Clamp Meter", "AC Clamp Meter"),
    ("HIO", "Hioki", "CM7290", "Display Unit", "Clamp Sensor Display Unit"),
    ("HIO", "Hioki", "IR4057", "Insulation Tester", "Insulation Tester"),
    ("HIO", "Hioki", "BT3554", "Battery Tester", "Battery Tester"),
    ("HIO", "Hioki", "PQ3198", "Power Quality Analyzer", "Power Quality Analyzer"),
    ("HIO", "Hioki", "PW3360", "Clamp Power Logger", "Power Logger"),
    ("HIO", "Hioki", "LR8450", "Memory HiLogger", "Data Logger"),
    ("HIO", "Hioki", "IM3536", "LCR Meter", "LCR Meter"),
    ("MEG", "Megger", "MIT1025", "Insulation Resistance Tester", "High Voltage Insulation Tester"),
    ("MEG", "Megger", "MIT1525", "Insulation Resistance Tester", "High Voltage Insulation Tester"),
    ("MEG", "Megger", "MFT1845+", "Multifunction Tester", "Multifunction Installation Tester"),
    ("MEG", "Megger", "DET4TC2", "Earth Tester", "Earth Ground Tester"),
    ("MEG", "Megger", "TDR2050", "Cable Fault Locator", "Cable Fault Locator"),
    ("MEG", "Megger", "BITE5", "Battery Tester", "Battery Impedance Tester"),
    ("MEG", "Megger", "MPQ1000", "Power Quality Analyzer", "Power Quality Analyzer"),
    ("MEG", "Megger", "MOM2", "Micro-ohmmeter", "Low Resistance Ohmmeter"),
    ("MEG", "Megger", "S1-568", "Insulation Resistance Tester", "Insulation Tester"),
    ("MEG", "Megger", "PAT450", "Portable Appliance Tester", "Appliance Safety Tester"),
    ("YOK", "Yokogawa", "WT3000E", "Precision Power Analyzer", "Power Analyzer"),
    ("YOK", "Yokogawa", "WT5000", "Precision Power Analyzer", "Power Analyzer"),
    ("YOK", "Yokogawa", "CW500", "Power Quality Analyzer", "Power Quality Analyzer"),
    ("YOK", "Yokogawa", "CA500", "Multifunction Process Calibrator", "Process Calibrator"),
    ("YOK", "Yokogawa", "MY600", "Digital Insulation Tester", "Insulation Tester"),
    ("YOK", "Yokogawa", "TY720", "Digital Multimeter", "Digital Multimeter"),
    ("GOS", "GW Instek", "GDM-9061", "Bench Digital Multimeter", "Bench Digital Multimeter"),
    ("GOS", "GW Instek", "GPT-15012", "Electrical Safety Analyzer", "Electrical Safety Tester"),
    ("BK", "B&K Precision", "5493C", "Bench Digital Multimeter", "Bench Digital Multimeter"),
    ("AM", "Amprobe", "AMP-330", "Clamp Meter", "Clamp Meter"),
]


def build_mock_spec(brand: str, model: str, product_name: str, equipment_type: str):
    # Determine typical ranges and accuracies based on type
    if "Multimeter" in equipment_type:
        range_val = "DC/AC Voltage: 1000V, Current: 10A, Resistance: 50 MΩ, Frequency: 100 kHz"
        acc_val = "DC Voltage: ±0.09% + 2 digits, AC Voltage: ±1.0% + 3 digits (True-RMS)"
        volt_rating = "1000 V AC/DC"
        curr_rating = "10 A fused protection"
        safety = "CAT III 1000 V, CAT IV 600 V"
        power = "9V Battery or AAA battery powered"
        features = ["True-RMS measurement class", "Auto/Manual range selectable", "Backlit digital display"]
        typical_use = f"General electrical troubleshooting and circuit analysis for {product_name}."
    elif "Insulation" in equipment_type or "Tester" in equipment_type:
        range_val = "Test Voltage: 50V to 1000V, Resistance range up to 200 GΩ" if "High Voltage" not in equipment_type else "Test Voltage: up to 5 kV, Resistance range up to 10 TΩ"
        acc_val = "Insulation Resistance: ±5% of reading, Test Voltage: +20% / -0%"
        volt_rating = "1000 V insulation class" if "High Voltage" not in equipment_type else "5000 V high-voltage class"
        curr_rating = "Leakage current: 1 nA to 2 mA"
        safety = "CAT IV 600 V"
        power = "Battery powered or rechargeable cells"
        features = ["Polarization Index (PI) and Dielectric Absorption Ratio (DAR) tests", "Auto-discharge safety function", "Guard terminal to minimize surface leakage"]
        typical_use = f"Insulation testing and motor winding diagnostics for {product_name}."
    elif "Clamp" in equipment_type:
        range_val = "AC/DC Current: 600 A or 2000 A, AC/DC Voltage: 1000 V"
        acc_val = "Current: ±1.5% rdg + 5 dgt, Voltage: ±0.9% rdg + 3 dgt"
        volt_rating = "1000 V AC/DC"
        curr_rating = "600 A / 2000 A clamp jaw rating"
        safety = "CAT III 1000 V, CAT IV 600 V"
        power = "AAA battery powered (approx. 45 hours continuous use)"
        features = ["Non-contact voltage detection (NCV)", "True-RMS AC current measurement", "Inrush current capture for motor start-ups"]
        typical_use = f"High-current testing and cable current surveys for {product_name} without breaking circuits."
    elif "Analyzer" in equipment_type or "Logger" in equipment_type:
        range_val = "Voltage: 1000 V, Current Range: up to 6000 A with sensors, 3-phase logging"
        acc_val = "Voltage: ±0.1% of nominal voltage, Harmonic Accuracy: ±1.0% of reading"
        volt_rating = "1000 V CAT III / 600 V CAT IV"
        curr_rating = "Supports active and flexible current probes"
        safety = "CAT III 1000 V, CAT IV 600 V"
        power = "Rechargeable Li-ion battery or auxiliary mains power"
        features = ["Harmonic distortion and power factor analysis", "In-field setup wizard with wiring error detection", "Event waveform capture for voltage sags and swells"]
        typical_use = f"Energy studies, load profiling, and power quality diagnostics for {product_name}."
    else:
        # Fallback to realistic generic specifications
        range_val = f"Custom range tailored for {equipment_type} standard field application."
        acc_val = "Standard industrial accuracy class (±1.5% of reading)"
        volt_rating = "600 V AC/DC electrical rating"
        curr_rating = "Standard sensor input or fused terminal protection"
        safety = "CAT III 600 V safety standard"
        power = "Battery powered (rechargeable or dry cells)"
        features = ["Rugged protective case for field operations", "Data logging capability with built-in memory", "LCD high-visibility backlit display"]
        typical_use = f"Field calibration, verification, and diagnostics for {product_name}."

    return {
        "equipmentType": equipment_type,
        "measurementRange": range_val,
        "accuracy": acc_val,
        "voltageRating": volt_rating,
        "currentRating": curr_rating,
        "safetyCategory": safety,
        "connectivity": "USB, Wi-Fi or Bluetooth (class-specific)" if "FC" in model or "BT" in model or "CM" in model or "PQ" in model else "None or USB data cable connection",
        "powerSource": power,
        "calibrationCycle": "12 Months",
        "keyFeatures": features,
        "typicalUse": typical_use,
    }


for idx, (prefix, brand, model, product_name, equipment_type) in enumerate(ADDITIONAL_MOCK_MODELS, start=len(INITIAL_ITEMS) + 1):
    if brand == "Megger":
        tool_prefix = "MEG"
    elif any(kw in equipment_type for kw in ["Multimeter", "Clamp", "Logger", "Analyzer", "Meter"]):
        tool_prefix = "CCP"
    elif any(kw in equipment_type for kw in ["Insulation", "Tester", "Power", "Calibrator"]):
        tool_prefix = "PSU"
    else:
        tool_prefix = "GEN"
    tool_code_val = f"{tool_prefix}{idx:02d}"

    code_model = model.upper().replace(" ", "").replace("+", "P").replace("-", "")
    INITIAL_ITEMS.append({
        "id": str(idx),
        "toolCode": tool_code_val,
        "brand": brand,
        "model": model,
        "name": f"{brand} {model} {product_name}",
        "equipmentType": equipment_type,
        "projectName": "",
        "returnDate": "",
        "status": "Available",
        "userEmail": "",
        "pmEmail": "",
        "caseId": "",
        "datasheetUrl": f"https://example.com/mock-datasheets/{brand.lower().replace(' ', '-')}-{model.lower().replace(' ', '-').replace('+', 'p')}.pdf",
        "serialNumber": f"SN-{prefix}{code_model}-{idx:04d}",
        "rack": f"A{idx % 4 + 1}" if idx % 2 == 0 else f"B{idx % 3 + 1}",
        "specSummary": build_mock_spec(brand, model, product_name, equipment_type),
    })


INITIAL_SCHEDULED_CASES = [
    {
        "id": "SCH-202606-0001",
        "toolCode": "CCP01",
        "model": "87V",
        "sequenceOrder": 0,
        "stage": "active_rental",
        "destination": "Project Site A",
        "startDate": "2026-06-10",
        "endDate": "2026-06-30",
        "status": "In_Progress",
        "userEmail": "pm@ge.com",
        "pmEmail": "pm@ge.com",
        "notes": "Current active checkout on Project Site A",
        "handoverPic": "John Doe",
        "handoverPhoto": "inspection-flk87-siteA.png",
        "checklistVerified": True
    },
    {
        "id": "SCH-202606-0002",
        "toolCode": "CCP01",
        "model": "87V",
        "sequenceOrder": 1,
        "stage": "calibration",
        "destination": "Fluke Cal Lab",
        "startDate": "2026-07-01",
        "endDate": "2026-07-03",
        "status": "Scheduled",
        "userEmail": "cal-specialist@ge.com",
        "pmEmail": "pm@ge.com",
        "notes": "Annual calibration checkup scheduled immediately after Site A return",
        "handoverPic": "Cal Specialist Lead",
        "handoverPhoto": "cal-cert-pending.png",
        "checklistVerified": True
    },
    {
        "id": "SCH-202606-0003",
        "toolCode": "CCP01",
        "model": "87V",
        "sequenceOrder": 2,
        "stage": "ongoing",
        "destination": "Samsung Austin Site",
        "startDate": "2026-07-04",
        "endDate": "2026-07-25",
        "status": "Scheduled",
        "userEmail": "samsung-lead@ge.com",
        "pmEmail": "pm@ge.com",
        "notes": "Next project deployment scheduled to ship post-calibration"
    },
    {
        "id": "SCH-202606-0004",
        "toolCode": "CCP02",
        "model": "1738",
        "sequenceOrder": 0,
        "stage": "active_rental",
        "destination": "Project Site A",
        "startDate": "2026-06-10",
        "endDate": "2026-06-30",
        "status": "In_Progress",
        "userEmail": "pm@ge.com",
        "pmEmail": "pm@ge.com",
        "notes": "Running load studies",
        "handoverPic": "Jane Smith",
        "handoverPhoto": "pre-checkout-calibration-1738.png",
        "checklistVerified": True
    }
]

db_storage = {
    "items": INITIAL_ITEMS,
    "schedules": INITIAL_SCHEDULED_CASES
}

ONEDRIVE_RENTAL_PHOTO_FOLDER = os.getenv(
    "ONEDRIVE_RENTAL_PHOTO_FOLDER",
    "OneDrive/ToolRental_Photos"
)


def with_request_suffix(case_id: str, movement_type: str) -> str:
    suffix = "return request" if movement_type == "return" else "rental request"
    return f"{case_id} ({suffix})"


def set_asset_rented_from_schedule(schedule: dict):
    for item in db_storage.get("items", []):
        if item.get("toolCode") == schedule.get("toolCode"):
            item.update({
                "projectName": schedule.get("destination") or "",
                "returnDate": schedule.get("endDate") or "",
                "status": "Rented",
                "userEmail": schedule.get("userEmail") or "",
                "pmEmail": schedule.get("pmEmail") or "",
                "projectCode": schedule.get("projectCode") or "",
                "caseId": schedule.get("caseId") or ""
            })
            break


def clear_asset_to_available(tool_code: str):
    for item in db_storage.get("items", []):
        if item.get("toolCode") == tool_code:
            item.update({
                "projectName": "Warehouse",
                "returnDate": "",
                "status": "Available",
                "userEmail": "",
                "pmEmail": "",
                "projectCode": "",
                "caseId": ""
            })
            break


def visible_schedule_cards():
    # Inventory next/current hover must mirror the visible Tool Schedule cards only.
    # Completed approval artifacts are history, not live card state.
    return [s for s in db_storage.get("schedules", []) if s.get("status") != "Completed"]


def sanitize_filename_part(value: Optional[str]) -> str:
    import re
    text = (value or "Unknown").strip()
    text = re.sub(r"[^0-9A-Za-z가-힣._-]+", "_", text)
    return text.strip("_") or "Unknown"


def build_rental_photo_path(schedule: dict, asset: Optional[dict] = None) -> str:
    """Mock OneDrive naming path until Entra ID Graph approval is available.

    Naming format requested by business:
    대여날짜_모델_시리얼넘버_프로젝트명_대여자이름
    """
    original_photo = schedule.get("handoverPhoto") or "checkout_photo"
    if str(original_photo).startswith(f"{ONEDRIVE_RENTAL_PHOTO_FOLDER}/"):
        return original_photo

    rental_date = sanitize_filename_part(schedule.get("startDate"))
    model = sanitize_filename_part(schedule.get("model") or (asset or {}).get("model"))
    serial = sanitize_filename_part((asset or {}).get("serialNumber") or (asset or {}).get("Serial_Number"))
    project = sanitize_filename_part(schedule.get("destination") or schedule.get("projectCode"))
    renter = sanitize_filename_part((schedule.get("userEmail") or "").split("@")[0])
    _, ext = os.path.splitext(str(original_photo))
    ext = ext or ".jpg"
    filename = f"{rental_date}_{model}_{serial}_{project}_{renter}{ext}"
    return f"{ONEDRIVE_RENTAL_PHOTO_FOLDER}/{filename}"

# --- API Routes ---

@app.get("/api/sharepoint/list")
async def get_sharepoint_list():
    logger.info("Fetching SharePoint items list.")
    return {
        "status": "success", 
        "data": db_storage["items"]
    }

class CartItem(BaseModel):
    toolCode: str
    photoUrl: Optional[str] = None
    photoWebUrl: Optional[str] = None

class BulkRentalRequest(BaseModel):
    caseId: str
    items: List[CartItem]
    projectName: str
    projectCode: Optional[str] = None
    returnDate: str
    pmEmail: str
    userEmail: str

@app.post("/api/sharepoint/rental")
async def create_rental_record(rental: BulkRentalRequest):
    logger.info(f"Rental request received for Case {rental.caseId}")
    
    import random
    from datetime import datetime
    date_str = datetime.now().strftime("%y%m%d")
    schedules = db_storage.get("schedules", [])
    
    for idx, item in enumerate(rental.items):
        # find model
        model = "Unknown Model"
        for i in db_storage.get("items", []):
            if i["toolCode"] == item.toolCode:
                model = i.get("model", "Unknown Model")
                break
                
        # find max sequence
        item_schedules = [s for s in schedules if s["toolCode"] == item.toolCode]
        max_seq = -1
        for s in item_schedules:
            if s.get("sequenceOrder", 0) > max_seq:
                max_seq = s["sequenceOrder"]
        new_seq = max_seq + 1
        
        # generate id
        rand_num = random.randint(1000, 9999)
        new_id = f"SCH-{date_str}-{rand_num}-{idx}"
        
        new_case = {
            "id": new_id,
            "toolCode": item.toolCode,
            "model": model,
            "sequenceOrder": new_seq,
            # Smart Rental starts in On Going as an approval-pending request.
            # Approval promotes it into Active Rental, which then feeds the Dashboard CASE ID card.
            "stage": "ongoing",
            "destination": rental.projectName,
            "startDate": datetime.now().strftime("%Y-%m-%d"),
            "endDate": rental.returnDate,
            "status": "Pending_Approval",
            "userEmail": rental.userEmail,
            "pmEmail": rental.pmEmail,
            "notes": f"Checkout Case ID: {rental.caseId}",
            "projectCode": rental.projectCode,
            "handoverPic": "Renter Checkout",
            "handoverPhoto": item.photoUrl,
            "handoverPhotoWebUrl": item.photoWebUrl,
            "movementType": "checkout",
            "checklistVerified": True,
            "caseId": rental.caseId,
            "displayCaseId": with_request_suffix(rental.caseId, "checkout")
        }
        schedules.append(new_case)
        
    db_storage["schedules"] = schedules
    
    # Sync states for all items
    for item in rental.items:
        sync_asset_state(item.toolCode)
        
    logger.info(f"Database updated. Case {rental.caseId} schedules loaded as Pending_Approval.")
    
    return {
        "status": "success", 
        "message": f"Bulk Rental schedules created dynamically for Case {rental.caseId}", 
        "caseId": rental.caseId
    }


class ExtendItem(BaseModel):
    toolCode: str
    newReturnDate: str

class BulkExtendRequest(BaseModel):
    caseId: str
    items: List[ExtendItem]

@app.post("/api/sharepoint/extend")
async def extend_rental_record(request: BulkExtendRequest):
    logger.info(f"Extension approval request received for Case {request.caseId}")
    from datetime import datetime
    import random
    schedules = db_storage.get("schedules", [])
    created = 0
    date_str = datetime.now().strftime("%y%m%d")

    for idx, item in enumerate(request.items):
        active = next((s for s in schedules if s.get("toolCode") == item.toolCode and s.get("caseId") == request.caseId and s.get("stage") == "active_rental" and s.get("status") == "In_Progress"), None)
        if not active:
            continue
        previous_snapshot = active.copy()
        active["status"] = "Completed"
        pending = active.copy()
        pending.update({
            "id": f"EXT-{date_str}-{random.randint(1000, 9999)}-{idx}",
            "stage": "ongoing",
            "status": "Pending_Approval",
            "sequenceOrder": active.get("sequenceOrder", 0),
            "destination": active.get("destination") or active.get("projectCode") or "Extension Approval",
            "notes": f"Extension approval pending for Case ID: {request.caseId}",
            "movementType": "extension",
            "requestedEndDate": item.newReturnDate,
            "previousSchedule": previous_snapshot
        })
        schedules.append(pending)
        sync_asset_state(item.toolCode)
        created += 1

    db_storage["schedules"] = schedules
    logger.info(f"Extension approval cards created. Case {request.caseId}, count {created}.")
    return {
        "status": "success",
        "message": f"Case {request.caseId} extension request sent to approval queue.",
        "count": created
    }

@app.post("/api/sharepoint/upload")
async def upload_file_to_sharepoint(filename: str, file: UploadFile = File(...)):
    # 파일 이미지 모크 업로드 지원
    logger.info(f"Mocking upload of image: {filename}")
    return {
        "status": "success", 
        "webUrl": f"https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=900",
        "originalFilename": filename
    }

class ReturnItem(BaseModel):
    toolCode: str

class BulkReturnRequest(BaseModel):
    caseId: str
    items: List[ReturnItem]

@app.post("/api/sharepoint/return")
async def return_rental_record(request: BulkReturnRequest):
    logger.info(f"Return approval request received for Case {request.caseId}")
    from datetime import datetime
    import random
    returned_codes = {item.toolCode for item in request.items}
    schedules = db_storage.get("schedules", [])
    created = 0
    date_str = datetime.now().strftime("%y%m%d")

    for idx, tool_code in enumerate(returned_codes):
        active = next((s for s in schedules if s.get("toolCode") == tool_code and s.get("caseId") == request.caseId and s.get("stage") == "active_rental" and s.get("status") == "In_Progress"), None)
        asset = next((i for i in db_storage.get("items", []) if i.get("toolCode") == tool_code and i.get("caseId") == request.caseId and i.get("status") == "Rented"), None)
        if not active and not asset:
            continue
        previous_snapshot = active.copy() if active else {}
        if active:
            active["status"] = "Completed"
        asset_data = asset or {}
        pending = active.copy() if active else {
            "toolCode": tool_code,
            "model": asset_data.get("model") or asset_data.get("name") or "Unknown Model",
            "destination": asset_data.get("projectName") or "Return Review",
            "endDate": asset_data.get("returnDate") or "",
            "userEmail": asset_data.get("userEmail") or "",
            "pmEmail": asset_data.get("pmEmail") or "",
            "caseId": request.caseId,
        }
        pending.update({
            "id": f"RET-{date_str}-{random.randint(1000, 9999)}-{idx}",
            "stage": "ongoing",
            "status": "Pending_Approval",
            "sequenceOrder": active.get("sequenceOrder", 0) if active else 0,
            "destination": pending.get("destination") or "Return Review",
            "notes": f"Return approval pending for Case ID: {request.caseId}",
            "movementType": "return",
            "displayCaseId": with_request_suffix(request.caseId, "return"),
            "previousSchedule": previous_snapshot
        })
        schedules.append(pending)
        # Do not mutate Dashboard/item rental state while a return request is only pending.
        # The asset becomes Available only after the return card is approved.
        created += 1

    db_storage["schedules"] = schedules
    logger.info(f"Return approval cards created. Case {request.caseId}, count {created}.")
    return {
        "status": "success",
        "message": f"Case {request.caseId} return request sent to approval queue.",
        "count": created
    }

# --- Successive Scheduling Case API Endpoints [NEW] ---

class ScheduledCase(BaseModel):
    id: str
    toolCode: str
    model: str
    sequenceOrder: int
    stage: str
    destination: str
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    status: str
    userEmail: str
    pmEmail: str
    notes: Optional[str] = None
    projectCode: Optional[str] = None
    handoverPic: Optional[str] = None
    handoverPhoto: Optional[str] = None
    handoverPhotoWebUrl: Optional[str] = None
    movementType: Optional[str] = None
    requestedEndDate: Optional[str] = None
    rejectReason: Optional[str] = None
    checklistVerified: Optional[bool] = None
    caseId: Optional[str] = None
    displayCaseId: Optional[str] = None

class RejectScheduleRequest(BaseModel):
    reason: str

class BulkRejectScheduleRequest(BaseModel):
    ids: List[str]
    reason: str

from fastapi import Form

@app.post("/api/sharepoint/calibration/clear")
async def clear_calibration_case(
    schedule_id: str = Form(...),
    calibration_date: str = Form(...),
    pdf_file: UploadFile = File(...),
    image_file: UploadFile = File(...)
):
    import shutil
    import re
    logger.info(f"Clearing calibration for schedule: {schedule_id} with date {calibration_date}")
    schedules = db_storage.get("schedules", [])
    
    # Find the target schedule
    target_schedule = None
    for s in schedules:
        if s["id"] == schedule_id:
            target_schedule = s
            break
            
    if not target_schedule:
        raise HTTPException(status_code=404, detail="Scheduled case not found")
        
    tool_code = target_schedule["toolCode"]
    model = target_schedule["model"]
    
    # Find serial number of the asset and update calibration date in database
    serial_number = "UNKNOWN"
    for item in db_storage.get("items", []):
        if item.get("toolCode") == tool_code:
            serial_number = item.get("serialNumber") or item.get("Serial_Number") or "UNKNOWN"
            item["calDate"] = calibration_date
            if "Calibration_Date" in item:
                item["Calibration_Date"] = calibration_date
            break

    # Determine OneDrive save directory
    onedrive_base = "C:\\Users\\cfpcl\\OneDrive"
    target_dir = os.path.join(onedrive_base, "Calibration_Reports")
    
    if not os.path.exists(onedrive_base):
        # Fallback to local workspace folder
        target_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "OneDrive_Calibration_Reports"))
        
    os.makedirs(target_dir, exist_ok=True)
    
    # Naming template: (검교정날짜_툴코드_툴모델명_시리얼넘버.pdf)
    def sanitize(val):
        return re.sub(r'[^a-zA-Z0-9_\-]', '_', val)
        
    sanitized_model = sanitize(model)
    sanitized_serial = sanitize(serial_number)
    sanitized_code = sanitize(tool_code)
    
    pdf_filename = f"{calibration_date}_{sanitized_code}_{sanitized_model}_{sanitized_serial}.pdf"
    
    _, ext = os.path.splitext(image_file.filename or "")
    if not ext:
        ext = ".jpg"
    image_filename = f"{calibration_date}_{sanitized_code}_{sanitized_model}_{sanitized_serial}_photo{ext}"
    
    pdf_path = os.path.join(target_dir, pdf_filename)
    image_path = os.path.join(target_dir, image_filename)
    
    try:
        with open(pdf_path, "wb") as buffer:
            shutil.copyfileobj(pdf_file.file, buffer)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image_file.file, buffer)
    except Exception as e:
        logger.error(f"Failed to save files: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save certificate files: {str(e)}")
        
    # Mark this calibration schedule as Completed
    for s in schedules:
        if s["id"] == schedule_id:
            s["status"] = "Completed"
            s["handoverPic"] = "System Calibration"
            s["handoverPhoto"] = f"{pdf_filename}; {image_filename}"
            s["checklistVerified"] = True
            
    db_storage["schedules"] = schedules
    sync_asset_state(tool_code)
    
    return {
        "status": "success",
        "message": "Calibration successfully cleared and certificate files saved.",
        "pdf_filename": pdf_filename,
        "image_filename": image_filename,
        "saved_path": target_dir
    }

@app.post("/api/sharepoint/schedule/reject/{schedule_id}")
async def reject_schedule_case(schedule_id: str, request: RejectScheduleRequest):
    logger.info(f"Rejecting scheduled case: {schedule_id}")
    schedules = db_storage.get("schedules", [])
    target = next((s for s in schedules if s.get("id") == schedule_id), None)
    if not target:
        # Idempotent for demo/serverless safety: stale browser tabs, repeated clicks,
        # or old cached bundles can submit a reject for a card that was already
        # removed by another request/instance. Treat it as already handled instead
        # of surfacing a blocking 404 to the admin.
        logger.warning(f"Scheduled case already missing during reject, treating as skipped: {schedule_id}")
        return {
            "status": "success",
            "message": f"Scheduled case {schedule_id} was already rejected or no longer exists.",
            "skipped": True,
            "notification": {
                "email": "requester",
                "teams": "requester",
                "reason": request.reason,
                "message": f"Reject skipped because scheduled case {schedule_id} no longer exists. Reason: {request.reason}"
            }
        }

    eq_code = target.get("toolCode")
    movement_type = target.get("movementType") or "checkout"
    previous = target.get("previousSchedule") or {}

    if movement_type in {"return", "extension"} and previous:
        restored = False
        for idx, s in enumerate(schedules):
            if s.get("id") == previous.get("id"):
                previous["status"] = "In_Progress"
                previous["stage"] = "active_rental"
                schedules[idx] = previous
                restored = True
                break
        if not restored:
            previous["status"] = "In_Progress"
            previous["stage"] = "active_rental"
            schedules.append(previous)

    # Checkout reject -> remove pending request. Return/extension reject -> remove pending card and restore original active case.
    schedules = [s for s in schedules if s.get("id") != schedule_id]
    db_storage["schedules"] = schedules
    if eq_code:
        sync_asset_state(eq_code)

    requester = target.get("userEmail") or "requester"
    notification_message = (
        f"Your tool rental {movement_type} request for {target.get('toolCode')} was rejected. "
        f"Reason: {request.reason}"
    )
    logger.info(f"Mock email/Teams rejection notice to {requester}: {notification_message}")
    return {
        "status": "success",
        "message": f"Scheduled case {schedule_id} rejected and previous state restored.",
        "notification": {
            "email": requester,
            "teams": requester,
            "reason": request.reason,
            "message": notification_message
        }
    }

@app.post("/api/sharepoint/schedule/reject-bulk")
async def reject_schedule_cases_bulk(request: BulkRejectScheduleRequest):
    logger.info(f"Bulk rejecting scheduled cases: {request.ids}")
    if not request.ids:
        raise HTTPException(status_code=400, detail="No scheduled case IDs provided")
    if not request.reason.strip():
        raise HTTPException(status_code=400, detail="Reject reason is required")

    schedules = db_storage.get("schedules", [])
    rejected = []
    notifications = []
    missing = []
    eq_codes_to_sync = set()

    for schedule_id in request.ids:
        target = next((s for s in schedules if s.get("id") == schedule_id), None)
        if not target:
            missing.append(schedule_id)
            continue

        eq_code = target.get("toolCode")
        movement_type = target.get("movementType") or "checkout"
        previous = target.get("previousSchedule") or {}

        if movement_type in {"return", "extension"} and previous:
            restored = False
            for idx, s in enumerate(schedules):
                if s.get("id") == previous.get("id"):
                    previous["status"] = "In_Progress"
                    previous["stage"] = "active_rental"
                    schedules[idx] = previous
                    restored = True
                    break
            if not restored:
                previous["status"] = "In_Progress"
                previous["stage"] = "active_rental"
                schedules.append(previous)

        schedules = [s for s in schedules if s.get("id") != schedule_id]
        if eq_code:
            eq_codes_to_sync.add(eq_code)

        requester = target.get("userEmail") or "requester"
        notification_message = (
            f"Your tool rental {movement_type} request for {target.get('toolCode')} was rejected. "
            f"Reason: {request.reason}"
        )
        logger.info(f"Mock email/Teams rejection notice to {requester}: {notification_message}")
        rejected.append(schedule_id)
        notifications.append({
            "scheduleId": schedule_id,
            "email": requester,
            "teams": requester,
            "reason": request.reason,
            "message": notification_message
        })

    if missing:
        logger.warning(f"Bulk reject missing scheduled cases, treating as already handled: {missing}")
    if not rejected:
        db_storage["schedules"] = schedules
        return {
            "status": "success",
            "message": "No matching scheduled cases found; request treated as already handled.",
            "count": 0,
            "rejected": [],
            "missing": missing,
            "notifications": []
        }

    db_storage["schedules"] = schedules
    for code in eq_codes_to_sync:
        sync_asset_state(code)

    return {
        "status": "success",
        "message": f"Rejected {len(rejected)} scheduled case(s).",
        "count": len(rejected),
        "rejected": rejected,
        "missing": missing,
        "notifications": notifications
    }

@app.post("/api/sharepoint/schedule/approve/{schedule_id}")
async def approve_schedule_case(schedule_id: str):
    logger.info(f"Approving scheduled case: {schedule_id}")
    schedules = db_storage.get("schedules", [])
    target = None
    eq_code = None

    for s in schedules:
        if s["id"] == schedule_id:
            target = s
            eq_code = s.get("toolCode")
            movement_type = s.get("movementType") or "checkout"

            if movement_type == "return":
                # Return approval clears the pending return card; Dashboard/item state becomes Available.
                s["status"] = "Completed"
                if eq_code:
                    clear_asset_to_available(eq_code)
            elif movement_type == "extension":
                previous = s.get("previousSchedule") or {}
                if previous:
                    previous["endDate"] = s.get("requestedEndDate") or previous.get("endDate")
                    previous["status"] = "In_Progress"
                    previous["stage"] = "active_rental"
                    restored = False
                    for idx, existing in enumerate(schedules):
                        if existing.get("id") == previous.get("id"):
                            schedules[idx] = previous
                            restored = True
                            break
                    if not restored:
                        schedules.append(previous)
                s["status"] = "Completed"
            else:
                if s.get("status") == "Pending_Approval":
                    asset = next((item for item in db_storage.get("items", []) if item.get("toolCode") == s.get("toolCode")), None)
                    if s.get("handoverPhoto"):
                        s["handoverPhoto"] = build_rental_photo_path(s, asset)
                    set_asset_rented_from_schedule(s)
                s["status"] = "Completed"
            break
            
    if not target:
        raise HTTPException(status_code=404, detail="Scheduled case not found")

    # Keep completed return/extension approval cards out of the Kanban after approval.
    if target.get("movementType") in {"return", "extension"}:
        schedules = [s for s in schedules if s.get("id") != schedule_id]

    db_storage["schedules"] = schedules
    if eq_code:
        sync_asset_state(eq_code)
    return {
        "status": "success",
        "message": f"Scheduled case {schedule_id} approved.",
        "data": target
    }

@app.post("/api/sharepoint/schedule/approve-bulk")
async def approve_schedule_cases_bulk(schedule_ids: List[str]):
    logger.info(f"Bulk approving {len(schedule_ids)} scheduled cases.")
    schedules = db_storage.get("schedules", [])
    eq_codes_to_sync = set()
    approved_count = 0
    remove_ids = set()

    for s in list(schedules):
        if s["id"] in schedule_ids and s["status"] == "Pending_Approval":
            movement_type = s.get("movementType") or "checkout"
            if movement_type == "return":
                clear_asset_to_available(s["toolCode"])
                remove_ids.add(s["id"])
            elif movement_type == "extension":
                previous = s.get("previousSchedule") or {}
                if previous:
                    previous["endDate"] = s.get("requestedEndDate") or previous.get("endDate")
                    previous["status"] = "In_Progress"
                    previous["stage"] = "active_rental"
                    restored = False
                    for idx, existing in enumerate(schedules):
                        if existing.get("id") == previous.get("id"):
                            schedules[idx] = previous
                            restored = True
                            break
                    if not restored:
                        schedules.append(previous)
                remove_ids.add(s["id"])
            else:
                asset = next((item for item in db_storage.get("items", []) if item.get("toolCode") == s.get("toolCode")), None)
                if s.get("handoverPhoto"):
                    s["handoverPhoto"] = build_rental_photo_path(s, asset)
                set_asset_rented_from_schedule(s)
                s["status"] = "Completed"
                remove_ids.add(s["id"])
            eq_codes_to_sync.add(s["toolCode"])
            approved_count += 1

    if remove_ids:
        schedules = [s for s in schedules if s.get("id") not in remove_ids]
    db_storage["schedules"] = schedules
    for code in eq_codes_to_sync:
        sync_asset_state(code)
    return {
        "status": "success",
        "message": f"Successfully approved {approved_count} scheduled cases.",
        "count": approved_count
    }

def sync_asset_state(tool_code: str):
    schedules = [s for s in db_storage.get("schedules", []) if s["toolCode"] == tool_code]
    if not schedules:
        for item in db_storage["items"]:
            if item["toolCode"] == tool_code:
                case_id = item.get("caseId", "")
                if item.get("status") == "Rented" and case_id and not case_id.startswith("SCH-"):
                    return
                item.update({
                    "projectName": "Warehouse",
                    "returnDate": "",
                    "status": "Available",
                    "userEmail": "",
                    "pmEmail": "",
                    "caseId": ""
                })
        return

    # Filter out completed cases to find active scheduling
    active_schedules = [s for s in schedules if s.get("status") != "Completed"]
    if not active_schedules:
        for item in db_storage["items"]:
            if item["toolCode"] == tool_code:
                case_id = item.get("caseId", "")
                if item.get("status") == "Rented" and case_id and not case_id.startswith("SCH-"):
                    return
                item.update({
                    "projectName": "Warehouse",
                    "returnDate": "",
                    "status": "Available",
                    "userEmail": "",
                    "pmEmail": "",
                    "caseId": ""
                })
        return

    # Sort active schedules by sequenceOrder to find the first upcoming step
    selected_case = sorted(active_schedules, key=lambda x: x.get("sequenceOrder", 0))[0]
    if selected_case.get("status") == "Scheduled":
        for item in db_storage["items"]:
            if item["toolCode"] == tool_code:
                case_id = item.get("caseId", "")
                if item.get("status") == "Rented" and case_id and not case_id.startswith("SCH-"):
                    return
                break
    
    # Pending approvals are already picked/requested, so keep inventory blocked as Reserved.
    if selected_case.get("status") == "Pending_Approval":
        status = "Reserved"
        project_name = selected_case.get("destination") or "Approval Pending"
    elif selected_case.get("status") != "In_Progress":
        status = "Available"
        project_name = "Warehouse"
    else:
        stage = selected_case["stage"]
        if stage == "active_rental":
            status = "Rented"
            project_name = selected_case["destination"]
        elif stage == "calibration":
            status = "Calibration"
            project_name = selected_case.get("destination") or "Calibration Lab"
        else:  # ongoing
            status = "Reserved"
            project_name = selected_case.get("destination") or "Warehouse"

    for item in db_storage["items"]:
        if item["toolCode"] == tool_code:
            if status == "Available":
                item.update({
                    "status": "Available",
                    "projectName": "Warehouse",
                    "returnDate": "",
                    "userEmail": "",
                    "pmEmail": "",
                    "caseId": ""
                })
            else:
                item.update({
                    "status": status,
                    "projectName": project_name,
                    "returnDate": selected_case.get("endDate") or "",
                    "userEmail": selected_case.get("userEmail") or "",
                    "pmEmail": selected_case.get("pmEmail") or "",
                    "caseId": selected_case.get("caseId") or selected_case["id"]
                })
            break

@app.get("/api/sharepoint/schedule/list")
async def get_schedule_list():
    logger.info("Fetching scheduling cases list.")
    return {
        "status": "success",
        "data": visible_schedule_cards()
    }

@app.post("/api/sharepoint/schedule/create-bulk")
async def create_schedule_cases_bulk(cases: List[ScheduledCase]):
    logger.info(f"Bulk creating {len(cases)} scheduled cases.")
    schedules = db_storage.get("schedules", [])
    eq_codes_to_sync = set()
    for case in cases:
        schedules.append(case.dict())
        eq_codes_to_sync.add(case.toolCode)
    db_storage["schedules"] = schedules
    for code in eq_codes_to_sync:
        sync_asset_state(code)
    return {
        "status": "success",
        "message": f"Successfully created {len(cases)} scheduled cases.",
        "count": len(cases)
    }

@app.post("/api/sharepoint/schedule/create")
async def create_schedule_case(case: ScheduledCase):
    logger.info(f"Creating scheduled case: {case.id}")
    schedules = db_storage.get("schedules", [])
    schedules.append(case.dict())
    db_storage["schedules"] = schedules
    sync_asset_state(case.toolCode)
    return {
        "status": "success",
        "message": f"Scheduled case {case.id} created.",
        "data": case
    }

@app.put("/api/sharepoint/schedule/update-bulk")
async def update_schedule_cases_bulk(cases: List[ScheduledCase]):
    logger.info(f"Bulk updating {len(cases)} scheduled cases.")
    schedules = db_storage.get("schedules", [])
    updated_ids = {c.id: c for c in cases}
    
    eq_codes_to_sync = set()
    for idx, s in enumerate(schedules):
        if s["id"] in updated_ids:
            case_data = updated_ids[s["id"]].dict()
            schedules[idx] = case_data
            eq_codes_to_sync.add(case_data["toolCode"])
            
    db_storage["schedules"] = schedules
    for code in eq_codes_to_sync:
        sync_asset_state(code)
        
    return {
        "status": "success",
        "message": f"Successfully updated {len(cases)} scheduled cases."
    }

@app.post("/api/sharepoint/schedule/delete-bulk")
async def delete_schedule_cases_bulk(case_ids: List[str]):
    logger.info(f"Bulk deleting {len(case_ids)} scheduled cases.")
    schedules = db_storage.get("schedules", [])
    
    eq_codes_to_sync = set()
    for s in schedules:
        if s["id"] in case_ids:
            eq_codes_to_sync.add(s["toolCode"])
            
    filtered = [s for s in schedules if s["id"] not in case_ids]
    db_storage["schedules"] = filtered
    
    for code in eq_codes_to_sync:
        sync_asset_state(code)
        
    return {
        "status": "success",
        "message": f"Successfully deleted {len(case_ids)} scheduled cases."
    }

@app.put("/api/sharepoint/schedule/update")
async def update_schedule_case(case: ScheduledCase):
    logger.info(f"Updating scheduled case: {case.id}")
    schedules = db_storage.get("schedules", [])
    updated = False
    
    for idx, s in enumerate(schedules):
        if s["id"] == case.id:
            schedules[idx] = case.dict()
            updated = True
            break
            
    if not updated:
        raise HTTPException(status_code=404, detail="Scheduled case not found")
        
    db_storage["schedules"] = schedules
    sync_asset_state(case.toolCode)
    return {
        "status": "success",
        "message": f"Scheduled case {case.id} updated and assets synced.",
        "data": case
    }


@app.delete("/api/sharepoint/schedule/delete/{case_id}")
async def delete_schedule_case(case_id: str):
    logger.info(f"Deleting scheduled case: {case_id}")
    schedules = db_storage.get("schedules", [])
    
    deleted_case = None
    for s in schedules:
        if s["id"] == case_id:
            deleted_case = s
            break
            
    filtered = [s for s in schedules if s["id"] != case_id]
    if len(filtered) == len(schedules):
        raise HTTPException(status_code=404, detail="Scheduled case not found")
        
    db_storage["schedules"] = filtered
    if deleted_case:
        sync_asset_state(deleted_case["toolCode"])
        
    return {
        "status": "success",
        "message": f"Scheduled case {case_id} deleted."
    }

```

---

## File: `src/types.ts`

```typescript
export type SpecSummary = {
  equipmentType: string;
  measurementRange: string;
  accuracy: string;
  voltageRating: string;
  currentRating: string;
  safetyCategory: string;
  connectivity: string;
  powerSource: string;
  calibrationCycle: string;
  keyFeatures: string[];
  typicalUse: string;
}

export type Asset = {
  toolCode: string;
  brand: string;
  model: string;
  rack: string;
  currentLocation: string;
  calDate: string;
  status: 'Available' | 'Rented' | 'Calibration' | 'Reserved';
  Current_Status?: 'Available' | 'Rented' | 'Calibration' | 'Reserved';
  Brand?: string;
  Asset_Model?: string;
  Tool_Code?: string;
  Location_Rack?: string;
  Current_Location?: string;
  Calibration_Date?: string;
  serialNumber?: string;
  Serial_Number?: string;
  datasheetUrl?: string;
  specSummary?: SpecSummary;
  caseId?: string;
  projectName?: string;
  projectCode?: string;
  userEmail?: string;
  pmEmail?: string;
  expectedReturnDate?: string;
}

export type Rental = {
  caseId: string;
  toolCode: string;
  model: string;
  user: string;
  projectCode: string;
  expectedReturn: string;
  projectName?: string;
  expectedReturnDate?: string;
  userEmail?: string;
  pmEmail?: string;
  id?: string;
}

export type ScheduledCase = {
  id: string;
  toolCode: string;
  model: string;
  sequenceOrder: number;
  stage: 'active_rental' | 'calibration' | 'ongoing';
  destination: string;
  startDate?: string;
  endDate?: string;
  status: 'Scheduled' | 'In_Progress' | 'Completed' | 'Delayed' | 'Pending_Approval';
  userEmail: string;
  pmEmail: string;
  notes?: string;
  projectCode?: string;
  handoverPic?: string;
  handoverPhoto?: string;
  handoverPhotoWebUrl?: string;
  movementType?: 'checkout' | 'return' | 'extension' | 'schedule';
  requestedEndDate?: string;
  rejectReason?: string;
  checklistVerified?: boolean;
  caseId?: string;
  displayCaseId?: string;
}



```

---

## File: `src/index.css`

```css
:root {
  --f-primary: #005E60;
  --f-primary-hover: #00484A;
  --f-bg-gray: #F5F5F5;
  --f-bg-white: #FFFFFF;
  --f-border: #E1E1E1;
  --f-text: #242424;
  --f-text-secondary: #616161;
  --f-error: #D1110A;
  --f-warning: #FFF9C4;
  --f-warning-border: #FBC02D;
  --f-danger-bg: #FFCDD2;
  --f-shadow: 0px 2px 4px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.12);
  --f-radius: 4px;

  --f-bg-th: #FAFAFA;
  --f-row-hover: #F8F8F8;
  --f-tab-hover: #F0F0F0;

  --f-card-accent-bg: #FAFAFC;
  --f-card-accent-border: #E2E8F0;
  --f-text-muted: #64748B;
  --f-text-strong: #1E293B;
  --f-text-normal: #334155;
  --f-bg-item-list: #F8FAFC;
  --f-border-dashed: #CBD5E1;
  --f-selected-bg: rgba(0, 94, 96, 0.08);
  --f-success: #10B981;
  --f-logo-fill: var(--f-primary);
  --f-primary-light: #E0F2F1;
}

:root[data-theme="dark"] {
  --f-primary: #008D90;
  --f-primary-hover: #00A6A9;
  --f-bg-gray: #121212;
  --f-bg-white: #1E1E1E;
  --f-border: #2D2D2D;
  --f-text: #E0E0E0;
  --f-text-secondary: #A0A0A0;
  --f-error: #FF8A80;
  --f-warning: #2C2815;
  --f-warning-border: #D8A000;
  --f-danger-bg: #3E1E21;
  --f-shadow: 0px 4px 12px rgba(0, 0, 0, 0.5);

  --f-bg-th: #2A2A2A;
  --f-row-hover: #262626;
  --f-tab-hover: #2D2D2D;

  --f-card-accent-bg: #252525;
  --f-card-accent-border: #3D3D3D;
  --f-text-muted: #8892B0;
  --f-text-strong: #FFFFFF;
  --f-text-normal: #CCCCCC;
  --f-bg-item-list: #262626;
  --f-border-dashed: #3D3D3D;
  --f-selected-bg: rgba(0, 141, 144, 0.2);
  --f-success: #81C784;
  --f-logo-fill: #FFFFFF;
  --f-primary-light: rgba(0, 141, 144, 0.25);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background-color: var(--f-bg-gray);
  color: var(--f-text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  flex: 1;
}

/* Typography */
h1, h2, h3 {
  font-weight: 600;
  color: var(--f-text);
}

/* Buttons */
.f-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  border-radius: var(--f-radius);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.f-button-primary {
  background-color: var(--f-primary);
  color: white;
}

.f-button-primary:hover {
  background-color: var(--f-primary-hover);
}

.f-button-primary:disabled {
  background-color: var(--f-border);
  cursor: not-allowed;
}

/* Cards */
.f-card {
  background: var(--f-bg-white);
  border-radius: 8px;
  box-shadow: var(--f-shadow);
  padding: 16px;
  border: 1px solid var(--f-border);
}

/* Form Elements */
.f-form-group {
  margin-bottom: 16px;
}

.f-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--f-text-secondary);
}

.f-input, .f-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--f-border);
  border-radius: var(--f-radius);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.f-input:focus, .f-select:focus {
  border-color: var(--f-primary);
}

.f-input:disabled {
  background-color: var(--f-bg-gray);
  color: var(--f-text-secondary);
}

/* Table */
.f-table-container {
  overflow-x: auto;
  background: var(--f-bg-white);
  border-radius: 8px;
  border: 1px solid var(--f-border);
}

.f-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.f-table th {
  text-align: left;
  padding: 12px 16px;
  background: var(--f-bg-th);
  border-bottom: 1px solid var(--f-border);
  font-weight: 600;
  color: var(--f-text-secondary);
  cursor: pointer;
  user-select: none;
}

.f-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--f-border);
}

.f-table tr:hover {
  background-color: var(--f-row-hover);
}

/* Tabs */
.f-tabs {
  display: flex;
  border-bottom: 1px solid var(--f-border);
  margin-bottom: 24px;
}

.f-tab {
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  color: var(--f-text-secondary);
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.f-tab:hover {
  color: var(--f-text);
  background: var(--f-tab-hover);
}

.f-tab.active {
  color: var(--f-primary);
  font-weight: 600;
  border-bottom-color: var(--f-primary);
}

/* Status Badges */
.f-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.f-badge-available {
  background-color: #E7F4E9;
  color: #107C10;
}

.f-badge-rented {
  background-color: #FDE7E9;
  color: #A80000;
}

.f-badge-calibration {
  background-color: #FFF3E0;
  color: #E65100;
}

.f-badge-reserved {
  background-color: #E3F2FD;
  color: #0D47A1;
}

.inventory-selection-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #eff6ff;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  padding: 12px 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06);
}

.spec-export-button {
  background: var(--f-bg-white);
  color: var(--f-text);
  border-color: var(--f-border);
}
.spec-export-button:hover {
  background: var(--f-row-hover);
}

.model-hover-target {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--f-primary);
  font-weight: 600;
  cursor: help;
}

.model-hover-target::after {
  content: 'ⓘ';
  font-size: 12px;
  color: var(--f-text-secondary);
}

.model-hover-card {
  display: none;
  position: absolute;
  z-index: 20;
  top: 24px;
  left: 0;
  width: 420px;
  max-width: 80vw;
}

.model-hover-target:hover .model-hover-card,
.model-hover-target:focus-within .model-hover-card {
  display: block;
}

.datasheet-summary-card {
  background: var(--f-bg-white);
  border: 1px solid var(--f-border);
  border-radius: 10px;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.18);
  padding: 16px;
  color: var(--f-text);
  font-size: 13px;
}

.summary-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.summary-card-subtitle {
  color: var(--f-text-secondary);
  font-size: 12px;
  margin-top: 2px;
}

.summary-card-chip {
  background: #ede9fe;
  color: #5b21b6;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
}

.summary-card-grid {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 6px 10px;
  margin-bottom: 12px;
}

.summary-card-grid.compact {
  grid-template-columns: 90px 1fr;
}

.summary-card-label {
  color: var(--f-text-secondary);
  font-weight: 600;
}

.summary-card-features ul {
  margin: 4px 0 10px 18px;
}

.summary-card-use {
  margin-bottom: 10px;
}

.summary-card-link {
  color: var(--f-primary);
  font-weight: 600;
  text-decoration: none;
}

.row-more-button {
  border: 1px solid var(--f-border);
  background: var(--f-bg-white);
  color: var(--f-text);
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 4px 10px 7px;
}

.row-more-button:hover {
  border-color: var(--f-primary);
  color: var(--f-primary);
}

.details-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.details-modal {
  width: min(720px, 96vw);
  max-height: 90vh;
  overflow: auto;
  background: var(--f-bg-white);
  border-radius: 12px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
  padding: 18px;
}

.details-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 14px;
}

.details-modal-header p {
  color: var(--f-text-secondary);
  font-size: 12px;
}

.details-close-button {
  border: none;
  background: transparent;
  font-size: 28px;
  cursor: pointer;
  color: var(--f-text-secondary);
}

/* Responsive */
@media (max-width: 768px) {
  .app-container {
    padding: 16px;
  }

  .inventory-selection-bar {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }
}

/* Next Use Badge & Tooltip Styling */
.location-cell-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.location-name {
  font-weight: 500;
}

.next-use-badge-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-top: 2px;
}

.next-use-badge-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.next-use-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--f-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 4px;
}

.next-use-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.next-use-badge-active_rental {
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--f-primary);
  border: 1px solid rgba(79, 70, 229, 0.25);
}

.next-use-badge-calibration {
  background-color: rgba(249, 115, 22, 0.1);
  color: #ea580c;
  border: 1px solid rgba(249, 115, 22, 0.25);
}

.next-use-badge-ongoing {
  background-color: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

/* Tooltip Styling */
.next-use-tooltip {
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: var(--f-bg-white);
  border: 1px solid var(--f-border);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  padding: 14px;
  min-width: 285px;
  max-width: 320px;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* Tooltip Arrow */
.next-use-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: var(--f-bg-white) transparent transparent transparent;
}

.next-use-badge-container:hover .next-use-tooltip {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}

.tooltip-header {
  font-size: 11px;
  font-weight: 700;
  color: var(--f-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.75px;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--f-border);
}

/* Timeline Layout */
.tooltip-timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tooltip-timeline-item {
  display: flex;
  gap: 12px;
  position: relative;
}

.timeline-dot-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 12px;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.dot-active_rental {
  background-color: var(--f-primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.dot-calibration {
  background-color: #ea580c;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
}

.dot-ongoing {
  background-color: #059669;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.timeline-connector {
  width: 2px;
  flex-grow: 1;
  background-color: var(--f-border);
  margin-top: 4px;
  margin-bottom: -12px;
}

.timeline-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-grow: 1;
}

.timeline-header-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.timeline-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 3px;
  text-transform: uppercase;
}

.badge-active_rental {
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--f-primary);
}

.badge-calibration {
  background-color: rgba(249, 115, 22, 0.1);
  color: #ea580c;
}

.badge-ongoing {
  background-color: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.timeline-destination {
  font-size: 12px;
  font-weight: 600;
  color: var(--f-text-primary);
}

.timeline-dates {
  font-size: 11px;
  color: var(--f-text-primary);
  font-weight: 500;
}

.timeline-meta {
  font-size: 10px;
  color: var(--f-text-secondary);
}

.timeline-notes {
  font-size: 10px;
  color: var(--f-text-secondary);
  font-style: italic;
  margin-top: 2px;
  padding: 4px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  border-left: 2px solid var(--f-border);
}

[data-theme='dark'] .timeline-notes {
  background-color: rgba(255, 255, 255, 0.02);
}

/* Prevent tooltip clipping on the first few rows by opening them downwards */
.f-table tbody tr:nth-child(-n+3) .next-use-tooltip {
  bottom: auto;
  top: 125%;
}

.f-table tbody tr:nth-child(-n+3) .next-use-tooltip::after {
  top: auto;
  bottom: 100%;
  border-color: transparent transparent var(--f-bg-white) transparent;
}

.f-table tbody tr:nth-child(-n+3) .next-use-badge-container:hover .next-use-tooltip {
  transform: translateX(-50%) translateY(0);
}

.f-table tbody tr:nth-child(-n+3) .next-use-tooltip {
  transform: translateX(-50%) translateY(-4px);
}



```

---

## File: `src/authConfig.ts`

```typescript
import type { Configuration, PopupRequest } from "@azure/msal-browser";

// MSAL configuration
// Using 'export const' but ensuring types are correctly handled for Vite/ESBuild
export const msalConfig: Configuration = {
  auth: {
    clientId: "9798f928-e293-41dc-9db9-a492b67207b4", 
    authority: "https://login.microsoftonline.com/15ccb6d1-d335-4996-b6f9-7b6925f08121", 
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

// Scopes for API calls
export const loginRequest: PopupRequest = {
  scopes: ["User.Read", "openid", "profile", "Files.ReadWrite.All"],
};

```

---

## File: `src/declarations.d.ts`

```typescript
declare module "*.css";

```

---

## File: `src/main.tsx`

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import './index.css'
import App from './App.tsx'

const msalInstance = new PublicClientApplication(msalConfig);

const renderApp = async () => {
  try {
    // MSAL v3 requires initialize() before any other action
    await msalInstance.initialize();
    
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </StrictMode>,
    );
  } catch (error) {
    console.error("Critical: MSAL Initialization Failed", error);
    // Simple Error Boundary Fallback
    createRoot(document.getElementById('root')!).render(
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>System Error</h2>
        <p>Failed to initialize authentication. Please contact IT support.</p>
      </div>
    );
  }
};

renderApp();

```

---

## File: `src/App.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import RentalForm from './components/RentalForm';
import ActiveRentals from './components/ActiveRentals';
import InventoryTable from './components/InventoryTable';
import { SchedulingTab } from './components/SchedulingTab';
import { type Asset, type Rental, type ScheduledCase } from './types';

const API_BASE = "/api/sharepoint";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checkout' | 'dashboard' | 'inventory' | 'scheduling'>('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [schedules, setSchedules] = useState<ScheduledCase[]>([]);
  const [selectedToolCodes, setSelectedToolCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/list`);
      if (!res.ok) throw new Error("API Fetch failed");
      const dataObj = await res.json();
      const items = dataObj.data || [];
      
      const mappedAssets = items.map((item: any) => ({
        toolCode: item.toolCode,
        brand: item.brand || item.Brand || 'Mock Brand',
        model: item.model || item.name,
        Current_Status: item.status === '보관중' ? 'Available' : 
                        item.status === '대여중' ? 'Rented' : 
                        (item.status || 'Available'),
        status: item.status === '보관중' ? 'Available' : 
                item.status === '대여중' ? 'Rented' : 
                (item.status || 'Available'),
        currentLocation: item.projectName || 'Warehouse',
        projectName: item.projectName,
        projectCode: item.projectCode,
        caseId: item.caseId,
        userEmail: item.userEmail,
        pmEmail: item.pmEmail,
        expectedReturnDate: item.returnDate,
        calDate: '2026-12-31',
        rack: item.rack || 'A1',
        serialNumber: item.serialNumber || item.Serial_Number || 'N/A',
        datasheetUrl: item.datasheetUrl,
        specSummary: item.specSummary
      }));

      const activeRentals = items.filter((item: any) => item.status === '대여중' || item.status === 'Rented').map((item: any) => ({
         toolCode: item.toolCode,
         projectName: item.projectName,
         expectedReturnDate: item.returnDate,
         caseId: item.caseId,
         projectCode: item.projectCode,
         userEmail: item.userEmail,
         pmEmail: item.pmEmail,
         model: item.name
      }));

      setAssets(mappedAssets);
      setRentals(activeRentals);

      // Fetch schedules to display next use information
      const schedRes = await fetch(`/api/sharepoint/schedule/list`);
      if (schedRes.ok) {
        const schedData = await schedRes.json();
        setSchedules(schedData.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getChartData = () => {
    const available = assets.filter(a => (a as any).Current_Status === 'Available').length;
    const rented = assets.filter(a => (a as any).Current_Status === 'Rented').length;
    const calibration = assets.filter(a => (a as any).Current_Status === 'Calibration').length;
    const reserved = assets.filter(a => (a as any).Current_Status === 'Reserved').length;
    return [
      { name: 'Available', value: available, color: '#4CAF50' },
      { name: 'Rented', value: rented, color: 'var(--f-primary)' },
      { name: 'Calibration', value: calibration, color: '#FF9800' },
      { name: 'Reserved', value: reserved, color: '#2196F3' }
    ];
  };

  return (
    <div className="app-container">
      <header style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg 
              id="GE_Vernova_SVG" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 1274 281.3" 
              style={{ height: '36px', width: 'auto', display: 'block' }}
            >
              <path 
                fill="var(--f-logo-fill)" 
                d="M432.8,119.2c-6.9-6.6-16.1-10.3-25.7-10.1c-17.3,0-30.3,13.7-30.3,31.5c0,17.8,13.2,31.5,31.1,31.5c8.2,0,17.2-2.3,23.1-6.1v-17.3h-25.8v-13h40v37.2c-8.5,7.8-24,12.7-37.3,12.7c-25.7,0-45.7-20-45.7-44.9c-0.1-24.7,19.8-44.8,44.5-44.9c0.1,0,0.3,0,0.4,0c14.1,0,26.3,5,35.1,13.4L432.8,119.2L432.8,119.2z M487.6,146.7v23.5h51.3v13.1h-65.7V97.9h65.7v13.1h-51.3v22.7H531v13.1L487.6,146.7z M591.4,97.9H607l28.8,68.2l28.8-68.2h14.9l-36.6,85.4H628L591.4,97.9z M712.8,146.7v23.5h51.3v13.1h-65.7V97.9h65.7v13.1h-51.3v22.7h43.4v13.1L712.8,146.7z M849,183.3l-18.5-32.1h-25.1v32.1H791V97.9h45.5c16.7,0,29.1,11.5,29.1,26.7c0,12.2-8,22-19.7,25.4l19.7,33.3L849,183.3L849,183.3z M851,124.6c0-8.5-5.5-13.7-14.5-13.7h-31.1v27.2h31.1C845.5,138.1,851,133,851,124.6L851,124.6z M893.2,97.9h15.1l47.8,63.3V97.9h14.1v85.4h-14.5l-48.4-63.7v63.7h-14.1V97.9z M995.9,140.6c0-24.9,20.1-45.1,45-45.2c24.9,0,45.1,20.1,45.2,45c0,24.9-20.1,45.1-45,45.2c0,0-0.1,0-0.1,0c-24.8,0.1-45-19.9-45.1-44.7C995.9,140.8,995.9,140.7,995.9,140.6z M1071.5,140.6c0-17.8-13.3-31.5-30.5-31.5c-17.2,0-30.5,13.7-30.5,31.5c0,17.8,13.3,31.6,30.5,31.6C1058.2,172.2,1071.5,158.4,1071.5,140.6L1071.5,140.6z M1096.6,97.9h15.6l28.8,68.2l28.8-68.2h14.9l-36.6,85.4h-14.9L1096.6,97.9z M1274,183.3h-15.5l-9-21.5H1209l-9,21.5h-14.7l36.6-85.4h15.6L1274,183.3z M1244,148.8l-14.7-35.4l-14.7,35.4H1244L1244,148.8z M172.1,104c0-16,10.8-31.5,16.7-28.6C195.5,78.8,183.7,93.9,172.1,104 M98.5,109.9c0-12.9,12.7-37.3,20.4-34.7C128.1,78.2,111.3,102.8,98.5,109.9L98.5,109.9z M85.6,201.8c-5.8,0.3-9.7-3.5-9.7-9.7c0-16.8,23.2-32.7,40.7-41.3C113.5,174.2,105.6,200.9,85.6,201.8L85.6,201.8z M192.7,147.3c-13.2,0-23.4,9.7-23.4,21.4c0,9.7,5.8,17.5,13.6,17.5c2.7,0,5.4-1.6,5.4-5.1c0-5.1-6.7-6.3-6.2-13.9c0.3-5,5-8.3,9.7-8.3c9.3,0,13.7,9.1,13.7,18.4c-0.4,14.4-11,24.4-23.4,24.4c-16.4,0-26.8-15.6-26.8-32.3c0-24.9,16.3-34.7,24.9-37c0.1,0,22.4,4,21.7-5.9c-0.3-4.3-6.7-6-11.4-6.2c-3.5,0-7,0.5-10.4,1.7c-2.8-1.6-4.8-4.1-5.8-7.2c16-12.1,27.2-23.8,27.2-37c0-7-4.7-13.2-13.6-13.2c-16,0-28,20.3-28,38.6c-0.1,3,0.1,6,0.8,9c-10.1,7.4-17.6,12-31.3,20.2c0.2-4,0.7-7.9,1.5-11.8c4.7-5.1,11.1-12.6,11.1-18.5c0-2.7-1.6-5.1-4.7-5.1c-7.8,0-13.6,11.7-15.2,19.9c-3.5,4.3-10.5,9.7-16.4,9.7c-4.7,0-6.2-4.3-6.6-5.8c14.8-5.1,33.1-25.3,33.1-43.6c0-3.9-1.6-12.5-13.2-12.5c-17.5,0-32.3,26.1-32.3,46.4c-6.2,0-8.6-6.6-8.6-11.7s1.9-10.1,1.9-11.7s-0.8-3.5-3.1-3.5c-5.8,0-9.3,7.8-9.3,16.8c0.4,12.5,8.6,20.3,19.5,21c1.6,7.4,8.2,14.4,16.4,14.4c5.1,0,11.3-1.6,15.6-5.5c-0.4,2.7-0.8,5.1-1.2,7.4c-17.1,9-29.6,15.2-40.9,25.3c-8.9,8.2-14,19.1-14,27.7c0,11.7,7.4,22.6,22.6,22.6c17.9,0,31.5-14.4,38.1-34.3c3.1-9.4,4.4-23,5.1-35.4c12.3-6.8,24.3-14.4,35.7-22.6c1,1.8,2.3,3.4,3.9,4.7c-8.2,4.3-27.6,16.4-27.6,44.8c0,20.3,13.6,42.9,40.5,42.9c22.2,0,37.4-18.3,37.4-35.8C218.8,162,209.8,147.2,192.7,147.3L192.7,147.3z M259.6,180.7c-0.1,0.1-0.3,0.3-0.7,0.2c-0.3-0.1-0.4-0.3-0.4-0.5c3-9.7,4.6-19.8,4.7-30c-0.1-17.1-7-27.7-16-27.7c-5.5,0-9.3,3.9-9.3,9.7c0,10.5,12.8,11.3,12.8,34.3c0,9.4-1.9,18.3-5.1,28.1c-14.4,48.7-60.3,71.3-105.1,71.3c-20.6,0-35.3-4.2-39.7-6.2c-0.2-0.2-0.3-0.5-0.2-0.8c0.1-0.3,0.4-0.5,0.6-0.4c9.7,3.1,19.8,4.7,29.9,4.7c17.1,0,27.3-7,27.3-15.6c0-5.3-4.2-9.7-9.6-9.7c-0.1,0-0.1,0-0.2,0c-10.5,0-11.3,13.2-33.9,13.2c-9.7,0-18.3-1.9-28.4-5.1c-48.3-14.8-71.3-60.4-71.2-105.6c0-13.5,2.1-26.9,6.3-39.7c0.2-0.2,0.5-0.2,0.7-0.1c0.3,0.1,0.4,0.4,0.4,0.5c-3,9.7-4.6,19.8-4.7,30c0,17.1,7,27.3,16,27.3c5.1,0.1,9.3-4,9.3-9.1c0-0.1,0-0.2,0-0.2c0-10.5-12.8-11.7-12.8-34.3c0-9.7,1.9-18.3,5.1-28.4c14.8-48.3,60.3-71,105.1-71.3c20.8-0.2,39,6.1,39.7,6.6c0.2,0.2,0.2,0.5,0.1,0.7c-0.1,0.4-0.4,0.4-0.5,0.4c-0.2,0-12.1-5-30-5c-16.7,0-27.2,7-27.2,16c0,5.1,4.1,9.3,9.3,9.4c0.2,0,0.3,0,0.5,0c10.5,0,11.3-12.9,33.9-12.9c9.7,0,18.3,1.9,28.4,5.1c48.7,14.8,70.8,60.8,71.2,105.2c0,13.7-2.1,27.3-6.4,40.2L259.6,180.7z M140.5,6.6C66.5,6.5,6.5,66.5,6.4,140.5s59.9,134.1,133.9,134.1c74,0.1,134.1-59.9,134.1-133.9c0,0,0-0.1,0-0.1C274.4,66.7,214.5,6.7,140.5,6.6z M140.5,281.3c-77.7-0.2-140.5-63.3-140.3-141C0.5,62.9,63.2,0.2,140.5,0C218,0,281.1,63.1,281.1,140.6S218,281.3,140.5,281.3L140.5,281.3z" 
              />
            </svg>
            <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--f-text)', paddingLeft: '12px', borderLeft: '1px solid var(--f-border)', height: '24px', display: 'flex', alignItems: 'center' }}>
              Tool Rental System
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className={`f-button ${isAdmin ? 'admin-active' : ''}`}
              onClick={() => setIsAdmin(prev => !prev)}
              data-agent-id="toggle-admin-btn"
              data-agent-action="toggle-admin"
              style={{
                background: isAdmin ? 'var(--f-primary)' : 'var(--f-bg-white)',
                color: isAdmin ? '#ffffff' : 'var(--f-text)',
                border: '1px solid var(--f-border)',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                boxShadow: 'var(--f-shadow)'
              }}
            >
              🔐 {isAdmin ? 'Admin Mode (On)' : 'Admin Mode (Off)'}
            </button>
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              data-agent-id="toggle-darkmode-btn"
              data-agent-action="toggle-theme"
              aria-label="Toggle Dark Mode"
              style={{
                background: 'var(--f-bg-white)',
                border: '1px solid var(--f-border)',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--f-text)',
                transition: 'all 0.2s',
                boxShadow: 'var(--f-shadow)'
              }}
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        <nav className="f-tabs">
          {['checkout', 'dashboard', 'inventory', 'scheduling'].map((tab) => (
            <div 
              key={tab}
              className={`f-tab ${activeTab === tab ? 'active' : ''}`} 
              onClick={() => setActiveTab(tab as any)}
            >
              {tab === 'checkout' && '🛒 Smart Rental'}
              {tab === 'dashboard' && '📊 Live Dashboard'}
              {tab === 'inventory' && '📦 Master Inventory'}
              {tab === 'scheduling' && '🗓️ Tool Scheduler'}
            </div>
          ))}
        </nav>
      </header>

      <main>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading real-time data...</div>
        ) : (
          <>
            {activeTab === 'checkout' && (
              <RentalForm 
                assets={assets.filter(a => (a as any).Current_Status === 'Available')} 
                selectedToolCodes={selectedToolCodes}
                setSelectedToolCodes={setSelectedToolCodes}
                onSuccess={() => {
                  setSelectedToolCodes([]); // Clear selection on success
                  fetchData();
                }}
              />
            )}
            
            {activeTab === 'dashboard' && (
              <div className="f-fade-in">
                <div className="f-card" style={{ marginBottom: '24px', height: '300px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Assets Status Overview</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                      <Pie
                        data={getChartData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {getChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="middle" align="right" layout="vertical" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ActiveRentals rentals={rentals} onRefresh={fetchData} />
              </div>
            )}
            
            {activeTab === 'inventory' && (
              <InventoryTable 
                assets={assets} 
                schedules={schedules}
                selectedToolCodes={selectedToolCodes}
                setSelectedToolCodes={setSelectedToolCodes}
                onNavigateToCheckout={() => setActiveTab('checkout')}
              />
            )}
            {activeTab === 'scheduling' && (
              <SchedulingTab 
                assets={assets} 
                isAdmin={isAdmin} 
                onRefreshAssets={fetchData} 
              />
            )}
          </>
        )}
      </main>

      <footer style={{ marginTop: '40px', padding: '20px 0', borderTop: '1px solid var(--f-border)', textAlign: 'center', color: 'var(--f-text-secondary)', fontSize: '12px' }}>
        © 2026 Project AssetFlow • Microsoft Teams Enterprise Edition
      </footer>
    </div>
  );
};

export default App;

```

---

## File: `src/frontend/Dashboard.tsx`

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiBox, FiCalendar, FiMapPin, FiCamera, 
  FiChevronRight, FiRefreshCw 
} from 'react-icons/fi';

/**
 * ✨ Elite Design System 적용: Tool Rental Dashboard Prototype
 * Philosophy: Apple (Minimalism) + Toss (Intuitive UX)
 */

const Dashboard: React.FC = () => {


  // MS Graph API를 통한 SharePoint 데이터 동기화 (인터페이스 skeleton)
  const syncWithSharePoint = async () => {
    console.log("Connecting to MS Graph API: sites/{site-id}/lists/Tool_Rental_Records");
    // TODO: Graph API Authentication & Fetch Logic
  };

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans selection:bg-blue-100">
      {/* Header: Apple-style Sticky Glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">GE VERNOVA_Tool Rental System</h1>
          <button 
            onClick={syncWithSharePoint}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            data-agent-id="sync-sharepoint-btn"
            data-agent-action="sync-sharepoint"
          >
            <FiRefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Hero Section: Toss-style Bold Text */}
        <section className="space-y-2">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold tracking-tight leading-tight"
          >
            Need a tool rental? <br />
            <span className="text-[#3182F6]">Apply quickly and easily.</span>
          </motion.h2>
        </section>

        {/* Quick Rental Form: Elite Card Design */}
        <section>
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <InputGroup 
                  label="Equipment Code" 
                  icon={<FiBox />} 
                  placeholder="e.g., DSP01" 
                  data-agent-id="input-equipment-code"
                  data-agent-action="input-text"
                />
                <InputGroup 
                  label="Project Name" 
                  icon={<FiMapPin />} 
                  placeholder="e.g., Samsung Austin Semiconductor" 
                  data-agent-id="input-project-name"
                  data-agent-action="input-text"
                />
              </div>
              <div className="space-y-6">
                <InputGroup 
                  label="Expected Return Date" 
                  icon={<FiCalendar />} 
                  type="date" 
                  data-agent-id="input-expected-return"
                  data-agent-action="input-date"
                />
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#4E5968] ml-1">Attach Condition Photo</label>
                  <button 
                    className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-all group"
                    data-agent-id="upload-condition-photo-btn"
                    data-agent-action="upload-photo"
                  >
                    <FiCamera className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Click to upload photo</span>
                  </button>
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full mt-10 bg-[#3182F6] text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-[#1b64da] transition-colors flex items-center justify-center space-x-2"
              data-agent-id="apply-rental-btn"
              data-agent-action="submit-rental-form"
            >
              <span>Apply for Rental</span>
              <FiChevronRight />
            </motion.button>
          </motion.div>
        </section>

        {/* Status Tracker: Minimalist List */}
        <section className="space-y-6">
          <h3 className="text-lg font-bold ml-1 text-[#4E5968]">Currently Rented Tools</h3>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl flex items-center justify-between border border-gray-50 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#3182F6]">
                    <FiBox className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold">DSP0{i} (Control System)</div>
                    <div className="text-sm text-[#4E5968]">Return D-5 | Renter</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#3182F6] bg-blue-50 px-3 py-1 rounded-full">Rented</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const InputGroup = ({ label, icon, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-[#4E5968] ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3182F6] transition-colors">
        {icon}
      </div>
      <input 
        className="w-full bg-[#F9FAFB] border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#3182F6] transition-all outline-none placeholder:text-gray-300"
        {...props}
      />
    </div>
  </div>
);

export default Dashboard;

```

---

## File: `src/utils/graph.ts`

```typescript
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "../authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Acquires an access token for Microsoft Graph API.
 * Tries silent acquisition first, then falls back to popup if required.
 */
export async function getGraphToken(): Promise<string | null> {
  try {
    // We must ensure initialize() is called, but main.tsx usually handles this.
    // However, for standalone utility usage, we check if it's initialized.
    // In MSAL v3, initialize() is required.
    
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) return null;

    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    try {
      const response = await msalInstance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        const response = await msalInstance.acquireTokenPopup(request);
        return response.accessToken;
      }
      console.error("Token acquisition failed:", error);
      return null;
    }
  } catch (e) {
    console.error("Error in getGraphToken:", e);
    return null;
  }
}

```

---

## File: `src/components/ActiveRentals.tsx`

```typescript
import React, { useState } from 'react';
import { type Rental } from '../types';
import './ActiveRentals.css';

interface ActiveRentalsProps {
  rentals: Rental[];
  onRefresh: () => void;
}

type ReturnAssetItem = {
  toolCode: string;
  model: string;
  photo: File | null;
};

type ExtendAssetItem = {
  toolCode: string;
  model: string;
  currentReturnDate: string;
  newReturnDate: string;
};

const ActiveRentals: React.FC<ActiveRentalsProps> = ({ rentals, onRefresh }) => {
  // Return States
  const [returnCaseId, setReturnCaseId] = useState<string | null>(null);
  const [assetsToReturn, setAssetsToReturn] = useState<ReturnAssetItem[]>([]);
  
  // Extension States
  const [extendCaseId, setExtendCaseId] = useState<string | null>(null);
  const [assetsToExtend, setAssetsToExtend] = useState<ExtendAssetItem[]>([]);
  const [batchExtendDate, setBatchExtendDate] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjectTab, setSelectedProjectTab] = useState('All');

  const calculateRemainingDays = (returnDate: string) => {
    const today = new Date();
    const target = new Date(returnDate);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnCaseId || assetsToReturn.length === 0) return;

    // Check if all selected items have a photo attached
    const missingPhotos = assetsToReturn.filter(item => !item.photo);
    if (missingPhotos.length > 0) {
      const codes = missingPhotos.map(item => item.toolCode).join(', ');
      alert(`⚠️ The following assets are missing individual return condition photos:\n${codes}\n\nPlease upload a 1:1 photo for all assets being returned.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 개별 장비별 반납 사진 업로드 API 호출
      for (const item of assetsToReturn) {
        if (item.photo) {
          const uploadPayload = new FormData();
          uploadPayload.append('file', item.photo);
          await fetch(`/api/sharepoint/upload?filename=${item.toolCode}_return.jpg`, {
            method: 'POST',
            body: uploadPayload
          });
        }
      }

      // 2. Create a return approval card instead of making the asset Available immediately.
      const returnResponse = await fetch('/api/sharepoint/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          caseId: returnCaseId,
          items: assetsToReturn.map(item => ({ toolCode: item.toolCode }))
        })
      });

      if (!returnResponse.ok) {
        throw new Error("Failed to process return on serverless database.");
      }

      alert(`✅ Return request submitted for ${assetsToReturn.length} assets.\nAdmin approval is now required before the assets become Available.`);
      setReturnCaseId(null);
      setAssetsToReturn([]);
      onRefresh(); // Refresh data
    } catch (error) {
      console.error("Error returning asset:", error);
      alert("Error processing return. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExtend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendCaseId || assetsToExtend.length === 0) return;

    // Validate dates: newReturnDate must be after currentReturnDate
    const invalidDates = assetsToExtend.filter(item => {
      const curr = new Date(item.currentReturnDate);
      const next = new Date(item.newReturnDate);
      return next <= curr;
    });

    if (invalidDates.length > 0) {
      const codes = invalidDates.map(item => item.toolCode).join(', ');
      alert(`⚠️ The extension return date for the following assets is equal to or prior to the current return date:\n${codes}\n\nThe new expected return date must be after the current return date.`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Create an extension approval card. The return date changes only after admin approval.
      const extendResponse = await fetch('/api/sharepoint/extend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          caseId: extendCaseId,
          items: assetsToExtend.map(item => ({
            toolCode: item.toolCode,
            newReturnDate: item.newReturnDate
          }))
        })
      });

      if (!extendResponse.ok) {
        throw new Error("Failed to process extension on serverless database.");
      }

      alert(`✅ Extension request submitted for ${assetsToExtend.length} assets.\nAdmin approval is required before the new return date is applied.`);
      setExtendCaseId(null);
      setAssetsToExtend([]);
      setBatchExtendDate('');
      onRefresh(); // Refresh data
    } catch (error) {
      console.error("Error extending asset:", error);
      alert("Error processing extension. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get unique projects for quick filter pills
  const uniqueProjects = Array.from(new Set(rentals.map(r => r.projectName).filter(Boolean)));

  // Filter rentals by search keyword and selected project tab
  const filteredRentals = rentals.filter(rental => {
    const projName = rental.projectName || '';
    const caseId = rental.caseId || '';
    const userEmail = rental.userEmail || '';
    const matchesSearch = projName.toLowerCase().includes(projectSearch.toLowerCase()) || 
                          caseId.toLowerCase().includes(projectSearch.toLowerCase()) ||
                          userEmail.toLowerCase().includes(projectSearch.toLowerCase());
    
    if (selectedProjectTab === 'All') return matchesSearch;
    return matchesSearch && projName === selectedProjectTab;
  });

  // Group filtered rentals by Case ID
  const groupedRentals = filteredRentals.reduce((acc, current) => {
    const caseId = current.caseId || (current as any).Case_ID || current.id || 'UNKNOWN-CASE';
    const key = caseId || 'UNKNOWN-CASE';
    if (!acc[key]) acc[key] = [];
    acc[key].push(current);
    return acc;
  }, {} as Record<string, Rental[]>);

  return (
    <div>
      <div className="active-rentals-header">
        <h2 className="active-rentals-title">Active Rentals Monitor</h2>
        <div className="f-badge f-badge-available">{Object.keys(groupedRentals).length} Active Cases ({filteredRentals.length} Items)</div>
      </div>

      {/* Premium Project View Filter Section */}
      <div className="f-card view-filter-card">
        <div className="view-filter-container">
          <div className="search-filter-wrapper">
            <span className="search-filter-label">🔍 View Filter:</span>
            <input 
              type="text"
              placeholder="Search by project, case ID, renter..."
              className="f-input search-filter-input"
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
            />
          </div>
          
          <div className="project-pills-wrapper">
            <button 
              className={`f-button project-pill ${selectedProjectTab === 'All' ? 'active' : ''}`}
              type="button"
              onClick={() => setSelectedProjectTab('All')}
            >
              All Projects
            </button>
            {uniqueProjects.map(proj => (
              <button 
                key={proj}
                className={`f-button project-pill ${selectedProjectTab === proj ? 'active' : ''}`}
                type="button"
                onClick={() => setSelectedProjectTab(proj || '')}
              >
                {proj}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rentals-grid">
        {Object.entries(groupedRentals).map(([caseId, items]) => {
          // Extract shared meta from the first item
          const firstItem = items[0];
          const expectedDate = (firstItem as any).expectedReturnDate || (firstItem as any).Expected_Return_Date || (firstItem as any).expectedReturn || '2026-05-30';
          const userEmail = (firstItem as any).userEmail || (firstItem as any).User_Email || (firstItem as any).user || 'Unknown Renter';
          const pmEmail = (firstItem as any).pmEmail || (firstItem as any).pm || 'Unknown PM';
          const projectName = firstItem.projectName || 'Unknown Project';
          const projectCode = (firstItem as any).projectCode || (firstItem as any).Project_Code || 'N/A';

          const daysLeft = calculateRemainingDays(expectedDate);
          const isOverdue = daysLeft < 0;
          const progress = Math.max(0, Math.min(100, (daysLeft / 30) * 100));

          return (
            <div 
              key={caseId} 
              className={`f-card rental-case-card ${isOverdue ? 'overdue' : 'normal'}`}
            >
              {/* Case Header */}
              <div className="case-header">
                <div className="case-header-content">
                  <h3 className="case-title">{caseId}</h3>
                  <div className="case-meta">
                    <div className="case-meta-row">
                      <span>👤 Renter: <strong className="case-meta-value">{userEmail}</strong></span>
                      <span>🔑 PM: <strong className="case-meta-value">{pmEmail}</strong></span>
                    </div>
                    <div className="case-meta-row-sub">
                      <span>🏢 Project: <strong className="case-meta-value">{projectName}</strong></span>
                      <span>🏷️ Code: <strong className="case-meta-value">{projectCode}</strong></span>
                    </div>
                  </div>
                </div>
                {isOverdue && <span className="f-badge overdue-badge">OVERDUE</span>}
              </div>

              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-header">
                  <span>Return Date: {expectedDate}</span>
                  <span className={`progress-status ${isOverdue ? 'overdue' : 'normal'}`}>
                    {isOverdue ? `${Math.abs(daysLeft)} Days Past Due` : `${daysLeft} Days Left`}
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className={`progress-bar-fill ${isOverdue ? 'overdue' : 'normal'}`}
                    style={{ width: `${isOverdue ? 100 : progress}%` }} 
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="assets-list-container">
                <h4 className="assets-list-title">Rented Assets ({items.length})</h4>
                <ul className="assets-list">
                  {items.map(item => (
                    <li key={item.toolCode} className="asset-item">
                      <span className="asset-info">
                        {item.toolCode} <span className="asset-info-model">- {(item as any).model || 'Unknown Model'}</span>
                      </span>
                      <div className="asset-item-actions">
                        <button 
                          type="button"
                          onClick={() => {
                            setExtendCaseId(caseId);
                            setAssetsToExtend([{
                              toolCode: item.toolCode,
                              model: (item as any).model || 'Unknown Model',
                              currentReturnDate: expectedDate,
                              newReturnDate: expectedDate
                            }]);
                          }}
                          className="btn-extend-item"
                        >
                          Extend
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setReturnCaseId(caseId);
                            setAssetsToReturn([{
                              toolCode: item.toolCode,
                              model: (item as any).model || 'Unknown Model',
                              photo: null
                            }]);
                          }}
                          className="btn-return-item"
                        >
                          Return
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Actions (Case Level) */}
              <div className="card-actions">
                <button 
                  className="f-button btn-extend-all" 
                  onClick={() => {
                    setExtendCaseId(caseId);
                    setAssetsToExtend(items.map(item => ({
                      toolCode: item.toolCode,
                      model: (item as any).model || 'Unknown Model',
                      currentReturnDate: expectedDate,
                      newReturnDate: expectedDate
                    })));
                  }}
                >
                  🗓️ Extend All
                </button>
                <button 
                  className="f-button btn-return-all" 
                  onClick={() => {
                    setReturnCaseId(caseId);
                    setAssetsToReturn(items.map(item => ({
                      toolCode: item.toolCode,
                      model: (item as any).model || 'Unknown Model',
                      photo: null
                    })));
                  }}
                >
                  ↩️ Return All
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Return Modal Overlay */}
      {returnCaseId && (
        <div className="modal-overlay">
          <div className="f-card modal-card">
            <h3 className="modal-title">
              ↩️ {assetsToReturn.length > 1 ? 'Bulk Return' : 'Partial Return'}
            </h3>
            <p className="modal-subtitle">
              Case ID: {returnCaseId}
            </p>
            
            <form onSubmit={handleReturn}>
              <div className="modal-table-wrapper">
                <table className="modal-table">
                  <thead className="modal-thead">
                    <tr>
                      <th className="modal-th">Tool Code</th>
                      <th className="modal-th">Model</th>
                      <th className="modal-th-photo">Return Photo (1:1 Required)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetsToReturn.map(item => (
                      <tr key={item.toolCode} className="modal-tr">
                        <td className="modal-td-code">{item.toolCode}</td>
                        <td className="modal-td-model">{item.model}</td>
                        <td className="modal-td">
                          <input 
                            type="file" 
                            accept="image/*"
                            className="modal-file-input"
                            onChange={(e) => {
                              const file = e.target.files ? e.target.files[0] : null;
                              setAssetsToReturn(prev => prev.map(a => 
                                a.toolCode === item.toolCode ? { ...a, photo: file } : a
                              ));
                            }}
                            required
                          />
                          {item.photo && (
                            <div className="modal-success-indicator">
                              ✓ Ready
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="f-button btn-modal-cancel" 
                  onClick={() => {
                    setReturnCaseId(null);
                    setAssetsToReturn([]);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="f-button f-button-primary btn-modal-confirm-return" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing Return...' : `Confirm Return (${assetsToReturn.length})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extend Modal Overlay */}
      {extendCaseId && (
        <div className="modal-overlay">
          <div className="f-card modal-card-extend">
            <h3 className="modal-title">
              🗓️ {assetsToExtend.length > 1 ? 'Bulk Extend Rental' : 'Partial Extend Rental'}
            </h3>
            <p className="modal-subtitle">
              Case ID: {extendCaseId}
            </p>

            <form onSubmit={handleExtend}>
              {/* Batch Date Setter for multiple items */}
              {assetsToExtend.length > 1 && (
                <div className="batch-date-setter">
                  <span className="batch-date-setter-label">
                    ⚡ Batch New Return Date:
                  </span>
                  <input 
                    type="date"
                    className="f-input batch-date-input"
                    value={batchExtendDate}
                    onChange={(e) => {
                      const date = e.target.value;
                      setBatchExtendDate(date);
                      if (date) {
                        setAssetsToExtend(prev => prev.map(item => ({
                          ...item,
                          newReturnDate: date
                        })));
                      }
                    }}
                  />
                </div>
              )}

              <div className="modal-table-wrapper">
                <table className="modal-table">
                  <thead className="modal-thead">
                    <tr>
                      <th className="modal-th">Tool Code</th>
                      <th className="modal-th">Current Return</th>
                      <th className="modal-th-photo extend-table-th-new-date">New Return Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetsToExtend.map(item => (
                      <tr key={item.toolCode} className="modal-tr">
                        <td className="modal-td-code">
                          {item.toolCode}
                          <div className="extend-td-code-sub">{item.model}</div>
                        </td>
                        <td className="extend-td-current-date">{item.currentReturnDate}</td>
                        <td className="modal-td">
                          <input 
                            type="date" 
                            className="f-input extend-date-input"
                            value={item.newReturnDate}
                            min={item.currentReturnDate}
                            onChange={(e) => {
                              const date = e.target.value;
                              setAssetsToExtend(prev => prev.map(a => 
                                a.toolCode === item.toolCode ? { ...a, newReturnDate: date } : a
                              ));
                            }}
                            required
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="f-button btn-modal-cancel" 
                  onClick={() => {
                    setExtendCaseId(null);
                    setAssetsToExtend([]);
                    setBatchExtendDate('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="f-button f-button-primary btn-modal-confirm-extend" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : `Confirm Extension (${assetsToExtend.length})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRentals;

```

---

## File: `src/components/ActiveRentals.css`

```css
.active-rentals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.active-rentals-title {
  font-size: 18px;
}

.view-filter-card {
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--f-card-accent-bg);
  border: 1px solid var(--f-card-accent-border);
  border-radius: 8px;
}

.view-filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.search-filter-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-filter-label {
  font-size: 13px;
  font-weight: bold;
  color: var(--f-text-muted);
}

.search-filter-input {
  width: 260px;
  height: 36px;
  font-size: 13px;
  margin: 0;
}

.project-pills-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.project-pill {
  height: 32px;
  font-size: 12px;
  padding: 0 14px;
  border-radius: 16px;
  border: 1px solid var(--f-primary);
  background-color: transparent;
  color: var(--f-primary);
  font-weight: 600;
  transition: all 0.2s;
}

.project-pill.active {
  background-color: var(--f-primary);
  color: var(--f-bg-white);
}

.rentals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr));
  gap: 20px;
}

.rental-case-card {
  padding: 20px;
}

.rental-case-card.normal {
  border-top: 4px solid var(--f-primary);
}

.rental-case-card.overdue {
  border-top: 4px solid var(--f-error);
}

.case-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--f-border);
  padding-bottom: 12px;
}

.case-header-content {
  width: 100%;
}

.case-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 6px 0;
  color: var(--f-text-strong);
}

.case-meta {
  font-size: 12px;
  color: var(--f-text-muted);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.case-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.case-meta-row-sub {
  display: flex;
  gap: 12px;
  margin-top: 2px;
}

.case-meta-value {
  color: var(--f-text-normal);
}

.overdue-badge {
  background: var(--f-error);
  color: white;
  align-self: flex-start;
  margin-left: 8px;
}

.progress-section {
  margin-bottom: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  margin-bottom: 4px;
}

.progress-status {
  font-weight: bold;
}

.progress-status.normal {
  color: var(--f-primary);
}

.progress-status.overdue {
  color: var(--f-error);
}

.progress-bar-bg {
  width: 100%;
  height: 6px;
  background: var(--f-border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
}

.progress-bar-fill.normal {
  background: var(--f-primary);
}

.progress-bar-fill.overdue {
  background: var(--f-error);
}

.assets-list-container {
  margin-bottom: 20px;
  background: var(--f-bg-item-list);
  padding: 12px;
  borderRadius: 8px;
}

.assets-list-title {
  font-size: 12px;
  color: var(--f-text-muted);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.assets-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.asset-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed var(--f-border-dashed);
}

.asset-info {
  font-size: 13px;
  font-weight: 500;
}

.asset-info-model {
  color: var(--f-text-muted);
  font-weight: normal;
}

.asset-item-actions {
  display: flex;
  gap: 4px;
}

.btn-extend-item {
  font-size: 11px;
  padding: 4px 8px;
  background: white;
  border: 1px solid var(--f-primary);
  border-radius: 4px;
  cursor: pointer;
  color: var(--f-primary);
  font-weight: 500;
}

.btn-return-item {
  font-size: 11px;
  padding: 4px 8px;
  background: white;
  border: 1px solid var(--f-error);
  border-radius: 4px;
  cursor: pointer;
  color: var(--f-error);
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn-extend-all {
  flex: 1;
  border: 1px solid var(--f-primary);
  background: var(--f-bg-white);
  color: var(--f-primary);
  font-size: 13px;
  font-weight: 500;
}

.btn-return-all {
  flex: 1;
  background: var(--f-primary);
  color: white;
  font-size: 13px;
  border: none;
  font-weight: 500;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: 550px;
  padding: 24px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: bold;
}

.modal-subtitle {
  font-size: 13px;
  color: var(--f-text-muted);
  margin-bottom: 20px;
}

.modal-table-wrapper {
  border: 1px solid var(--f-border);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 20px;
}

.modal-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.modal-thead {
  background-color: var(--f-bg-th);
  border-bottom: 1px solid var(--f-border);
}

.modal-th {
  padding: 10px;
  text-align: left;
}

.modal-th-photo {
  padding: 10px;
  text-align: left;
  width: 220px;
}

.modal-tr {
  border-bottom: 1px solid var(--f-border);
}

.modal-td {
  padding: 10px;
}

.modal-td-code {
  padding: 10px;
  font-weight: 600;
}

.modal-td-model {
  padding: 10px;
  color: var(--f-text-normal);
}

.modal-file-input {
  font-size: 11px;
}

.modal-success-indicator {
  font-size: 11px;
  color: var(--f-primary);
  margin-top: 4px;
}

.modal-actions {
  display: flex;
  gap: 8px;
  margin-top: 24px;
}

.btn-modal-cancel {
  flex: 1;
  background: var(--f-bg-white);
  color: var(--f-text);
  border: 1px solid var(--f-border);
}

.btn-modal-confirm-return {
  flex: 1;
  background-color: var(--f-error);
  color: white;
  border: none;
  height: 38px;
  font-size: 14px;
  font-weight: bold;
}

/* Extend Specific Modal Styles */
.modal-card-extend {
  width: 580px;
  padding: 24px;
  max-height: 90vh;
  overflow-y: auto;
}

.batch-date-setter {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--f-bg-item-list);
  border: 1px solid var(--f-border);
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.batch-date-setter-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--f-primary);
}

.batch-date-input {
  flex: 1;
  padding: 4px 8px;
  font-size: 13px;
  height: 32px;
}

.extend-table-th-new-date {
  padding: 10px;
  text-align: left;
  width: 180px;
}

.extend-td-code-sub {
  font-size: 11px;
  font-weight: normal;
  color: var(--f-text-muted);
}

.extend-td-current-date {
  padding: 10px;
  color: var(--f-error);
  font-weight: 500;
}

.extend-date-input {
  height: 32px;
  padding: 4px;
  font-size: 12px;
}

.btn-modal-confirm-extend {
  flex: 1;
  background-color: var(--f-primary);
  color: white;
  border: none;
  height: 38px;
  font-size: 14px;
  font-weight: bold;
}

```

---

## File: `src/components/InventoryTable.tsx`

```typescript
import React, { useState } from 'react';
import { type Asset, type ScheduledCase } from '../types';
import './InventoryTable.css';

interface InventoryTableProps {
  assets: Asset[];
  schedules?: ScheduledCase[];
  selectedToolCodes: string[];
  setSelectedToolCodes: React.Dispatch<React.SetStateAction<string[]>>;
  onNavigateToCheckout: () => void;
}

const csvEscape = (value: unknown) => {
  const raw = value == null ? '' : String(value);
  return `"${raw.replace(/"/g, '""')}"`;
};

const getToolCode = (asset: any) => asset.Tool_Code || asset.toolCode;
const getBrand = (asset: any) => asset.Brand || asset.brand || '—';
const getModel = (asset: any) => asset.Asset_Model || asset.model || '—';

const SpecSummaryCard: React.FC<{ asset: Asset; compact?: boolean }> = ({ asset, compact = false }) => {
  const spec = asset.specSummary;

  if (!spec) {
    return (
      <div className="datasheet-summary-card">
        <strong>Spec Summary</strong>
        <p>No mock datasheet summary saved yet.</p>
      </div>
    );
  }

  const rows = [
    ['Type', spec.equipmentType],
    ['Range', spec.measurementRange],
    ['Accuracy', spec.accuracy],
    ['Voltage', spec.voltageRating],
    ['Current', spec.currentRating],
    ['Safety', spec.safetyCategory],
    ['Connectivity', spec.connectivity],
    ['Power', spec.powerSource],
    ['Calibration', spec.calibrationCycle],
  ];

  return (
    <div className="datasheet-summary-card">
      <div className="summary-card-header">
        <div>
          <strong>Spec Summary</strong>
          <div className="summary-card-subtitle">{getBrand(asset)} {getModel(asset)}</div>
        </div>
        <span className="summary-card-chip">MOCK</span>
      </div>
      <div className={compact ? 'summary-card-grid compact' : 'summary-card-grid'}>
        {rows.map(([label, value]) => (
          <React.Fragment key={label}>
            <span className="summary-card-label">{label}</span>
            <span>{value}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="summary-card-features">
        <strong>Key features</strong>
        <ul>
          {spec.keyFeatures.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
      </div>
      <p className="summary-card-use"><strong>Typical use:</strong> {spec.typicalUse}</p>
      {asset.datasheetUrl && (
        <a className="summary-card-link" href={asset.datasheetUrl} target="_blank" rel="noreferrer">
          Open mock datasheet PDF
        </a>
      )}
    </div>
  );
};

const InventoryTable: React.FC<InventoryTableProps> = ({ 
  assets: initialAssets, 
  schedules = [],
  selectedToolCodes, 
  setSelectedToolCodes, 
  onNavigateToCheckout 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [detailsAsset, setDetailsAsset] = useState<Asset | null>(null);

  const calculateDaysUntilCal = (calDate: string) => {
    if (!calDate) return 999;
    const today = new Date();
    const target = new Date(calDate);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleCheckboxChange = (toolCode: string, checked: boolean) => {
    if (checked) {
      setSelectedToolCodes(prev => [...prev, toolCode]);
    } else {
      setSelectedToolCodes(prev => prev.filter(code => code !== toolCode));
    }
  };

  // Dynamically filter and sort assets on the fly
  const getSortedAndFilteredAssets = () => {
    let result = [...initialAssets];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(asset => {
        const code = (asset.Tool_Code || asset.toolCode || '').toLowerCase();
        const brand = (asset.Brand || asset.brand || '').toLowerCase();
        const model = (asset.Asset_Model || asset.model || '').toLowerCase();
        const type = (asset.specSummary?.equipmentType || '').toLowerCase();
        const serial = (asset.serialNumber || asset.Serial_Number || '').toLowerCase();
        const location = (asset.Location_Rack || asset.rack || '').toLowerCase();
        const currentLocation = (asset.Current_Location || asset.currentLocation || '').toLowerCase();

        return code.includes(query) ||
               brand.includes(query) ||
               model.includes(query) ||
               type.includes(query) ||
               serial.includes(query) ||
               location.includes(query) ||
               currentLocation.includes(query);
      });
    }

    if (sortConfig) {
      const { key, direction } = sortConfig;
      result.sort((a: any, b: any) => {
        let av = a[key] || a[key.replace(/^[A-Z]/, (c) => c.toLowerCase())] || '';
        let bv = b[key] || b[key.replace(/^[A-Z]/, (c) => c.toLowerCase())] || '';

        if (key === 'rack') {
          av = a.Location_Rack || a.rack || '';
          bv = b.Location_Rack || b.rack || '';
        } else if (key === 'Location' || key === 'location') {
          av = a.Location_Rack || a.rack || '';
          bv = b.Location_Rack || b.rack || '';
        } else if (key === 'serialNumber' || key === 'Serial_Number') {
          av = a.serialNumber || a.Serial_Number || '';
          bv = b.serialNumber || b.Serial_Number || '';
        } else if (key === 'Current_Status' || key === 'status') {
          av = a.Current_Status || a.status || '';
          bv = b.Current_Status || b.status || '';
        } else if (key === 'Current_Location' || key === 'currentLocation') {
          av = a.Current_Location || a.currentLocation || '';
          bv = b.Current_Location || b.currentLocation || '';
        } else if (key === 'Tool_Code' || key === 'toolCode') {
          av = a.Tool_Code || a.toolCode || '';
          bv = b.Tool_Code || b.toolCode || '';
        } else if (key === 'Brand' || key === 'brand') {
          av = a.Brand || a.brand || '';
          bv = b.Brand || b.brand || '';
        } else if (key === 'Asset_Model' || key === 'model') {
          av = a.Asset_Model || a.model || '';
          bv = b.Asset_Model || b.model || '';
        } else if (key === 'Calibration_Date' || key === 'calDate') {
          av = a.Calibration_Date || a.calDate || '';
          bv = b.Calibration_Date || b.calDate || '';
        }

        if (av < bv) return direction === 'asc' ? -1 : 1;
        if (av > bv) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  };

  const displayAssets = getSortedAndFilteredAssets();
  const selectedAssets = initialAssets.filter(asset => selectedToolCodes.includes(getToolCode(asset)));

  const downloadSelectedCsv = () => {
    const headers = [
      'Tool Code', 'Brand', 'Model', 'Serial Number', 'Rack', 'Equipment Type', 'Measurement Range', 'Accuracy',
      'Voltage Rating', 'Current Rating', 'Safety Category', 'Connectivity', 'Power Source',
      'Calibration Cycle', 'Key Features', 'Typical Use', 'Datasheet PDF URL'
    ];

    const rows = selectedAssets.map(asset => {
      const spec = asset.specSummary;
      const serial = asset.serialNumber || asset.Serial_Number || '';
      const rackVal = asset.Location_Rack || asset.rack || '';
      return [
        getToolCode(asset), getBrand(asset), getModel(asset), serial, rackVal, spec?.equipmentType, spec?.measurementRange,
        spec?.accuracy, spec?.voltageRating, spec?.currentRating, spec?.safetyCategory, spec?.connectivity,
        spec?.powerSource, spec?.calibrationCycle, spec?.keyFeatures.join('; '), spec?.typicalUse, asset.datasheetUrl
      ].map(csvEscape).join(',');
    });

    const csv = [headers.map(csvEscape).join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ToolRental_Selected_Spec_Summary.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {selectedToolCodes.length > 0 && (
        <div className="inventory-selection-bar">
          <div className="selection-bar-info">
            <span style={{ fontSize: '18px' }}>🛒</span>
            <span className="selection-bar-text">
              <strong>{selectedToolCodes.length}</strong> planned rental assets selected.
            </span>
          </div>
          <div className="selection-bar-actions">
            <button 
              type="button" 
              className="f-button spec-export-button" 
              onClick={downloadSelectedCsv}
              data-agent-id="export-csv-btn"
              data-agent-action="export-csv"
            >
              ⬇ Export Spec CSV
            </button>
            <button 
              type="button" 
              className="f-button f-button-primary" 
              onClick={onNavigateToCheckout}
              data-agent-id="navigate-checkout-btn"
              data-agent-action="navigate-checkout"
            >
              Go to Smart Checkout ➜
            </button>
          </div>
        </div>
      )}

      <div className="inventory-header">
        <div>
          <h2 className="inventory-title">Master Asset Inventory</h2>
          <p className="inventory-subtitle">
            Hover or tap model text, or use ⋯ Details to preview the standardized mock datasheet summary.
          </p>
        </div>
        <div className="legend-container">
          <div className="legend-item">
            <div className="legend-color-box warning"></div>
            <span>Cal &lt; 30 Days</span>
          </div>
          <div className="legend-item">
            <div className="legend-color-box expired"></div>
            <span>Cal Expired</span>
          </div>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by model, brand, code, serial, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-agent-id="inventory-search-input"
            data-agent-action="search"
          />
        </div>
      </div>

      <div className="f-table-container">
        <table className="f-table">
          <thead>
            <tr>
              <th className="table-th-select">Select</th>
              <th onClick={() => handleSort('Current_Status')}>Status</th>
              <th onClick={() => handleSort('Tool_Code')}>Tool Code</th>
              <th onClick={() => handleSort('rack')}>Rack</th>
              <th onClick={() => handleSort('Current_Location')}>Current location</th>
              <th onClick={() => handleSort('Brand')}>Brand</th>
              <th onClick={() => handleSort('Asset_Model')}>Model</th>
              <th onClick={() => handleSort('serialNumber')}>Serial Number</th>
              <th onClick={() => handleSort('Calibration_Date')}>Calibration Date</th>
              <th>Days Until Cal</th>
              <th className="table-th-more">More</th>
            </tr>
          </thead>
          <tbody>
            {displayAssets.map((asset: any, index) => {
              const daysLeft = calculateDaysUntilCal(asset.Calibration_Date || asset.calDate);
              const status = asset.Current_Status || asset.status;
              const rack = asset.Location_Rack || asset.rack || '';
              const currentLocation = asset.Current_Location || asset.currentLocation;
              const toolCode = getToolCode(asset);
              const isSelected = selectedToolCodes.includes(toolCode);
              const isAvailable = status === 'Available';
              const serialNumber = asset.serialNumber || asset.Serial_Number || '—';
              
              const assetSchedules = schedules.filter((s: any) => s.toolCode === toolCode && s.status !== 'Completed');
              const sortedSchedules = [...assetSchedules].sort((a: any, b: any) => {
                if (a.sequenceOrder !== b.sequenceOrder) {
                  return a.sequenceOrder - b.sequenceOrder;
                }
                const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
                const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
                if (dateA !== dateB) return dateA - dateB;
                return a.id.localeCompare(b.id);
              });
              const currentCaseId = asset.caseId;
              const nextSchedules = sortedSchedules.filter((s: any) => s.id !== currentCaseId);

              let rowClass = '';
              if (daysLeft < 0) rowClass = 'row-calibration-expired';
              else if (daysLeft < 30) rowClass = 'row-calibration-warning';
              if (isSelected) rowClass += (rowClass ? ' ' : '') + 'row-selected';

              return (
                <tr key={toolCode || index} className={rowClass}>
                  <td className="table-td-select">
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      disabled={!isAvailable}
                      className={`select-checkbox ${
                        isAvailable ? 'available' : 
                        status === 'Calibration' ? 'calibration' : 
                        status === 'Reserved' ? 'reserved' : 
                        'rented'
                      }`}
                      onChange={(e) => handleCheckboxChange(toolCode, e.target.checked)}
                      title={
                        isAvailable ? 'Add to rental cart' : 
                        status === 'Calibration' ? 'Equipment in Calibration cannot be rented.' :
                        status === 'Reserved' ? 'Reserved equipment cannot be rented.' :
                        'Rented assets cannot be selected.'
                      }
                      data-agent-id={`select-${toolCode}`}
                      data-agent-action="select-asset"
                    />
                  </td>
                  <td>
                    <span className={`f-badge ${
                      status === 'Available' ? 'f-badge-available' : 
                      status === 'Calibration' ? 'f-badge-calibration' : 
                      status === 'Reserved' ? 'f-badge-reserved' : 
                      'f-badge-rented'
                    }`}>
                      {status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="table-td-code">{toolCode}</td>
                  <td>{rack}</td>
                  <td className={`table-td-location ${currentLocation === 'Warehouse' ? 'warehouse' : 'field'}`}>
                    <div className="location-cell-content">
                      <span className="location-name">{currentLocation}</span>
                      {nextSchedules.length > 0 && (
                        <div className="next-use-badge-container">
                          <span className="next-use-badge-trigger">
                            <span className="next-use-label">Next: </span>
                            <span className={`next-use-badge next-use-badge-${nextSchedules[0].stage}`}>
                              {nextSchedules[0].stage === 'calibration' ? 'Calibration' : nextSchedules[0].destination}
                              {nextSchedules.length > 1 && ` (+${nextSchedules.length - 1})`}
                            </span>
                          </span>
                          
                          {/* Rich Tooltip Card */}
                          <div className="next-use-tooltip">
                            <div className="tooltip-header">Upcoming Schedules for {toolCode}</div>
                            <div className="tooltip-timeline">
                              {nextSchedules.map((s: any, idx: number) => (
                                <div key={s.id || idx} className="tooltip-timeline-item">
                                  <div className="timeline-dot-connector">
                                    <div className={`timeline-dot dot-${s.stage}`} />
                                    {idx < nextSchedules.length - 1 && <div className="timeline-connector" />}
                                  </div>
                                  <div className="timeline-details">
                                    <div className="timeline-header-row">
                                      <span className={`timeline-badge badge-${s.stage}`}>
                                        {s.stage === 'active_rental' ? 'Rental' : s.stage === 'calibration' ? 'Calibration' : 'Ongoing'}
                                      </span>
                                      <span className="timeline-destination">{s.destination || 'Calibration Lab'}</span>
                                    </div>
                                    {s.startDate && s.endDate ? (
                                      <div className="timeline-dates">{s.startDate} ~ {s.endDate}</div>
                                    ) : (
                                      <div className="timeline-dates" style={{ fontStyle: 'italic', color: 'var(--f-text-muted)' }}>No dates (Sequence Queue)</div>
                                    )}
                                    <div className="timeline-meta">
                                      {s.projectCode && <span>Code: {s.projectCode} · </span>}
                                      <span>PM: {s.pmEmail}</span>
                                    </div>
                                    {s.notes && <div className="timeline-notes">Note: {s.notes}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{getBrand(asset)}</td>
                  <td>
                    <span
                      className="model-hover-target"
                      role="button"
                      tabIndex={0}
                      aria-label={`Open specification summary for ${getBrand(asset)} ${getModel(asset)}`}
                      onClick={() => setDetailsAsset(asset)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setDetailsAsset(asset);
                        }
                      }}
                    >
                      {getModel(asset)}
                      <div className="model-hover-card"><SpecSummaryCard asset={asset} compact /></div>
                    </span>
                  </td>
                  <td>{serialNumber}</td>
                  <td>{asset.Calibration_Date || asset.calDate}</td>
                  <td className="table-td-cal-days">{daysLeft < 0 ? <span className="cal-expired-text">EXPIRED ({Math.abs(daysLeft)}d)</span> : `${daysLeft}d`}</td>
                  <td className="table-td-more">
                    <button 
                      className="row-more-button" 
                      type="button" 
                      onClick={() => setDetailsAsset(asset)} 
                      aria-label={`Open details for ${toolCode}`}
                      data-agent-id={`more-details-${toolCode}`}
                      data-agent-action="open-details"
                    >
                      ⋯
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {detailsAsset && (
        <div className="details-modal-backdrop" onClick={() => setDetailsAsset(null)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <div>
                <h3>{getBrand(detailsAsset)} {getModel(detailsAsset)}</h3>
                <p>{getToolCode(detailsAsset)} · standardized mock datasheet template</p>
              </div>
              <button 
                type="button" 
                className="details-close-button" 
                onClick={() => setDetailsAsset(null)}
                data-agent-id="close-details-btn"
                data-agent-action="close-details"
              >
                ×
              </button>
            </div>
            <SpecSummaryCard asset={detailsAsset} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;

```

---

## File: `src/components/InventoryTable.css`

```css
.selection-bar-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selection-bar-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--f-primary);
}

.selection-bar-actions {
  display: flex;
  gap: 8px;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.inventory-title {
  font-size: 18px;
}

.inventory-subtitle {
  font-size: 12px;
  color: var(--f-text-secondary);
}

.legend-container {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-color-box {
  width: 12px;
  height: 12px;
}

.legend-color-box.warning {
  background: var(--f-warning);
  border: 1px solid var(--f-warning-border);
}

.legend-color-box.expired {
  background: var(--f-danger-bg);
  border: 1px solid var(--f-error);
}

.table-th-select {
  width: 60px;
  text-align: center;
}

.table-th-more {
  width: 72px;
  text-align: center;
}

.table-td-select {
  text-align: center;
}

.select-checkbox {
  width: 16px;
  height: 16px;
}

.select-checkbox.available {
  cursor: pointer;
}

.select-checkbox.rented {
  cursor: not-allowed;
}

.table-td-location {
  fontWeight: 600;
}

.table-td-location.warehouse {
  color: var(--f-text-secondary);
}

.table-td-location.field {
  color: var(--f-primary);
}

.table-td-code {
  font-weight: 600;
}

.table-td-cal-days {
  font-weight: bold;
}

.cal-expired-text {
  color: var(--f-error);
}

.table-td-more {
  text-align: center;
}

/* Row states based on tokens */
.row-calibration-expired {
  background-color: var(--f-danger-bg);
}

.row-calibration-warning {
  background-color: var(--f-warning);
}

.row-selected {
  background-color: var(--f-selected-bg);
}

.inventory-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  font-size: 14px;
  border: 1px solid var(--f-border);
  border-radius: 6px;
  background-color: var(--f-bg-white);
  color: var(--f-text);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--f-primary);
  box-shadow: 0 0 0 2px var(--f-selected-bg);
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--f-text-secondary);
  pointer-events: none;
  font-size: 14px;
}

@media (max-width: 768px) {
  /* Preserve the full inventory schema on mobile; the table container handles horizontal scroll. */
  .inventory-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-input-wrapper {
    max-width: 100%;
  }

  .inventory-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}


```

---

## File: `src/components/RentalForm.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { type Asset } from '../types';
import './RentalForm.css';

interface RentalFormProps {
  assets: Asset[];
  selectedToolCodes: string[];
  setSelectedToolCodes: React.Dispatch<React.SetStateAction<string[]>>;
  onSuccess: () => void;
}

type CartItemType = {
  toolCode: string;
  toolModel: string;
  photo: File | null;
};

const RentalForm: React.FC<RentalFormProps> = ({ 
  assets, 
  selectedToolCodes, 
  setSelectedToolCodes, 
  onSuccess 
}) => {
  // Catalog & Search State
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cart & Project Form State
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [formData, setFormData] = useState({
    projectName: '',
    projectCode: '',
    userEmail: '',
    pmEmail: '',
    expectedReturnDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize local cart with global selectedToolCodes
  useEffect(() => {
    const currentCartCodes = cart.map(item => item.toolCode);
    
    // Items selected in global state but not in local cart
    const addedItems = selectedToolCodes
      .filter(code => !currentCartCodes.includes(code))
      .map(code => {
        const asset = assets.find(a => a.toolCode === code);
        return {
          toolCode: code,
          toolModel: asset ? asset.model : 'Unknown Model',
          photo: null
        };
      });

    // Items that exist in both global state and local cart (preserving file attachment state)
    const keptItems = cart.filter(item => selectedToolCodes.includes(item.toolCode));

    if (addedItems.length > 0 || keptItems.length !== cart.length) {
      setCart([...keptItems, ...addedItems]);
    }
  }, [selectedToolCodes, assets]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Filter available assets based on search term (using serial number index)
  const filteredAssets = assets.filter(asset => 
    (asset.serialNumber && asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (asset.brand && asset.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCheckboxChange = (asset: Asset, checked: boolean) => {
    if (checked) {
      setSelectedToolCodes(prev => [...prev, asset.toolCode]);
    } else {
      setSelectedToolCodes(prev => prev.filter(code => code !== asset.toolCode));
    }
  };

  const handleFileChangeForAsset = (toolCode: string, file: File | null) => {
    setCart(prev => prev.map(item => 
      item.toolCode === toolCode ? { ...item, photo: file } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("No assets selected in the cart. Please check assets to rent from the inventory list above.");
      return;
    }

    // Check if all selected items have a photo attached
    const missingPhotos = cart.filter(item => !item.photo);
    if (missingPhotos.length > 0) {
      const codes = missingPhotos.map(item => item.toolCode).join(', ');
      alert(`⚠️ The following assets are missing individual condition photos:\n${codes}\n\nPlease attach a 1:1 condition photo for all tools.`);
      return;
    }

    setIsSubmitting(true);

    // Generate Case ID: TR-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const caseId = `TR-${dateStr}-${randomSuffix}`;

    const mappedItems = await Promise.all(cart.map(async (item) => {
      let photoWebUrl = '';

      if (item.photo) {
        const uploadData = new FormData();
        uploadData.append('file', item.photo);

        try {
          const uploadResponse = await fetch(`/api/sharepoint/upload?filename=${encodeURIComponent(item.photo.name)}`, {
            method: 'POST',
            body: uploadData,
          });
          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            photoWebUrl = uploadResult.webUrl || '';
          }
        } catch (uploadError) {
          console.error(`Photo preview upload failed for ${item.toolCode}:`, uploadError);
        }
      }

      return {
        toolCode: item.toolCode,
        // Keep the original file name for the later OneDrive/SharePoint naming-format conversion.
        photoUrl: item.photo ? item.photo.name : 'Unknown',
        // Demo-only openable URL. In production this becomes the Graph/SharePoint/OneDrive webUrl.
        photoWebUrl,
      };
    }));

    const payload = {
      caseId,
      items: mappedItems,
      projectName: formData.projectName,
      projectCode: formData.projectCode,
      returnDate: formData.expectedReturnDate,
      pmEmail: formData.pmEmail,
      userEmail: formData.userEmail
    };

    try {
      const response = await fetch("/api/sharepoint/rental", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Submission failed");

      const result = await response.json();
      
      alert(`✅ Bulk rental request has been successfully submitted!\nCase ID: ${result.caseId}`);
      
      // Clear form & Cart
      setCart([]);
      setFormData({
        projectName: '',
        projectCode: '',
        userEmail: '',
        pmEmail: '',
        expectedReturnDate: '',
      });
      setSearchTerm('');
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting bulk rental:", error);
      alert("An error occurred while processing your rental. Please check your network connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="f-card rental-form-container">
      <h2 className="rental-form-title">
        🛒 Smart Bulk Rental Checkout
      </h2>
      
      {/* SECTION 1: Catalog Selector */}
      <div className="catalog-selector-card">
        <div className="catalog-header">
          <h3 className="cart-title">
            1. Select Tools from Catalog ({assets.length} Available)
          </h3>
          <input 
            type="text"
            className="f-input catalog-search-input"
            placeholder="🔍 Search Serial or Model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="catalog-table-wrapper">
          <table className="catalog-table">
            <thead className="catalog-table-thead">
              <tr>
                <th className="catalog-th-select">Select</th>
                <th className="catalog-th-left">Serial Number</th>
                <th className="catalog-th-left">Brand</th>
                <th className="catalog-th-left">Model</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map(asset => {
                  const isChecked = cart.some(item => item.toolCode === asset.toolCode);
                  return (
                    <tr 
                      key={asset.toolCode} 
                      className={`catalog-tr ${isChecked ? 'selected' : ''}`}
                    >
                      <td className="catalog-td-center">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          className="catalog-checkbox"
                          onChange={(e) => handleCheckboxChange(asset, e.target.checked)}
                        />
                      </td>
                      <td className="catalog-td-code">{asset.serialNumber || 'N/A'}</td>
                      <td className="catalog-td-brand">{asset.brand || 'N/A'}</td>
                      <td className="catalog-td-model">{asset.model}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="catalog-td-model" style={{ textAlign: 'center', padding: '16px' }}>
                    No matching available assets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Dynamic Cart Table (Photo Upload) */}
      {cart.length > 0 && (
        <div className="cart-section">
          <h3 className="cart-title">
            📦 Selected Items & Condition Photos ({cart.length})
          </h3>
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead className="cart-table-thead">
                <tr>
                  <th className="cart-th-code">Serial Number</th>
                  <th className="cart-th-model">Model</th>
                  <th className="cart-th-photo">Condition Photo (1:1 Required)</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => {
                  const asset = assets.find(a => a.toolCode === item.toolCode);
                  return (
                    <tr key={item.toolCode} className="cart-tr">
                      <td className="cart-td-code">{asset?.serialNumber || item.toolCode}</td>
                      <td className="cart-td-model">{item.toolModel}</td>
                      <td className="cart-td-photo">
                        <input 
                          type="file" 
                          accept="image/jpeg, image/png"
                          className="cart-file-input"
                          onChange={(e) => handleFileChangeForAsset(item.toolCode, e.target.files ? e.target.files[0] : null)}
                        />
                        {item.photo && (
                          <div className="cart-attached-indicator">
                            ✓ Attached: {item.photo.name}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: Project Form */}
      <form onSubmit={handleSubmit}>
        <h3 className="form-section-title">
          2. Project & Requester Details
        </h3>
        
        <div className="f-form-group">
          <label className="f-label" htmlFor="project-name">Project Name</label>
          <input 
            type="text" 
            name="projectName"
            id="project-name"
            className="f-input" 
            value={formData.projectName}
            onChange={handleInputChange}
            required 
            placeholder="e.g. Samsung Austin Semiconductor"
          />
        </div>

        <div className="form-row">
          <div className="f-form-group">
            <label className="f-label" htmlFor="project-code">Project Code</label>
            <input 
              type="text" 
              name="projectCode"
              id="project-code"
              className="f-input" 
              value={formData.projectCode}
              onChange={handleInputChange}
              required 
              placeholder="GE-XXXX"
            />
          </div>
          <div className="f-form-group">
            <label className="f-label" htmlFor="user-email">Requester Email</label>
            <input 
              type="email" 
              name="userEmail"
              id="user-email"
              className="f-input" 
              value={formData.userEmail}
              onChange={handleInputChange}
              required 
              placeholder="user@ge.com"
            />
          </div>
          <div className="f-form-group">
            <label className="f-label" htmlFor="pm-email">PM Email</label>
            <input 
              type="email" 
              name="pmEmail"
              id="pm-email"
              className="f-input" 
              value={formData.pmEmail}
              onChange={handleInputChange}
              required 
              placeholder="pm@ge.com"
            />
          </div>
        </div>

        <div className="f-form-group">
          <label className="f-label" htmlFor="expected-return-date">Expected Return Date</label>
          <input 
            type="date" 
            name="expectedReturnDate"
            id="expected-return-date"
            className="f-input" 
            value={formData.expectedReturnDate}
            onChange={handleInputChange}
            required 
          />
        </div>

        <button 
          type="submit" 
          className="f-button f-button-primary rental-submit-btn" 
          disabled={isSubmitting || cart.length === 0}
        >
          {isSubmitting ? 'Processing Bulk Request...' : '🚀 Submit Bulk Rental Request'}
        </button>
      </form>
    </div>
  );
};

export default RentalForm;


```

---

## File: `src/components/RentalForm.css`

```css
.rental-form-container {
  max-width: 850px;
  margin: 0 auto;
  padding: 24px;
}

.rental-form-title {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  color: var(--f-text-strong);
}

.catalog-selector-card {
  margin-bottom: 25px;
  padding: 16px;
  border: 1px solid var(--f-card-accent-border);
  border-radius: 8px;
  background-color: var(--f-card-accent-bg);
}

.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.catalog-search-input {
  width: 220px;
  height: 32px;
  font-size: 13px;
  margin: 0;
}

.catalog-table-wrapper {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--f-border);
  border-radius: 6px;
  background-color: var(--f-bg-white);
}

.catalog-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.catalog-table-thead {
  position: sticky;
  top: 0;
  background-color: var(--f-bg-th);
  border-bottom: 1px solid var(--f-border);
  z-index: 1;
}

.catalog-th-select {
  width: 40px;
  padding: 8px;
  text-align: center;
}

.catalog-th-left {
  padding: 8px;
  text-align: left;
}

.catalog-tr {
  border-bottom: 1px solid var(--f-border);
  background-color: transparent;
  transition: background-color 0.15s ease;
}

.catalog-tr.selected {
  background-color: var(--f-selected-bg);
}

.catalog-td-center {
  padding: 8px;
  text-align: center;
}

.catalog-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.catalog-td-code {
  padding: 8px;
  font-weight: 600;
}

.catalog-td-brand {
  padding: 8px;
}

.catalog-td-model {
  padding: 8px;
  color: var(--f-text-muted);
}

.cart-section {
  margin-bottom: 25px;
}

.cart-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--f-text-normal);
  margin-bottom: 10px;
}

.cart-table-wrapper {
  border: 1px solid var(--f-border);
  border-radius: 6px;
  overflow: hidden;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.cart-table-thead {
  background-color: var(--f-bg-th);
  border-bottom: 1px solid var(--f-border);
}

.cart-th-code {
  padding: 10px;
  text-align: left;
  width: 120px;
}

.cart-th-model {
  padding: 10px;
  text-align: left;
}

.cart-th-photo {
  padding: 10px;
  text-align: left;
  width: 300px;
}

.cart-tr {
  border-bottom: 1px solid var(--f-border);
}

.cart-td-code {
  padding: 10px;
  font-weight: 600;
}

.cart-td-model {
  padding: 10px;
  color: var(--f-text-muted);
}

.cart-td-photo {
  padding: 10px;
}

.cart-file-input {
  font-size: 12px;
}

.cart-attached-indicator {
  font-size: 11px;
  color: var(--f-primary);
  margin-top: 4px;
}

.form-section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--f-text-normal);
  margin-bottom: 12px;
  border-top: 1px solid var(--f-border);
  padding-top: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.rental-submit-btn {
  width: 100%;
  margin-top: 20px;
  height: 48px;
  font-size: 15px;
  font-weight: bold;
  background-color: var(--f-primary);
}

```

---

## File: `src/components/SchedulingTab.tsx`

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { type Asset, type ScheduledCase } from '../types';
import './SchedulingTab.css';

interface SchedulingTabProps {
  assets: Asset[];
  isAdmin: boolean;
  onRefreshAssets: () => void;
}

const API_BASE = "/api/sharepoint/schedule";

export const SchedulingTab: React.FC<SchedulingTabProps> = ({ assets, isAdmin, onRefreshAssets }) => {
  const [schedules, setSchedules] = useState<ScheduledCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<ScheduledCase | null>(null);

  // Search and multi-select states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  
  // Bulk update verification modal state
  const [isBulkTransitionModalOpen, setIsBulkTransitionModalOpen] = useState(false);
  const [bulkTargetStage, setBulkTargetStage] = useState<'active_rental' | 'calibration' | 'ongoing'>('active_rental');
  const [bulkHandoverPic, setBulkHandoverPic] = useState('');
  const [bulkHandoverPhoto, setBulkHandoverPhoto] = useState('');
  const [bulkChecklistVerified, setBulkChecklistVerified] = useState(false);

  // Calibration Cleared Modal state
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [activeClearSchedule, setActiveClearSchedule] = useState<ScheduledCase | null>(null);
  const [clearCalDate, setClearCalDate] = useState(new Date().toISOString().split('T')[0]);
  const [clearFile, setClearFile] = useState<File | null>(null);
  const [clearImageFile, setClearImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Inline Add Case state
  const [inlineAddOption, setInlineAddOption] = useState<'calibration' | 'other_project'>('other_project');
  const [inlineAddDestination, setInlineAddDestination] = useState('');
  const [activeAddingToolCode, setActiveAddingToolCode] = useState<string | null>(null);

  // Form states
  const [formSelectedAssets, setFormSelectedAssets] = useState<string[]>([]);
  const [formProjectCode, setFormProjectCode] = useState('');
  const [relaySteps, setRelaySteps] = useState<Array<{
    option: 'calibration' | 'other_project';
    destination: string;
  }>>([
    { option: 'other_project', destination: '' }
  ]);

  const [formToolCode, setFormToolCode] = useState('');
  const [formStage, setFormStage] = useState<'active_rental' | 'calibration' | 'ongoing'>('active_rental');
  const [formDestination, setFormDestination] = useState('');
  const [formUserEmail, setFormUserEmail] = useState('');
  const [formPmEmail, setFormPmEmail] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [selectedDashboardCaseId, setSelectedDashboardCaseId] = useState('');
  const [formStatus, setFormStatus] = useState<'Scheduled' | 'Pending_Approval' | 'In_Progress' | 'Completed' | 'Delayed'>('Scheduled');
  const [formHandoverPic, setFormHandoverPic] = useState('');
  const [formHandoverPhoto, setFormHandoverPhoto] = useState('');
  const [formChecklistVerified, setFormChecklistVerified] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [bulkPhotoFile, setBulkPhotoFile] = useState<File | null>(null);

  const isOutboundFromCalibration = !!editingCase && editingCase.stage === 'calibration' && (formStage === 'active_rental' || formStage === 'ongoing' || formStatus === 'Completed');
  const isNormalHandover = !!editingCase && editingCase.stage !== 'calibration' && formStage === 'active_rental';
  const showHandoverFields = !!editingCase && (isOutboundFromCalibration || isNormalHandover);

  const dashboardProjects = Object.values(
    assets.reduce<Record<string, {
      caseId: string;
      projectName: string;
      projectCode: string;
      userEmail: string;
      pmEmail: string;
      toolCodes: string[];
    }>>((acc, asset) => {
      const caseId = asset.caseId || '';
      const status = asset.status || asset.Current_Status;
      if (!caseId || (status !== 'Rented' && status !== 'Reserved')) return acc;
      if (!acc[caseId]) {
        acc[caseId] = {
          caseId,
          projectName: asset.projectName || asset.currentLocation || asset.Current_Location || '',
          projectCode: asset.projectCode || '',
          userEmail: asset.userEmail || '',
          pmEmail: asset.pmEmail || '',
          toolCodes: []
        };
      }
      acc[caseId].toolCodes.push(asset.toolCode);
      return acc;
    }, {})
  );

  const applyDashboardProject = (caseId: string) => {
    setSelectedDashboardCaseId(caseId);
    const project = dashboardProjects.find(p => p.caseId === caseId);
    if (!project) return;
    setFormSelectedAssets(project.toolCodes);
    setFormDestination(project.projectName);
    setFormProjectCode(project.projectCode);
    setFormUserEmail(project.userEmail);
    setFormPmEmail(project.pmEmail);
    setRelaySteps([{ option: 'other_project', destination: project.projectName }]);
  };

  const getScheduleProjectName = (schedule: ScheduledCase) => {
    const matchingAsset = assets.find(a => a.toolCode === schedule.toolCode);
    return matchingAsset?.projectName || schedule.destination;
  };

  const sortedEquipmentAssets = [...assets].sort((a, b) => {
    const aSelected = formSelectedAssets.includes(a.toolCode);
    const bSelected = formSelectedAssets.includes(b.toolCode);
    if (aSelected !== bSelected) return aSelected ? -1 : 1;
    return a.toolCode.localeCompare(b.toolCode);
  });

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/list`);
      if (!res.ok) throw new Error("Failed to fetch schedules");
      const dataObj = await res.json();
      const updatedSchedules = dataObj.data || [];
      setSchedules(updatedSchedules);
      // Clean up selected card IDs that may no longer exist
      setSelectedCardIds(prev => prev.filter(id => updatedSchedules.some((s: ScheduledCase) => s.id === id)));
    } catch (err) {
      console.error("Error fetching schedules:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const openCreateModal = () => {
    if (!isAdmin) return;
    setEditingCase(null);
    setFormSelectedAssets([]);
    setSelectedDashboardCaseId('');
    setFormProjectCode('');
    setFormDestination('');
    setFormUserEmail('');
    setFormPmEmail('');
    setFormNotes('');
    setFormStatus('Scheduled');
    setFormHandoverPic('');
    setFormHandoverPhoto('');
    setFormChecklistVerified(false);
    setRelaySteps([
      { option: 'other_project', destination: '' }
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (sc: ScheduledCase) => {
    if (!isAdmin) return;
    setEditingCase(sc);
    setFormToolCode(sc.toolCode);
    setFormStage(sc.stage);
    setFormDestination(sc.destination);
    setFormProjectCode(sc.projectCode || '');
    setFormUserEmail(sc.userEmail);
    setFormPmEmail(sc.pmEmail);
    setFormNotes(sc.notes || '');
    setFormStatus(sc.status);
    setFormHandoverPic(sc.handoverPic || '');
    setFormHandoverPhoto(sc.handoverPhoto || '');
    setFormChecklistVerified(sc.checklistVerified || false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCase(null);
    setPhotoFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (editingCase) {
      const selectedAsset = assets.find(a => a.toolCode === formToolCode);
      const model = selectedAsset ? selectedAsset.model : 'Unknown';

      const isOutboundFromCalibration = editingCase.stage === 'calibration' && (formStage === 'active_rental' || formStage === 'ongoing' || formStatus === 'Completed');
      const isNormalHandover = editingCase.stage !== 'calibration' && formStage === 'active_rental';
      const showHandoverFields = isOutboundFromCalibration || isNormalHandover;

      if (showHandoverFields) {
        if (!formHandoverPic || !formHandoverPic.trim()) {
          alert("Error: Handover PIC Name (인수 확인자) is required.");
          return;
        }
        if (!photoFile && !formHandoverPhoto) {
          alert("Error: Handover Photo (인수 확인 사진) is required. Please upload an image file.");
          return;
        }
        if (!formChecklistVerified) {
          alert("Error: You must check the checklist box to verify physical inspection and safety checklist.");
          return;
        }
      }

      let photoUrl = formHandoverPhoto;
      if (showHandoverFields && photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);
        formData.append("filename", photoFile.name);
        try {
          const uploadRes = await fetch(`/api/sharepoint/upload?filename=${encodeURIComponent(photoFile.name)}`, {
            method: 'POST',
            body: formData
          });
          if (uploadRes.ok) {
            photoUrl = photoFile.name;
          }
        } catch (err) {
          console.error("Photo upload failed:", err);
        }
      }

      const payload = {
        id: editingCase.id,
        toolCode: formToolCode,
        model,
        sequenceOrder: editingCase.sequenceOrder,
        stage: formStage,
        destination: formDestination,
        startDate: '',
        endDate: '',
        status: formStatus,
        userEmail: formUserEmail,
        pmEmail: formPmEmail,
        notes: formNotes,
        projectCode: formProjectCode,
        handoverPic: showHandoverFields ? formHandoverPic : undefined,
        handoverPhoto: showHandoverFields ? photoUrl : undefined,
        checklistVerified: showHandoverFields ? formChecklistVerified : undefined
      };

      try {
        const res = await fetch(`${API_BASE}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to save schedule");
        
        handleCloseModal();
        await fetchSchedules();
        onRefreshAssets(); // refresh main items
      } catch (err) {
        console.error(err);
        alert("Error saving schedule case.");
      }
    } else {
      if (formSelectedAssets.length === 0) {
        alert("Please select at least one tool.");
        return;
      }
      if (relaySteps.length === 0) {
        alert("Please add at least one relay step.");
        return;
      }

      const payloads: any[] = [];
      const timestamp = Date.now().toString().slice(-4);
      
      formSelectedAssets.forEach((toolCode, assetIdx) => {
        const selectedAsset = assets.find(a => a.toolCode === toolCode);
        const model = selectedAsset ? selectedAsset.model : 'Unknown';
        
        const currentLoc = selectedAsset ? (selectedAsset.currentLocation || selectedAsset.Current_Location || '') : '';
        const currentStat = selectedAsset ? (selectedAsset.status || selectedAsset.Current_Status || '') : '';
        
        const isWarehouse = currentLoc === 'Warehouse' || currentLoc === '';
        const isAvailable = currentStat === 'Available';
        
        relaySteps.forEach((step, stepIdx) => {
          const cleanedAsset = toolCode.replace(/[^a-zA-Z0-9]/g, '');
          const id = `SCH-2026-${timestamp}-${assetIdx}-${stepIdx}-${cleanedAsset}`;
          
          let stage: 'active_rental' | 'calibration' | 'ongoing' = 'active_rental';
          let destination = step.destination;
          
          if (step.option === 'calibration') {
            destination = step.destination || 'Calibration Lab';
          }

          if (!isWarehouse) {
            stage = 'active_rental';
          } else {
            if (!isAvailable) {
              stage = 'ongoing';
            } else {
              if (step.option === 'calibration') {
                stage = 'calibration';
              } else {
                stage = 'active_rental';
              }
            }
          }

          payloads.push({
            id,
            toolCode: toolCode,
            model,
            sequenceOrder: stepIdx,
            stage,
            destination,
            startDate: '',
            endDate: '',
            status: 'Scheduled',
            userEmail: formUserEmail,
            pmEmail: formPmEmail,
            notes: formNotes,
            projectCode: formProjectCode,
            handoverPic: undefined,
            handoverPhoto: undefined,
            checklistVerified: undefined
          });
        });
      });

      try {
        const res = await fetch(`${API_BASE}/create-bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloads)
        });
        if (!res.ok) throw new Error("Failed to save schedules");
        
        handleCloseModal();
        await fetchSchedules();
        onRefreshAssets(); // refresh main items
      } catch (err) {
        console.error(err);
        alert("Error saving schedule cases.");
      }
    }
  };

  const handleDelete = async (caseId: string) => {
    if (!isAdmin) return;
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    try {
      const res = await fetch(`${API_BASE}/delete/${caseId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete schedule");
      await fetchSchedules();
      onRefreshAssets();
    } catch (err) {
      console.error(err);
      alert("Error deleting scheduled case.");
    }
  };

  const handleBulkMoveTrigger = (targetStage: 'active_rental' | 'calibration' | 'ongoing') => {
    const selectedSchedules = schedules.filter(s => selectedCardIds.includes(s.id));
    const anyFromCalibration = selectedSchedules.some(s => s.stage === 'calibration');
    const isOutbound = anyFromCalibration && (targetStage === 'active_rental' || targetStage === 'ongoing');
    const isNormalHandover = !anyFromCalibration && targetStage === 'active_rental';
    const requiresHandover = isOutbound || isNormalHandover;

    if (requiresHandover) {
      setBulkTargetStage(targetStage);
      setBulkHandoverPic('');
      setBulkHandoverPhoto('');
      setBulkChecklistVerified(false);
      setBulkPhotoFile(null);
      setIsBulkTransitionModalOpen(true);
    } else {
      executeBulkMove(targetStage);
    }
  };

  const executeBulkMove = async (
    targetStage: 'active_rental' | 'calibration' | 'ongoing',
    handoverPic?: string,
    handoverPhoto?: string,
    checklistVerified?: boolean
  ) => {
    const selectedSchedules = schedules.filter(s => selectedCardIds.includes(s.id));
    const anyFromCalibration = selectedSchedules.some(s => s.stage === 'calibration');
    const isOutbound = anyFromCalibration && (targetStage === 'active_rental' || targetStage === 'ongoing');
    const isNormalHandover = !anyFromCalibration && targetStage === 'active_rental';
    const requiresHandover = isOutbound || isNormalHandover;

    let photoUrl = handoverPhoto;
    if (requiresHandover && bulkPhotoFile) {
      const formData = new FormData();
      formData.append("file", bulkPhotoFile);
      formData.append("filename", bulkPhotoFile.name);
      try {
        const uploadRes = await fetch(`/api/sharepoint/upload?filename=${encodeURIComponent(bulkPhotoFile.name)}`, {
          method: 'POST',
          body: formData
        });
        if (uploadRes.ok) {
          photoUrl = bulkPhotoFile.name;
        }
      } catch (err) {
        console.error("Bulk photo upload failed:", err);
      }
    }

    const payloads = selectedSchedules.map(s => {
      const isCardOutbound = s.stage === 'calibration' && (targetStage === 'active_rental' || targetStage === 'ongoing');
      const isCardNormalHandover = s.stage !== 'calibration' && targetStage === 'active_rental';
      const cardRequiresHandover = isCardOutbound || isCardNormalHandover;

      return {
        ...s,
        stage: targetStage,
        status: targetStage === 'ongoing' ? 'Scheduled' : 'In_Progress',
        handoverPic: cardRequiresHandover ? handoverPic : undefined,
        handoverPhoto: cardRequiresHandover ? photoUrl : undefined,
        checklistVerified: cardRequiresHandover ? checklistVerified : undefined
      };
    });

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/update-bulk`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloads)
      });
      if (!res.ok) throw new Error("Bulk update failed");
      
      setSelectedCardIds([]);
      setIsBulkTransitionModalOpen(false);
      await fetchSchedules();
      onRefreshAssets();
    } catch (err) {
      console.error(err);
      alert("Error performing bulk stage move.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkRelease = async () => {
    if (!confirm(`Are you sure you want to release ${selectedCardIds.length} tools? This will delete their active schedule workflows and return them to Available status.`)) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/delete-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCardIds)
      });
      if (!res.ok) throw new Error("Bulk release failed");
      
      setSelectedCardIds([]);
      await fetchSchedules();
      onRefreshAssets();
    } catch (err) {
      console.error(err);
      alert("Error releasing scheduled tools.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveStage = async (sc: ScheduledCase, nextStage: 'active_rental' | 'calibration' | 'ongoing') => {
    if (!isAdmin) return;
    
    const isOutboundFromCalibration = sc.stage === 'calibration' && (nextStage === 'active_rental' || nextStage === 'ongoing');
    const isNormalHandover = sc.stage !== 'calibration' && nextStage === 'active_rental';
    const isOutbound = isOutboundFromCalibration || isNormalHandover;

    if (!isOutbound) {
      const payload: ScheduledCase = {
        ...sc,
        stage: nextStage,
        handoverPic: undefined,
        handoverPhoto: undefined,
        checklistVerified: undefined
      };
      
      try {
        const res = await fetch(`${API_BASE}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to update card stage");
        await fetchSchedules();
        onRefreshAssets();
      } catch (err) {
        console.error(err);
        alert("Failed to update card stage.");
      }
    } else {
      // Open edit modal with target stage to enforce entering checkout photo/checklist details
      setEditingCase(sc);
      setFormToolCode(sc.toolCode);
      setFormStage(nextStage);
      setFormDestination(sc.destination);
      setFormProjectCode(sc.projectCode || '');
      setFormUserEmail(sc.userEmail);
      setFormPmEmail(sc.pmEmail);
      setFormNotes(sc.notes || '');
      setFormStatus(sc.status);
      setFormHandoverPic(sc.handoverPic || '');
      setFormHandoverPhoto(sc.handoverPhoto || '');
      setFormChecklistVerified(sc.checklistVerified || false);
      setIsModalOpen(true);
    }
  };

  // Sequence-based Conflict Detection Check
  const isConflict = (sc: ScheduledCase) => {
    if (sc.status === 'Completed') return false;
    const sameToolSchedules = schedules.filter(other => 
      other.toolCode === sc.toolCode && 
      other.status !== 'Completed'
    );
    
    // Conflict 1: More than one schedule in progress, pending, or delayed for this tool
    const activeStatuses = ['In_Progress', 'Pending_Approval', 'Delayed'];
    const activeCount = sameToolSchedules.filter(s => activeStatuses.includes(s.status)).length;
    if (activeCount > 1) return true;
    
    // Conflict 2: More than one schedule in the same stage
    const sameStageCount = sameToolSchedules.filter(s => s.stage === sc.stage).length;
    if (sameStageCount > 1) return true;

    // Conflict 3: Duplicate sequence orders
    const seqOrders = sameToolSchedules.map(s => s.sequenceOrder);
    const hasDuplicateSeq = seqOrders.some((val, i) => seqOrders.indexOf(val) !== i);
    if (hasDuplicateSeq) return true;
    
    return false;
  };

  // Inline Add Case Handler
  const handleInlineAddCase = async (e: React.FormEvent, toolCode: string) => {
    e.preventDefault();
    if (!isAdmin) return;

    const selectedAsset = assets.find(a => a.toolCode === toolCode);
    const model = selectedAsset ? selectedAsset.model : 'Unknown';

    let stage: 'active_rental' | 'calibration' | 'ongoing' = 'active_rental';
    let destination = '';

    if (inlineAddOption === 'calibration') {
      destination = 'Calibration Lab';
    } else {
      if (!inlineAddDestination.trim()) {
        alert("Please enter a project name.");
        return;
      }
      destination = inlineAddDestination;
    }

    const currentLoc = selectedAsset ? (selectedAsset.currentLocation || selectedAsset.Current_Location || '') : '';
    const currentStat = selectedAsset ? (selectedAsset.status || selectedAsset.Current_Status || '') : '';
    
    const isWarehouse = currentLoc === 'Warehouse' || currentLoc === '';
    const isAvailable = currentStat === 'Available';

    if (isWarehouse) {
      if (isAvailable) {
        stage = 'active_rental';
      } else {
        stage = 'ongoing';
      }
    } else {
      stage = 'active_rental';
    }

    // Find the next sequenceOrder for this asset
    const assetSchedules = schedules.filter(s => s.toolCode === toolCode);
    const nextSeq = assetSchedules.length > 0 
      ? Math.max(...assetSchedules.map(s => s.sequenceOrder)) + 1 
      : 0;

    const timestamp = Date.now().toString().slice(-4);
    const cleanedAsset = toolCode.replace(/[^a-zA-Z0-9]/g, '');
    const id = `SCH-2026-${timestamp}-${nextSeq}-${cleanedAsset}`;

    const newCase = {
      id,
      toolCode: toolCode,
      model,
      sequenceOrder: nextSeq,
      stage,
      destination,
      startDate: '',
      endDate: '',
      status: 'Scheduled',
      userEmail: formUserEmail || 'admin@ge.com',
      pmEmail: formPmEmail || 'pm@ge.com',
      notes: inlineAddOption === 'calibration' ? 'Scheduled calibration step' : 'Added from Scheduler card'
    };

    try {
      const res = await fetch(`${API_BASE}/create-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([newCase])
      });
      if (!res.ok) throw new Error("Failed to add expected case");
      
      setInlineAddDestination('');
      setActiveAddingToolCode(null);
      await fetchSchedules();
      onRefreshAssets();
    } catch (err) {
      console.error(err);
      alert("Error adding case.");
    }
  };

  // Calibration Cleared Submission Handler
  const handleClearCalibration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClearSchedule || !clearFile || !clearImageFile) {
      alert("Please select both a PDF report file and a Photo/Image file.");
      return;
    }

    const formData = new FormData();
    formData.append("schedule_id", activeClearSchedule.id);
    formData.append("calibration_date", clearCalDate);
    formData.append("pdf_file", clearFile);
    formData.append("image_file", clearImageFile);

    try {
      setIsLoading(true);
      const res = await fetch("/api/sharepoint/calibration/clear", {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to submit calibration files");
      }
      
      setClearModalOpen(false);
      setActiveClearSchedule(null);
      setClearFile(null);
      setClearImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
      
      await fetchSchedules();
      onRefreshAssets();
    } catch (err: any) {
      console.error(err);
      alert(`Error clearing calibration: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRental = async (scheduleId: string) => {
    if (!isAdmin) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/sharepoint/schedule/approve/${scheduleId}`, {
        method: 'POST'
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to approve rental");
      }
      await fetchSchedules();
      onRefreshAssets();
    } catch (err: any) {
      console.error(err);
      alert(`Error approving rental request: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRental = async (scheduleId: string) => {
    if (!isAdmin) return;
    const schedule = schedules.find(s => s.id === scheduleId);
    const reason = window.prompt(
      `Reject reason for ${schedule?.movementType || 'checkout'} request (${schedule?.toolCode || scheduleId}).\nThis message will be sent to the requester by Email and Teams.`,
      ''
    );
    if (reason === null) return;
    if (!reason.trim()) {
      alert('Reject reason is required.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`/api/sharepoint/schedule/reject/${scheduleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to reject request");
      }
      const result = await res.json();
      alert(`❌ Request rejected.\nEmail/Teams message queued for: ${result.notification?.email || 'requester'}\nReason: ${reason.trim()}`);
      setSelectedCardIds(prev => prev.filter(id => id !== scheduleId));
      await fetchSchedules();
      onRefreshAssets();
    } catch (err: any) {
      console.error(err);
      alert(`Error rejecting request: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get all currently visible active schedules based on filters/search
  const getVisibleActiveSchedules = () => {
    const schedulesByAsset: Record<string, ScheduledCase[]> = {};
    schedules.forEach(s => {
      if (!schedulesByAsset[s.toolCode]) {
        schedulesByAsset[s.toolCode] = [];
      }
      schedulesByAsset[s.toolCode].push(s);
    });

    const visibleList: ScheduledCase[] = [];
    Object.keys(schedulesByAsset).forEach(code => {
      const assetScheds = schedulesByAsset[code];
      const activeSched = assetScheds.find(s => s.status !== 'Completed');
      if (!activeSched) return;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const asset = assets.find(a => a.toolCode === code);
        const model = asset ? asset.model : '';
        const matches = 
          (code || '').toLowerCase().includes(term) ||
          (model || '').toLowerCase().includes(term) ||
          (activeSched.destination || '').toLowerCase().includes(term) ||
          (activeSched.projectCode || '').toLowerCase().includes(term) ||
          (activeSched.userEmail || '').toLowerCase().includes(term) ||
          (activeSched.pmEmail || '').toLowerCase().includes(term) ||
          (activeSched.notes || '').toLowerCase().includes(term) ||
          (activeSched.caseId || '').toLowerCase().includes(term) ||
          (activeSched.status || '').toLowerCase().includes(term) ||
          activeSched.id.toLowerCase().includes(term);
        
        if (!matches) return;
      }
      visibleList.push(activeSched);
    });
    return visibleList;
  };

  const handleSelectAll = (stage?: 'active_rental' | 'calibration' | 'ongoing') => {
    const visibleSchedules = getVisibleActiveSchedules().filter(s => !stage || s.stage === stage);
    const visibleIds = visibleSchedules.map(s => s.id);
    if (visibleIds.length === 0) return;
    
    // If all visible ones are already selected, deselect them (선택취소)
    const allVisibleSelected = visibleIds.every(id => selectedCardIds.includes(id));
    
    if (allVisibleSelected) {
      // Remove all visible ids from selection
      setSelectedCardIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      // Add all visible ids to selection (avoiding duplicates)
      setSelectedCardIds(prev => {
        const next = [...prev];
        visibleIds.forEach(id => {
          if (!next.includes(id)) {
            next.push(id);
          }
        });
        return next;
      });
    }
  };

  const getSelectedPendingIds = () => selectedCardIds.filter(id => {
    const card = schedules.find(s => s.id === id);
    return card && card.status === 'Pending_Approval';
  });

  const handleBulkApproveRentals = async () => {
    if (!isAdmin) return;
    const pendingIds = getSelectedPendingIds();

    if (pendingIds.length === 0) {
      alert("No pending approval cards selected.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/approve-bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pendingIds)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to bulk approve rentals");
      }
      const result = await res.json();
      alert(`✅ Bulk approved ${result.count} rental requests successfully!`);
      setSelectedCardIds([]);
      await fetchSchedules();
      onRefreshAssets();
    } catch (err: any) {
      console.error(err);
      alert(`Error bulk approving rentals: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkRejectRentals = async () => {
    if (!isAdmin) return;
    const pendingIds = getSelectedPendingIds();

    if (pendingIds.length === 0) {
      alert("No pending approval cards selected.");
      return;
    }

    const reason = window.prompt(
      `Reject reason for ${pendingIds.length} selected pending request(s).\nThis message will be sent to each requester by Email and Teams.`,
      ''
    );
    if (reason === null) return;
    if (!reason.trim()) {
      alert('Reject reason is required.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/reject-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: pendingIds, reason: reason.trim() })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to bulk reject rentals");
      }
      const result = await res.json();
      const missingText = result.missing?.length ? `\nNot found/skipped: ${result.missing.join(', ')}` : '';
      alert(`❌ Bulk rejected ${result.count ?? pendingIds.length} pending request(s).\nEmail/Teams reason queued: ${reason.trim()}${missingText}`);
      setSelectedCardIds([]);
      await fetchSchedules();
      onRefreshAssets();
    } catch (err: any) {
      console.error(err);
      alert(`Error bulk rejecting rentals: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Kanban view helper columns
  const getStageTitle = (stage: string) => {
    switch (stage) {
      case 'active_rental': return '📢 Active';
      case 'calibration': return '🔬 Calibration';
      case 'ongoing': return '🚚 On Going';
      default: return stage;
    }
  };

  const renderKanban = () => {
    const columns: ('active_rental' | 'calibration' | 'ongoing')[] = 
      ['active_rental', 'calibration', 'ongoing'];

    // Group schedules by asset
    const schedulesByAsset: Record<string, ScheduledCase[]> = {};
    schedules.forEach(s => {
      if (!schedulesByAsset[s.toolCode]) {
        schedulesByAsset[s.toolCode] = [];
      }
      schedulesByAsset[s.toolCode].push(s);
    });

    // Sort schedules by sequenceOrder for each asset
    Object.keys(schedulesByAsset).forEach(code => {
      schedulesByAsset[code].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
    });

    return (
      <div className="kanban-board">
        {columns.map(col => {
          // Filter assets whose ACTIVE schedule (first non-completed schedule) is in this stage
          const colAssets = Object.keys(schedulesByAsset).filter(code => {
            const assetScheds = schedulesByAsset[code];
            const activeSched = assetScheds.find(s => s.status !== 'Completed');
            if (!activeSched) return false;
            if (activeSched.stage !== col) return false;
            
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            const asset = assets.find(a => a.toolCode === code);
            const model = asset ? asset.model : '';
            
            return (
              (code || '').toLowerCase().includes(term) ||
              (model || '').toLowerCase().includes(term) ||
              (activeSched.destination || '').toLowerCase().includes(term) ||
              (activeSched.projectCode || '').toLowerCase().includes(term) ||
              (activeSched.userEmail || '').toLowerCase().includes(term) ||
              (activeSched.pmEmail || '').toLowerCase().includes(term) ||
              (activeSched.notes || '').toLowerCase().includes(term) ||
              (activeSched.caseId || '').toLowerCase().includes(term) ||
              (activeSched.status || '').toLowerCase().includes(term) ||
              activeSched.id.toLowerCase().includes(term)
            );
          });

          return (
            <div key={col} className={`kanban-column ${col}`}>
              <div className="kanban-column-header">
                <h3>{getStageTitle(col)}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                  {isAdmin && colAssets.length > 0 && (
                    <button
                      type="button"
                      className="f-button"
                      onClick={() => handleSelectAll(col)}
                      style={{ padding: '3px 7px', fontSize: '11px', minHeight: 'auto', height: '24px' }}
                    >
                      {colAssets
                        .map(code => schedulesByAsset[code].find(s => s.status !== 'Completed')?.id)
                        .filter(Boolean)
                        .every(id => selectedCardIds.includes(id as string)) ? 'Clear All' : 'Select All'}
                    </button>
                  )}
                  <span className="kanban-count-badge">{colAssets.length}</span>
                </div>
              </div>
              <div 
                className="kanban-column-body"
                onDragOver={(e) => {
                  if (isAdmin) {
                    e.preventDefault();
                    e.currentTarget.classList.add("drag-over");
                  }
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("drag-over");
                }}
                onDrop={(e) => {
                  if (isAdmin) {
                    e.preventDefault();
                    e.currentTarget.classList.remove("drag-over");
                    const activeSchedId = e.dataTransfer.getData("text/plain");
                    const card = schedules.find(s => s.id === activeSchedId);
                    if (card && card.status === 'Pending_Approval') {
                      alert('Approval Pending cards are locked. Approve first, then move.');
                      return;
                    }
                    if (card && card.stage !== col) {
                      handleMoveStage(card, col);
                    }
                  }
                }}
              >
                {colAssets.length > 0 ? (
                  colAssets.map(code => {
                    const assetScheds = schedulesByAsset[code];
                    const activeSched = assetScheds.find(s => s.status !== 'Completed')!;
                    const hasConflict = isConflict(activeSched);
                    const isSelected = selectedCardIds.includes(activeSched.id);
                    const asset = assets.find(a => a.toolCode === code);
                    const serial = asset ? asset.serialNumber : 'Unknown';

                    return (
                      <div 
                        key={code} 
                        draggable={isAdmin && activeSched.status !== 'Pending_Approval'}
                        onDragStart={(e) => {
                          if (isAdmin) {
                            e.dataTransfer.setData("text/plain", activeSched.id);
                            e.currentTarget.classList.add("dragging");
                          }
                        }}
                        onDragEnd={(e) => {
                          e.currentTarget.classList.remove("dragging");
                        }}
                        className={`kanban-card ${activeSched.stage} ${activeSched.status.toLowerCase()} ${hasConflict ? 'conflict-warning' : ''}`}
                        style={{ padding: '16px', borderRadius: '12px' }}
                      >
                        <div className="card-top">
                          {isAdmin && (
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              style={{ marginRight: '8px', cursor: 'pointer', transform: 'scale(1.15)', accentColor: 'var(--f-primary)' }}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCardIds([...selectedCardIds, activeSched.id]);
                                } else {
                                  setSelectedCardIds(selectedCardIds.filter(id => id !== activeSched.id));
                                }
                              }}
                            />
                          )}
                          <span className="card-id" style={{ flex: 1 }}>{activeSched.displayCaseId || activeSched.caseId || activeSched.id}</span>
                          {hasConflict && <span className="warning-pill" style={{ marginRight: '8px' }}>⚠️ Overlap</span>}
                          {isAdmin && (
                            <div className="card-edit-actions">
                              <button onClick={() => openEditModal(activeSched)} title="Edit">✏️</button>
                              <button onClick={() => handleDelete(activeSched.id)} title="Delete Active Case">🗑️</button>
                            </div>
                          )}
                        </div>

                        <h4 className="card-title" style={{ marginTop: '8px', fontSize: '15px' }}>{activeSched.model}</h4>
                        <div style={{ fontSize: '11px', color: 'var(--f-text-muted)', marginBottom: '8px' }}>Code: {code} | SN: {serial}</div>
                        
                        <div className="card-meta" style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', padding: '8px', borderRadius: '6px' }}>
                          {activeSched.movementType === 'return' ? (
                            <>
                              <div>🏢 <strong>Project Name:</strong> {getScheduleProjectName(activeSched)}</div>
                              {activeSched.projectCode && <div>🏷️ <strong>Project Code:</strong> {activeSched.projectCode}</div>}
                            </>
                          ) : (
                            <>
                              {activeSched.projectCode && <div>🏷️ <strong>Project Code:</strong> {activeSched.projectCode}</div>}
                              <div>📍 <strong>Current Destination:</strong> {activeSched.destination}</div>
                            </>
                          )}
                          {activeSched.movementType && <div>🔄 <strong>Request Type:</strong> {activeSched.movementType === 'return' ? 'return request' : activeSched.movementType === 'checkout' ? 'rental request' : activeSched.movementType}</div>}
                          {activeSched.requestedEndDate && <div>📅 <strong>Requested Return Date:</strong> {activeSched.requestedEndDate}</div>}
                          <div>👤 <strong>Renter/User:</strong> {activeSched.userEmail}</div>
                          {activeSched.notes && <div style={{ fontStyle: 'italic', marginTop: '4px' }}>📝 {activeSched.notes}</div>}
                          {activeSched.handoverPhoto && (
                            <div style={{ marginTop: '4px' }}>
                              📷 <strong>{activeSched.status === 'Pending_Approval' ? 'Submitted Photo:' : 'Saved Photo:'}</strong> {activeSched.handoverPhoto}
                              {activeSched.handoverPhotoWebUrl && (
                                <a
                                  href={activeSched.handoverPhotoWebUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="f-button"
                                  style={{ display: 'inline-block', marginLeft: '6px', padding: '2px 6px', fontSize: '10.5px', minHeight: 'auto', height: '22px', lineHeight: '16px' }}
                                >
                                  Open Photo
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Status / Approval UI */}
                        {activeSched.status === 'Pending_Approval' && (
                          <div style={{ marginTop: '8px' }}>
                            <span className="warning-pill" style={{ display: 'inline-block', backgroundColor: '#FFE082', color: '#E65100', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}>
                              ⏳ Pending Approval
                            </span>
                            {isAdmin && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' }}>
                                <button 
                                  onClick={() => handleApproveRental(activeSched.id)}
                                  className="f-button"
                                  style={{ 
                                    width: '100%', 
                                    padding: '4px', 
                                    fontSize: '11.5px', 
                                    minHeight: 'auto', 
                                    height: '28px', 
                                    backgroundColor: '#2E7D32', 
                                    color: 'white', 
                                    border: 'none',
                                    fontWeight: '600',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  ✔️ Approve
                                </button>
                                <button 
                                  onClick={() => handleRejectRental(activeSched.id)}
                                  className="f-button"
                                  style={{ 
                                    width: '100%', 
                                    padding: '4px', 
                                    fontSize: '11.5px', 
                                    minHeight: 'auto', 
                                    height: '28px', 
                                    backgroundColor: '#C62828', 
                                    color: 'white', 
                                    border: 'none',
                                    fontWeight: '600',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  ✖️ Reject
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Stage Selector Dropdown */}
                        {isAdmin && activeSched.status !== 'Pending_Approval' && (
                          <div className="card-stage-selectors" style={{ marginTop: '8px', borderTop: '1px solid var(--f-border)', paddingTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                            <label style={{ fontWeight: 500, color: 'var(--f-text-secondary)' }}>Move to:</label>
                            <select 
                              aria-label={`Change stage for ${activeSched.model}`}
                              value={activeSched.stage} 
                              onChange={(e) => handleMoveStage(activeSched, e.target.value as any)}
                              className="f-input"
                              style={{ width: '130px', padding: '2px 4px', fontSize: '11px', height: '24px', minHeight: 'auto' }}
                            >
                              <option value="active_rental">Active Rental</option>
                              <option value="calibration">Calibration Lab</option>
                              <option value="ongoing">On Going</option>
                            </select>
                          </div>
                        )}

                        {/* Expected lineup sequence list */}
                        <div className="lineup-list" style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--f-border)' }}>
                          <div style={{ fontWeight: 600, fontSize: '11.5px', color: 'var(--f-text-secondary)', marginBottom: '6px' }}>📋 EXPECTED LINEUP</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            {assetScheds.map((s, idx) => {
                              const icon = s.stage === 'active_rental' ? '📢' : s.stage === 'calibration' ? '🔬' : '🚚';
                              const label = s.stage === 'active_rental' ? 'Active' : s.stage === 'calibration' ? 'Calibration' : 'On Going';
                              return (
                                <div key={s.id} style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center', 
                                  fontSize: '11.5px', 
                                  padding: '4px 6px',
                                  borderRadius: '4px',
                                  backgroundColor: s.status === 'Completed' 
                                    ? 'var(--f-bg-th)' 
                                    : s.status === 'In_Progress' 
                                      ? 'var(--f-primary-light)' 
                                      : 'transparent',
                                  borderLeft: s.status === 'In_Progress' 
                                    ? '3px solid var(--f-primary)' 
                                    : 'none',
                                  color: s.status === 'Completed' ? 'var(--f-text-muted)' : 'var(--f-text-primary)',
                                  fontWeight: s.status === 'In_Progress' ? 'bold' : 'normal'
                                }}>
                                  <span style={{ textDecoration: s.status === 'Completed' ? 'line-through' : 'none' }}>
                                    Case {idx + 1}: {icon} {s.destination} ({label})
                                  </span>
                                  {isAdmin && s.status !== 'Completed' && (
                                    <button 
                                      onClick={() => handleDelete(s.id)} 
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'var(--f-error)', padding: '0 2px' }}
                                      title="Delete Step"
                                    >
                                      &times;
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Inline Add Expected Case Form */}
                        {activeAddingToolCode === code ? (
                          <form onSubmit={(e) => handleInlineAddCase(e, code)} style={{ marginTop: '12px', padding: '8px', border: '1px solid var(--f-primary)', borderRadius: '6px', backgroundColor: 'var(--f-bg-white)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '6px' }}>
                              <select 
                                value={inlineAddOption}
                                onChange={(e) => setInlineAddOption(e.target.value as any)}
                                className="f-input"
                                style={{ padding: '4px 6px', fontSize: '11px', height: '26px' }}
                              >
                                <option value="calibration">1. Calibration</option>
                                <option value="other_project">2. Other Project</option>
                              </select>
                              {inlineAddOption === 'other_project' && (
                                <input 
                                  type="text" 
                                  placeholder="Project Name" 
                                  value={inlineAddDestination}
                                  onChange={(e) => setInlineAddDestination(e.target.value)}
                                  className="f-input"
                                  style={{ padding: '4px 6px', fontSize: '11px', height: '26px' }}
                                  required
                                />
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button type="button" onClick={() => setActiveAddingToolCode(null)} className="f-button" style={{ padding: '2px 6px', fontSize: '10px', minHeight: 'auto', height: '22px' }}>Cancel</button>
                              <button type="submit" className="f-button f-button-primary" style={{ padding: '2px 6px', fontSize: '10px', minHeight: 'auto', height: '22px' }}>Confirm</button>
                            </div>
                          </form>
                        ) : (
                          isAdmin && (
                            <button 
                              onClick={() => {
                                setActiveAddingToolCode(code);
                                setInlineAddOption('other_project');
                                setInlineAddDestination('');
                              }}
                              className="f-button"
                              style={{ width: '100%', marginTop: '10px', padding: '4px', fontSize: '11.5px', minHeight: 'auto', height: '26px', border: '1px dashed var(--f-border)' }}
                            >
                              ➕ Add Case Step
                            </button>
                          )
                        )}

                        {/* Cleared Button for Calibration Step */}
                        {(activeSched.stage === 'calibration' || (activeSched.destination && (activeSched.destination.toLowerCase().includes('calibration') || activeSched.destination.toLowerCase().includes('cal') || activeSched.destination.toLowerCase().includes('검교정')))) && isAdmin && (
                          <button 
                            onClick={() => {
                              setActiveClearSchedule(activeSched);
                              setClearCalDate(new Date().toISOString().split('T')[0]);
                              setClearFile(null);
                              setClearModalOpen(true);
                            }}
                            className="f-button"
                            style={{ 
                              width: '100%', 
                              marginTop: '8px', 
                              padding: '6px', 
                              fontSize: '12px', 
                              minHeight: 'auto', 
                              height: '32px', 
                              backgroundColor: '#2E7D32', 
                              color: 'white', 
                              border: 'none',
                              fontWeight: '600',
                              borderRadius: '6px'
                            }}
                          >
                            🔬 Cleared (Upload PDF)
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-column-placeholder">No assets in this stage.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="scheduling-tab-container f-fade-in">
      <div className="tab-control-header">
        <div className="tab-title-section">
          <h2>🗓️ Tool Scheduling</h2>
        </div>

        <div className="tab-actions scheduler-toolbar">
          {/* Keyword Search Input */}
          <div className="search-box-container scheduler-search-box" style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="f-input search-input" 
              style={{ paddingLeft: '32px' }}
              placeholder="🔍 Search schedules..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--f-text-secondary)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                &times;
              </button>
            )}
          </div>

          <div className="scheduler-filter-controls">
            {isAdmin && (
              <>
                <button 
                  type="button"
                  className="f-button scheduler-action-btn scheduler-reject-btn"
                  onClick={handleBulkRejectRentals}
                  disabled={getSelectedPendingIds().length === 0}
                >
                  Reject Selected
                </button>
                <button 
                  type="button"
                  className="f-button scheduler-action-btn scheduler-approve-btn"
                  onClick={handleBulkApproveRentals}
                  disabled={getSelectedPendingIds().length === 0}
                >
                  Approve Selected
                </button>
              </>
            )}
          </div>
          {isAdmin && (
            <button 
              onClick={openCreateModal}
              className="f-button f-button-primary btn-add-schedule scheduler-action-btn"
            >
              Add Schedule Case
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {isAdmin && selectedCardIds.length > 0 && (
        <div className="bulk-actions-bar f-fade-in" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 94, 96, 0.06)',
          border: '1px dashed var(--f-primary)',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: 600, color: 'var(--f-text-primary)', fontSize: '14px' }}>
              Selected {selectedCardIds.length} tool cards
            </span>
            <button 
              className="f-button" 
              style={{ padding: '4px 8px', fontSize: '12px', minHeight: 'auto', height: '26px' }}
              onClick={() => setSelectedCardIds([])}
            >
              Deselect All
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="f-button"
              style={{ backgroundColor: '#2E7D32', color: 'white', minHeight: 'auto', padding: '6px 12px', fontSize: '12px', height: '32px' }}
              onClick={() => handleBulkMoveTrigger('active_rental')}
            >
              📢 Move to Active
            </button>
            <button 
              className="f-button"
              style={{ backgroundColor: '#EF6C00', color: 'white', minHeight: 'auto', padding: '6px 12px', fontSize: '12px', height: '32px' }}
              onClick={() => handleBulkMoveTrigger('calibration')}
            >
              🔬 Move to Calibration
            </button>
            <button 
              className="f-button"
              style={{ backgroundColor: '#1565C0', color: 'white', minHeight: 'auto', padding: '6px 12px', fontSize: '12px', height: '32px' }}
              onClick={() => handleBulkMoveTrigger('ongoing')}
            >
              🚚 Move to On Going
            </button>
            <button 
              className="f-button"
              style={{ backgroundColor: '#D32F2F', color: 'white', minHeight: 'auto', padding: '6px 12px', fontSize: '12px', height: '32px' }}
              onClick={handleBulkRelease}
            >
              🔓 Release Tools (Delete)
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading tool schedules...</div>
      ) : (
        renderKanban()
      )}

      {/* BULK TRANSITION VERIFICATION MODAL */}
      {isBulkTransitionModalOpen && (
        <div className="modal-overlay">
          <div className="f-card modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3>📋 Bulk Handover Verification</h3>
              <button className="modal-close" onClick={() => setIsBulkTransitionModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              executeBulkMove(bulkTargetStage, bulkHandoverPic, bulkHandoverPhoto, bulkChecklistVerified);
            }}>
              <div className="modal-scrollable-body" style={{ padding: '16px' }}>
                <p style={{ fontSize: '13px', color: 'var(--f-text-secondary)', marginBottom: '16px' }}>
                  You are transitioning <strong>{selectedCardIds.length}</strong> items to <strong>Active Rental</strong> in bulk.
                </p>
                
                <div className="f-form-group">
                  <label className="f-label">Handover PIC Name</label>
                  <input 
                    type="text" 
                    className="f-input"
                    value={bulkHandoverPic}
                    onChange={(e) => setBulkHandoverPic(e.target.value)}
                    required
                    placeholder="e.g. John Doe"
                  />
                </div>
                
                <div className="f-form-group">
                  <label className="f-label">Upload Handover Photo (Required)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="f-input"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setBulkPhotoFile(file);
                        setBulkHandoverPhoto(file.name);
                      }
                    }}
                    required={!bulkHandoverPhoto}
                    style={{ padding: '4px' }}
                  />
                  {bulkHandoverPhoto && (
                    <div style={{ fontSize: '11px', color: 'var(--f-success)', marginTop: '4px' }}>
                      ✓ Selected: {bulkHandoverPhoto}
                    </div>
                  )}
                </div>
                
                <div className="f-form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                  <input 
                    type="checkbox"
                    id="bulkChecklistVerified"
                    checked={bulkChecklistVerified}
                    onChange={(e) => setBulkChecklistVerified(e.target.checked)}
                    required
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="bulkChecklistVerified" className="f-label" style={{ margin: 0, cursor: 'pointer', fontSize: '12px', color: 'var(--f-text-primary)' }}>
                    Confirm physical inspection complete & safety checklist verified
                  </label>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="f-button" onClick={() => setIsBulkTransitionModalOpen(false)}>Cancel</button>
                <button type="submit" className="f-button f-button-primary">Confirm & Transition</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="f-card modal-content">
            <div className="modal-header">
              <h3>{editingCase ? '✏️ Edit Scheduling Case' : '➕ Register New Scheduling Case'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-scrollable-body">
                {editingCase ? (
                  // EDIT MODE
                  <>
                    <div className="f-form-group">
                      <label className="f-label">Select Equipment</label>
                      <select 
                        className="f-input"
                        value={formToolCode} 
                        onChange={(e) => setFormToolCode(e.target.value)}
                        required
                      >
                        {assets.map(a => (
                          <option key={a.toolCode} value={a.toolCode}>
                            ({a.model} _ {a.serialNumber || 'N/A'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="f-form-group">
                        <label className="f-label">Pipeline Stage</label>
                        <select 
                          className="f-input"
                          value={formStage} 
                          onChange={(e) => setFormStage(e.target.value as any)}
                        >
                          <option value="active_rental">Active Rental</option>
                          <option value="calibration">Calibration Lab</option>
                          <option value="ongoing">On Going</option>
                        </select>
                      </div>
                      
                      <div className="f-form-group">
                        <label className="f-label">Case Status</label>
                        <select 
                          className="f-input"
                          value={formStatus} 
                          onChange={(e) => setFormStatus(e.target.value as any)}
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Pending_Approval">Pending Approval</option>
                          <option value="In_Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Delayed">Delayed</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="f-form-group">
                        <label className="f-label">Destination (Project/Lab)</label>
                        <input 
                          type="text" 
                          className="f-input"
                          value={formDestination}
                          onChange={(e) => setFormDestination(e.target.value)}
                          required
                          placeholder="e.g. Samsung Austin Site or Fluke Cal Yard"
                        />
                      </div>
                      <div className="f-form-group">
                        <label className="f-label">Project Code</label>
                        <input 
                          type="text" 
                          className="f-input"
                          value={formProjectCode}
                          onChange={(e) => setFormProjectCode(e.target.value)}
                          placeholder="e.g. SEC-A1"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="f-form-group">
                        <label className="f-label">Renter / Lab Specialist Email</label>
                        <input 
                          type="email" 
                          className="f-input"
                          value={formUserEmail}
                          onChange={(e) => setFormUserEmail(e.target.value)}
                          required
                          placeholder="user@ge.com"
                        />
                      </div>
                      
                      <div className="f-form-group">
                        <label className="f-label">Approver PM Email</label>
                        <input 
                          type="email" 
                          className="f-input"
                          value={formPmEmail}
                          onChange={(e) => setFormPmEmail(e.target.value)}
                          required
                          placeholder="pm@ge.com"
                        />
                      </div>
                    </div>

                    {/* Handover / Calibration Data Enforcement Section */}
                    {showHandoverFields && (
                      <div className="handover-enforcement-section f-card" style={{ padding: '12px', marginBottom: '15px', backgroundColor: 'var(--f-bg-secondary)', border: '1px solid var(--f-border)', borderRadius: '4px' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--f-text-primary)', fontWeight: 600 }}>
                          📋 Handover Record Required Fields
                        </h4>
                        <div className="form-row" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                          <div className="f-form-group" style={{ flex: 1 }}>
                            <label className="f-label" style={{ fontSize: '11px', color: 'var(--f-text-secondary)' }}>Handover PIC Name</label>
                            <input 
                              type="text" 
                              className="f-input"
                              value={formHandoverPic}
                              onChange={(e) => setFormHandoverPic(e.target.value)}
                              required
                              placeholder="e.g. John Doe"
                            />
                          </div>
                          <div className="f-form-group" style={{ flex: 1 }}>
                            <label className="f-label" style={{ fontSize: '11px', color: 'var(--f-text-secondary)' }}>Upload Handover Photo (Required)</label>
                            <input 
                              type="file" 
                              accept="image/*"
                              className="f-input"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setPhotoFile(file);
                                  setFormHandoverPhoto(file.name);
                                }
                              }}
                              required={!formHandoverPhoto}
                              style={{ padding: '4px' }}
                            />
                            {formHandoverPhoto && (
                              <div style={{ fontSize: '11px', color: 'var(--f-success)', marginTop: '4px' }}>
                                ✓ Selected: {formHandoverPhoto}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="f-form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                          <input 
                            type="checkbox"
                            id="checklistVerified"
                            checked={formChecklistVerified}
                            onChange={(e) => setFormChecklistVerified(e.target.checked)}
                            required
                            style={{ cursor: 'pointer' }}
                          />
                          <label htmlFor="checklistVerified" className="f-label" style={{ margin: 0, cursor: 'pointer', fontSize: '11px', color: 'var(--f-text-primary)' }}>
                            Confirm physical inspection complete & safety checklist verified
                          </label>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // CREATE MODE
                  <>
                    <div className="f-form-group">
                      <label className="f-label" htmlFor="dashboard-project-select">Dashboard Project</label>
                      <select
                        id="dashboard-project-select"
                        className="f-input"
                        value={selectedDashboardCaseId}
                        onChange={(e) => applyDashboardProject(e.target.value)}
                      >
                        <option value="">⌄ Select existing dashboard project...</option>
                        {dashboardProjects.map(project => (
                          <option key={project.caseId} value={project.caseId}>
                            {project.projectName || 'Unnamed Project'} · {project.projectCode || 'No Code'} · {project.caseId}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="f-form-group">
                      <label className="f-label">Select Equipment (Select Multiple)</label>
                      <div className="asset-checkbox-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--f-border)', padding: '8px', borderRadius: '4px' }}>
                        {sortedEquipmentAssets.map(a => {
                          const isChecked = formSelectedAssets.includes(a.toolCode);
                          return (
                            <label key={a.toolCode} data-testid="schedule-equipment-option" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', color: 'var(--f-text-primary)' }}>
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormSelectedAssets([...formSelectedAssets, a.toolCode]);
                                  } else {
                                    setFormSelectedAssets(formSelectedAssets.filter(code => code !== a.toolCode));
                                  }
                                }}
                              />
                              <span>({a.model} _ {a.serialNumber || 'N/A'})</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="f-form-group">
                        <label className="f-label">Project Name</label>
                        <input 
                          type="text" 
                          className="f-input"
                          value={formDestination}
                          onChange={(e) => {
                            setFormDestination(e.target.value);
                            // Auto-populate first step destination if empty
                            if (relaySteps.length === 1 && relaySteps[0].destination === '') {
                              const updated = [...relaySteps];
                              updated[0].destination = e.target.value;
                              setRelaySteps(updated);
                            }
                          }}
                          required
                          placeholder="e.g. Samsung Austin Site"
                        />
                      </div>
                      <div className="f-form-group">
                        <label className="f-label">Project Code</label>
                        <input 
                          type="text" 
                          className="f-input"
                          value={formProjectCode}
                          onChange={(e) => setFormProjectCode(e.target.value)}
                          required
                          placeholder="e.g. SEC-A1"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="f-form-group">
                        <label className="f-label">User Email</label>
                        <input 
                          type="email" 
                          className="f-input"
                          value={formUserEmail}
                          onChange={(e) => setFormUserEmail(e.target.value)}
                          required
                          placeholder="user@ge.com"
                        />
                      </div>
                      <div className="f-form-group">
                        <label className="f-label">PM Email</label>
                        <input 
                          type="email" 
                          className="f-input"
                          value={formPmEmail}
                          onChange={(e) => setFormPmEmail(e.target.value)}
                          required
                          placeholder="pm@ge.com"
                        />
                      </div>
                    </div>

                    {/* Relay Schedules */}
                    <div className="relay-schedules-section" style={{ marginTop: '16px', borderTop: '1px solid var(--f-border)', paddingTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--f-text-primary)', fontWeight: 600 }}>🔄 Relay Scheduling Flow</h4>
                        <button 
                          type="button" 
                          className="f-button" 
                          style={{ padding: '4px 8px', fontSize: '11px', minHeight: 'auto', height: '24px' }}
                          onClick={() => setRelaySteps([...relaySteps, { option: 'other_project', destination: '' }])}
                        >
                          ➕ Add Relay Step
                        </button>
                      </div>

                      {relaySteps.map((step, index) => (
                        <div key={index} className="relay-step-card" style={{ padding: '12px', border: '1px solid var(--f-border)', borderRadius: '4px', marginBottom: '10px', backgroundColor: 'var(--f-bg-secondary)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '12px', color: 'var(--f-text-primary)' }}>Schedule {index + 1}</strong>
                            {relaySteps.length > 1 && (
                              <button 
                                type="button" 
                                style={{ background: 'transparent', border: 'none', color: 'var(--f-error)', cursor: 'pointer', fontSize: '11px' }}
                                onClick={() => setRelaySteps(relaySteps.filter((_, i) => i !== index))}
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="form-row" style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                            <div className="f-form-group" style={{ flex: 1, marginBottom: 0 }}>
                              <label className="f-label" style={{ fontSize: '11px' }}>Option</label>
                              <select 
                                className="f-input"
                                style={{ padding: '6px 10px', fontSize: '13px' }}
                                value={step.option}
                                onChange={(e) => {
                                  const updated = [...relaySteps];
                                  const val = e.target.value as 'calibration' | 'other_project';
                                  updated[index].option = val;
                                  if (val === 'calibration') {
                                    updated[index].destination = 'Calibration Lab';
                                  } else {
                                    updated[index].destination = '';
                                  }
                                  setRelaySteps(updated);
                                }}
                              >
                                <option value="calibration">1. Calibration</option>
                                <option value="other_project">2. Other Project</option>
                              </select>
                            </div>
                            {step.option === 'other_project' && (
                              <div className="f-form-group" style={{ flex: 1, marginBottom: 0 }}>
                                <label className="f-label" style={{ fontSize: '11px' }}>Project Name</label>
                                <input 
                                  type="text" 
                                  className="f-input"
                                  style={{ padding: '6px 10px', fontSize: '13px' }}
                                  value={step.destination}
                                  onChange={(e) => {
                                    const updated = [...relaySteps];
                                    updated[index].destination = e.target.value;
                                    setRelaySteps(updated);
                                  }}
                                  required
                                  placeholder="Enter project name..."
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {editingCase && (
                  <div className="f-form-group" style={{ marginTop: '15px' }}>
                    <label className="f-label">Notes & Routing Instructions</label>
                    <textarea 
                      className="f-input"
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="Special instructions for handover calibration or delivery..."
                      rows={3}
                    />
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="f-button" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="f-button f-button-primary">
                  {editingCase ? 'Save Changes' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CALIBRATION CLEARED (PDF UPLOAD) MODAL */}
      {clearModalOpen && activeClearSchedule && (
        <div className="modal-overlay">
          <div className="f-card modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3>🔬 Submit Calibration Certificate & Photo</h3>
              <button className="modal-close" onClick={() => { setClearModalOpen(false); setActiveClearSchedule(null); setClearFile(null); setClearImageFile(null); }}>&times;</button>
            </div>
            
            <form onSubmit={handleClearCalibration}>
              <div className="modal-scrollable-body" style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--f-bg-secondary)', borderRadius: '6px', border: '1px solid var(--f-border)', fontSize: '13px' }}>
                  <strong>Asset:</strong> {activeClearSchedule.model} ({activeClearSchedule.toolCode})<br />
                  <strong>Current Destination:</strong> {activeClearSchedule.destination}
                </div>

                <div className="f-form-group">
                  <label className="f-label">Calibration Date</label>
                  <input 
                    type="date"
                    className="f-input"
                    value={clearCalDate}
                    onChange={(e) => setClearCalDate(e.target.value)}
                    required
                  />
                </div>

                <div className="f-form-group">
                  <label className="f-label">Upload Certificate (PDF Only)</label>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf"
                    className="f-input"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setClearFile(e.target.files[0]);
                      }
                    }}
                    required
                  />
                </div>

                <div className="f-form-group" style={{ marginTop: '12px' }}>
                  <label className="f-label">Upload Calibration Photo (Image Only)</label>
                  <input 
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    className="f-input"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setClearImageFile(e.target.files[0]);
                      }
                    }}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="f-button" onClick={() => { setClearModalOpen(false); setActiveClearSchedule(null); setClearFile(null); setClearImageFile(null); }}>Cancel</button>
                <button type="submit" className="f-button f-button-primary" style={{ backgroundColor: 'var(--f-success)', borderColor: 'var(--f-success)' }}>
                  Submit & Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

```

---

## File: `src/components/SchedulingTab.css`

```css
.scheduling-tab-container {
  width: 100%;
  animation: f-fadeIn 0.3s ease-in-out;
}

.tab-control-header {
  display: grid;
  grid-template-columns: minmax(170px, auto) minmax(0, 1fr);
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.tab-title-section h2 {
  margin: 0;
  font-size: clamp(18px, 2.2vw, 24px);
  line-height: 1.15;
  white-space: nowrap;
}

.tab-description {
  display: none;
}

.tab-actions,
.scheduler-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
  flex-wrap: wrap;
}

.scheduler-search-box {
  flex: 1 1 220px;
  min-width: 180px;
  max-width: 320px;
}

.scheduler-search-box .search-input {
  width: 100%;
  min-width: 0;
  height: 34px;
  font-size: 12px;
}

.scheduler-filter-controls {
  display: flex;
  gap: 6px;
  flex: 0 1 auto;
  min-width: 0;
}

.scheduler-action-btn {
  height: 34px;
  min-height: 34px;
  padding: 0 10px;
  font-size: 12px;
  line-height: 1;
  border-radius: 7px;
  white-space: nowrap;
}

.scheduler-action-secondary {
  border: 1px solid var(--f-border);
}

.scheduler-approve-btn {
  background-color: #2E7D32;
  color: white;
  border: none;
  font-weight: 600;
}

.scheduler-reject-btn {
  background-color: #C62828;
  color: white;
  border: none;
  font-weight: 600;
}

.scheduler-approve-btn:disabled,
.scheduler-reject-btn:disabled {
  opacity: 0.55;
}

@media (max-width: 768px) {
  .tab-control-header {
    grid-template-columns: 1fr;
    align-items: stretch;
    gap: 8px;
    margin-bottom: 12px;
  }

  .tab-title-section h2 {
    font-size: 18px;
  }

  .tab-actions,
  .scheduler-toolbar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    width: 100%;
  }

  .scheduler-search-box {
    grid-column: 1 / -1;
    max-width: none;
    min-width: 0;
  }

  .scheduler-filter-controls {
    display: contents;
  }

  .scheduler-action-btn {
    width: 100%;
    height: 32px;
    min-height: 32px;
    padding: 0 7px;
    font-size: 11px;
  }

  .btn-add-schedule {
    grid-column: 1 / -1;
  }
}

@media (min-width: 769px) and (max-width: 1100px) {
  .tab-control-header {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .tab-actions,
  .scheduler-toolbar {
    justify-content: flex-start;
  }

  .scheduler-search-box {
    max-width: 100%;
  }
}

.view-mode-toggles {
  display: inline-flex;
  background: var(--f-bg-gray);
  border: 1px solid var(--f-border);
  border-radius: 6px;
  padding: 2px;
}

.view-mode-toggles .f-button {
  background: transparent;
  border: none;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 4px;
}

.view-mode-toggles .f-button.active {
  background: var(--f-bg-white);
  color: var(--f-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-weight: 600;
}

.btn-add-schedule {
  white-space: nowrap;
}

/* Kanban Board Styling */
.kanban-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .kanban-board {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.kanban-column {
  background: var(--f-card-accent-bg);
  border: 1px solid var(--f-card-accent-border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  min-height: 450px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

@media (max-width: 768px) {
  .kanban-column {
    min-height: auto;
    border-width: 2px;
  }
}

.kanban-column.active_rental {
  border: 2px solid rgba(30, 136, 229, 0.45);
  border-top: 6px solid #1E88E5;
  background-color: rgba(30, 136, 229, 0.05);
}
.kanban-column.active_rental .kanban-column-header {
  background-color: rgba(30, 136, 229, 0.12);
  border-bottom: 1px solid rgba(30, 136, 229, 0.25);
}
.kanban-column.active_rental .kanban-column-header h3 {
  color: #1565C0;
}
.kanban-column.active_rental .kanban-card {
  border-left: 5px solid #1E88E5 !important;
}

.kanban-column.calibration {
  border: 2px solid rgba(216, 27, 96, 0.45);
  border-top: 6px solid #D81B60;
  background-color: rgba(216, 27, 96, 0.05);
}
.kanban-column.calibration .kanban-column-header {
  background-color: rgba(216, 27, 96, 0.12);
  border-bottom: 1px solid rgba(216, 27, 96, 0.25);
}
.kanban-column.calibration .kanban-column-header h3 {
  color: #C2185B;
}
.kanban-column.calibration .kanban-card {
  border-left: 5px solid #D81B60 !important;
}

.kanban-column.ongoing {
  border: 2px solid rgba(67, 160, 71, 0.45);
  border-top: 6px solid #43A047;
  background-color: rgba(67, 160, 71, 0.05);
}
.kanban-column.ongoing .kanban-column-header {
  background-color: rgba(67, 160, 71, 0.12);
  border-bottom: 1px solid rgba(67, 160, 71, 0.25);
}
.kanban-column.ongoing .kanban-column-header h3 {
  color: #2E7D32;
}
.kanban-column.ongoing .kanban-card {
  border-left: 5px solid #43A047 !important;
}

.kanban-column-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--f-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0,0,0,0.02);
}

:root[data-theme="dark"] .kanban-column-header {
  background: rgba(255,255,255,0.02);
}

.kanban-column-header h3 {
  font-size: 14px;
  font-weight: 700;
}

.kanban-count-badge {
  background: var(--f-border);
  color: var(--f-text);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
}

.kanban-column-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
}

.empty-column-placeholder {
  color: var(--f-text-secondary);
  font-size: 13px;
  text-align: center;
  padding: 20px 0;
  border: 1px dashed var(--f-border-dashed);
  border-radius: 6px;
}

/* Kanban Cards */
.kanban-card {
  background: var(--f-bg-white);
  border: 1px solid var(--f-border);
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.kanban-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--f-shadow);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-id {
  font-size: 11px;
  font-family: monospace;
  color: var(--f-text-muted);
  background: var(--f-bg-gray);
  padding: 1px 4px;
  border-radius: 3px;
}

.warning-pill {
  background: #FFE0B2;
  color: #E65100;
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  animation: pulse-border 1.5s infinite alternate;
}

.card-edit-actions {
  display: flex;
  gap: 4px;
}

.card-edit-actions button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px;
  font-size: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
}

.card-meta {
  font-size: 12px;
  color: var(--f-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.card-notes {
  font-size: 11px;
  background: var(--f-bg-gray);
  border-left: 2px solid var(--f-primary);
  padding: 4px 8px;
  border-radius: 0 4px 4px 0;
  color: var(--f-text-normal);
}

.card-stage-selectors {
  margin-top: 8px;
  border-top: 1px solid var(--f-border);
  padding-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
}

.card-stage-selectors label {
  color: var(--f-text-secondary);
}

.f-input-small {
  padding: 2px 4px;
  font-size: 11px;
  border-radius: 4px;
  border: 1px solid var(--f-border);
  background: var(--f-bg-white);
  color: var(--f-text);
}

/* Conflict styling & pulse animations */
.conflict-warning {
  border-left: 4px solid var(--f-error) !important;
  box-shadow: 0 0 6px rgba(209, 17, 10, 0.2);
}

@keyframes pulse-border {
  from {
    box-shadow: 0 0 0px rgba(230, 81, 0, 0.4);
  }
  to {
    box-shadow: 0 0 8px rgba(230, 81, 0, 0.8);
  }
}

/* Gantt Chart Styling */
.gantt-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 30px;
}

.gantt-timeline-header {
  display: flex;
  background: var(--f-bg-th);
  border-bottom: 1px solid var(--f-border);
  font-weight: 600;
  font-size: 12px;
}

.gantt-asset-col-header {
  width: 180px;
  min-width: 180px;
  padding: 12px;
  border-right: 1px solid var(--f-border);
  display: flex;
  align-items: center;
}

.gantt-days-scroll-wrapper {
  flex: 1;
  overflow-x: auto;
}

.gantt-days-header-grid {
  display: grid;
  grid-template-columns: repeat(10, 140px);
  min-width: 1400px;
}

.gantt-day-header-cell {
  border-right: 1px solid var(--f-border);
  padding: 8px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.gantt-day-header-cell .day-number {
  font-weight: 700;
}

.gantt-day-header-cell .day-month-short {
  font-size: 9px;
  text-transform: uppercase;
  color: var(--f-text-secondary);
}

.gantt-timeline-rows {
  background: var(--f-bg-white);
}

.gantt-row {
  display: flex;
  border-bottom: 1px solid var(--f-border);
}

.gantt-asset-col {
  width: 180px;
  min-width: 180px;
  padding: 12px;
  border-right: 1px solid var(--f-border);
  background: var(--f-bg-white);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.gantt-asset-col .asset-title {
  font-weight: 600;
  font-size: 13px;
}

.gantt-asset-col .asset-sub {
  font-size: 11px;
  color: var(--f-text-muted);
}

.gantt-days-row-grid {
  display: grid;
  grid-template-columns: repeat(10, 140px);
  grid-template-rows: 40px;
  min-width: 1400px;
  position: relative;
}

.gantt-bg-cell {
  border-right: 1px solid var(--f-border);
  height: 100%;
}

.gantt-schedule-bar {
  height: 28px;
  margin-top: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  cursor: pointer;
  z-index: 10;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  transition: transform 0.1s;
}

.gantt-schedule-bar:hover {
  transform: scaleY(1.08);
}

.gantt-schedule-bar.active_rental {
  background: linear-gradient(135deg, #005E60 0%, #008D90 100%);
}

.gantt-schedule-bar.calibration {
  background: linear-gradient(135deg, #E65100 0%, #FF8F00 100%);
}

.gantt-schedule-bar.ongoing {
  background: linear-gradient(135deg, #0D47A1 0%, #1976D2 100%);
}

.bar-conflict {
  border: 2px solid var(--f-error) !important;
  animation: pulse-border 1.5s infinite alternate;
}

/* Drag and Drop interactive states */
.kanban-card.dragging {
  opacity: 0.4;
  border: 2px dashed var(--f-primary) !important;
  transform: scale(0.98);
}

.kanban-column-body.drag-over {
  background: rgba(0, 94, 96, 0.08) !important;
  border: 2px dashed var(--f-primary);
  transition: background-color 0.2s ease;
}

.bar-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Modal overlays */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  width: 560px;
  max-width: 95%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: var(--f-bg-white);
  border: 1px solid var(--f-border);
  box-shadow: var(--f-shadow);
  border-radius: 8px;
  animation: modal-slide-in 0.2s ease-out;
  overflow: hidden;
}

.modal-content form {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.modal-scrollable-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

@keyframes modal-slide-in {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--f-border);
  padding-bottom: 12px;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--f-text-secondary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  border-top: 1px solid var(--f-border);
  padding-top: 16px;
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-row .f-form-group {
  flex: 1;
}

/* Generic utility definitions for compatibility */
.f-form-group {
  margin-bottom: 16px;
}

.f-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--f-text);
}

.f-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--f-border);
  border-radius: 4px;
  background: var(--f-bg-white);
  color: var(--f-text);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.f-input:focus {
  border-color: var(--f-primary);
}

textarea.f-input {
  resize: vertical;
}

.search-box-container::before {
  content: "🔍";
  position: absolute;
  left: 10px;
  top: 52%;
  transform: translateY(-50%);
  font-size: 13px;
  pointer-events: none;
  opacity: 0.6;
}

.bulk-actions-bar {
  animation: slide-down 0.2s ease-out;
  box-shadow: 0 4px 12px rgba(0, 94, 96, 0.12);
}

@keyframes slide-down {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Card stage-specific borders and background colors */
.kanban-card.active_rental {
  border: 1px solid rgba(30, 136, 229, 0.35) !important;
  border-left: 5px solid #1E88E5 !important;
  background: var(--f-bg-white);
}
.kanban-card.calibration {
  border: 1px solid rgba(216, 27, 96, 0.35) !important;
  border-left: 5px solid #D81B60 !important;
  background: var(--f-bg-white);
}
.kanban-card.ongoing {
  border: 1px solid rgba(67, 160, 71, 0.35) !important;
  border-left: 5px solid #43A047 !important;
  background: var(--f-bg-white);
}

/* Card status specific styling */
.kanban-card.delayed {
  border: 1px solid #EF6C00 !important;
  border-left: 5px solid #EF6C00 !important;
  background-color: #FFF3E0 !important;
}
.kanban-card.pending_approval {
  border: 1px solid #FBC02D !important;
  border-left: 5px solid #FBC02D !important;
  background-color: #FFFDE7 !important;
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .kanban-board {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 8px;
  }
  
  .kanban-column {
    min-height: auto;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  
  .kanban-column-body {
    padding: 8px;
    gap: 8px;
  }
  
  .kanban-card {
    padding: 10px !important;
    gap: 6px;
  }
  
  .card-top {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .card-title {
    font-size: 13px !important;
    margin-top: 4px !important;
  }
  
  .card-meta {
    font-size: 11px !important;
    padding: 6px !important;
  }
  
  .card-stage-selectors select {
    width: 100% !important;
    margin-top: 4px;
  }
  
  .card-stage-selectors {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 4px;
  }
}


```

---

