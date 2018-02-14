module.exports = class User {
	constructor(sessionid, socketId){
		this.sessionid = sessionid;
		this.socketIds = [socketId];
		this.inGame = false;
		this.room = 0;
	}

	addSocketId(socketId) {
		if(!this.socketIds.includes(socketId))
			this.socketIds.push(socketId);
	}

	deleteSocketId(socketId) {
		if(this.socketIds.includes(socketId))
			this.socketIds.splice(this.socketIds.indexOf(socketId), 1);
	}
}