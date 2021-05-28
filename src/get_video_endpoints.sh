#!/bin/bash

echo "Getting video endpoints data and save it as local yaml file"
dev_endpoint=$(aws cloudformation describe-stacks --stack-name mike-vod-dev --query "Stacks[0].Outputs[?OutputKey=='HLSEndpoint'].OutputValue" --output text)
prod_endpoint=$(aws cloudformation describe-stacks --stack-name mike-vod-prod --query "Stacks[0].Outputs[?OutputKey=='HLSEndpoint'].OutputValue" --output text)
printf '{"dev":"%s","prod":"%s"}\n' "$dev_endpoint" "$prod_endpoint" > video_endpoints.json