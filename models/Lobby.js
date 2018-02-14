module.exports = class Lobby {
	constructor() {
		this.usersList = []; 
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

}