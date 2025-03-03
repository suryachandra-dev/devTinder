-create a repository
-Initialise the repository
-node_modules,package.json,package-lock.json
-install express
-create a server
Listen to port 7777
-write request handlers fir /test,/hello
Install nodemon and update scripts inside package.json

-initialise git
-create a .gitignore file
-create a remote repo on github
-push the code to the remote repo

NOTES:
-Pagination
/feed/page=1&limit=10=>1-10 =>.skip(0) &.limit(10);
/feed/page=2&limit=10=>11-20 =>.skip(10) &.limit(10);
/feed/page=3&limit=10=>21-30 =>.skip(20) & .limit(10);
skip=(page-1)*limit;
