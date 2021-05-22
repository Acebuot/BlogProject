@echo off

cd ../../users/xoe/desktop/blogproject

git status

TIMEOUT /T 20

git add .

TIMEOUT /T 60

git commit -m "Updated app routes and views"

TIMEOUT /T 60 

git push -u origin main

pause