#!/bin/bash

migrate -path migrations -database "postgresql://postgres:password@localhost:5432/deep_cord?sslmode=disable" "$@"
