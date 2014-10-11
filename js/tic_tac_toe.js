/*
 *	tic_tac_toe.js
 *	author: Nathaniel Foster
 *	description:  A simple tic tac toe game written for Hacker School
 */
var ticTacToe = (function() {
	var INIT_CELL_COLOR = "",
		INIT_CELL_VALUE = 0,
		SIZE = 3,
		NUM_CELLS = 9;

	function player (color, elem) {
		return {
			class: {
				name: elem.className,
				add: function () {
					this.name += " " + "test";
					console.log(this);
				},
				remove: function () {

				}
			},
			color: color,
			elem: elem
		};
	}

	function getPlayerColor (playerElem) {
		var style = window.getComputedStyle(playerElem);
		return style.getPropertyValue("background-color");
	}

	window.onload = function() {
		var p_1 							= document.getElementById("p_1"),
				p_2 							= document.getElementById("p_2"),
				elem_winner 			= document.getElementById("winner"),
				elem_winner_text 	= document.createTextNode("Winner"),
				elem_tie_text 		= document.getElementById("tie_text"),
				tie_text 					= document.createTextNode("Tie! Game Over"),
				btnNewGame 				= document.getElementById("btnNewGame"),
				player_current 		= document.querySelector(".player-current"),
				cells 						= document.querySelectorAll(".col"),
				winner 						= false,
				grid 							= [[],[],[]],
				moveCount 				= 0,
				len 							= cells.length,
				row 							= 0,
				i;

		var player1 = player ("blue", p_1);

		player1.class.add();

		function isThreeInRow() {
			var len = grid.length;

			for (var i=0; i<len; i++) {
				if (grid[i][0].dataValue !== 0 &&
						grid[i][0].dataValue === grid[i][1].dataValue &&
						grid[i][0].dataValue === grid[i][2].dataValue ) {

					return grid[i][0];
				}
			}
			return false;
		}

		function isThreeInCol () {
			var len = grid.length;

			for (var i=0; i<len; i++) {
				if (grid[0][i].dataValue !== 0 &&
						grid[0][i].dataValue === grid[1][i].dataValue &&
						grid[0][i].dataValue === grid[2][i].dataValue ) {

					return grid[0][i];
				}
			}
			return false;
		}

		function isThreeInDia() {

			if (grid[0][0].dataValue !== 0 &&
					grid[0][0].dataValue === grid[1][1].dataValue &&
					grid[0][0].dataValue === grid[2][2].dataValue ) {

				return grid[0][0];

			} else if (grid[0][2].dataValue !== 0 &&
					grid[0][2].dataValue === grid[1][1].dataValue &&
					grid[0][2].dataValue === grid[2][0].dataValue ) {

				return grid[0][2];
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

		function addClass (elem, strClass) {
			elem.className += " " + strClass;
		}

		function removeClass (elem, strClass) {
			console.log(elem.className.indexOf(strClass));
			elem.className.slice(0, elem.className.indexOf(strClass));
			console.log(elem);
		}

		function changePlayer () {
			// player1.class.add();
			if (player_current.id === "p_1") {
				removeClass(p_1, "player-current");
				addClass(p_2, "player-current");
				player_current = p_2;

			} else {
				removeClass(p_2, "player-current");
				addClass(p_1, "player-current");
				player_current = p_1;
			}
		}

		function clickCell () {
			return function () {
				if (!winner) {
						if (this.style.backgroundColor === INIT_CELL_COLOR) {
							this.style.backgroundColor = getPlayerColor(player_current);
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

		p_1.dataValue = 1;
		p_2.dataValue = 2;

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
