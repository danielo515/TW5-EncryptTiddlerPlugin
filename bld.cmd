@echo off

rem Build encryptwidget for TiddlyWiki5

tiddlywiki.cmd ^
	.\ ^
	--verbose ^
	--build ^

move output\index.html index.html
move output\readme.md README.MD