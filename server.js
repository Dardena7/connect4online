//IMPORTS
var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	favicon = require('serve-favicon'),
	session = require('express-session')({
		secret : 'secret-session',
		resave : true,
		saveUninitialized : true
	}),
	sharedsession = require('express-socket.io-session'),

	tools = new(require('./models/Tools'))(),
	User = require('./models/User');
	Lobby = require('./models/Lobby');

//users connected
var lobby = new Lobby(); 

//MIDDLEWARES
app.use(session)
.use(function(req, res, next){
	if(typeof(req.session.uid) == 'undefined')
		req.session.uid = tools.makeId(lobby.usersList);
	next();
})
.use(favicon(__dirname + '/public/favicon.ico'))


//ROUTES
.get('/', function(req, res) {
	console.log("session id : "+req.session.uid);
	res.render('lobby.ejs');
})

.get('/room', function(req, res){
	res.render('room.ejs');
});


//SOCKET.IO
io.use(sharedsession(session));

io.on('connection', function(socket) {
	//On connection
	socket.sessionid = socket.handshake.session.uid;
	socket.selfRoom = 'selfRoom'+socket.sessionid;
	socket.join(socket.selfRoom);
	var user = lobby.getUser(socket.sessionid); //Return false if not exists
	if(user){
		user.addSocketId(socket.id);
		if(user.room != 0){
			socket.join(user.room);
			socket.emit('changeButton', {room: user.room, type : "leave"});
		}
	}
	else{
		user = new User(socket.sessionid, socket.id);
		lobby.addUser(user);
	}
	socket.user = user;


	console.log('Lobby :: user '+socket.id+' connected');
	console.log(lobby.usersList);

	socket.on('disconnect', function(){
		socket.user.deleteSocketId(socket.id);
		if(user.socketIds.length == 0)
			lobby.deleteUser(user);

		console.log('Lobby :: user '+socket.id+' disconnected');
		console.log(lobby.usersList);
	});

	socket.on('tellToJoinRoom', function(room){
		socket.to(socket.selfRoom).emit('joinRoom', room);
		socket.join(room);
		socket.emit('changeButton', {room: room, type : "leave"});
		socket.user.room = room;
		var announcement = 'Hello '+room+' '+ 'Je suis '+socket.id;
		socket.to(room).emit('announcement', announcement);
		console.log('TellJoinOk');
	});

	socket.on('joinRoom', function(room){
		socket.join(room);
		socket.emit('changeButton', {room: room, type : "leave"});
		var announcement = 'Hello '+room+' '+ 'Je suis '+socket.id;
		socket.to(room).emit('announcement', announcement);
		console.log('JoinOk');
	});

	socket.on('tellToLeaveRoom', function(room){
		socket.to(socket.selfRoom).emit('leaveRoom', room);
		socket.leave(room);
		socket.emit('changeButton', {room: room, type : "join"});
		socket.user.room = 0;
		var announcement = 'Je quitte '+room+' '+ 'Je suis '+socket.id;
		socket.to(room).emit('announcement', announcement);
		console.log('TellLeaveOk');
	});

	socket.on('leaveRoom', function(room){
		socket.leave(room);
		socket.emit('changeButton', {room: room, type : "join"});
		var announcement = 'Je quitte '+room+' '+ 'Je suis '+socket.id;
		socket.to(room).emit('announcement', announcement);
		console.log('LeaveOk');
	});

	socket.on('helloRoom', function(){
		console.log(lobby.usersList)
		if(socket.user.room != 0){
			var msg = 'Hello room n°'+socket.user.room+'. I\'m socket '+socket.id;
			socket.to(socket.user.room).emit('announcement', msg);
		}
	});

});


//LISTEN
const port = process.env.PORT || 8080;
http.listen(port);