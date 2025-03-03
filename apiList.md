# DevTinder APIs

#### authrouter
-POST /signup
-POST/login
-POST/logout

#### profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password //Forgot password API

#### ConnectionRequestRouter
[
-POST /request/send/interested/:userId
-POST /request/send/ignore/:userId
]
[
-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId
]
Convert into single dynamic route for all status types like interested,ignored and accepted,rejected
=========================
-POST /request/send/:status/:userId
-POST /request/review/:status/:requestId


#### User Router
-GET /user/requests/received
-GET /user/connections---Who is connected to me 
-GET /user/feed-gets you the profiles of other users on platform

Status:Ignored,Interested,Accepted,Rejected
Thought Process:POST vs GET

