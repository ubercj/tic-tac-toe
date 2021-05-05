// DOM elements
const gameArea = document.querySelector(".game-area");
const newGameButton = document.querySelector(".new-game");
const playerXArea = document.querySelector(".player1");
const playerOArea = document.querySelector(".player2");

// Global variables
let playerX;
let playerO;
let currentPlayer;
let newGame;

// Module for Game Board
const Board = (() => {
  const grid = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "]
  ];

  const winningRows = () => {
    return [
    [ grid[0][0], grid[0][1], grid[0][2] ],
    [ grid[1][0], grid[1][1], grid[1][2] ],
    [ grid[2][0], grid[2][1], grid[2][2] ],
    [ grid[0][0], grid[1][0], grid[2][0] ],
    [ grid[0][1], grid[1][1], grid[2][1] ],
    [ grid[0][2], grid[1][2], grid[2][2] ],
    [ grid[0][0], grid[1][1], grid[2][2] ],
    [ grid[2][0], grid[1][1], grid[0][2] ],
  ]
};

  return { grid, winningRows };
})();

// Module for Display Controller
const DisplayController = (() => {
  const _clearBoard = () => {
    while (gameArea.firstChild) {
      gameArea.lastChild.remove();
    }
  }
  
  const _clearInfo = () => {
    while (playerXArea.firstChild) {
      playerXArea.lastChild.remove();
    }
    while (playerOArea.firstChild) {
      playerOArea.lastChild.remove();
    }
    playerXArea.classList.remove("is-turn");
    playerOArea.classList.remove("is-turn");
    playerX = null;
    playerY = null;
  }

  const resetBoard = () => {
    Board.grid.forEach(row => {
      row.forEach((square, index, row) => {
        row[index] = " ";
      });
    })
    _clearInfo();
    _clearBoard();
  }
  
  const displayBoard = () => {
    let i = 0;
    let j = 0;
    Board.grid.forEach(row => {
      row.forEach(square => {
        let space = document.createElement("div");
        space.textContent = square;
        space.classList.add("space");
        space.setAttribute("x-position", `${i}`);
        space.setAttribute("y-position", `${j}`);
        gameArea.appendChild(space);
        i++;
      })
      i = 0;
      j++;
    })

    // TODO: Break this out into submethods?
    spaces = document.querySelectorAll(".space");
    spaces.forEach(space => {
      space.addEventListener("click", () => {
        let y = Number(space.getAttribute("y-position"));
        let x = Number(space.getAttribute("x-position"));
        if(!space.classList.contains("clicked")) {
          space.classList.add("clicked");
          Board.grid[y][x] = currentPlayer.getSymbol();
          
          if (currentPlayer.getSymbol() == "X") {
            space.classList.add("x-background");
          } else {
            space.classList.add("o-background");
          }

          newGame.checkWinCondition();
        }
      })
    })
  }

    return { displayBoard, resetBoard };
})();

// Factory function for Players
const Player = (name, symbol) => {
  const getName = () => name;
  const getSymbol = () => symbol;
  return { getName, getSymbol };
}

// Factory function for Game
const Game = () => {
  const _wonRow = (row) => {
    return row.every(square => square == playerX.getSymbol()) ||
      row.every(square => square == playerO.getSymbol());
  }
  
  const _winner = () => {
    return Board.winningRows().some(row => {
      return _wonRow(row);
    })
  }

  const _fullBoard = () => {
    return Board.grid.every(row => {
      return row.every(square => square !== " ");
    })
  }
  
  const _gameOver = () => {
    return _winner() || _fullBoard();
  }

  const _gameOverMessage = () => {
    let endGameOverlay = document.createElement("div");
    endGameOverlay.classList.add("overlay");
    let endGameText = document.createElement("p");
    if (_winner()) {
      endGameText.textContent = `${currentPlayer.getName()} wins!`
    } else {
      endGameText.textContent = "It's a draw!"
    }
    let restartButton = document.createElement("button");
    restartButton.textContent = "Play again?";
    restartButton.addEventListener("click", newGameCallback);

    endGameOverlay.appendChild(endGameText);
    endGameOverlay.appendChild(restartButton);
    gameArea.appendChild(endGameOverlay);
  }

  const checkWinCondition = () => {
    if (_gameOver()) {
      _gameOverMessage();
    } else {
      switchPlayer();
    }
  }

  const play = (player1, player2) => {
    DisplayController.displayBoard();
    currentPlayer = player1;
    if(_gameOver()) {
      console.log("Game is over!");
    }
    // Display whose turn it is
    playerXArea.classList.add("is-turn");

  }

  return { play, checkWinCondition };
}

// Global event listeners
newGameButton.addEventListener("click", newGameCallback);
  
function newGameCallback() {
  DisplayController.resetBoard();
  newGameButton.textContent = "Restart";

  // Button to start game once names have been entered
  let startButton = document.createElement("button");
  startButton.textContent = "Begin";
  gameArea.appendChild(startButton);

  startButton.addEventListener("click", () => {
    if (playerX && playerO) {
      gameArea.removeChild(startButton);
      newGame = Game();
      newGame.play(playerX, playerO);
    } else {
      console.log("Not ready yet!");
    }
  })

  // Form for playerX name
  let form1 = document.createElement("form");
  playerXArea.appendChild(form1);
  let setXSymbol = document.createElement("input");
  setXSymbol.setAttribute("type", "hidden");
  setXSymbol.setAttribute("name", "symbol");
  setXSymbol.setAttribute("value", "X");
  form1.appendChild(setXSymbol);

  let namePrompt1 = document.createElement("input");
  namePrompt1.classList.add("name-prompt", "name-one");
  namePrompt1.setAttribute("name", "name")
  namePrompt1.setAttribute("placeholder", "Enter player name");
  form1.appendChild(namePrompt1);
  let nameButton1 = document.createElement("button");
  nameButton1.classList.add("name-one");
  nameButton1.textContent = "Submit";
  nameButton1.setAttribute("type", "submit");
  form1.appendChild(nameButton1);

  form1.addEventListener("submit", (e) => {
    e.preventDefault();
    let nameData = e.target.elements;
    playerX = Player(nameData.name.value, nameData.symbol.value);

    playerXArea.removeChild(form1);

    let playerXName = document.createElement("h3");
    playerXName.classList.add("player-name");
    playerXName.textContent = playerX.getName();
    playerXArea.appendChild(playerXName);
  })

  // Form for playerO name
  let form2 = document.createElement("form");
  playerOArea.appendChild(form2);
  let setOSymbol = document.createElement("input");
  setOSymbol.setAttribute("type", "hidden");
  setOSymbol.setAttribute("name", "symbol");
  setOSymbol.setAttribute("value", "O");
  form2.appendChild(setOSymbol);

  let namePrompt2 = document.createElement("input");
  namePrompt2.classList.add("name-prompt", "name-two");
  namePrompt2.setAttribute("name", "name")
  namePrompt2.setAttribute("placeholder", "Enter player name");
  form2.appendChild(namePrompt2);
  let nameButton2 = document.createElement("button");
  nameButton2.classList.add("name-two");
  nameButton2.textContent = "Submit";
  nameButton2.setAttribute("type", "submit");
  form2.appendChild(nameButton2);

  form2.addEventListener("submit", (e) => {
    e.preventDefault();
    let nameData = e.target.elements;
    playerO = Player(nameData.name.value, nameData.symbol.value);

    playerOArea.removeChild(form2);

    let playerOName = document.createElement("h3");
    playerOName.classList.add("player-name");
    playerOName.textContent = playerO.getName();
    playerOArea.appendChild(playerOName);
  })
}

const switchPlayer = () => {
  if (currentPlayer == playerX) {
    currentPlayer = playerO;
    playerXArea.classList.remove("is-turn");
    playerOArea.classList.add("is-turn");
  } else {
    currentPlayer = playerX;
    playerOArea.classList.remove("is-turn");
    playerXArea.classList.add("is-turn");
  }
}