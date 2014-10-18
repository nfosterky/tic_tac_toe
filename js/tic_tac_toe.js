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

	function getElemColor (playerElem) {
		var style = window.getComputedStyle(playerElem);
		return style.getPropertyValue("background-color");
	}

	window.onload = function() {
		var player1 					= player("p_1", 1, false),
				player2						= player("p_2", 2, true),
				playerCurrent 		= player1,
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

		function getGameType() {
	    var radios = document.getElementsByName("gameType");

	    for (var i = 0; i < radios.length; i++) {
	      if (radios[i].checked) {
	        return radios[i].value;
	      }
	    }

	    return null;
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

		function isGameOver() {
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
		}

		function moveComputer () {
			var cell,
				randomCellIndex,
				cellsTried = [];
			for (var i = 0, l = cells.length; i < l; i++) {
				randomCellIndex = Math.floor((Math.random() * (l - 1)) + 1);

				if (cellsTried.indexOf(randomCellIndex) === -1) {
					cell = cells[randomCellIndex];
					cellsTried.push(randomCellIndex);

					if (cell.dataValue === INIT_CELL_VALUE) {
						clickCell(cell)();
						return;
					}
				}
			}
		}

		function changePlayer () {
			playerCurrent.class.remove(CLASS_CURRENT_PLAYER);

			if (playerCurrent.id === 1) {
				player2.class.add(CLASS_CURRENT_PLAYER);
				playerCurrent = player2;

				if (getGameType() == 2) {
					moveComputer();
				}

			} else {
				player1.class.add(CLASS_CURRENT_PLAYER);
				playerCurrent = player1;
			}
		}

		function clickCell (cell) {
			return function () {
				var elem = cell ? cell : this;

				if (!winner) {
					if (elem.dataValue === INIT_CELL_VALUE) {
						elem.style.backgroundColor = playerCurrent.color;
						elem.dataValue = playerCurrent.dataValue;
						moveCount++;
						isGameOver();
						changePlayer();
					}

				} else {
					if (confirm("Start a new game?")) {
						resetGame();
					}
				}
			};
		}

		function clickRadio () {
			return function () {
				resetGame();
			};
		}

		function resetGame () {
			var len = cells.length,
				i;

			console.log(playerCurrent);
			if (playerCurrent.dataValue === 2) {
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
		}

		function initGame () {
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

		}


		initGame();

		btnNewGame.onclick = resetGame;
	};

})(window, document);
