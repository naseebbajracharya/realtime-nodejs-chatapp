$(document).ready(function(){
    var socket = io();
    var room = $('#groupName').val();
    var sender = $('#sender').val();
    var userPic = $('#name-image').val();
    socket.on('connect', function(){
        console.log('Yeah the user is connected!');
        var params = {
            room: room,
            name: sender
        }
        socket.emit('join', params, function(){
            console.log('User has joined this channel')
        })
    });

    socket.on('usersList', function(users){
        // console.log(users);
        var ol = $('<ol></ol>');

        for(var i = 0; i < users.length; i++){
            ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a></p>');
        }
        $(document).on('click','#val', function(){
            $('#name').text('@'+$(this).text());
            $('#receiverName').val($(this).text());
            $('#nameLink').attr("href", "/view-profile/"+$(this).text())
        });
        $('#numValue').text(''+users.length+'');
        $('#users').html(ol);
    })

    socket.on('newMessage', function(data){
        // console.log(data.text);
        // console.log(data.room);
        // console.log(data.from);

        var template = $('#message-template').html();
        //using mustache render method 
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.from,
            userImage: data.image
        });

        $('#messages').append(message);
    })

    $('#message-form').on('submit', function(e){
        e.preventDefault();
        var msg = $('#msg').val();

        socket.emit('createMessage', {
            text: msg,
            room: room,
            from: sender,
            userPic: userPic
        }, function(){
            $('#msg').val('');
        })

        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                message: msg,
                groupName: room
            },
            success: function(){
                $('#msg').val('');
            }
        })
    })
});