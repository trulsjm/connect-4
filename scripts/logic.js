function handleClick(click_index) {
  if (turn !== player) {
    return;
  }
  makeMove(click_index);
}

function makeMove(move_index) {
  for (let row = boardHeight; row >= 0; row--) {
    const boardIndex = row * boardWidth - boardWidth + move_index;
    if (board[boardIndex] === 0) {
      board[boardIndex] = turn;
      drawBoard(board);
      // Allow browser to repaint UI before continuing
      setTimeout(() => {
        const possibleWinner = checkForWin(boardIndex);
        if (possibleWinner !== 0) {
          drawWinScreen(possibleWinner);
          return;
        }

        let boardIsFull = true;
        for (let i = 0; i < boardWidth; i++) {
          if (board[i] === 0) {
            boardIsFull = false;
          }
        }
        if (boardIsFull) {
          drawDrawScreen();
          return;
        }

        turn = turn === 1 ? 2 : 1;

        if (turn !== player) {
          botMove(); // Now runs after UI updates
        }
      }, 1);
      return;
    }
  }
}

function checkForWin(boardIndex) {
  // Only check necessary row, column, and diagonals duhhhhh

  const value = board[boardIndex];
  // horizontal
  // start looking left, then right when the value is wrong
  count = 1;
  nextIndex = boardIndex;
  while (true) {
    nextIndex--;
    if (nextIndex % boardWidth === boardWidth - 1) {
      break;
    }
    nextVal = board[nextIndex];
    if (value === nextVal) {
      count++;
      if (count === goal) {
        return value;
      }
    } else {
      break;
    }
  }
  nextIndex = boardIndex;
  while (true) {
    // right
    nextIndex++;
    if (nextIndex % boardWidth === 0) {
      break;
    }
    nextVal = board[nextIndex];
    if (value === nextVal) {
      count++;
      if (count === goal) {
        return value;
      }
    } else {
      break;
    }
  }

  // vertical, only have to look down since it stacks, lets go
  count = 1;
  nextIndex = boardIndex;
  while (true) {
    nextIndex += boardWidth;
    if (nextIndex >= boardLength) {
      break;
    }
    nextVal = board[nextIndex];
    if (value === nextVal) {
      count++;
      if (count === goal) {
        return value;
      }
    } else {
      break;
    }
  }

  // diagonals
  // down left - up right
  count = 1;
  nextIndex = boardIndex;
  while (true) {
    nextIndex -= boardWidth - 1;
    if (nextIndex < 0 || nextIndex % boardWidth === 0) {
      break;
    }
    nextVal = board[nextIndex];
    if (value === nextVal) {
      count++;
      if (count === goal) {
        return value;
      }
    } else {
      break;
    }
  }
  nextIndex = boardIndex;
  while (true) {
    nextIndex += boardWidth - 1;
    if (nextIndex < 0 || (nextIndex + 1) % boardWidth === 0) {
      break;
    }
    nextVal = board[nextIndex];
    if (value === nextVal) {
      count++;
      if (count === goal) {
        return value;
      }
    } else {
      break;
    }
  }
  // down right - up left
  count = 1;
  nextIndex = boardIndex;
  while (true) {
    nextIndex -= boardWidth + 1;
    if (nextIndex < 0 || (nextIndex + 1) % boardWidth === 0) {
      break;
    }
    nextVal = board[nextIndex];
    if (value === nextVal) {
      count++;
      if (count === goal) {
        return value;
      }
    } else {
      break;
    }
  }

  nextIndex = boardIndex;
  while (true) {
    nextIndex += boardWidth + 1;
    if (nextIndex < 0 || nextIndex % boardWidth === 0) {
      break;
    }
    nextVal = board[nextIndex];
    if (value === nextVal) {
      count++;
      if (count === goal) {
        return value;
      }
    } else {
      break;
    }
  }
  return 0;
}

function checkForWinKnowingMover(boardIndex, whoMoved) {
  // Only check necessary row, column, and diagonals duhhhhh

  const value = whoMoved;
  // horizontal
  // start looking left, then right when the value is wrong
  count = 1;
  nextIndex = boardIndex;
  while (true) {
    nextIndex--;
    if (nextIndex % boardWidth === boardWidth - 1) {
      break;
    }
    nextVal = board[nextIndex];
    if (value === nextVal) {
      count++;
      if (count === goal) {
        return value;
      }
    } else {
      break;
    }
  }
  nextIndex = boardIndex;
  while (true) {
    // right
    nextIndex++;
    if (nextIndex % boardWidth === 0) {
      break;
    }
    nextVal = board[nextIndex];
    if (value === nextVal) {
      count++;
      if (count === goal) {
        console.log("win spotted");

        return value;
      }
    } else {
      break;
    }
  }

  // vertical, only have to look down since it stacks, lets go
  count = 1;
  nextIndex = boardIndex;
  while (true) {
    nextIndex += boardWidth;
    if (nextIndex >= boardLength) {
      break;
    }
    nextVal = board[nextIndex];
    if (value === nextVal) {
      count++;
      if (count === goal) {
        return value;
      }
    } else {
      break;
    }
  }

  // diagonals
  // down left - up right
  count = 1;
  nextIndex = boardIndex;
  while (true) {
    nextIndex -= boardWidth - 1;
    if (nextIndex < 0 || nextIndex % boardWidth === 0) {
      break;
    }
    nextVal = board[nextIndex];
    if (value === nextVal) {
      count++;
      if (count === goal) {
        return value;
      }
    } else {
      break;
    }
  }
  nextIndex = boardIndex;
  while (true) {
    nextIndex += boardWidth - 1;
    if (nextIndex < 0 || (nextIndex + 1) % boardWidth === 0) {
      break;
    }
    nextVal = board[nextIndex];
    if (value === nextVal) {
      count++;
      if (count === goal) {
        return value;
      }
    } else {
      break;
    }
  }
  // down right - up left
  count = 1;
  nextIndex = boardIndex;
  while (true) {
    nextIndex -= boardWidth + 1;
    if (nextIndex < 0 || (nextIndex + 1) % boardWidth === 0) {
      break;
    }
    nextVal = board[nextIndex];
    if (value === nextVal) {
      count++;
      if (count === goal) {
        return value;
      }
    } else {
      break;
    }
  }

  nextIndex = boardIndex;
  while (true) {
    nextIndex += boardWidth + 1;
    if (nextIndex < 0 || nextIndex % boardWidth === 0) {
      break;
    }
    nextVal = board[nextIndex];
    if (value === nextVal) {
      count++;
      if (count === goal) {
        return value;
      }
    } else {
      break;
    }
  }
  return 0;
}

// piece of shit stupid whole board search below

function slowCheckForWin() {
  // horizontals
  let currentIndex = 0;
  let currentVal = board[currentIndex];
  let currentLength = currentVal === 0 ? 0 : 1;
  while (true) {
    currentIndex++;
    if (currentIndex === boardLength) {
      // end of board, no win found
      break;
    }
    if (currentIndex % boardWidth === 0) {
      // edge of row, no wrapping here
      currentLength = 0;
    }
    const nextVal = board[currentIndex];
    if (nextVal === 0) {
      currentLength = 0;
      currentVal = nextVal;
      continue;
    }
    if (nextVal === currentVal) {
      currentLength++;
      if (currentLength === goal) {
        return value;
      }
      continue;
    } else {
      currentLength = 1; // set to 1 because it is not 0
      currentVal = nextVal;
    }
  }

  //verticals oh boy
  currentIndex = -boardWidth;
  currentVal = 0;
  currentLength = currentVal === 0 ? 0 : 1;
  while (true) {
    currentIndex += boardWidth;
    if (currentIndex === boardLength + boardWidth - 1) {
      // end of board, no win found
      break;
    }
    if (currentIndex > boardLength - 1) {
      // bottom edge of board
      currentLength = 0;
      currentIndex -= boardLength - 1; // beware confusing signs (fortegn)
    }
    const nextVal = board[currentIndex];
    if (nextVal === 0) {
      currentLength = 0;
      currentVal = nextVal;
      continue;
    }
    if (nextVal === currentVal) {
      currentLength++;
      if (currentLength === goal) {
        return value;
      }
      continue; // not sure here
    } else {
      currentLength = 1;
      currentVal = nextVal;
    }
  }

  // diagonals, in 2 parts with ghost board on top

  // top left and down
  currentIndex = -boardLength + boardWidth * (goal - 1);
  currentVal = 0;
  currentLength = 0;

  while (true) {
    currentIndex += boardWidth + 1;
    if (currentIndex < 0) {
      continue;
    }
    if (currentIndex % boardWidth === 0) {
      // wrapper right
      currentLength = 0;
      currentIndex -= boardLength + boardWidth;
    }
    if (currentIndex > boardLength) {
      // another wrapper, bottom
      currentLength = 0;
      const column = currentIndex % boardWidth;
      currentIndex = currentIndex - column * boardWidth - column + boardWidth;
    }
    if (currentIndex === boardLength - boardWidth * (goal - 1)) {
      // end of search: bottom left minus goal plus one
      break;
    }

    const nextVal = board[currentIndex];
    if (nextVal === 0) {
      currentLength = 0;
      currentVal = nextVal;
      continue;
    }
    if (nextVal === currentVal) {
      currentLength++;
      if (currentLength === goal) {
        return value;
      }
      continue;
    } else {
      currentLength = 1; // set to 1 because it is not 0
      currentVal = nextVal;
    }
  }

  // top right and down
  currentIndex = -boardLength + boardWidth * goal - 1;
  currentVal = 0;
  currentLength = 0;

  while (true) {
    currentIndex += boardWidth - 1;

    if (currentIndex < 0) {
      continue;
    }
    if ((currentIndex + 1) % boardWidth === 0) {
      // wrapper left
      currentLength = 0;
      currentIndex -= boardLength - boardWidth; // not a 100% sure here
    }
    if (currentIndex > boardLength) {
      // another wrapper, bottom
      currentLength = 0;
      const reverseColumn = boardWidth - 1 - (currentIndex % boardWidth);
      currentIndex =
        currentIndex - reverseColumn * boardWidth + reverseColumn + boardWidth;
    }
    if (currentIndex === boardLength - 1 - boardWidth * (goal - 2)) {
      // end of search: bottom right and two up i think
      break;
    }

    const nextVal = board[currentIndex];
    if (nextVal === 0) {
      currentLength = 0;
      currentVal = nextVal;
      continue;
    }
    if (nextVal === currentVal) {
      currentLength++;
      if (currentLength === goal) {
        return value;
      }
      continue;
    } else {
      currentLength = 1; // set to 1 because it is not 0
      currentVal = nextVal;
    }
  }
}
