#!/bin/bash

migrate -path migrations -database "postgresql://postgres:password@localhost:5432/deep_cord?sslmode=disable" "$@"

# migrate -path migrations -database "postgresql://deep_cord_owner:L2kfMAFCOT8z@ep-winter-credit-a2joxklf.eu-central-1.aws.neon.tech/deep_cord?sslmode=require" "$@"
