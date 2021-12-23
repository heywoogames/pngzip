@ECHO off
echo %~1
echo %~dp0
cd /d %~dp0
node ./pngzip.js %~1 -e="wp_"

pause