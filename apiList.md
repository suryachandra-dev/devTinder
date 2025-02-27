# DevTinder APIs
#### authrouter
-POST /signup
-POST/login
-POST/logout

#### profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

#### ConnectionRequestRouter
-POST /request/send/interested/:userId
-POST /request/send/ignore/:userId
-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

#### User Router
-GET /user/connections
-GET /user/requests
-GET /user/feed-gets you the profiles of other users on platform

Status:Ignore,Interested,Accepted,Rejected
