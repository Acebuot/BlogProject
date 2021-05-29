@echo off

cd ../../users/xoe/desktop/blogproject

git status

TIMEOUT /T 20

git add .

TIMEOUT /T 60

git commit -m "Added and fixed more user features, added search by user, and some bugfixes"

TIMEOUT /T 60 

git push -u origin main

pause