#!/bin/bash
set -euo pipefail
APPDIR="/home/goblin/appgoblin"
FRONTEND_DIR="$APPDIR/frontend"
BUILD_DIR="$FRONTEND_DIR/build"
TMP_BUILD_DIR="$FRONTEND_DIR/build_tmp"

echo "Deploying from: $APPDIR"
cd "$APPDIR"

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Enabling systemd services..."
sudo systemctl enable "$APPDIR/scripts/appgoblin-api.service"
sudo systemctl enable "$APPDIR/scripts/appgoblin-frontend.service"
sudo systemctl daemon-reload

echo "Restarting backend..."
sudo systemctl restart appgoblin-api

echo "Building frontend..."
cd "$FRONTEND_DIR"

# Only reinstall deps if package-lock.json changed
if git diff HEAD@{1} HEAD --name-only | grep -q package-lock.json; then
    npm ci
else
    echo "Dependencies unchanged"
fi

# Build directly (SvelteKit outputs to build/ by default)
npm run build

# Atomic swap: create symlink to new build
TIMESTAMP=$(date +%s)
NEW_BUILD="$FRONTEND_DIR/build-${TIMESTAMP}"
mv "$BUILD_DIR" "$NEW_BUILD"

# Create symlink (atomic operation)
ln -sfn "$NEW_BUILD" "$BUILD_DIR"

# Clean up old builds (keep last 3)
ls -dt "$FRONTEND_DIR"/build-* | tail -n +4 | xargs rm -rf

echo "Restarting frontend..."
sudo systemctl restart appgoblin-frontend

echo "Deploy complete."
systemctl is-active appgoblin-api appgoblin-frontend