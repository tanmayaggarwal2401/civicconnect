@echo off
title Deploy CivicConnect to Firebase Hosting
echo ========================================================
echo   CivicConnect Delhi - Firebase Deployment Tool
echo   Project: civicconnect11
echo ========================================================
echo.

cd /d "%~dp0"

echo [Step 1 of 2] Authenticating with your Google / Firebase Account...
echo A browser window will open. Click 'Allow' to authorize.
echo.
call node ".\node_modules\firebase-tools\lib\bin\firebase.js" login

echo.
echo [Step 2 of 2] Deploying CivicConnect to https://civicconnect11.web.app ...
call node ".\node_modules\firebase-tools\lib\bin\firebase.js" deploy --only hosting

echo.
echo ========================================================
echo   Deployment Complete!
echo   Your website is now LIVE worldwide at:
echo   https://civicconnect11.web.app
echo ========================================================
pause
