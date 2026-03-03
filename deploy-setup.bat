@echo off
echo === Cleaning dist folder... ===
if exist dist rd /s /q dist

echo === Building project... ===
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Aborting.
    exit /b 1
)

echo.
echo === Deploying dist/ to gh-pages branch... ===

cd dist
git init
git add -A
git commit -m "Deploy to GitHub Pages"
git branch -M gh-pages
git remote add origin https://github.com/sabih-source/portfolio.git
git push origin gh-pages --force
cd ..

echo.
echo === Pushing source code to main... ===
git add .
git commit -m "Update source including new assets"
git push origin main --force

echo === DONE! ===
echo Your site will be live in 1-2 minutes at:
echo https://sabih-source.github.io/portfolio
echo.
