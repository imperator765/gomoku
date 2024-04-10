// AIPlayerクラス: AIプレイヤーを表すクラス
class AIPlayer extends Player {
constructor(color) {
  super(color);
  this.movesMade = 0;
}

   // makeMove: AIによる手の決定と実行
  makeMove(board) {
      this.movesMade++;
      let move;
      if (this.movesMade == 1) {
          move = this.findInitialMove(board);
      } else {
          move = this.findBestMove(board, 4, -Infinity, Infinity, true);
      }
      if (move && move.move) {
          board.placeStone(move.move.i, move.move.j, this.color);
          return true;
      }
      return false;
  }

  // findInitialMove: 最初の手を見つけるメソッド
  findInitialMove(board) {
      let availableMoves = [];
      const center = Math.floor(board.size / 2);
      const range = 2; // ボードの中央からの探索範囲

      // 中央付近の空きマスを探索
      for (let i = center - range; i <= center + range; i++) {
          for (let j = center - range; j <= center + range; j++) {
              if (board.isSpaceEmpty(i, j)) {
                  availableMoves.push({i, j});
              }
          }
      }

      // 空きマスからランダムに一つ選択
      if (availableMoves.length > 0) {
          const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
          return {
              move: randomMove
          };
      }
  }

// findBestMove: αβ枝刈りを用いて最良の手を探索するメソッド
findBestMove(board, depth, alpha, beta, maximizingPlayer) {
  if (depth === 0) {
    return {
      score: this.evaluateBoard(board),
      move: null
    };
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    let bestMove = null;
    for (let move of this.getAvailableMoves(board)) {
      board.placeStone(move.i, move.j, this.color);
      let result = this.findBestMove(board, depth - 1, alpha, beta, false);
      board.undoMove(move.i, move.j);
      if (result.score > maxEval) {
        maxEval = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, result.score);
      if (beta <= alpha) break;
    }
    return {
      score: maxEval,
      move: bestMove
    };
  } else {
    let minEval = Infinity;
    let bestMove = null;
    for (let move of this.getAvailableMoves(board)) {
      board.placeStone(move.i, move.j, this.color === 'black' ? 'white' :
        'black');
      let result = this.findBestMove(board, depth - 1, alpha, beta, true);
      board.undoMove(move.i, move.j);
      if (result.score < minEval) {
        minEval = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, result.score);
      if (beta <= alpha) break;
    }
    return {
      score: minEval,
      move: bestMove
    };
  }
}

// evaluateBoard: ボードの状態を評価するメソッド
evaluateBoard(board) {
  let score = 0;
  score += this.evaluateRowsForPlayer(board, this.color);  // AIの色の行を評
  score -= this.evaluateRowsForPlayer(board, this.color === 'black' ? 'white' : 'black');  // プレイヤーの色の行を評価
  return score;
}

// evaluateRowsForPlayer: 特定のプレイヤーの行を評価するメソッド
evaluateRowsForPlayer(board, player) {
  let playerScore = 0;
  for (let i = 0; i < board.size; i++) {
    for (let j = 0; j < board.size; j++) {
      if (board.board[i][j] === player) {
        // 水平、垂直、斜めの各方向で石の並びを評価
        playerScore += this.evaluateDirection(board, i, j, 1, 0, player); // 水平方向
        playerScore += this.evaluateDirection(board, i, j, 0, 1, player); // 垂直方向
        playerScore += this.evaluateDirection(board, i, j, 1, 1, player); // 斜め方向（右下り）
        playerScore += this.evaluateDirection(board, i, j, 1, -1, player); // 斜め方向（右上り）
      }
    }
  }
  return playerScore;
}

// evaluateDirection: 特定の方向における石の並びを評価するメソッド
evaluateDirection(board, x, y, dx, dy, player) {
  let count = 0;
  let openEnds = 0;
  if (board.isSpaceEmpty(x - dx, y - dy)) openEnds++; // 一端が空いている
  while (x >= 0 && x < board.size && y >= 0 && y < board.size && board.board[x][y] === player) {
    count++;
    x += dx;
    y += dy;
  }
  if (board.isSpaceEmpty(x, y)) openEnds++;  // もう一端が空いている
  if (count >= 5) return 10000; // 勝利
  else if (count === 4) {
    if (openEnds === 2) return 500; // 両端が開いている4連続
    else if (openEnds === 1) return 200; // 片端が開いている4連続
  } else if (count === 3) {
    if (openEnds === 2) return 100; // 両端が開いている3連続
    else if (openEnds === 1) return 50; // 片端が開いている3連続
  } else if (count === 2) {
    if (openEnds === 2) return 10; // 両端が開いている2連続
    else if (openEnds === 1) return 5; // 片端が開いている2連続
  }
  return 0;  // それ以外の場合はスコアなし
}

// getAvailableMoves: 探索対象の手を返すメソッド
getAvailableMoves(board) {
  let moves = [];
  let checked = new Set();

  for (let i = 0; i < board.size; i++) {
    for (let j = 0; j < board.size; j++) {
      if (board.board[i][j] !== '') {
        // 石の周囲のマスをチェック
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            let ni = i + di, nj = j + dj;
            if (ni >= 0 && ni < board.size && nj >= 0 && nj < board.size && board.board[ni][nj] === '') {
              let key = ni + ',' + nj;
              if (!checked.has(key)) {
                moves.push({ i: ni, j: nj });
                checked.add(key);
              }
            }
          }
        }
      }
    }
  }
  return moves;
 }
}