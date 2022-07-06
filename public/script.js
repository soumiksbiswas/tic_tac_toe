var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame(); // this function will also be called each time the user clicks on Replay button

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys()); 
	for (var i = 0; i < 9; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color'); // we turn the cells to blue or red depending on who wins. This line is used to revert the cells back to their original colour
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') { // we need to make sure that the square is not previously clicked already. 
                    // If it was not clicked already, the cell content would still be a number, else it would be replaced by 'X' or 'O'
		turn(square.target.id, huPlayer); // "event.target.id" refers to the element that triggered the event
		if (!checkTie()) turn(bestSpot(), aiPlayer); // if it's not a tie, the aiPlayer takes the turn
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player; // origBoard[squareId] becomes equal to 'O' or 'X' based on who's turn it is
	document.getElementById(squareId).innerText = player; // 'O' or 'X' displays in that cell
    let gameWon=checkWin(origBoard, player); // each time a player takes a turn, after making the chnage in the origBoard, we will pass the origBoard and check whether the current player has won or not 
    if(gameWon) gameOver(gameWon); // if no one wins on the current turn, gameWon would be NULL
}

function checkWin(board, player) {  // we are not using the global 'origBoard' variable in this function, because here we will pass a different version of the board than the origBoard
	let plays = board.reduce((a, e, i) =>    // reduce method goes through every element of the 'board' array and returns a single value. 
    (e == player) ? a.concat(i) : a, []);    // Here, we are going to return the value of the accumulator 'a' at the end. We initialise the accumulator with an empty array. 
                                             // 'e' is the element in the array we are going through, and 'i' is the current index
    let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) { // has the player in every spot that counts as a win
			gameWon = {index: index, player: player}; // "index"= the index of winCombos that has resulted in the winning of the player
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red"; // blue means human won, red means computer won
	}
	for (var i = 0; i < 9; i++) {
		cells[i].removeEventListener('click', turnClick, false); // game is over, so user can't click anymore
	}
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block"; // 'endgame' style was set as none, but now we need to show the block 
	document.querySelector(".endgame .text").innerText = who; // in the HTML, 'text' is another class inside 'endgame'
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number'); // if the square content is still a number, that means it's empty
}

function bestSpot() { // returns the best squares that are still empty, i.e. not clicked
	return minimax(origBoard, aiPlayer).index; // minimax function returns an object, and 'index' is the index where the aiPlayer should play 
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < 9; i++) {
			cells[i].style.backgroundColor = "green"; // if tied, squares are turned green
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false; // not a tie
}


function minimax(newBoard, player){

    var availSpots=emptySquares(newBoard); // returns an array of empty spots

    if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}

    var moves = []; 
    for(var i=0;i<availSpots.length;i++)
    {
        var move={}; // creating an object
        move.index=newBoard[availSpots[i]];
        newBoard[availSpots[i]]=player;

        if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

        newBoard[availSpots[i]] = move.index;
        moves.push(move); // the 'move' object is pushed into the 'moves' array  
    }

    var bestMove;
    if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove]; // finally, minimax returns the object with the best move
}