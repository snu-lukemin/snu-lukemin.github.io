#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CV_DIR="$ROOT_DIR/_cv_tex"
OUT_DIR="$ROOT_DIR/files"

cd "$CV_DIR"
latexmk -g -pdf -interaction=nonstopmode CV.tex

mkdir -p "$OUT_DIR"
cp -f "$CV_DIR/CV.pdf" "$OUT_DIR/CV.pdf"
cp -f "$CV_DIR/CV.tex" "$OUT_DIR/CV.tex"

echo "Synced: $OUT_DIR/CV.pdf"
echo "Synced: $OUT_DIR/CV.tex"
