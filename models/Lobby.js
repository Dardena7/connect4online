var Room = require('./Room');
module.exports = class Lobby {
	constructor() {
		this.usersList = [];
		this.roomsList = []; 
	}

	createRoom(roomid, user) {
		this.roomsList.push(new Room(roomid, user));
	}

	getRoom(roomName) {
		for(var i = 0; i < this.roomsList.length; ++i)
			if(this.roomsList[i].roomName == roomName)
				return this.roomsList[i];
		return "none";
	}

	deleteRoom(room) {
		if(this.roomsList.includes(room))
			this.roomsList.splice(this.roomsList.indexOf(room), 1);
	}

	getUserById(sessionid) {
		for(var i = 0; i < this.usersList.length; ++i)
			if(this.usersList[i].sessionid == sessionid)
				return this.usersList[i];
		return false;
	}

	addUser(user) {
		this.usersList.push(user);
	}

	deleteUser(user) {
		if(this.usersList.includes(user))
			this.usersList.splice(this.usersList.indexOf(user), 1);
	}

	addUserToRoom(roomName, user) {
		var room = this.getRoom(roomName);
		room.addPlayer(user);
	}

	deleteUserFromRoom(roomName, user) {
		var room = this.getRoom(roomName);
		room.deletePlayer(user);
		if(room.isEmpty())
			this.deleteRoom(room);
	}

}