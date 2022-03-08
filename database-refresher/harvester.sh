#!/bin/sh

CONFIG_DIR=/var/lib/harvester/config
SERVER=covid-database
[ -f $CONFIG_DIR/dataset-url ] && DATASET_URL=$(cat $CONFIG_DIR/dataset-url)
[ -z "$DATASET_URL" ] && echo "No url provided" && exit 3
DATASET=/var/lib/harvester/dataset

# Attempt to find the datestamp of the latest update to avoid duplicates.
echo "Obtaining date of latest update from $SERVER"

LAST_UPDATE=$(clickhouse client -h "$SERVER" \
    --query="SELECT MAX(UpdateDate) FROM covid19.updates") || exit 1
[ -z "$LAST_UPDATE" ] && LAST_UPDATE="NO_PREVIOUS_DATA"

echo "Last update: $LAST_UPDATE"

# Download the dataset from the URL then clean the data for
# database insertion.
echo "Downloading dataset from $DATASET_URL"
curl "$DATASET_URL" | owid_cleaner "$LAST_UPDATE" > $DATASET || exit 2

echo "Inserting new data"

# There is no new data to insert so exit.
[ -s $DATASET ] || exit 0

clickhouse client -h "$SERVER" \
    --query="INSERT INTO covid19.updates FORMAT CSV" < $DATASET
