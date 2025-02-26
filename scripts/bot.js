const maxDepth = 11; // should be odd to make the last move considered the players?
// Hopefully make this one flexible

let transpositionTable = new Map();
const zobristTable = Array.from({ length: boardLength }, () => [
  BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)), // Player 1
  BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)), // Player 2
]);

let transpositionsSkipped = 0;

function botMove() {
  console.log("bot moving");

  transpositionTable = new Map();
  const hashKey = computeZobristHash(board);
  const startDate = new Date();
  const startTime = startDate.getTime();

  let evaluation = -Infinity;
  let chosenIndex = 0;
  for (let i = 0; i < boardWidth; i++) {
    if (board[i] === 0) {
      const boardIndex = move(i, bot);
      const newHashKey = updateZobristHash(hashKey, boardIndex, 0, bot); // update hash

      const val = miniMax(
        player,
        0,
        boardIndex,
        -Infinity,
        Infinity,
        newHashKey
      );
      console.log(`${val} for index ${i}`);

      board[boardIndex] = 0;
      if (val > evaluation) {
        evaluation = val;
        chosenIndex = i;
      }
    }
  }
  const endDate = new Date();
  const endTime = endDate.getTime();
  const timeInterval = (endTime - startTime) / 1000;
  console.log(`moved with depth ${maxDepth} in ${timeInterval} seconds`);
  console.log(transpositionTable.size);

  if (evaluation === -Infinity) {
    for (let i = 0; i < boardWidth; i++) {
      if (board[i] === 0) {
        chosenIndex = i;
        break;
      }
    }
  }

  makeMove(chosenIndex);
}

function miniMax(currentTurn, depth, recentMove, alpha, beta, hashKey) {
  if (transpositionTable.hasOwnProperty(hashKey)) {
    return transpositionTable[hashKey];
  }
  // Base case , Odd depth should mean the player made the last move
  if (depth === maxDepth) {
    return evaluate(recentMove, currentTurn ^ 3);
  }

  // terminal check: check for win, no need to go further in that case
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
        const newHashKey = updateZobristHash(hashKey, boardIndex, 0, bot);
        const nextTurn = currentTurn ^ 3; // flip turn before going deeper, XOR with 3 ( binary 11) 01 -> 10 -> 01
        evaluation = Math.max(
          evaluation,
          miniMax(nextTurn, depth + 1, boardIndex, alpha, beta, newHashKey)
        );
        board[boardIndex] = 0; // Undo move
        if (evaluation > beta) {
          break;
        }
        alpha = Math.max(alpha, evaluation);
      }
    }
    // evaluation += evaluate(recentMove, currentTurn ^ 3); // maybe do this always (which is putting it here)
    transpositionTable[hashKey] = evaluation;
    return evaluation;
  } else {
    // Player wants negative values
    let evaluation = Infinity;
    for (let i = 0; i < boardWidth; i++) {
      if (board[i] === 0) {
        const boardIndex = move(i, player);
        const newHashKey = updateZobristHash(hashKey, boardIndex, 0, player);

        const nextTurn = currentTurn ^ 3; // XOR with 3 ( binary 11) 01 -> 10 -> 01
        evaluation = Math.min(
          evaluation,
          miniMax(nextTurn, depth + 1, boardIndex, alpha, beta, newHashKey)
        );
        board[boardIndex] = 0;
        if (evaluation < alpha) {
          break;
        }
        beta = Math.min(beta, evaluation);
      }
    }
    // evaluation += evaluate(recentMove, currentTurn ^ 3); // maybe do this always (which is putting it here)
    transpositionTable[hashKey] = evaluation;
    return evaluation;
  }
}

function evaluate(recentMove, whoMoved) {
  const win = checkForWin(recentMove);
  if (win === bot) {
    return Infinity;
  } else if (win === player) {
    return -Infinity;
  }
  let score = Math.random();
  // let score = 0;
  // score +=
  //   whoMoved === bot
  //     ? checkForNInARow(recentMove, 3, whoMoved) +
  //       checkBlockNInARow(recentMove, 3, whoMoved)
  //     : -(
  //         checkForNInARow(recentMove, 3, whoMoved) +
  //         checkBlockNInARow(recentMove, 3, whoMoved)
  //       );

  return score; // nice
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

function checkForNInARow(boardIndex, n, whoMoved) {
  const value = board[boardIndex];
  let score = 0;
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
    if (nextVal === value) {
      count++;
    } else {
      if (count != n) {
        break;
      }
      // check if the next space is free, and the one under for a setup
      // Then check if the row matches what the player is most interested in
      if (nextVal === 0) {
        score += 5;
        if (
          nextIndex < boardLength - boardWidth &&
          board[nextIndex + boardWidth] === 0
        ) {
          score += 50;
        }
      }
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
    if (nextVal === value) {
      count++;
    } else {
      if (count != n) {
        break;
      }
      if (nextVal === 0) {
        score += 5;
        if (
          nextIndex < boardLength - boardWidth &&
          board[nextIndex + boardWidth] === 0
        ) {
          score += 50;
        }
      }
      break;
    }
  }
  if (Math.floor(boardIndex / boardWidth) % 2 === whoMoved % 2) {
    // even is good for player 2
    score *= 2;
  }
  return score;
}

function checkBlockNInARow(boardIndex, n, whoMoved) {
  const playerGettingBlocked = whoMoved ^ 3;
  actualBlockedPlayer = checkForWinKnowingMover(boardIndex, whoMoved);
  if (actualBlockedPlayer === playerGettingBlocked) {
    return 300;
  }
  return 0;
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

function computeZobristHash(board) {
  let hash = 0n;

  for (let i = 0; i < boardLength; i++) {
    if (board[i] === 1) {
      hash ^= zobristTable[i][0]; // Player 1
    } else if (board[i] === 2) {
      hash ^= zobristTable[i][1]; // Player 2
    }
  }

  return hash;
}

function storeInTranspositionTable(hashKey, score) {
  transpositionTable.set(hashKey, score);
}

function getFromTranspositionTable(hashKey) {
  return transpositionTable.get(hashKey);
}

function updateZobristHash(hash, position, oldPiece, newPiece) {
  if (oldPiece) {
    hash ^= zobristTable[position][oldPiece - 1]; // Remove old piece
  }
  if (newPiece) {
    hash ^= zobristTable[position][newPiece - 1]; // Add new piece
  }
  return hash;
}
