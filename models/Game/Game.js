module.exports = class Game {
	constructor(){
		this.board = [
			[0,0,0,0,0,0],
			[0,0,0,0,0,0],
			[0,0,0,0,0,0],
			[0,0,0,0,0,0],
			[0,0,0,0,0,0],
			[0,0,0,0,0,0],
			[0,0,0,0,0,0]
		];
		this.lastPlay = "none";
		this.turn = 1;
		this.player = 1;
		this.status = 'run';
	}

	checkResult() {
		var row = this.lastPlay.row;
		var col = this.lastPlay.col;
		return (
			this.checkHorizontal(row, col) || 
			this.checkVertical(row, col) || 
			this.checkDiagonalLeft(row, col) ||
			this.checkDiagonalRight(row, col) 
		);
	}

	checkHorizontal(row, col) {
		var count = 1;
		count += this.checkLeft(row, col);
		if(count < 4)
			count += this.checkRight(row, col);
		return count >= 4;
	}

	checkVertical(row, col) {
		var count = 1;
		count += this.checkDown(row, col);
		if(count < 4)
			count += this.checkUp(row, col);
		return count >= 4;
	}

	checkDiagonalLeft(row, col) {
		var count = 1;
		count += this.checkRightDown(row, col);
		if(count < 4)
			count += this.checkLeftUp(row, col);
		return count >= 4;
	}

	checkDiagonalRight(row, col) {
		var count = 1;
		count += this.checkRightUp(row, col);
		if(count < 4)
			count += this.checkLeftDown(row, col);
		return count >= 4;
	}

	checkRightDown(row, col) {
		var count = 0;
		++row;
		++col;

		while((row < this.board.length && col < this.board[row].length) && this.board[row][col] == this.player) {
			++count;
			++row;
			++col;
		}
		return count;
	}

	checkLeftDown(row, col) {
		var count = 0;
		--row;
		++col;

		while((row >= 0 && col < this.board[row].length) && this.board[row][col] == this.player) {
			++count;
			--row;
			++col;
		}
		return count;
	}

	checkLeftUp(row, col) {
		var count = 0;
		--row;
		--col;

		while((row >= 0 && col >= 0) && this.board[row][col] == this.player) {
			++count;
			--row;
			--col;
		}
		return count;
	}

	checkRightUp(row, col) {
		var count = 0;
		++row;
		--col;

		while((row < this.board.length && col >= 0) && this.board[row][col] == this.player) {
			++count;
			++row;
			--col;
		}
		return count;
	}

	checkUp(row, col) {
		var count = 0;
		--col;
		while(col >= 0 && this.board[row][col] == this.player) {
			++count;
			--col;
		}
		return count;
	}

	checkDown(row, col) {
		var count = 0;
		++col;
		while(col < this.board[row].length && this.board[row][col] == this.player) {
			++count;
			++col;
		}
		return count;
	}

	checkLeft(row, col) {
		var count = 0;
		--row;
		while(row >= 0 && this.board[row][col] == this.player) {
			++count;
			--row;
		}
		return count;
	}

	checkRight(row, col) {
		var count = 0;
		++row;
		while(row < this.board.length && this.board[row][col] == this.player) {
			++count;
			++row;
		}
		return count;
	}

	checkTurnValid(row) {
		if(row >= 0 && row < this.board.length)
			if(!this.colIsFull(row))
				return true;
		return false;
	}

	changePlayer() {
		if(this.player == 1)
			this.player = 2;
		else
			this.player = 1;
	}

	colIsFull(row) {
		return this.board[row][0] != 0;
	}

	playTurn(row) {
		if(this.checkTurnValid(row)){
			this.setPiece(row);
			if(this.turn >= 7)
				if(this.checkResult())
					this.status = 'win';
			++this.turn;
			if(this.turn > this.board.length * this.board[row].length)
				this.status = 'draw';
			if(this.status == 'run')
				this.changePlayer();
			console.log('done');
			return true;
		}
		else return false;
	}

	setPiece(row) {
		if(this.board[row][this.board[row].length-1] == 0){
			this.board[row][this.board[row].length-1] = this.player;
			this.lastPlay = {row: row, col: this.board[row].length-1};
		}
		else {
			var col = 1;
			var found = false;
			while(col < this.board[row].length && !found){
				if(this.board[row][col] != 0){
					this.board[row][col-1] = this.player;
					this.lastPlay = {row: row, col: col-1};
					found = true;
				}
				++col;
			}
		}
	}

}