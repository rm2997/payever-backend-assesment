#backend-assesment

BACKEND ENGINEERING TASK

ESTIMATED TIME: 240 MINUTES (you are allowed to take more time)

Your task today is to create a simple REST application from scratch. To reduce implementation time, please use the NestJS framework (this is a MUST, don’t use any other framework). The application should implement a nodeJS server API communicating with this: https://reqres.in/

Please use the following prerequisites below:

- use TypeScript 3.4 and above. 

- use NestJS Framework, https://docs.nestjs.com/ 

- use MongoDB 4.4 and above 

- use RabbitMQ 3.7 and above


Your REST app should consist of:


1. POST /api/users

On the request store the user entry in db. After the creation, send an email and rabbit event. Both can be dummy sending (no consumer needed).

2. GET /api/user/{userId}

Retrieves data from https://reqres.in/api/users/{userId} and returns a user in JSON representation.

3. GET /api/user/{userId}/avatar

Retrieves image by 'avatar' URL.

On the first request it should save the image as a plain file, stored as a mongodb entry with userId and hash. Return its base64-encoded representation.

On following requests should return the previously saved file in base64-encoded. representation (retrieve from db).

4. DELETE /api/user/{userId}/avatar

Removes the file from the FileSystem storage.

Removes the stored entry from db.

The main goal of the task is to show your skills in the best way possible.


Done?

1. Your project passes eslint

2. The project builds and can start

3. All endpoints can be requested from postman

4. Data is stored in database successfully and rabbit event is emitted

5. Your application is covered with unit/functional tests

(Please cover every path of code with tests, that's important to us!)
