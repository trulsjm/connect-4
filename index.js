const board = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
const boardHeight = 6;
const boardWidth = 7;
const boardLength = boardHeight * boardWidth;
const goal = 4;

let turn = 1;
let player = 1;
let bot = 2;
document.addEventListener("DOMContentLoaded", () => {
  createButtons(); // from draw.js
  drawBoard(board);
  drawChoice();
  // startGame();
});

function startGame(chosenPlayer) {
  player = chosenPlayer;
  if (player === 2) {
    bot = 1;
    botMove();
  }
  removeChoice();
}

function resetGame() {
  for (let i = 0; i < board.length; i++) {
    board[i] = 0;
  }
  turn = 1;
}
