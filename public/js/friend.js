$(document).ready(function() {
    var socket = io();
    var room = $("#groupName").val();
    var sender = $("#sender").val();

    socket.on("connect", () => {
        let params = { sender };

        socket.emit("joinRequest", params, () => {
            console.log("FRIEND - JOINED");
        })
    })

    $("#add_friend").on("submit", function (e) {
        e.preventDefault();
        let receiverName = $("#receiverName").val();
        console.log(receiverName)
        $.ajax({
            url: `/group/${room}`,
            type: "POST",
            data: {receiverName, room}
        }).done(function() {
            socket.emit("client-friend-request", {
                receiver: receiverName,
                sender: sender
            }, function () {
                console.log("Request sent")
            });
        });
    
    });

    socket.on("server-friend-request", (params) => {
        // console.log("SERVER FRIEND REQUEST", params);
        $("#reload").load(location.href + " #reload");

        $(document).on('click', "#accept_friend", function() {
            let senderId = $("#senderId").val();
            let senderName = $("#senderName").val();
            $.ajax({
                url: `/group/accept/${room}`,
                type: 'POST',
                data: {senderId, senderName},
                success: function() {
                    $(this).parent().eq(1).remove();
                }
            })
            $("#reload").load(location.href + " #reload");
        });

        // Cancel request
        $(document).on('click', "#cancel_friend", function() {
            let senderIdCancel = $("#senderIdCancel").val();
            $.ajax({
                url: `/group/cancel/${room}`,
                type: 'POST',
                data: {senderIdCancel},
                success: function() {
                    $(this).parent().eq(1).remove();
                }
            })
            $("#reload").load(location.href + " #reload");
        });


    });

    $("#accept_friend").on('click', function() {
        let senderId = $("#senderId").val();
        let senderName = $("#senderName").val();
        $.ajax({
            url: `/group/accept/${room}`,
            type: 'POST',
            data: {senderId, senderName},
            success: function() {
                $(this).parent().eq(1).remove();
            }
        })
        $("#reload").load(location.href + " #reload");
    });

     // Cancel request
     $( "#cancel_friend").on('click', function() {
        let senderIdCancel = $("#senderIdCancel").val();
        console.log(senderIdCancel)
        $.ajax({
            url: `/group/cancel/${room}`,
            type: 'POST',
            data: {senderIdCancel},
            success: function() {
                $(this).parent().eq(1).remove();
            }
        })
        $("#reload").load(location.href + " #reload");
    });

    

});