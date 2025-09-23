#!/bin/bash

# Read extension name and version from manifest.json
name="BananaPeel"
version=$(grep '"version"' manifest.json | head -n 1 | cut -d '"' -f 4)
zip_file="${name}-${version}.zip"
build_dir="build"

# Files and directories to be included in the package
include_files=(
    "_locales"
    "background.js"
    "scripts"
    "icons"
    "manifest.json"
    "modal.css"
    "popup"
)

# Clean up previous build
rm -rf "$build_dir"
rm -f "$zip_file"

# Create build directory
mkdir -p "$build_dir"

# Copy files to build directory
for item in "${include_files[@]}"; do
    if [ -e "$item" ]; then
        cp -r "$item" "$build_dir/"
        echo "Copied: $item"
    else
        echo "Warning: $item not found, skipping..."
    fi
done

# Create zip file
(cd "$build_dir" && zip -r "../$zip_file" .)

# Clean up build directory
rm -rf "$build_dir"

echo "Package created: $zip_file"
echo "Extension: $name v$version"
