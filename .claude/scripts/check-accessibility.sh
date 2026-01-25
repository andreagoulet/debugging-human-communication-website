#!/bin/bash
# Accessibility checker for Claude PostToolUse hook
# Runs after Edit/Write on web files and reports issues

# Read tool input from stdin
INPUT=$(cat)

# Extract file path from JSON input
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*: *"//' | sed 's/"$//')

# If no file path found, exit silently
if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Only check web files
case "$FILE_PATH" in
    *.astro|*.html|*.tsx|*.jsx)
        ;;
    *)
        exit 0
        ;;
esac

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
    exit 0
fi

ISSUES=""

# Check for images missing alt text
if grep -qE '<img[^>]*>' "$FILE_PATH"; then
    # Find img tags and check if they have alt attribute
    NO_ALT=$(grep -n '<img' "$FILE_PATH" | grep -v 'alt=' || true)
    if [ -n "$NO_ALT" ]; then
        ISSUES="${ISSUES}Missing alt attribute on <img>:\n${NO_ALT}\n\n"
    fi
fi

# Check for low-contrast text colors (teal-800 and lighter)
LOW_CONTRAST=$(grep -nE 'text-teal-(50|100|200|300|400|500|600|700|800)\b' "$FILE_PATH" 2>/dev/null || true)
if [ -n "$LOW_CONTRAST" ]; then
    ISSUES="${ISSUES}Low contrast text color (use teal-950 or teal-900 instead):\n${LOW_CONTRAST}\n\n"
fi

# Check heading hierarchy - look for h3 without h2, h4 without h3, etc.
HEADINGS=$(grep -oE '<h[1-6]' "$FILE_PATH" 2>/dev/null | sed 's/<h//' | sort -n | uniq)
PREV_LEVEL=0
SKIP_ISSUE=""
for LEVEL in $HEADINGS; do
    if [ $PREV_LEVEL -gt 0 ] && [ $((LEVEL - PREV_LEVEL)) -gt 1 ]; then
        SKIP_ISSUE="Heading hierarchy skip: h${PREV_LEVEL} jumps to h${LEVEL} (skipping h$((PREV_LEVEL + 1)))"
        break
    fi
    PREV_LEVEL=$LEVEL
done
if [ -n "$SKIP_ISSUE" ]; then
    ISSUES="${ISSUES}${SKIP_ISSUE}\n\n"
fi

# Check for missing alt on Astro Image components
if grep -qE '<Image[^>]*>' "$FILE_PATH"; then
    NO_ALT_IMAGE=$(grep -n '<Image' "$FILE_PATH" | grep -v 'alt=' || true)
    if [ -n "$NO_ALT_IMAGE" ]; then
        ISSUES="${ISSUES}Missing alt attribute on <Image>:\n${NO_ALT_IMAGE}\n\n"
    fi
fi

# Output issues if any found
if [ -n "$ISSUES" ]; then
    echo "⚠️  ACCESSIBILITY ISSUES DETECTED in $FILE_PATH:"
    echo ""
    echo -e "$ISSUES"
    echo "Please fix these issues before proceeding."
    echo ""
    echo "Reference:"
    echo "- Text contrast: Use teal-950 or teal-900 for text on light backgrounds"
    echo "- Images: Always include descriptive alt text"
    echo "- Headings: Don't skip levels (h1 → h2 → h3)"
fi

exit 0
