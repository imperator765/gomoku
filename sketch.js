let game;
let ui;

// setup: p5.jsのセットアップ関数。ゲームの初期設定を行う
function setup() {
createCanvas(500, 550);
game = new Game(15);
ui = new UI(game);
}

// draw: p5.jsの描画関数。ゲームの描画と更新を繰り返す
function draw() {
background(255);
ui.draw();
game.update();
}

// mousePressed: p5.jsのマウスクリックイベントハンドラ。
function mousePressed() {
ui.handleMousePressed(mouseX, mouseY);
}
