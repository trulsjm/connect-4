const maxDepth = 8; // Hopefully make this one flexible

function botMove() {
  console.log("bot moving");

  let evaluation = -Infinity;
  let chosenIndex = 0;
  for (let i = 0; i < boardWidth; i++) {
    if (board[i] === 0) {
      const boardIndex = move(i, bot);

      const val = miniMax(player, 0, boardIndex, -Infinity, Infinity);
      console.log(`${val} for index ${i}`);

      board[boardIndex] = 0;
      if (val >= evaluation) {
        evaluation = val;
        chosenIndex = i;
      }
    }
  }

  makeMove(chosenIndex);
}

function miniMax(currentTurn, depth, recentMove, alpha, beta) {
  // Base case
  if (depth === maxDepth) {
    return evaluate(recentMove);
  }
  // check for win, no need to go further then
  const possibleWinner = checkForWin(recentMove);
  if (possibleWinner === player) {
    return -Infinity;
  } else if (possibleWinner === bot) {
    return Infinity;
  }

  if (currentTurn === bot) {
    // Bot wants positive values
    let evaluation = -Infinity;
    for (let i = 0; i < boardWidth; i++) {
      if (board[i] === 0) {
        const boardIndex = move(i, bot); // make move and get the index for quick undo
        const nextTurn = currentTurn === 1 ? 2 : 1; // flip turn before going deeper
        // alpha
        evaluation = Math.max(
          evaluation,
          miniMax(nextTurn, depth + 1, boardIndex, alpha, beta)
        );
        board[boardIndex] = 0; // Undo move
        if (evaluation > beta) {
          break;
        }
        alpha = Math.max(alpha, evaluation);
      }
    }
    return evaluation;
  } else {
    // Player wants negative values
    let evaluation = Infinity;
    for (let i = 0; i < boardWidth; i++) {
      if (board[i] === 0) {
        const boardIndex = move(i, player);
        const nextTurn = currentTurn === 1 ? 2 : 1;
        evaluation = Math.min(
          evaluation,
          miniMax(nextTurn, depth + 1, boardIndex, alpha, beta)
        );
        board[boardIndex] = 0;
        if (evaluation < alpha) {
          break;
        }
        beta = Math.min(beta, evaluation);
      }
    }
    return evaluation;
  }
}

function evaluate(recentMove) {
  const win = checkForWin(recentMove);
  if (win === bot) {
    return Infinity;
  } else if (win === player) {
    return -Infinity;
  }
  return Math.random() * 10; // nice
}

function move(index, turn) {
  for (let row = boardHeight; row >= 0; row--) {
    const boardIndex = row * boardWidth - boardWidth + index;
    if (board[boardIndex] === 0) {
      board[boardIndex] = turn;
      return boardIndex;
    }
  }
  console.error("an impossible move was attempted");
}

function getMoves() {
  const moves = [];
  for (let i = 0; i < boardWidth; i++) {
    if (board[i] === 0) {
      moves.push(true);
    } else {
      moves.push(false);
    }
  }
  return moves;
}
