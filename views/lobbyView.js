var view_position = 'lobby';

var lobby_view = {
	nb_players : 0,
	rooms_list : []
}

var room_view = "none";

function refresh_view() {
	var view;
	console.log(view_position);
	if(view_position == 'lobby')
		view = get_lobby_view();
	else if(view_position == 'room')
		view = get_room_view();
	else if(view_position == 'game')
		view = get_game_view();
	else if(view_position == 'left')
		view = get_left_view();
	$('#view').html(view);
}

function refresh_rooms_list_view() {
	$('#rooms_list').html(get_room_list_view);
}

function refresh_nb_players_view() {
	$('#nb_players').text(lobby_view.nb_players);
}

function get_lobby_view() {
	var view = "";
	view += "<h1>Bienvenue sur Connect4Online</h1>";
	view += "<p>Il y a <span id='nb_players'>"+lobby_view.nb_players+"</span> joueurs connectés.</p>";
	view += "<button onlick='createRoom()' class='btn btn-primary'>Créer salon</button>";
	view += "<div id='rooms_list'>";
	view += get_rooms_list_view();
	view += "</div>";
}

function get_room_view() {
	var view = "";
	view += "<h1>Vous êtes dans le salon n°"+room_view.id;
	view += "<p>Nombre de joueurs dans le salon : "+room_view.nb_players+"/2</p>";
	if(room_view.ready)
		view += "Le jeu va bientôt démarrer";
}

function get_game_view() {
	var view = '';
	view += "<h1>Bienvenue dans le jeu</h1>";
	return view;
}

function get_left_view() {
	var view = '';
	view += "<h1>Vous êtes dans le salon n°"+room_view.id;
	view += "<p>Votre adversaire a quitté la partie ! Vous allez être redirigé vers l'accueil dans quelques instants</p>";
	return view;
}

function get_room_list_view() {
	var view = '';
	for(var i = 0; i < lobby_view.rooms_list.length; ++i){
		view += "<div style:'display : inline-block'>";
		view += "<p>Salon n°"+i+"</p>";
		if(lobby.rooms_list[i].isFull)
			view += "<p>Salon complet</p>";
		else
			view += "<button onclick='joinRoom(\""+rooms_list[i].room_name+"\")' class='btn btn-success'>Rejoindre</button>";
		view += "</div>";
	}
	return view;
}