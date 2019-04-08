const Users = require("../helpers/UsersClass");

module.exports = (io) => {
    const users = new Users();
    io.on("connection", (socket) => {
        console.log("user connected");
        let socketId = socket.id;
        // Add user in aarray so that can get list user online
        socket.on("join", (params, cb ) => {
            users.addUserData(socketId, params.sender, params.room);
            socket.join(params.room);
            io.to(params.room).emit('server-users-list', users.getUsserList(params.room));
            cb();
        })

        socket.on('client-newmessage', (message) => {
            io.to(message.room).emit("server-newmessage", (message));
        })

        socket.on("disconnect", () => {
            let userRemove = users.removeUser(socket.id);
            let roomOut = userRemove && userRemove.room
            io.to(roomOut).emit('server-users-list', users.getUsserList(roomOut));
        })

    });
}