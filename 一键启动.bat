@echo off
chcp 65001 >nul
title 减脂营营养师AI智能工作台

echo ============================================
echo    减脂营营养师AI智能工作台 - 一键启动
echo ============================================
echo.

:: 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，需要先安装。
    echo.
    echo 请按以下步骤操作：
    echo   1. 浏览器打开 https://nodejs.org
    echo   2. 下载 "LTS" 版本（绿色按钮）
    echo   3. 双击安装，一路点"下一步"即可
    echo   4. 安装完成后，重新双击此文件
    echo.
    start https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] 检测到 Node.js: 
node -v
echo.

:: 安装根目录依赖
echo [2/4] 正在安装依赖包（首次启动约需1-3分钟）...
call npm install >nul 2>nul
cd backend && call npm install >nul 2>nul && cd ..
cd frontend && call npm install >nul 2>nul && cd ..
echo 依赖安装完成！
echo.

:: 启动后端
echo [3/4] 正在启动后端服务...
start "后端服务" cmd /c "cd backend && npx tsx src/index.ts"

:: 等待后端启动
timeout /t 3 /nobreak >nul

:: 启动前端
echo [4/4] 正在启动前端页面...
start "前端页面" cmd /c "cd frontend && npx vite --host"

:: 等待前端启动
timeout /t 3 /nobreak >nul

echo.
echo ============================================
echo  启动成功！
echo ============================================
echo.
echo  浏览器正在打开页面...
echo  如果没有自动打开，请手动访问：
echo  http://localhost:5173
echo.
echo  关闭方法：关闭弹出的两个黑色窗口即可
echo.
start http://localhost:5173
pause
