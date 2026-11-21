const canvas = document.getElementById('game'); const ctx = canvas.getContext('2d');
const Q = new URLSearchParams(location.search);
let mode = 'title'; let level = 0; let found = new Set(); let mistakes = 0;
let hintsLeft = 3; let score = 0; let levelStart = Date.now(); let elapsed = 0;
let hinted = -1; let wrongFlash = null;
const HINT_BTN = {x:1060, y:732, w:180, h:44};

function panelOf(x) {
  if (x >= 16 && x <= 616) return 0;
  if (x >= 664 && x <= 1264) return 1;
  return -1;
}

function toPanel(p, x, y) {
  const px = p === 0 ? 16 : 664;
  return { x: x - px, y: y - 72 };
}

function beep(f, d, ty) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ac = new AC();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = ty || 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.15, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d);
    o.connect(g);
    g.connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + d);
  } catch(e) {}
}

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

function startLevel(n) {
  level = n;
  found = new Set();
  mistakes = 0;
  hinted = -1;
  wrongFlash = null;
  levelStart = Date.now();
  mode = 'play';
}

function curScene() {
  return SCENES[level];
}

function curDiffs() {
  return SCENES[level].diffs;
}


function drawTopBar(ctx) {
  ctx.fillStyle = '#111927';
  ctx.fillRect(0, 0, canvas.width, 64);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('TWIN TIDES', 24, 32);

  ctx.font = '16px sans-serif';
  ctx.fillText(`Level ${level + 1}/3`, 220, 32);
  ctx.fillText(`Time: ${fmt(elapsed)}`, 340, 32);
  ctx.fillText(`Score: ${score}`, 480, 32);
  ctx.fillText(`Hints: ${hintsLeft}`, 600, 32);
}

function drawBottomBar(ctx) {
  ctx.fillStyle = '#111927';
  ctx.fillRect(0, 720, canvas.width, 80);
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Found ${found.size}/7 - ${7 - found.size} remaining`, 24, 760);

  ctx.fillStyle = hintsLeft > 0 ? '#2563eb' : '#4b5563';
  ctx.fillRect(HINT_BTN.x, HINT_BTN.y, HINT_BTN.w, HINT_BTN.h);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('Hint (H)', HINT_BTN.x + HINT_BTN.w / 2, HINT_BTN.y + HINT_BTN.h / 2);
}

function drawPanels(ctx) {
  const scene = curScene();

  ctx.save();
  ctx.beginPath();
  ctx.rect(16, 72, 600, 640);
  ctx.clip();
  ctx.save();
  ctx.translate(16, 72);
  scene.draw(ctx, 0);
  ctx.restore();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(664, 72, 600, 640);
  ctx.clip();
  ctx.save();
  ctx.translate(664, 72);
  scene.draw(ctx, 1);
  ctx.restore();
  ctx.restore();

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(640, 72);
  ctx.lineTo(640, 712);
  ctx.stroke();

  ctx.fillStyle = '#111927';
  ctx.fillRect(624, 384, 32, 32);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', 640, 400);
}

function drawMarkers(ctx) {
  found.forEach(i => {
    const d = curDiffs()[i];
    [16, 664].forEach(px => {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(px + d.x, 72 + d.y, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓', px + d.x, 72 + d.y);
    });
  });
  if (hinted >= 0 && !found.has(hinted)) {
    const d = curDiffs()[hinted];
    const pulse = 16 + Math.sin(Date.now() / 150) * 4;
    [16, 664].forEach(px => {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(px + d.x, 72 + d.y, pulse, 0, Math.PI * 2);
      ctx.stroke();
    });
  }
  if (wrongFlash && Date.now() - wrongFlash.time < 400) {
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(wrongFlash.x - 10, wrongFlash.y - 10);
    ctx.lineTo(wrongFlash.x + 10, wrongFlash.y + 10);
    ctx.moveTo(wrongFlash.x + 10, wrongFlash.y - 10);
    ctx.lineTo(wrongFlash.x - 10, wrongFlash.y + 10);
    ctx.stroke();
  }
}

function onClick(e) {
  const r = canvas.getBoundingClientRect();
  const cx = (e.clientX - r.left) * (canvas.width / r.width);
  const cy = (e.clientY - r.top) * (canvas.height / r.height);
  if (mode === 'title') { startLevel(0); return; }
  if (mode === 'level-done') {
    if (level + 1 < 3) startLevel(level + 1);
    else mode = 'final';
    return;
  }
  if (mode === 'final') { mode = 'title'; return; }
  if (cx >= HINT_BTN.x && cx <= HINT_BTN.x + HINT_BTN.w && cy >= HINT_BTN.y && cy <= HINT_BTN.y + HINT_BTN.h) {
    if (hintsLeft > 0 && hinted === -1) {
      const un = curDiffs().findIndex((_, i) => !found.has(i));
      if (un !== -1) {
        hinted = un;
        hintsLeft--;
        setTimeout(() => { if (hinted === un) hinted = -1; }, 2000);
      }
    }
    return;
  }
  const p = panelOf(cx);
  if (p === -1) return;
  const pt = toPanel(p, cx, cy);
  if (!pt) return;
  let hit = -1;
  curDiffs().forEach((d, i) => {
    if (!found.has(i) && Math.hypot(d.x - pt.x, d.y - pt.y) < 24) hit = i;
  });
  if (hit !== -1) {
    found.add(hit);
    score += 100;
    beep(587.33, 0.1, 'sine');
    setTimeout(() => beep(880, 0.15, 'sine'), 100);
    if (found.size === curDiffs().length) {
      mode = 'level-done';
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => beep(f, 0.12, 'triangle'), i * 120));
    }
  } else {
    mistakes++;
    score = Math.max(0, score - 10);
    wrongFlash = { x: cx, y: cy, time: Date.now() };
    beep(150, 0.2, 'sawtooth');
  }
}
function drawShotState() {
  if (Q.get('shot') === 'play') {
    startLevel(parseInt(Q.get('scene')) || 0);
    for (let i = 0; i < 3 && i < curDiffs().length; i++) found.add(i);
  } else if (Q.get('shot') === 'end') {
    startLevel(0);
    curDiffs().forEach((_, i) => found.add(i));
    mode = 'level-done';
  }
}
function drawTitle(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(16, 72, 600, 640);
  ctx.fillRect(664, 72, 600, 640);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TWIN TIDES', 640, 260);
  ctx.font = '24px sans-serif';
  ctx.fillText('Spot the Difference', 640, 310);
  ctx.font = '18px sans-serif';
  ctx.fillText('Find 7 differences between the two panels.', 640, 390);
  ctx.fillText('Click to start', 640, 480);
  ctx.textAlign = 'left';
}
function drawLevelDone(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(16, 72, 600, 640);
  ctx.fillRect(664, 72, 600, 640);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 40px sans-serif';
  ctx.textAlign = 'center';
  let stars = mistakes === 0 ? '★★★' : mistakes <= 2 ? '★★☆' : '★☆☆';
  ctx.fillText('Level Complete!', 640, 260);
  ctx.font = '36px sans-serif';
  ctx.fillText(stars, 640, 320);
  ctx.font = '20px sans-serif';
  ctx.fillText(`Time: ${fmt(elapsed)}  Score: ${score}`, 640, 380);
  ctx.fillText('Click for next level', 640, 460);
  ctx.textAlign = 'left';
}
function drawFinal(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.fillRect(16, 72, 600, 640);
  ctx.fillRect(664, 72, 600, 640);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 40px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('You found them all!', 640, 260);
  ctx.font = '22px sans-serif';
  ctx.fillText(`Final Score: ${score}`, 640, 330);
  ctx.fillText(`Total Mistakes: ${mistakes}`, 640, 370);
  ctx.fillText(`Total Time: ${fmt(elapsed)}`, 640, 410);
  ctx.fillText('Click to play again', 640, 500);
  ctx.textAlign = 'left';
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTopBar(ctx);
    drawPanels(ctx);
    drawMarkers(ctx);
    drawBottomBar(ctx);
    if (mode === "title") {
        drawTitle(ctx);
    } else if (mode === "level-done") {
        drawLevelDone(ctx);
    } else if (mode === "final") {
        drawFinal(ctx);
    }
}function loop() {
  if (mode === 'play') {
    elapsed = Math.floor((Date.now() - levelStart) / 1000);
  }
  render();
  requestAnimationFrame(loop);
}

function triggerHint() {
  if (mode !== 'play' || hintsLeft <= 0) return;
  const diffs = curDiffs();
  const unfound = diffs.map((_, i) => i).filter(i => !found.has(i));
  if (unfound.length === 0) return;
  hintsLeft--;
hinted = unfound[0];
setTimeout(() => {
    hinted = -1;
}, 2000);
  beep(440, 150, 'sine');
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const cx = (e.clientX - rect.left) * (canvas.width / rect.width);
  const cy = (e.clientY - rect.top) * (canvas.height / rect.height);

  if (mode === 'title') {
    startLevel(0);
    return;
  }

  if (mode === 'level-done') {
    if (level + 1 < SCENES.length) {
      startLevel(level + 1);
    } else {
      mode = 'final';
    }
    return;
  }

  if (mode === 'final') {
    startLevel(0);
    hintsLeft = 3;
    score = 0;
    return;
  }

  if (cx >= HINT_BTN.x && cx <= HINT_BTN.x + HINT_BTN.w && cy >= HINT_BTN.y && cy <= HINT_BTN.y + HINT_BTN.h) {
    triggerHint();
    return;
  }

  const p = panelOf(cx);
  if (p === -1) return;

  const pt = toPanel(p, cx, cy);
  const lx = pt.x;
  const ly = pt.y;
  if (lx < 0 || lx > 600 || ly < 0 || ly > 640) return;

  const diffs = curDiffs();
  let clickedDiff = -1;
  for (let i = 0; i < diffs.length; i++) {
    if (found.has(i)) continue;
    const d = diffs[i];
    const dist = Math.hypot(lx - d.x, ly - d.y);
    const r = Math.max(d.r || 20, 15);
    if (dist <= r) {
      clickedDiff = i;
      break;
    }
  }

  if (clickedDiff !== -1) {
    found.add(clickedDiff);
    score += Math.max(100 - mistakes * 10 - elapsed, 10);
    if (hinted === clickedDiff) {
      hinted = -1;
    }
    beep(587.33, 200, 'triangle');
    if (found.size === diffs.length) {
      mode = 'level-done';
      beep(880, 400, 'sine');
    }
  } else {
    mistakes++;
wrongFlash = { x: x, y: y, time: Date.now() };
    beep(150, 200, 'sawtooth');
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'h' || e.key === 'H') {
    triggerHint();
  }
});

function start() {
  try {
    if (typeof drawShotState === 'function') {
      drawShotState();
    }
    render();
    window.__shotReady = true;
  } catch (err) {
    window.__shotError = err.message;
  }
  requestAnimationFrame(loop);
}

start();
