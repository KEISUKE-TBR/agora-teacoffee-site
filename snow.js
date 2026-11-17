// ============ 雪（HOLIDAYシーズンの演出） ============
// 降る・画面の下に積もる（上限あり）・ポインタで払える。
// 方針：
//  - canvas 1枚、pointer-events なし。ページの操作は一切さえぎらない
//  - prefers-reduced-motion の人には何も出さない（動きを減らすのではなく、出さない）
//  - タブが隠れている間は完全に停止する
//  - 積雪は列ごとの高さ配列。上限に達した列には、それ以上積もらない
(function () {
  "use strict";

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var canvas = document.createElement("canvas");
  canvas.className = "snow-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");

  var W = 0, H = 0, DPR = 1;
  var COL = 4;                 // 積雪の解像度（CSS px / 列）
  var cols = 0;
  var pile = new Float32Array(0);   // 列ごとの積雪高（CSS px）
  var MAX_PILE = 64;                // これ以上は積もらない
  var flakes = [];                  // 降下中
  var puffs = [];                   // 払ったときに舞う粒

  function resize() {
    var oldPile = pile, oldCols = cols;
    W = innerWidth; H = innerHeight;
    DPR = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cols = Math.ceil(W / COL) + 1;
    pile = new Float32Array(cols);
    // 幅が変わっても、それまでの積雪をおおまかに引き継ぐ
    for (var i = 0; i < cols; i++) {
      var j = oldCols ? Math.min(oldCols - 1, Math.round(i * oldCols / cols)) : 0;
      pile[i] = oldPile[j] || 0;
    }
    MAX_PILE = W < 640 ? 44 : 64;
  }

  function makeFlake(randomY) {
    var r = 0.8 + Math.random() * 2.4;
    return {
      x: Math.random() * W,
      y: randomY ? Math.random() * H : -6 - Math.random() * 40,
      r: r,
      vy: 22 + r * 14 + Math.random() * 10,   // 大きい粒ほど速く＝奥行き
      phase: Math.random() * Math.PI * 2,
      amp: 6 + Math.random() * 20,
      sway: 0.6 + Math.random() * 0.9
    };
  }

  function targetCount() {
    return Math.min(Math.round(W / (W < 640 ? 13 : 10)), 140);
  }

  // 置く：周囲5列にゆるく分けて足す。丸みは毎フレームの settle() が作る
  function deposit(col, amount) {
    var spread = [[-2, 0.12], [-1, 0.22], [0, 0.32], [1, 0.22], [2, 0.12]];
    for (var s = 0; s < spread.length; s++) {
      var i = col + spread[s][0];
      if (i < 0 || i >= cols) continue;
      if (pile[i] < MAX_PILE) pile[i] = Math.min(MAX_PILE, pile[i] + amount * spread[s][1]);
    }
  }
  // 均す：急な段差を隣へ流す。左右両方向に1回ずつ掃くと、柱ではなく吹きだまりの形になる
  function flowTo(a, b) {
    var d = pile[a] - pile[b];
    if (d > 3) { var m = d / 4; pile[a] -= m; pile[b] += m; }
  }
  function settle() {
    for (var i = 1; i < cols; i++) flowTo(i - 1, i);
    for (var j = cols - 2; j >= 0; j--) flowTo(j + 1, j);
  }

  // 払う：ポインタ周辺の積雪を削り、削れたぶんだけ粒を舞わせる
  var lastPX = null, lastPY = null, lastPT = 0;
  addEventListener("pointermove", function (e) {
    var t = performance.now();
    if (lastPX !== null) {
      var dt = t - lastPT;
      var speed = dt > 0 ? Math.hypot(e.clientX - lastPX, e.clientY - lastPY) / dt : 0;
      var surfaceY = H - pile[Math.min(cols - 1, Math.max(0, Math.round(e.clientX / COL)))];
      if (speed > 0.25 && e.clientY > surfaceY - 36) {
        var dir = e.clientX - lastPX >= 0 ? 1 : -1;
        var R = 54, removed = 0;
        for (var i = 0; i < cols; i++) {
          var dx = Math.abs(i * COL - e.clientX);
          if (dx > R) continue;
          var cut = (1 - dx / R) * Math.min(14, speed * 10);
          if (cut > pile[i]) cut = pile[i];
          pile[i] -= cut; removed += cut;
        }
        for (var p = 0; p < Math.min(6, Math.round(removed / 8)); p++) {
          puffs.push({
            x: e.clientX + (Math.random() - 0.5) * R,
            y: surfaceY - Math.random() * 8,
            vx: dir * (30 + Math.random() * 120) + (Math.random() - 0.5) * 60,
            vy: -(40 + Math.random() * 120),
            r: 1 + Math.random() * 2,
            life: 0.7 + Math.random() * 0.5
          });
        }
      }
    }
    lastPX = e.clientX; lastPY = e.clientY; lastPT = t;
  }, { passive: true });

  function step(dt) {
    var i, f;
    if (flakes.length < targetCount() && Math.random() < 0.8) flakes.push(makeFlake(false));
    for (i = flakes.length - 1; i >= 0; i--) {
      f = flakes[i];
      f.phase += f.sway * dt;
      f.x += Math.sin(f.phase) * f.amp * dt;
      f.y += f.vy * dt;
      if (f.x < -8) f.x += W + 16; else if (f.x > W + 8) f.x -= W + 16;
      var col = Math.min(cols - 1, Math.max(0, Math.round(f.x / COL)));
      var ground = H - pile[col];
      if (f.y + f.r >= ground) {
        if (pile[col] < MAX_PILE) deposit(col, f.r * 3.2);  // 上限の列ではそのまま消える＝それ以上積もらない
        flakes.splice(i, 1);
      }
    }
    settle();
    for (i = puffs.length - 1; i >= 0; i--) {
      f = puffs[i];
      f.life -= dt;
      f.vy += 320 * dt;
      f.x += f.vx * dt; f.y += f.vy * dt;
      if (f.life <= 0 || f.y > H) puffs.splice(i, 1);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fff";
    var i, f;
    ctx.globalAlpha = 0.9;
    for (i = 0; i < flakes.length; i++) {
      f = flakes[i];
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.2832); ctx.fill();
    }
    for (i = 0; i < puffs.length; i++) {
      f = puffs[i];
      ctx.globalAlpha = Math.max(0, Math.min(0.9, f.life * 1.4));
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.2832); ctx.fill();
    }
    // 積雪：列の高さをなだらかに結んで1枚の面にする
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.moveTo(-2, H + 2);
    for (i = 0; i < cols; i++) {
      var x = i * COL;
      var y = H - (pile[i] > 0.4 ? pile[i] : 0);
      if (i === 0) ctx.lineTo(x, y);
      else {
        var px = (i - 0.5) * COL;
        var py = H - ((pile[i - 1] + pile[i]) / 2);
        ctx.quadraticCurveTo((i - 1) * COL, H - pile[i - 1], px, py);
      }
    }
    ctx.lineTo(W + 2, H - pile[cols - 1]);
    ctx.lineTo(W + 2, H + 2);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  var last = 0, raf = 0;
  function loop(t) {
    var dt = Math.min(0.05, (t - last) / 1000 || 0.016);
    last = t;
    step(dt);
    draw();
    raf = requestAnimationFrame(loop);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  });

  var rt;
  addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(resize, 150); });

  resize();
  // 最初から薄く敷いておく：開いた瞬間に「積もっている」と分かり、降る→積もるの因果も伝わる
  (function preseed() {
    var base = W < 640 ? 5 : 8;
    for (var i = 0; i < cols; i++) {
      pile[i] = base + Math.sin(i * 0.045) * 2.5 + Math.random() * 2;
    }
    for (var k = 0; k < 6; k++) settle();
  })();
  // 空中にも最初から降らせておく
  for (var i = 0; i < targetCount() / 2; i++) flakes.push(makeFlake(true));
  raf = requestAnimationFrame(loop);
})();
