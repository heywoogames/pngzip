@ECHO off
echo %~1
echo %~dp0
cd /d %~dp0
node ./zip.js %~1

pause