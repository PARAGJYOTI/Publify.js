/**
 *  Publify.js  || Action Based PubSub Library on top of Socket.io ||
 *  Published : 13-06-2016
 *  Author : paragjyoti2012@gmail.com
 *  Dependency : Socket.io
 *  version : 0.0.9
 */

(function(){
 var Publify=(function(){
/**
 * 
 * Constructor Function 
 *  __proto__:
 *  connectedClients : an Object containing socketids of the Clients connected to Socket .
 *  nameSpace : unique  nameSpace for every user Connnected
 *  io: Socket.io Object Passed as a Parameter At Module Loading.
 *  userid: the stored id of the User
 *  subcriptions : Object , A collection of subscribed actions with callbacks in the format { action : callback}
 *                
 *                  example : { 'ADD_USER' : function(){
 *                                   console.log('user added'),
 *                             'FOLLOW_USER' : function(){
 *                                    console.log('user Followed)}}
 *                             }
 * 
 */



/*** 
 * Nodejs : var io=require('socket.io')(http)
 *          var publify=require('publify')(io)  <== pass the io object
 *          
 *          Publify.init(userid,subcriptions,callback)
 *          Publify.subscribe('SOME_ACTION', function(){...})  //optional
 *          Publify.publish(action)
 * or       Publify.transmit('SOME_OTHER_ACTION', function()){...}
 * 
 * 
 * Browser : <script src='path_to/socket.io.js'></script>
 *           <script src='path_to/publify.js'></script>
 *           
 *          var publify =Publify(io)
 *           Publify.init(userid,subcriptions,callback)
 *          Publify.subscribe('SOME_ACTION', function(){...})  //optional
 *          Publify.publish(action)
 *      es6: 
 *         import Publify from 'publify'
 *         import io from 'socket.io'
 *         const publify=Publify(io)
 *         ......
 * 
 **/



function Publify(io){
    this.io=io;
    this.connectedClients={};
    this.nameSpace='';
    this.userid='';
    this.subcriptions={};
}

//
/**  Publify.publish(action)
 *  action==> Object 
 *  
 * action={
 *    actionName:'Follow',
 *    from:'i567hg090y'
 *    to:  'p0908786f5',
 *    payload: {status:'ok',
 *              message:'hii'}
 * 
 * }
 *   Publify.publish(action)
 */

Publify.prototype.publish=function(action){
    
    this.validateAction(action);
  
    
    
    var Source= action.source || action.from || this.userid;
    var Target=action.target ||action.to;
    var ActionName =action.actionName;
    var Payload =action.payload ||{};
   
    if(this.checkGlobalObject()=='server'){
          if(Array.isArray(Target)!==true){
        if(this.connectedClients[Target])
        
        {  
           
      var x=this.connectedClients[Target].socketid
    
       
        
        if(this.nameSpace.connected[x]){
            this.nameSpace.connected[x].emit(
                ActionName,
                 { From:Source,
                   Payload:Payload,
                   ActionName:ActionName
                }
                ) 
        }
    
                 console.log(ActionName,Source)
    
        }
                   
               
    
    if(Array.isArray(Target)===true){
        for(var i=0;i<Target.length;i++){
            if(this.connectedClients[Target[i]]){
            this.nameSpace.connected[this.connectedClients[Target[i]]].emit(
                ActionName,
                { From:Source,
                   Payload:Payload,
                   ActionName:ActionName
                }
            )
            
            }
        }
    }
    }
   
      }  
    else{
       this.nameSpace.emit(ActionName,
                { From:Source,
                   Payload:Payload,
                   ActionName:ActionName
                })
       console.log('emmited')
    
    }
    
}
    
/**
 * Publify.subscribe(actionName,callback)
 * 
 * Mainly for Clientside Implemetation 
 * Can also be used in server side but not preffered . 
 * Use Publify.init(..,subscriptions,..) instead due to performance reason
 * 
 * example:
 *  
 * Publify.subscribe('FOLLOW_USER' , function(){...})
 * 
 *  */      

Publify.prototype.subscribe=function(action,callback){
    if(this.checkGlobalObject()=='server'){
        this.subcriptions[action]=callback;
        this.init(this.userid,this.subcriptions)
    }
    // this.validateAction(action)
    
    // var Source= action.source || action.from || this.userid;
    // var Target=action.target ||action.to;
    // var ActionName =action.actionName;
    // var Payload =action.payload ||{};
    
    this.nameSpace.on(action,function(Action){
       callback(Action)
    })
    
}

/**
 * For Server Side Implemetation only :
 * 
 * It recieves an action and publishes the same to brower with targeted ids
 * Best For Bidirectional communication like chat.
 * 
 * example : Publify.transmit('MESSAGE', function(){...})
 * 
 * 
 */


Publify.prototype.transmit=function(actionName,callback){
    var self=this;
    this.subscribe(actionName,function(data){
        var action={
            actionName:actionName,
            from:data.From,
            to: data.Target,
            payload:data.Payload
        }
        self.publish(action)
        callback(action)
    })
    
}

/**
 * Validates action Objects
 *  */     
Publify.prototype.validateAction=function(action){
    if(typeof action!=='object'){
        throw new Error('Action must be an Object')
        
    }
    if(!action.actionName ||! action.target){
        throw new Error('Action DoesNot contain valid Property, ActionName or Target is Undefined')
    }
    
    return action
}  

/**
 * 
 * Initializes the Socket connections and listens for subscribed actions 
 * 
 *  userid: the user .
 * subcriptions : Object , A collection of subscribed actions with callbacks in the format { action : callback}
 *                
 *                  example : { 'ADD_USER' : function(){
 *                                   console.log('user added'),
 *                             'FOLLOW_USER' : function(){
 *                                    console.log('user Followed)}}
 *                             }
 * 
 *  callback : optional
 * 
 * 
 *  */    
    
Publify.prototype.init=function(userid,subscriptions,callback){
    this.userid=userid;
    
    if(this.checkGlobalObject()=='server'){
                this.nameSpace=this.io.of('/'+userid)
                
                var self=this;
                
                this.nameSpace.on('connection', function(socket){
                self.connectedClients[self.userid]={
                    'socketid':socket.id
                }
                
                self.socket=socket;
                
           this.subcriptions=subscriptions;
           for(var props in subscriptions){
               socket.on(props,subscriptions[props])
           }
          
  
           
            socket.on('disconnect', function(socket){
                for(var name in self.connectedClients) {
                if(self.connectedClients[name].socketid === socket.id) {
                    delete self.connectedClientslients[name];
                    break;
                }
            }
            })
        
    
    })
    }
    else{
     this.nameSpace= this.io.connect('/'+userid)
     
    
}
}

Publify.prototype.getConnected=function(){
          return this.connectedClients;
  
}

Publify.prototype.getNamespace=function() {
          return this.nameSpace;
}

Publify.prototype.createAction=function(actionName,from,to,payload){
        return action={
            actionName:actionName,
            source:from,
            target:to,
            payload:payload
        }
    
}

Publify.prototype.checkGlobalObject=function(){
    if(typeof module!=='undefined'){
        return 'server'
    }
    if(typeof window!=='undefined'){
       return 'browser'
    }
}

return function(socket){
    return new Publify(socket)
}
})()



if(typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
    module.exports=Publify
    
}
else{
    
    window.Publify= Publify
    
}
})()
