@echo off
git rm -r --cached node_modules
git add .
git commit -m "Initial commit - Sabih Portfolio"
git pull origin main --allow-unrelated-histories --no-edit
git push -u origin main
echo.
echo === Source code pushed! Now deploying to gh-pages... ===
npm run deploy
echo.
echo === DONE! Your site will be live at: https://sabih-source.github.io/portfolio ===
