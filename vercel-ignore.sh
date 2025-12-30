#!/bin/bash

# Only build main and staging branches
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] || [[ "$VERCEL_GIT_COMMIT_REF" == "staging" ]]; then
  # Proceed with the build
  exit 1
else
  # Don't build
  echo "🚫 Skipping build for branch: $VERCEL_GIT_COMMIT_REF"
  exit 0
fi
