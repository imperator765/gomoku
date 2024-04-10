// UIクラス: 五目並べゲームのユーザーインターフェースを管理するクラス
class UI {
constructor(game) {
  this.game = game;
}

draw() {
  // ゲーム状態に応じて異なる画面を描画
  switch (this.game.gameState) {
    case 'start':
      this.drawStartScreen();
      break;
    case 'playing':
      this.drawBoard();
      this.drawInfoArea();
      break;
    case 'gameOver':
      this.drawBoard();
      this.drawInfoArea();
      this.drawGameOverScreen();
      break;
  }
}

// drawStartScreen: スタート画面を描画するメソッド
drawStartScreen() {
  textAlign(CENTER, CENTER);
  textSize(32);
  text('GOMOKU', width / 2, height / 4);
	textSize(20);
	text('Connect five stones. ', width / 2, height / 4 + 50);
  // スタートオプションのボタンを描画
  this.drawButton(width / 2 - 60, height / 2, 120, 40, 'Play First');
  this.drawButton(width / 2 - 60, height / 2 + 50, 120, 40, 'Play Second');
  this.drawButton(width / 2 - 60, height / 2 + 100, 120, 40, 'Random');
}

 // drawBoard: ボードを描画するメソッド
drawBoard() {
  this.game.board.draw();
}

// drawInfoArea: 情報表示エリアを描画するメソッド
drawInfoArea() {
  textSize(16);
  textAlign(CENTER, CENTER);

  // AI色の表示
  stroke(0);
  fill(0);
  text("AI :", width - 450, height - 30);
  fill(this.game.aiPlayer.color === 'black' ? 0 : 255);
  ellipse(width - 420, height - 30, 20, 20);

  // プレイヤー色の表示
  fill(0);
  text("Player :", width - 355, height - 30);
  fill(this.game.player.color === 'black' ? 0 : 255);
  ellipse(width - 310, height - 30, 20, 20);

  // 現在の手番の表示
  fill(0);
  text(this.game.currentPlayer === this.game.player ? "Your Turn" :
    "AI's Turn", width - 240, height - 30);

  // メニューに戻るボタン
  this.drawButton(width - 160, height - 50, 120, 40, 'Start Menu');
}

// drawGameOverScreen: ゲームオーバー画面を描画するメソッド
drawGameOverScreen() {
  // ゲームオーバー時のオーバーレイを描画
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  // 勝敗メッセージを描画
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  let message = this.game.winner === 'aiPlayer' ? 'AI Wins!' : this.game.winner === 'player' ? 'You Win!' : 'Draw!';
  text(message, width / 2, height / 2 - 40);

  // ゲーム再開始やメニューへ戻るボタンを描画
  this.drawButton(width / 2 - 60, height / 2 + 20, 120, 40, 'Restart');
  this.drawButton(width / 2 - 60, height / 2 + 70, 120, 40, 'Start Menu');
}

// drawButton: ボタンを描画するメソッド
drawButton(x, y, w, h, label) {
  fill(255);
  stroke(0);
  rect(x, y, w, h, 5);
  fill(0);
  textSize(16);
  text(label, x + w / 2, y + h / 2);
}

// handleMousePressed: マウスクリックイベントを処理するメソッド
handleMousePressed(mouseX, mouseY) {
  if (this.game.gameState === 'start') {
    this.handleStartScreenClick(mouseX, mouseY);
  } else if (this.game.gameState === 'playing') {
    this.handleGameScreenClick(mouseX, mouseY);
  } else if (this.game.gameState === 'gameOver') {
    this.handleGameOverScreenClick(mouseX, mouseY);
  }
}

// handleStartScreenClick: スタート画面でのクリック処理を行うメソッド
handleStartScreenClick(mouseX, mouseY) {
  if (mouseX >= width / 2 - 60 && mouseX <= width / 2 + 60) {
    if (mouseY >= height / 2 && mouseY <= height / 2 + 40) {
      this.game.startGame('humanFirst');
    } else if (mouseY >= height / 2 + 50 && mouseY <= height / 2 + 90) {
      this.game.startGame('aiFirst');
    } else if (mouseY >= height / 2 + 100 && mouseY <= height / 2 + 140) {
      this.game.startGame('random');
    }
  }
}

// handleGameScreenClick: ゲーム画面でのクリック処理を行うメソッド
handleGameScreenClick(mouseX, mouseY) {
      if (this.game.currentPlayer === this.game.player) {
        const padding = 20;
        const cellSize = (width - 2 * padding) / (this.game.board.size - 1);
        const i = Math.floor((mouseX - padding + cellSize / 2 ) / cellSize);
        const j = Math.floor((mouseY - padding + cellSize / 2) / cellSize);
    
        if (i >= 0 && i < this.game.board.size && j >= 0 && j < this.game.board.size) {
          if (this.game.player.makeMove(this.game.board, i, j)) {
            this.draw();
            this.game.switchPlayer();
            this.game.checkGameStatus();
          }
        }
      }
      if (mouseX >= width - 160 && mouseX <= width - 40 && mouseY >= height - 50 && mouseY <= height - 20) {
        this.game.gameState = 'start';
        return;
      }
    }
  
// handleGameOverScreenClick: ゲームオーバー画面でのクリック処理を行うメソッド
handleGameOverScreenClick(mouseX, mouseY) {
  if (mouseX >= width / 2 - 60 && mouseX <= width / 2 + 60 && mouseY >= height /
    2 + 20 && mouseY <= height / 2 + 60) {
    this.game.startGame(this.game.lastGameSetting);
  }
  if (mouseX >= width / 2 - 60 && mouseX <= width / 2 + 60 && mouseY >= height /
    2 + 70 && mouseY <= height / 2 + 110) {
    this.game.gameState = 'start';
  }
}
}