// 依存ゼロ。node tools/verify-css.mjs で走る。
// CSSから静的に判定できる項目だけを見る。幅ごとの横溢れはブラウザが要るので Task 11 で別途。
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CSS = ['style.css', 'meguri/style.css'];
const HTML = ['index.html', 'menu/index.html', 'schedule/index.html', 'story/index.html', 'meguri/index.html'];
const css = CSS.map((f) => readFileSync(f, 'utf8')).join('\n');
const html = HTML.map((f) => readFileSync(f, 'utf8')).join('\n');

const fails = [];
const check = (name, ok, detail) => {
  if (!ok) fails.push(`${name}: ${detail}`);
  console.log(`${ok ? '  OK ' : '  NG '} ${name}${ok ? '' : ' — ' + detail}`);
};

// --- コントラスト計算 ---
const lum = (hex) => {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.substr(i, 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
// :root の --name: #hex を拾う
const tokens = Object.fromEntries(
  [...css.matchAll(/--([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})\b/g)].map((m) => [m[1], m[2]])
);

console.log('\n=== 1. 文字色のコントラスト（紙 --paper の上で4.5以上） ===');
// 文字に使ってよい色は -ink 系と ink / ink-soft のみ。面用の素の色を文字に使っていないか
const TEXT_TOKENS = ['ink', 'ink-soft', 'sunset-ink', 'taupe-ink', 'amber-ink', 'tea-brown-ink', 'herbal'];
for (const t of TEXT_TOKENS) {
  if (!tokens[t]) { check(`--${t} が定義されている`, false, '未定義'); continue; }
  const r = ratio(tokens[t], tokens.paper);
  check(`--${t} on --paper`, r >= 4.5, `${r.toFixed(2)}（4.5未満）`);
}

console.log('\n=== 2. 面用の色を文字に使っていないか ===');
for (const t of ['sunset', 'taupe', 'amber', 'tea-brown']) {
  const used = new RegExp(`color:\\s*var\\(--${t}\\)`, 'g');
  const n = (css.match(used) || []).length;
  check(`color: var(--${t}) を使っていない`, n === 0, `${n}箇所で文字色に使用（--${t}-ink を使うこと）`);
}

console.log('\n=== 3. lemon / rose は深緑パネル専用 ===');
for (const t of ['lemon', 'rose']) {
  const n = (css.match(new RegExp(`color:\\s*var\\(--${t}\\)`, 'g')) || []).length;
  // 深緑の上でのみ使う。--dark 系の子孫セレクタ内に限る運用なので、
  // ここでは「素の color 指定が無いこと」ではなく「紙面のセクションで使われていないこと」を見る。
  // 自動判定が難しいため件数だけ報告し、0でなければ目視確認の対象とする。
  console.log(`  INFO --${t} を文字色に使っている箇所: ${n}（深緑パネル内であること）`);
}

console.log('\n=== 4. 純黒の影を使っていない ===');
const blackShadow = (css.match(/box-shadow:[^;}]*rgba\(\s*0\s*,\s*0\s*,\s*0\s*[,)]/g) || []);
check('rgba(0,0,0,…) の影が無い', blackShadow.length === 0, `${blackShadow.length}箇所: ${blackShadow.slice(0, 2).join(' / ')}`);

console.log('\n=== 5. 明朝（リュウミン）を使っていない ===');
const mincho = (css.match(/var\(--font-(mincho|ryumin|kanji)\)/g) || []);
check('明朝の参照が無い', mincho.length === 0, `${mincho.length}箇所`);

console.log('\n=== 6. ブレークポイントは2本だけ ===');
const bps = [...new Set((css.match(/@media[^{]*?(\d+)px/g) || []).map((m) => m.match(/(\d+)px/)[1]))]
  .map(Number).sort((a, b) => a - b);
check('ブレークポイントが 640 / 760 のみ', JSON.stringify(bps) === JSON.stringify([640, 760]), `実際: ${bps.join(', ')}`);

console.log('\n=== 7. ホバーは hover:hover でゲート ===');
const anyHover = (css.match(/any-hover/g) || []).length;
const gated = (css.match(/@media\s*\(\s*hover:\s*hover\s*\)/g) || []).length;
// すべての :hover ルールが @media (hover: hover) ブロックの内側にあるかを、波括弧の深さを追って数える。
// stack の各要素は「そのブロックがゲートの内側か」。親がゲート内なら子もゲート内。
const countUngatedHover = (src) => {
  const s = src.replace(/\/\*[\s\S]*?\*\//g, ''); // コメント内の { } や :hover を除く
  const stack = [];
  const hits = [];
  let head = '';
  for (const ch of s) {
    if (ch === '{') {
      const h = head.trim().replace(/\s+/g, ' ');
      const inGate = stack.length > 0 && stack[stack.length - 1];
      if (h.startsWith('@')) {
        stack.push(inGate || /^@media\b[^{]*\(\s*hover:\s*hover\s*\)/.test(h));
      } else {
        if (/:hover\b/.test(h) && !inGate) hits.push(h);
        stack.push(inGate);
      }
      head = '';
    } else if (ch === '}') {
      stack.pop();
      head = '';
    } else if (ch === ';') {
      head = '';
    } else {
      head += ch;
    }
  }
  return hits;
};
const ungatedHover = CSS.flatMap((f) => countUngatedHover(readFileSync(f, 'utf8')).map((h) => `${f}: ${h}`));
check('すべての :hover が @media (hover: hover) の内側にある', ungatedHover.length === 0,
  `${ungatedHover.length}件のルールがゲート外（例: ${ungatedHover.slice(0, 2).join(' | ')}）`);
check('any-hover を使っていない', anyHover === 0, `${anyHover}箇所`);
check('hover:hover のゲートがある', gated > 0, 'ゲートが1つも無い');

console.log('\n=== 8. アクセシビリティの穴埋め ===');
check(':focus-visible がある', /:focus-visible/.test(css), '未定義');
check('@media print で登場前を打ち消している', /@media\s+print/.test(css), '未定義（スクロール前に印刷すると白紙になる）');
check('prefers-reduced-motion がある', /prefers-reduced-motion/.test(css), '未定義');

console.log('\n=== 9. 装飾の英字ラベルに aria-hidden ===');
const eyebrows = (html.match(/class="[^"]*__eyebrow[^"]*"/g) || []).length;
const hidden = (html.match(/class="[^"]*__eyebrow[^"]*"[^>]*aria-hidden="true"|aria-hidden="true"[^>]*class="[^"]*__eyebrow/g) || []).length;
check('全 eyebrow に aria-hidden', eyebrows > 0 && hidden === eyebrows, `${hidden}/${eyebrows}`);

console.log('\n=== 10. 見出しのDOM順（和文が先、英字が後） ===');
// <h2 class="...__title">…</h2> より前に同セクションの __eyebrow が来ていないこと
const wrongOrder = (html.match(/class="[^"]*__eyebrow[^"]*"[\s\S]{0,200}?<h[1-6][^>]*class="[^"]*__title/g) || []).length;
check('eyebrow が title より後にある', wrongOrder === 0, `${wrongOrder}箇所で eyebrow が先に出ている`);

console.log(`\n${fails.length === 0 ? '✅ 全項目クリア' : `❌ ${fails.length}件の違反`}`);
process.exit(fails.length === 0 ? 0 : 1);
