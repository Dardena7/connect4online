//IMPORTS
var express = require('express')
	app = express(),
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
	Lobby = require('./models/Lobby');
	User = require('./models/User');
	SocketConnection = require('./models/SocketConnection');

//users connected
var lobby = new Lobby(); 

//MIDDLEWARES
app.use(session)
.use(function(req, res, next){
	if(typeof(req.session.sessionid) == 'undefined')
		req.session.sessionid = tools.makeId();
	next();
})
.use(favicon(__dirname + '/public/favicon.ico'))
.use(express.static('public'))


//ROUTES
.get('/', function(req, res) {
	res.render('lobby.ejs');
})

.get('/room', function(req, res){
	res.render('room.ejs');
});


//SOCKET.IO
io.use(sharedsession(session));
io.on('connection', function(socket) {

	var sessionid = socket.handshake.session.sessionid;
	var user = lobby.getUserById(sessionid);
	if(!user){
		user = new User(sessionid);
		lobby.addUser(user);
	}
	socket.lobby = lobby;
	socket.user = user;

	var socketConnection = new SocketConnection(socket);

});


//LISTEN
const port = process.env.PORT || 8080;
http.listen(port);