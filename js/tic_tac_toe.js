/*
 *	tic_tac_toe.js
 *	author: Nathaniel Foster
 *	description:  A simple tic tac toe game written for Hacker School
 */
var ticTacToe = (function(window, document) {
	var INIT_CELL_COLOR = "",
		CLASS_CURRENT_PLAYER = "player-current",
		INIT_CELL_VALUE = 0,
		SIZE = 3,
		NUM_CELLS = 9;

	function player (elemId, id) {
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
			color: getElemColor(elem),
			elem: elem,
			id: id,
			dataValue: id
		};
	}

	function getElemColor (playerElem) {
		var style = window.getComputedStyle(playerElem);
		return style.getPropertyValue("background-color");
	}

	window.onload = function() {
		var player1 					= player("p_1", 1),
				player2						= player("p_2", 2),
				player_current 		= player1,
				elem_winner 			= document.getElementById("winner"),
				elem_winner_text 	= document.createTextNode("Winner"),
				elem_tie_text 		= document.getElementById("tie_text"),
				tie_text 					= document.createTextNode("Tie! Game Over"),
				btnNewGame 				= document.getElementById("btnNewGame"),
				cells 						= document.querySelectorAll(".cell"),
				winner 						= false,
				grid 							= [[],[],[]],
				moveCount 				= 0,
				row 							= 0,
				len, i;

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

		function isGameOver() {
			var threeInRow = isThreeInRow(),
				threeInCol = isThreeInCol(),
				threeInDia = isThreeInDia(),
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
				elem.appendChild(elem_winner_text);
				elem_winner.appendChild(elem);

			} else if (moveCount === NUM_CELLS) {
				elem_tie_text.appendChild(tie_text);
			}
		}

		function changePlayer () {
			player_current.class.remove(CLASS_CURRENT_PLAYER);

			if (player_current.id === 1) {
				player2.class.add(CLASS_CURRENT_PLAYER);
				player_current = player2;

			} else {
				player1.class.add(CLASS_CURRENT_PLAYER);
				player_current = player1;
			}
		}

		function clickCell () {
			return function () {
				if (!winner) {
						if (this.style.backgroundColor === INIT_CELL_COLOR) {
							this.style.backgroundColor = player_current.color;
							this.dataValue = player_current.dataValue;
							moveCount++;
							isGameOver();
							changePlayer();
						}

					} else {
						alert("Start a new game");
					}
			};
		}


		len = cells.length;
		for (i = 0; i < len; i++) {

			cells[i].dataValue = INIT_CELL_VALUE;
			cells[i].onclick = clickCell();

			grid[row].push(cells[i]);

			if (grid[row].length > SIZE - 1) {
				row++;
			}
		}

		function resetGame () {
			var len = cells.length,
				i;

			for (i = 0; i < len; i++) {
				cells[i].style.backgroundColor = INIT_CELL_COLOR;
				cells[i].dataValue = INIT_CELL_VALUE;
			}

			elem_winner.innerHTML = "";
			elem_tie_text.innerHTML = "";
			winner = false;
			moveCount = 0;
		}

		btnNewGame.onclick = resetGame;
	};
})(window, document);
