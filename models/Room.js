var Game = require('./Game/Game');
module.exports = class Room {
	constructor(roomid, user) {
		this.id = roomid;
		this.roomName = "room"+roomid;
		this.players = [user];
		this.isFull = false;
		this.ready = false;
		this.game = 'none';
	}

	launchGame() {
		if(this.isFull)
			this.game = new Game();
	}

	addPlayer(user) {
		if(!this.isFull){
			this.players.push(user);
			if(this.players.length == 2)
				this.isFull = true;
		}
		this.setReady();
	}

	deletePlayer(user) {
		if(this.players.includes(user)){
			this.players.splice(this.players.indexOf(user), 1);
			this.isFull = false;
		}
		this.setNotReady();
	}

	isFull() {
		return this.isFull;
	}

	isEmpty() {
		return this.players.length == 0;
	}

	setReady() {
		if(this.players.length == 2)
			this.ready = true;
	}

	setNotReady() {
		if(this.players.length < 2)
			this.ready = false;
	}

	getTurnUser() {
		return this.players[this.game.player - 1];
	}
}