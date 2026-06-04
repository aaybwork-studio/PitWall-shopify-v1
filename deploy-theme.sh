#!/bin/bash
set -e

# Make sure we are on main to start with
git checkout main

echo "=== 1. Building React Assets ==="
npm run build

echo "=== 2. Creating Clean Temp Directory ==="
TEMP_DIR=$(mktemp -d)
# Copy theme-related folders, files, and compiled assets to temp directory
cp -r assets config layout locales sections templates shopify_products_import.csv "$TEMP_DIR"

echo "=== 3. Switching to Release Branch ==="
# Stash any uncommitted work just in case
git stash --keep-index || true
git checkout -B shopify-theme-release

echo "=== 4. Cleaning Directory ==="
# Remove all tracked developer files on this branch
git rm -r --cached . || true
rm -rf *

echo "=== 5. Copying Clean Theme Files ==="
cp -r "$TEMP_DIR"/* .
rm -rf "$TEMP_DIR"

# Write release .gitignore to exclude huge files
cat << 'EOF' > .gitignore
node_modules/
src/
package.json
package-lock.json
tsconfig.json
vite.config.ts
postcss.config.js
tailwind.config.js
.planning/
CLAUDE.md
README.md
.DS_Store
deploy-theme.sh

# Large media assets (upload to Shopify Content -> Files)
*.glb
*.mp4
*.mp3
EOF

echo "=== 6. Committing and Pushing to Shopify Release Branch ==="
git add -A
git commit -m "dist: build & deploy clean Shopify theme layout [$(date)]" || true
git push origin shopify-theme-release --force

echo "=== 7. Switching Back to main ==="
git checkout -f main
git stash pop || true

echo "=== Theme successfully deployed to shopify-theme-release! ==="
