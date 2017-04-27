app.factory('socketFactory', ['$http','$rootScope', function($http, $rootScope) {

  function SocketFactory(){
      	var socket = io.connect();

        this.signIn = function(name){
            socket.emit('newUser', {name: name})
        }

        socket.on("showNotification", function(data){
            $rootScope.showNotification(data.name);
        })

        this.newMessage = function(id, type){
            socket.emit('new_message', {type: type, id: id})
        }
        socket.on('refresh_chat', function(data){
            if(data.type == "channel"){
                $rootScope.loadChannel(data.id)
            }
            else{
                $rootScope.loadConversation(data.id)
            }

        })

    }


  return new SocketFactory();
}]);
