#!/bin/bash
# Check if an autonomous pipeline is in progress
if [ "$(ls -A .agents/state/*.md 2>/dev/null)" ]; then
  echo "AUTONOMOUS_PIPELINE_RESUME"
fi
