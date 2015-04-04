@echo off

rem Build encryptwidget for TiddlyWiki5

tiddlywiki.cmd ^
	.\ ^
	--verbose ^
	--build ^

move /Y output\index.html index.html
move /Y output\readme.md README.MD
git add index.html
git add README.MD