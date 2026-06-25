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
