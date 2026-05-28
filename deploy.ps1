# Stop execution on any error
$ErrorActionPreference = "Stop"

# Create gh-pages branch from current files
git checkout -b gh-pages
git add -A
git commit -m 'deploy'
git push -f git@github.com:revaddu/snake-game-ts.git gh-pages
git checkout main