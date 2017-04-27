var users = require('./server/controllers/users.js')
var messages = require('./server/controllers/messages.js')
var channels = require('./server/controllers/channels.js')
var conversations = require('./server/controllers/conversations.js')

var logged_users = 0;

module.exports = function(server){
    var io = require('socket.io').listen(server);
    io.sockets.on('connection', function (socket) {
        // console.log("Sockets are enabled on this application!");
        // console.log(socket.id);
        socket.on('new_message', function(data){
            io.emit('refresh_chat', {type: data.type, id: data.id})
        });
        socket.on("newUser", function(data){
            io.emit("showNotification", {name: data.name})
        });
    });
}
