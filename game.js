// Time Cross + - Enhanced time-based platformer with multiple display modes
// Race across dynamic time platforms. Each level clear cycles through visual modes!

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

// Display modes
const MODES = ['PIXEL', 'SEVEN_SEG', 'ROMAN', 'MORSE'];
let currentMode = 0;

// Pixel font (5x7)
const pixFont = {
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
  '-':[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[1,1,1,1,1],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],
  '/':[[0,0,0,0,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,0,0,0,0],[1,0,0,0,0]],
  'I':[[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1]],
  'V':[[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0]],
  'X':[[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1],[1,0,0,0,1]],
  'L':[[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
  'C':[[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]]
};

// Seven-segment display patterns
const segFont = {
  '0':[[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
  '1':[[0,0,1],[0,0,1],[0,0,1],[0,0,1],[0,0,1]],
  '2':[[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
  '3':[[1,1,1],[0,0,1],[1,1,1],[0,0,1],[1,1,1]],
  '4':[[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
  '5':[[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
  '6':[[1,1,1],[1,0,0],[1,1,1],[1,0,1],[1,1,1]],
  '7':[[1,1,1],[0,0,1],[0,0,1],[0,0,1],[0,0,1]],
  '8':[[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]],
  '9':[[1,1,1],[1,0,1],[1,1,1],[0,0,1],[1,1,1]],
  ':':[[0],[1],[0],[1],[0]],
  '-':[[0,0,0],[0,0,0],[1,1,1],[0,0,0],[0,0,0]]
};

// Roman numerals conversion
const romanMap = {
  '0':'','1':'I','2':'II','3':'III','4':'IV','5':'V','6':'VI','7':'VII','8':'VIII','9':'IX',
  '10':'X','11':'XI','12':'XII','13':'XIII','14':'XIV','15':'XV','16':'XVI','17':'XVII',
  '18':'XVIII','19':'XIX','20':'XX','21':'XXI','22':'XXII','23':'XXIII','24':'XXIV',
  '30':'XXX','40':'XL','50':'L','60':'LX'
};

// Morse code patterns (1 = dash, 0 = dot)
const morseMap = {
  '0':'11111','1':'01111','2':'00111','3':'00011','4':'00001','5':'00000',
  '6':'10000','7':'11000','8':'11100','9':'11110'
};

let player, cursors, platforms, collectibles, goal, hazards;
let score = 0, cleared = false;
let currentMinute, currentSecond, currentCentisecond, timeText, dateText, scoreText, statsText, modeText;
let scene, levelStartTime, playTimeTotal = 0, minutesCleared = 0;
let animTiles = [];
let isPaused = false, pauseMenu;

function create() {
  scene = this;
  
  // Load progress from localStorage
  const saved = localStorage.getItem('timecross_plus');
  if (saved) {
    const data = JSON.parse(saved);
    minutesCleared = data.cleared || 0;
    playTimeTotal = data.time || 0;
    currentMode = data.mode || 0;
  }
  
  // Input
  cursors = this.input.keyboard.createCursorKeys();
  this.input.keyboard.on('keydown-ENTER', togglePause);
  this.input.keyboard.on('keydown-ESC', togglePause);
  
  // Add WASD keys
  const wasd = {
    up: this.input.keyboard.addKey('W'),
    left: this.input.keyboard.addKey('A'),
    right: this.input.keyboard.addKey('D')
  };
  cursors.wasd = wasd;
  
  // Create beveled textures
  const gfx = this.add.graphics();
  
  // Player with bevel
  gfx.fillStyle(0x006644, 1);
  gfx.fillRect(0, 20, 20, 2);
  gfx.fillStyle(0x00ff88, 1);
  gfx.fillRect(0, 0, 20, 20);
  gfx.fillStyle(0x00ffaa, 1);
  gfx.fillRect(0, 0, 18, 2);
  gfx.fillRect(0, 0, 2, 18);
  gfx.generateTexture('player', 20, 22);
  
  gfx.clear();
  gfx.fillStyle(0xffaa00, 1);
  gfx.fillCircle(6, 6, 6);
  gfx.fillStyle(0xffcc44, 1);
  gfx.fillCircle(5, 5, 4);
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
  
  // Hazard
  gfx.clear();
  gfx.fillStyle(0xff3300, 1);
  gfx.fillRect(2, 2, 12, 12);
  gfx.fillStyle(0xff6600, 1);
  gfx.fillRect(4, 4, 8, 8);
  gfx.generateTexture('hazard', 16, 16);
  
  gfx.destroy();
  
  // UI - Fixed to screen
  timeText = this.add.text(10, 10, '', {fontSize: '16px', color: '#fff'}).setScrollFactor(0);
  dateText = this.add.text(10, 28, '', {fontSize: '16px', color: '#aaa'}).setScrollFactor(0);
  scoreText = this.add.text(10, 50, 'Score: 0', {fontSize: '16px', color: '#ffaa00'}).setScrollFactor(0);
  statsText = this.add.text(10, 68, '', {fontSize: '16px', color: '#00ffaa'}).setScrollFactor(0);
  modeText = this.add.text(400, 10, '', {fontSize: '20px', color: '#88ff88'}).setOrigin(0.5).setScrollFactor(0);
  
  // Build level
  buildLevel();
  
  // Set world bounds for horizontal scrolling
  this.physics.world.setBounds(0, 0, 2000, 600);
  
  // Player
  player = this.physics.add.sprite(50, 100, 'player');
  player.setBounce(0.1);
  player.setCollideWorldBounds(false);
  
  // Camera follow - horizontal only with easing
  this.cameras.main.setBounds(0, 0, 2000, 600);
  this.cameras.main.startFollow(player, false, 0.08, 0.05);
  this.cameras.main.setDeadzone(200, 600);
  
  // Collisions
  this.physics.add.collider(player, platforms);
  this.physics.add.overlap(player, collectibles, collectCoin, null, this);
  this.physics.add.overlap(player, goal, reachGoal, null, this);
  this.physics.add.overlap(player, hazards, hitHazard, null, this);
}

function buildLevel() {
  // Clear old level
  if (platforms) platforms.clear(true, true);
  if (collectibles) collectibles.clear(true, true);
  if (hazards) hazards.clear(true, true);
  if (goal) goal.destroy();
  animTiles.forEach(t => t.destroy());
  animTiles = [];
  
  // Reset player position and velocity
  if (player) {
    player.setPosition(50, 100);
    player.setVelocity(0, 0);
  }
  
  const now = new Date();
  currentMinute = now.getMinutes();
  currentSecond = now.getSeconds();
  currentCentisecond = Math.floor(now.getMilliseconds() / 10);
  levelStartTime = now.getTime();
  
  // Format time and date
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const y = now.getFullYear();
  const mo = now.getMonth() + 1;
  const d = now.getDate();
  
  // Update UI
  const hp = String(h).padStart(2, '0');
  const mp = String(m).padStart(2, '0');
  const sp = String(s).padStart(2, '0');
  timeText.setText('TIME: ' + hp + ':' + mp + ':' + sp + '.00');
  dateText.setText('DATE: ' + y + '-' + String(mo).padStart(2, '0') + '-' + String(d).padStart(2, '0'));
  modeText.setText('MODE: ' + MODES[currentMode]);
  statsText.setText('Cleared: ' + minutesCleared + ' | Play: ' + Math.floor(playTimeTotal / 1000) + 's');
  
  platforms = scene.physics.add.staticGroup();
  collectibles = scene.physics.add.group();
  hazards = scene.physics.add.group();
  
  // Create horizontal level layout with height variations
  // Start platform
  const startPlat = scene.add.rectangle(50, 130, 80, 20, 0x4466ff);
  platforms.add(startPlat);
  
  let x = 140;
  const baseY = 300;
  
  // Hour section - stable platforms with slight height variation
  const timeStr = formatTime(h, m);
  x = drawHorizontalDisplay(timeStr, x, baseY - 50, platforms, collectibles, false);
  
  // Add some ramps and gaps
  x += 30;
  const ramp1 = createRamp(x, baseY, platforms);
  x += 100;
  
  // Gap with collectible
  const coin1 = scene.physics.add.sprite(x + 25, baseY - 40, 'coin');
  coin1.body.setAllowGravity(false);
  collectibles.add(coin1);
  x += 50;
  
  // Seconds section - dynamic centisecond-driven challenge
  x += 20;
  x = drawDynamicSeconds(s, x, baseY, platforms, collectibles, hazards);
  
  // More gaps with height changes
  x += 40;
  const plat1 = scene.add.rectangle(x, baseY + 30, 60, 15, 0x44ff66);
  platforms.add(plat1);
  x += 80;
  
  const plat2 = scene.add.rectangle(x, baseY - 20, 60, 15, 0x44ff66);
  platforms.add(plat2);
  x += 80;
  
  // Date section - stable ending
  x += 20;
  const dateStr = formatDate(y, mo, d);
  x = drawHorizontalDisplay(dateStr, x, baseY + 20, platforms, collectibles, true);
  
  // Final platforms leading to goal
  x += 40;
  const finalPlat = scene.add.rectangle(x, baseY, 80, 20, 0x4466ff);
  platforms.add(finalPlat);
  x += 100;
  
  // Goal flag - guaranteed reachable
  goal = scene.physics.add.sprite(x, baseY - 30, 'flag');
  if (goal.body) goal.body.setAllowGravity(false);
  
  // Ensure continuous path by adding safety platforms if needed
  ensureContinuousPath();
  
  cleared = false;
}

function createRamp(x, y, plat) {
  // Create a simple ramp with blocks
  for (let i = 0; i < 5; i++) {
    const block = scene.add.rectangle(x + i * 15, y - i * 10, 15, 10, 0x6688ff);
    plat.add(block);
  }
  return x;
}

function ensureContinuousPath() {
  // Add a continuous ground path at the bottom as a safety net
  for (let i = 0; i < 2000; i += 100) {
    const safePlat = scene.add.rectangle(i, 550, 100, 30, 0x333344);
    safePlat.setAlpha(0.3);
    platforms.add(safePlat);
  }
}

function drawHorizontalDisplay(text, startX, y, plat, coins, animated) {
  const mode = MODES[currentMode];
  let x = startX;
  
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    
    if (c === ' ') {
      x += 20;
      continue;
    }
    
    if (mode === 'MORSE' && (c === '0' || c === '1')) {
      x = drawMorseHorizontal(c, x, y, plat, coins, animated);
    } else if (mode === 'PIXEL' || mode === 'ROMAN') {
      x = drawPixelHorizontal(c, x, y, plat, coins, animated);
    } else if (mode === 'SEVEN_SEG') {
      x = drawSevenSegHorizontal(c, x, y, plat, coins, animated);
    }
    
    x += 8;
  }
  
  return x;
}

function drawMorseHorizontal(c, x, y, plat, coins, anim) {
  if (c === '0') {
    const tile = scene.add.rectangle(x, y, 12, 12, 0xffaa44);
    plat.add(tile);
    if (anim) animTiles.push(tile);
    return x + 18;
  } else if (c === '1') {
    const tile = scene.add.rectangle(x, y, 25, 12, 0xffaa44);
    plat.add(tile);
    if (anim) animTiles.push(tile);
    return x + 32;
  }
  return x;
}

function drawPixelHorizontal(c, x, y, plat, coins, anim) {
  const pattern = pixFont[c];
  if (!pattern) return x;
  
  // Draw as horizontal platforms instead of vertical
  for (let row = 0; row < 7; row++) {
    let rowStart = -1;
    for (let col = 0; col < 5; col++) {
      if (pattern[row][col]) {
        if (rowStart === -1) rowStart = col;
      } else {
        if (rowStart !== -1) {
          const px = x + rowStart * 6;
          const py = y + row * 8;
          const width = (col - rowStart) * 6;
          const tile = scene.add.rectangle(px + width / 2, py, width, 8, 0x4466ff);
          plat.add(tile);
          if (anim) animTiles.push(tile);
          rowStart = -1;
        }
      }
    }
    if (rowStart !== -1) {
      const px = x + rowStart * 6;
      const py = y + row * 8;
      const width = (5 - rowStart) * 6;
      const tile = scene.add.rectangle(px + width / 2, py, width, 8, 0x4466ff);
      plat.add(tile);
      if (anim) animTiles.push(tile);
    }
  }
  
  if ((c === ':' || c === '-' || c === '/') && coins) {
    const coin = scene.physics.add.sprite(x + 15, y - 20, 'coin');
    coin.body.setAllowGravity(false);
    coins.add(coin);
  }
  
  return x + 35;
}

function drawSevenSegHorizontal(c, x, y, plat, coins, anim) {
  const pattern = segFont[c];
  if (!pattern) return x;
  
  for (let row = 0; row < pattern.length; row++) {
    let rowStart = -1;
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col]) {
        if (rowStart === -1) rowStart = col;
      } else {
        if (rowStart !== -1) {
          const px = x + rowStart * 8;
          const py = y + row * 8;
          const width = (col - rowStart) * 8;
          const tile = scene.add.rectangle(px + width / 2, py, width, 8, 0xff6644);
          plat.add(tile);
          if (anim) animTiles.push(tile);
          rowStart = -1;
        }
      }
    }
    if (rowStart !== -1) {
      const px = x + rowStart * 8;
      const py = y + row * 8;
      const width = (pattern[row].length - rowStart) * 8;
      const tile = scene.add.rectangle(px + width / 2, py, width, 8, 0xff6644);
      plat.add(tile);
      if (anim) animTiles.push(tile);
    }
  }
  
  if ((c === ':' || c === '-') && coins) {
    const coin = scene.physics.add.sprite(x + 15, y - 20, 'coin');
    coin.body.setAllowGravity(false);
    coins.add(coin);
  }
  
  return x + 30;
}

function drawDynamicSeconds(s, x, y, plat, coins, haz) {
  const sStr = String(s).padStart(2, '0');
  
  for (let i = 0; i < sStr.length; i++) {
    const digit = sStr[i];
    const pattern = pixFont[digit];
    if (!pattern) continue;
    
    // Create moving platforms that respond to centiseconds
    for (let row = 0; row < 7; row++) {
      let rowStart = -1;
      for (let col = 0; col < 5; col++) {
        if (pattern[row][col]) {
          if (rowStart === -1) rowStart = col;
        } else {
          if (rowStart !== -1) {
            const px = x + rowStart * 8;
            const py = y + row * 10;
            const width = (col - rowStart) * 8;
            const tile = scene.add.rectangle(px + width / 2, py, width, 10, 0x44ff66);
            plat.add(tile);
            animTiles.push(tile);
            
            // Oscillate based on centiseconds
            scene.tweens.add({
              targets: tile,
              y: py + Math.sin(row + col) * 20,
              alpha: 0.6 + Math.sin(row + col) * 0.4,
              duration: 800 + (row + col) * 50,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
            
            rowStart = -1;
          }
        }
      }
      if (rowStart !== -1) {
        const px = x + rowStart * 8;
        const py = y + row * 10;
        const width = (5 - rowStart) * 8;
        const tile = scene.add.rectangle(px + width / 2, py, width, 10, 0x44ff66);
        plat.add(tile);
        animTiles.push(tile);
        
        scene.tweens.add({
          targets: tile,
          y: py + Math.sin(row) * 20,
          alpha: 0.6 + Math.sin(row) * 0.4,
          duration: 800 + row * 50,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    }
    
    x += 50;
  }
  
  // Add moving hazards in the seconds section
  for (let j = 0; j < 2; j++) {
    const hazard = scene.physics.add.sprite(x - 60 + j * 40, y + 20, 'hazard');
    hazard.body.setAllowGravity(false);
    haz.add(hazard);
    
    scene.tweens.add({
      targets: hazard,
      x: hazard.x + 80,
      duration: 1500 + j * 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  // Add coins that move with centiseconds
  for (let j = 0; j < 2; j++) {
    const coin = scene.physics.add.sprite(x - 40 + j * 60, y - 30, 'coin');
    coin.body.setAllowGravity(false);
    coins.add(coin);
    
    scene.tweens.add({
      targets: coin,
      y: coin.y + 30,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  return x;
}

function formatTime(h, m) {
  const mode = MODES[currentMode];
  if (mode === 'ROMAN') {
    return romanMap[String(h)] + ':' + romanMap[String(m)];
  } else if (mode === 'MORSE') {
    return getMorse(h) + ' ' + getMorse(m);
  } else {
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }
}

function formatDate(y, mo, d) {
  const mode = MODES[currentMode];
  if (mode === 'ROMAN') {
    return romanMap[String(mo)] + '/' + romanMap[String(d)];
  } else if (mode === 'MORSE') {
    return getMorse(mo) + ' ' + getMorse(d);
  } else {
    return String(y).slice(2) + '-' + String(mo).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  }
}

function getMorse(n) {
  const s = String(n);
  let result = '';
  for (let i = 0; i < s.length; i++) {
    result += morseMap[s[i]] || '';
    if (i < s.length - 1) result += ' ';
  }
  return result;
}

function collectCoin(p, coin) {
  coin.destroy();
  score += 10;
  scoreText.setText('Score: ' + score);
  playTone(880, 0.05);
}

function hitHazard(p, h) {
  // Small knockback
  const dx = p.x - h.x;
  p.setVelocityX(dx > 0 ? 200 : -200);
  p.setVelocityY(-300);
  playTone(220, 0.1);
  
  // Flash screen
  scene.cameras.main.flash(100, 255, 100, 100);
}

function reachGoal() {
  if (cleared) return;
  cleared = true;
  
  // Calculate play time for this level
  const levelTime = Date.now() - levelStartTime;
  playTimeTotal += levelTime;
  minutesCleared++;
  
  // Cycle to next mode
  currentMode = (currentMode + 1) % MODES.length;
  
  // Save progress
  localStorage.setItem('timecross_plus', JSON.stringify({
    cleared: minutesCleared,
    time: playTimeTotal,
    mode: currentMode
  }));
  
  statsText.setText('Cleared: ' + minutesCleared + ' | Play: ' + Math.floor(playTimeTotal / 1000) + 's');
  
  playTone(1200, 0.2);
  
  // Flash effect
  scene.cameras.main.flash(500, 100, 255, 100);
  
  const msg = scene.add.text(400, 300, 'CLEARED!\n+1 MINUTE\nNEW MODE: ' + MODES[currentMode], {
    fontSize: '48px',
    color: '#00ff88',
    stroke: '#000',
    strokeThickness: 6,
    align: 'center'
  }).setOrigin(0.5);
  
  scene.tweens.add({
    targets: msg,
    scale: 1.2,
    alpha: 0.8,
    duration: 500,
    yoyo: true,
    repeat: 3
  });
  
  scene.time.delayedCall(3000, () => {
    msg.destroy();
    buildLevel();
  });
}

function update() {
  if (isPaused) return;
  
  // Update time display with centiseconds
  const now = new Date();
  const s = now.getSeconds();
  const cs = Math.floor(now.getMilliseconds() / 10);
  
  // Update time display with centiseconds
  const hp = String(now.getHours()).padStart(2, '0');
  const mp = String(now.getMinutes()).padStart(2, '0');
  const sp = String(s).padStart(2, '0');
  const csp = String(cs).padStart(2, '0');
  timeText.setText('TIME: ' + hp + ':' + mp + ':' + sp + '.' + csp);
  
  // Track centisecond changes for dynamic difficulty
  if (cs !== currentCentisecond) {
    currentCentisecond = cs;
    updateDynamicElements(cs);
  }
  
  // Check for minute change
  if (now.getMinutes() !== currentMinute) {
    scene.cameras.main.shake(200, 0.008);
    scene.cameras.main.flash(150, 255, 150, 150);
    playTone(440, 0.15);
    
    // Auto-restart level
    scene.time.delayedCall(1000, () => {
      if (!cleared) {
        buildLevel();
      }
    });
  }
  
  // Check for second change
  if (s !== currentSecond && !cleared) {
    currentSecond = s;
  }
  
  // Fall detection - respawn if below camera view
  if (player.y > scene.cameras.main.scrollY + 650) {
    respawnPlayer();
  }
  
  // Player control
  if (cursors.left.isDown || cursors.wasd.left.isDown) {
    player.setVelocityX(-200);
  } else if (cursors.right.isDown || cursors.wasd.right.isDown) {
    player.setVelocityX(200);
  } else {
    player.setVelocityX(0);
  }
  
  if ((cursors.up.isDown || cursors.wasd.up.isDown) && player.body.touching.down) {
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

function togglePause() {
  if (cleared) return;
  
  isPaused = !isPaused;
  
  if (isPaused) {
    scene.physics.pause();
    
    // Create pause menu overlay
    const bg = scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.7).setScrollFactor(0).setDepth(1000);
    const title = scene.add.text(400, 200, 'PAUSED', {
      fontSize: '48px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
    
    const continueBtn = scene.add.text(400, 280, 'Continue (Enter/ESC)', {
      fontSize: '24px',
      color: '#00ff88'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
    
    const restartBtn = scene.add.text(400, 330, 'Restart Level (R)', {
      fontSize: '24px',
      color: '#ffaa00'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
    
    pauseMenu = {bg, title, continueBtn, restartBtn};
    
    // Add restart key listener
    const rKey = scene.input.keyboard.addKey('R');
    rKey.once('down', () => {
      if (isPaused) {
        togglePause();
        buildLevel();
      }
    });
  } else {
    scene.physics.resume();
    
    // Remove pause menu
    if (pauseMenu) {
      pauseMenu.bg.destroy();
      pauseMenu.title.destroy();
      pauseMenu.continueBtn.destroy();
      pauseMenu.restartBtn.destroy();
      pauseMenu = null;
    }
  }
}

function respawnPlayer() {
  player.setPosition(50, 100);
  player.setVelocity(0, 0);
  score = Math.max(0, score - 5);
  scoreText.setText('Score: ' + score);
  playTone(330, 0.15);
  scene.cameras.main.flash(100, 255, 0, 0);
}

function updateDynamicElements(cs) {
  // Make animated tiles flicker/move based on centisecond
  animTiles.forEach((tile, i) => {
    if (cs % 10 === i % 10) {
      tile.setAlpha(0.5 + Math.random() * 0.5);
    }
  });
}
