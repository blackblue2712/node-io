class Global {
    constructor() {
        this.globalRoom = [];
    }

    enterRoom(id, name, room, img) {
        let user = {id, name ,room, img};
        this.globalRoom.push(user);
        return user;
    }

    getUser(id) {
        return this.globalRoom.filter(user => user.id === id)[0];
    }

    getRoomList(room) {
        let usersOfARoom = this.globalRoom.filter( user => user.room === room);
        // console.log(usersOfARoom)
        return usersOfARoom.map( user => {
            return {username: user.name, userImage: user.img};
        });
    }

    removeUser(id) {
        let user = this.getUser(id);
        if(user) {
            this.globalRoom = this.globalRoom.filter(user => {
                return user.id !== id;
            })
        }
        return user;
    }

}

module.exports = {Global};