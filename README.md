# ***notificationstest*** API Documentation

## Description

This document contains all relevant API information for the application "notificationstest".

## Table of Contents

- [Installing Dependencies](#installing-dependencies)
  - [Node and NPM](#node-and-npm)
  - [Dependencies](#dependencies)
- [Seeding the App](#seeding-the-app)
- [Running the App](#running-the-app)
  - [Development vs. Production Mode](#development-vs-production-mode)
- [Running the Test Suite](#running-the-test-suite)
- [Connecting to the App Console](#connecting-to-the-app-console)
- [Jobs and Scheduling](#jobs-and-scheduling)
  - [Manually Executing Jobs](#manually-executing-jobs)
- [Authentication](#authentication)
- [CRUD and Query Scope Requests](#crud-and-query-scope-requests)
- [Push Notifications](#push-notifications)
- [File Uploads](#file-uploads)
- [Programmatic CRUD and Query Scope Calls](#programmatic-crud-and-query-scope-calls)
- [Roles](#roles)
- [API Versions](#api-versions)
- [Storage Interfaces](#storage-interfaces)

## <a name="installing-dependencies"></a> Installing Dependencies

### <a name='node-and-npm'></a> Node and NPM

The link at the bottom of this section contains all the installers for node.
This applications engines are located in the package.json file or below:

```json
{
  'node': '4.4.3',
  'npm': '2.15.1'
}
```

From the above example, you would find the v4.4.3 installer for your platform
and use that to setup node. Note that the installer also includes NPM and
should already be the correct version listed here and in the package.json file.

[Node Distributables](https://nodejs.org/dist/)

### <a name='dependencies'></a> Dependencies

Once you have node and NPM installed, you can install the global dependencies
required by the application as well as all the local dependencies the application
requires to run. All of those commands should be executed from the application's
root directory, unless noted otherwise.

First, install grunt-cli in order to execute grunt tasks:

```
npm install grunt-cli -g
```

Next, install all of the application's local dependencies. This could take a while
as it downloads and compiles all dependencies.

```
npm install
```

You will also need to install MongoDB and have it running on your system locally.
Visit the link below for instructions on setting up MongoDB for your platform:

### [MongoDB Installation Instructions](http://docs.mongodb.org/manual/installation/)


### Oracle database dependencies

Oracle database requires Oracle 11.2 or 12.1 client libraries. These are included in Oracle Instant Client RPMs or ZIPs, 
a full Oracle Client, or a database on the same machine.  Oracle's standard client-server network compatibility applies, 
which enables connection to databases with different versions from the Oracle client library version.

Python 2.7 is needed for node-gyp.  Gcc is needed on Linux.  On OS X, install Xcode.

Download the free 'Basic' and 'SDK' RPMs from [Oracle Technology Network](http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html) and
[install them](http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html#ic_x64_inst) as the root user:
[Oracle Instant Client](http://www.oracle.com/technetwork/database/features/instant-client/index-097480.html)


## <a name="seeding-the-app"></a> Seeding the App

Everything should be in place to run the application. First, we'll need to seed
the initial database with the admin account. 

If you have [Forego](https://github.com/ddollar/forego) installed on your machine 
you can execute the following command:

```
forego run grunt seed
```


If you do not have forego installed, you can use the locally installed node implementation
by executing:

```
node ./node_modules/foreman/nf run grunt seed
```

Please note that the path ./node_modules/foreman/nf may have to change if you're running on 
a Windows machine.

Once that has finished, you can locate your default username and password by
executing the following command (on Linux or Mac OS):

```
grep -A1 email tasks/config/createAdmin.js
```

Which should produce something like:

```
email: "test@fizz.com",
password: "a9c6bd1ac688b671"
```

Otherwise, the fields are located in the file:

```
tasks/config/createAdmin.js
```

## <a name="running-the-app"></a> Running the App

Executing the following command will start the web server and the background
processes such as the job scheduler:

```
PORT=1337 npm start
```

And browse to:
### [http://localhost:1337/admin](http://localhost:1337/admin)

You can adjust the port by changing the PORT environment variable.

```
PORT=2222 npm start
```

You can also adjust the instance scaling using the npm script. For example if
you wanted to have 3 instances of the web process running:

```
npm start web=3
```

Each process will be started on a separate port, starting from the default or supplied
port and incrementing up. In this example the default port 5000 would be used and the 
instances would be listening on ports 5000, 5001 and 5002.

### <a name="development-vs-production-mode"></a> Development vs. Production Mode

You can also use this to execute the app in **production** vs **development**
mode.

```
NODE_ENV=production npm start
```

Providing no argument for NODE_ENV starts the app in **development** mode by default.

## <a name="running-the-test-suite"></a> Running the Test Suite

To run the application's test suite, execute the following command:

```
npm test
```

You can add custom API test files to:

```
test/server/
```

Any tests in this folder will be included in the test suite.

## <a name="connecting-to-the-app-console"></a> Connecting to the App Console

The sails framework can also be started in interactive mode with a console.
To use the console execute:

```
PORT=1337 npm run console
```

Set the port to any available port that the current application is not running on.

## <a name='jobs-and-scheduling'></a> Jobs and Scheduling

The job scheduler will start automatically when starting the server process using using the
previously mentioned npm script.


You should see logs from the **clock** process in your output regarding scheduled jobs. The scheduler
will only schedule and execute the most recent version of your jobs, it will not queue any previous API
version's jobs.

### <a name="manually-executing-jobs"></a> Manually Executing Jobs

If you'd like to run a job manually or from a script, you can execute the following command from
the root directory of our application:

```
npm run job <job_name>
```

Replacing \<job_name\> with the name you used to create the job. For example, if you created a job called
"MonthlyReport", you would execute:

```
npm run job MonthlyReport
```

You can also, optionally, supply an API version of the job if you'd like to execute a specific
version of the job:

```
npm run job MonthlyReport 2
```

This command would execute version 2 of the MonthlyReport job.

## <a name="authentication"></a> Authentication
## Password (Password) Authentication Strategy

To login and create a session with the password strategy, simply make a POST
to following path:

```
POST /auth/Password/callback
```

Alternatively, you can specify the API version you wish to authenticate against:

```
POST /auth/v1/Password/callback
```

With a body similar to the following:

```
{
  "username": "test",
  "password": "password"
}
```

The result of the above call, if the credentials are valid, should be a JSON object
containing all of the session details.

## <a name="crud-and-query-scope-requests"></a> CRUD and Query Scope Requests

## NotificationLog
   **/api/v1/notification_logs** OR **/api/notification_logs**

Example payload:
```
{"message":"Mohammedanisms moistest","notificationType":"Prelates inconsequential","sentAt":"2013-11-08","userName":"Pertinent horrors"}```

### Create
To create a NotificationLog, make a POST like below using a body similar
to the example payload.

```
POST /api/notification_logs
```

### Read
To request a specific NotificationLog object, make a GET using the following
URL:

```
GET /api/notification_logs/<id>
```

Replace "id" with the id value for the object.

The read route also supports scopes, both custom and default. To learn more about
executing scopes see the section below.

### Update
To update an object, make PUT or POST to the following URL:

```
PUT or POST /api/notification_logs/<id>
```

Replace "id" with the id value for the object.
The body of the call should contain the new values.

### Destroy
To destroy an object, make a DELETE to the following URL:

```
DELETE /api/notification_logs/<id>
```

Replace "id" with the id value for the object.

### Scopes

Available scopes for NotificationLog:

Name | Javascript Name | Description
-----|-----------------|--------------
all  |  allScope  |  Returns all instances    
exact_match  |  exactMatchScope  |  Returns all instances that match the provided fields exactly    
count  |  countScope  |  Counts all instances    
count_exact_match  |  countExactMatchScope  |  Counts all instances that match the provided fields exactly    

To execute a scope query:

```
GET /api/notification_logs?scope=<scope_name>
```

Replace "scope_name" with the value in the name column in the above table. Some scopes
may require additional query parameters, for example:

```
GET /api/notification_logs?scope=custom&query[first_name]=bob
```

Use query[field] pattern to send a value to the scope operation.

## Order
   **/api/v1/orders** OR **/api/orders**

Example payload:
```
{"desc":"Academically ruddier","name":"Jack Kovacek"}```

### Create
To create a Order, make a POST like below using a body similar
to the example payload.

```
POST /api/orders
```

### Read
To request a specific Order object, make a GET using the following
URL:

```
GET /api/orders/<id>
```

Replace "id" with the id value for the object.

The read route also supports scopes, both custom and default. To learn more about
executing scopes see the section below.

### Update
To update an object, make PUT or POST to the following URL:

```
PUT or POST /api/orders/<id>
```

Replace "id" with the id value for the object.
The body of the call should contain the new values.

### Destroy
To destroy an object, make a DELETE to the following URL:

```
DELETE /api/orders/<id>
```

Replace "id" with the id value for the object.

### Scopes

Available scopes for Order:

Name | Javascript Name | Description
-----|-----------------|--------------
all  |  allScope  |  Returns all instances    
exact_match  |  exactMatchScope  |  Returns all instances that match the provided fields exactly    
count  |  countScope  |  Counts all instances    
count_exact_match  |  countExactMatchScope  |  Counts all instances that match the provided fields exactly    

To execute a scope query:

```
GET /api/orders?scope=<scope_name>
```

Replace "scope_name" with the value in the name column in the above table. Some scopes
may require additional query parameters, for example:

```
GET /api/orders?scope=custom&query[first_name]=bob
```

Use query[field] pattern to send a value to the scope operation.

## SendGrid
   **/api/v1/send_grids** OR **/api/send_grids**

Example payload:
```
{"emailFrom":"Pathologically overviews","emailTo":"Pursuance shelve","message":"Professionally steakhouse","subject":"Toned overcompensated"}```

### Create
To create a SendGrid, make a POST like below using a body similar
to the example payload.

```
POST /api/send_grids
```

### Read
To request a specific SendGrid object, make a GET using the following
URL:

```
GET /api/send_grids/<id>
```

Replace "id" with the id value for the object.

The read route also supports scopes, both custom and default. To learn more about
executing scopes see the section below.

### Update
To update an object, make PUT or POST to the following URL:

```
PUT or POST /api/send_grids/<id>
```

Replace "id" with the id value for the object.
The body of the call should contain the new values.

### Destroy
To destroy an object, make a DELETE to the following URL:

```
DELETE /api/send_grids/<id>
```

Replace "id" with the id value for the object.

### Scopes

Available scopes for SendGrid:

Name | Javascript Name | Description
-----|-----------------|--------------
all  |  allScope  |  Returns all instances    
exact_match  |  exactMatchScope  |  Returns all instances that match the provided fields exactly    
count  |  countScope  |  Counts all instances    
count_exact_match  |  countExactMatchScope  |  Counts all instances that match the provided fields exactly    

To execute a scope query:

```
GET /api/send_grids?scope=<scope_name>
```

Replace "scope_name" with the value in the name column in the above table. Some scopes
may require additional query parameters, for example:

```
GET /api/send_grids?scope=custom&query[first_name]=bob
```

Use query[field] pattern to send a value to the scope operation.

## Twilio
   **/api/v1/twilios** OR **/api/twilios**

Example payload:
```
{"message":"Infested exhilarating","toPhoneNumber":"Encouragements foreswore"}```

### Create
To create a Twilio, make a POST like below using a body similar
to the example payload.

```
POST /api/twilios
```

### Read
To request a specific Twilio object, make a GET using the following
URL:

```
GET /api/twilios/<id>
```

Replace "id" with the id value for the object.

The read route also supports scopes, both custom and default. To learn more about
executing scopes see the section below.

### Update
To update an object, make PUT or POST to the following URL:

```
PUT or POST /api/twilios/<id>
```

Replace "id" with the id value for the object.
The body of the call should contain the new values.

### Destroy
To destroy an object, make a DELETE to the following URL:

```
DELETE /api/twilios/<id>
```

Replace "id" with the id value for the object.

### Scopes

Available scopes for Twilio:

Name | Javascript Name | Description
-----|-----------------|--------------
all  |  allScope  |  Returns all instances    
exact_match  |  exactMatchScope  |  Returns all instances that match the provided fields exactly    
count  |  countScope  |  Counts all instances    
count_exact_match  |  countExactMatchScope  |  Counts all instances that match the provided fields exactly    

To execute a scope query:

```
GET /api/twilios?scope=<scope_name>
```

Replace "scope_name" with the value in the name column in the above table. Some scopes
may require additional query parameters, for example:

```
GET /api/twilios?scope=custom&query[first_name]=bob
```

Use query[field] pattern to send a value to the scope operation.

## User
   **/api/v1/users** OR **/api/users**

Example payload:
```
{"emailAddress":"latricia.toy18@notificationstest.com","password":"password","passwordConfirmation":"password","passwordDigest":"Adamantly appertaining","phoneNumber":"Unattended disenchantment","role":"Valedictorians demonstrated","sendPushNotifications":true,"sendSendgridNotifications":true,"sendTwilioNotifications":false,"username":"Pints Sally","xSessionId":"Manhandled cinematographer"}```

### Create
To create a User, make a POST like below using a body similar
to the example payload.

```
POST /api/users
```

### Read
To request a specific User object, make a GET using the following
URL:

```
GET /api/users/<id>
```

Replace "id" with the id value for the object.

The read route also supports scopes, both custom and default. To learn more about
executing scopes see the section below.

### Update
To update an object, make PUT or POST to the following URL:

```
PUT or POST /api/users/<id>
```

Replace "id" with the id value for the object.
The body of the call should contain the new values.

### Destroy
To destroy an object, make a DELETE to the following URL:

```
DELETE /api/users/<id>
```

Replace "id" with the id value for the object.

### Scopes

Available scopes for User:

Name | Javascript Name | Description
-----|-----------------|--------------
all  |  allScope  |  Returns all instances    
exact_match  |  exactMatchScope  |  Returns all instances that match the provided fields exactly    
count  |  countScope  |  Counts all instances    
count_exact_match  |  countExactMatchScope  |  Counts all instances that match the provided fields exactly    
my_user_record  |  myUserRecordScope  |  Return user record for current user    

To execute a scope query:

```
GET /api/users?scope=<scope_name>
```

Replace "scope_name" with the value in the name column in the above table. Some scopes
may require additional query parameters, for example:

```
GET /api/users?scope=custom&query[first_name]=bob
```

Use query[field] pattern to send a value to the scope operation.


## <a name="push-notifications"></a> Push Notifications
## Subscribe
**Does NOT require authentication**

The supplied token (device identifier) will be subscribed to the provided channel
belonging to either the supplied appName or the default application. If the channel
does not exist it will be created using the supplied channelName. If the device
does not exist it will also be created using the supplied token, provider and name.

#### POST /api/push_notifications/channel/subscribe
```
{
  channelName: 'News',
  appName: 'someApp',
  token: 'Test',
  provider: 'APPLE',
  name: "Frank's iPhone"
}
```

#### RESPONSE
```
{
  "channels": [
    {
      "name": "News",
      "app": "569938c1df324340867cfa29",
      "compositeName": "News569938c1df324340867cfa29",
      "id": "56a123121d1032a75980fa92"
    }
  ],
  "app": "569938c1df324340867cfa29",
  "identifier": "Test",
  "name": "Frank's iPhone",
  "provider": "APPLE",
  "compositeIdentifier": "Test569938c1df324340867cfa29",
  "id": "56a151fb9af0741278fe0782"
}
```

**channelName** should be an existing channel or a channel you wish to be created.

**appName** *optional* should contain the name of the app you're dealing with. If it is not supplied the default application will be used.

**token** is the identifier token provided by APN or GCM.

**provider** *optional* is either 'APPLE' or 'GOOGLE'. Only needs to be provided if you expect the device to not exist and needs to be created. The value will be the new device's provider.

**name** *optional* Can be a string identifier for the device for friendlier display to users. Only needs to be provided if you expect the device to not exist and needs to be created.

The successful response will contain the device as well as any channels it's subscribed to, including the newly subscribed channel.

### Subscribe in custom code

You can also execute the subscribe method directly in your custom code. For example:

```
/*
 * The parameters for subscribe in order are:
 * token : Identifier provided by APN or GCM.
 * provider : 'APPLE' or 'GOOGLE'.
 * name : A nickname for the device.
 * appId : The push application.
 * channelName : The channel belonging to appId's app.
 * cb : function
 */
this.push.subscribe("abc123", "APPLE", "Example's iPhone", "569938c1df324340867cfa29", "Alerts", function(err, result) {
  // "result" will be the device and it's associated channels.
});
```

The behavior is the same as using the API endpoint. If a channel does not exist, it will be created. If the device does not exist it, will be created
using the provider, name and token.

## Unsubscribe
**Does NOT require authentication**

Removes the supplied device token from the channel. If the device is not subscribed to the provided channel an error is returned.

#### POST /api/push_notifications/channel/unsubscribe
```
{
  channelName: 'News',
  appName: 'someApp',
  token: 'Test'
}
```

#### RESPONSE
```
{
  "channels": [ ],
  "app": "569938c1df324340867cfa29",
  "identifier": "Test",
  "name": "Frank's iPhone",
  "provider": "APPLE",
  "compositeIdentifier": "Test569938c1df324340867cfa29",
  "id": "56a151fb9af0741278fe0782"
}
```

**channelName** should be an existing channel.

**appName** *optional* should contain the name of the app you're dealing with. If it is not supplied the default application will be used.

**token** is the identifier token provided by APN or GCM.

Like subscribe, the successful response will contain the device as well as any channels it's subscribed to. The unsubscribed channel will no longer be in the channels list.

###Unsubscribe in custom code

You can also execute the unsubscribe method directly in your custom code. For example:

```
/*
 * The parameters for unsubscribe in order are:
 * token : Identifier provided by APN or GCM.
 * channelName : name of the channel to unsubscribe from.
 * appId : Id of the application the channel belongs to.
 */
this.push.unsubscribe('abc123', 'channelName', 'appId', function(err, result) {
  // "result" will be the device and it's associated channels.
});
```

## Device's Channels
**Does NOT require authentication**

#### GET /api/push_notifications/device/:token/channels

#### RESPONSE
```
[       
  {       
    "app": {
      "name": "PusheNotifications",
      "id": "569938c1df324340867cfa29"
    },
    "name": "Alerts",      
    "compositeName": "Alerts56bbc0111dbcbc3d89bcfa76",       
    "id": "56bbc0221dbcbc3d89bcfa77"     
  },     
  {     
    "app": {
      "name": "PusheNotifications",
      "id": "569938c1df324340867cfa29"
    },
    "name": "Messages",       
    "compositeName": "Messages56bbc0111dbcbc3d89bcfa76",     
    "id": "56bcb8f3c1834efb189473e1"
  } 
]
```

**token** This is the token supplied by either GCM or APN.

## Push Notification
**Does NOT require authentication**

Sends a message to the supplied channel's devices. Includes both Google and Apple devices.

#### POST /api/push_notifications/message
```
{
  channelName: "myChannel",
  appName: "someApp",
  appleAlert: "\uD83D\uDCE7 Updates Available!",
  appleBadge:  1,
  appleSound: "ping.aiff",
  appleExpiry: 60,
  appleContentAvailable:  0,
  googleCollapseKey: "Updates Available",
  googleDelayWhileIdle: true,
  googleTimeToLive: 60
  payload: "You've received a new message!"
}
```

**channelName**  should be an existing channel.

**appName** *optional* should contain the name of the app the channel belongs to. If it is not supplied the default application will be used.

**appleAlert** The text to display in the alert. Apple only. Defaults to "You have a new notification!".

**appleBadge** *optional* Number to display on the app's badge icon. Apple only. Defaults to 1.

**appleSound** *optional* The sound file to play on the device when receiving the notification. The file should exist within your application's bundle or in the Library/Sounds folder. Apple only. Defaults to "ping.aiff".

**appleExpiry** Minutes. Time when the push notification is no longer relevant and can be discarded regardless if it has been delivered. Apple only. Defaults to 60.

**appleContentAvailable** *optional* 1 indicates that the application has content available. Apple only. Defaults to 0 - no content available.

**googleCollapseKey** *optional* Identifies a group of messages that can be collapsed to display only the most recent notification. Google only.

**googleDelayWhileIdle** *optional* Indicates whether the message should be delayed until the device is active. Google only. Default is false.

**googleTimeToLive** *optional* This parameter specifies how long (in minutes) the message should be kept in GCM storage if the device is offline. Google only. Default is 4 weeks.

**payload** *required* Content of the alert.

### Push Notification in custom code

You can also use the push API to send a message object to an application's channel in your custom code. To do so, first create a new message object:

```
Message.create({channel: 'channel_id', payload: 'the message'}).exec(function(err, result) {
  // Handle any validation errors that may occur
  // result is your persisted message.
})
```

Once you have your message object you can use it to send message to a channel using the push API:

```
// 'result' is the result of the create callback from above - the message object.
// Replace channelName with the appropriate channel name and appId with a push application's id.
this.push.sendMessage(result, 'channelName', 'appId', function() {
  // the callback is executed when messages are sending.
})
```

  
## <a name="file-uploads"></a> File Uploads
## <a name=“file-uploads”></a> File Uploads


Models may contain file fields. Generated APIs provides a set of operations to enable CRUD file operations.


## Creating a resource that contains a file field

Suppose we have a Candidate model with three fields:

+ name
+ lastName
+ resume

Name and lastName are Strings, and resume is expected to be an attached file (In example: a PDF or DOC). We could execute following command to create a model instance:

#### POST http://localhost:1337/api/v1/employees
```
{
"lastname": "John",
"name": "Dow",
"resume": "@file.png"
}
```

#### RESPONSE
```
{
"lastname": "BBBB",
"name": " POPO",
"resume": "/api/employees/files/26f273e8-a44d-499b-b5fa-1bc6cef7ef3c.png",
"id": "56cfe170f67da8143f9023fe"
}
```

!Important: POST request MUST BE of type multipart/form-data

File fields wont return the file contents embedded in the model representation but an outbound link to resource. The last part of the URI is the file name.


## Updating / Patching a resource that contains a file field

A resource with files can be patched / updated through the API.

#### PUT http://localhost:1337/api/v1/employees/56cfe170f67da8143f9023fe
```
{
"lastname": "Doe",
"name": " John"
}
```

#### RESPONSE 204


So in this case, resource with id 56cfe170f67da8143f9023fe will be updated with provided values.

## Updating / Patching just model files

Suppose we have an existing employee like this:

```
{
"lastname": "Doe",
"name": " John",
"resume": "/api/employees/files/babce698-6069-4ed7-a821-09489fefe213.png",
"id": "56d8f4e8d4bbbf7d3f9e0224"
}
```

If you'd like to remove the resume from a candidate simply send an empty string in the request for that field:

#### PUT http://localhost:1337/api/v1/employees/56cfe170f67da8143f9023fe
```
{
"lastname": "Doe",
"name": " John",
"resume": "",
}
```

Executing request above, resume file will be removed from storage, and model will be updated setting resume file url field to null. So a get request over that model instance will return:

#### RESPONSE
{
"lastname": "Doe",
"name": " John",
"resume": null,
"id": "56d8f4e8d4bbbf7d3f9e0224"
}

The API will automatically delete files associated with a model when it is destroyed.

```
#### DELETE http://localhost:1337/api/v1/employees/56cfe170f67da8143f9023fe
```

#### RESPONSE 204
  

  ## <a name="programmatic-crud-and-query-scope-calls"></a> Programmatic CRUD and Query Scope Calls
### Create

If you want to create a NotificationLog in your custom code:

```javascript
// Pass the create method an object containing the model attributes
V1NotificationLog.create(<values>)
  .then(function(result) {
    // result is the object created.
  })
  .catch(function(err) {
    // Handle any error that may occur
  });
```

### Read

If you want to find a NotificationLog in your custom code:

```javascript
V1NotificationLog.findOne({id: <id>})
  .then(function(result) {
    // result is the object found.
  })
  .catch(function(err) {
    // Handle any error that may occur
  });
```

### Update

If you want to update a NotificationLog in your custom code:

```javascript
// params is the "where" portion of the update
var params = {id: 1};
V1NotificationLog.update(params, <values>)
  .then(function(result) {
    // result is the updated object.
  })
  .catch(function(err) {
    // Handle any error that may occur
  })
```

### Destroy

If you want to destroy a NotificationLog in your custom code:

```javascript
V1NotificationLog.destroy(id)
  .then(function() {
    // success
  })
  .catch(function(err) {
    // Handle any error that may occur
  })
```### Create

If you want to create a Order in your custom code:

```javascript
// Pass the create method an object containing the model attributes
V1Order.create(<values>)
  .then(function(result) {
    // result is the object created.
  })
  .catch(function(err) {
    // Handle any error that may occur
  });
```

### Read

If you want to find a Order in your custom code:

```javascript
V1Order.findOne({id: <id>})
  .then(function(result) {
    // result is the object found.
  })
  .catch(function(err) {
    // Handle any error that may occur
  });
```

### Update

If you want to update a Order in your custom code:

```javascript
// params is the "where" portion of the update
var params = {id: 1};
V1Order.update(params, <values>)
  .then(function(result) {
    // result is the updated object.
  })
  .catch(function(err) {
    // Handle any error that may occur
  })
```

### Destroy

If you want to destroy a Order in your custom code:

```javascript
V1Order.destroy(id)
  .then(function() {
    // success
  })
  .catch(function(err) {
    // Handle any error that may occur
  })
```### Create

If you want to create a SendGrid in your custom code:

```javascript
/* First parameter is the name of the action you'd like to execute.
 * params are additional URL parameters that you'd like to send with the outgoing request.
 * values should be an object containing the fields for the new object.
 * context is the request context used for interpolating values within the call, this is
 *  always req.context
 * The last parameter is an error first callback function.
 */
V1SendGrid.request('create', params, values, req.context, function(err, result) {
  if (err) {
    // Handle error
  } else {
    // result is the created object
  }
});
```

### Read

If you want to find a SendGrid in your custom code:

```javascript
/* First parameter is the name of the action you'd like to execute.
 * params are additional URL parameters that you'd like to send with the outgoing request.
 * values should be an object containing the fields for the new object - not used in read calls.
 * context is the request context used for interpolating values within the call, this is
 *  always req.context
 * The last param is an error first callback function.
 */
var params = { limit: 10 };
V1SendGrid.request('read', params, values, req.context, function(err, result) {
  if (err) {
    // Handle error
  } else {
    // result is the found object
  }
});
```

### Update

If you want to update a SendGrid in your custom code:

```javascript
/* First parameter is the name of the action you'd like to execute.
 * params are additional URL parameters that you'd like to send with the outgoing request.
 * values should be an object containing the fields to be updated.
 * context is the request context used for interpolating values within the call, this is
 *  always req.context
 * The last param is an error first callback function.
 */
V1SendGrid.request('update', params, values, req.context, function(err, result) {
  if (err) {
    // Handle error
  } else {
    // result is the updated object
  }
});
```

### Destroy

If you want to destroy a SendGrid in your custom code:

```javascript
/* First parameter is the name of the action you'd like to execute.
 * params are additional URL parameters that you'd like to send with the outgoing request.
 * values should be an object containing the fields for the new object - not used in delete calls.
 * context is the request context used for interpolating values within the call, this is
 *  always req.context
 * The last param is an error first callback function.
 */
V1SendGrid.request('delete', params, values, req.context, function(err) {
  if (err) {
    // Handle error
  }
});
```### Create

If you want to create a Twilio in your custom code:

```javascript
/* First parameter is the name of the action you'd like to execute.
 * params are additional URL parameters that you'd like to send with the outgoing request.
 * values should be an object containing the fields for the new object.
 * context is the request context used for interpolating values within the call, this is
 *  always req.context
 * The last parameter is an error first callback function.
 */
V1Twilio.request('create', params, values, req.context, function(err, result) {
  if (err) {
    // Handle error
  } else {
    // result is the created object
  }
});
```

### Read

If you want to find a Twilio in your custom code:

```javascript
/* First parameter is the name of the action you'd like to execute.
 * params are additional URL parameters that you'd like to send with the outgoing request.
 * values should be an object containing the fields for the new object - not used in read calls.
 * context is the request context used for interpolating values within the call, this is
 *  always req.context
 * The last param is an error first callback function.
 */
var params = { limit: 10 };
V1Twilio.request('read', params, values, req.context, function(err, result) {
  if (err) {
    // Handle error
  } else {
    // result is the found object
  }
});
```

### Update

If you want to update a Twilio in your custom code:

```javascript
/* First parameter is the name of the action you'd like to execute.
 * params are additional URL parameters that you'd like to send with the outgoing request.
 * values should be an object containing the fields to be updated.
 * context is the request context used for interpolating values within the call, this is
 *  always req.context
 * The last param is an error first callback function.
 */
V1Twilio.request('update', params, values, req.context, function(err, result) {
  if (err) {
    // Handle error
  } else {
    // result is the updated object
  }
});
```

### Destroy

If you want to destroy a Twilio in your custom code:

```javascript
/* First parameter is the name of the action you'd like to execute.
 * params are additional URL parameters that you'd like to send with the outgoing request.
 * values should be an object containing the fields for the new object - not used in delete calls.
 * context is the request context used for interpolating values within the call, this is
 *  always req.context
 * The last param is an error first callback function.
 */
V1Twilio.request('delete', params, values, req.context, function(err) {
  if (err) {
    // Handle error
  }
});
```### Create

If you want to create a User in your custom code:

```javascript
// Pass the create method an object containing the model attributes
V1User.create(<values>)
  .then(function(result) {
    // result is the object created.
  })
  .catch(function(err) {
    // Handle any error that may occur
  });
```

### Read

If you want to find a User in your custom code:

```javascript
V1User.findOne({id: <id>})
  .then(function(result) {
    // result is the object found.
  })
  .catch(function(err) {
    // Handle any error that may occur
  });
```

### Update

If you want to update a User in your custom code:

```javascript
// params is the "where" portion of the update
var params = {id: 1};
V1User.update(params, <values>)
  .then(function(result) {
    // result is the updated object.
  })
  .catch(function(err) {
    // Handle any error that may occur
  })
```

### Destroy

If you want to destroy a User in your custom code:

```javascript
V1User.destroy(id)
  .then(function() {
    // success
  })
  .catch(function(err) {
    // Handle any error that may occur
  })
```
## <a name="roles"></a> Roles

* unauthenticated  
* authenticated_without_role  

## <a name="api-versions"></a>API Versions

* Version 1 at /api/v1 OR /api  

## <a name="storage-interfaces"></a> Storage Interfaces
* AnyPresence Storage (Local)  
* TwilioAPI (Http)  
* SendGridAPI (Http)  
