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

