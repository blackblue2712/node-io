$(document).ready(function() {
    var socket = io();
    let room = "GlobalRoom";
    let username = $("#name-user").val();
    let userImage = $("#name-image").val();
    socket.on('connect', () => {
        socket.emit("global-room", {
            room,
            username,
            userImage
        })
    });

    socket.on("loggedInUser", (users) => {
        let friends = $(".friend").text();
        let friend = friends.split("@");
        let arr = [];
        let ol = $("<div></div>");
        for(let i = 0; i < users.length; i++) {
            if(friend.indexOf(users[i].username) !== -1) {
                let tag = `<div style='display:flex;align-items: center; padding: 5px 2px'><img src="https://placehold.it/300x300" class="img-circle" style="width: 50px">
                    <a href="/chat/${users[i].username.replace(/ /g, "-").toLowerCase()}.${username.replace(/ /g, "-").toLowerCase()}" style="margin-left: 10px">${users[i].username.toLowerCase()}</a>
                    <span class="fa fa-circle online_friend pull-right"></sapn></div>`;
                arr.push(users[i])
                ol.append(tag)
            }
        }
        console.log(arr)
        $("#numOfFriends").text(`(${arr.length})`);
        $('.onlineFriends').html(ol);
    });

    $(document).on("click", ".message-notification", function(e) {
        // e.preventDefault();
        const senderId = $(this).data().id;
        $.ajax({
            url: "/chat/seen",
            type: "POST",
            data: {senderId},
            success: function () {
                console.log("SEEN SUCCESS")
            }
        })
    })


})