// Runs the real tools/verify-css.mjs against synthetic mini-repos and asserts on its output.
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SCRIPT = fileURLToPath(new URL('./verify-css.mjs', import.meta.url));

const BASE_CSS = `:root {
  --paper: #FBF9F3; --paper-2: #F3EEE3; --ink: #2b2b26; --ink-soft: #676d6c; --dark-muted: #9aa19b;
  --sunset-ink: #af5035; --rose-ink: #975c63; --lemon-ink: #66722b; --amber-ink: #8e6336;
  --tea-brown-ink: #83674f; --herbal-ink: #5a734f; --taupe-ink: #706c5b;
  --dark: #16302a; --dark-accent: #C9CF9E; --dark-text: #EDEBE2; --apricot: #E8A87C;
  --sunset: #C55A3B;
}
.hero { background: var(--dark); }
.hero__eyebrow { color: var(--dark-accent); }
.footer { background: var(--dark); }
.footer__social-label { color: var(--dark-text); }
.body { color: var(--ink); }
@media (hover: hover) { a:hover { opacity: 0.7; } }
@media (max-width: 640px) { .a { x: y; } }
@media (max-width: 760px) { .b { x: y; } }
:where(a, button, input):focus-visible { outline: 3px solid var(--sunset-ink); outline-offset: 2px; }
@media print { .reveal { opacity: 1 !important; transform: none !important; } }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }
.card { box-shadow: 0 1px 2px rgba(43, 43, 38, 0.1); color: var(--accent-ink); }
.meguri-cta { background: var(--dark); }
.meguri-cta__eyebrow { color: var(--dark-muted); }
`;
const page = (eyebrowAttrs = 'aria-hidden="true"') => `<section>
<h2 class="section__title">Title</h2>
<p class="section__eyebrow" ${eyebrowAttrs}>STORY</p>
</section>
`;

const INDEX = '<section><p class="hero__eyebrow reveal">千葉のキッチンカー ／ TEA &amp; COFFEE</p><h1 class="hero__title">T</h1></section>\n' +
  '<section><p class="meguri-cta__eyebrow"><span>巡</span>恩送りチケット MEGURI</p><h2 class="meguri-cta__title">T</h2></section>\n' + page();

function run({ css = BASE_CSS, pages = {}, assetsignore = 'docs/\ntools/\n', cwd } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'vcss-'));
  mkdirSync(join(dir, 'tools'));
  copyFileSync(SCRIPT, join(dir, 'tools', 'verify-css.mjs'));
  writeFileSync(join(dir, 'style.css'), css);
  for (const p of ['index.html', 'menu/index.html', 'schedule/index.html', 'story/index.html']) {
    mkdirSync(join(dir, p, '..'), { recursive: true });
    writeFileSync(join(dir, p), pages[p] ?? (p === 'index.html' ? INDEX : page()));
  }
  if (assetsignore !== null) writeFileSync(join(dir, '.assetsignore'), assetsignore);
  const r = spawnSync('node', [join(dir, 'tools', 'verify-css.mjs')], { cwd: cwd ?? dir, encoding: 'utf8' });
  rmSync(dir, { recursive: true, force: true });
  return { code: r.status, out: r.stdout + r.stderr };
}

let bad = 0;
const t = (name, cond, extra = '') => { if (!cond) bad++; console.log(`${cond ? 'ok ' : 'BAD'} ${name}${cond ? '' : '\n      ' + extra}`); };
const line = (out, needle) => out.split('\n').find((l) => l.includes(needle)) || '';
const has = (out, needle) => out.includes(needle);

// ---- baseline ----
const base = run();
t('baseline: exits 0 and says all clear', base.code === 0 && has(base.out, '全項目クリア'), base.out);
const elsewhere = run({ cwd: tmpdir() });
t('baseline run from another cwd still passes (paths resolve from the script)', elsewhere.code === 0, elsewhere.out);

// ---- F1: background-color is not a text colour ----
let r = run({ css: BASE_CSS + '.x { background-color: var(--sunset); border-color: var(--sunset); }\n' });
t('F1: background-color/border-color: var(--sunset) not counted', has(line(r.out, 'color: var(--sunset) を使っていない'), 'OK'), r.out);
r = run({ css: BASE_CSS + '.x { color: var(--sunset); }\n' });
t('F1/F7: real text-colour use is NG with file:line', has(line(r.out, 'color: var(--sunset)'), 'NG') && has(r.out, 'style.css:22'), r.out);
r = run({ css: BASE_CSS + '.x { color: var(--herbal); }\n' });
t('F6: bare --herbal as text is NG', has(line(r.out, 'color: var(--herbal)'), 'NG'), r.out);

// ---- F5: indirect paths ----
const ind = (decl) => run({ css: BASE_CSS + `.x { ${decl} }\n` });
const indLine = (rr) => line(rr.out, '間接参照');
t('F5: color: var(--accent) is NG', has(indLine(ind('color: var(--accent);')), 'NG'), ind('color: var(--accent);').out);
t('F5: color: var(--accent-ink) is OK', has(indLine(ind('color: var(--accent-ink);')), 'OK'));
t('F5: color: var(--flavor, var(--sunset)) is NG', has(indLine(ind('color: var(--flavor, var(--sunset));')), 'NG'));
t('F5: color: var(--flavor-ink, var(--sunset)) is NG (surface colour left as fallback)', has(indLine(ind('color: var(--flavor-ink, var(--sunset));')), 'NG'));
t('F5: color: var(--flavor-ink, var(--sunset-ink)) is OK', has(indLine(ind('color: var(--flavor-ink, var(--sunset-ink));')), 'OK'));
t('F5: color: var(--dot) is NG', has(indLine(ind('color: var(--dot);')), 'NG'));
t('F5: background: var(--accent) (surface) is not flagged', has(indLine(ind('background: var(--accent); border-color: var(--accent);')), 'OK'));
t('F5: color: var(--accent, var(--sunset)) is NG', has(indLine(ind('color: var(--accent, var(--sunset));')), 'NG'));

// ---- F6: contrast on both backgrounds ----
r = run({ css: BASE_CSS.replace('--ink-soft: #676d6c', '--ink-soft: #6a706f') });
t('F6: --ink-soft #6a706f fails (paper 4.79 ok, paper-2 4.36)', has(line(r.out, '--ink-soft'), 'NG') && has(line(r.out, '--ink-soft'), '薄面 4.36'), r.out);
r = run({ css: BASE_CSS.replace('--herbal-ink: #5a734f', '--herbal-ink: #5F7A54') });
t('F6: --herbal-ink at the old #5F7A54 fails on paper-2 only', has(line(r.out, '--herbal-ink'), 'NG') && has(line(r.out, '--herbal-ink'), '薄面 4.13'), line(r.out, '--herbal-ink'));
r = run({ css: BASE_CSS.replace('--rose-ink: #975c63;', '') });
t('F6: missing --rose-ink is NG undefined', has(line(r.out, '--rose-ink'), '未定義'), r.out);
t('F6: all 7 -ink tokens + ink + ink-soft pass in baseline', ['sunset', 'rose', 'lemon', 'amber', 'tea-brown', 'herbal', 'taupe'].every((n) => has(line(base.out, `--${n}-ink on`), 'OK')) && has(line(base.out, '--ink on'), 'OK') && has(line(base.out, '--ink-soft on'), 'OK'), base.out);

// ---- F6: dark panel ----
r = run({ css: BASE_CSS.replace('.hero__eyebrow { color: var(--dark-accent); }', '.hero__eyebrow { color: var(--sunset-ink); }') });
t('F6 dark: .hero__eyebrow with -ink is NG with location', has(line(r.out, '深緑パネル上の文字'), 'NG') && has(r.out, 'style.css:9  .hero__eyebrow'), r.out);
r = run({ css: BASE_CSS.replace('.footer__social-label { color: var(--dark-text); }', '.footer__social-label { color: var(--sunset); }') });
t('F6 dark: .footer__social-label with --sunset is NG', has(line(r.out, '深緑パネル上の文字'), 'NG'), r.out);
r = run({ css: BASE_CSS + '.footer__legal { color: var(--taupe-ink); }\n.card2 { color: var(--amber-ink); }\n' });
t('F6 dark INFO: lists every -ink use, flags the one under a dark block only',
  has(r.out, '-ink を文字色に使っている箇所: 3件') && /footer__legal[^\n]*深緑パネル上の可能性/.test(r.out) && !/card2[^\n]*深緑パネル上の可能性/.test(r.out), r.out);
t('F6 dark: baseline reports its one -ink use (the .card accent-ink)', has(base.out, '-ink を文字色に使っている箇所: 1件'));

// ---- F3/7: hover ----
r = run({ css: BASE_CSS + 'b:hover { x: y; }\n' });
t('F7: bare :hover is NG, count 1, with file:line', has(line(r.out, 'すべての :hover'), '1件') && has(r.out, 'style.css:22  b:hover'), r.out.slice(0,600));
r = run({ css: BASE_CSS + '@media screen and (hover: hover) { b:hover { x: y; } }\n' });
t('Minor: @media screen and (hover: hover) counts as a gate and gates', has(line(r.out, 'すべての :hover'), 'OK') && has(line(r.out, 'hover:hover のゲートがある'), 'OK'), r.out);
r = run({ css: BASE_CSS.replace('@media (hover: hover) { a:hover { opacity: 0.7; } }', 'a:hover { opacity: 0.7; }') });
t('Minor: ungated :hover and no gate anywhere -> both NG', has(line(r.out, 'すべての :hover'), 'NG') && has(line(r.out, 'hover:hover のゲートがある'), 'NG'), r.out);
r = run({ css: BASE_CSS + '::-webkit-scrollbar-thumb:hover { x: y; }\n.m::-webkit-scrollbar-thumb:hover { x: y; }\n' });
t('F3: scrollbar :hover excluded from count, reported as INFO 2', has(line(r.out, 'すべての :hover'), 'OK') && has(r.out, '数えていない（タッチ端末に無いため）: 2件'), r.out);
r = run({ css: BASE_CSS + 'a:hover, ::-webkit-scrollbar-thumb:hover { x: y; }\n' });
t('F3: mixed group (normal + scrollbar) is still a hit', has(line(r.out, 'すべての :hover'), '1件'), r.out);
r = run({ css: BASE_CSS + '@media (hover: hover) { /* c */ @media (min-width: 1px) { b:hover { x: y; } } }\n' });
t('hover: nested @media inside the gate stays gated', has(line(r.out, 'すべての :hover'), 'OK'), r.out);
r = run({ css: BASE_CSS + '/* b:hover { x: y; } */\n' });
t('hover: :hover inside a comment is ignored', has(line(r.out, 'すべての :hover'), 'OK'), r.out);

// ---- F7 cap ----
const many = Array.from({ length: 14 }, (_, i) => `.m${i} { font-family: var(--font-mincho); }`).join('\n') + '\n';
r = run({ css: BASE_CSS + many });
t('F7: 14 violations print 10 locations then "… and 4 more"', has(r.out, '14箇所') && has(r.out, '… and 4 more') && (r.out.match(/style\.css:\d+  \.m\d+/g) || []).length === 10, r.out);

// ---- Pure black, in ANY property (check 4) ----
const sh = (decl) => run({ css: BASE_CSS + `.x { ${decl} }\n` });
const blackLine = (rr) => line(rr.out, '純黒が無い');
const blackCount = (rr) => Number((blackLine(rr).match(/— (\d+)箇所/) || [])[1] || 0);
const flagged = (decl, n = 1) => { const rr = sh(decl); return has(blackLine(rr), 'NG') && blackCount(rr) === n; };
const clean = (decl) => has(blackLine(sh(decl)), 'OK');
const flagCases = [
  // hex, every length that can be black
  'color: #000;', 'color: #000000;', 'color: #000000ff;', 'color: #000000FF;', 'color: #00000080;',
  'color: #000f;', 'color: #0008;', 'color: #0001;',
  // rgb / rgba, comma and space syntax, percentages
  'color: rgb(0,0,0);', 'color: rgb(0, 0, 0);', 'color: rgba(0,0,0,.2);', 'color: rgba(0, 0, 0, 0.28);',
  'color: rgb(0 0 0);', 'color: rgb(0 0 0 / .2);', 'color: rgb(0 0 0 / 20%);', 'color: rgba(0 0 0 / 0.3);', 'color: rgb(0% 0% 0%);',
  // hsl / hsla (lightness 0% is black whatever the hue)
  'color: hsl(0,0%,0%);', 'color: hsl(0 0% 0%);', 'color: hsl(0 0% 0% / .3);', 'color: hsla(0, 0%, 0%, .5);',
  'color: hsl(200 50% 0%);', 'color: hsl(0deg 0% 0%);',
  // keyword
  'color: black;', 'border-color: black;', 'background: BLACK;',
  // any property / any position
  'background: #000;', 'border: 1px solid #000;', 'outline: 2px solid black;', 'fill: #000;', '--c: #000;',
  'color: var(--c, #000);', 'box-shadow: 0 0 0 1px rgba(0,0,0,.1);', 'text-shadow: 0 1px #000;',
  'filter: drop-shadow(0 2px 4px rgba(0 0 0 / 0.3));', 'background: linear-gradient(black, transparent);',
  'color: color-mix(in srgb, #000 20%, white);', '--shadow-rest: 0 1px 2px rgba(0, 0, 0, 0.1);',
];
for (const d of flagCases) t(`black: flagged  ${d}`, flagged(d), blackLine(sh(d)));
t('black: two blacks in one declaration count as 2', flagged('box-shadow: 0 1px #000, 0 2px 4px rgba(0,0,0,.2);', 2), blackLine(sh('box-shadow: 0 1px #000, 0 2px 4px rgba(0,0,0,.2);')));

const cleanCases = [
  'color: transparent;', 'background: transparent;',
  // colours that merely contain the digits
  'color: #000aff;', 'color: #00aaff;', 'color: #0a0000;', 'color: #000001;', 'color: #1a000000;', 'color: #0000ff;',
  'color: #000a00;', 'color: #00000a;',
  'color: rgb(0 0 1);', 'color: rgba(0,0,1,.5);', 'color: rgb(1 0 0 / .5);', 'color: hsl(0 0% 1%);', 'color: hsl(0 0% 100%);',
  // fully transparent black renders nothing
  'color: rgba(0,0,0,0);', 'color: rgb(0 0 0 / 0);', 'color: rgb(0 0 0 / 0%);', 'color: #0000;', 'color: #00000000;', 'color: hsl(0 0% 0% / 0);',
  // names, not colours
  '--shadow-black: 0 1px 2px rgba(43,43,38,.1);', 'color: var(--black);', 'box-shadow: var(--shadow-black);',
  // words inside strings, url() and font declarations
  'content: "black";', "content: 'black';", 'background: url(black.png);', 'font-family: Arial Black, sans-serif;',
  'font: 700 1rem Arial Black;',
  // ink-tinted values the project uses
  'box-shadow: 0 1px 2px rgba(43, 43, 38, 0.1);', 'color: #2b2b26;',
];
for (const d of cleanCases) t(`black: not flagged  ${d}`, clean(d), blackLine(sh(d)));
r = run({ css: BASE_CSS + '.black { color: red; }\n.x:not(.black) { y: z; }\n' });
t('black: class name .black in a selector is not a hit', has(blackLine(r), 'OK'), blackLine(r));
r = run({ css: BASE_CSS + '/* box-shadow: 0 1px #000; background: black; */\n' });
t('black: black only in a comment is not a hit', has(blackLine(r), 'OK'), blackLine(r));
t('black: baseline (ink-tinted shadow) passes', has(blackLine(base), 'OK'), blackLine(base));

// mask gradient: only alpha is read, but #000 is still a violation (no exceptions) and shows file:line per stop
const MASK = `.m {
  --m:
    radial-gradient(58% 62% at 30% 26%, #000 60%, transparent 78%),
    radial-gradient(55% 58% at 76% 22%, #000 58%, transparent 76%);
  -webkit-mask-image: var(--m);
  mask-image: var(--m);
}
`;
r = run({ css: BASE_CSS + MASK });
t('mask: two #000 stops in a mask-image gradient -> NG, 2 hits', has(blackLine(r), 'NG') && blackCount(r) === 2, blackLine(r));
t('mask: each stop reported with its own file:line (24 and 25), transparent stops are not', has(r.out, 'style.css:24  radial-gradient(58% 62%') && has(r.out, 'style.css:25  radial-gradient(55% 58%') && !has(r.out, 'style.css:26'), r.out);
r = run({ css: BASE_CSS + MASK.replace(/#000/g, '#2b2b26') });
t('mask: same gradient with a non-black stop colour -> OK', has(blackLine(r), 'OK'), blackLine(r));
r = run({ css: BASE_CSS + MASK.replace(/#000/g, 'rgb(0 0 0 / 1)') });
t('mask: rgb(0 0 0 / 1) stops are still black -> NG', has(blackLine(r), 'NG') && blackCount(r) === 2, blackLine(r));
// the real file's shape: 5 stops + 2 shadows = 7
const SEVEN = MASK.replace(/\(55% 58% at 76% 22%, #000 58%, transparent 76%\);/, '(55% 58% at 76% 22%, #000 58%, transparent 76%),\n    radial-gradient(60% 55% at 80% 78%, #000 60%, transparent 78%),\n    radial-gradient(56% 60% at 22% 80%, #000 58%, transparent 76%),\n    radial-gradient(70% 70% at 50% 50%, #000 65%, transparent 84%);')
  + '.h { box-shadow: 0 12px 24px rgba(0, 0, 0, 0.28); }\n.d { box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3); }\n';
r = run({ css: BASE_CSS + SEVEN });
t('black: the real 5 mask stops + 2 shadows -> 7 hits, 7 locations printed capped at 10', blackCount(r) === 7 && (r.out.match(/style\.css:\d+  .*(#000|rgba\(0, 0, 0)/g) || []).length === 7, blackLine(r));
r = run({ css: BASE_CSS + Array.from({ length: 12 }, (_, i) => `.b${i} { color: #000; }`).join('\n') + '\n' });
t('black: 12 hits print 10 locations then "… and 2 more"', blackCount(r) === 12 && has(r.out, '… and 2 more'), r.out.slice(0, 400));

// ---- Minor: breakpoints ----
r = run({ css: BASE_CSS + '@media (min-width: 641px) and (max-width: 759px) { .z { x: y; } }\n' });
t('Minor: every px in an @media is read (641 and 759 both reported)', has(line(r.out, 'ブレークポイントが 640 / 760 のみ'), '641, 759') || (has(line(r.out, 'ブレークポイントが'), 'NG') && has(line(r.out, 'ブレークポイントが'), '641') && has(line(r.out, 'ブレークポイントが'), '759')), r.out);
r = run({ css: BASE_CSS + '@media (max-width: 560px) { .z { x: y; } }\n' });
t('breakpoints: extra 560 is NG with location', has(line(r.out, 'ブレークポイントが'), 'NG') && has(r.out, '@media (max-width: 560px)'), r.out);
t('breakpoints: baseline exactly 640/760 OK', has(line(base.out, 'ブレークポイントが'), 'OK'));

// ---- F2: focus ----
r = run({ css: BASE_CSS.replace(/:where\(a, button, input\):focus-visible \{[^}]*\}/, '.hero__cta:focus-visible { outline: 2px solid red; }') });
t('F2: only component :focus-visible -> NG', has(line(r.out, 'グローバルな :focus-visible'), 'NG'), r.out);
r = run({ css: BASE_CSS.replace(/:where\(a, button, input\):focus-visible \{[^}]*\}/, 'a:focus-visible { outline: 2px solid red; }\nbutton:focus-visible { outline: 2px solid red; }') });
t('F2: a:focus-visible + button:focus-visible -> OK', has(line(r.out, 'グローバルな :focus-visible'), 'OK'), r.out);
r = run({ css: BASE_CSS.replace(/:where\(a, button, input\):focus-visible \{[^}]*\}/, ':where(a, button):focus-visible { outline: none; }') });
t('F2: global rule that removes the ring (outline:none) -> NG', has(line(r.out, 'グローバルな :focus-visible'), 'NG'), r.out);

// ---- Minor: print ----
r = run({ css: BASE_CSS.replace(/@media print \{[^\n]*\n/, '') });
t('print: missing -> NG "未定義"', has(line(r.out, '@media print で .reveal'), 'NG') && has(line(r.out, '@media print で .reveal'), '未定義'), r.out);
r = run({ css: BASE_CSS.replace(/@media print \{[^\n]*\n/, '@media print { .reveal { opacity: 1; } }\n') });
t('print: .reveal missing transform:none -> NG', has(line(r.out, '@media print で .reveal'), 'NG') && has(line(r.out, '@media print で .reveal'), '戻していない'), r.out);
r = run({ css: BASE_CSS.replace(/@media print \{[^\n]*\n/, '/* @media print { .reveal { opacity: 1; transform: none; } } */\n') });
t('print: only inside a comment -> NG', has(line(r.out, '@media print で .reveal'), 'NG'), r.out);
r = run({ css: BASE_CSS.replace(/@media print \{[^\n]*\n/, '@media print { .other { opacity: 1; transform: none; } }\n') });
t('print: override on a different selector -> NG', has(line(r.out, '@media print で .reveal'), 'NG'), r.out);
r = run({ css: BASE_CSS.replace(/@media print \{[^\n]*\n/, '@media screen { .reveal { opacity: 1; transform: none; } }\n') });
t('print: override only under @media screen -> NG', has(line(r.out, '@media print で .reveal'), 'NG'), r.out);
t('print: baseline OK', has(line(base.out, '@media print で .reveal'), 'OK'));
t('reduced-motion is INFO only', has(base.out, 'INFO prefers-reduced-motion') && !has(line(base.out, 'prefers-reduced-motion'), 'NG '));
r = run({ css: BASE_CSS.replace(/@media \(prefers-reduced-motion[^\n]*\n/, '') });
t('reduced-motion absent -> still not a failure (INFO says 0 blocks)', r.code === 0 && has(r.out, 'prefers-reduced-motion: 0ブロック'), r.out);

// ---- F9 / Minor: aria-hidden ----
r = run({ pages: { 'index.html': page('') } });
t('check 9: missing aria-hidden NG with file:line', has(line(r.out, 'section__eyebrow すべてに'), 'NG') && has(r.out, 'index.html:3  <p class="section__eyebrow"'), r.out);
// F10: the two Japanese eyebrows are out of scope of 9 and 10, and guarded by the inverse assertion
const ownLine = (rr) => line(rr.out, '和文を含む eyebrow（hero__eyebrow');
t('F10: baseline lists the 2 non-section eyebrows as INFO and the guard is OK', has(base.out, '対象外（section__eyebrow 以外') && has(base.out, '2件') && has(ownLine(base), 'OK'), base.out);
t('F10: check 9 counts only section__eyebrow (baseline 9? no: 1 per page x 4 pages = 4)', has(base.out, 'OK  section__eyebrow すべてに aria-hidden'), base.out);
r = run({ pages: { 'index.html': INDEX.replace('class="hero__eyebrow reveal"', 'class="hero__eyebrow reveal" aria-hidden="true"') } });
t('F10: hero__eyebrow gaining aria-hidden -> guard NG with location, check 9 still OK', has(ownLine(r), 'NG') && has(r.out, 'aria-hidden が付いている') && has(line(r.out, 'section__eyebrow すべてに'), 'OK'), r.out);
r = run({ pages: { 'index.html': INDEX.replace('class="meguri-cta__eyebrow"', 'class="meguri-cta__eyebrow" aria-hidden="true"') } });
t('F10: meguri-cta__eyebrow gaining aria-hidden -> guard NG', has(ownLine(r), 'NG') && has(r.out, 'meguri-cta__eyebrow'), r.out);
r = run({ pages: { 'index.html': '<section><h1 class="hero__title">T</h1><p class="hero__eyebrow">千葉のキッチンカー</p></section>\n<section><p class="meguri-cta__eyebrow">巡</p><h2 class="meguri-cta__title">T</h2></section>\n' + page() } });
t('F10: hero__eyebrow moved after its title -> guard NG "title の後ろに動いている"', has(ownLine(r), 'NG') && has(r.out, 'title の後ろに動いている'), r.out);
r = run({ pages: { 'index.html': page() } });
t('F10: hero/meguri eyebrows missing -> guard NG "見つからない"', has(ownLine(r), 'NG') && has(r.out, '見つからない'), r.out);
r = run({ css: BASE_CSS + '.hero__eyebrow { opacity: 0.2; }\n' });
t('F10: hero__eyebrow demoted with opacity .2 -> guard NG', has(ownLine(r), 'NG') && has(r.out, 'opacity: 0.2'), r.out);
r = run({ css: BASE_CSS + '.hero__eyebrow { opacity: 0.9; }\n.hero__eyebrow.reveal { opacity: 0; }\n' });
t('F10: opacity .9 and the reveal start state (0) are not flagged', has(ownLine(r), 'OK'), r.out);
// a hero/meguri eyebrow before its title must NOT count toward check 10 (only section__eyebrow does)
t('F10: check 10 ignores hero/meguri eyebrows that precede their titles', has(line(base.out, 'section__eyebrow が title より後にある'), 'OK'), base.out);
// check 10 on section__eyebrow
r = run({ pages: { 'story/index.html': '<section><p class="section__eyebrow" aria-hidden="true">VISION</p><h2 class="section__title">T</h2></section>\n' } });
t('check 10: section__eyebrow before its title -> NG with story/index.html:1', has(line(r.out, 'section__eyebrow が title より後にある'), 'NG') && has(r.out, 'story/index.html:1  '), r.out);
r = run({ pages: { 'story/index.html': '<section><h2 class="section__title">A</h2><p class="section__eyebrow" aria-hidden="true">X</p></section><section><h2 class="section__title">B</h2></section>\n' } });
t('check 10: eyebrow at the end of a section is not matched against the NEXT section title', has(line(r.out, 'section__eyebrow が title より後にある'), 'OK'), r.out);
// dark-panel: meguri-cta__eyebrow is in the known set and is graded by contrast on --dark
r = run({ css: BASE_CSS.replace('.meguri-cta__eyebrow { color: var(--dark-muted); }', '.meguri-cta__eyebrow { color: var(--sunset-ink); }') });
t('F11: .meguri-cta__eyebrow switched to an -ink value -> dark check NG', has(line(r.out, '深緑パネル上の文字'), 'NG') && has(r.out, '.meguri-cta__eyebrow { color: var(--sunset-ink) }'), r.out);
t('F11: baseline names all three dark rules in the INFO line', has(base.out, '.hero__eyebrow = --dark-accent') && has(base.out, '.meguri-cta__eyebrow = --dark-muted 5.33') && has(base.out, '.footer__social-label = --dark-text'), base.out);
r = run({ css: BASE_CSS.replace('.meguri-cta__eyebrow { color: var(--dark-muted); }', '.meguri-cta__eyebrow { color: var(--dark-accent); }') });
t('F11: .meguri-cta__eyebrow on --dark-accent also OK', has(line(r.out, '深緑パネル上の文字'), 'OK'), r.out);
// F9: --ink-soft final value passes on both backgrounds
t('F9: --ink-soft #676d6c passes both (baseline)', has(line(base.out, '--ink-soft on'), 'OK'), base.out);

// ---- F8: .assetsignore ----
r = run({ assetsignore: null });
t('F8: no .assetsignore -> NG', has(line(r.out, '.assetsignore があり'), 'NG') && has(line(r.out, '.assetsignore があり'), '無い'), r.out);
r = run({ assetsignore: 'docs/\n' });
t('F8: missing tools/ -> NG names tools/', has(line(r.out, '.assetsignore があり'), 'NG') && has(line(r.out, '.assetsignore があり'), 'tools/'), r.out);
r = run({ assetsignore: '# c\n/docs\ntools/**\n' });
t('F8: "/docs" and "tools/**" forms accepted', has(line(r.out, '.assetsignore があり'), 'OK'), r.out);
r = run({ assetsignore: '# docs/\n# tools/\n' });
t('F8: commented-out entries do not count', has(line(r.out, '.assetsignore があり'), 'NG'), r.out);

console.log(bad ? `\n${bad} FAILED` : '\nall fixture tests passed');
process.exit(bad ? 1 : 0);
