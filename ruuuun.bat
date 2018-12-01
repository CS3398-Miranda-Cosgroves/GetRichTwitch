IF EXIST "%~dp0\node_modules\haikudos" GOTO hai
call npm i haikudos

:hai

IF EXIST "%~dp0\node_modules\tmi.js" GOTO tmi
call npm i tmi.js
:tmi

IF EXIST "%~dp0\node_modules\get-video-id" GOTO vid
call npm i get-video-id
:vid

IF EXIST "%~dp0\node_modules\googleapis" GOTO goog
call npm i googleapis
:goog

IF EXIST "%~dp0\node_modules\google-auth-library" GOTO goa
call npm i google-auth-library
:goa

IF EXIST "%~dp0\node_modules\youtube-info" GOTO you
call npm i youtube-info
:you

node src/JS/connect.js
pause