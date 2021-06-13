## @echo off

cd ../../users/xoe/desktop/blogproject

git status

TIMEOUT /T 20

git add .

TIMEOUT /T 60

git commit -m "Added working search by user, documentations, and messages; updated post-deleting and postByUser Get"

TIMEOUT /T 60 

git push -u origin main

pause