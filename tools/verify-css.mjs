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
const INK_TOKENS = ['sunset-ink', 'rose-ink', 'lemon-ink', 'amber-ink', 'tea-brown-ink', 'herbal-ink', 'taupe-ink'];
const checkContrast = (t) => {
  if (!tokens[t]) { check(`--${t} が定義されている`, false, '未定義'); return; }
  const rs = [['紙', 'paper'], ['薄面', 'paper-2']].map(([label, bg]) => [label, ratio(tokens[t], tokens[bg])]);
  check(`--${t} on --paper / --paper-2`, rs.every(([, r]) => r >= 4.5),
    `${rs.map(([l, r]) => `${l} ${r.toFixed(2)}`).join(' / ')}（4.5未満）`);
};
for (const t of ['ink', 'ink-soft', ...INK_TOKENS]) checkContrast(t);

// 深緑 --dark の上では -ink は元の色より悪化する（2.67〜2.70）。静的には「どのルールが深緑の上か」を
// 確実には判定できない（.autumn__maker-text は紙、.autumn__cta は深緑、のように同じブロック名で面が違う）。
// そこで、(a) 既知の2か所だけは断定で見て、(b) -ink の使用箇所を全部並べて目視に回す。
const DARK_SAFE = /var\(--(dark-accent|dark-text|apricot)\)/;
const KNOWN_DARK = ['.hero__eyebrow', '.footer__social-label'];
const darkOffenders = [];
for (const sel of KNOWN_DARK) {
  const rs = rules.filter((r) => splitTop(r.head).includes(sel));
  const decls = rs.flatMap((r) => [...r.body.matchAll(TEXT_COLOR)].map((m) => ({ r, value: m[1].trim(), idx: m.index })));
  if (decls.length === 0) darkOffenders.push(`${sel}: 文字色の指定が見つからない`);
  for (const d of decls) {
    if (!DARK_SAFE.test(d.value)) darkOffenders.push(`${d.r.f}:${lineOf(d.r.src, d.r.bodyIdx + d.idx)}  ${sel} { color: ${d.value} }`);
  }
}
check('深緑パネル上の文字（.hero__eyebrow / .footer__social-label）が深緑用の色を使っている',
  darkOffenders.length === 0, '--dark-accent / --dark-text / --apricot のいずれかにすること（-ink は深緑の上で悪化する）', darkOffenders);
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
info(`-ink を文字色に使っている箇所: ${inkUses.length}件（深緑パネルの上では使わないこと。既知の深緑上は .hero__eyebrow と .footer__social-label）`);
for (const u of inkUses) console.log(`       ${u}`);

console.log('\n=== 2. 面用の色を文字に使っていないか ===');
const SURFACE = ['sunset', 'taupe', 'amber', 'tea-brown', 'herbal'];
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

console.log('\n=== 4. 純黒の影を使っていない ===');
// rgba(0,0,0,…) / rgb(0 0 0 / x) / #000 / black を、box-shadow・text-shadow・filter（drop-shadow）・--*shadow* の値から探す
const BLACK = String.raw`rgba?\(\s*0(?:\.0+)?%?\s*[,\s]\s*0(?:\.0+)?%?\s*[,\s]\s*0(?:\.0+)?%?\s*[,)/]|#0{3}(?:0{3})?\b|\bblack\b`;
const blackShadow = scanCss(/(?:box-shadow|text-shadow|filter|--[a-z0-9-]*shadow[a-z0-9-]*)\s*:[^;}]*/g)
  .filter(({ m }) => new RegExp(BLACK, 'i').test(m[0].slice(m[0].indexOf(':') + 1)));
check('純黒の影が無い（rgba(0,0,0,…) / rgb(0 0 0 / x) / drop-shadow を含む）', blackShadow.length === 0,
  `${blackShadow.length}箇所`, blackShadow.map((h) => h.loc));

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

console.log('\n=== 9. 装飾の英字ラベルに aria-hidden ===');
// 対象は「英字だけの装飾ラベル」。和文を含む eyebrow は実際の情報を持つので、隠すと支援技術から消える。
const CJK = /[\p{sc=Hiragana}\p{sc=Katakana}\p{sc=Han}]/u;
const eyebrowEls = htmlFiles.flatMap((file) =>
  [...file.src.matchAll(/<([a-z][a-z0-9]*)\b([^>]*\bclass="[^"]*__eyebrow[^"]*"[^>]*)>([\s\S]*?)<\/\1>/g)].map((m) => ({
    file, idx: m.index, attrs: m[2], text: m[3].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim(),
  })));
const decorative = eyebrowEls.filter((e) => !CJK.test(e.text));
const withJapanese = eyebrowEls.filter((e) => CJK.test(e.text));
const unhidden = decorative.filter((e) => !/\baria-hidden="true"/.test(e.attrs));
check('英字だけの装飾 eyebrow すべてに aria-hidden', decorative.length > 0 && unhidden.length === 0,
  `${decorative.length - unhidden.length}/${decorative.length}`, unhidden.map((e) => locOf(e.file, e.idx)));
info(`aria-hidden の対象外（和文を含む eyebrow。隠すと情報が消える）: ${withJapanese.length}件 ` +
  withJapanese.map((e) => `${e.file.f}:${lineOf(e.file.src, e.idx)} 「${e.text}」`).join(' / '));

console.log('\n=== 10. 見出しのDOM順（和文が先、英字が後） ===');
// <h2 class="...__title">…</h2> より前に同セクションの __eyebrow が来ていないこと
// 注意：hero__eyebrow と meguri-cta__eyebrow は和文を含む（check 9 の対象外）が、この判定には含まれる。
// 位置の横に印を付けるので、並べ替えてよい装飾ラベルかどうかは内容を見て決めること。
const wrongOrder = htmlFiles.flatMap((file) =>
  [...file.src.matchAll(/class="[^"]*__eyebrow[^"]*"[\s\S]{0,200}?<h[1-6][^>]*class="[^"]*__title/g)].map((m) => {
    const line = lineOf(file.src, m.index);
    const jp = eyebrowEls.some((e) => e.file === file && lineOf(file.src, e.idx) === line && CJK.test(e.text));
    return `${locOf(file, m.index)}${jp ? '   [和文を含む eyebrow]' : ''}`;
  }));
check('eyebrow が title より後にある', wrongOrder.length === 0, `${wrongOrder.length}箇所で eyebrow が先に出ている`, wrongOrder);

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
