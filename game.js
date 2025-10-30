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
let currentMinute, currentSecond, timeText, dateText, scoreText, statsText, modeText;
let scene, levelStartTime, playTimeTotal = 0, minutesCleared = 0;
let animTiles = [];

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
  
  // UI
  timeText = this.add.text(10, 10, '', {fontSize: '16px', color: '#fff'});
  dateText = this.add.text(10, 28, '', {fontSize: '16px', color: '#aaa'});
  scoreText = this.add.text(10, 50, 'Score: 0', {fontSize: '16px', color: '#ffaa00'});
  statsText = this.add.text(10, 68, '', {fontSize: '16px', color: '#00ffaa'});
  modeText = this.add.text(400, 10, '', {fontSize: '20px', color: '#88ff88'}).setOrigin(0.5);
  
  // Build level
  buildLevel();
  
  // Player
  player = this.physics.add.sprite(50, 100, 'player');
  player.setBounce(0.1);
  player.setCollideWorldBounds(true);
  
  // Camera follow
  this.cameras.main.startFollow(player, false, 0.1, 0.1);
  
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
  
  const now = new Date();
  currentMinute = now.getMinutes();
  currentSecond = now.getSeconds();
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
  timeText.setText('TIME: ' + hp + ':' + mp + ':' + sp);
  dateText.setText('DATE: ' + y + '-' + String(mo).padStart(2, '0') + '-' + String(d).padStart(2, '0'));
  modeText.setText('MODE: ' + MODES[currentMode]);
  statsText.setText('Cleared: ' + minutesCleared + ' | Play: ' + Math.floor(playTimeTotal / 1000) + 's');
  
  platforms = scene.physics.add.staticGroup();
  collectibles = scene.physics.add.group();
  hazards = scene.physics.add.group();
  
  // Draw hours and minutes at top
  const timeStr = formatTime(h, m);
  drawDisplay(timeStr, 50, 150, platforms, collectibles, false);
  
  // Draw animated seconds in middle (main challenge)
  drawSeconds(s, 300, platforms, collectibles, hazards);
  
  // Draw date at bottom
  const dateStr = formatDate(y, mo, d);
  drawDisplay(dateStr, 50, 450, platforms, collectibles, true);
  
  // Goal flag
  goal = scene.physics.add.sprite(750, 520, 'flag');
  if (goal.body) goal.body.setAllowGravity(false);
  
  cleared = false;
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

function drawDisplay(text, startX, startY, plat, coins, animated) {
  const mode = MODES[currentMode];
  let x = startX;
  
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    
    if (c === ' ') {
      x += 30;
      continue;
    }
    
    if (mode === 'MORSE') {
      x = drawMorse(c, x, startY, plat, coins, animated);
    } else if (mode === 'PIXEL' || mode === 'ROMAN') {
      x = drawPixel(c, x, startY, plat, coins, animated);
    } else if (mode === 'SEVEN_SEG') {
      x = drawSevenSeg(c, x, startY, plat, coins, animated);
    }
    
    x += 10;
  }
}

function drawMorse(c, x, y, plat, coins, anim) {
  // For morse: 0 = dot, 1 = dash
  if (c === '0') {
    // Draw dot (small circle)
    const tile = scene.add.rectangle(x, y + 28, 8, 8, 0xffaa44);
    plat.add(tile);
    
    if (anim) {
      animTiles.push(tile);
      scene.tweens.add({
        targets: tile,
        scale: 1.3,
        duration: 600,
        yoyo: true,
        repeat: -1
      });
    }
    
    return x + 15;
  } else if (c === '1') {
    // Draw dash (rectangle)
    const tile = scene.add.rectangle(x + 8, y + 28, 20, 8, 0xffaa44);
    plat.add(tile);
    
    if (anim) {
      animTiles.push(tile);
      scene.tweens.add({
        targets: tile,
        alpha: 0.7,
        duration: 800,
        yoyo: true,
        repeat: -1
      });
    }
    
    return x + 30;
  }
  
  return x;
}

function drawPixel(c, x, y, plat, coins, anim) {
  const pattern = pixFont[c];
  if (!pattern) return x;
  
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 5; col++) {
      if (pattern[row][col]) {
        const px = x + col * 8;
        const py = y + row * 8;
        const tile = scene.add.rectangle(px, py, 8, 8, 0x4466ff);
        
        // Add bevel effect
        const g = scene.add.graphics();
        g.lineStyle(1, 0x6688ff, 1);
        g.strokeRect(px - 4, py - 4, 8, 8);
        g.lineStyle(1, 0x2244aa, 1);
        g.strokeRect(px - 3, py - 3, 6, 6);
        
        plat.add(tile);
        
        // Pulse colons
        if (c === ':') {
          animTiles.push(tile);
          scene.tweens.add({
            targets: tile,
            alpha: 0.5,
            scale: 1.2,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
        } else if (anim) {
          animTiles.push(tile);
          scene.tweens.add({
            targets: tile,
            alpha: 0.7,
            duration: 1000 + Math.random() * 500,
            yoyo: true,
            repeat: -1
          });
        }
      }
    }
  }
  
  // Add coin for special chars
  if ((c === ':' || c === '-' || c === '/') && coins) {
    const coin = scene.physics.add.sprite(x + 20, y + 56, 'coin');
    coin.body.setAllowGravity(false);
    coins.add(coin);
    
    scene.tweens.add({
      targets: coin,
      scale: 1.2,
      duration: 800,
      yoyo: true,
      repeat: -1
    });
  }
  
  return x + 40;
}

function drawSevenSeg(c, x, y, plat, coins, anim) {
  const pattern = segFont[c];
  if (!pattern) return x;
  
  const w = pattern[0].length * 10;
  const h = 50;
  
  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col]) {
        const px = x + col * 10;
        const py = y + row * 10;
        const tile = scene.add.rectangle(px, py, 10, 10, 0xff6644);
        
        // Glow effect
        const g = scene.add.graphics();
        g.fillStyle(0xff8866, 0.5);
        g.fillCircle(px, py, 8);
        
        plat.add(tile);
        
        if (anim) {
          animTiles.push(tile);
          scene.tweens.add({
            targets: [tile, g],
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1
          });
        }
      }
    }
  }
  
  if ((c === ':' || c === '-') && coins) {
    const coin = scene.physics.add.sprite(x + w / 2, y + h + 10, 'coin');
    coin.body.setAllowGravity(false);
    coins.add(coin);
  }
  
  return x + w + 10;
}

function drawSeconds(s, y, plat, coins, haz) {
  const sStr = String(s).padStart(2, '0');
  let x = 50;
  
  for (let i = 0; i < sStr.length; i++) {
    const digit = sStr[i];
    const pattern = pixFont[digit];
    if (!pattern) continue;
    
    // Draw moving/oscillating platforms
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (pattern[row][col]) {
          const px = x + col * 10;
          const py = y + row * 10;
          const tile = scene.add.rectangle(px, py, 10, 10, 0x44ff66);
          plat.add(tile);
          
          // Oscillate tiles
          scene.tweens.add({
            targets: tile,
            y: py + Math.sin(row + col) * 15,
            duration: 1000 + (row + col) * 100,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
          
          animTiles.push(tile);
        }
      }
    }
    
    // Add moving hazards between digits
    if (i === 0) {
      for (let j = 0; j < 3; j++) {
        const hazard = scene.physics.add.sprite(x + 60, y + j * 25, 'hazard');
        hazard.body.setAllowGravity(false);
        haz.add(hazard);
        
        // Move hazard horizontally
        scene.tweens.add({
          targets: hazard,
          x: x + 150,
          duration: 2000 + j * 500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    }
    
    x += 70;
  }
  
  // Add collapsing bridges
  for (let j = 0; j < 4; j++) {
    const bridge = scene.add.rectangle(x + j * 25, y + 35, 20, 8, 0xffaa44);
    plat.add(bridge);
    
    scene.tweens.add({
      targets: bridge,
      alpha: 0.3,
      duration: 1500 + j * 200,
      yoyo: true,
      repeat: -1
    });
    
    animTiles.push(bridge);
  }
  
  // Spinning coins in seconds area
  for (let j = 0; j < 2; j++) {
    const coin = scene.physics.add.sprite(x + 100 + j * 80, y + 20, 'coin');
    coin.body.setAllowGravity(false);
    coins.add(coin);
    
    scene.tweens.add({
      targets: coin,
      y: y + 50,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
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
  // Update seconds display in real-time
  const now = new Date();
  const s = now.getSeconds();
  
  // Update seconds in time display
  const hp = String(now.getHours()).padStart(2, '0');
  const mp = String(now.getMinutes()).padStart(2, '0');
  const sp = String(s).padStart(2, '0');
  timeText.setText('TIME: ' + hp + ':' + mp + ':' + sp);
  
  // Check for minute change
  if (now.getMinutes() !== currentMinute) {
    scene.cameras.main.shake(300, 0.015);
    scene.cameras.main.flash(200, 255, 150, 150);
    playTone(440, 0.15);
    
    // Auto-restart level
    scene.time.delayedCall(1000, () => {
      if (!cleared) {
        buildLevel();
      }
    });
  }
  
  // Check for second change (update seconds section)
  if (s !== currentSecond && !cleared) {
    currentSecond = s;
    // Rebuild just seconds section (simplified - full rebuild)
    // In a more optimized version, we'd only update the seconds area
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
