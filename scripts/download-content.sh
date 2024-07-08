#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/../"

rm -rf ./content/
git clone git@github.com:stephane-klein/notes.sklein.xyz-content-private.git --depth 1 content/
rm -rf ./content/.git

find ./content/src/ -type f -name "*.md" | while read -r file; do
  if grep -q -e "^draft: true" -e "^draft: \"true\"" "$file"; then
    echo "Deleting file: $file"
    rm "$file"
  fi
done
rm -rf ./content/src/attachments/
