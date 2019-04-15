const {Global} = require("../helpers/GlobalClass");
const _ = require("lodash");
module.exports = (io) => {
    const users  = new Global();

    io.on("connection", (socket) => {
        socket.on("global-room", (params) => {
            socket.join(params.room);
            users.enterRoom(socket.id, params.username, params.room, params.userImage);
            const usersArray = users.getRoomList(params.room);
            
            const distinctUsers = _.uniqBy(usersArray, "username");
            io.to(params.room).emit("loggedInUser", distinctUsers);
        });

        socket.on("disconnect", () => {
            let userRemove = users.removeUser(socket.id);
            // console.log("userRemove", userRemove)
            let roomOut = userRemove && userRemove.room;
            io.to(roomOut).emit('loggedInUser', users.getRoomList(roomOut));
        })
    })
}