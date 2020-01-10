
# CryptiCal-backend [![Coverage Status](https://coveralls.io/repos/github/0xEvie/cryptical-backend/badge.svg?branch=master)](https://coveralls.io/github/0xEvie/cryptical-backend?branch=master) [![Build Status](https://travis-ci.org/0xEvie/cryptical-backend.svg?branch=master)](https://travis-ci.org/0xEvie/cryptical-backend) 


CryptiCal: Encrypted Calendar (Back-end)
This backend was developed utilizing with NodeJS, ExpressJS, MongoDB.


# Features
- Data Validation (using ExpressValidator)
- Data Persistance (using Mongo, MongooseJS)
- Authenication (using PassportJS, Password hashing using bcrypt)
- ~~NodeJS Deployed (Heroku)~~ (Deprecated)
- ~~MongoDB Hosted (MLab)~~ (Deprecated)


# Testing Overview 
- Automatic Build + Testing
- Published Code Coverage (Coveralls)
- Continuous Integration (Travis CI)

# Commands

**Run Test Suite:**
```
npm test
```

**Run Code Coverage:**
```
npm run coverage
```

**Run Publish Coverage:**
```
npm run publish-coverage
```

**Run Build:**
```
npm run build
```

**Run Server:**
```
npm run server
```

**Run Clean libs:**
```
npm run clean
```

**Run Test - Build - Server:**
```
npm run start
```

**Watch Server (Nodemon):**
```
npm run server:watch
```

**Lint:**
```
npm run lint
```

**Watch Lint**
```
npm run lint:watch
```


## End Points

|Route|Method|Body Parameters|Description|Requires Auth?|
|-----|------|---------------|-----------|--------------|
| /register/|POST|email, password| Registers user with specified email/password|No|
| /login/|POST|email, password| Logs user in with specified email/password|No|
| /logout/|GET|| If user is logged in, it logs the user out|No|
| /events/:event_id|GET|| Returns details of event with ID specified in params|Yes|
| /events/|GET|| Returns all events tied to currently logged in User|Yes|
| /events/:event_id|GET|| Returns details of event with ID specified in params|Yes|
| /events/add|POST|title,datetime,duration| Adds events|Yes|
| /events/edit/:event_id|PUT|title,datetime,duration|Edits event with event_id with passed body params|Yes|
| /events/delete/:event_id|DELETE|| Deletes event with ID specified|Yes|

## Test Cases

* Event Routes
    * Un-authenticated Tests
      * GET /events
        * should return status 401
      * GET /event/event_id
        * should return status 401
      * DELETE /delete/event_id
        * should return status 401
      * POST /add
        * should return status 401
      * PUT /edit/event_id
        * should return status 401
	
    * Authenticated Tests
      * GET /events
        * should return an array of events with correct details
      * GET /event/event_id
        *  should return one event
      * DELETE /delete/event_id
        *  should delete event
      * POST /add
      	*  should return error when given invalid details
        *  should add event
      * PUT /edit/event_id
      	* should return error when given invalid details
        * should edit event

* User Routes and Authentication
    * Login
      *  should login/authenticate using PassportJS successfully with correct details
      *  should return an error with incorrect details
    * Register
      * should login successfully with correct details
      * should return error when invalid details passed
    * Logout
      * should log user out correctly


## Test Modules
- SuperTest Module
- SuperAgent Module
- Chai Module
- Chai-http Module
- Istanbul Module

## Test Output
```
 Event Routes
    Un-authenticated
      GET /events
        ✓ should return status 401
      GET /event/event_id
        ✓ should return status 401
      DELETE /delete/event_id
        ✓ should return status 401
      POST /add
        ✓ should return status 401
      PUT /edit/event_id
        ✓ should return status 401
    Authenticated
      GET /events
        ✓ should return an array of events with correct details
      GET /event/event_id
        ✓ should return one event
      DELETE /delete/event_id
        ✓ should delete event
      POST /add
        ✓ should return error when given invalid details
        ✓ should add event (46ms)
      PUT /edit/event_id
        ✓ should return error with invalid details
        ✓ should edit event

  User Routes
    Login
      ✓ should login successfully with correct details
      ✓ should return an error with incorrect details
      ✓ should return an error with invalid details
    Register
      ✓ should login successfully with correct details (38ms)
      ✓ should return error when invalid details passed
    Logout
      ✓ should log user out correctly


  18 passing (2s)
```
## Data Models

**User**

```
var UserSchema = Schema({
	email: {
		type: String
	},
	password: {
		type: String
	}
});
```

**Event**
```
var EventSchema = new Schema({
	title: { type: String, default: ''},
	datetime: { type: Date, default: ''},
	duration: {type: Number, min: 0, max: 65, default:'1'},
	user: { type : Schema.ObjectId, ref : 'User' },
});
```


## Libraries/Frameworks/Runtime Environment
- NodeJS
- MongoDB
- MongooseJS
- PassportJS
- bcrypt
- ExpressSession
- ExpressValidator
- CookieParser


# Referenced Material
- [PassportJS documentation](http://www.passportjs.org/)
- [MongooseJS documentation](https://mongoosejs.com/docs/guide.html)
- [Donation App](https://ddrohan.github.io/)
- [Getting Started on Heroku](https://devcenter.heroku.com/start)
- [Node.js Login System With Passport - (Part 1 to Part 3)](https://www.youtube.com/watch?v=Z1ktxiqyiLA)
