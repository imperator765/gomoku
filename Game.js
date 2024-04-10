// Gameクラス: 五目並べゲームの全体的なフローを管理するクラス
class Game {
  constructor(boardSize) {
    this.board = new Board(boardSize);
    this.player = new Player('black');
    this.aiPlayer = new AIPlayer('white');
    this.currentPlayer = null;
    this.gameState = 'start'; // ゲームの状態 ('start', 'playing', 'gameOver')
    this.winner = null; // 勝者 ('player', 'aiPlayer', 'draw', null)
    this.lastGameSetting = ''; // 最後のゲーム設定 ('humanFirst', 'aiFirst', 'random')
  }

  // startGame: ゲームを開始するメソッド
  startGame(choice) {
    this.setupPlayers(choice);
    this.gameState = 'playing';
    this.board = new Board(this.board.size);
    this.lastGameSetting = choice;
    this.aiPlayer.movesMade = 0;
  }
  
 // setupPlayers: プレイヤーの色と初手を設定するメソッド
  setupPlayers(choice) {
    if (choice === 'humanFirst') {
      this.player.color = 'black';
      this.aiPlayer.color = 'white';
      this.currentPlayer = this.player;
    } else if (choice === 'aiFirst') {
      this.player.color = 'white';
      this.aiPlayer.color = 'black';
      this.currentPlayer = this.aiPlayer;
    } else if (choice === 'random') {
      if (Math.random() < 0.5) {
        this.player.color = 'black';
        this.aiPlayer.color = 'white';
        this.currentPlayer = this.player;
      } else {
        this.player.color = 'white';
        this.aiPlayer.color = 'black';
        this.currentPlayer = this.aiPlayer;
      }
    }
  }
  
 // update: ゲームの状態を更新するメソッド
  update() {
    if (this.gameState === 'playing') {
      if (this.currentPlayer === this.aiPlayer) {
          setTimeout(() => {
              this.aiPlayer.makeMove(this.board);
              this.switchPlayer();
              this.checkGameStatus();
          }, 0);
      }
      this.checkGameStatus();
    }
  }

  // switchPlayer: 手番を交代するメソッド
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === this.player ? this.aiPlayer : this.player;
  }
  
 // checkGameStatus: ゲームの状態をチェックし、必要に応じて更新するメソッド
  checkGameStatus() {
    let result = this.board.checkWinner();
    if (result) {
      this.gameState = 'gameOver';
      this.winner = result === 'draw' ? 'draw' : (result === this.player.color ? 'player' : 'aiPlayer');
    }
  }
}
