#!/usr/bin/env bash

SCENARIOS=(
  "installation"
  "CreateDataCubeProject"
)

for SCENARIO in ${SCENARIOS[@]}
do
  printf "\n------\n   hydra-validator e2e --docs test/${SCENARIO}.hydra.json ${BASE_URI}\n------\n"

  hydra-validator e2e --docs test/${SCENARIO}.hydra.json ${BASE_URI}

  if [[ $? -ne 0 ]]; then
    echo "Last scenario failed. Stopping"
    exit 1
  fi
done
