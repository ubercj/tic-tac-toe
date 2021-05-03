// DOM elements
const gameArea = document.querySelector(".game-area");

// Module for Game Board

const Board = (() => {
  const grid = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "]
  ];

  return { grid };
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
    gameboard.forEach(row => {
      row.forEach(square => {
        let space = document.createElement("div");
        space.textContent = square;
        space.classList.add("space");
        gameArea.appendChild(space);
      })
    })
  }

    return { displayBoard };
})();

// Factory function for Players

const Player = (name) => {
  const getName = () => name;

  return { getName };
}

// Factory function for Game

const Game = () => {


  return {  };
}

// Factory function for Spaces <-- May not need this...

// const Space = (contents = " ") => {
//   let value = contents;
//   return { value };
// }

  // const grid = [
  //   [Space(), Space(), Space()],
  //   [Space(), Space(), Space()],
  //   [Space(), Space(), Space()]
  // ];