app.controller('dashController', ['chatterFactory','socketFactory', '$scope','$rootScope', '$location','$routeParams','$cookies', function(chatterFactory, socketFactory, $scope, $rootScope, $location, $routeParams, $cookies) {
    $scope.glue = true;
    $scope.errors = {};
    $scope.channels = {};
    $scope.users = {};
    $scope.conversations = {};
    $scope.currConversation = {};
    $scope.currChannel = {};
    $scope.messages = {};
    $scope.sysNotification = "";
    $scope.user = {};
    //true means channel, false means conversation
    $scope.currType = true;
    var index = function(){
        if(!$cookies.get("user_id") || !$cookies.get("user_name")){
            $scope.showDash = false;
            $location.url('/')
        }
        else{
            $scope.showDash = true;
        }
        chatterFactory.getAll($cookies.get("user_id"), function(data){
            if(data.errors){
                $scope.errors = data.errors;
            }
            else {
                $scope.channels = data.channels;
                $scope.user = data.user;
                $scope.conversations = data.conversations;
                $scope.otherUsers = data.otherUsers;
                socketFactory.signIn($scope.user.user_name)
            }
        })
    }
    index();

    $scope.newConversation = {};
    $scope.createConversation = function(id){
        $scope.newConversation._user1 = $cookies.get("user_id")
        chatterFactory.createConversation(id, $scope.newConversation, function(data){
            if(data.errors){
                $scope.errors = data.errors;
            }
            else{
                $rootScope.loadConversation(data.conversation._id)
            }
        })
    }

    $scope.newChannel = {};
    $scope.createChannel = function(){
        $scope.newChannel._owner = $cookies.get("user_id")
        chatterFactory.createChannel($scope.newChannel, function(data){
            if(data.errors){
                $scope.errors = data.errors;
            }
            else {
            }
            $scope.newChannel = {};
            index();
        })
    }

    $scope.newMessage = {};
    $scope.createMessage = function(type){
        if(type == "conversation"){
            $scope.newMessage.type = "conversation"
        }
        else{
            $scope.newMessage.type = "channel"
        }
        $scope.newMessage._user = $cookies.get("user_id")
        chatterFactory.createMessage($cookies.get("currChat"), $scope.newMessage, function(data){
            if(data.errors){

                $scope.errors = data.errors
            }
            else{
                socketFactory.newMessage($cookies.get("currChat"), $scope.newMessage.type);
            }
            $scope.newMessage = {};
        })
    }

    $rootScope.loadConversation = function(id){
        $cookies.remove("currType");
        $cookies.remove("currChat");
        $cookies.put("currChat", id)
        $cookies.put("currType", "conversation")
        $scope.currType = false
        chatterFactory.loadConversation(id, function(data){
            if(data.errors){
                $scope.errors = data.errors;
            }
            else{
                $scope.currConversation = data.conversation;
                if($scope.currConversation._user1._id == $cookies.get("user_id")){
                    $scope.chattingWith = $scope.currConversation._user2.user_name;
                }
                else{
                    $scope.chattingWith = $scope.currConversation._user1.user_name;
                }
                $scope.messages = data.messages;
            }
        })
    }

    $rootScope.loadChannel = function(id){
        $cookies.remove("currType");
        $cookies.remove("currChat");
        $cookies.put("currChat", id)
        $cookies.put("currType", "channel")
        $scope.currType = true
        chatterFactory.loadChannel(id, function(data){
            if(data.errors){
                $scope.errors = data.errors;
            }
            else{
                $scope.currChannel = data.channel;
                $scope.messages = data.messages;
            }
        })
    }

    $scope.logout = function(){
        $cookies.remove("user_id")
        $cookies.remove("user_name")
        $location.url('/')
    }

    $rootScope.showNotification = function(user){
        $scope.sysNotification = user;
    }


}]);
