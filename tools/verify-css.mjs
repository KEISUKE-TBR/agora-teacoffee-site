// 依存ゼロ。node tools/verify-css.mjs で走る（どのディレクトリから実行してもよい）。
// CSSから静的に判定できる項目だけを見る。幅ごとの横溢れはブラウザが要るので Task 11 で別途。
import { readFileSync } from 'node:fs';

// このスクリプト（tools/）の位置を基準にリポジトリ直下を解決する。cwd には依存しない。
const ROOT = new URL('../', import.meta.url);
const read = (f) => readFileSync(new URL(f, ROOT), 'utf8');
const readOpt = (f) => { try { return read(f); } catch { return null; } };

// meguri/ は別ブランド（独自の :root と書体を持つ受付終了済みキャンペーン）なので対象外。
const CSS = ['style.css'];
const HTML = ['index.html', 'menu/index.html', 'schedule/index.html', 'story/index.html'];

// コメントは同じ長さの空白に置き換える（行番号を保ったまま、コメント内の語に反応させない）
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
const cssFiles = CSS.map((f) => ({ f, src: stripComments(read(f)) }));
const htmlFiles = HTML.map((f) => ({ f, src: read(f) }));
const css = cssFiles.map((x) => x.src).join('\n');

// --- 位置の表示 ---
const CAP = 10;
const lineOf = (src, idx) => src.slice(0, idx).split('\n').length;
const excerpt = (s) => {
  const t = s.trim().replace(/\s+/g, ' ');
  return t.length > 100 ? t.slice(0, 99) + '…' : t;
};
const locOf = ({ f, src }, idx) => {
  const line = lineOf(src, idx);
  return `${f}:${line}  ${excerpt(src.split('\n')[line - 1] || '')}`;
};
// 全CSSに正規表現（gフラグ必須）を走らせ、一致ごとに位置つきで返す
const scanCss = (re) => cssFiles.flatMap((file) => [...file.src.matchAll(re)].map((m) => ({ m, loc: locOf(file, m.index) })));

const fails = [];
// locs を渡すと、NG のときだけ file:line を CAP 件まで並べる
const check = (name, ok, detail, locs = []) => {
  if (!ok) fails.push(`${name}: ${detail}`);
  console.log(`${ok ? '  OK ' : '  NG '} ${name}${ok ? '' : ' — ' + detail}`);
  if (!ok) {
    for (const l of locs.slice(0, CAP)) console.log(`        ${l}`);
    if (locs.length > CAP) console.log(`        … and ${locs.length - CAP} more`);
  }
};
const info = (msg) => console.log(`  INFO ${msg}`);

// --- CSS を波括弧の深さで読む ---
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
// 通常のルールを { head, body, line, bodyIdx, ctx } で、@ルールを { head, line } で返す。
// ctx は、そのルールを囲む @ルールの先頭部分の並び（@media … など）。
const parseCss = (file) => {
  const { f, src } = file;
  const rules = [];
  const ats = [];
  const stack = [];
  let last = 0;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') {
      const raw = src.slice(last, i);
      const head = raw.trim().replace(/\s+/g, ' ');
      const headIdx = last + (raw.length - raw.trimStart().length);
      const isAt = head.startsWith('@');
      if (isAt) ats.push({ f, head, line: lineOf(src, headIdx) });
      stack.push({ head, isAt, start: i + 1, headIdx });
      last = i + 1;
    } else if (ch === '}') {
      const top = stack.pop();
      if (top && !top.isAt) {
        rules.push({
          f, src, head: top.head, body: src.slice(top.start, i), bodyIdx: top.start,
          line: lineOf(src, top.headIdx), ctx: stack.filter((s) => s.isAt).map((s) => s.head),
        });
      }
      last = i + 1;
    } else if (ch === ';') {
      last = i + 1;
    }
  }
  return { rules, ats };
};
const parsed = cssFiles.map(parseCss);
const rules = parsed.flatMap((p) => p.rules);
const ats = parsed.flatMap((p) => p.ats);
const ruleLoc = (r) => `${r.f}:${r.line}  ${excerpt(r.head)}`;
// 文字色の宣言（background-color: や border-color: の末尾に当たらないよう、直前が識別子の文字なら除く）
const TEXT_COLOR = /(?<![-A-Za-z0-9_])color\s*:\s*([^;}]+)/g;
const varNames = (value) => [...value.matchAll(/var\(\s*--([a-z0-9-]+)/g)].map((x) => x[1]);

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

console.log('\n=== 1. 文字色のコントラスト（紙 --paper と薄面 --paper-2 の両方で4.5以上） ===');
// 文字に使ってよい色は -ink 系と ink / ink-soft のみ。面用の素の色を文字に使っていないか。
// 紙だけで測ると薄面（.menu .store .schedule__next .fact が乗る）で全部基準割れするので、両方の上で測る。
const INK_TOKENS = ['sunset-ink', 'rose-ink', 'lemon-ink', 'amber-ink', 'tea-brown-ink', 'herbal-ink', 'taupe-ink', 'holiday-ink'];
const checkContrast = (t) => {
  if (!tokens[t]) { check(`--${t} が定義されている`, false, '未定義'); return; }
  const rs = [['紙', 'paper'], ['薄面', 'paper-2']].map(([label, bg]) => [label, ratio(tokens[t], tokens[bg])]);
  check(`--${t} on --paper / --paper-2`, rs.every(([, r]) => r >= 4.5),
    `${rs.map(([l, r]) => `${l} ${r.toFixed(2)}`).join(' / ')}（4.5未満）`);
};
for (const t of ['ink', 'ink-soft', ...INK_TOKENS]) checkContrast(t);

// 深緑 --dark の上では -ink は元の色より悪化する（2.67〜2.70）。静的には「どのルールが深緑の上か」を
// 確実には判定できない（.autumn__maker-text は紙、.autumn__cta は深緑、のように同じブロック名で面が違う）。
// そこで、(a) 既知の3か所だけは断定で見て（--dark に対して 4.5 以上）、(b) -ink の使用箇所を全部並べて目視に回す。
// 既知の3か所はどれも --dark の面に乗っている:
//   .hero__eyebrow         今は --sunset（3.29）。--dark-accent #C9CF9E（8.66）にする
//   .meguri-cta__eyebrow   今は --dark-muted（5.33）で足りている。-ink には変えないこと
//   .footer__social-label  今は --sunset（3.29）。--dark-accent にする
const KNOWN_DARK = ['.hero__eyebrow', '.meguri-cta__eyebrow', '.footer__social-label'];
const darkOffenders = [];
const darkNow = [];
for (const sel of KNOWN_DARK) {
  const rs = rules.filter((r) => splitTop(r.head).includes(sel));
  const decls = rs.flatMap((r) => [...r.body.matchAll(TEXT_COLOR)].map((m) => ({ r, value: m[1].trim(), idx: m.index })));
  if (decls.length === 0) darkOffenders.push(`${sel}: 文字色の指定が見つからない`);
  for (const d of decls) {
    const where = `${d.r.f}:${lineOf(d.r.src, d.r.bodyIdx + d.idx)}  ${sel} { color: ${d.value} }`;
    const name = (d.value.match(/^var\(\s*--([a-z0-9-]+)\s*\)(?:\s*!important)?$/) || [])[1];
    if (!name || !tokens[name] || !tokens.dark) { darkOffenders.push(`${where}  （色を解決できない）`); continue; }
    const rr = ratio(tokens[name], tokens.dark);
    darkNow.push(`${sel} = --${name} ${rr.toFixed(2)}`);
    if (rr < 4.5) darkOffenders.push(`${where}  → --dark の上で ${rr.toFixed(2)}`);
  }
}
check('深緑パネル上の文字（.hero__eyebrow / .meguri-cta__eyebrow / .footer__social-label）が --dark の上で4.5以上',
  darkOffenders.length === 0, '--dark-accent #C9CF9E（8.66）/ --dark-text（11.80）/ --apricot（6.93）を使う。-ink は 2.67〜2.70 に悪化するので使わない', darkOffenders);
info(`深緑パネル上の既知ルールの現状: ${darkNow.join(' / ')}`);
const darkSurfaces = new Set();
for (const r of rules) {
  if (!/(?:^|[;\s])background(?:-color)?\s*:\s*var\(--dark(?:-deep)?\)/.test(r.body)) continue;
  for (const p of splitTop(r.head)) { const m = p.match(/^\.([a-z0-9_-]+)$/i); if (m) darkSurfaces.add(m[1]); }
}
const darkBlocks = new Set([...darkSurfaces].filter((c) => !c.includes('__')));
const maybeDark = (head) => [...head.matchAll(/\.([a-z0-9_-]+)/gi)].some((m) =>
  darkSurfaces.has(m[1]) || darkBlocks.has(m[1].split(/__|--/)[0]));
const inkUses = rules.flatMap((r) => [...r.body.matchAll(TEXT_COLOR)]
  .filter((m) => varNames(m[1]).some((n) => n.endsWith('-ink')))
  .map((m) => `${r.f}:${lineOf(r.src, r.bodyIdx + m.index)}  ${excerpt(r.head)}  { color: ${m[1].trim()} }${maybeDark(r.head) ? '   <-- 深緑パネル上の可能性あり' : ''}`));
info(`-ink を文字色に使っている箇所: ${inkUses.length}件（深緑パネルの上では使わないこと。既知の深緑上は .hero__eyebrow / .meguri-cta__eyebrow / .footer__social-label）`);
for (const u of inkUses) console.log(`       ${u}`);

console.log('\n=== 2. 面用の色を文字に使っていないか ===');
const SURFACE = ['sunset', 'taupe', 'amber', 'tea-brown', 'herbal', 'holiday'];
for (const t of SURFACE) {
  // 直前が - や英数字だと background-color: / border-color: などの末尾に当たってしまうので除く
  const used = new RegExp(String.raw`(?<![-A-Za-z0-9_])color:\s*var\(--${t}\)`, 'g');
  const hits = scanCss(used);
  check(`color: var(--${t}) を使っていない`, hits.length === 0, `${hits.length}箇所で文字色に使用（--${t}-ink を使うこと）`, hits.map((h) => h.loc));
}
// 間接参照：カテゴリ側が面の色を --accent / --flavor / --dot に流し込み、文字がそれを読む経路。
// #soda が --accent に rose を入れており、.mcat__title は紙の上で 3.00 しかない。
// 文字が読む名前は -ink で終わること。--flavor-ink, var(--sunset) のようにフォールバックに面の色が残るのも不可。
const indirectBad = scanCss(TEXT_COLOR).filter(({ m }) => {
  const names = varNames(m[1]);
  const indirect = names.filter((n) => /^(accent|flavor|dot)(-[a-z0-9-]+)?$/.test(n));
  if (indirect.length === 0) return false;
  return indirect.some((n) => !n.endsWith('-ink')) || names.some((n) => [...SURFACE, 'rose', 'lemon'].includes(n));
});
check('間接参照（--accent / --flavor / --dot）を文字色に使うときは -ink を指している', indirectBad.length === 0,
  `${indirectBad.length}箇所が面の色を文字に流している（--accent-ink / --flavor-ink を併設して参照すること）`, indirectBad.map((h) => h.loc));

console.log('\n=== 3. lemon / rose は深緑パネル専用 ===');
for (const t of ['lemon', 'rose']) {
  const n = scanCss(new RegExp(String.raw`(?<![-A-Za-z0-9_])color:\s*var\(--${t}\)`, 'g')).length;
  // 深緑の上でのみ使う。--dark 系の子孫セレクタ内に限る運用なので、
  // ここでは「素の color 指定が無いこと」ではなく「紙面のセクションで使われていないこと」を見る。
  // 自動判定が難しいため件数だけ報告し、0でなければ目視確認の対象とする。
  console.log(`  INFO --${t} を文字色に使っている箇所: ${n}（深緑パネル内であること）`);
}

console.log('\n=== 4. 純黒を使っていない（どのプロパティでも） ===');
// 「真っ黒は使わない」はプロパティを問わない規則。影だけでなく background / border / outline / fill /
// カスタムプロパティ / グラデーションの色止め / color-mix の引数 / var() のフォールバック、すべての値を見る。
// 数えるもの:  #000  #000f  #000000  #000000ff（8桁も）  black
//              rgb(0,0,0)  rgba(0,0,0,x)  rgb(0 0 0 / x)  rgb(0% 0% 0%)
//              hsl(0,0%,0%)  hsl(0 0% 0% / x)  hsl(200 50% 0%)（明度0%ならどの色相でも黒）
// 数えないもの: transparent、アルファが 0 と明記された黒（rgba(0,0,0,0) / #0000 / #00000000 / rgb(0 0 0 / 0)。描画される画素が無い）、
//              黒ではない色（#000aff は青、#000001 / rgb(0 0 1) もほぼ黒だが黒ではない）、
//              クラス名・var(--shadow-black) のような名前・"..." と url(...) と font の中身の語。
//
// 注意：.meguri-cta__photo img の --m（mask-image に使うラジアルグラデーション5本）にも #000 がある。
// mask は alpha チャンネルしか読まないので、ここの RGB は一切描画されない。それでもこの規則に例外は作らない
// （例外のある規則は腐る）。非黒に替えても mask の結果は変わらない（alpha は同じ）ので、挙動は不変。
// 後で誰かが「mask だから #000 でも同じ」と戻さないこと。この検査が落ちるのはそのため。
const blank = (m) => m.replace(/[^\n]/g, ' ');
const stripNonColor = (body) => body.replace(
  /url\([^)]*\)|"[^"]*"|'[^']*'|var\(\s*--[a-z0-9-]+|(?<![-\w])font(?:-family)?\s*:[^;}]*/gi, blank);
const isZero = (t) => t !== undefined && /^[+-]?(?:\d+\.?\d*|\.\d+)%?$/.test(t) && parseFloat(t) === 0;
const colorArgs = (inner) => inner.trim().split(/[\s,/]+/).filter(Boolean);
const blackColors = (text) => {
  const found = [];
  for (const m of text.matchAll(/#([0-9a-f]+)\b/gi)) {
    const h = m[1].toLowerCase();
    const black = (h.length === 3 && h === '000') || (h.length === 4 && h.startsWith('000') && h[3] !== '0')
      || (h.length === 6 && h === '000000') || (h.length === 8 && h.startsWith('000000') && h.slice(6) !== '00');
    if (black) found.push({ index: m.index, text: m[0] });
  }
  for (const m of text.matchAll(/(?<![-\w])(rgba?|hsla?)\(([^()]*)\)/gi)) {
    const a = colorArgs(m[2]);
    const black = m[1].toLowerCase().startsWith('hsl') ? isZero(a[2]) : [a[0], a[1], a[2]].every(isZero);
    if (black && !isZero(a[3])) found.push({ index: m.index, text: m[0] });
  }
  for (const m of text.matchAll(/(?<![-\w])black(?![-\w])/gi)) found.push({ index: m.index, text: m[0] });
  return found.sort((x, y) => x.index - y.index);
};
const pureBlack = rules.flatMap((r) => blackColors(stripNonColor(r.body)).map((b) => locOf(r, r.bodyIdx + b.index)));
check('純黒が無い（#000 / #000000ff / black / rgb(0 0 0 / x) / hsl(0 0% 0%) など、どの値でも）', pureBlack.length === 0,
  `${pureBlack.length}箇所（mask-image のグラデーション内の #000 を含む。mask でも例外にしない）`, pureBlack);

console.log('\n=== 5. 明朝（リュウミン）を使っていない ===');
const mincho = scanCss(/var\(--font-(mincho|ryumin|kanji)\)/g);
check('明朝の参照が無い', mincho.length === 0, `${mincho.length}箇所`, mincho.map((h) => h.loc));

console.log('\n=== 6. ブレークポイントは2本だけ ===');
// @media 1つに px が複数あっても全部読む（min-width と max-width の組など）
const bpAts = ats.filter((a) => a.head.startsWith('@media')).map((a) => ({
  a, px: [...a.head.matchAll(/(\d+(?:\.\d+)?)px/g)].map((m) => Number(m[1])),
}));
const bps = [...new Set(bpAts.flatMap((x) => x.px))].sort((a, b) => a - b);
check('ブレークポイントが 640 / 760 のみ', JSON.stringify(bps) === JSON.stringify([640, 760]), `実際: ${bps.join(', ')}`,
  bpAts.filter((x) => x.px.some((p) => p !== 640 && p !== 760)).map((x) => `${x.a.f}:${x.a.line}  ${excerpt(x.a.head)}`));

console.log('\n=== 7. ホバーは hover:hover でゲート ===');
const anyHover = (css.match(/any-hover/g) || []).length;
// ゲートの判定は1つの述語に揃える（@media screen and (hover: hover) もゲートとして数える）
const isHoverGate = (h) => /^@media\b[^{]*\(\s*hover:\s*hover\s*\)/.test(h);
const gated = ats.filter((a) => isHoverGate(a.head)).length;
// すべての :hover ルールが @media (hover: hover) ブロックの内側にあるかを数える。
// ルールを囲む @ルールのどれかがゲートなら内側。
const hoverRules = rules.map((r) => ({ r, parts: splitTop(r.head).filter((p) => /:hover\b/.test(p)) }))
  .filter((x) => x.parts.length > 0 && !x.r.ctx.some(isHoverGate));
// ::-webkit-scrollbar 系はタッチ端末にスクロールバーのつまみが無いので、ゲートしても挙動は変わらない。
// :hover を持つセレクタがすべて scrollbar 系のときだけ除外し、件数は別に出す。
const isScrollbar = (x) => x.parts.every((p) => p.includes('::-webkit-scrollbar'));
const ungatedHover = hoverRules.filter((x) => !isScrollbar(x)).map((x) => ruleLoc(x.r));
const excludedHover = hoverRules.filter(isScrollbar);
check('すべての :hover が @media (hover: hover) の内側にある', ungatedHover.length === 0,
  `${ungatedHover.length}件のルールがゲート外`, ungatedHover);
console.log(`  INFO ::-webkit-scrollbar 系の :hover は数えていない（タッチ端末に無いため）: ${excludedHover.length}件`);
check('any-hover を使っていない', anyHover === 0, `${anyHover}箇所`);
check('hover:hover のゲートがある', gated > 0, 'ゲートが1つも無い');

console.log('\n=== 8. アクセシビリティの穴埋め ===');
// 個別部品（.sig-card / .mrow / .hero__cta …）の :focus-visible は既に8件ある。足りないのは、
// そこから漏れる素の a / button / フォーム部品を覆うグローバルな受け皿。
// なので「:focus-visible が存在するか」ではなく「a と button を一括で覆う規則があるか」を見る。
// 認める形は3つ（どれも結合子なし・クラス修飾なし・本体に実際のリングがあること）:
//   a:focus-visible / :where(a, button, …):focus-visible（:is も可） / :focus-visible 単独（* 付きも可）
// .foo a:focus-visible や a.foo:focus-visible のように、祖先やクラスで絞ったものは「全般」と見なさない。
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
const focusScan = parsed.map((p, i) => {
  const types = new Set();
  let componentRules = 0;
  for (const { head, body } of p.rules) {
    if (!head.includes(':focus-visible')) continue;
    componentRules++;
    if (hasRing(body)) for (const t of focusCoverage(head)) types.add(t);
  }
  return { f: CSS[i], types, componentRules };
});
const focusTypes = new Set(focusScan.flatMap(({ types }) => [...types]));
const focusGlobal = focusTypes.has('*') || (focusTypes.has('a') && focusTypes.has('button'));
check('a / button 全般を覆うグローバルな :focus-visible 規則がある', focusGlobal,
  '無い（部品別の規則だけ。例: :where(a, button, input, textarea, select, summary, [tabindex]):focus-visible { outline: … }）');
for (const { f, types, componentRules } of focusScan) {
  console.log(`  INFO ${f}: :focus-visible の規則 ${componentRules}件 / 全般を覆う要素: ${types.size ? [...types].join(', ') : 'なし'}`);
}
// 印刷：.reveal は既定で opacity:0 なので、スクロール前に印刷すると本文が白紙になる。
// @media print の中で .reveal を opacity:1 / transform:none に戻していることまで見る（コメント内の語には反応しない）。
const printRules = rules.filter((r) => r.ctx.some((c) => /^@media\s+print\b/.test(c)));
const printUnhidesReveal = printRules.some((r) =>
  splitTop(r.head).some((p) => /\.reveal(?![\w-])/.test(p)) &&
  /(?:^|[;\s])opacity\s*:\s*1\b/.test(r.body) && /(?:^|[;\s])transform\s*:\s*none\b/.test(r.body));
const hasPrintBlock = ats.some((a) => /^@media\s+print\b/.test(a.head));
check('@media print で .reveal を表示状態（opacity:1 / transform:none）に戻している', printUnhidesReveal,
  hasPrintBlock ? '@media print はあるが .reveal を戻していない' : '未定義（スクロール前に印刷すると白紙になる）');
// prefers-reduced-motion は今のサイトに既にあり、有無では何も採点できない。
// モーショントークン（--dur など）の導入後に、新しい動きまで止まっているかを目視できるよう中身だけ出す。
const rmRules = rules.filter((r) => r.ctx.some((c) => /prefers-reduced-motion/.test(c)));
const yn = (b) => (b ? 'あり' : 'なし');
info(`prefers-reduced-motion: ${ats.filter((a) => /prefers-reduced-motion/.test(a.head)).length}ブロック・規則${rmRules.length}件` +
  `（.reveal を戻している: ${yn(rmRules.some((r) => /\.reveal(?![\w-])/.test(r.head)))}` +
  ` / transition・animation を止めている: ${yn(rmRules.some((r) => /(?:transition|animation)\s*:\s*none/.test(r.body)))}` +
  ` / --dur を参照している: ${yn(rmRules.some((r) => /--dur/.test(r.body)))}）。--dur 系の導入後は新しい動きも止まるか目視で確認`);

console.log('\n=== 9. 装飾の英字ラベルに aria-hidden（section__eyebrow のみ） ===');
// 対象は section__eyebrow だけ。中身は AUTUMN TEA TIME / VISION のような装飾のラテン文字。
// hero__eyebrow（千葉のキッチンカー ／ TEA & COFFEE）と meguri-cta__eyebrow（巡 恩送りチケット MEGURI）は
// 業態や企画名を伝える日本語で、英字が和文の重複になっていない。隠す・薄くする・並べ替えるといずれも情報が消えるので
// 対象外にし、それを守らせる逆向きの検査を check 10 の下に置く。
// イロコトの型が成り立つのは、和文と英字が同じ意味を重複して持っているとき（事業内容 / Services）だけ。
const classesOf = (attrs) => ((attrs.match(/class="([^"]*)"/) || [])[1] || '').split(/\s+/);
const eyebrowEls = htmlFiles.flatMap((file) =>
  [...file.src.matchAll(/<([a-z][a-z0-9]*)\b([^>]*\bclass="[^"]*__eyebrow[^"]*"[^>]*)>([\s\S]*?)<\/\1>/g)].map((m) => ({
    file, idx: m.index, attrs: m[2], classes: classesOf(m[2]), text: m[3].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim(),
  })));
const sectionEyebrows = eyebrowEls.filter((e) => e.classes.includes('section__eyebrow'));
const otherEyebrows = eyebrowEls.filter((e) => !e.classes.includes('section__eyebrow'));
const unhidden = sectionEyebrows.filter((e) => !/\baria-hidden="true"/.test(e.attrs));
check('section__eyebrow すべてに aria-hidden', sectionEyebrows.length > 0 && unhidden.length === 0,
  `${sectionEyebrows.length - unhidden.length}/${sectionEyebrows.length}`, unhidden.map((e) => locOf(e.file, e.idx)));
info(`check 9・10 の対象外（section__eyebrow 以外。内容を持つ日本語なので隠さず順序も動かさない）: ${otherEyebrows.length}件 ` +
  otherEyebrows.map((e) => `${e.file.f}:${lineOf(e.file.src, e.idx)} ${e.classes[0]} 「${e.text}」`).join(' / '));

console.log('\n=== 10. 見出しのDOM順（和文が先、英字が後。section__eyebrow のみ） ===');
// <h2 class="...__title">…</h2> より前に同じセクションの section__eyebrow が来ていないこと。
// </section> や <section をまたいだ先の見出しは数えない。
const SAME_SECTION = String.raw`(?:(?!</section>|<section)[\s\S]){0,200}?`;
const eyebrowFirst = (cls) => new RegExp(String.raw`class="[^"]*\b${cls}\b[^"]*"${SAME_SECTION}<h[1-6][^>]*class="[^"]*__title`, 'g');
const wrongOrder = htmlFiles.flatMap((file) =>
  [...file.src.matchAll(eyebrowFirst('section__eyebrow'))].map((m) => locOf(file, m.index)));
check('section__eyebrow が title より後にある', wrongOrder.length === 0,
  `${wrongOrder.length}箇所で eyebrow が先に出ている`, wrongOrder);
// 逆向きの検査：内容を持つ日本語の eyebrow を、装飾のラテン文字と同じ扱いにしていないこと。
// aria-hidden を付けない / title の前から動かさない / opacity を落とさない（0.7 未満にしない）。
const PROTECTED = ['hero__eyebrow', 'meguri-cta__eyebrow'];
const protectedBad = [];
for (const cls of PROTECTED) {
  const els = eyebrowEls.filter((e) => e.classes.includes(cls));
  if (els.length === 0) protectedBad.push(`${cls}: 見つからない（削除・改名された?）`);
  for (const e of els) {
    if (/\baria-hidden="true"/.test(e.attrs)) protectedBad.push(`${locOf(e.file, e.idx)}   aria-hidden が付いている（読み上げから消える）`);
    const beforeTitle = new RegExp(String.raw`^<[a-z][a-z0-9]*[^>]*>${SAME_SECTION}<h[1-6][^>]*class="[^"]*__title`);
    if (!beforeTitle.test(e.file.src.slice(e.idx))) protectedBad.push(`${locOf(e.file, e.idx)}   title の後ろに動いている`);
  }
}
for (const r of rules) {
  for (const cls of PROTECTED) {
    if (!splitTop(r.head).some((p) => new RegExp(String.raw`\.${cls}(?![\w-])`).test(p))) continue;
    for (const m of r.body.matchAll(/(?:^|[;\s])opacity\s*:\s*([\d.]+)/g)) {
      const v = Number(m[1]);
      if (v > 0 && v < 0.7) protectedBad.push(`${r.f}:${r.line}  .${cls} { opacity: ${m[1]} }（薄くすると店の説明が読めなくなる）`);
    }
  }
}
check('和文を含む eyebrow（hero__eyebrow / meguri-cta__eyebrow）を装飾扱いにしていない', protectedBad.length === 0,
  '内容を持つ日本語なので、aria-hidden・title の後ろへの移動・opacity の引き下げをしない', protectedBad);


console.log('\n=== 11. 配信物から外すもの（.assetsignore） ===');
// wrangler.jsonc の assets.directory が ./ なので、置いたものはそのまま公開される
// （本番は https://agora-teacoffee.com/wrangler.jsonc が既に 200 を返す）。docs/ と tools/ が出てしまわないこと。
const ai = readOpt('.assetsignore');
const aiPatterns = (ai || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const aiCovers = (name) => aiPatterns.some((p) => p.replace(/^\/+/, '').replace(/(\/\*\*)?\/*$/, '') === name);
const aiMissing = ['docs', 'tools'].filter((d) => !aiCovers(d));
check('.assetsignore があり docs/ と tools/ を除外している', ai !== null && aiMissing.length === 0,
  ai === null ? '.assetsignore が無い（docs/ と tools/ がそのまま公開される）' : `${aiMissing.map((d) => d + '/').join(' と ')} が含まれていない`);

console.log(`\n${fails.length === 0 ? '✅ 全項目クリア' : `❌ ${fails.length}件の違反`}`);
process.exit(fails.length === 0 ? 0 : 1);
