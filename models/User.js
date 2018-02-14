module.exports = class User {
	constructor(sessionid){
		this.sessionid = sessionid;
		this.socketIds = [];
		this.gameRoom = "none";
	}

	addSocketId(socketId) {
		if(!this.socketIds.includes(socketId))
			this.socketIds.push(socketId);
	}

	deleteSocketId(socketId) {
		if(this.socketIds.includes(socketId))
			this.socketIds.splice(this.socketIds.indexOf(socketId), 1);
	}

	hello() {
		console.log('hello');
	}
}