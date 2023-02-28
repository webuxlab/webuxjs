#!/bin/bash

docker compose up -d
node indexTelemetry.js &
node indexHi.js &
node indexGetTelemetry.js