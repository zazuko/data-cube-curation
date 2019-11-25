#!/bin/bash

set -e

FUSEKI_URL=http://localhost:3030
USERNAME=admin
PASSWORD=password
DATASETS="data-cube-e2e data-cube-read"

docker-compose stop
docker-compose rm -f
docker-compose up -d

echo 'Waiting on Fuseki...'
until $(curl --output /dev/null --silent --head --fail $FUSEKI_URL); do sleep 5; done

echo 'Fuseki ready. Creating datasets...'
for DATASET in $DATASETS
do
  echo "Creating $DATASET"
  curl $FUSEKI_URL/$/datasets -u $USERNAME:$PASSWORD -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' --data "dbName=$DATASET&dbType=tdb"
done

echo 'Ok'
