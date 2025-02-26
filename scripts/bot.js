const maxDepth = 7; // should be odd to make the last move considered the players?
// Hopefully make this one flexible

let transpositionTable = {};
const zobristTable = Array.from({ length: 42 }, () => [
  BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)), // Player 1
  BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)), // Player 2
]);
hashKey = computeZobristHash(board); // update and un-update for each move searched

let transpositionsSkipped = 0;

function botMove() {
  console.log("bot moving");

  transpositionTable = {};
  hashKey = computeZobristHash(board);

  const startDate = new Date();
  const startTime = startDate.getTime();

  let evaluation = -Infinity;
  let chosenIndex = 0;
  for (let i = 0; i < boardWidth; i++) {
    if (board[i] === 0) {
      const boardIndex = move(i, bot);
      hashKey = updateZobristHash(hashKey, boardIndex, 0, bot); // update hash

      const val = miniMax(player, 0, boardIndex, -Infinity, Infinity);
      console.log(`${val} for index ${i}`);

      board[boardIndex] = 0;
      if (val > evaluation) {
        evaluation = val;
        chosenIndex = i;
      }

      hashKey = updateZobristHash(hashKey, boardIndex, bot, 0); // un-update hash
    }
  }
  const endDate = new Date();
  const endTime = endDate.getTime();
  const timeInterval = (endTime - startTime) / 1000;
  console.log(`moved with depth ${maxDepth} in ${timeInterval} seconds`);
  console.log("hashkey at end: ", hashKey);

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

function miniMax(currentTurn, depth, recentMove, alpha, beta) {
  const boardKey = board.join(","); // Simple hash: stringify the board state
  if (transpositionTable.hasOwnProperty(boardKey)) {
    return transpositionTable[boardKey];
  }
  // Base case , Odd depth should mean the player made the last move
  if (depth === maxDepth) {
    return evaluate(recentMove);
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
        const nextTurn = currentTurn ^ 3; // flip turn before going deeper, XOR with 3 ( binary 11) 01 -> 10 -> 01
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
    transpositionTable[boardKey] = evaluation;
    return evaluation;
  } else {
    // Player wants negative values
    let evaluation = Infinity;
    for (let i = 0; i < boardWidth; i++) {
      if (board[i] === 0) {
        const boardIndex = move(i, player);
        const nextTurn = currentTurn ^ 3; // XOR with 3 ( binary 11) 01 -> 10 -> 01
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
  return 0; // nice
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
