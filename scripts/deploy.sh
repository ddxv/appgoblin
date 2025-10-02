#!/bin/bash
set -e 

APPDIR="/home/goblin/appgoblin"

cd "$APPDIR"
echo "Deploying from: $(pwd)"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Enabling systemd services..."
sudo systemctl enable "$APPDIR/scripts/appgoblin-api.service"
sudo systemctl enable "$APPDIR/scripts/appgoblin-frontend.service"
sudo systemctl daemon-reload

echo "Restarting backend..."
sudo systemctl restart appgoblin-api

echo "Building frontend..."
cd frontend
git diff HEAD@{1} HEAD --name-only | grep -q package-lock.json && npm ci || echo "Dependencies unchanged"
npm run build

echo "Restarting frontend..."
sudo systemctl restart appgoblin-frontend

echo "Deploy script complete"
systemctl is-active appgoblin-api appgoblin-frontend