module.exports = function(io){
    io.on('connection', (socket) => {
        socket.on('join private msg', (pm) => {
            socket.join(pm.room1);
            socket.join(pm.room2);
        })
        socket.on('private message', (message, callback) => {
            // console.log(message);
            io.to(message.room).emit('new message', {
                text: message.text,
                sender: message.sender
            })
            io.emit('message display', {});
            callback();
        });

        socket.on('refresh', function(refresh){
            io.emit('new refresh', {})
        });
    })
}