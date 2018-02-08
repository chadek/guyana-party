#! /bin/bash

mongo --eval "db.events.createIndex({ \"\$**\": \"text\" },{ name: \"TextIndexEvent\" })"
