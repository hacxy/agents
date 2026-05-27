#!/usr/bin/env bash
# install.sh — Install agents to ~/.claude/agents/
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="$HOME/.claude/agents"

usage() {
  echo "Usage: $0 [--target <dir>] [--dry-run] [--help]"
  echo ""
  echo "Options:"
  echo "  --target <dir>   Install to custom directory (default: ~/.claude/agents)"
  echo "  --dry-run        Show what would be installed without copying"
  echo "  --help           Show this help"
}

DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) TARGET_DIR="$2"; shift 2 ;;
    --dry-run) DRY_RUN=true; shift ;;
    --help) usage; exit 0 ;;
    *) echo "Unknown option: $1"; usage; exit 1 ;;
  esac
done

echo "📦 Installing agents from: $REPO_DIR"
echo "📁 Target: $TARGET_DIR"
$DRY_RUN && echo "🔍 Dry run mode — no files will be copied"
echo ""

mkdir -p "$TARGET_DIR"

# Clean up stale agent files no longer in repo
if ! $DRY_RUN; then
  while IFS= read -r -d '' existing; do
    name="$(basename "$existing")"
    # Check if this .md file exists anywhere in the repo (excluding template and README)
    if ! find "$REPO_DIR" -name "$name" -not -path "*/.git/*" -not -name "README*" -not -path "*/fullstack-template/*" | grep -q .; then
      rm "$existing"
      echo "  🗑️  removed stale: $name"
    fi
  done < <(find "$TARGET_DIR" -maxdepth 1 -name "*.md" -print0)
fi

count=0
while IFS= read -r -d '' md; do
  if head -1 "$md" | grep -q "^---"; then
    rel="${md#$REPO_DIR/}"
    name="$(basename "$md")"
    if $DRY_RUN; then
      echo "  would install: $rel → $TARGET_DIR/$name"
    else
      cp "$md" "$TARGET_DIR/$name"
      echo "  ✓ $rel → $TARGET_DIR/$name"
    fi
    count=$((count + 1))
  fi
done < <(find "$REPO_DIR" -name "*.md" -not -path "*/.git/*" -not -name "README*" -not -path "*/fullstack-template/*" -print0)

# Install fullstack template
TEMPLATE_SRC="$REPO_DIR/engineering/fullstack-template"
TEMPLATE_DST="$TARGET_DIR/fullstack-template"
if [[ -d "$TEMPLATE_SRC" ]]; then
  if $DRY_RUN; then
    echo "  would install: engineering/fullstack-template/ → $TEMPLATE_DST/"
  else
    rm -rf "$TEMPLATE_DST"
    cp -r "$TEMPLATE_SRC" "$TEMPLATE_DST"
    echo "  ✓ engineering/fullstack-template/ → $TEMPLATE_DST/"
  fi
fi

echo ""
if $DRY_RUN; then
  echo "✅ Dry run complete — $count agents would be installed (+ fullstack-template)"
else
  echo "✅ Installed $count agents + fullstack-template to $TARGET_DIR"
  echo "   Restart Claude Code or run /agents to see them."
fi
