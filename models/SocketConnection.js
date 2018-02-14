module.exports = class SocketConnection {
	constructor(socket) {
		var self = this;
		this.socket = socket;
		this.lobby = socket.lobby;
		this.user = socket.user;
		this.socketId = socket.id;
		this.sessionRoom = 'sessionRoom'+this.user.sessionid;

		
		this.user.addSocketId(socket.id);
		this.joinSessionRoom();
		this.joinGameRoom();
		this.refreshView();


		this.socket.on('disconnect', function(){
			self.user.deleteSocketId(self.socketId);
			if(self.user.socketIds.length == 0)
				self.lobby.usersList.splice(self.lobby.usersList.indexOf(self.user), 1);
		});

		this.socket.on('tellToJoinRoom', function(gameRoom){
			this.to(self.sessionRoom).emit('joinRoom', gameRoom);
			this.join(gameRoom);
			self.user.gameRoom = gameRoom;
			self.refreshView();
		});

		this.socket.on('joinRoom', function(gameRoom){
			this.join(gameRoom);
			self.refreshView();
		});

		this.socket.on('tellToLeaveRoom', function(gameRoom){
			this.to(self.sessionRoom).emit('leaveRoom', gameRoom);
			this.leave(gameRoom);
			self.user.gameRoom = "none";
			self.refreshView();
		});

		this.socket.on('leaveRoom', function(gameRoom){
			this.leave(gameRoom);
			self.refreshView();
		});

		this.socket.on('helloRoom', function(){
			var msg = 'Hello room n°'+self.user.gameRoom+'. I\'m socket '+self.socketId;
			this.to(self.user.gameRoom).emit('announcement', msg);
		});
	}

	joinSessionRoom() {
		this.socket.join(this.sessionRoom);
	}

	joinGameRoom() {
		if(this.user.gameRoom != "none") {
			this.socket.join(this.user.gameRoom);
		}
	}

	refreshView() {
		if(this.user.gameRoom == "none")
			this.socket.emit('changeButton', {gameRoom: "room1", name: "Salon 1", type : "join"});
		else
			this.socket.emit('changeButton', {gameRoom: "room1", name: "Salon 1", type : "leave"});
	}
}