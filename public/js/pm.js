$(document).ready(function() {
    let socket = io();
    let pathName = window.location.pathname;
    let splitName = pathName.split("/").pop();

    let receiverName = splitName.split(".")[0];
    let senderName = splitName.split(".")[1];

    // console.log(splitName)

    $("#receiver_name").text(decodeURIComponent(receiverName.replace(/-/g, " ")));

    socket.on('connect', () => {
        socket.emit('join-pm', {
            receiverName,
            senderName
        });

        socket.on("server-displayMessage", () => {
            setTimeout(() => {
                $("#reload").load(location.href + " #reload")
            }, 1000)
        });
    })

    socket.on("server-newPmMessage", (message) => {
        console.log("server-newPmMessage", message, senderName);
        let template = $("#template-message").html();
        if(message.sender.toLowerCase() != decodeURIComponent(senderName).replace(/-/g, " ").toLowerCase()) {
            template = $("#template-message-left").html();
        }
        

        let newmessage = Mustache.render(template, {
            username: message.sender,
            text: message.msg
        });

        $("#messages").append(newmessage);
    });

    
    $("#message_form").submit(function (e) {
        e.preventDefault();
        let message = {};
        message.msg = $("#message_form #msg").val();

        if(message.msg.trim().length <= 0) return false;

        message.sender = $("#name-user").val();
        message.room = splitName;
        socket.emit("client-newPmMessage", message);

        $.ajax({
            url: `/chat/${splitName}`,
            type: 'POST',
            data: {message: message.msg},
            success: function() {
                console.log("success")
            }
        })

        $(this).find("#msg").val('');
    });
    


})