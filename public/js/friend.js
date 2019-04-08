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
            data: {receiverName},
            success: function () {
                socket.emit("client-friend-request", {
                    receiver: receiverName,
                    sender: sender
                }, function () {
                    console.log("Request sent")
                });
            }
        });
    
    });

    socket.on("server-friend-request", (params) => {
        console.log(params)
    })

});