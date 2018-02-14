module.exports = class Tools {
	constructor(){}

	makeId(usersList) {
		var id = this.generateKey();
		while(this.sameId(id, usersList))
			id = this.generateKey();
		return id;
	}

	generateKey() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < 5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

	sameId(id, usersList) {
		for(var i = 0; i < usersList.length; ++i)
			if(usersList[i].id == id)
				return true;
		return false;
	}
}