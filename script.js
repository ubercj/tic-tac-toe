// DOM elements
const gameArea = document.querySelector(".game-area");
const newGameButton = document.querySelector(".new-game");
const playerXArea = document.querySelector(".player1");
const playerOArea = document.querySelector(".player2");
const playerXMessage = document.createElement("p");
const playerOMessage = document.createElement("p");
const startButton = document.createElement("button");
const readyText = document.createElement("p");

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
  //Private
  const _clearBoard = () => {
    while (gameArea.firstChild) {
      gameArea.lastChild.remove();
    }
  }

  const _clearHighlights = () => {
    playerXArea.classList.remove("is-turn");
    playerOArea.classList.remove("is-turn");
    readyText.classList.remove("ready");
  }
  
  const _clearInfo = () => {
    while (playerXArea.firstChild) {
      playerXArea.lastChild.remove();
    }
    while (playerOArea.firstChild) {
      playerOArea.lastChild.remove();
    }
    _clearHighlights();
    playerX = null;
    playerO = null;
  }

  const _setSymbol = (space) => {
    let y = Number(space.getAttribute("y-position"));
    let x = Number(space.getAttribute("x-position"));
    if(!space.classList.contains("clicked")) {
      space.classList.add("clicked");
      // Changes grid value for victory logic
      Board.grid[y][x] = currentPlayer.getSymbol();
      // Changes visual display
      if (currentPlayer.getSymbol() == "X") {
        space.classList.add("x-background");
      } else {
        space.classList.add("o-background");
      }
      newGame.checkWinCondition();
    }
  }

  const _createSpaceListeners = () => {
    spaces = document.querySelectorAll(".space");
    spaces.forEach(space => {
      space.addEventListener("click", () => {
        _setSymbol(space)
      });
    })
  }

  // Public
  const resetBoard = () => {
    quickReset();
    _clearInfo();
  }

  const quickReset = () => {
    Board.grid.forEach(row => {
      row.forEach((square, index, row) => {
        row[index] = " ";
      });
    })
    _clearHighlights();
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
    _createSpaceListeners();
  }

    return { displayBoard, resetBoard, quickReset };
})();

// Factory function for Players
const Player = (name, symbol) => {
  const getName = () => name;
  const getSymbol = () => symbol;
  return { getName, getSymbol };
}

// Factory function for Game
const Game = () => {
  let endGameOverlay = document.createElement("div");
  endGameOverlay.classList.add("overlay");
  let endGameText = document.createElement("p");
  let restartButton = document.createElement("button");
  restartButton.textContent = "New Game";
  restartButton.addEventListener("click", newGameCallback);
  let quickRestartButton = document.createElement("button");
  quickRestartButton.textContent = "Rematch"
  quickRestartButton.addEventListener("click", quickNewGameCallback);

  // Private functions
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
    if (_winner()) {
      endGameText.textContent = `${currentPlayer.getName()} wins!`
    } else {
      endGameText.textContent = "It's a draw!"
    }
    endGameOverlay.appendChild(endGameText);
    endGameOverlay.appendChild(quickRestartButton);
    endGameOverlay.appendChild(restartButton);
    gameArea.appendChild(endGameOverlay);
  }

  //Public functions
  const checkWinCondition = () => {
    if (_gameOver()) {
      _gameOverMessage();
    } else {
      switchPlayer();
    }
  }

  const play = () => {
    DisplayController.displayBoard();
    currentPlayer = playerX;
    playerXArea.classList.add("is-turn");
  }

  return { play, checkWinCondition };
}

// Global event listeners
newGameButton.addEventListener("click", newGameCallback);

const createStartButton = () => {
  createReadyText();
  newGameButton.textContent = "Restart";
  startButton.textContent = "Begin";
  startButton.setAttribute("disabled", "true");
  gameArea.appendChild(startButton);

  startButton.addEventListener("click", () => {
    if (playerX && playerO) {
      gameArea.removeChild(startButton);
      gameArea.removeChild(readyText);
      playerXArea.removeChild(playerXMessage);
      playerOArea.removeChild(playerOMessage);
      newGame = Game();
      newGame.play();
    }
  })
}

const createReadyText = () => {
  readyText.textContent = "Enter names for both players"
  readyText.classList.add("ready-text");
  gameArea.appendChild(readyText);
}

const checkReady = () => {
  if (playerX && playerO) {
    startButton.removeAttribute("disabled");
    readyText.classList.add("ready");
    readyText.textContent = "Ready to go!";
  }
}

const createPlayerX = (nameData, form) => {
  playerX = Player(nameData.name.value, nameData.symbol.value);
  // Delete form
  playerXArea.removeChild(form);
  // Add player name
  let playerXName = document.createElement("h3");
  playerXName.classList.add("player-name");
  playerXName.textContent = playerX.getName();
  playerXArea.appendChild(playerXName);
  // Add player ready
  playerXMessage.textContent = `${playerX.getName()} is ready!`;
  playerXArea.appendChild(playerXMessage);
}

const createPlayerO = (nameData, form) => {
  playerO = Player(nameData.name.value, nameData.symbol.value);
  // Delete form
  playerOArea.removeChild(form);
  // Add player name
  let playerOName = document.createElement("h3");
  playerOName.classList.add("player-name");
  playerOName.textContent = playerO.getName();
  playerOArea.appendChild(playerOName);
  // Add player ready
  playerOMessage.textContent = `${playerO.getName()} is ready!`;
  playerOArea.appendChild(playerOMessage);
}

const createPlayerXForm = () => {
  // Build form
  let form1 = document.createElement("form");
  playerXArea.appendChild(form1);
  let setXSymbol = document.createElement("input");
  setXSymbol.setAttribute("type", "hidden");
  setXSymbol.setAttribute("name", "symbol");
  setXSymbol.setAttribute("value", "X");
  form1.appendChild(setXSymbol);
  // Build text input field
  let namePrompt1 = document.createElement("input");
  namePrompt1.classList.add("name-prompt", "name-one");
  namePrompt1.setAttribute("name", "name")
  namePrompt1.setAttribute("placeholder", "Enter player name");
  form1.appendChild(namePrompt1);
  // Build submit button
  let nameButton1 = document.createElement("button");
  nameButton1.classList.add("name-one");
  nameButton1.textContent = "Submit";
  nameButton1.setAttribute("type", "submit");
  form1.appendChild(nameButton1);
  // Button event listener
  form1.addEventListener("submit", (e) => {
    e.preventDefault();
    let nameData = e.target.elements;
    createPlayerX(nameData, form1);
    checkReady();
  })
}

const createPlayerOForm = () => {
  // Build form
  let form2 = document.createElement("form");
  playerOArea.appendChild(form2);
  let setOSymbol = document.createElement("input");
  setOSymbol.setAttribute("type", "hidden");
  setOSymbol.setAttribute("name", "symbol");
  setOSymbol.setAttribute("value", "O");
  form2.appendChild(setOSymbol);
  // Build text input field
  let namePrompt2 = document.createElement("input");
  namePrompt2.classList.add("name-prompt", "name-two");
  namePrompt2.setAttribute("name", "name")
  namePrompt2.setAttribute("placeholder", "Enter player name");
  form2.appendChild(namePrompt2);
  // Build submit buton
  let nameButton2 = document.createElement("button");
  nameButton2.classList.add("name-two");
  nameButton2.textContent = "Submit";
  nameButton2.setAttribute("type", "submit");
  form2.appendChild(nameButton2);
  // Button event listener
  form2.addEventListener("submit", (e) => {
    e.preventDefault();
    let nameData = e.target.elements;
    createPlayerO(nameData, form2);
    checkReady();
  })
}

function quickNewGameCallback() {
  DisplayController.quickReset();
  newGame = Game();
  newGame.play();
}

function newGameCallback() {
  DisplayController.resetBoard();
  createStartButton();
  createPlayerXForm();
  createPlayerOForm();
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