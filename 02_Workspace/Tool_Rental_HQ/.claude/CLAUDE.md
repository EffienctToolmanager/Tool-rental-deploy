# .claude/CLAUDE.md - Unified Agent Process Rules

This file mandates the step-by-step workflow and strict coding prohibitions for all participating agents (**CLAUDE**, **김대표 - Gemini**, and **헤비서 - Hermes**).

---

## 📈 7-Step Development Process

You must strictly execute the development cycle in this sequence. Do not skip any steps:

| Step | Phase | Action | Exit Criteria |
| :--- | :--- | :--- | :--- |
| **1** | **Understand** | Read requirements, analyze Figma layouts, and list goals. | User objectives are clear and documented. |
| **2** | **Analyze** | Check active files, inspect imports, and review design tokens. | Dependency tree and layout patterns mapped. |
| **3** | **Explore** | Probe existing CSS styles and verify current theme variables. | Potential style conflicts identified. |
| **4** | **Plan** | Document target files, specific line modifications, and validation steps in `implementation_plan.md`. | **MANDATORY**: User gives explicit approval to proceed. |
| **5** | **Execute** | Write code, generate components, and apply styles. | Compilation passes with no syntax or lint issues. |
| **6** | **Verify** | Run unit tests, start Storybook dev, and execute `design-qa` checks. | Layout is verified to match specifications. |
| **7** | **Complete** | Document modified parts in `walkthrough.md` and check in files via git. | Code is pushed and staging deploy verified. |

---

## 🛑 Prohibitions & Constraints Table

| Item | Constraint Rule | Rationale | Correct Action |
| :--- | :--- | :--- | :--- |
| **Inline Styling** | Do not write CSS inside JSX styles (e.g. `style={{ color: '#ff0000' }}`). | Breaks design consistency and dark mode compatibility. | Use Tailwind utility classes or custom styles in component CSS. |
| **Hardcoded Colors** | Never use `#fff`, `rgb()`, `hsl()`, or basic tailwind classes like `bg-blue-500` for branding. | Prevents dynamic theme synchronization. | Use `var(--color-*)` or corresponding semantic variables. |
| **Fixed Widths** | Avoid `w-[320px]`, `width: 300px` for top-level component boxes. | Destroys mobile responsiveness. | Use `w-full` combined with parent layout layout bounds and padding. |
| **Variant Invention** | Do not add custom variations not specified in design specs. | Diverges from Figma-to-code alignment. | Limit components to target design states. |
| **Silent Edits** | Never edit files without an approved `implementation_plan.md`. | Leads to unintended bugs and out-of-sync state. | Always wait for user approval after planning. |
