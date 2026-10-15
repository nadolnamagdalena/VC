#!/bin/sh
# Builds the deployable site into _site/: the default palette at the root, and one copy per
# palettes/<name>.txt under _site/<name>/ with its colours swapped (CSS, HTML, JS and SVG text).
set -e
cd "$(dirname "$0")/.."
rm -rf _site
mkdir _site
copy() { cp index.html "$1/"; cp -r assets css js "$1/"; }
copy _site
for f in palettes/*.txt; do
  [ -e "$f" ] || continue
  name=$(basename "$f" .txt)
  mkdir "_site/$name"
  copy "_site/$name"
  grep -vE '^\s*(#|$)' "$f" | while read -r from to; do
    find "_site/$name" -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.svg' \) \
      -exec perl -pi -e "s/#\Q$from\E/#$to/gi" {} +
  done
done
