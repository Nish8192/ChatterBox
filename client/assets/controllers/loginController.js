app.controller('loginController', ['chatterFactory','$scope','$location','$routeParams','$cookies', function(chatterFactory, $scope, $location, $routeParams, $cookies) {



    $scope.newUser = {};
    $scope.returningUser = {};
    $scope.errors = {};
    var index = function(){
        $cookies.remove("user_id")
        $cookies.remove("user_name")
    }
    index();

    $scope.login = function(){
        chatterFactory.createUser($scope.returningUser, function(data){
            if(data.errors){
                $scope.errors = data.errors;
                $location.url('/')
            }
            else{
                $scope.newUser = {};
                $cookies.put("user_id", data._id);
                $cookies.put("user_name", data.user_name);
                $location.url('/dashboard')
            }
        })
    }

    $scope.newConversation = {};
    $scope.reg = function(){
        chatterFactory.createUser($scope.newUser, function(data){
            if(data.errors){
                $scope.errors = data.errors;
                $location.url('/')
            }
            else{
                $scope.newUser = {};
                $cookies.put("user_id", data._id);
                $cookies.put("user_name", data.user_name);
                $location.url('/dashboard')
            }
        })
    }

}]);
