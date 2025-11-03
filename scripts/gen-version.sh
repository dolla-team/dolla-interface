# scripts/gen-version.sh
echo "{\"version\": \"$(date +%s)\"}" > dist/version.json
