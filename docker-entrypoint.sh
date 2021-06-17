#!/bin/sh

cp example.env .env
sed -i "s/<PTX_ID>/$PTX_ID/g" .env
sed -i "s/<PTX_KEY>/$PTX_KEY/g" .env

npm run start:prod