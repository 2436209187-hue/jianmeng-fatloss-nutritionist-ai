@echo off
chcp 65001 >nul
title 减脂营营养师AI智能工作台

echo ============================================
echo    减脂营营养师AI智能工作台 - 一键启动
echo ============================================
echo.

:: 检查 Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，需要先安装。
    echo.
    echo 请按以下步骤操作：
    echo   1. 浏览器打开 https://nodejs.org
    echo   2. 下载 LTS 版本
    echo   3. 双击安装，一路点下一步即可
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
echo [2/4] 正在安装依赖包，首次启动约需1-3分钟...
call npm install
if errorlevel 1 (
    echo [警告] 根目录依赖安装可能失败，继续尝试...
)
cd backend
call npm install
if errorlevel 1 (
    echo [警告] 后端依赖安装可能失败，继续尝试...
)
cd ..
cd frontend
call npm install
if errorlevel 1 (
    echo [警告] 前端依赖安装可能失败，继续尝试...
)
cd ..
echo 依赖安装完成！
echo.

:: 启动后端
echo [3/4] 正在启动后端服务...
start "后端服务-请勿关闭" cmd /k "cd backend && npx tsx src/index.ts"

:: 等待后端启动
timeout /t 5 /nobreak >nul

:: 启动前端
echo [4/4] 正在启动前端页面...
start "前端页面-请勿关闭" cmd /k "cd frontend && npx vite --host"

:: 等待前端启动
timeout /t 5 /nobreak >nul

echo.
echo ============================================
echo  启动成功！
echo ============================================
echo.
echo  浏览器正在打开页面...
echo  如果没有自动打开，请手动访问：
echo  http://localhost:5173
echo.
echo  关闭方法：关闭弹出的两个窗口即可
echo.
start http://localhost:5173
pause
