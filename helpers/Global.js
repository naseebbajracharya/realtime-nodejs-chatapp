class Global {
    constructor(){
        this.globalRoom = [];
    }
    EnterRoom(id, name, room, img){
        var roomName = {
            id: id,
            name: name,
            room: room,
            img: img
        }
        this.globalRoom.push(roomName);
        return roomName;
    }

    GetRoomList(room){
        var roomName = this.globalRoom.filter((user) => {
            return user.room === room;
        })
        var namesArray = roomName.map((user) => {
            return {
                name: user.name,
                img: user.img
            }
        })
        return namesArray;
    }
}

module.exports = {Global};