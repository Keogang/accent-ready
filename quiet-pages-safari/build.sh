#!/bin/sh
# Builds the Safari extension folder (extension/) from the shared Chrome code
# in ../quiet-pages plus the Safari-only files in src/. Run it after changing
# either one, then commit the result.
set -e
cd "$(dirname "$0")"
SHARED="browser.js words.js filter.js content.js content.css popup.html popup.js hub.js ocr-engine.js"
rm -rf extension
mkdir -p extension
for f in $SHARED; do cp "../quiet-pages/$f" extension/; done
cp -R ../quiet-pages/vendor extension/vendor
cp src/* extension/
echo "Built quiet-pages-safari/extension"
