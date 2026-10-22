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
  // 直前が - や英数字だと background-color: / border-color: などの末尾に当たってしまうので除く
  const used = new RegExp(`(?<![-A-Za-z0-9_])color:\\s*var\\(--${t}\\)`, 'g');
  const n = (css.match(used) || []).length;
  check(`color: var(--${t}) を使っていない`, n === 0, `${n}箇所で文字色に使用（--${t}-ink を使うこと）`);
}

console.log('\n=== 3. lemon / rose は深緑パネル専用 ===');
for (const t of ['lemon', 'rose']) {
  const n = (css.match(new RegExp(`(?<![-A-Za-z0-9_])color:\\s*var\\(--${t}\\)`, 'g')) || []).length;
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
// セレクタ列を、括弧の外のカンマで分ける（:where(a, button) の中のカンマでは切らない）
const splitTop = (s) => {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  out.push(cur.trim());
  return out.filter(Boolean);
};
// すべての :hover ルールが @media (hover: hover) ブロックの内側にあるかを、波括弧の深さを追って数える。
// stack の各要素は「そのブロックがゲートの内側か」。親がゲート内なら子もゲート内。
const countUngatedHover = (src) => {
  const s = src.replace(/\/\*[\s\S]*?\*\//g, ''); // コメント内の { } や :hover を除く
  const stack = [];
  const hits = [];
  const excluded = []; // ::-webkit-scrollbar 系。タッチ端末にスクロールバーのつまみは無いのでゲート不要
  let head = '';
  for (const ch of s) {
    if (ch === '{') {
      const h = head.trim().replace(/\s+/g, ' ');
      const inGate = stack.length > 0 && stack[stack.length - 1];
      if (h.startsWith('@')) {
        stack.push(inGate || /^@media\b[^{]*\(\s*hover:\s*hover\s*\)/.test(h));
      } else {
        const hoverParts = splitTop(h).filter((p) => /:hover\b/.test(p));
        if (hoverParts.length > 0 && !inGate) {
          // :hover を持つセレクタがすべて ::-webkit-scrollbar 系のときだけ除外する
          (hoverParts.every((p) => p.includes('::-webkit-scrollbar')) ? excluded : hits).push(h);
        }
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
  return { hits, excluded };
};
const hoverScan = CSS.map((f) => ({ f, ...countUngatedHover(readFileSync(f, 'utf8')) }));
const ungatedHover = hoverScan.flatMap(({ f, hits }) => hits.map((h) => `${f}: ${h}`));
const excludedHover = hoverScan.flatMap(({ f, excluded }) => excluded.map((h) => `${f}: ${h}`));
check('すべての :hover が @media (hover: hover) の内側にある', ungatedHover.length === 0,
  `${ungatedHover.length}件のルールがゲート外（例: ${ungatedHover.slice(0, 2).join(' | ')}）`);
console.log(`  INFO ::-webkit-scrollbar 系の :hover は数えていない（タッチ端末に無いため）: ${excludedHover.length}件`);
check('any-hover を使っていない', anyHover === 0, `${anyHover}箇所`);
check('hover:hover のゲートがある', gated > 0, 'ゲートが1つも無い');

console.log('\n=== 8. アクセシビリティの穴埋め ===');
// 個別部品（.sig-card / .mrow / .hero__cta …）の :focus-visible は既に9件ある。足りないのは、
// そこから漏れる素の a / button / フォーム部品を覆うグローバルな受け皿。
// なので「:focus-visible が存在するか」ではなく「a と button を一括で覆う規則があるか」を見る。
// 認める形は3つ（どれも結合子なし・クラス修飾なし・本体に実際のリングがあること）:
//   a:focus-visible / :where(a, button, …):focus-visible（:is も可） / :focus-visible 単独（* 付きも可）
// .foo a:focus-visible や a.foo:focus-visible のように、祖先やクラスで絞ったものは「全般」と見なさない。
const styleRules = (src) => {
  const s = src.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [];
  const stack = [];
  let last = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '{') {
      const head = s.slice(last, i).trim().replace(/\s+/g, ' ');
      stack.push({ head, isAt: head.startsWith('@'), start: i + 1 });
      last = i + 1;
    } else if (ch === '}') {
      const top = stack.pop();
      if (top && !top.isAt) rules.push({ head: top.head, body: s.slice(top.start, i) });
      last = i + 1;
    } else if (ch === ';') {
      last = i + 1;
    }
  }
  return rules;
};
// outline: none / 0 だけの規則はリングを「消す」ものなので数えない
const hasRing = (body) =>
  [...body.matchAll(/(?:^|[;\s])(?:outline|box-shadow)\s*:\s*([^;]+)/g)].some((m) => !/^(none|0)$/i.test(m[1].trim()));
const focusCoverage = (selector) => {
  const covered = new Set();
  for (const part of splitTop(selector)) {
    if (!part.includes(':focus-visible')) continue;
    // 括弧の中身を潰して、外側に結合子（空白 > + ~）があれば単一の複合セレクタではない
    let depth = 0;
    const flat = [...part].map((c) => {
      if (c === '(') { depth++; return c; }
      if (c === ')') { depth--; return c; }
      return depth > 0 ? '_' : c;
    }).join('');
    if (/[\s>+~]/.test(flat)) continue;
    let m;
    if (part === ':focus-visible' || part === '*:focus-visible') covered.add('*');
    else if ((m = part.match(/^:(?:where|is)\((.*)\):focus-visible$/))) {
      for (const item of splitTop(m[1])) if (/^[a-z][a-z0-9]*$/.test(item)) covered.add(item);
    } else if ((m = part.match(/^([a-z][a-z0-9]*):focus-visible$/))) covered.add(m[1]);
  }
  return covered;
};
const focusScan = CSS.map((f) => {
  const types = new Set();
  let componentRules = 0;
  for (const { head, body } of styleRules(readFileSync(f, 'utf8'))) {
    if (!head.includes(':focus-visible')) continue;
    componentRules++;
    if (hasRing(body)) for (const t of focusCoverage(head)) types.add(t);
  }
  return { f, types, componentRules };
});
const focusTypes = new Set(focusScan.flatMap(({ types }) => [...types]));
const focusGlobal = focusTypes.has('*') || (focusTypes.has('a') && focusTypes.has('button'));
check('a / button 全般を覆うグローバルな :focus-visible 規則がある', focusGlobal,
  '無い（部品別の規則だけ。例: :where(a, button, input, textarea, select, summary, [tabindex]):focus-visible { outline: … }）');
for (const { f, types, componentRules } of focusScan) {
  console.log(`  INFO ${f}: :focus-visible の規則 ${componentRules}件 / 全般を覆う要素: ${types.size ? [...types].join(', ') : 'なし'}`);
}
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
