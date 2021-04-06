#!/bin/zsh

echo "Getting video endpoints data and save it as local yaml file"
aws cloudformation describe-stacks --stack-name MikeVODStack > video-endpoints.yml