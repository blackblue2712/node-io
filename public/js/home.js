$(document).ready(function() {
    var socket = io();

    $("#add-fav").on("submit", function (e) {
        e.preventDefault();
        let idClub = $("#idClub").val();
        let nameClub = $("#nameClub").val();
        $.ajax({
            url: "/addFav",
            type: "POST",
            data: {idClub, nameClub},
            success: function() {
                console.log(nameClub)
            }
        })
    });

    socket.on("server-displayMessage", () => {
        setTimeout(() => {
            $("#reload").load(location.href + " #reload")
        }, 1000)
    });
})