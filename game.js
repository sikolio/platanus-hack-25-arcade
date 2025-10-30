// Time Cross - A time-based platformer
// Levels generate from current time and date. Race to the goal before the minute changes!

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scene: {
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

// 5x7 pixel font for digits and symbols
const font = {
  '0':[[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1]],
  '1':[[0,0,1,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,1,1,0]],
  '2':[[1,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
  '3':[[1,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[1,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[1,1,1,1,1]],
  '4':[[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1]],
  '5':[[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[1,1,1,1,1]],
  '6':[[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1]],
  '7':[[1,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1]],
  '8':[[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1]],
  '9':[[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[1,1,1,1,1]],
  ':':[[0,0,0,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0]],
  '-':[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[1,1,1,1,1],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]
};

let player, cursors, platforms, collectibles, goal;
let score = 0, best = 0, cleared = false;
let currentMinute, timeText, dateText, scoreText, bestText;
let scene;

function create() {
  scene = this;
  
  // Input
  cursors = this.input.keyboard.createCursorKeys();
  
  // Create textures
  const gfx = this.add.graphics();
  gfx.fillStyle(0x00ff88, 1);
  gfx.fillRect(0, 0, 20, 20);
  gfx.generateTexture('player', 20, 20);
  
  gfx.clear();
  gfx.fillStyle(0xffaa00, 1);
  gfx.fillCircle(6, 6, 6);
  gfx.generateTexture('coin', 12, 12);
  
  gfx.clear();
  gfx.fillStyle(0xff0044, 1);
  gfx.fillRect(0, 0, 8, 40);
  gfx.fillStyle(0xff6688, 1);
  gfx.beginPath();
  gfx.moveTo(8, 0);
  gfx.lineTo(40, 15);
  gfx.lineTo(8, 30);
  gfx.closePath();
  gfx.fillPath();
  gfx.generateTexture('flag', 40, 40);
  gfx.destroy();
  
  // UI
  timeText = this.add.text(10, 10, '', {fontSize: '18px', color: '#fff'});
  dateText = this.add.text(10, 30, '', {fontSize: '18px', color: '#fff'});
  scoreText = this.add.text(10, 55, 'Score: 0', {fontSize: '18px', color: '#ffaa00'});
  bestText = this.add.text(10, 75, 'Best: 0', {fontSize: '18px', color: '#00ffaa'});
  
  // Build level
  buildLevel();
  
  // Player
  player = this.physics.add.sprite(50, 100, 'player');
  player.setBounce(0.1);
  player.setCollideWorldBounds(true);
  
  // Collisions
  this.physics.add.collider(player, platforms);
  this.physics.add.overlap(player, collectibles, collectCoin, null, this);
  this.physics.add.overlap(player, goal, reachGoal, null, this);
}

function buildLevel() {
  // Clear old level
  if (platforms) platforms.clear(true, true);
  if (collectibles) collectibles.clear(true, true);
  if (goal) goal.destroy();
  
  const now = new Date();
  currentMinute = now.getMinutes();
  
  // Format time and date
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const y = String(now.getFullYear());
  const mo = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  
  timeText.setText('TIME: ' + h + ':' + m);
  dateText.setText('DATE: ' + y + '-' + mo + '-' + d);
  
  platforms = scene.physics.add.staticGroup();
  collectibles = scene.physics.add.group();
  
  // Draw time platforms at top (y=150)
  drawText(h + ':' + m, 50, 150, platforms, collectibles);
  
  // Draw date platforms at bottom (y=400)
  drawText(y + '-' + mo + '-' + d, 50, 400, platforms, collectibles);
  
  // Goal flag
  goal = scene.physics.add.sprite(750, 500, 'flag');
  goal.body.setAllowGravity(false);
  
  cleared = false;
}

function drawText(text, startX, startY, plat, coins) {
  let x = startX;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const pattern = font[c];
    if (!pattern) continue;
    
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (pattern[row][col]) {
          const px = x + col * 8;
          const py = startY + row * 8;
          const tile = scene.add.rectangle(px, py, 8, 8, 0x4466ff);
          plat.add(tile);
        }
      }
    }
    
    // Add collectible for : and -
    if (c === ':' || c === '-') {
      const coin = scene.physics.add.sprite(x + 20, startY + 56, 'coin');
      coin.body.setAllowGravity(false);
      coins.add(coin);
    }
    
    x += 50;
  }
}

function collectCoin(p, coin) {
  coin.destroy();
  score += 10;
  scoreText.setText('Score: ' + score);
  playTone(880, 0.05);
}

function reachGoal() {
  if (cleared) return;
  cleared = true;
  
  if (score > best) {
    best = score;
    bestText.setText('Best: ' + best);
  }
  
  playTone(1200, 0.2);
  
  const msg = scene.add.text(400, 300, 'CLEARED!', {
    fontSize: '64px',
    color: '#00ff88',
    stroke: '#000',
    strokeThickness: 6
  }).setOrigin(0.5);
  
  scene.tweens.add({
    targets: msg,
    scale: 1.2,
    alpha: 0.8,
    duration: 500,
    yoyo: true,
    repeat: -1
  });
  
  scene.time.delayedCall(2000, buildLevel);
}

function update() {
  // Check minute change
  const now = new Date();
  if (now.getMinutes() !== currentMinute) {
    scene.cameras.main.shake(200, 0.01);
    playTone(440, 0.1);
    buildLevel();
  }
  
  // Player control
  if (cursors.left.isDown) {
    player.setVelocityX(-200);
  } else if (cursors.right.isDown) {
    player.setVelocityX(200);
  } else {
    player.setVelocityX(0);
  }
  
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-400);
    playTone(660, 0.05);
  }
}

function playTone(freq, dur) {
  const ctx = scene.sound.context;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.frequency.value = freq;
  osc.type = 'square';
  
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + dur);
}
