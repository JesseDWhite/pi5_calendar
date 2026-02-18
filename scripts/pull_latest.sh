#!/bin/bash

set -e

REPO_DIR="/home/jesse/Desktop/projects/pi5_calendar"
BRANCH="main"

echo "---- $(date) ----"
cd "$REPO_DIR"

# Ensure we are on main
git fetch origin
git checkout "$BRANCH"

# Pull only if clean to avoid conflicts
if git diff --quiet && git diff --cached --quiet; then
    git pull origin "$BRANCH"
else
    echo "Working tree not clean — skipping pull"
fi