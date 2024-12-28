#!/bin/bash

# Check if pgcli is installed
if ! command -v pgcli &>/dev/null; then
  echo "pgcli is not installed. Please install it first:"
  echo "pip install pgcli"
  echo "or"
  echo "brew install pgcli"
  exit 1
fi

echo "Connecting to deep_cord database..."
pgcli postgresql://postgres:password@localhost:5432/deep_cord
