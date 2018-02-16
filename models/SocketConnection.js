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
		this.updateNbPlayers();
		this.initializeView();


		this.socket.on('disconnect', function(){
			self.user.deleteSocketId(self.socketId);
			if(self.user.socketIds.length == 0)
				self.lobby.usersList.splice(self.lobby.usersList.indexOf(self.user), 1);
			self.leaveRoomOnDisconnect();
			self.updateNbPlayers();
		});

		this.socket.on('createRoom', function() {
			if(self.user.gameRoom == "none"){
				var roomid = Date.now(); 
				self.createRoom(roomid);
				self.joinRoom(self.user.gameRoom);
				self.updateLobbyRooms();
				self.updateRoom('join', self.user.gameRoom);
			}
		});

		this.socket.on('tellToJoinRoom', function(gameRoom){
			self.addUserToRoom(gameRoom);
			self.joinRoom(gameRoom);
			self.updateLobbyRooms();
			self.updateRoom('join', gameRoom);
			this.to(gameRoom).emit('updateRoom', {type: "update", room: self.lobby.getRoom(gameRoom)});
			self.launchGame(gameRoom);
		});

		this.socket.on('joinRoom', function(gameRoom){
			this.join(gameRoom);
			self.updateRoom('join', gameRoom);
		});

		this.socket.on('tellToLeaveRoom', function(gameRoom){
			console.log('ok');
			self.leaveRoom(gameRoom);
			self.deleteUserFromRoom(gameRoom);
			self.updateLobbyRooms();
			self.updateRoom('leave', 'none');
		});

		this.socket.on('leaveRoom', function(gameRoom){
			this.leave(gameRoom);
			self.updateRoom('leave', 'none');
		});

	}

	launchGame(gameRoom) {
		var room = this.lobby.getRoom(gameRoom);
		var socket = this.socket;
		setTimeout(function(){
			room.launchGame();
			if(room.game != 'none'){
				socket.emit('updateRoom', {type: 'game', room: room});
				socket.to(gameRoom).emit('updateRoom', {type: 'game', room: room});
			}
		}, 3000);
	}

	createRoom(roomid) {
		this.lobby.createRoom(roomid, this.user);
		this.user.gameRoom = 'room'+roomid;
	}

	addUserToRoom(roomName) {
		this.lobby.addUserToRoom(roomName, this.user);
		this.user.gameRoom = roomName;
	}

	joinRoom(gameRoom) {
		var room = this.lobby.getRoom(gameRoom); 
		this.socket.join(this.user.gameRoom);
		this.socket.to(this.sessionRoom).emit('joinRoom', gameRoom);
	}

	deleteUserFromRoom(gameRoom) {
		var room = this.lobby.getRoom(gameRoom);
		console.log(3, room);
		room.deletePlayer(this.user);
		if(room.isEmpty())
			this.lobby.deleteRoom(room);
		this.user.gameRoom = "none";
	}

	leaveRoom(gameRoom) {
		var room = this.lobby.getRoom(gameRoom);
		this.socket.to(gameRoom).emit('updateRoom', {type: "update", room: room});
		this.socket.to(this.sessionRoom).emit('leaveRoom', gameRoom);
		this.socket.leave(gameRoom);
	}

	leaveRoomOnDisconnect() {
		var gameRoom = this.user.gameRoom;
		if(gameRoom != 'none' && this.user.socketIds.length == 0){
			var room = this.lobby.getRoom(gameRoom);
			this.deleteUserFromRoom(gameRoom);
			if(room.game == 'none'){
				this.socket.to(gameRoom).emit('updateRoom', {type: "update", room: room});
				this.updateLobbyRooms();
			}
			else 
				this.socket.to(gameRoom).emit('playerLeft');
		}
	}

	initializeView() {
		var data = {position: "lobby", nbPlayers: 0, roomsList: [], room: "none"};
		data.nbPlayers = this.lobby.usersList.length;
		data.roomsList = this.lobby.roomsList;
		data.room = this.lobby.getRoom(this.user.gameRoom);
		data.position = this.getViewPosition(data.room);
		this.socket.emit('initializeView', data);
	}

	getViewPosition(room) {
		var pos = 'lobby';
		if(room != 'none'){
			pos = 'room'
			if(room.game != 'none')
				pos = 'game';
		}
		return pos;
	}

	updateNbPlayers() {
		this.socket.broadcast.emit('updateNbPlayers', this.lobby.usersList.length);
		this.socket.emit('updateNbPlayers', this.lobby.usersList.length);
	}

	updateLobbyRooms() {
		this.socket.broadcast.emit('updateLobbyRooms', this.lobby.roomsList);
		this.socket.emit('updateLobbyRooms', this.lobby.roomsList);
	}

	updateRoom(type, gameRoom) {
		if(gameRoom != 'none')
			gameRoom = this.lobby.getRoom(gameRoom);
		this.socket.emit('updateRoom', {type: type, room: gameRoom});
	}

	joinSessionRoom() {
		this.socket.join(this.sessionRoom);
	}

	joinGameRoom() {
		if(this.user.gameRoom != "none") {
			this.socket.join(this.user.gameRoom);
		}
	}
}

/*module.exports = class SocketConnection {
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
		this.updateNbPlayers();
		this.initializeView();


		this.socket.on('disconnect', function(){
			self.user.deleteSocketId(self.socketId);
			if(self.user.socketIds.length == 0)
				self.lobby.usersList.splice(self.lobby.usersList.indexOf(self.user), 1);
			self.leaveRoomOnDisconnect();
			self.updateNbPlayers();
		});

		this.socket.on('createRoom', function() {
			if(self.user.gameRoom == "none") 
				self.createRoom();
			self.updateLobbyRooms();
			self.updateRoom('join', self.user.gameRoom);
		});

		this.socket.on('tellToJoinRoom', function(gameRoom){
			self.lobby.addUserToRoom(gameRoom, self.user);
			self.joinRoom(gameRoom);
			self.updateLobbyRooms();
			self.updateRoom('join', gameRoom);
			self.launchGame(gameRoom);
		});

		this.socket.on('joinRoom', function(gameRoom){
			this.join(gameRoom);
			self.updateRoom('join', gameRoom);
		});

		this.socket.on('tellToLeaveRoom', function(gameRoom){
			self.leaveRoom(gameRoom);
			self.updateLobbyRooms();
			self.updateRoom('leave', 'none');
		});

		this.socket.on('leaveRoom', function(gameRoom){
			this.leave(gameRoom);
			self.updateRoom('leave', 'none');
		});

	}

	launchGame(gameRoom) {
		var room = this.lobby.getRoom(gameRoom);
		var socket = this.socket;
		setTimeout(function(){
			room.launchGame();
			if(room.game != 'none'){
				socket.emit('updateRoom', {type: 'game', room: room});
				socket.to(gameRoom).emit('updateRoom', {type: 'game', room: room});
			}
		}, 3000);
	}

	createRoom() {
		var roomid = Date.now();
		this.lobby.createRoom(roomid, this.user);
		this.joinRoom("room"+roomid);
	}

	joinRoom(gameRoom) {
		var room = this.lobby.getRoom(gameRoom); 
		this.user.gameRoom = gameRoom;
		this.socket.to(this.sessionRoom).emit('joinRoom', gameRoom);
		this.socket.join(this.user.gameRoom);
		this.socket.to(gameRoom).emit('updateRoom', {type: "update", room: room});
	}

	leaveRoom(gameRoom) {
		var room = this.lobby.getRoom(gameRoom);
		this.deleteFromRoom(room);
		this.socket.to(gameRoom).emit('updateRoom', {type: "update", room: room});
		this.socket.to(this.sessionRoom).emit('leaveRoom', gameRoom);
		this.socket.leave(gameRoom);
		this.user.gameRoom = "none";
	}

	leaveRoomOnDisconnect() {
		if(this.user.gameRoom != 'none' && this.user.socketIds.length == 0){
			var room = this.lobby.getRoom(this.user.gameRoom);
			this.deleteFromRoom(room);
			this.socket.to(this.user.gameRoom).emit('updateRoom', {type: "update", room: room});
			this.updateLobbyRooms();
		}
	}

	deleteFromRoom(room) {
		room.deletePlayer(this.user);
		if(room.isEmpty())
			this.lobby.deleteRoom(room);
	}

	initializeView() {
		var data = {position: "lobby", nbPlayers: 0, roomsList: [], room: "none"};
		data.nbPlayers = this.lobby.usersList.length;
		data.roomsList = this.lobby.roomsList;
		if(this.user.gameRoom != "none" ){
			data.position = "room";
			data.room = this.lobby.getRoom(this.user.gameRoom);
		}
		this.socket.emit('initializeView', data);
	}

	updateNbPlayers() {
		this.socket.broadcast.emit('updateNbPlayers', this.lobby.usersList.length);
		this.socket.emit('updateNbPlayers', this.lobby.usersList.length);
	}

	updateLobbyRooms() {
		this.socket.broadcast.emit('updateLobbyRooms', this.lobby.roomsList);
		this.socket.emit('updateLobbyRooms', this.lobby.roomsList);
	}

	updateRoom(type, gameRoom) {
		if(gameRoom != 'none')
			gameRoom = this.lobby.getRoom(gameRoom);
		this.socket.emit('updateRoom', {type: type, room: gameRoom});
	}

	joinSessionRoom() {
		this.socket.join(this.sessionRoom);
	}

	joinGameRoom() {
		if(this.user.gameRoom != "none") {
			this.socket.join(this.user.gameRoom);
		}
	}
}*/