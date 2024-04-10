// Boardクラス: 五目並べのボードを管理するクラス
class Board {
  constructor(size) {
    this.size = size;
    this.board = this.initBoard(size);
    this.lastMove = null;
  }

  // initBoard: ボードを初期化するメソッド
  initBoard(size) {
    let board = [];
    for (let i = 0; i < size; i++) {
      board[i] = [];
      for (let j = 0; j < size; j++) {
        board[i][j] = '';
      }
    }
    return board;
  }

  // draw: ボードを描画するメソッド
  draw() {
      const padding = 20;
      const cellSize = (width - 2 * padding) / (this.size - 1);
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          const x = i * cellSize + padding;
          const y = j * cellSize + padding;
          stroke(0);
          noFill();
          if (i < this.size - 1 && j < this.size - 1) {
            rect(x, y, cellSize, cellSize);
          }
          if (this.board[i][j] === 'black') {
            fill(0);
            ellipse(x, y, cellSize * 0.8);
          } else if (this.board[i][j] === 'white') {
            fill(255);
            ellipse(x, y, cellSize * 0.8);
          }
        }
      }
    // 最後の手を強調表示
      if (this.lastMove) {
          const { x, y } = this.lastMove;
          const squareX = x * cellSize + padding;
          const squareY = y * cellSize + padding;
          const squareSize = cellSize * 0.2;

          fill(this.board[x][y] === 'black' ? 255 : 0);
          noStroke();
          rect(squareX - squareSize / 2, squareY - squareSize / 2, squareSize, squareSize);
      }
    }

  // placeStone: 石を置くメソッド
  placeStone(x, y, color) {
    if (this.isSpaceEmpty(x, y)) {
      this.board[x][y] = color;
      this.lastMove = { x, y };
      return true;
    }
    return false;
  }

  // isSpaceEmpty: 指定された位置が空いているかを確認するメソッド
  isSpaceEmpty(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size && this.board[x][y] === '';
  }

  // undoMove: 動きを戻すメソッド
  undoMove(x, y) {
    if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
      this.board[x][y] = '';
    }
  }

  // checkWinner: 勝者がいるか確認するメソッド
  checkWinner() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] !== '') {
          if (this.checkLine(i, j, 1, 0) || this.checkLine(i, j, 0, 1) || this.checkLine(i, j, 1, 1) || this.checkLine(i, j, 1, -1)) {
            return this.board[i][j];
          }
        }
      }
    }
    if (this.isBoardFull()) {
      return 'draw';
    }
    return null;
  }

  // checkLine: 指定された方向で連続している石の数を確認するメソッド
  checkLine(x, y, dx, dy) {
    let count = 0;
    let color = this.board[x][y];
    while (x >= 0 && x < this.size && y >= 0 && y < this.size && this.board[x][y] === color) {
      count++;
      x += dx;
      y += dy;
    }
    return count >= 5;
  }

  // isBoardFull: ボードが全て埋まっているか確認するメソッド
  isBoardFull() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === '') {
          return false;
        }
      }
    }
    return true;
  }
}