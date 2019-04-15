module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.on('join-pm', (params) => {
            socket.join(`${params.receiverName}.${params.senderName}`);
            socket.join(`${params.senderName}.${params.receiverName}`);
        });

        socket.on("client-newPmMessage", (message) => {
            io.to(message.room).emit("server-newPmMessage", (message));

            io.emit("server-displayMessage");
        })
    })
}