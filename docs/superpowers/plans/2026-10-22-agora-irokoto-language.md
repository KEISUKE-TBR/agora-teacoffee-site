# A.G.O.R.A. イロコト設計言語への振り替え 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A.G.O.R.A. TEA&COFFEE のサイトを、汎用的なカフェサイトの見た目から、イロコト系の構築的な設計言語へ振り替える。配色は変えない。

**Architecture:** 既存の `:root` トークン層を拡張し、その上で見出し・部品・モーション・ブレークポイントを書き換える。HTMLは見出しのDOM順の入れ替えのみ。本番とは別の Cloudflare Worker に複製して全5ページを変換し、承認後に切り替える。

**Tech Stack:** 静的HTML5ページ / 素のCSS（ビルドなし）/ 素のJS / Cloudflare Workers static assets / Adobe Fonts（kit `ysy1ycw`）

**Spec:** [docs/superpowers/specs/2026-10-22-agora-irokoto-design.md](../specs/2026-10-22-agora-irokoto-design.md)

## Scope

対象は **ルートの `style.css` と、それを読み込む4ページ**（`index.html` `menu/` `schedule/` `story/`）。

> **MEGURI（`/meguri/`）は対象外。** 実測で判明した理由：
> `meguri/index.html` はルートの `style.css` を**読み込んでいない**。`meguri/style.css` が
> 独自の `:root` を24変数持ち、トークン名（`--green` `--cream` `--sage` `--apricot`）も
> 書体（`--font-jp: "Zen Maru Gothic"` / `--font-en: "Poppins"`）も別系統で、
> **独立したサブブランドとして意図的に分けられている**。
> 中央揃え・深緑全面・丸ゴシックという意匠は「AI臭い」対象ではなく、振り替えると壊す。
> さらにこのキャンペーンは既に**受付終了**している。
>
> `meguri/style.css` `meguri/index.html` `meguri/script.js` には**一切触らない**。
> 特に `--font-kanji` を `--font-sans` に置換してはいけない。
> `--font-sans` は `meguri/style.css` に存在しないので、書体が全部壊れる。
>
> ただしトップページの `.meguri-cta` ブロック（深緑のMEGURI告知）は
> ルートの `style.css` で定義されているので**対象内**。

## Global Constraints

- **配色は変えない。** `--paper #FBF9F3` / `--dark #16302a` / `--sunset #C55A3B` とカテゴリ6色（`herbal` `lemon` `amber` `rose` `tea-brown`）は維持する。文字用の `-ink` 派生を足すのは役割分離であって配色変更ではない
- **文章・写真・商品情報は変えない。** 変えてよいのは見出しのDOM順だけ
- **本番（master）には一切触らない。** 作業は `design/irokoto-language` ブランチ、確認は別Worker
- **`html { font-size: *vw }` による rem の流体化は使わない。** 既存の `clamp()` を維持する
- **`--pad-x: clamp(20px, 5vw, 80px)` は変えない**（モバイル左右20pxの下限を守る）
- タイプスケールは **2px刻みの偶数px**：12 / 14 / 16 / 18 / 20 / 22 / 24 / 26 / 28 / 30 / 32 / 36
- モーションは **`--ease: cubic-bezier(0.16, 1, 0.3, 1)` / `--dur: 0.3s` / `--dur-color: 0.15s`** の3つだけ
- ホバーは **`@media (hover: hover)`** でゲートする（`any-hover` ではない）。`transition` 宣言自体もゲートの中に入れる
- 本文 `font-weight: 500`、`letter-spacing` は**正のまま**（和文の見出しでも詰めない）
- コントラストは**文字として使う全ての色で 4.5 以上**（大きい文字の例外を使わない）
- 見出しの行送りは2段。`--lh-display: 1.3`（28px以上）と `--lh-heading: 1.5`（18〜28px未満）。
  単行の数字と欧文ラベルだけ `1`。本文は 2.2（SPで2.0）
- **純黒を使わない。** KEISUKE の指示（2026-10-22）。`#000` `#000000` `rgb(0,0,0)` `rgba(0,0,0,…)` `black` を一切使わない。
  影はインク色 `rgba(43,43,38,…)`。マスクの `#000` も例外にしない（アルファしか効かないので変更は無害で、例外を残すと規則が腐る）
- ブレークポイントは **ナビ軸 760px / コンテンツ軸 640px の2本だけ**

---

## File Structure

| ファイル | 役割 | 変更 |
|---|---|---|
| `style.css` | 全5ページ共通のスタイル（1255行） | 大幅修正 |
| `meguri/style.css` | MEGURI ページ（独立したサブブランド） | **対象外** |
| `index.html` | トップ | 見出しのDOM順 |
| `menu/index.html` `schedule/index.html` `story/index.html` | 下層3ページ | 見出しのDOM順 |
| `script.js` | スクロール登場・モーダル | 軽微 |
| `tools/verify-css.mjs` | **新規** 静的検証（依存なしで node 単体で走る） | 新規 |
| `wrangler.preview.jsonc` | **新規** 確認用 Worker の設定 | 新規 |

`tools/verify-css.mjs` は npm を導入せずに済むよう、依存ゼロで書く。
幅ごとの横溢れ検査だけはブラウザが要るので、検証時に別途ブラウザで実施する（Task 11）。

---

## Task 1: 検証ハーネスと確認用デプロイ

**Files:**
- Create: `tools/verify-css.mjs`
- Create: `wrangler.preview.jsonc`

**Interfaces:**
- Produces: `node tools/verify-css.mjs` が終了コード0（全合格）か1（違反あり）を返す。
  以降の全タスクはこれを回して進捗を確認する

- [ ] **Step 1: 検証スクリプトを書く（この時点では落ちるのが正しい）**

`tools/verify-css.mjs` を新規作成：

> **このスクリプトの本体は `tools/verify-css.mjs` にある。**
> 計画作成時にここへ全文を書いていたが、実装とレビューで大きく変わった
> （ルールパーサ方式に書き直し、検査が11セクション・位置表示つきになった）。
> 計画側のコピーは陳腐化するだけなので削除した。実物を読むこと。
>
> 実行: `node tools/verify-css.mjs`（依存ゼロ、終了コード 0=全合格 / 1=違反あり）
> 自己テスト: `node tools/verify-css.fixtures.mjs`（71件、実スクリプトを子プロセスで走らせる）

- [ ] **Step 2: 現状に対して走らせて、落ちることを確認する**

Run: `node tools/verify-css.mjs`

Expected: FAIL。想定される違反は、`--sunset-ink` 等が未定義、`color: var(--sunset)` が20箇所、純黒の影が2箇所、明朝が16箇所、ブレークポイントが7本、`:focus-visible` 未定義、`@media print` 未定義、`aria-hidden` が0/13、eyebrow が title より先。

この出力が**そのまま残りのタスクのチェックリスト**になる。

- [ ] **Step 3: 確認用 Worker の設定を作る**

`wrangler.preview.jsonc` を新規作成：

```jsonc
{
  "name": "agora-teacoffee-preview",
  "compatibility_date": "2026-07-24",
  "assets": {
    "directory": "./",
    "not_found_handling": "none",
    "html_handling": "auto-trailing-slash"
  }
}
```

本番 `wrangler.jsonc`（`agora-teacoffee-site`）とは**名前だけが違う**。カスタムドメインは付けないので `*.workers.dev` で開く。

- [ ] **Step 4: 確認用にデプロイして、現行の見た目が出ることを確認する**

Run: `npx wrangler deploy --config wrangler.preview.jsonc`

Expected: `https://agora-teacoffee-preview.<account>.workers.dev` が払い出され、**現行とまったく同じ見た目**が出る。
ここで差が出たら設定ミスなので先に直す。

- [ ] **Step 5: コミット**

```bash
git add tools/verify-css.mjs wrangler.preview.jsonc
git commit -m "検証ハーネスと確認用Workerの設定を追加

node tools/verify-css.mjs で静的に判定できる10項目を見る。
現状では9項目が落ちる。これが実装のチェックリストになる。"
```

---

## Task 2: トークン層

**Files:**
- Modify: `style.css:1-48`（`:root`）

**Interfaces:**
- Produces: `--sunset-ink` `--taupe-ink` `--amber-ink` `--tea-brown-ink` `--shadow-rest` `--shadow-hover` `--ease` `--dur` `--dur-color` 。以降の全タスクがこれを参照する

- [ ] **Step 1: 文字用の色・影・モーションのトークンを `:root` に足す**

`style.css` の `:root` 内、`--rose: #C97B84;` の直後に追加：

```css
  /* --- 文字用の派生値 ---
     1色で面も文字も賄わない。面・線用（上の値）と文字用（ここ）を分ける。
     紙 #FBF9F3 と薄面 #F3EEE3 の両方で 4.5 を満たす最小限の暗さに落としてある。
     薄面を外して紙だけで計算すると全部 4.11〜4.16 で基準割れする
     （.menu .store .schedule__next .fact が薄面に乗っているため） */
  --sunset-ink:    #af5035;  /* 紙 4.96 / 薄面 4.51（元 #C55A3B は 4.07 / 3.70） */
  --rose-ink:      #975c63;  /* 紙 4.95 / 薄面 4.51（元 #C97B84 は 3.00 / 2.73） */
  --lemon-ink:     #66722b;  /* 紙 4.98 / 薄面 4.53（元 #8A9A3A は 2.95 / 2.68） */
  --amber-ink:     #8e6336;  /* 紙 5.00 / 薄面 4.55 */
  --tea-brown-ink: #83674f;  /* 紙 4.96 / 薄面 4.52 */
  --herbal-ink:    #5a734f;  /* 紙 4.99 / 薄面 4.54（元 #5F7A54 は薄面で 4.13） */
  --taupe-ink:     #706c5b;  /* 紙 5.01 / 薄面 4.55（元 #8a8570 は 3.52 / 3.20） */

  /* 既存の補助テキスト色も薄面で基準割れしている。
     --ink-soft #6a706f は紙 4.79 だが薄面 #F3EEE3 では 4.36。
     明度98%まで落とすだけで両方満たす（見分けはつかない） */
  --ink-soft:      #676d6c;  /* 紙 5.01 / 薄面 4.56（元 #6a706f は 4.79 / 4.36） */

  /* カテゴリ色の間接参照用。面は --accent、文字は --accent-ink を参照する。
     #soda が --accent: var(--rose) を入れており、.mcat__title が紙の上で 3.00 しかない。
     これは公開中のサイトに実在する不備で、今回あわせて直す */
  /* 深緑 --dark の面の上では -ink を使わないこと。
     -ink は深緑の上で 2.67〜2.70 と、元の色（--sunset 3.29）より悪化する。
     深緑の上は --dark-accent(8.66) / --dark-text(11.80) / --apricot(6.93) を使う */

  /* --- 影 ---
     純黒を使わない。黒い影は青みが出て面から浮く。インク色 #2b2b26 の rgba にする。
     none から生やすと補間されず反応が鈍く見えるので、平常時も薄く置く。
     ホバーは alpha を1段だけ動かし、ぼかしと距離は据え置く */
  --shadow-rest:  0 10px 30px rgba(43, 43, 38, 0.10);
  --shadow-hover: 0 14px 36px rgba(43, 43, 38, 0.18);

  /* --- モーション ---
     デュレーションとイージングは各1本。用途で使い分けない。
     この曲線は元から2箇所で使われていた値で、他所から輸入したものではない */
  --ease:      cubic-bezier(0.16, 1, 0.3, 1);
  --dur:       0.3s;
  --dur-color: 0.15s;  /* 色だけ倍速。位置が動かない変化は目が追えるので速くてよい */

  /* --- 登場演出の持ち上げ量 ---
     SPのほうを大きくする。小さい画面では動きを控えるのが定石だが逆で、
     SPは1画面の要素数が少なく縦スクロール量が大きいため20pxでは気づかれない */
  --rise: 20px;
```

- [ ] **Step 2: タイプスケールを偶数pxのラダーに乗せ直す**

同じ `:root` 内、既存の `--fs-eyebrow` / `--fs-note` の定義を次で**置き換える**：

```css
  /* タイプスケール：2px刻みの偶数px。比率（×1.25等）は使わない。
     和文は字面が正方形なのでキリのいい偶数のほうが揃う */
  --fs-hero:    clamp(1.75rem, 1.2rem + 2.3vw, 2.25rem);   /* 28 → 36px */
  --fs-section: clamp(1.5rem,  1.1rem + 1.7vw, 2rem);      /* 24 → 32px */
  --fs-sub:     clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem); /* 18 → 20px。※下の Step で実際に当てる */
  --fs-body:    1rem;                                       /* 16px 固定 */
  --fs-note:    clamp(0.75rem, 0.72rem + 0.14vw, 0.875rem);/* 12 → 14px */
  --fs-eyebrow: 0.75rem;                                    /* 12px。英字ラベルは下で見出しの半分に上書き */
```

- [ ] **Step 3: 本文の組みを設定する**

`body` に次を当てる（仕様 §3.4）：

```css
body {
  font-family: var(--font-sans);
  font-weight: 500;              /* 400ではない。和文ゴシックのRegularは画面で細すぎる */
  font-size: var(--fs-body);
  line-height: 2.2;              /* 和文の行送り。欧文の1.5とは別物 */
  letter-spacing: 0.04em;        /* 正のまま。和文でも詰めない */
  color: var(--ink);
  background: var(--paper);
}
```

コンテンツ軸のメディアクエリ内で**行間を狭める**（Task 9 で入れるブロックに追記してもよい）：

```css
@media (max-width: 640px) {
  /* スマホは行間を広げるのが定説だが逆。1行の文字数が減るぶん詰めてよい。
     実測でも本文 2.4→2.2、見出し 1.7→1.6、リード 240%→200% と狭めている */
  body { line-height: 2.0; }
}
```

見出しの `letter-spacing` も**正のまま**にする。参照サイトは108pxの巨大キャッチでも
`.08em` のまま広げており、全233宣言中、負の字間は欧文の2件だけ。
「大見出しは字間を詰める」という欧文の定石を和文に持ち込まない。

`--fs-sub` を小見出しに当てる。現状18〜20px相当で書かれている見出しを洗い出して差し替える：

```bash
grep -nE "font-size:\s*(1\.1|1\.125|1\.15|1\.2|1\.25)rem" style.css
```

出た箇所のうち、見出しとして使われているものを `var(--fs-sub)` に置き換える（本文や注記は対象外）。

- [ ] **Step 4: 検証を走らせ、コントラストの項目が通ることを確認する**

Run: `node tools/verify-css.mjs`

Expected: 「1. 文字色のコントラスト」の7項目が全て OK になる。
「2. 面用の色を文字に使っていないか」はまだ NG（Task 5 で直す）。

- [ ] **Step 5: コミット**

```bash
git add style.css
git commit -m "トークン層：文字用の色・影・モーションを定義

1色で面も文字も賄わず、面用と文字用で値を分ける。
--sunset は文字として使うと紙の上で4.07しかなく基準割れしていた。
影は純黒をやめてインク色のrgbaに。モーションは1デュレーション1イージング。"
```

---

## Task 3: 明朝（リュウミン）の全面除去

**Files:**
- Modify: `style.css`（16箇所の `var(--font-mincho)` / `var(--font-ryumin)`）

**Interfaces:**
- Consumes: Task 2 のトークン
- Produces: 和文は `--font-sans` 一本になる

- [ ] **Step 1: 明朝の参照箇所を列挙する**

Run: `grep -n "var(--font-mincho)\|var(--font-ryumin)\|var(--font-kanji)" style.css`

Expected: `style.css` に15箇所。全部を次の手順で潰す。

- [ ] **Step 2: 参照を `--font-sans` に置換する**

```bash
sed -i 's/var(--font-mincho)/var(--font-sans)/g; s/var(--font-ryumin)/var(--font-sans)/g' style.css
```

- [ ] **Step 3: 見出しのウェイトを700に上げる**

明朝は `font-weight: 300` で使われていた箇所がある（`.sig-card__name` など）。
ゴシックに変えると300では細すぎるので、見出し系は700、本文系は500にする。

`style.css` の `.hero__title-jp` / `.section__title` / `.story__title` ほか、
Step 1 で列挙した見出し系セレクタの `font-weight` を `700` に変更する。
`.footer__tagline` のような補助テキストは `500` にする。

- [ ] **Step 4: トークン定義から明朝を消す**

`style.css:30-32` の3行を削除：

```css
  --font-mincho: "a-otf-ryumin-pr6n", "Shippori Mincho", serif;
  --font-ryumin: "a-otf-ryumin-pr6n", "A-OTF Ryumin Pr6N", "Shippori Mincho", serif;
```

（`meguri/style.css` の `--font-kanji` は対象外。触らない）

- [ ] **Step 5: 検証を走らせる**

Run: `node tools/verify-css.mjs`

Expected: 「5. 明朝（リュウミン）を使っていない」が OK になる。

- [ ] **Step 6: 確認用にデプロイして目視する**

Run: `npx wrangler deploy --config wrangler.preview.jsonc`

**ここが見た目の変化が最も大きい地点。** 明朝が消えてゴシックになったことで、
「AI臭い」の主因が取れているかを KEISUKE に見てもらう価値がある。

- [ ] **Step 7: コミット**

```bash
git add style.css
git commit -m "明朝（リュウミン）を全面的に外す

「小さい英字ラベル→明朝の大見出し」は生成AIが最も出しやすい型で、
素材が良くても既製品に見える主因になっていた。和文はゴシック一本にして、
見出しは700に上げる（明朝の300のままゴシックにすると細すぎる）。

Adobe Fonts の kit ysy1ycw から a-otf-ryumin-pr6n を外すのは
fonts.adobe.com 側の操作。読み込みが軽くなるが必須ではない。"
```

---

## Task 4: 見出しの型を反転する

**Files:**
- Modify: `index.html`（eyebrow 7箇所）
- Modify: `menu/index.html` `schedule/index.html`（2）`story/index.html`（2）
- Modify: `style.css`（`.hero__eyebrow:189` `.section__eyebrow:260` ほか）

**Interfaces:**
- Consumes: Task 2 のトークン、Task 3 のゴシック化
- Produces: 和文見出しが主役・英字が `opacity: .2` の装飾になった見出し

- [ ] **Step 1: HTMLで eyebrow を title の後ろに移し、aria-hidden を付ける**

現状（`index.html:182-183`）：

```html
<p class="section__eyebrow">AUTUMN TEA TIME</p>
<h2 class="section__title">おうちで、味覚の秋を。</h2>
```

これを次に変える（**順序を入れ替え、`aria-hidden` を付ける**）：

```html
<h2 class="section__title">おうちで、味覚の秋を。</h2>
<p class="section__eyebrow" aria-hidden="true">AUTUMN TEA TIME</p>
```

イロコトはDOM順も日本語が先。英字は読み上げる意味を持たない装飾なので `aria-hidden` を付ける
（参照7サイトは全て付けておらず、スクリーンリーダーが「Service Service」と二度読む状態になっている）。

> **対象は `section__eyebrow` だけ。** 実物を読んだ結果、eyebrow は2種類あった。
>
> | クラス | 中身 | 扱い |
> |---|---|---|
> | `.section__eyebrow` | `AUTUMN TEA TIME` / `VISION` | **装飾**。反転して `opacity: .2` + `aria-hidden` |
> | `.hero__eyebrow` | `千葉のキッチンカー ／ TEA & COFFEE` | **情報**。そのまま残す |
> | `.meguri-cta__eyebrow` | `巡 恩送りチケット MEGURI` | **情報**。そのまま残す |
>
> 後ろの2つは装飾のラテン文字ではなく、業態と所在地・企画名を伝える日本語。
> `opacity: .2` に落として `aria-hidden` を付けると、**店の説明が見えなくなり読み上げからも消える**。
> DOM順も動かさない。これらに必要なのはコントラストの修正だけで、
> 両方とも `--dark` の面に乗っている。ただし `.meguri-cta__eyebrow` は既に `--dark-muted` で **5.33** あり基準を満たしているので**触らない**。
> 直すのは `.hero__eyebrow`（3.29）だけで、`--dark-accent #C9CF9E`（8.66）にする。
>
> イロコトの型が成立するのは、`.ja` と `.en` が**同じ意味を重複して持っている**とき
> （事業内容 / Services）に限る。英字を消しても情報が失われないから装飾にできる。
> 重複していないラベルに同じ型を当てると、ただ情報を削ったことになる。

- [ ] **Step 2: CSSで英字を装飾に降格する**

`style.css` の `.section__eyebrow` と `.hero__eyebrow` を次で置き換える：

```css
/* 英字ラベルは装飾。和文見出しの半分のサイズで opacity .2。
   参照サイトは .2 を初期値0から JS で立てているが、JSが落ちると消えるので静的に置く */
.section__eyebrow,
.hero__eyebrow {
  margin: 12px 0 0;              /* 見出しの「下」に来るので上マージン */
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 0.5em;              /* 親ではなく見出しとの比で持つ。常に 1:2 */
  line-height: 1;
  letter-spacing: 0.08em;        /* 和文も欧文も字間は正。詰めない */
  opacity: 0.2;
  color: var(--ink);             /* sunset ではなくインク色。薄くするので色は乗せない */
}
```

`font-size: 0.5em` は親の `font-size` に対する比。eyebrow は見出しと兄弟なので、
`.section__head` 側に見出しと同じ `font-size` を置いて継承させるか、
`--fs-section` を直接半分にした値を書く。後者のほうが素直：

```css
.section__eyebrow { font-size: calc(var(--fs-section) / 2); }
.hero__eyebrow    { font-size: calc(var(--fs-hero) / 2); }
```

- [ ] **Step 3: 見出し本体を主役にする**

```css
.section__title {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: var(--fs-section);
  line-height: 1.3;              /* 和文は 1.0 にしない。参照サイトも108pxで130% */
  letter-spacing: 0.04em;
  color: var(--ink);
  text-align: left;              /* 中央揃えにしない。左の垂直基準線を通す */
}
```

- [ ] **Step 4: 検証を走らせる**

Run: `node tools/verify-css.mjs`

Expected: 「9. 装飾の英字ラベルに aria-hidden」が 13/13 で OK、
「10. 見出しのDOM順」が OK になる。

> **対象外（意図的に実装しない）：見出しのワイプ演出**
>
> 仕様 §4.1 に「色ブロックが引いて文字が現れる」演出の正しい作り方を書いてあるが
> （`transform: scaleX()` + `transform-origin: right`、色ブロックは文字ボックスより
> 上下5pxずつ大きく `height: calc(100% + 10px); top: -5px`）、**agora には現在この演出が無い**。
> 新規に足すのは今回の振り替えの範囲を超えるので実装しない。
> 将来足す場合に備えて仕様側に数値を残してある。

- [ ] **Step 5: コミット**

```bash
git add index.html menu/index.html schedule/index.html story/index.html style.css
git commit -m "見出しの型を反転：和文が主役、英字は opacity .2 の装飾へ

英字ラベルを先頭に置く型をやめ、和文ゴシック700を主役にして英字を
見出しの半分のサイズ・opacity .2 で後ろに置く。DOM順も和文が先。
装飾なので aria-hidden を付ける（参照サイトは全て未対応で二度読みになる）。

opacity .2 は静的に置く。参照サイトは初期値0からJSで立てているため、
JSが落ちると英字が消える。"
```

---

## Task 5: 色の役割分離を適用する

**Files:**
- Modify: `style.css`（`color: var(--sunset)` 20箇所、`var(--taupe)` 9箇所）

**Interfaces:**
- Consumes: Task 2 の `-ink` トークン

- [ ] **Step 1: 文字色として使われている箇所を `-ink` に差し替える**

**先頭の区切り文字を必ず要求すること。** 素朴に `s/color: var(--sunset)/…/` と書くと
`background-color: var(--sunset)` の末尾にも一致して、面の色を文字用の値に書き換えてしまう
（`style.css:77` に実例がある）。直前が `;` `{` か空白であることを条件に入れる：

```bash
sed -i -E 's/([;{[:space:]])color: var\(--sunset\)/\1color: var(--sunset-ink)/g;
           s/([;{[:space:]])color: var\(--taupe\)/\1color: var(--taupe-ink)/g;
           s/([;{[:space:]])color: var\(--amber\)/\1color: var(--amber-ink)/g;
           s/([;{[:space:]])color: var\(--tea-brown\)/\1color: var(--tea-brown-ink)/g;
           s/([;{[:space:]])color: var\(--herbal\)/\1color: var(--herbal-ink)/g;
           s/([;{[:space:]])color: var\(--rose\)/\1color: var(--rose-ink)/g;
           s/([;{[:space:]])color: var\(--lemon\)/\1color: var(--lemon-ink)/g' style.css
```

**深緑パネルの上のルールは除外すること。** `.hero__eyebrow` と `.footer__social-label` は `--dark` の面に乗っており、
`-ink` にすると 3.29 → 2.70 と**悪化する**。この2つは `--dark-accent`（8.66）に変える。

`.meguri-cta__eyebrow` も深緑の上だが、既に `--dark-muted` で 5.33 あるので**変更しない**。
通っているものを変えるのは「配色は変えない」制約に反する。

**間接参照の経路も直す。** `color: var(--accent)` / `color: var(--flavor, var(--sunset))` が7箇所あり
（`style.css:399, 467, 472, 537, 543, 585, 948`）、カテゴリ側が面の色を流し込んでいる：

```css
#focus    { --accent: var(--sunset);    --accent-ink: var(--sunset-ink); }
#soda     { --accent: var(--rose);      --accent-ink: var(--rose-ink); }
#straight { --accent: var(--tea-brown); --accent-ink: var(--tea-brown-ink); }
#lemon    { --accent: var(--lemon);     --accent-ink: var(--lemon-ink); }
#alcohol  { --accent: var(--amber);     --accent-ink: var(--amber-ink); }
```

`--accent-ink` を併設し、**文字の7箇所だけ** `var(--accent-ink)` / `var(--flavor-ink, var(--sunset-ink))`
に切り替える。面と線は `--accent` のまま。`--flavor` も同様に `--flavor-ink` を併設する。

`.mcat__title` は現在 `#soda` で 3.00、`#lemon` で 2.95 しかない。**公開中のサイトに実在する不備**で、
今回あわせて直る。

**`style.css:585` のティント面を 15% → 8% に下げる。** 同じ色の文字を同じ色のティント面に載せており、
15% のままだと `--rose-ink` でも 4.29 で届かない。8% なら 4.59：

```css
background: color-mix(in srgb, var(--accent) 8%, var(--paper));
color: var(--accent-ink);
```

実行後に **`background-color` が書き換わっていないこと**を必ず確認する：

```bash
grep -n "background-color: var(--.*-ink)" style.css && echo "⚠ 面の色を壊した。巻き戻すこと" || echo "OK"
```

対象は `.fact--caffeine-yes`（tea-brown）と `.fact--age`（amber）を含む全ての `color:` 指定。
実測の件数は sunset 15 / taupe 9 / amber 1 / tea-brown 1。

`background` / `border-color` / `outline` での `var(--sunset)` は**そのまま残す**（面と線は元の値が正しい）。

> **壊してはいけない仕組み：** カテゴリ色は直接当てずに間接参照されている。
> ```css
> [data-flavor="amber"]     { --flavor: var(--amber); }
> .catnav a[href="#alcohol"] { --dot: var(--amber); }
> #alcohol                   { --accent: var(--amber); }
> ```
> これらは `color:` 宣言ではないので上の `sed` には引っかからない。**引っかかってはいけない。**
> `--flavor` `--dot` `--accent` の先で文字として使われている箇所があれば、
> そこだけ `-ink` 側を参照するように手で直す。一括置換で潰さないこと。
>
> `.fact--age` の `background: color-mix(in srgb, var(--amber) 14%, var(--paper-2))` も触らない。
> アクセントの色相をわずかに含んだ面は参照サイトでも使われている作法で（WIT STUDIO `#f4fdf2`、
> NOKID `#ECF7F4`、ステイハングリー `#f4e9cb`）、agora は既に正しい。

- [ ] **Step 2: 深緑パネルの上の文字を確認する**

深緑 `--dark` の面の上では `--dark-text` `--dark-muted` を使う。
`--lemon` `--rose` をこの面の上で文字に使う場合はそのままでよい（4.54 / 4.46）。
紙の上で使っている箇所があれば `--herbal-ink` か `--ink` に替える。`--herbal` そのままは薄面で 4.13 なので使わない。

Run: `grep -n "color: var(--lemon)\|color: var(--rose)" style.css`

出た箇所それぞれについて、親に `--dark` 系の背景があるかを確認する。

- [ ] **Step 3: 検証を走らせる**

Run: `node tools/verify-css.mjs`

Expected: 「2. 面用の色を文字に使っていないか」の4項目が全て OK。

- [ ] **Step 4: コミット**

```bash
git add style.css
git commit -m "文字に使う色を -ink 派生へ差し替え

--sunset は33回中20回が文字色で、.schedule__month（12.8px）や
.footer__social-label（11.5px）といった小さい文字に当たっていた。
紙の上でのコントラストは4.07で、本文サイズの基準4.5を下回る。
--taupe も9回すべて文字色で3.52。面と線の指定は元の値のまま。"
```

---

## Task 6: 影・カード・画像枠

**Files:**
- Modify: `style.css`（`box-shadow` の全箇所、カードのセレクタ、画像枠）

- [ ] **Step 1: 純黒の影を置き換える**

```bash
grep -n "rgba(0, 0, 0" style.css
```

`box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3)` と `0 12px 24px rgba(0, 0, 0, 0.28)` を
`var(--shadow-hover)` または用途に応じた値に差し替える。

`rgba(197, 90, 59, …)`（sunset を暗くした影）2箇所は**そのまま残す**。
参照サイトのステイハングリーがゴールドを暗くした影専用色を持っているのと同じ作法で、既に正しい。

グラデーション内の `#000`（写真の上の暗幕）は対象外。触らない。

- [ ] **Step 2: カードから border を外し、疑似要素のオーバーレイにする**

カードに `border` が付いている箇所を探す：

```bash
grep -nE "^\.(sig-card|mrow|store__item|shop-note|kyoho)[^{]*\{" style.css
```

`border` が付いていれば外し、代わりに次の形にする：

```css
.sig-card {
  position: relative;
  background: #fff;              /* カードは白。地の --paper を沈めて白いカードを立てる */
  box-shadow: var(--shadow-rest);
  border-radius: 6px;
}
/* 枠線は要素本体ではなく疑似要素に載せる。
   レイアウトが1pxも動かず、border-radius: inherit で親の角丸に自動追従する */
.sig-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border: 2px solid rgba(197, 90, 59, 0);
  border-radius: inherit;
  pointer-events: none;
}

@media (hover: hover) {
  .sig-card,
  .sig-card::after {
    transition: box-shadow var(--dur) var(--ease), border-color var(--dur) var(--ease);
  }
  .sig-card:hover { box-shadow: var(--shadow-hover); }
  .sig-card:hover::after { border-color: rgba(197, 90, 59, 0.4); }
}
```

ホバー後も alpha `.4` 止まりにして枠が主役に出てこないようにする。

- [ ] **Step 3: 丸い画像枠を矩形にする**

```bash
grep -nE "border-radius:\s*(50%|999|9999)" style.css
```

商品画像・人物画像の `border-radius: 50%` を外し、矩形にする。
ボタンやタグのピル型は対象外（残す）。

画像のホバー拡大は枠を固定して中身だけ動かす：

```css
.sig-card__photo { overflow: hidden; border-radius: 6px; }
@media (hover: hover) {
  .sig-card__photo img { transition: transform var(--dur) var(--ease); }
  .sig-card:hover .sig-card__photo img { transform: scale(1.05); }
}
```

- [ ] **Step 4: 検証を走らせる**

Run: `node tools/verify-css.mjs`

Expected: 「4. 純黒の影を使っていない」が OK。

- [ ] **Step 5: コミット**

```bash
git add style.css
git commit -m "影をインク色に、カードの枠線を疑似要素へ、画像枠を矩形に

参照7サイトでカードに border を付けた例が0件。分離は背景色差・影1層・
疑似要素オーバーレイの3つだけで、枠線は常に装飾レイヤーの仕事。
枠を疑似要素に載せるとレイアウトが動かず、border-radius: inherit で
角丸に自動追従する。ホバー後も alpha .4 止まりで枠が主役に出ない。"
```

---

## Task 7: 署名行の詳細度を直す

> **当初の計画は前提が誤っていた。** 「引用ブロックのスタイルを入れ替える」としていたが、
> **`blockquote` は4ページのどこにも存在しない**（実測：index 0 / menu 0 / schedule 0 / story 0）。
> STORY は通常の `<p>` が2つと署名行で構成されていて、引用ブロックではなかった。
>
> 存在しない要素のCSSを書くのは死にコードを足すだけなので、仕様 §4.3 の引用スタイルは**実装しない**。
> 将来 `blockquote` を使うことになったら、仕様に数値が残してある。
>
> 代わりに、実測で見つかった本物の不具合をこのタスクで直す。

**Files:**
- Modify: `style.css`（`.story__sign`）

- [ ] **Step 1: 署名行の宣言が負けているのを直す**

`.story__sign` は `font-size: 1.5rem`（24px）を宣言しているが、
**`.story__body p` のほうが詳細度が高いため 16px で描かれている**。宣言が丸ごと効いていない。

```bash
grep -n "story__body p\|story__sign" style.css
```

詳細度を合わせる（`.story__body .story__sign` にする）か、
`.story__body p` 側の指定を緩める。**`!important` は足さない** —
`color` に既に付いている `!important` も、詳細度を直したうえで外す。

- [ ] **Step 2: 署名らしさの作法を当てる**

参照サイトは引用・署名に**左の縦バーも引用符も使わない**。
`.story__sign` は Caveat（手書き）なので、書体自体が署名の役割を果たしている。
縦バーや記号を足さない。先頭の `—` は既にマークアップにあるのでそのまま。

- [ ] **Step 3: 検証**

Run: `node tools/verify-css.mjs`

Expected: 違反数は変わらない（この項目は検査対象外）。回帰が無いことだけ確認する。

ブラウザで `.story__sign` の実効 `font-size` が 24px になっていることを確認する
（サーバーは `-c-1` で立て、`cache-control: no-store` を確認してから測る）。

- [ ] **Step 4: コミット**

```bash
git add style.css
git commit -m "署名行の font-size が詳細度負けしていたのを直す

.story__sign は 1.5rem を宣言しているが .story__body p に負けて
16px で描かれていた。!important を足さずに詳細度を揃える。

当初この Task は blockquote のスタイル入れ替えを予定していたが、
blockquote は4ページのどこにも存在しなかったため、
存在しない要素のCSSを書くのをやめて実在の不具合を直すことにした。"
```

---

## Task 8: モーションを1本に統一する

**Files:**
- Modify: `style.css`（`transition` の全箇所、`.reveal:892-898`）
- Modify: `script.js`

- [ ] **Step 1: すべての transition をトークンに寄せる**

```bash
grep -n "transition:" style.css | grep -v "var(--dur)"
```

出た箇所を全て `var(--dur) var(--ease)` に書き換える。
ただし **色だけは `var(--dur-color)`** にする：

```css
/* 色の変化は倍速。位置が動かない変化は目が追えるので速くてよく、遅いとモッサリする */
transition: color var(--dur-color) var(--ease),
            background-color var(--dur-color) var(--ease),
            transform var(--dur) var(--ease),
            opacity var(--dur) var(--ease);
```

- [ ] **Step 2: 登場演出を書き換える**

`style.css:892-898` を置き換える：

```css
.reveal {
  opacity: 0;
  transform: translateY(var(--rise));
  /* opacity と transform で duration をずらす。不透明度を先に完走させることで、
     動きが「完全に見えている要素」の上で起きる */
  transition: opacity 0.7s var(--ease), transform 0.8s var(--ease);
  transition-delay: calc(var(--delay, 0) * 90ms);
}
.reveal.is-visible { opacity: 1; transform: translateY(0); }
```

- [ ] **Step 3: SPで持ち上げ量を増やす**

コンテンツ軸のメディアクエリ内に追加：

```css
@media (max-width: 640px) {
  /* SPのほうを大きくする。1画面の要素数が少なく縦スクロール量が大きいので、
     20pxでは登場に気づかれない */
  :root { --rise: 30px; }
}
```

- [ ] **Step 4: ホバーを hover:hover でゲートする**

`:hover` を含む全ルールを `@media (hover: hover)` で囲う。
**`transition` 宣言そのものもゲートの中に入れる**（`:hover` ルールだけを囲うのではない）。
こうするとタッチ端末では `transition` プロパティ自体が存在せず、
タップ後にホバー状態が張り付いてだらだらアニメーションする事故が構造的に起きない。

- [ ] **Step 5: 検証を走らせる**

Run: `node tools/verify-css.mjs`

Expected: 「7. ホバーは hover:hover でゲート」の2項目が OK。

- [ ] **Step 6: コミット**

```bash
git add style.css script.js
git commit -m "モーションを1デュレーション1イージングに統一

素の ease 0.2s/0.25s/0.3s と単発の cubic-bezier が混在していたのを
--dur 0.3s / --ease に寄せる。曲線は元から使われていた値で、
参照サイトから輸入していない（イージングはブランドの声として1本選ぶもので、
サイトをまたいだ共通曲線は存在しない）。

色だけ --dur-color 0.15s で倍速。登場の持ち上げは SP で 20→30px に増やす。
ホバーは any-hover ではなく hover:hover でゲートし、transition 宣言自体も
ゲート内に入れてタッチ端末での張り付きを構造的に防ぐ。"
```

---

## Task 9: レスポンシブ（ブレークポイント・段組み・余白）

**Files:**
- Modify: `style.css`（`@media` 8箇所、`.story` ほか2カラムのセレクタ）

- [ ] **Step 1: 現状のブレークポイントを列挙する**

Run: `grep -n "@media" style.css`

Expected: 440 / 560（3箇所）/ 640（2箇所）/ 760 と `prefers-reduced-motion`。

- [ ] **Step 2: コンテンツ軸を640pxに統合する**

`440` と `560`（3箇所）の各ブロックの中身を、`@media (max-width: 640px)` のブロックへ移す。
`760px` はナビ軸なので**そのまま残す**。

実機の幅はスマホが320〜430px、タブレットが768px以上で、440〜760pxの帯はほぼ空。
そこに5本のしきい値を置いても得るものがない。

- [ ] **Step 3: `.schedule__item` の折返しを目視で判断する**

`.schedule__item { flex-wrap: wrap }` は現在440pxで効いている。640pxに寄せると折返しが早まる。
確認用URLを 480 / 560 / 640px 幅で開き、スケジュールの行が破綻しないかを見る。
破綻する場合のみ、この1ルールだけ440pxに残してよい（その場合は検証スクリプトの期待値も更新する）。

- [ ] **Step 4: PCの2カラムを「固定px + 1fr」の非対称にする（仕様 §5.2）**

2カラムになっているセレクタを探す：

```bash
grep -nE "grid-template-columns:[^;]*(1fr 1fr|repeat\(2)" style.css
```

`repeat(2, 1fr)` や `1fr 1fr` になっている箇所を、左が固定幅の非対称に変える。
STORY セクションがこれに当たる：

```css
.story__layout {
  display: grid;
  /* 1fr同士だと両方が伸び縮みして可読幅が崩れる。左のラベル列を固定幅にして、
     右の本文だけを可変にする。参照サイトは 290px 1fr / 380px 1fr / 550px 1fr など
     約25パターンで、等分の repeat(2,1fr) 8回を大きく上回る */
  grid-template-columns: 380px 1fr;
  gap: 0 60px;                 /* gap は必ず2値で書き、使わない軸に明示的に 0 を入れる */
}

@media (max-width: 640px) {
  .story__layout {
    grid-template-columns: 100%;  /* 1fr ではなく 100% と書く（意図の明示） */
    gap: 32px 0;
  }
}
```

段階は踏まない。3列→2列→1列と刻まず一気に落とす。

- [ ] **Step 5: モバイルで縦の余白を詰めない（仕様 §5.3）**

コンテンツ軸のブロック内で `--pad-y` を縮めている箇所があれば外す。
参照サイトの実測ではデスクトップ100pxが21回に対し、**モバイルだけに110 / 140 / 200px が出てくる**。

`--pad-x: clamp(20px, 5vw, 80px)` は**変えない**（モバイル左右20pxの下限を守る）。

- [ ] **Step 6: モバイルで小さい部品を拡大する（仕様 §5.3）**

アイコン・ボタン・タグなど、SPで小さくなりすぎる部品を**縮小ではなく拡大**して描き直す。
参照サイトの実測値：アイコン10→14px、12→18px、16→22px、ボタン80→100px、180→220px。

```bash
grep -nE "(width|height|font-size):\s*(1[0-9]|[1-9])px" style.css
```

で小さい実寸を洗い出し、コンテンツ軸のブロックで1.2〜1.5倍に上書きする。
あわせて**タップ領域が48px以上**あることを確認する。

モバイルで消すのは装飾と英語サブラベルだけ。縮小せず `display: none` にする。

- [ ] **Step 7: 検証を走らせる**

Run: `node tools/verify-css.mjs`

Expected: 「6. ブレークポイントは2本だけ」が OK（`640, 760`）。

- [ ] **Step 8: コミット**

```bash
git add style.css
git commit -m "レスポンシブ：ブレークポイント統合・非対称2カラム・モバイルの余白

440/560/640 の3本が全部「横並び→縦積み」という同じ操作を
別のしきい値でやっていた。実機はスマホ320〜430px、タブレット768px以上で、
440〜760pxの帯はほぼ空。ナビ軸760px・コンテンツ軸640pxの2本に統合する。

PCの2カラムは repeat(2,1fr) ではなく「固定px + 1fr」の非対称にする。
1fr同士だと両方が伸び縮みして可読幅が崩れる。

モバイルで縦の余白は詰めない（参照サイトはモバイルだけに110/140/200pxが出る）。
小さい部品は縮小ではなく1.2〜1.5倍に拡大して描き直す。

参照サイトもナビ用とコンテンツ用で軸を分けている（イロコトは1200pxで
ハンバーガー化、768pxでコンテンツを1列化）。1つの数字に統一すると
「1100px幅でナビが窮屈なのに本文はまだ2列」という破綻が出る。"
```

---

## Task 10: アクセシビリティの穴を埋める

**Files:**
- Modify: `style.css`（末尾に追加）
- Modify: `index.html` ほか4ページ（`<html>` に `no-js` クラス）
- Modify: `script.js`

参照7サイトが全て落としている項目。真似せず必ず足す。

- [ ] **Step 1: グローバルな `:focus-visible` のフォールバックを足す**

> **訂正（実測による）：** 仕様 §3.6 は「`:focus-visible` を自前で足す」と書いているが、
> **agora には既に8箇所ある**（`style.css:463,464,465,562,575,1173,1209,1281`）。
> 「1.3MB中に自前実装ゼロ」はイロコト7サイトの話であって、agora の話ではない。
>
> 既存の9箇所は**触らない**。特に `.sig-card:focus-visible { outline: none; }` は
> リングを子の写真（`.sig-card__photo`）に移すための意図的な実装で、欠陥ではない。
>
> 足りないのは、個別指定の無い要素を覆う**グローバルなフォールバック**。
> 本文中のリンク、フォーム部品、`summary` などは現在どこからも拾われていない。

`style.css` の末尾に追加：

```css
/* 個別指定のある部品（.sig-card / .mrow / .hero__cta など）はそれぞれが
   自前のリングを持っている。ここはそこから漏れる要素のための受け皿。
   2色のリングにして、暗い面の上でも紙の上でも見えるようにする */
:where(a, button, input, textarea, select, summary, [tabindex]):focus-visible {
  outline: 3px solid var(--sunset-ink);
  outline-offset: 2px;
  border-radius: 2px;
}
/* 深緑の面の上では紙色のリングにする */
.is-dark :where(a, button, [tabindex]):focus-visible,
.footer :where(a, button, [tabindex]):focus-visible {
  outline-color: var(--paper);
}
```

- [ ] **Step 2: 印刷時に登場前の状態を打ち消す**

```css
/* .reveal は既定で opacity:0 なので、スクロール前に印刷すると本文が白紙で出る。
   参照サイトは @media print,screen を1465回書いているのに print 単独が0件 */
@media print {
  .reveal {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

- [ ] **Step 3: JSが落ちたときのフォールバックを入れる**

`index.html` ほか全5ページの `<head>` の先頭に同期スクリプトを置く：

```html
<script>document.documentElement.classList.add('js')</script>
```

`style.css` の `.reveal` を `.js` の配下に限定する：

```css
/* JSが動く環境でだけ登場演出をかける。
   JSが落ちた・IntersectionObserver が発火しなかった場合に
   コンテンツが永久に opacity:0 で残るのを防ぐ */
.js .reveal {
  opacity: 0;
  transform: translateY(var(--rise));
  transition: opacity 0.7s var(--ease), transform 0.8s var(--ease);
  transition-delay: calc(var(--delay, 0) * 90ms);
}
.js .reveal.is-visible { opacity: 1; transform: translateY(0); }
```

- [ ] **Step 4: 検証を走らせる**

Run: `node tools/verify-css.mjs`

Expected: **全10項目が OK**。終了コード0。

- [ ] **Step 5: コミット**

```bash
git add style.css index.html menu/index.html schedule/index.html story/index.html
git commit -m "アクセシビリティの穴を埋める：focus-visible / 印刷 / JS無効

参照7サイトが全部落としている3点。
- :focus-visible が1.3MB中に自前実装ゼロ（唯一の5件はライブラリ由来）
- @media print が0件で、スクロール前に印刷すると本文が白紙で出る
- 登場演出が :not(.is-animated) 方式で、JSが落ちるとコンテンツが
  永久に opacity:0 で残る

登場演出を .js 配下に限定して、JSが動かない環境では素の状態で読めるようにした。"
```

---

## Task 11: 全幅での横溢れ検査と最終確認

**Files:**
- 修正は検出された箇所のみ

- [ ] **Step 1: 静的検証が全部通ることを確認する**

Run: `node tools/verify-css.mjs`

Expected: 全10項目 OK、終了コード0。

- [ ] **Step 2: 確認用にデプロイする**

Run: `npx wrangler deploy --config wrangler.preview.jsonc`

- [ ] **Step 3: 13幅 × 5ページで横溢れを測る**

確認用URLをブラウザで開き、各ページを次の幅で読み込んで
`document.documentElement.scrollWidth - document.documentElement.clientWidth` を測る：

320 / 360 / 375 / 390 / 414 / 430 / 640 / 760 / 768 / 1024 / 1280 / 1440 / 1920px

Expected: 全65通りで **0**。0でなければ、はみ出している要素を特定して直す。

- [ ] **Step 4: キーボードだけで全ページを通す**

Tab キーのみで全5ページを操作し、`:focus-visible` のリングが
**全ての操作要素で見える**ことを確認する。特に深緑のフッター内のリンク。

- [ ] **Step 5: 動きの抑制を確認する**

ブラウザの設定で `prefers-reduced-motion: reduce` を有効にし、
全ページでスクロール登場・ホバー・ヒーローの動きが**すべて止まる**ことを確認する。

- [ ] **Step 6: 印刷プレビューを確認する**

全5ページで印刷プレビューを開き、**本文が白紙にならない**ことを確認する。

- [ ] **Step 7: JSを無効にして確認する**

ブラウザのJSを切って全5ページを開き、コンテンツが読めることを確認する。

- [ ] **Step 8: 深緑パネルの上の文字を確認する**

`--lemon` `--rose` が深緑の面の上でだけ文字色として使われていることを目視で確認する。

- [ ] **Step 9: コミット**

```bash
git add -A
git commit -m "全幅・全ページの検証と修正

13幅 × 5ページ = 65通りで横溢れ0。キーボード操作・動きの抑制・印刷・
JS無効の4項目も確認済み。"
```

---

## Task 12: 本番への切り替え

**この Task は KEISUKE の承認を得てから実行する。**

- [ ] **Step 1: 確認用URLを KEISUKE に渡してレビューを受ける**

全5ページが揃った状態で見てもらう。承認が出るまで次へ進まない。

- [ ] **Step 2: master にマージする**

```bash
git checkout master
git merge --no-ff design/irokoto-language
```

- [ ] **Step 3: 本番へデプロイする**

```bash
npx wrangler deploy
```

- [ ] **Step 4: 本番で検証を再実行する**

https://agora-teacoffee.com/ の全5ページで Task 11 の Step 3〜8 を繰り返す。

- [ ] **Step 5: 確認用 Worker を片付ける**

```bash
npx wrangler delete --name agora-teacoffee-preview
```

- [ ] **Step 6: Adobe Fonts の kit を整理する（任意）**

fonts.adobe.com で kit `ysy1ycw` を開き、`a-otf-ryumin-pr6n` を外す。
CSSからの参照は既に消えているので見た目は変わらないが、読み込むフォントが減る。
**これはリポジトリからはできないので KEISUKE の操作が必要。**

---

## 付録：この計画が参照している調査

- [イロコトの設計言語](../../irokoto-design-system.md) — 逆説145件・要注意101件
- [同 根拠編](../../irokoto-design-system-evidence.md) — 作法270件とCSS宣言

数値の根拠を確認したいときはこの2つを引く。
