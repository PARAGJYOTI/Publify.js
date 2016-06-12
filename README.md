# Publify.js
Action based PubSub Library on top of Socket.io 
####Making real-time event based code much simpler and maintainable


#Installation
```npm
 npm install --save publify
 ```

## How to Use 
 Publifyjs can be used in both Server and client side.

### On the server side 
```nodejs
 var app = require('express')();
  var server = require('http').createServer(app);
  var io = require('socket.io')(server);
  var publify=require('publify')(io);
```
#### For es6
 ```
 import Publify from 'Publify'
 import io from 'socket.io'
 const publify =Publify(io);
```

### On the client side
```
<script src ='..pathto/socket.io.js'></script>
<script src ='..pathto/publify.js'></script>
 
 <script type='text/javascript'>
 var publify=Publify(io);
 ....
 </script>
```
## API documentation

###Publify.init(userid:string,subsrictions:object , callback:function)


Initializes the Socket connections and listens for subscribed actions 
 
   userid: the user .
   
   subcriptions : Object , A collection of subscribed actions with callbacks in the format { action : callback}
                 
                   example : { 'ADD_USER' : function(){
                                   console.log('user added'),
                              'FOLLOW_USER' : function(){
                                     console.log('user Followed)}}
                              }
  
   callback : optional
  
###Publify.publish(action:object)

#### The action object 
  Properties
  
#### 'actionName' (type : string ):
     Name of the action to be Published
#### 'from' / 'source'(type:string): 
       from whom the the Action is publised
       
#### 'to'/  'target' (type : string or Array):
      The target user id or an Array collection of userids
####  'payload' (type:object):
       data being send to the target

#### example of an action 
```
  
  action={
     actionName:'Follow',
     from:'i567hg090y'
     to:  'p0908786f5',
     payload: {status:'ok',
               message:'hii'}
  
  }
  ```
  
####then publish the action by
    Publify.publish(action)


##Publify.subscribe()


Publify.subscribe(actionName :string,callback:function)
  
  Mainly for Clientside Implemetation 
  Can also be used in server side but not preffered . 
  Use 
    Publify.init(..,subscriptions,..) instead due to performance reason
  
  example:
   
    Publify.subscribe('FOLLOW_USER' , function(){...})


###Publify.transmit(actionname:string,callback:function)
   For Server Side Implemetation only :
  
  It recieves(subscribes) an action and publishes the same to broswer with targeted ids
  Best For Bidirectional communication like chat.
  
  example :
        Publify.transmit('MESSAGE', function(){...})

###Publify.createAction(actionName,from,to,payload)
  
  Returns an Object creating an action 
  For client side Uses
  
###Publify.getConnectedClients()
  Returns connected clients to the namespace 
###Publify.getNameSpace()
  Returns the Namespace that the user created
  
  
  
 
 
 

