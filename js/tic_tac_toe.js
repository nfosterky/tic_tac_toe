/*
 *	tic_tac_toe.js
 *	author: Nathaniel Foster
 *	description:  A simple tic tac toe game written for Hacker School
 */
var ticTacToe = (function(window, document) {
	var INIT_CELL_COLOR = "",
		CLASS_CURRENT_PLAYER = "player-current",
		OPPONENT_COMPUTER = 2,
		DEFAULT_VALUE = 0,
		SIZE = 3,
		NUM_CELLS = 9;

	// used by player constructor to determine player color
	function getElemColor (playerElem) {
		var style = window.getComputedStyle(playerElem);
		return style.getPropertyValue("background-color");
	}

	window.onload = function() {
		var player1 					= player("p_1", 1),
				player2						= player("p_2", 2),
				currentPlayer 		= player1,
				elemWinner 				= document.getElementById("winner"),
				elemTieText 			= document.getElementById("tie_text"),
				btnNewGame 				= document.getElementById("btnNewGame"),
				gameTypes					= document.getElementsByName("gameType"),
				cells 						= document.querySelectorAll(".cell"),
				winner 						= false,
				grid 							= [[],[],[]],
				moveCount 				= 0,
				row 							= 0,
				len, i;

		var game = {

			// setup grid and initial cell values
			init: function () {
				var radios = document.getElementsByName("gameType"),
					len = cells.length,
					i;

				for (i = 0; i < len; i++) {
					cells[i].dataValue = DEFAULT_VALUE;
					cells[i].onclick = clickCell();

					grid[row].push(cells[i]);

					if (grid[row].length > SIZE - 1) {
						row++;
					}
				}

				for (i = 0; i < radios.length; i++) {
					radios[i].onclick = clickRadio();
				}
			},

			// check if either player has won or if the game has ended in tie.
			isOver: function () {
				var elemWinnerText 	= document.createTextNode("Winner"),
					tieText 					= document.createTextNode("Tie! Game Over"),
					threeInRow 				= isThreeInRow(),
					threeInCol 				= isThreeInCol(),
					threeInDia 				= isThreeInDia(),
					elem = {};

				if (threeInRow || threeInCol || threeInDia) {

					if (threeInRow) {
						winner = threeInRow;

					} else if (threeInCol) {
						winner = threeInCol;

					} else if (threeInDia) {
						winner = threeInDia;
					}

					// winner is one of the grid cells, clone and add winner text
					elem = winner.cloneNode(true);
					elem.appendChild(elemWinnerText);
					elemWinner.appendChild(elem);

				} else if (moveCount === NUM_CELLS) {
					elemTieText.appendChild(tieText);
				}
			},

			// either human-vs-human or human-vs-computer
			getType: function () {
				var radios = document.getElementsByName("gameType");

				for (var i = 0; i < radios.length; i++) {
					if (radios[i].checked) {
						return radios[i].value;
					}
				}

				return null;
			},

			// called by new game button and when game type is changed
			reset: function () {
				var len = cells.length,
					i;

				for (i = 0; i < len; i++) {
					cells[i].style.backgroundColor = INIT_CELL_COLOR;
					cells[i].dataValue = DEFAULT_VALUE;
				}

				elemWinner.innerHTML = "";
				elemTieText.innerHTML = "";
				winner = false;
				moveCount = 0;

				/*
				 *	if opponent is computer && computer's turn
				 *	then have computer make first move
				 */
				if (currentPlayer.dataValue === 2 &&
						game.getType() == OPPONENT_COMPUTER) {

					moveComputer();
				}
			},
		};

		// player constructor
		function player (elemId, id) {
			var elem = document.getElementById(elemId);

			return {

				// used to add highlighting current player
				class: {
					add: function (strClass) {
						elem.className += " " + strClass;
					},
					remove: function (strClass) {
						elem.className = elem.className.slice(
							0,
							elem.className.indexOf(strClass)
						);
					}
				},

				// used by computer to find best move
				checkForWinningMove: function () {
					var cell;

					// loop through cells to check if selecting cell will cause win
					for (var i = 0, l = cells.length; i < l; i++) {
						cell = cells[i];

						if (cell.dataValue === DEFAULT_VALUE) {
							cell.dataValue = this.dataValue;

							if (isThreeInRow() || isThreeInCol() || isThreeInDia()) {
								cell.dataValue = DEFAULT_VALUE;
								return cell;

							} else {
								cell.dataValue = DEFAULT_VALUE;
							}
						}
					}

					return false;
				},
				color: getElemColor(elem),
				elem: elem,
				id: id,
				dataValue: id
			};
		}

		// check if three values are equal
		function isThreeEqualVals (val1, val2, val3) {
			if (val1.dataValue !== 0 && val1.dataValue === val2.dataValue &&
					val1.dataValue === val3.dataValue ) {

				return true;
			}
			return false;
		}

		// check horizontal values
		function isThreeInRow () {
			var len = grid.length,
				val1,
				val2,
				val3;

			for (var i = 0; i < len; i++) {
				val1 = grid[i][0];
				val2 = grid[i][1];
				val3 = grid[i][2];

				if (isThreeEqualVals(val1, val2, val3)) {
					return val1;
				}
			}
			return false;
		}

		// check vertical values
		function isThreeInCol () {
			var len = grid.length,
				val1,
				val2,
				val3;

			for (var i = 0; i < len; i++) {
				val1 = grid[0][i];
				val2 = grid[1][i];
				val3 = grid[2][i];

				if (isThreeEqualVals(val1, val2, val3)) {
					return val1;
				}
			}
			return false;
		}

		// check diagonal values
		function isThreeInDia () {
			var topLeft 		= grid[0][0],
				middle				= grid[1][1],
				bottomRight 	= grid[2][2],
				topRight 			= grid[0][2],
				bottomLeft 		= grid[2][0];

			if (isThreeEqualVals(topLeft, middle, bottomRight)) {
				return topLeft;

			} else if (isThreeEqualVals(topRight, middle, bottomLeft)) {
				return topRight;
			}

			return false;
		}

		// used by moveComputer() to find random cell when there is no better choice
		function findRandomCell () {
			var cell,
				randomCellIndex,
				cellsTried = [];

			for (var i = 0, l = cells.length; i < l; i++) {
				randomCellIndex = Math.floor((Math.random() * (l - 1)) + 1);

				// only check if cell is available once
				if (cellsTried.indexOf(randomCellIndex) === -1) {
					cellsTried.push(randomCellIndex);
					cell = cells[randomCellIndex];

					if (cell.dataValue === DEFAULT_VALUE) {
						return cell;
					}
				}
			}
			return false;
		}

		// select cell for computer
		function moveComputer () {
			var cell = player2.checkForWinningMove();

			if (cell) {
				clickCell(cell)();
				return;
			}

			cell = player1.checkForWinningMove();
			if (cell) {
				clickCell(cell)();
				return;
			}

			cell = findRandomCell();
			clickCell(cell)();
		}

		function changePlayer () {
			currentPlayer.class.remove(CLASS_CURRENT_PLAYER);

			if (currentPlayer.id === 1) {
				player2.class.add(CLASS_CURRENT_PLAYER);
				currentPlayer = player2;

				if (game.getType() == OPPONENT_COMPUTER) {
					moveComputer();
				}

			} else {
				player1.class.add(CLASS_CURRENT_PLAYER);
				currentPlayer = player1;
			}
		}

		// returns a function that can be called to select cell
		function clickCell (cell) {
			return function () {

				// this === cell when a cell is physically clicked
				var elem = cell ? cell : this;

				if (!winner) {

					if (elem.dataValue === DEFAULT_VALUE) {
						elem.style.backgroundColor = currentPlayer.color;
						elem.dataValue = currentPlayer.dataValue;
						moveCount++;
						game.isOver();
						changePlayer();
					}

				} else if (confirm("Start a new game?")) {
					game.reset();
				}
			};
		}

		// called when opponent type is changed
		function clickRadio () {
			return function () {
				game.reset();
			};
		}

		game.init();

		btnNewGame.onclick = game.reset;
	};

})(window, document);
