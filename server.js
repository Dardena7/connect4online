var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var favicon = require('serve-favicon');
var User = require('./models/User');
var UsersList = require('./models/UsersList');

var users_list = []; 

app.use(favicon(__dirname + '/public/favicon.ico'))

.get('/', function(req, res) {
	res.render('lobby.ejs');
});


io.on('connection', function(socket) {
	socket.user = new User(socket.id);
	users_list.push(socket.user);
	console.log('user'+socket.id+' connected');
	console.log(users_list);

	socket.on('disconnect', function(){
		users_list.splice(users_list.indexOf(socket.user), 1);
		console.log('user'+socket.id+' disconnected');
		console.log(users_list);
	});
});


const port = process.env.PORT || 8080;
http.listen(port);