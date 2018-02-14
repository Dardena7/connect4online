module.exports = class Tools {
	constructor(){
		this.usedKeys = [];
	}

	makeId() {
		var id = this.generateKey();
		while(this.sameId(id))
			id = this.generateKey();
		this.usedKeys.push(id);
		return id;
	}

	generateKey() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < 5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

	sameId(id) {
		for(var i = 0; i < this.usedKeys.length; ++i)
			if(this.usedKeys[i].id == id)
				return true;
		return false;
	}
}