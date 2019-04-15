module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.on("joinRequest", (mreq, cb) => {
            socket.join(mreq.sender);

            cb();
        })

        socket.on("client-friend-request", (params, cb) => {
            // console.log(params)
            io.to(params.receiver).emit('server-friend-request', {
                from: params.sender,
                to: params.receiver
            })

            cb();
        })
    });
}


