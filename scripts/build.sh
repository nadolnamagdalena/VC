#!/bin/sh
# Builds the deployable site into _site/. The site is served at the root and, so that older links keep
# working, also under /v2/.
set -e
cd "$(dirname "$0")/.."
rm -rf _site
mkdir _site
copy() { mkdir -p "$1"; cp index.html "$1/"; cp -r assets css js "$1/"; }
copy _site
copy _site/v2
