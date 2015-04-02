@echo off

rem Build encryptwidget for TiddlyWiki5

tiddlywiki.cmd ^
	.\ ^
	--verbose ^
	--build ^
	|| exit 1

