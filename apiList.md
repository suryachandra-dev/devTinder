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
Convert into single dynamic route for all status types like interested and ignored
=========-POST /request/send/:status/:userId

-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

#### User Router

-GET /user/connections
-GET /user/requests
-GET /user/feed-gets you the profiles of other users on platform

Status:Ignored,Interested,Accepted,Rejected
