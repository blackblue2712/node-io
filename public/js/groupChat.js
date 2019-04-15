$(document).ready( function() {
    var socket = io();
    var room = $("#groupName").val();
    var sender = $("#sender").val();
    // socket.on
    socket.on("connect", () => {
        console.log("client user connected");
        var params = { sender, room };
        socket.emit('join', params, function() {
            console.log(`User connected room ${room}`)
        });
        socket.on("server-users-list", (usersList) => {
            let ol = $("<ol></ol>")

            for(user of usersList) {
                ol.append(`<p><a href="#" id="val" data-toggle="modal" data-target="#myModal">${user}</a></p>`);
            }

            $(document).on("click", "#val", function() {
                $("#myModal #name").text( $(this).text() );
                $("#myModal #sender-name").val( sender );
                $("#myModal #receiverName").val( $(this).text() );
                $("#myModal #nameLink").attr("href", `/profile/${$(this).text()}`)
            })

            $("#numValue").text(`(${usersList.length})`);
            $("#users").html(ol);
        });

        socket.on("server-displayMessage", () => {
            setTimeout(() => {
                $("#reload").load(location.href + " #reload")
            }, 1000)
        });
    })

    socket.on("server-newmessage", (message) => {
        let template = $("#template-message").html();
        console.log(sender, message.sender)
        if(sender !== message.sender) {
            template = $("#template-message-left").html();
        }
        let newmessage = Mustache.render(template, {
            username: message.sender,
            text: message.msg
        });

        $("#messages").append(newmessage);
    })


    $("#message-form").submit( function(e) {
        e.preventDefault();
        let message = {};
        message.msg = $("#message-form #msg").val();
        message.room = room;
        message.sender = sender;
        socket.emit("client-newmessage", message);

        $.ajax({
            url: `/chat/${room}`,
            type: 'POST',
            data: {message: message.msg},
            success: function () {
                console.log("group-message-sent");
            }
        })

        $(this).find("#msg").val('');
    });
})
