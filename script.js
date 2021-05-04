// DOM elements
const gameArea = document.querySelector(".game-area");

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
  
  const displayBoard = (gameboard) => {
    _clearBoard();
    let i = 0;
    gameboard.forEach(row => {
      row.forEach(square => {
        let space = document.createElement("div");
        space.textContent = square;
        space.classList.add("space");
        space.setAttribute("position", `${i}`);
        gameArea.appendChild(space);
        i++;
      })
    })
    // TODO: Break this out into submethods
    spaces = document.querySelectorAll(".space");
    spaces.forEach(space => {
      space.addEventListener("click", () => {
        if(!space.classList.contains("clicked")) {
          space.textContent = "X";
          space.classList.add("clicked");
        }
      })
    })
  }

    return { displayBoard };
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

  const play = () => {
    while(true) {    
      if(_gameOver()) {
        // Win or draw message
        console.log("Game is over!");
        break;
      }
      // Display whose turn it is

      // "Turn" function that waits for player to click on a square
      //     and then fills the square in
      let y = prompt("Y coordinate?");
      let x = prompt("X coordinate?");
      let mark = prompt("'X' or 'O'?");
      Board.grid[y][x] = mark;
      DisplayController.displayBoard(Board.grid);
      // Switches player
    }
  }

  return { play };
}

// Game script

playerX = Player("John", "X");
playerY = Player("Jane", "O");

// Can I collect the player names from DOM?

