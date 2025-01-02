#!/bin/bash

migrate -path migrations -database "$NEON_CONNECTION_URL" "$@"
