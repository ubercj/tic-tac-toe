// DOM elements
const gameArea = document.querySelector(".game-area");
const ticker = document.querySelector(".ticker");
const startButton = document.querySelector(".start");

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

  const resetBoard = () => {
    Board.grid.forEach(row => {
      row.forEach((square, index, row) => {
        row[index] = " ";
      });
    })
    _clearBoard();
  }

  // const refreshBoard = () => {
  //   Board.grid.forEach(row => {
  //     row.forEach((square, index, row) => {
  //       let y = Number(square.getAttribute("y-position"));
  //       let x = Number(square.getAttribute("x-position"));
  //       row[index] = " ";
  //     });
  //   })
  // }
  
  const displayBoard = () => {
    // _clearBoard();
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
          space.textContent = currentPlayer.getSymbol();
          switchPlayer();
          ticker.textContent = `It's ${currentPlayer.getName()}'s turn.`;
        }
        // DisplayController.refreshBoard();
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
    return row.every(square => square == "X" || square == "O");
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

  const play = (player1, player2) => {
    DisplayController.displayBoard();
    // let currentPlayer = player1;
    if(_gameOver()) {
      console.log("Game is over!");
    }
    // Display whose turn it is
    ticker.textContent = `It's ${currentPlayer.getName()}'s turn.`;

    // "Turn" function that waits for player to click on a square
    //     and then fills the square in
    // let y = prompt("Y coordinate?");
    // let x = prompt("X coordinate?");
    // let mark = prompt("'X' or 'O'?");
    // Board.grid[y][x] = mark;
    // Switches player
  }

  return { play };
}

playerX = Player("John", "X");
playerY = Player("Jane", "O");

// Global event listeners
startButton.addEventListener("click", () => {
  DisplayController.resetBoard();
  let newGame = Game();
  newGame.play(playerX, playerY);
})

let currentPlayer = playerX;

const switchPlayer = () => {
  if (currentPlayer == playerX) {
    currentPlayer = playerY;
  } else {
    currentPlayer = playerX;
  }
}