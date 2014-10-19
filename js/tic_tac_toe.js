/*
 *	tic_tac_toe.js
 *	author: Nathaniel Foster
 *	description:  A simple tic tac toe game written for Hacker School
 */
var ticTacToe = (function(window, document) {
	var INIT_CELL_COLOR = "",
		CLASS_CURRENT_PLAYER = "player-current",
		OPPONENT_COMPUTER = 2,
		INIT_CELL_VALUE = 0,
		SIZE = 3,
		NUM_CELLS = 9;

	function getElemColor (playerElem) {
		var style = window.getComputedStyle(playerElem);
		return style.getPropertyValue("background-color");
	}

	window.onload = function() {
		var player1 					= player("p_1", 1, false),
				player2						= player("p_2", 2, true),
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
			init: function () {
				var radios = document.getElementsByName("gameType"),
					len = cells.length,
					i;

				for (i = 0; i < len; i++) {
					cells[i].dataValue = INIT_CELL_VALUE;
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

					elem = winner.cloneNode(true);
					elem.appendChild(elemWinnerText);
					elemWinner.appendChild(elem);

				} else if (moveCount === NUM_CELLS) {
					elemTieText.appendChild(tieText);
				}
			},
			getType: function () {
				var radios = document.getElementsByName("gameType");

				for (var i = 0; i < radios.length; i++) {
					if (radios[i].checked) {
						return radios[i].value;
					}
				}

				return null;
			},
			reset: function () {
				var len = cells.length,
					i;

				if (currentPlayer.dataValue === 2) {
					changePlayer();
				}

				for (i = 0; i < len; i++) {
					cells[i].style.backgroundColor = INIT_CELL_COLOR;
					cells[i].dataValue = INIT_CELL_VALUE;
				}

				elemWinner.innerHTML = "";
				elemTieText.innerHTML = "";
				winner = false;
				moveCount = 0;
			},
		};

		function player (elemId, id, isComputer) {
			var elem = document.getElementById(elemId);

			return {
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
				checkForWinningMove: function () {
					var cell;

					for (var i = 0, l = cells.length; i < l; i++) {
						cell = cells[i];

						if (cell.dataValue === INIT_CELL_VALUE) {
							cell.dataValue = this.dataValue;

							if (isThreeInRow() || isThreeInCol() || isThreeInDia()) {
								cell.dataValue = INIT_CELL_VALUE;
								return cell;

							} else {
								cell.dataValue = INIT_CELL_VALUE;
							}
						}
					}
					return false;
				},
				setComputer: function() {
					this.isComputer = true;
				},
				color: getElemColor(elem),
				elem: elem,
				id: id,
				isComputer: isComputer,
				dataValue: id
			};
		}

		function isThreeEqualVals (val1, val2, val3) {
			if (val1.dataValue !== 0 && val1.dataValue === val2.dataValue &&
					val1.dataValue === val3.dataValue ) {

				return true;
			}
			return false;
		}

		function isThreeInRow() {
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

		function isThreeInDia() {
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

		function findRandomCell () {
			var cell,
				randomCellIndex,
				cellsTried = [];

			for (var i = 0, l = cells.length; i < l; i++) {
				randomCellIndex = Math.floor((Math.random() * (l - 1)) + 1);

				if (cellsTried.indexOf(randomCellIndex) === -1) {
					cellsTried.push(randomCellIndex);
					cell = cells[randomCellIndex];

					if (cell.dataValue === INIT_CELL_VALUE) {
						return cell;
					}
				}
			}
			return false;
		}

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

		function clickCell (cell) {
			return function () {
				var elem = cell ? cell : this;

				if (!winner) {

					if (elem.dataValue === INIT_CELL_VALUE) {
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

		function clickRadio () {
			return function () {
				game.reset();
			};
		}

		game.init();

		btnNewGame.onclick = game.reset;
	};

})(window, document);
