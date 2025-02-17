function createButtons() {
  const buttonContainer = document.getElementById("button_wrapper");
  console.log(buttonContainer);

  for (let i = 0; i < boardWidth; i++) {
    const button = document.createElement("div");
    button.classList.add("button");
    button.textContent = `${i}`;
    button.addEventListener("click", () => handleClick(i));
    buttonContainer.appendChild(button);
  }
}

function drawBoard() {
  const boardElement = document.getElementById("board");
  // Remove all child elements
  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.firstChild);
  }
  for (let i = 0; i < boardLength; i++) {
    const val = board[i];
    const slot = document.createElement("div");
    slot.classList.add("slot");
    slot.classList.add("board_color");
    const hole = document.createElement("div");
    switch (val) {
      case 1:
        hole.classList.add("yellow");
        break;
      case 2:
        hole.classList.add("red");
        break;
      case 0:
        hole.classList.add("empty");
        break;

      default:
        break;
    }
    slot.appendChild(hole);
    boardElement.appendChild(slot);
  }
}

function drawWinScreen(winner) {
  const wrapperElement = document.getElementById("wrapper");
  const gameOverBox = document.createElement("div");
  gameOverBox.classList.add("choiceBox");
  gameOverBox.id = "gameOverBox";

  if (winner === bot) {
    const chooseTitle = document.createElement("div");
    chooseTitle.innerHTML = "Bot wins";
    chooseTitle.classList.add("redText", "bigText");
    gameOverBox.appendChild(chooseTitle);
  }
  if (winner === player) {
    const chooseTitle = document.createElement("div");
    chooseTitle.innerHTML = "You win";
    chooseTitle.classList.add("greenText", "bigText");
    gameOverBox.appendChild(chooseTitle);
  }
  const restartButton = document.createElement("div");
  restartButton.innerHTML = "Play again";
  restartButton.classList.add("playAgain");
  restartButton.addEventListener("click", () => {
    resetGame();
    drawBoard();
    removeGameOverScreen();
    drawChoice();
  });

  gameOverBox.appendChild(restartButton);
  wrapperElement.appendChild(gameOverBox);
}
function removeGameOverScreen() {
  const wrapperElement = document.getElementById("wrapper");
  wrapperElement.removeChild(document.getElementById("gameOverBox"));
}

function drawDrawScreen() {
  const wrapperElement = document.getElementById("wrapper");
  const gameOverBox = document.createElement("div");
  gameOverBox.classList.add("choiceBox");
  gameOverBox.id = "gameOverBox";

  const chooseTitle = document.createElement("div");
  chooseTitle.innerHTML = "Draw";
  chooseTitle.classList.add("draw", "bigText");
  gameOverBox.appendChild(chooseTitle);

  const restartButton = document.createElement("div");
  restartButton.innerHTML = "Play again";
  restartButton.classList.add("playAgain");
  restartButton.addEventListener("click", () => {
    resetGame();
    drawBoard();
    removeGameOverScreen();
    drawChoice();
  });

  gameOverBox.appendChild(restartButton);
  wrapperElement.appendChild(gameOverBox);
}

function drawChoice() {
  const wrapperElement = document.getElementById("wrapper");
  const choiceBox = document.createElement("div");
  choiceBox.classList.add("choiceBox");
  choiceBox.id = "choiceBox";

  const player1button = document.createElement("div");
  player1button.innerHTML = "Player 1";
  player1button.classList.add("yellow", "choiceButton");
  player1button.addEventListener("click", () => startGame(1));

  const player2button = document.createElement("div");
  player2button.innerHTML = "Player 2";
  player2button.classList.add("red", "choiceButton");
  player2button.addEventListener("click", () => startGame(2));

  const miniWrapper = document.createElement("div");
  miniWrapper.classList.add("choiceWrapper");

  miniWrapper.appendChild(player1button);
  miniWrapper.appendChild(player2button);
  const chooseTitle = document.createElement("h2");
  chooseTitle.innerHTML = "Choose player";
  choiceBox.appendChild(chooseTitle);
  choiceBox.appendChild(miniWrapper);
  wrapperElement.appendChild(choiceBox);
}

function removeChoice() {
  const wrapperElement = document.getElementById("wrapper");
  wrapperElement.removeChild(document.getElementById("choiceBox"));
}
