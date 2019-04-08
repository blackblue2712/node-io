class Users {
    constructor() {
        this.users = [];
    }

    getUser(id) {
        return this.users.filter(user => user.socketId === id)[0];
    }

    addUserData(socketId, name, room) {
        let user = {socketId, name ,room};
        this.users.push(user);
        return user;
    }

    getUsserList(room) {
        let usersOfARoom = this.users.filter( user => user.room === room);
        return usersOfARoom.map( user => user.name);
    }

    removeUser(id) {
        let user = this.getUser(id);
        if(user) {
            this.users = this.users.filter(user => {
                return user.socketId !== id;
            })
        }
        return user;
    }
}

module.exports = Users;