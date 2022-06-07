#!/bin/bash
source /etc/profile
echo $CI_PROJECT_PATH_SLUG
if [[ $env == '' ]]; then
export   env='uat'
export   CI_BUILD_REF_NAME='develop'
fi
# start build
npm install --registry=http://10.129.32.7:4873/ ||  exit 1
npm run $env || exit 1 && \
mkdir -p publish/pcdist && \
cp -r dist/*  publish/pcdist/ || exit 1
echo "build sucessful!"