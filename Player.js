// Playerクラス: プレイヤーを表すクラス
class Player {
  constructor(color) {
    this.color = color;
  }

  // makeMove: 指定された位置に石を置くメソッド
  makeMove(board, x, y) {
    if (board.isSpaceEmpty(x, y)) {
      board.placeStone(x, y, this.color);
      return true;
    }
    return false;
  }
}