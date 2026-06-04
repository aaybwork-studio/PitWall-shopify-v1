#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy-theme.sh — PITWALL Shopify Theme Deploy
#
# Usage (from main branch):  bash deploy-theme.sh
#
# Pipeline:
#   1. Runs `npm run build` (Vite compiles src/ → assets/)
#   2. Stages clean Liquid + compiled asset files into a temp dir
#   3. Copies .github/workflows/shopify-deploy.yml into the temp dir
#      so the GitHub Action stays alive on shopify-theme-release
#   4. Force-pushes shopify-theme-release to GitHub
#   5. GitHub Action detects the push → runs `shopify theme push`
#      → changes appear live on pitwall.myshopify.com
#
# One-time GitHub Secrets setup (repo → Settings → Secrets → Actions):
#   SHOPIFY_STORE_URL        = pitwall.myshopify.com
#   SHOPIFY_CLI_THEME_TOKEN  = <Token from Shopify Admin → Apps → Develop apps>
#   SHOPIFY_THEME_ID         = <Numeric ID from Shopify Admin → Online Store → Themes → ⋮ Edit code>
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

RELEASE_BRANCH="shopify-theme-release"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "═══════════════════════════════════════════════════"
echo "  PITWALL // Shopify Theme Deploy"
echo "═══════════════════════════════════════════════════"

# ── Guard: must run from main ────────────────────────────────────────────────
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "❌  Must run from 'main'. Current branch: $CURRENT_BRANCH"
  exit 1
fi

# ── Stash any uncommitted changes ────────────────────────────────────────────
STASHED=0
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "→  Stashing uncommitted changes..."
  git stash push -m "deploy-theme stash [$(date)]"
  STASHED=1
fi

# ── Always restore stash and return to main on exit ──────────────────────────
cleanup() {
  git checkout -f main 2>/dev/null || true
  [[ "$STASHED" == "1" ]] && git stash pop 2>/dev/null || true
}
trap cleanup EXIT

# ── Step 1: Build compiled assets ────────────────────────────────────────────
echo ""
echo "═══ Step 1: Building Vite assets ══════════════════"
npm run build

# ── Step 2: Stage clean theme files ──────────────────────────────────────────
echo ""
echo "═══ Step 2: Staging theme files ═══════════════════"
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"; cleanup' EXIT

for dir in assets config layout locales sections templates; do
  if [[ -d "$dir" ]]; then
    cp -r "$dir" "$TEMP_DIR/"
    echo "  → $dir/"
  fi
done

# Include the GitHub Action so it persists on the release branch
mkdir -p "$TEMP_DIR/.github/workflows"
cp .github/workflows/shopify-deploy.yml "$TEMP_DIR/.github/workflows/shopify-deploy.yml"
echo "  → .github/workflows/shopify-deploy.yml"

for f in shopify_products_import.csv .shopifyignore; do
  [[ -f "$f" ]] && cp "$f" "$TEMP_DIR/" && echo "  → $f"
done

# ── Step 3: Switch to release branch ─────────────────────────────────────────
echo ""
echo "═══ Step 3: Switching to $RELEASE_BRANCH ══════════"
git checkout -B "$RELEASE_BRANCH"

# ── Step 4: Replace all content ──────────────────────────────────────────────
echo ""
echo "═══ Step 4: Replacing branch contents ═════════════"
git rm -rf . --quiet 2>/dev/null || true
cp -r "$TEMP_DIR"/. .

# Minimal .gitignore for release branch (no source files, no large media)
cat > .gitignore << 'EOF'
node_modules/
src/
package.json
package-lock.json
tsconfig.json
vite.config.ts
postcss.config.js
tailwind.config.js
.planning/
.DS_Store
deploy-theme.sh
*.glb
*.mp4
*.mp3
EOF

# ── Step 5: Commit & force-push ───────────────────────────────────────────────
echo ""
echo "═══ Step 5: Committing and pushing ════════════════"
git add -A
if git diff --cached --quiet; then
  echo "  ℹ  Nothing new to commit — theme is already up-to-date."
else
  git commit -m "dist: deploy Shopify theme [$(date '+%Y-%m-%d %H:%M %Z')]"
fi
git push origin "$RELEASE_BRANCH" --force

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅  Pushed! GitHub Action is now deploying to Shopify."
echo "  Track it at:"
echo "  https://github.com/aaybwork-studio/PitWall-shopify-v1/actions"
echo "═══════════════════════════════════════════════════"
