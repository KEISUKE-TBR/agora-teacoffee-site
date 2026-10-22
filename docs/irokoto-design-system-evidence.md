# イロコトの設計言語 — 根拠編

[本編](./irokoto-design-system.md) の §3。採取した作法270件を、実際のCSS宣言つきで並べたもの。
確度は7サイト中いくつで確認できたか。判定は次の制作で流用してよいか。

---

## 3. 作法の一覧（実測の根拠つき）

`確度` は7サイト中いくつで確認できたか。`判定` は次の制作で流用してよいか。

### タイポグラフィ

#### タイプスケールは比率（×1.25等）ではなく2px刻みの等差ラダー。12/14/16/18/20/22/24/26/28/30/32/34/36/42px。偶数px率95%（偶数578件 vs 奇数・非整数30件）。1rem=10px設計なので rem値が .2 刻みになる。本文の最頻値は 1.6rem = 16px（54回で全体トップ）。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **流用可**

```css
54 font-size:1.6rem 32 font-size:2.4rem 29 font-size:1.2rem 28 font-size:1.8rem 27 font-size:2.6rem 24 font-size:1.4rem 21 font-size:2rem 11 font-size:2.2rem 10 font-size:3.6rem 8 font-size:3.2rem 7 font-size:4.2rem 7 font-size:2.8rem 7 font-size:2.0rem 6 font-size:3.4rem
```

モジュラースケール信仰の逆。和文は字面が正方形なので半端なpxだとグリッドに乗らず、2px刻みのほうが揃う。WIT STUDIOも font-size:calc(18 * var(--vw-scale)) のように整数px値を直接書いており、12/14/16/18/20/22/24/26/28/30/34/38/40/42/46/50/60/70 と全部偶数。例外は irokoto の .sw-Heading{font-size:33px} くらい。

#### letter-spacing は和文でも常に正。全233宣言のうち負は2件だけ（しかも欧文の380px数字と手動カーニング用スパン）。最頻は .06em（100回）、次に .08em（61回）、.04em（33回）。見出しが大きくなっても詰めない。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **流用可**

```css
78 letter-spacing:.06em 60 letter-spacing:.08em 33 letter-spacing:.04em 22 letter-spacing:0.06em 9 letter-spacing:.1em 6 letter-spacing:.12em 5 letter-spacing:0 4 letter-spacing:.05em 4 letter-spacing:.02em 2 letter-spacing:0.14em 2 letter-spacing:.2em 1 letter-spacing:-.3em 1 letter-spacing:-.02em
```

欧文の作法（大見出しはネガティブトラッキング）を和文に持ち込んでいない。WIT STUDIOは .06em 一択（54回）で .04em 4回・.1em 3回のみ、ENILISは .08em(24)+.04em(17)+.06em(5) の3段のみ、カミナリは 0.06em が22回で実質1値。1サイト1〜3値に絞るのが型。108pxの巨大和文キャッチでも letter-spacing:.08em のまま正。

#### 英語ラベルの大文字化を text-transform で一切やらない。text-transform の出現は20件すべて reset の button,select{text-transform:none}。大文字か頭文字大文字かはHTMLに直接書いて、サイトごとに決めている。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **考え方だけ**

```css
20 text-transform:none button,select{text-transform:none} .swiper-button-next:after,.swiper-button-prev:after{font-family:swiper-icons;font-size:var(--swiper-navigation-size);text-transform:none!important;letter-spacing:0;font-variant:initial;line-height:1}
```

HTML実測で <span class="en">ARCADE GAME</span>（カミナリ、全大文字）と <span class="en">Services</span>（エニーキャリア、頭文字のみ）が混在。CSSで uppercase にしないので、ブラウザの機械的な大文字化で詰まることがない代わりに、ライターが入稿で間違えると直せない。CMS入稿がある案件では text-transform:uppercase を当てたほうが安全。

#### 和文は「Noto Sans JP（＝Source Han Sans）1本」で7サイト中6サイト。欧文は和文スタックに混ぜず、サイトごとに1書体だけ別に選び、役割を限定して当てる。最新のWIT STUDIOだけ和文をZen Kaku Gothic Newに替えている。

確度 **ほぼ全サイト**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **流用可**

```css
body{font-family:"Noto Sans JP",Arial,"Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif;-webkit-font-smoothing:antialiased;word-wrap:break-word;overflow-wrap:break-word;color:#202020;letter-spacing:.06em;font-weight:500} body{font-family:"Zen Kaku Gothic New","Helvetica Neue",Arial,"Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif;-webkit-font-smoothing:antialiased;word-wrap:break-word;overflow-wrap:break-word;overflow-x:hidden;height:100%;min-height:100%;-webkit-transition:opacity .4s ease-out;transition:opacity .4s ease-out;font-weight:500;color:#141614;background:#ff …
```

和文を1書体に固定して迷いを消し、サイトの個性は欧文1書体だけで作る、という割り切り。欧文の内訳は irokoto=gill-sans-nova(Adobe Fonts) / stayhungry=PT Sans(12回)+Oswald(1回) / kaminari=Sen(13回)+Oswald(1回) / nokid=Jost(21回) / enilis=Poppins(12回) / witstudio=Cabin(2回) / anycareer=欧文書体なし。欧文を足すかどうかも含めて1つの判断になっている。

#### 欧文書体は本文に一切使わない。使う場所は固定リスト＝日付・連番カウンタ・カテゴリタグ・グローバルナビ・SCROLL/VIEW MORE/BACK TO TOPのマイクロラベル・copyright・ページネーション数字・装飾用の巨大見出し。この8ヶ所以外には出てこない。

確度 **ほぼ全サイト**（ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **流用可**

```css
.sw-NewsArchive .newsArchive-List .newsArchive-Item .item-Anchor .item-Date{margin-top:auto;font-family:Poppins,sans-serif;font-weight:400;font-size:1.6rem;line-height:180%;letter-spacing:.08em;color:#a1a4a7} .sw-Services .services-Item .link::after{content:"0" counter(number);position:absolute;top:.2604166667vw;right:.46875vw;font-family:Oswald,sans-serif;font-weight:600;font-size:14rem;color:transparent;-webkit-text-stroke:1px #cea948;opacity:.3} .st-Footer_BackToTop span{ font-family: 'Jost', 'Noto Sans JP', sans-serif; font-weight: 700; font-size: 1.4rem; color: #fff; letter-spacing: .12em …
```

グローバルナビが欧文書体なのは、ナビのラベル自体が英単語（Service / News / Recruit）だから。「欧文書体を当てる場所」＝「英単語しか入らない場所」という対応になっているので、設計時にこのリストをそのまま使える。

#### ja/en 2層見出しの考え方自体は4サイトで確認できるが、英語の格下げ方法はサイトごとに別物。opacity .2（エニーキャリア）／ブランドカラーで着色（カミナリ）／英語を主役にして和文を小さい黒タグに降格（NOKID）／英語を画像化（WIT STUDIO）。

確度 **ほぼ全サイト**（エニーキャリア・カミナリゲームス・NOKID・WIT STUDIO）／判定 **考え方だけ**

```css
.idx-Services_Inner .services-item_inner .title span.ja { font-size: 1.4583333333vw; } .idx-Services_Inner .services-item_inner .title span.en { position: relative; color: #F8871E; font-family: "Sen", sans-serif; font-weight: bold; letter-spacing: 0.06em; } .idx-Services_Inner .services-item_inner .title span.en { margin: 1.4583333333vw 0 0; padding: 0 0.9895833333vw; font-size: 0.7291666667vw; } .sw-Heading_Content .en{ max-width: 100%; font-family: 'Jost', 'Noto Sans JP', sans-serif; font-weight: 500; font-size: 6.8rem; line-height: 120%; color: #0f0f0f; letter-spacing: .06em; text-shadow: - …
```

「2層にする」は型だが「どう格下げするか」はブランド判断。カミナリは 1.4583333333vw(=1920pxで28px) / 0.7291666667vw(=14px) で比率はちょうど2:1、エニーキャリアと同じ比率をopacityでなく色で処理している。NOKIDだけ逆転（英語68px・和文16px黒タグ・letter-spacing .2em）で、ブランドが若い・海外志向のときの選択肢。WIT STUDIOは英語をPNG画像にしているので文字として選択もコピーもできない点は注意。

#### font-weight は 500（本文）と 700（見出し・ラベル）の実質2値。700が298回・500が122回で全体の74%。400はほぼリセット由来。Google Fontsのリクエストも使う2ウェイトだけに絞っている。

確度 **ほぼ全サイト**（エニーキャリア・ステイハングリー・NOKID・ENILIS・WIT STUDIO）／判定 **流用可**

```css
298 font-weight:700 122 font-weight:500 50 font-weight:bold 44 font-weight:400 16 font-weight:600 14 font-weight:900
```

本文を400ではなく500にしているのが肝。和文ゴシックのRegularは画面で細く見えるのでMediumが本文、Boldが見出し。エニーキャリアは fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700&display=swap で400すら読んでいない（HTML実測）。NOKIDは Jost:wght@400;500;700 + Noto Sans JP:wght@400;500;700。WIT STUDIOは Zen+Kaku+Gothic+New:wght@500;700;900。カミナリだけ font-weight: bold キーワードを21回使っていて数値に統一されていない。

#### line-height はフォントサイズの帯ごとに固定。12px→140% / 13〜16px→160〜240% / 18〜26px→180〜220% / 30〜42px→140〜170% / 60〜108px→120〜140% / 単行の欧文ラベル→1。大きくなるほど詰める、という連続した設計になっている。

確度 **ほぼ全サイト**（エニーキャリア・ステイハングリー・NOKID・ENILIS）／判定 **流用可**

```css
9 font-size:1.3rem;line-height:160% 8 font-size:1.5rem;line-height:240% 8 font-size:1.2rem;line-height:140% 6 font-size:1.8rem;line-height:200% 6 font-size:1.6rem;line-height:240% 6 font-size:1.6rem;line-height:200% 6 font-size:1.6rem;line-height:160% 4 font-size:1.5rem;line-height:220% 2 font-size:7.4rem;line-height:130% 2 font-size:6rem;line-height:140% 2 font-size:4.2rem;line-height:170% 2 font-size:10rem;line-height:120% 4 font-size:10.8rem line-height:130% 2 font-size:6.4rem line-height:128%
```

巨大な和文キャッチでも line-height を1.0に落とさず120〜140%で止めているのが特徴。line-height:1 を使うのは英語ラベルと単行の数字だけ。全サイト集計で line-height:1 が53回あるが、これは .sw-Ttl .ja / .en のような単行要素と destyle リセットに集中している。

#### モバイルの文字サイズは rem を捨てて生 vw で書く。768pxカンバスの px を /768 した値を使い、本文は 3.3854166667vw（＝768pxで26px）が最頻値（29回）。rem はデスクトップ専用。

確度 **ほぼ全サイト**（イロコト・エニーキャリア・ステイハングリー・NOKID・ENILIS・WIT STUDIO）／判定 **真似しない**

```css
29 font-size:3.3854166667vw 14 font-size:3.6458333333vw 14 font-size:2.6041666667vw 10 font-size:3.90625vw 7 font-size:2.8645833333vw 5 font-size:4.1666666667vw 4 font-size:4.4270833333vw screen and (max-width:1024px){.sw-Btn{min-width:62.5vw;max-width:100%;font-size:3.3854166667vw;padding:4.1666666667vw 5.2083333333vw 4.6875vw} screen and (max-width:1024px){.sw-Txt_Detail{font-size:3.3854166667vw}
```

ここは真似しないほうがいい。3.3854166667vw は実機では 390px幅iPhoneで13.2px、375pxで12.7px にしかならない。本文が13px台になる。ルート切替の @media も max-width:1024px の1段しかなく（@media print,screen and (max-width:1024px){html{font-size:1.3020833333vw}）、767px以下でサイズを戻す段がどのサイトにも存在しない。font-size だけは min() や max() で床を作るか、SP用に別ブレークポイントを足すべき。

#### ルートのpx固定レンジの作り方が3世代ある。(1)イロコト＝px直書き＋SPだけvw、bp 1199/767。(2)エニーキャリア〜ENILIS＝html{62.5%} または {.5208333333vw} ＋ SPで{1.3020833333vw}、bp 1024。(3)WIT STUDIO＝remを完全に捨て --vw-scale でpx数値をそのまま書く。最新の(3)が一番扱いやすい。

確度 **ほぼ全サイト**（イロコト・エニーキャリア・ステイハングリー・ENILIS・WIT STUDIO）／判定 **流用可**

```css
html{font-size:62.5%} @media print,screen and (max-width:1024px){html{font-size:1.3020833333vw} @media print,screen and (min-width:1921px){html{font-size:.5208333333vw} html{height:100%;min-height:100%;font-size:.5208333333vw;line-height:1} :root{--vw-base:1920;--vw-min:1360;--text-color:$green;--vw-scale:max(calc(100vw / var(--vw-base)), 1px);--index-gallery-width:0;--index-text-stroke-width:0} @media print,screen and (min-width:1025px) and (max-width:1360px){:root{--vw-scale:calc(100vw / 1360)} @media print,screen and (max-width:1024px){:root{--vw-base:768;--vw-scale:calc(100vw / var(--vw-ba …
```

WIT STUDIO方式の肝は max(calc(100vw / 1920), 1px) の max()。1921px以上では100vw/1920で拡大、1361〜1920pxでは1pxに張り付いてデザインデータのpxそのまま、1025〜1360pxは1360基準で再計算、1024px以下は768基準。つまりデザインカンバスは1920/1360/768の3枚。font-size:calc(18 * var(--vw-scale)) と書けるのでFigmaの数値をそのまま貼れる。remの .2刻み変換が不要になる。

#### 欧文書体を当てる要素のスタックに和文フォールバックを入れているのはNOKIDだけ。他4サイトは "PT Sans", sans-serif のように和文を省いていて、同じ要素に日本語が1文字でも入るとOSのデフォルトゴシックに落ちる。

確度 **ほぼ全サイト**（ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **真似しない**

```css
42 font-family: 'Jost', 'Noto Sans JP', sans-serif 26 font-family: "Sen", sans-serif 24 font-family:Poppins,sans-serif 24 font-family:"PT Sans",sans-serif 4 font-family:Cabin,sans-serif 2 font-family:Oswald,sans-serif
```

件数は正規化ファイルとの重複で2倍表示（実数はJost 21・Sen 13・Poppins 12・PT Sans 12・Cabin 2・Oswald 1+1）。NOKIDの 'Jost', 'Noto Sans JP', sans-serif が正解で、欧文グリフはJost・和文グリフはNoto Sans JPが自動で埋める。他サイトのやり方だと「NEWS 2024.05.01」のような混在ラベルに「年」「月」が混ざった瞬間に書体が崩れる。欧文書体を書くときは必ず和文を2番目に置く。

#### letter-spacing は body に1回書いて継承させ、個別要素では上書きしない（イロコト .1em / エニーキャリア .06em）。font-weight も body に 500 を置いて、太字だけ700で上書きする。

確度 **複数サイト**（イロコト・エニーキャリア・WIT STUDIO）／判定 **流用可**

```css
body{font-family:"Noto Sans JP",Arial,"Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif;-webkit-font-smoothing:antialiased;word-wrap:break-word;overflow-wrap:break-word;color:#202020;letter-spacing:.06em;font-weight:500} body{margin:0 auto;font-family:source-han-sans-japanese,Noto Sans Japanese,Hiragino Kaku Gothic ProN,Hiragino Kaku Gothic Pro,"ＭＳ ゴシック","メイリオ",Meiryo,"ヒラギノ角ゴ Pro W3",Hiragino Kaku Gothic Pro,Osaka,"ＭＳ Ｐゴシック",MS PGothic,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;-webkit-text-size-adjust:none;letter-spacing:.1em;color:#595656}
```

body継承にしたエニーキャリアは letter-spacing 宣言が全ファイルで2件しかない（.06em と 0）。対してbodyに書かなかった ENILIS は46件、ステイハングリーは34件に膨らんでいる。bodyに1行置くだけで宣言数が1/20になる、という定量的な差が出ている。

#### 本文の行間は和文として極端に広い。1.6rem(16px)に line-height:2.4（＝38.4px）が標準。しかもモバイルでは 2.4→2.2 に狭める。

確度 **複数サイト**（エニーキャリア・ENILIS）／判定 **流用可**

```css
.sw-Txt{font-size:1.6rem;line-height:2.4}@media print,screen and (max-width:1024px){.sw-Txt{line-height:2.2;font-size:3.3854166667vw} .acf_content,.post-type-post,.sw-Txtarea{font-family:"Noto Sans JP",sans-serif;font-size:1.6rem;line-height:2.4}@media print,screen and (max-width:1024px){.acf_content,.post-type-post,.sw-Txtarea{font-size:3.3854166667vw;line-height:2.2} .index-Hero .hero-Content .hero-Introduction .introduction-Text{padding-left:1.25vw;font-weight:500;font-size:1.6rem;line-height:240%;letter-spacing:.08em;color:#181818;border-left:max(.2083333333vw,1px) solid #181818} .index-Co …
```

240%は「リード文・導入文・フォームのラベル」に限定で、カードやリスト内のテキストは160%に落としている（1.6rem;line-height:160% が6回）。モバイルで行間を狭めるのは画面が狭くて1行の文字数が減るため。「狭い画面では行間を広く」という一般論の逆。

#### 縦の余白は px ではなく em で取る。段落間は 1em、段落→見出しは 2.5em。font-size が変われば余白も自動で追従する。

確度 **複数サイト**（エニーキャリア・NOKID）／判定 **流用可**

```css
.sw-Content p + p{ margin-top: 1em; } .sw-Content p + h2{ margin-top: 2.5em; } .sw-Content p + h3{ margin-top: 2.5em; } .sw-Content ol + p, .sw-Content ul + p{ margin-top: 1em; } .sw-Content p + ol, .sw-Content p + ul{ margin-top: 1em; } .sw-CallOut .body p + p{ margin-top: 1.2em; } .sw-Txt + .sw-Txt{margin-top:2em} .sw-Txtarea ul li{list-style-type:disc;margin:0 0 .4em 1.5em;line-height:1.8}
```

margin-bottom を使わず隣接セレクタ（+）だけで組むので、最初と最後の要素に余計な余白が付かない。em宣言の集計は 2.5em(20回) / 1em(16回) / 2em(4) / 1.8em(4) / 1.5em(4) / 1.2em(2) / .5em(2) と値も少ない。記事本文（WYSIWYG出力）のCSSはこれだけでほぼ完成する。

#### 巨大な欧文の装飾文字は塗りを消して線だけにする（color:transparent + -webkit-text-stroke:1px + opacity .3〜.5）。250px・140pxという本文の15倍サイズでも線1pxなので背景を邪魔しない。

確度 **複数サイト**（ステイハングリー・WIT STUDIO）／判定 **流用可**

```css
.index-Company .company-ScrollText{font-family:"PT Sans",sans-serif;font-weight:700;font-size:25rem;position:absolute;color:transparent;-webkit-text-stroke:1px #cea948;opacity:.5;display:-webkit-box;display:-webkit-flex;display:flex;white-space:nowrap;pointer-events:none;gap:0 4.9479166667vw} .sw-Services .services-Item .link::after{content:"0" counter(number);position:absolute;top:.2604166667vw;right:.46875vw;font-family:Oswald,sans-serif;font-weight:600;font-size:14rem;color:transparent;-webkit-text-stroke:1px #cea948;opacity:.3} 6 -webkit-text-stroke:1px #cea948
```

stroke幅はvwにせず1px固定。サイズが250pxでも線は1px、という比率無視が効いている。pointer-events:none も必ず付いていて選択の邪魔をしない。連番は content:"0" counter(number) でHTMLに数字を書かずに生成している。

#### 縦書き（writing-mode: vertical-lr）は和文ではなく、SCROLL / BACK TO TOP のような欧文マイクロラベル専用。12〜14pxで letter-spacing .04〜.12em を付けて縦に流す。

確度 **複数サイト**（ENILIS・NOKID）／判定 **流用可**

```css
.index-Hero .hero-Scroll p{font-family:Poppins,sans-serif;font-size:1.2rem;letter-spacing:.04em;color:#a1a4a7;-webkit-writing-mode:vertical-lr;writing-mode:vertical-lr} .st-Footer_BackToTop span{ font-family: 'Jost', 'Noto Sans JP', sans-serif; font-weight: 700; font-size: 1.4rem; color: #fff; letter-spacing: .12em; writing-mode: vertical-lr; } 6 writing-mode:vertical-lr
```

和文の縦組みは7サイト中0件。日本の制作会社なのに縦書きを和文に使っていない。一方カミナリは縦ラベルを writing-mode ではなく flex-direction:column で1文字ずつ積む別手を使っている（ .idx-Columntitle span.ja { flex-direction: column; justify-content: flex-end; letter-spacing: 0.14em; } ＋ height指定）。writing-mode のほうが素直。

#### 見出しは「日本語（大・太・opacity 1）＋英語（約半分のサイズ・opacity .2）」の2行組み。DOM順も日本語が先・英語が後。英語は飾りであって主役ではない。英→和サイズ比はきっちり2:1前後。

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
.sw-Ttl .ja{font-size:3rem;font-weight:700;line-height:1;display:inline-block;position:relative;overflow:hidden} .sw-Ttl .en{display:block;opacity:.2;font-size:1.4rem;line-height:1;margin-top:16px;opacity:0;-webkit-transform:translateX(-20px);transform:translateX(-20px)} .sw-Ttl.is-animated .en{opacity:.2;-webkit-transform:translateX(0);transform:translateX(0);-webkit-transition:.5s .2s cubic-bezier(.22,1,.36,1);transition:.5s .2s cubic-bezier(.22,1,.36,1)} .subpage-List_Item_Txt .ttl .ja{font-size:2.4rem;font-weight:700;line-height:1;display:block} .subpage-List_Item_Txt .ttl .en{display:bloc …
```

opacity .2 と「enは jaの半分」という具体数値が採れたのはエニーキャリアだけ（.sw-Ttl は anycareer.style.css と anycareer.about.css の2ファイル、各13箇所）。ただし30px/14px・24px/12px と2例とも約2:1、かつ両方とも line-height:1、両方とも opacity .2 で一致しているので、サイト内の型としては完全に固まっている。HTMLは <h2 class="sw-Ttl js-scrollAnimation"><span class="ja">事業内容</span><span class="en">Services</span></h2> で日本語が先。

#### 同じ英単語をHTMLに2回書いて、1つを装飾用の巨大ゴースト（120px / opacity .2 / 背景グラデをbackground-clip:textで流し込み・絶対配置）、もう1つを実見出し（36px・不透明）として重ねる。

確度 **1サイトのみ**（ENILIS）／判定 **考え方だけ**

```css
.index-Service .service-Layout .service-Heading .heading-Bg{font-family:Poppins,sans-serif;font-weight:700;font-size:12rem;letter-spacing:.04em;background:url(../../images/common/bg_gradation.jpg) 0 0/100% auto no-repeat;-webkit-background-clip:text;-webkit-text-fill-color:transparent;position:absolute;top:-3.2291666667vw;left:-.2604166667vw;opacity:.2} .index-Service .service-Layout .service-Heading .heading-Main{font-family:Poppins,sans-serif;font-weight:600;font-size:3.6rem;letter-spacing:.04em;color:#181818;position:relative}
```

HTMLは <span class="heading-Bg">Service</span> と <span class="heading-Main">Service</span> の2本立て。見た目の効果は高いが、7サイト全てで aria-hidden が0件なのでスクリーンリーダーが「Service Service」と二度読む。真似するなら装飾側に aria-hidden="true" を足すこと。

#### カミナリゲームスは clamp() を使わずに「vwで書いた文字サイズを1280px以下でpxに固定する」帯を @media (min-width:768px) and (max-width:1280px) で71回も作っている。最小値の床だけを作り、上は無限に伸ばす設計。

確度 **1サイトのみ**（カミナリゲームス）／判定 **考え方だけ**

```css
144 @media print, screen and (max-width: 767px) 125 @media print, screen and (min-width: 768px) 71 @media print, screen and (min-width: 768px) and (max-width: 1280px) .idx-Services_Inner .services-item_inner .title span.en { margin: 1.4583333333vw 0 0; padding: 0 0.9895833333vw; font-size: 0.7291666667vw; } .idx-Services_Inner .services-item_inner .title span.en { margin: 18.66648px 0 0; padding: 0 12.66654px; font-size: 9.33324px; } .idx-Main_Inner .main-catchs span.ja { margin: 26.6664px 0 0; font-size: 25.33308px; }
```

0.7291666667vw × 1280 ÷ 100 = 9.333px で、px値はちょうど1280px時点の値。つまり1280px以下はノートPCでも文字が縮まない。考え方は正しいが、9.33324px のような小数px値が71箇所に手打ちで散っていてメンテ不能。今やるなら font-size: max(0.7291666667vw, 9.33px) の1行、または WIT STUDIO の --vw-scale 方式に置き換える。

#### 和文に斜体がないので、ディスプレイ用の傾きは transform: matrix(1,0,-.1,1,0,0) で作る。font-style:italic は WYSIWYG の em リセット4件以外に存在しない。

確度 **1サイトのみ**（ENILIS）／判定 **流用可**

```css
.index-Hero .hero-Content .hero-Catch .hero-Catch_Jp{margin-top:1.09375vw;font-weight:700;font-size:7.4rem;line-height:130%;letter-spacing:.08em;color:#181818;-webkit-transform:matrix(1,0,-.1,1,0,0);transform:matrix(1,0,-.1,1,0,0);display:block} 8 transform:skewX(-20deg) 4 transform:matrix(1,0,-.1,1,0,0) 4 font-style:italic
```

-0.1 のシアーは約5.7度。font-style:italic を和文に当てるとブラウザが機械的に歪めて汚くなるが、matrix で自分でシアー量を決めれば制御できる。74px / font-weight:700 / line-height:130% / letter-spacing:.08em のキャッチにだけ使っている。

#### トラッキングを広げた欧文には font-variant-ligatures:none を必ず添える。ligature が残っていると letter-spacing が合字の中で効かずに字間が崩れる。

確度 **1サイトのみ**（イロコト）／判定 **流用可**

```css
.Gill_m{font-family:gill-sans-nova,sans-serif;font-weight:500;font-style:normal;letter-spacing:.14em;-webkit-font-variant-ligatures:none;font-variant-ligatures:none} .Gill_b{font-family:gill-sans-nova,sans-serif;font-weight:600;font-style:normal;letter-spacing:.12em;-webkit-font-variant-ligatures:none;font-variant-ligatures:none}
```

イロコト自社サイトだけ。欧文書体を .Gill_m / .Gill_b という「書体＋ウェイト＋字間」セットのユーティリティクラスにしてあるのも参考になる（font-family・font-weight・font-style・letter-spacing・font-variant-ligatures の5つを1クラスに束ねる）。ユーティリティ側に字間まで入れておけば、使う側は class を付けるだけで済む。

#### font-feature-settings:"palt" 1（プロポーショナル詰め）は7サイト中1サイトだけ。和文組版の定番と言われる割に使っていない。

確度 **1サイトのみ**（ENILIS）／判定 **考え方だけ**

```css
html{height:100%;min-height:100%;font-size:.5208333333vw;line-height:1;-webkit-font-feature-settings:"palt" 1;font-feature-settings:"palt" 1}
```

palt を入れると約物が詰まる一方、letter-spacing を正に振る設計（彼らは .04〜.08em）と干渉して意図した字間にならない。paltを使うなら letter-spacing は 0〜.02em まで落とす。両方かけるのは矛盾なので、どちらか選ぶ。ENILISは palt + .08em で両方やっているので実はここが詰め切れていない。

#### ボタンのラベルは flex ではなく line-height = ボタンの高さ で縦センターしている。デスクトップ line-height:60px（高さ60px）、モバイル line-height:13.0208333333vw（＝768pxで100px）。

確度 **1サイトのみ**（イロコト）／判定 **真似しない**

```css
.sw-Btn a{width:100%;height:100%;padding:0 25px 0 0;text-align:center;font-size:1.6rem;font-weight:700;line-height:60px;letter-spacing:.2em;color:#fff;border-radius:78px;display:block;background:#ff777f;position:relative} .sw-Btn a{padding:0 5.2083333333vw 0 0;font-size:3.3854166667vw;line-height:13.0208333333vw;border-radius:10.15625vw}
```

ラベルが2行に折り返した瞬間にボタンが120pxに伸びて壊れる。和文のボタンラベルは翻訳や原稿変更で長くなりがちなので危険。display:flex; align-items:center; justify-content:center; で置き換える。ボタンラベルの letter-spacing:.2em（全サイト最大値）は真似してよい。

#### NOKIDに rem と em の取り違えが残っている。同じ数値が隣接セレクタで 2.0rem と 2.0em の両方で書かれていて、em側は親の font-size を基準に倍になる。

確度 **1サイトのみ**（NOKID）／判定 **真似しない**

```css
.sw-Heading .sw-Heading_Content .overview .link > p{ font-weight: 700; font-size: 2.0rem; } .sw-Heading .sw-Heading_Content .overview .link .btns .btn a p{ font-weight: 700; font-size: 2.0em; color: #fff; letter-spacing: .02em; position: relative; z-index: 1; } @media screen and (max-width:1024px) { .sw-Heading .sw-Heading_Content .overview .link .btns .btn a p{ font-size: 2.6em; }
```

nokid.common.css の font-size 宣言106件中104件が rem、この2件だけ em。意図ではなく打ち間違い。em は font-size に使うと親からの乗算で入れ子のたびに膨らむので、font-size には rem、余白（margin-top）には em、と使い分けを固定すること。彼ら自身この原則はほぼ守れている（margin-top:2.5em / 1em は意図的）。

#### WIT STUDIO の :root に未解決の Sass 変数 --text-color:$green がそのまま出荷されている。

確度 **1サイトのみ**（WIT STUDIO）／判定 **真似しない**

```css
:root{--vw-base:1920;--vw-min:1360;--text-color:$green;--vw-scale:max(calc(100vw / var(--vw-base)), 1px);--index-gallery-width:0;--index-text-stroke-width:0}
```

CSSカスタムプロパティの中身はSassがコンパイル時に展開しないので $green が文字列のまま残る。var(--text-color) で色を参照している箇所があれば無効値になる。CSS変数にSass変数を入れるときは --text-color: #{$green} と補間が必要。1845ルールの大規模ファイルでも起きるミスなので、カスタムプロパティは必ずブラウザで実値を確認すること。

### カラー

#### 色をCSSカスタムプロパティで管理していない。7サイト14ファイルすべてで、色の変数宣言はゼロ。--vw-scale などレイアウト用の変数はあるのに、色だけ全部hexハードコード。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **真似しない**

```css
:root{--vw-base:1920;--vw-min:1360;--text-color:$green;--vw-scale:max(calc(100vw / var(--vw-base)), 1px);--index-gallery-width:0;--index-text-stroke-width:0}
```

SassでビルドしているのでSass側に$変数はあるはずだが、出力CSSには色変数が一切残らない。結果として色を1つ変えると全箇所を置換する必要があり、ダークモードも事実上不可能。あなたの次サイトでは :root に色トークンを置くべき。彼らを真似る部分は「色の決め方」だけで、「色の持ち方」は真似しないこと。

#### SVGアイコンの色がdata URI内に %23XXXXXX で直書きされている。7サイト合計148箇所。色変更が実質不可能。

確度 **7サイト全部**（エニーキャリア・WIT STUDIO・ステイハングリー・カミナリゲームス・ENILIS・NOKID・イロコト）／判定 **真似しない**

```css
background:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 8"><path fill="%2335B1C1" d="m.16 4.36 3.818 3
```

data URI内のhex出現数：WIT STUDIO36／ステイハングリー30／カミナリ30／ENILIS17／エニーキャリア12（+下層12）／NOKID11／イロコト4。内訳は %23fff が43回、%231a7e3a が34回。ホバーで色を変えるために background-image をもう1本まるごと書き直している（ENILISのtransition:background-image .3s がその証拠）。代替策：アイコンは inline SVG にして fill:currentColor にするか、mask-image + background-color にする。そうすればホバーは background-color の1行で済み、色トークンも効く。

#### ダークモード対応はゼロ。prefers-color-scheme が14ファイル中1件もない。mix-blend-mode も0件、filter は blur のみ7件で、混色・ブレンド系の表現を一切使わない。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **考え方だけ**

```css
filter:blur(50px) filter:blur(9.765625vw) filter:blur(3.90625vw)
```

ブレンドモードを使わないのは真似してよい（色の予測可能性が保たれ、印刷・スクショでも崩れない）。filterはblurのみで、しかもグラデーションで作った光彩を柔らかくする用途に限定されている。一方 prefers-color-scheme 0件は、色をハードコードしているので後付けできないという構造的な結果。企業サイト主体なら実務上の問題は小さいが、あなたの次サイトでは色を :root トークンにしておけば、後からダークモードを足せる余地が残る。

#### 1サイトのユニーク色数は6〜20。最小はカミナリゲームスの6色（#000/#fff/#ffffff/#f8871e/#969696/#000000）。「3色以内」ではなく「6〜20色だが、役割が1色1つに固定されている」。

確度 **7サイト全部**（カミナリゲームス・エニーキャリア・イロコト・WIT STUDIO・ステイハングリー・NOKID・ENILIS）／判定 **流用可**

```css
color: #F8871E background: #000 border: 1px solid #000 color: #969696 background-color: #FFFFFF
```

ユニークhex実測：カミナリ6／エニーキャリア8／イロコト14／WIT STUDIO15／ステイハングリー18／NOKID19／ENILIS20。色数を絞ることが目的ではなく、1つの色に1つの役割を割り当てるのが目的。カミナリは #000（背景・罫線・文字）/#f8871e（アクセント）/#fff（反転背景）/#969696（補助文字）の4役だけでサイト全体を成立させている。逆にWIT STUDIOは緑のランプを #1c3a22 / #1a7e3a / #629f2f / #80cb43 / #96d2a9 / #aad786 / #d5eac3 / #f4fdf2 の8段持つ唯一のサイトで、これは職種カテゴリの色分けが必要だったため。

#### フッターの背景色は、そのサイトの本文インク色と「同じ値」。ダークグレーを別途作っていない。1サイト1インク色で、文字のときは前景、フッターのときは背景として同じhexを使い回す。

確度 **ほぼ全サイト**（イロコト・エニーキャリア・ステイハングリー・ENILIS）／判定 **流用可**

```css
body{margin:0 auto;font-family:source-han-sans-japanese,...;letter-spacing:.1em;color:#595656} .st-Footer{background:#595656;padding:60px 50px 90px;color:#fff body{...color:#202020;letter-spacing:.06em;font-weight:500} .st-Footer{background:#202020;padding:100px 0 48px;color:#fff .st-Footer{padding:5.2083333333vw 9.375vw 3.75vw;background:#111 .st-Footer .footer-Layout{padding:4.1666666667vw 5.2083333333vw;background:#181818;display:grid
```

インク色を1個決めれば、本文色・フッター背景・影の基準色・罫線の基準色が全部それ1個から導出できる。色数が増えないのに統一感が出る。イロコト#595656／エニーキャリア#202020は body の color と .st-Footer の background が完全に同値で、偶然ではなく設計。

#### 影（box-shadow）に純黒 rgba(0,0,0,x) を使わない。影色はインク色のalphaか、アクセント色を暗くした色。7サイト全部でサイトCSS中の rgba(0,0,0,.x) 影はたった2件しかない。

確度 **ほぼ全サイト**（WIT STUDIO・ステイハングリー・ENILIS）／判定 **流用可**

```css
box-shadow:0 0 calc(20 * var(--vw-scale)) rgba(20,22,20,.1) box-shadow:.7291666667vw .7291666667vw 1.5625vw rgba(73,57,17,.15) box-shadow:0 .625vw 1.25vw 0 rgba(24,24,24,.2)
```

rgba(20,22,20,.1)は WIT STUDIO のインク色 #141614 の alpha版（CSS内27回、影として20回）。rgba(73,57,17,.15) はステイハングリーのゴールド #cea948 を暗くした色で、hexパレットには存在しない影専用色。rgba(24,24,24,.2) は ENILIS のインク #181818。純黒の影は青みが出て浮くので、インク色やアクセント色を落とした色にするだけで「サイトの色」に馴染む。

#### 純黒 #000 は意図的に避けている。インク色は #0f0f0f / #111 / #141614 / #181818 / #202020 / #595656 の「ほぼ黒」。純黒を基調にしているのは7サイト中カミナリゲームスだけ（30回、ゲーム会社として意図的）。

確度 **ほぼ全サイト**（NOKID・WIT STUDIO・ENILIS・エニーキャリア・イロコト・カミナリゲームス）／判定 **流用可**

```css
color: #0f0f0f color:#141614 color:#181818 color:#202020 color:#595656 background: #000 border: 1px solid #000
```

#000の出現数：イロコト0／エニーキャリア0／WIT STUDIO0／ENILIS1／NOKID2／ステイハングリー4／カミナリ30。黒を使わないのではなく「黒を1〜2%だけ持ち上げる」。注目すべきはインク色の幅で、イロコトの#595656（かなり明るいグレー）が一番軽く、やわらかいブランドに合わせてインク自体を薄くしている。つまりインク色はブランドトーンの調整ダイヤルになっている。

#### 純白 #fff はまったく避けていない。全CSS中で最頻出の色（236回）。ただし「地色」としてではなく「カードの背景」と「暗所の反転文字」として使っている。ページの地色が#fffでないサイトもある。

確度 **ほぼ全サイト**（NOKID・ENILIS・WIT STUDIO・エニーキャリア・カミナリゲームス）／判定 **流用可**

```css
background-color: #F2F2F2; background:url(../../images/pc/bg.jpg) 50% 0/cover repeat #fafafa .c-job{...box-shadow:0 0 calc(20 * var(--vw-scale)) rgba(20,22,20,.1);background:#fff;border
```

NOKID は body の background-color が #F2F2F2（白ではない）で、その上に #fff のカードを置く。ENILIS は body下に #fafafa + 背景画像を敷く。これで「#fffのカード」が初めて白として立つ。地色を#fffにすると白いカードが沈むので、カードを使うレイアウトなら地色を #f2f2f2〜#fafafa に落とすのが先。#fffのbackground使用数：WIT STUDIO29／NOKID18／エニーキャリア15／カミナリ11。

#### rgba の alpha は .1 / .15 / .2 / .3 / .5 の5段に集約されていて、中間値をほぼ作らない。しかも .5 は「暗所に置く白文字の二次情報」専用。

確度 **ほぼ全サイト**（エニーキャリア・ステイハングリー・WIT STUDIO・イロコト・NOKID）／判定 **流用可**

```css
border-top:1px solid rgba(245,245,245,.1);padding-top:30px;color:rgba(255,255,255,.5) color:rgba(255,255,255,.5);line-height:160% border-bottom:calc(1 * var(--vw-scale)) solid rgba(20,22,20,.1) border:1px solid rgba(53,177,193,.3);color:#35b1c1
```

全CSSのalpha出現数：.1が51回、.5が47回、.3が12回、.15が11回、.2が9回。この5値で約90%を占める。役割も固定で、.1=罫線・影、.15〜.2=影、.3=アクセントの薄い枠線、.5=暗背景上のコピーライトや補助テキスト。alphaを増やすほどデザインがぼやけるので、最初から5値だけに縛るのが実務的。

#### 罫線色は2系統しかない。「インク色の alpha .1」か「不透明な薄グレー1値」。罫線にアクセント色を使うのは「現在地」や「強調枠」のときだけ。

確度 **ほぼ全サイト**（WIT STUDIO・エニーキャリア・NOKID・イロコト）／判定 **流用可**

```css
border-bottom:calc(1 * var(--vw-scale)) solid rgba(20,22,20,.1) border:1px solid #dedede border-bottom: 1px solid #C4C4C4 border:1px solid #eee border:1px solid rgba(53,177,193,.3);color:#35b1c1
```

罫線のhex出現数：エニーキャリア#dedede4回、NOKID#C4C4C44回（2系統目は#0f0f0f6回の濃い線）、イロコト#eee3回、WIT STUDIOは罫線hexを持たず rgba(20,22,20,.1) 5回のみ。罫線色を1サイト1〜2値に絞っている。注意点として、WIT STUDIOの罫線幅は calc(1 * var(--vw-scale)) なので画面幅に比例して細くなる。

#### グラデーションは実質4パターンしか使っていない。(1)蛍光ペン風ハイライト (2)同色2停止を background-size で伸ばす下線アニメ (3)200%幅の3停止を background-position で横スライド (4)図形の光彩。装飾的なグラデーションは一切ない。

確度 **ほぼ全サイト**（イロコト・ENILIS・WIT STUDIO・ステイハングリー）／判定 **流用可**

```css
.sw-Heading .line{position:relative;z-index:1;background:-webkit-linear-gradient(transparent 70%,rgba(240,155,165,.3) 70%) background:linear-gradient(90deg,#181818,#181818) no-repeat right bottom 0 background-size:0 1px background-size:100% 1px background:linear-gradient(to right,#629f2f 0,#1a7e3a 50%,#629f2f 100%) top left 0/200% 100%
```

(1) transparent 70% → アクセント.3 70% の2停止で、行の下30%だけをマーカーで塗る。見出し強調に使えて、色数を増やさない。(2) 同じ色を2回書くのは「グラデーションではなく、background-sizeでアニメーションできる1pxの下線」を作るため。border-bottomでは幅を0→100%にできないのでこの書き方になる。(3) 幅200%のグラデを background-position で動かして、要素内を色が流れるボタン。transitionがbackground-positionなのでGPUに乗る。角度は 90deg / to right / 0deg だけで、斜めグラデはほぼ使わない。

#### ホバーの色変化は必ず `any-hover:hover` かつ 1025px以上のメディアクエリで囲んでいて、タッチデバイスではホバー色が一切発火しない。

確度 **ほぼ全サイト**（エニーキャリア・ステイハングリー・ENILIS・WIT STUDIO・カミナリゲームス・イロコト）／判定 **流用可**

```css
@media (any-hover:hover){.sw-Link:hover .txt{color:#35b1c1 @media print and (any-hover:hover),screen and (any-hover:hover) and (min-width:1025px){.sw-TextAndBtn .textAndBtn-Content .textAndBtn-Btn{-webkit-transition:background-color .3s;transition:background- @media print and (any-hover:hover),screen and (any-hover:hover) and (min-width:1025px){.sw-CircleBtn{-webkit-transition:background-color .3s;transition:background-color .3s
```

any-hover の出現数：ステイハングリー36／ENILIS36／WIT STUDIO33／エニーキャリア下層24／エニーキャリア23／カミナリ17／イロコト4。スマホでタップするとホバー色が残って「押したまま」に見える事故を構造的に防いでいる。transition宣言自体もこのメディアクエリ内に置いているので、SPではアニメーションのコストもゼロ。イロコトだけ4回で、自社サイトが一番手が入っていない。

#### アクセント色は「文字色」より「面と線」で使う。イロコト・ENILIS・NOKID はアクセントを color: にほとんど使わず、background と border に回している。

確度 **複数サイト**（イロコト・ENILIS・NOKID）／判定 **流用可**

```css
background:#f09ba5 border:4px solid #f09ba5 border:2px solid #f09ba5 border-top:5px solid #f09ba5 background:#f1721c background-color:#f1721c
```

実測比。イロコト #f09ba5 は color:1回／background:12回／border:11回。ENILIS #f1721c は color:1回／background:5回。NOKID #3CAB8F は color:5回／background:10回。アクセントが明るい色（ピンク・オレンジ・ミント）のときは文字にすると読めないので、必然的にこうなる。一方エニーキャリア #35b1c1（color:15／bg:7）と WIT STUDIO #1a7e3a（color:20／bg:28）はアクセントが暗めなので文字色にも使えている。つまり「アクセントの明度で使い方が決まる」。明るいアクセントを選んだら文字色に使う計画を最初から捨てること。

#### セクションの薄色背景はニュートラルグレーではなく、アクセント色をごく薄く混ぜた色。緑系サイトは緑寄りの白、金系サイトは金寄りの白を使う。

確度 **複数サイト**（WIT STUDIO・NOKID・ステイハングリー・イロコト）／判定 **流用可**

```css
background:#f4fdf2 background:#fafff8 background: #ECF7F4 background:#f4e9cb background:#f7f6f6
```

#f4fdf2 は R244 G253 B242 で緑が最大（WIT STUDIO、アクセント#1a7e3a）。#ECF7F4 は R236 G247 B244 で緑寄り（NOKID、アクセント#3CAB8F）。#f4e9cb はゴールド寄り（ステイハングリー、アクセント#cea948）。イロコト#f7f6f6 は R247>G246=B246 でわずかに暖色。一方エニーキャリア#f5f5f5とENILIS#fafafaは完全ニュートラル。彩度を1〜4%入れるだけで「このサイトの白」になる。グレーで割ると無機質になる。

#### 白文字をアクセント色のベタ塗りに乗せており、コントラスト比がWCAG AA（4.5:1）を大きく下回っている。カテゴリタグやページネーションの現在地で発生。

確度 **複数サイト**（イロコト・エニーキャリア）／判定 **真似しない**

```css
.index-Blog_List_Item .txt .cat_List_Item{color:#fff!important;background:#f09ba5;padding:4px 8px;font-weight:700} .sw-Pagenavi .wp-pagenavi .current{background:#35b1c1;border:1px solid #35b1c1;color:#fff} .wp-pagenavi a:hover{border:2px solid #f09ba5!important;color:#fff;background:#f09ba5
```

#fff on #f09ba5 は約2.1:1、#fff on #35b1c1 は約2.5:1。どちらもAAの4.5:1に遠く届かず、大きい文字の基準3:1すら#f09ba5は満たさない。しかもカテゴリタグは 4px 8px の小さい文字。真似してはいけない。明るいアクセントのベタ塗りには、白ではなくインク色（#595656 / #202020）を乗せるか、ベタ塗りをやめて枠線+アクセント文字にすること。

#### NOKIDとカミナリゲームスは body に color を指定していない。本文色をブラウザ既定の黒に任せている。

確度 **複数サイト**（NOKID・カミナリゲームス）／判定 **真似しない**

```css
body{ font-family: 'Noto Sans JP', "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif; -webkit-font-smoothing: antialiased; word-wrap : break-word; overflow-wrap : break-word; background-color: #F2F2F2; }
```

NOKIDは #0f0f0f をインク色として24回 color: で指定しているのに、bodyには載せていない。つまりクラスが当たらない要素（WordPressの本文内pタグなど）は純黒 #000 で出て、#0f0f0f のブロックと微妙に並ぶ。リセットは destyle.css v2.0.2（7サイト全部これ）で、destyleは color を設定しないので抜ける。body に color を1行書くだけで防げる。

#### エニーキャリアだけ、影にalphaを使わず不透明な薄グレー #ebebeb をベタで指定し、ホバーすると影を「消す」。普通の逆（ホバーで影を強くする）。

確度 **1サイトのみ**（エニーキャリア）／判定 **考え方だけ**

```css
.index-Services_Contents_List_Item{width:100%;-webkit-box-shadow:0 0 20px 5px #ebebeb;box-shadow:0 0 20px 5px #ebebeb;border-radius:6px @media (any-hover:hover){.index-Services_Contents_List_Item:hover{-webkit-box-shadow:0 0 0 0 #ebebeb;box-shadow:0 0 0 0 #ebebeb
```

考え方は流用価値が高い。地色が#fffのカードで、通常時にぼんやり浮かせて、ホバーで影を0にして「紙に吸い付く」感を出している。ただし不透明#ebebebは、カードが#f5f5f5のセクションに乗った途端に四角い縁として見えてしまう。流用するならalpha（rgba(32,32,32,.08)など）に置き換えること。#ebebeb自体はこのサイトでは影専用の色で、罫線には#dedededを別に持っている。

#### WIT STUDIO の :root に、未コンパイルのSass変数 `--text-color:$green` が本番CSSに漏れている。しかも1箇所が var(--text-color) で参照している（=無効値になる）。

確度 **1サイトのみ**（WIT STUDIO）／判定 **真似しない**

```css
:root{--vw-base:1920;--vw-min:1360;--text-color:$green;--vw-scale:max(calc(100vw / var(--vw-base)), 1px)
```

`$green` はCSSとして不正なので、var(--text-color) を使う側は色が当たらず継承色にフォールバックする。CSS全体を grep して `:$` が残っていないかチェックするだけで防げる事故。7サイト中このファイルだけで発生していて、彼らも完璧ではない証拠。

#### イロコトは同系2値のピンクを役割で完全に分離している。#f09ba5 は面と線専用、#ee7785（濃いピンク）は文字専用。逆転使用が1件もない。

確度 **1サイトのみ**（イロコト）／判定 **流用可**

```css
background:#f09ba5 border:2px solid #f09ba5 .index-News_List_Item a:hover{color:#ee7785 .index-Blog_List_Item:hover a .ttl{color:#ee7785
```

#f09ba5 は background:12／border:11／color:1。#ee7785 は color:4／background:0。薄い方を面に、濃い方を文字に、という分担。1つのブランドカラーを決めたら「面用」と「文字用」の2値を作るのが正解で、同じ値で両方やろうとすると必ずコントラストで破綻する。#fae1e4（さらに薄い）は background 2回のみで、3段のピンクが面・濃面・文字に対応している。

#### ホバーで付く色はアクセント色ではなく「インク色」に反転するサイトがある。ENILIS の円形ボタンはホバーで #181818（インク色）に塗られ、アクセントのオレンジは出てこない。

確度 **1サイトのみ**（ENILIS）／判定 **流用可**

```css
.sw-More .sw-More_Link:hover .sw-CircleBtn{background-color:#181818
```

アクセント色をホバーに消費してしまうと、ページ内でアクセントが出てくる箇所が増えすぎて「どこが大事か」が消える。ホバーはインク色への反転で足りる。ENILISはアクセント#f1721cを合計6回しか使っておらず（7サイトで最少）、それでもオレンジの印象は強い。アクセントを出す回数を絞るほど、1回が効く。

#### ステイハングリーは、ナビの現在地マーカー（CSS三角形）の色をPCとSPで入れ替えている。PCはインク色 #111、SPはアクセントのゴールド #cea948。

確度 **1サイトのみ**（ステイハングリー）／判定 **流用可**

```css
.st-Header .header-Nav .nav-List .nav-Item a::before{content:"";width:0;height:0;margin:0 auto;position:absolute;top:-8px;left:0;right:0;border-style:solid;border-width:4px 4px 0 4px;border-color:#111 transparent transparent trans @media print,screen and (max-width:1024px){.st-Header .header-Nav .nav-List .nav-Item a::before{top:-1.3020833333vw;border-width:.78125vw .78125vw 0 .78125vw;border-color:#cea948 transparent transparent transparent
```

SPではヘッダーナビが暗いドロワーに変わるので、#111の三角形は背景に溶けて消える。だからブレークポイントで色を差し替えている。SPのナビを暗い全画面ドロワーにする設計を採るなら、PC用のインク色指定を全部SPで見直す必要がある、という実務上の必須チェック項目。1024px以下で切り替えているのはイロコト系共通のブレークポイント。

#### ENILISはオレンジを2値持ち、用途で分けている。#f1721c はベタ塗り・UI専用、#ff7a00 はグラデーション専用。混用がない。

確度 **1サイトのみ**（ENILIS）／判定 **考え方だけ**

```css
background:#f1721c background-color:#f1721c color:#f1721c background:linear-gradient(0deg,rgba(255,122,0,.1) 33%,#ff7a00 100%) background:linear-gradient(89.89deg,#79e3ff 1.09%,#bdf9a5 46.41%,#ff7a00 88.1%)
```

#ff7a00（彩度が高く明るい）はグラデーションの端で薄まるので派手でも成立する。#f1721c（少し暗く濁らせた方）はベタ塗りにしても目に痛くない。この「ベタ用とグラデ用でアクセントを2値持つ」考え方は流用価値がある。ただしグラデーションの `89.89deg` `1.09%` `46.41%` `88.1%` はFigmaの書き出し値をそのまま貼ったもので、90deg / 0% / 46% / 88% に丸めるべき。端数は意味がないうえ、後で手で直せなくなる。

#### WIT STUDIOのカテゴリ色3色（ピンク/オレンジ/ブルー）は全部 !important 付きのモディファイアクラスで当てている。

確度 **1サイトのみ**（WIT STUDIO）／判定 **真似しない**

```css
color:#ff6485!important background-color:#ff6485!important border-color:#ff6485!important color:#ee8421!important background-color:#ee8421!important border-color:#ee8421!important color:#59a8e4!important background-color:#59a8e4!important border-color:#59a8e4!important
```

!important の出現数はNOKID61／エニーキャリア56／WIT STUDIO54／イロコト45／ENILIS38／ステイハングリー37／カミナリ28で、7サイトとも常用している。カテゴリ色の切り替えという「後から色を差し替える」仕組みこそカスタムプロパティ（--category-color）を使うべき場面で、!important で殴ると、そのカテゴリ色をホバーで変えることすらできなくなる。色の上書きが必要な設計を見つけたら、そこがトークン化の合図。

### 幅・グリッド・余白

#### vwで書かれた数値は全部「設計px ÷ 19.2」。つまり1920pxキャンバスで描いたpxをそのままvwに割り算して貼っている。9.375vw=180px、5.2083333333vw=100px、0.5208333333vw=10px。モバイル指定は÷7.68（768キャンバス）で、92.1875vw=708px。この換算を知らないとCSSの数値が全く読めない。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **流用可**

```css
.index-Services{width:100%;margin-top:6.9270833333vw;padding:0 9.375vw;position:relative} .sw-Services .services-Item .link::before{content:"";width:.5208333333vw;height:100%;position:absolute;top:0;left:0;background:url(../../images/common/bg_noise.png) 0 0/5.2083333333vw repeat-y #cea948} .l-sub .l-sub__inner{width:calc(1200 * var(--vw-scale))} .c-modal .c-modal__content{width:calc(708 * var(--vw-scale))}
```

7サイト全部がこの換算で書いている（手計算の小数vwが5サイト、WIT STUDIOは--vw-scaleトークン、NOKIDはモバイルのみ2桁丸めのvw）。WIT STUDIOのcalc(708 * var(--vw-scale))が、他サイトの92.1875vwと同じ708pxであることを証明していて、換算式の裏が取れている。rootフォントサイズを1rem=10pxに合わせる設計と同じ思想の延長。

#### 共通のコンテナクラスが存在しない。.container 的なものは1つもなく、各セクションの_Inner/_Contentsが同じ幅の数値を直書きでコピペしている。1200pxは26の別セレクタ、86.9791666667vwは11セレクタ、92.1875vwは13セレクタに重複。

確度 **7サイト全部**（エニーキャリア・NOKID・WIT STUDIO・イロコト・ステイハングリー・ENILIS・カミナリゲームス）／判定 **真似しない**

```css
.index-Services_Contents{width:86.9791666667vw;display:block} .index-About_Contents{width:86.9791666667vw} .index-Sustainability_Contents{background:0 0;border-radius:0;width:86.9791666667vw;padding:0} .index-Recruit_Contents{width:86.9791666667vw;grid-template-columns:100%;gap:13.0208333333vw 0;gap:0} .st-Footer_Inner{width:86.9791666667vw;grid-auto-columns:1fr;grid-template-columns:100%;grid-template-rows:auto auto auto;gap:0} .subpage-Inner{width:86.9791666667vw}
```

幅を1箇所変えたいだけで11〜26箇所の修正が必要になる。見た目の統一は結果的に取れているが、保守コストと事故率が高い。KEISUKEは同じ3段（1560/1200/960）を --w-wide / --w-base / --w-narrow のカスタムプロパティか .l-inner クラス1つにまとめるべき。WIT STUDIOだけが .l-sub__inner / --wide / --sp-708 というモディファイア方式に近づいているので、最新サイトの方向性＝彼ら自身も直書きを問題視している。

#### 縦のリズムは10px刻み。セクション上下paddingの既定値は100pxで、デスクトップ21回・モバイル18回と圧倒的に1位。次が80px(10回)、90px(7回)、70px(6回)、60px(5回)。8の倍数ではない。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・NOKID・ENILIS・WIT STUDIO・カミナリゲームス）／判定 **流用可**

```css
.index-Works{padding:100px 0 120px;background:#f7f6f6} .index-About{padding:100px 0 100px} .index-Services{padding:100px 0 100px} .index-Blog{padding:100px 0 120px;background:#f7f6f6} .st-Footer{padding:100px 0 48px} .subpage-Content{padding:70px 0 100px} .subpage-List{padding:90px 0}
```

60px以上の縦余白93個のうち約68%が10の倍数。イロコトが最も純粋で、全セクションが padding:100px 0 120px か 100px 0 100px のどちらかしかない。1rem=10px設計の必然的な帰結。8pxグリッド前提のFigmaテンプレを持ち込むと数値が全部噛み合わなくなる。

#### position:sticky が7サイト・1.3MBのCSSで0回。追従ヘッダー・追従目次・追従CTAを一切CSSで作っていない。ヘッダーは position:fixed のオーバーレイのみ。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **考え方だけ**

```css
.st-Header_Nav{width:100%;height:100%;z-index:300;position:fixed;top:0;right:0;overflow-x:hidden;overflow-y:scroll;-webkit-overflow-scrolling:touch;height:100%;width:0;-webkit-transform:translateY(-2em);transform:translateY(-2em);opacity:0;pointer-events:none;-webkit-transition:opacity .2s,width 0s .4s,-webkit-transform .2s;transition:opacity .2s,width 0s .4s,-webkit-transform .2s;transition:transform .2s,opacity .2s,width 0s .4s;transition:transform .2s,opacity .2s,width 0s .4s,-webkit-transform .2s;padding:0 0 50px}
```

14ファイル全てで `sticky` という文字列が0件。真似すべきではないが、真似する必要もない。「追従が無くても成立するページ構成」＝1画面に1メッセージで縦に流す作り方をしている、という読み方が正しい。KEISUKEが追従目次や追従CTAを入れたい場合、この7サイトには前例が無いので参考にできない。入れるなら自分で設計する必要がある。

#### デスクトップがベースCSSで、モバイルは `max-width:1024px` 一枚で上書きするデスクトップファースト。モバイル側のルール数がデスクトップ専用の10〜25倍ある（ステイハングリー187対7、ENILIS 177対8、エニーキャリア161対12、NOKID 205対21）。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **考え方だけ**

```css
@media print,screen and (max-width:1024px) @media print,screen and (min-width:1025px) @media screen and (max-width:1024px) @media print,screen and (max-width:767px) @media print,screen and (min-width:768px) @media print, screen and (min-width: 768px) and (max-width: 1280px)
```

主ブレークポイントは1024/1025が5サイト（エニーキャリア・ステイハングリー・ENILIS・NOKID・WIT STUDIO）、767/768が2サイト（イロコト・カミナリゲームス）。唯一の例外がWIT STUDIOで、デスクトップ264対モバイル278とほぼ同数＝両方を明示的に書く方式に移行している。考え方（PCデザインが先、SPは1ブロックで上書き）は日本の受託では現実的だが、最新サイトが対称型に変えている事実のほうが示唆的。

#### flexが246回、gridが61回で、flexが4倍使われている。カミナリゲームスは display:grid が0回で完全にflexのみ。justify-content は center が64回で space-between の26回より多い。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **考え方だけ**

```css
justify-content:center justify-content:space-between justify-content:flex-end justify-content: center justify-content: space-between justify-content: flex-end .sw-Pagetitle_Inner{position: relative; display: -webkit-box; display: -webkit-flex; display: flex; -webkit-box-pack: justify; -webkit-justify-content: space-between; justify-content: space-between; margin: 0 auto; opacity: 0; -webkit-transition: 1s cubic-bezier(0.165, 0.84, 0.44, 1) 0.3s; transition: 1s cubic-bezier(0.165, 0.84, 0.44, 1) 0.3s;}
```

gridは一覧グリッドとフッターだけに使い、それ以外は全部flex。display:flex に -webkit-box / -webkit-flex の3重プレフィックスが毎回付いていてノイズが多い（これはautoprefixer由来で削るべき）。justify-content:center が優勢なのは意外で、「要素を両端に散らす」より「中央に寄せて余白で語る」構成を好む。space-between は主にヘッダーとページタイトル行。

#### デスクトップの左右ガターにサイト横断の定数が存在しない。イロコト20px、エニーキャリア40px（実質90%幅）、NOKID 50px、ENILIS 100px、カミナリゲームス150px、ステイハングリー180px、WIT STUDIO 60px。サイト内では厳格に統一されている。

確度 **7サイト全部**（イロコト・ステイハングリー・ENILIS・NOKID・WIT STUDIO・カミナリゲームス・エニーキャリア）／判定 **考え方だけ**

```css
.sw-Img{max-width:1540px;padding:0 20px;margin:0 auto} .index-Services{width:100%;margin-top:6.9270833333vw;padding:0 9.375vw;position:relative} .index-Clients{width:100%;margin-top:6.9270833333vw;padding:0 9.375vw;position:relative} .index-PickUp{padding:.6770833333vw 0 0 5.2083333333vw} .sub-Wrapper{padding: 266px 50px 0} .st-Header{padding: 40px 0 0 50px} .l-sub .l-sub__inner.l-sub__inner--wide{max-width:calc(1560 * var(--vw-scale));padding:0 calc(60 * var(--vw-scale))}
```

ガター幅はコンテナ幅と違って案件ごとに決めている。ステイハングリーは180px(9.375vw)を全セクションに例外なく適用（.index-Services と .index-Clients が同一値）、イロコトは20px、と「サイト内では1値だけ」が共通の作法。つまり流用すべきは「ガターは1値に決めて例外を作らない」という規律のほうで、具体値ではない。モバイル側はほぼ30px（4サイト）に収束するので、こちらは定数化できる。

#### コンテナ幅は3段しかない。1560px（ワイド＝カード一覧・見出し）/ 1200px（標準＝本文セクション）/ 960px（ナロー＝記事本文・モーダル）。1200pxが6サイト・26箇所、960pxが7サイト全部で出る。

確度 **ほぼ全サイト**（イロコト・エニーキャリア・ステイハングリー・NOKID・ENILIS・WIT STUDIO・カミナリゲームス）／判定 **流用可**

```css
.l-sub .l-sub__inner{width:calc(1200 * var(--vw-scale))} .l-sub .l-sub__inner.l-sub__inner--wide{max-width:calc(1560 * var(--vw-scale));padding:0 calc(60 * var(--vw-scale))} .sw-Section{ max-width: 1200px; margin: 0 auto; } .index-Services_Contents{width:clamp(10px,90%,1200px);margin:0 auto;display:grid;position:relative;grid-template-columns:850px 1fr} .sw-Content .wp-block-image{ max-width: 960px !important; margin: 1.5em auto; float: none !important; display: table; }
```

1200pxはイロコト・エニーキャリア・ENILIS・NOKID・ステイハングリー・WIT STUDIOの6サイト。カミナリゲームスだけ1200を使わず960px固定（ゲーム会社でポスター型レイアウトのため）。ワイド段の実数値はサイトごとに1500/1540/1560/1614/1620/1720とバラけるが、全部1500〜1620のレンジに収まる＝「1920キャンバスから左右150〜200px引いた幅」という考え方が共通。3段という段数そのものが流用価値。

#### モバイルのコンテナは708px固定（=92.1875vw、768キャンバスで左右30px）。4サイトが同じ708pxを使う。残り3サイトも688/668/660pxで、左右ガターは30〜54pxのレンジに収まる。

確度 **ほぼ全サイト**（ステイハングリー・カミナリゲームス・ENILIS・WIT STUDIO・NOKID・イロコト）／判定 **流用可**

```css
.sw-Box{width: 92.1875vw; padding: 1.3020833333vw;} .l-sub .l-sub__inner.l-sub__inner--sp-708{width:calc(708 * var(--vw-scale))} .index-Recruit .recruit-Bg{width:92.1875vw;height:calc(100% - 7.03125vw);background-size:13.0208333333vw;display:block} .sw-Form{width:92.1875vw;padding:10.4166666667vw 3.90625vw} .sw-WorksArchive {max-width: 89.58vw; grid-template-columns: repeat( 1, 1fr ); column-gap: 0; grid-column-gap: 0; row-gap: 10.42vw; grid-row-gap: 10.42vw;} .sp_Inner{width:85.9375vw;margin:0 auto}
```

WIT STUDIOがクラス名に--sp-708と数値をそのまま書いていて、92.1875vw=708pxの意図が確定する。768キャンバスで左右30pxは実機375px幅だと約15pxに縮むので、スマホの画面端余白としてはかなり狭い。意図的に狭くして画像を端まで見せる設計。NOKIDの40px(89.58vw)、エニーキャリアの50px、イロコトの54pxはやや保守的な選択。

#### gapの階段も10px刻みで、20px(27回)と40px(20回)が主役。10px(18)/30px(13)/60px(11)/80px(10)/90px(8)/50px(8)が続く。8の倍数側（12px:11回、32px:5、64px:6、24px:4、16px:4）は合わせても全体の約13%で少数派。

確度 **ほぼ全サイト**（NOKID・WIT STUDIO・ENILIS・エニーキャリア・ステイハングリー・イロコト）／判定 **流用可**

```css
.sw-DefinitionList{ max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat( 2, 1fr ); column-gap: 20px; grid-column-gap: 20px; row-gap: 0px; grid-row-gap: 0px; } .p-home-dna .p-home-dna__list{grid-template-columns:repeat(3,1fr);gap:calc(30 * var(--vw-scale));margin:calc(60 * var(--vw-scale)) 0 0} .p-home-message .p-home-message__list{display:grid;grid-template-columns:repeat(3,1fr);gap:calc(36 * var(--vw-scale))} .comment-Modal .comment-Modal_Content .comment-Content{max-width:1200px;margin:0 auto;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:c …
```

gap宣言225個をpx換算して集計した結果。10/20/30/40/50/60/80/90 の8段で122個=54%を占める。彼らのスペーシングスケールは実質 10・20・30・40・60・80 の6段と考えてよい。12/16/24/32/36といった8系の値はライブラリ由来やボタン内側の微調整に偏る。

#### グリッドの既定形は等分列ではなく「固定px + 1fr」の非対称2列。`850px 1fr` `740px 1fr` `290px 1fr` `260px 1fr` `180px 1fr` `80px 1fr` など約25パターンで、等分2列repeat(2,1fr)の8回・等分3列repeat(3,1fr)の8回を大きく上回る。

確度 **ほぼ全サイト**（エニーキャリア・イロコト・NOKID・ステイハングリー・ENILIS・WIT STUDIO）／判定 **流用可**

```css
.index-Services_Contents{width:clamp(10px,90%,1200px);margin:0 auto;display:grid;position:relative;grid-template-columns:850px 1fr} .index-Services_Contents{grid-template-columns:740px 1fr} grid-template-columns:290px 1fr grid-template-columns:260px 1fr grid-template-columns:180px 1fr grid-template-columns: 80px 1fr grid-template-columns:13.5416666667vw 1fr grid-template-columns:18.2291666667vw 1fr
```

左に固定幅のラベル列（見出し・年号・番号）、右に1frの本文、という日本語の雑誌組み。固定側の数値は80/115/160/180/260/290（ラベル用）と380/400/550/720/740/850（画像・本文割り用）の2クラスタに分かれる。カード一覧を3列で並べるより、この2列型のほうが彼らの既定。1fr側は可変なのでテキスト量に強い。

#### 1024pxで全てのグリッドが1列に落ちる。2列・3列・4列の区別なく repeat(1,1fr) か 1fr か 100% になる。タブレット用に2列へ中間落としするサイトはほぼない。

確度 **ほぼ全サイト**（NOKID・エニーキャリア・ステイハングリー・ENILIS）／判定 **流用可**

```css
.sw-WorksArchive {max-width: 89.58vw; grid-template-columns: repeat( 1, 1fr ); column-gap: 0; grid-column-gap: 0; row-gap: 10.42vw; grid-row-gap: 10.42vw;} .sw-BlogArchive {max-width: 89.58vw; grid-template-columns: repeat( 1, 1fr ); column-gap: 0; grid-column-gap: 0; row-gap: 10.42vw; grid-row-gap: 10.42vw;} grid-template-columns:repeat(1,1fr) grid-template-columns:100% grid-template-columns:1fr .index-Services_Contents{width:86.9791666667vw;display:block}
```

NOKIDは works=3列・blog=4列・news=2列と列数が違うのに、1024px以下では全部1列。列数の中間段を作らないので媒体ごとの検証が2パターンで済む。エニーキャリアは display:block に戻してgrid自体を捨てるパターンもあり、こちらのほうが崩れにくい。ただしカード幅が708pxまで広がるので、縦長カードは画像の縦が伸びすぎないか確認が必要。

#### 1920キャンバスと768キャンバスで、同じ部品の数値を「そのまま」持ってこない。小さい部品は1.2〜1.5倍に拡大して描き直し、コンテナだけ縮める。アイコン10px→14px、12px→18px、16px→22px、ボタン80px→100px、180px→220px。逆に背景1840px→708px、スクロールバー1500px→450px。

確度 **ほぼ全サイト**（ステイハングリー・エニーキャリア・ENILIS・WIT STUDIO・NOKID・カミナリゲームス・イロコト）／判定 **流用可**

```css
.sw-Services .services-Item .link::before{content:"";width:.5208333333vw;height:100%;position:absolute;top:0;left:0;background:url(../../images/common/bg_noise.png) 0 0/5.2083333333vw repeat-y #cea948} .sw-Services .services-Item .link::before{width:1.8229166667vw;background-size:13.0208333333vw} .swiper .swiper-nav .swiper-button{width:9.375vw;height:4.1666666667vw;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-flex-shrink:0;flex-shrink:0} .swiper .swiper-nav .swiper-button{width:28.645 …
```

これが一番重要。768/1920=0.4倍でレンダリングされるので、デスクトップの10pxアイコンをそのまま持ってくると実機で4px＝消える。だから768キャンバス上で14pxに描き直す（0.4×1.4=0.56の実効倍率）。つまりFigmaで1920と768の2枚を描くとき、小物は同じ数値にしてはいけない。目安は「部品が小さいほど倍率を上げる。アイコン1.4倍、ボタン1.25倍、カード1.1倍、コンテナは実測」。例外もあり（youtube-Modal_Close は110px→110pxで据え置き）。

#### モバイルの縦paddingはデスクトップより数値を小さくしない。同じか大きい。デスクトップ100pxが21回に対しモバイル100pxが18回、モバイルは110px(5回)・140px(5回)・200px(4回)も出る。

確度 **ほぼ全サイト**（イロコト・NOKID・エニーキャリア・ステイハングリー・ENILIS・WIT STUDIO）／判定 **流用可**

```css
.index-Works{padding:100px 0 120px;background:#f7f6f6} .index-Works{padding:13.0208333333vw 0 18.2291666667vw} .index-Services{padding:100px 0 100px} .index-Services{padding:13.0208333333vw 0 18.2291666667vw} .sw-Section + .sw-Section{ margin-top: 140px; } .sw-Section + .sw-Section{ margin-top: 26.04vw; }
```

イロコトは 100px/120px → 100px/140px（13.0208333333vw=100px、18.2291666667vw=140px@768）、NOKIDは140px→200px。768キャンバスの値は実機で0.4〜0.5倍に縮むので、同じ数値でも体感は半分になる。だからデザイン上「同じか増やす」が正解で、デスクトップの数値を半分にするとモバイルで余白が消える。Figmaで768の版を描くとき、縦余白は1920版と同値から始めて必要なら増やす。

#### gapは必ず2値で書き、使わない軸に明示的に0を入れる。`gap:0 60px`（列だけ）や`gap:11.71875vw 0`（行だけ）という書き方が2値gapの大多数。片方だけの1値gapはほぼ使わない。

確度 **複数サイト**（ステイハングリー・エニーキャリア・ENILIS・NOKID）／判定 **流用可**

```css
gap:0 .5208333333vw gap:0 1.0416666667vw gap:0 1.5625vw gap:11.71875vw 0 gap:13.0208333333vw 0 gap:2.0833333333vw 0 .st-Footer_Menu{display:grid;grid-template-columns:180px 188px 233px 1fr;grid-template-columns:160px 168px 169px 169px 118px;gap:64px 0} .sw-WorksArchive {max-width: 1620px; margin: 0 auto; display: grid; grid-template-columns: repeat( 3, 1fr ); column-gap: 30px; grid-column-gap: 30px; row-gap: 70px; grid-row-gap: 70px;}
```

2値gap約55個のうち約40個が片軸0。ブレークポイントで列数を変えたとき、使わない軸の余白が残って崩れるのを防ぐ書き方。NOKIDはさらに column-gap / row-gap に分けて書き、両方を明示している。「gapは常に `行 列` の2値で書く」をルール化するだけで事故が減る。

#### カード一覧の行gapは列gapの約2倍。3列カードで列30px・行70px、4列カードで列32px・行58px。異なる2サイト（NOKIDとWIT STUDIO）が独立に「列30px / 行70px」という同じ比率にたどり着いている。

確度 **複数サイト**（NOKID・WIT STUDIO）／判定 **流用可**

```css
.sw-WorksArchive {max-width: 1620px; margin: 0 auto; display: grid; grid-template-columns: repeat( 3, 1fr ); column-gap: 30px; grid-column-gap: 30px; row-gap: 70px; grid-row-gap: 70px;} .sw-BlogArchive {max-width: 1620px; margin: 0 auto; display: grid; grid-template-columns: repeat( 4, 1fr ); column-gap: 32px; grid-column-gap: 32px; row-gap: 58px; grid-row-gap: 58px;} .c-interview-list{grid-template-columns:repeat(3,1fr);gap:calc(70 * var(--vw-scale)) calc(30 * var(--vw-scale))} .sw-NewsArchive{ max-width: 1620px; margin: 0 auto; display: grid; grid-template-columns: repeat( 2, 1fr ); column-g …
```

カードの下にはタイトル・日付のテキストが伸びるので、行方向は列方向と同じ余白では詰まって見える。2.0〜2.3倍が実測値。例外はテキストだけのニュース一覧（2列・20px/20px＝1:1）で、画像があるかどうかで比率を切り替えている。gap:70px 30px を3列カードの初期値にして良い。

#### grid-template-areas は使うが、フッターにしか使わない。2次元の名前付きエリアが必要なのはロゴ・ナビ・コピーライトの3ブロックだけ、という判断。

確度 **複数サイト**（イロコト・エニーキャリア）／判定 **流用可**

```css
.st-Footer{display:grid;grid-template-columns:180px 1fr;grid-template-rows:42px auto;grid-template-areas:"logo nav" "bottom bottom"} .st-Footer{display:grid;grid-template-columns:180px 1fr;grid-template-rows:60px 42px auto;grid-template-areas:"logo logo" "nav nav" "bottom bottom"} .st-Footer_Logo{grid-area:logo} .st-Footer_Nav{grid-area:nav} .st-Footer_Bottom{grid-area:bottom} grid-template-areas:"st-Footer_Logo st-Footer_Menu" "st-Footer_Bottom st-Footer_Bottom" grid-template-areas:"st-Footer_Menu" "st-Footer_Logo" "st-Footer_Bottom"
```

areas指定は全7サイトで6箇所だけ、全部フッター。モバイルで `"logo logo" "nav nav" "bottom bottom"` に差し替えるだけで並び順が変わる（エニーキャリアはナビをロゴより上に入れ替えている）ので、順序が変わる箇所にだけ使うという使い分けが正しい。本文セクションには使わず、固定px+1frの2列で済ませている。

#### セクションの縦paddingに「システム」があるサイトと無いサイトがはっきり分かれる。イロコトは全セクション100px/120pxの2値だけ。エニーキャリアは185/240、351/0、290/250、450/200と全部バラバラ。

確度 **複数サイト**（イロコト・エニーキャリア）／判定 **真似しない**

```css
.index-Works{padding:100px 0 120px;background:#f7f6f6} .index-Blog{padding:100px 0 120px;background:#f7f6f6} .index-About{padding:100px 0 100px} .index-Services{padding:100px 0 100px} .index-Services{padding:185px 0 240px;position:relative} .index-Sustainability{padding:351px 0 0;position:relative} .index-Recruit{padding:290px 0 250px;position:relative} .index-About{position:relative;padding:450px 0 200px}
```

エニーキャリアの450px/351pxは、絶対配置した装飾イラストがセクションに食い込むのを避けるための実測値。デザインとしては成立しているが、セクションを1つ差し替えるだけで全部の数値を再計測する必要がある。イロコト型（100px固定＋見出しブロック側で微調整）を採るべき。エニーキャリアは「装飾を絶対配置したらリズムは捨てる」ことを選んでいる、という取引として理解しておく。

#### IE11向けの死んだコードが残っている。`-ms-grid-row` / `-ms-grid-column` / `-ms-grid-column-span` がイロコトで60宣言、エニーキャリアで2ファイル分。NOKIDには `grid-column-gap` / `grid-row-gap` の旧名が24箇所、常に新名とペアで重複している。

確度 **複数サイト**（イロコト・エニーキャリア・NOKID）／判定 **真似しない**

```css
.st-Footer_Logo{-ms-grid-row:1;-ms-grid-column:1;-ms-grid-column-span:2} .st-Footer_Nav{-ms-grid-row:2;-ms-grid-column:1;-ms-grid-column-span:2} .st-Footer_Bottom{-ms-grid-row:3;-ms-grid-column:1;-ms-grid-column-span:2} .sw-NewsArchive{ max-width: 1620px; margin: 0 auto; display: grid; grid-template-columns: repeat( 2, 1fr ); column-gap: 20px; grid-column-gap: 20px; row-gap: 20px; grid-row-gap: 20px; }
```

autoprefixerのターゲット設定が古いまま。-ms-grid はIE11の旧Grid仕様で、2026年には完全に無意味。ファイルサイズを増やしつつ、CSSを読むときのノイズになる。最新のWIT STUDIOには1つも無いので彼らも直している。browserslistを現行にするだけで消える。

#### aspect-ratio を使っているのは最新のWIT STUDIOだけで5回。残り6サイトは padding-top のパーセント指定で比率を作る旧来のハック。しかもエニーキャリアは 65.789% / 57.78% / 17.96% / 142.85% と画像ごとに手計算した値を使っている。

確度 **1サイトのみ**（WIT STUDIO・NOKID・イロコト・エニーキャリア・ステイハングリー）／判定 **考え方だけ**

```css
aspect-ratio:16/9 aspect-ratio:460/260 aspect-ratio:376/240 aspect-ratio:1/1 padding-top: 56.25% padding-top:62.5% padding-top:65.789% padding-top:17.96% padding-top:142.85%
```

考え方（16:9＝56.25%、1:1＝100%、16:10＝62.5%という定番比率に寄せる）は流用価値がある。実装は aspect-ratio でよい。真似すべきでないのはエニーキャリアの 65.789% / 17.96% / 142.85% のような手計算値で、画像を差し替えた瞬間に枠と中身が合わなくなる。WIT STUDIOの aspect-ratio:460/260 のように「実寸をそのまま比として書く」のが一番読みやすい。

#### フルブリード（背景を画面端まで流す）は要素自体を広げず、position:absolute の擬似要素に width:100vw と right:calc(50% - 50vw + N) を当てて作る。しかも+Nを足して片側だけ流す「ハーフブリード」にしている。

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
.subpage-List::before{content:"";display:block;position:absolute;width:100vw;background:#f5f5f5;height:100%;top:0;right:calc(50% - 50vw + 7.2916666667vw);border-radius:0 6px 6px 0} .subpage-List::before{right:calc(50% - 50vw + 1.25vw)} .subpage-List::before{right:-6.5104166667vw;border-radius:0;width:100vw}
```

+7.2916666667vw は140px。グレーの面が右端からはみ出す一方、左端はコンテンツのラインに揃う。両側ブリードより「紙面の版面を意識させる」効果があり、しかも親要素のレイアウトを一切壊さない（擬似要素なのでグリッドの子にならない）。border-radius:0 6px 6px 0 で流す側だけ角を落としているのも芸が細かい。1サイトのみの技だが汎用性が高い。

#### モバイルのフルブリードは別実装で、width:100vw と「ガター幅ぶんの負のmargin-left」の組み合わせ。エニーキャリアのモバイルガターは50pxで、margin-left も正確に -6.5104166667vw（=-50px）。

確度 **1サイトのみ**（エニーキャリア）／判定 **考え方だけ**

```css
.mission-Box{margin-top:11.71875vw;padding:14.3229166667vw 0 11.71875vw;width:100vw;margin:11.71875vw 0 0 -6.5104166667vw} .message-Box{padding:0 0 11.71875vw;width:100vw;margin:11.71875vw 0 0 -6.5104166667vw} .subpage-Inner{width:86.9791666667vw}
```

コンテナが86.9791666667vw(668px)なので左右ガターは(768-668)/2=50px、負マージンがそれと一致していて意図が明確。ただし margin-top を書いた直後に margin ショートハンドで上書きしていて（1行で2回margin指定）、片方が死んでいる。考え方は流用、書き方は margin-inline:-50px 一発にすべき。

#### 最新のWIT STUDIOだけが、手計算の小数vwを捨てて `--vw-scale` トークンに移行している。`calc(100vw / 1920)` を1pxスケール単位として定義し、全ての寸法を `calc(設計px * var(--vw-scale))` で書く。該当1006箇所、手計算の小数vwは3箇所まで減っている。

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
:root{--vw-base:1920;--vw-min:1360;--text-color:$green;--vw-scale:max(calc(100vw / var(--vw-base)), 1px);--index-gallery-width:0;--index-text-stroke-width:0} :root{--vw-scale:calc(100vw / 1360)} :root{--vw-base:768;--vw-scale:calc(100vw / var(--vw-base))} .l-sub .l-sub__inner{width:calc(1200 * var(--vw-scale))} .p-home-hero .p-home-hero__visual{width:calc(1048 * var(--vw-scale))} .c-job .c-job__item .c-job__list{max-width:calc(992 * var(--vw-scale))}
```

他6サイトが 9.375vw と書くところを calc(180 * var(--vw-scale)) と書くので、CSSを読んだだけで設計値が分かる。Figmaの数値をそのまま貼れて暗算が要らない。ブレークポイントごとに --vw-base を差し替えるだけでキャンバスが切り替わるのも強い。1サイトのみだが、彼ら自身が最新案件で選んだ方式なので、KEISUKEはこれを初手で採用すべき。

#### エニーキャリアだけが clamp() でコンテナを作る。`width:clamp(10px,90%,1200px)` で、第1引数の10pxはダミー。実質 min(90%, 1200px)。ガターを固定pxではなく「画面の5%ずつ」にしている。

確度 **1サイトのみ**（エニーキャリア）／判定 **考え方だけ**

```css
width:clamp(10px,90%,1200px) width:clamp(10px,90%,960px) width:clamp(10px,86%,640px) width:clamp(10px,100%,1200px) .index-About_Contents{position:relative;width:clamp(10px,90%,960px);margin:0 auto} .index-Sustainability_Contents{position:relative;width:clamp(10px,100%,1200px);background:#f5f5f5;padding:90px 0 100px;margin:0 auto;border-radius:6px}
```

考え方は良い（1200px以下では自動で比率ガターになるのでタブレット域のメディアクエリが不要）。実装は min(90%, 1200px) と書けば済むのに clamp に無意味な下限10pxを置いていて、意図が読めない。KEISUKEが使うなら `width:min(90%,1200px);margin-inline:auto` に書き換えるべき。90%/86%の2種類あるのも揺れている。

#### 同じルール内で grid-template-columns を2回宣言して、前者が完全に死んでいる箇所がある。4列指定の直後に5列指定を書いていて、実際には5列になる。

確度 **1サイトのみ**（エニーキャリア）／判定 **真似しない**

```css
@media print,screen and (max-width:1700px){.st-Footer_Menu{display:grid;grid-template-columns:180px 188px 233px 1fr;grid-template-columns:160px 168px 169px 169px 118px;gap:64px 0}
```

4列版が消し忘れの残骸。さらに生き残る 160px 168px 169px 169px 118px という5列は合計784pxの手打ちで、ナビのラベルが1文字増えると折り返す。フッターの5列ナビは repeat(5,1fr) か flex + gap にすべき。同じ症状は .index-Recruit_Contents の `gap:13.0208333333vw 0;gap:0` にもあり、後者で前者が死んでいる。

#### カミナリゲームスは 768/767 ブレークポイントで、768〜1280pxのタブレット域に 986.6568px / 579.9942px のような非整数pxを焼き込んでいる。レンジ内で固定幅なので流動しない。

確度 **1サイトのみ**（カミナリゲームス）／判定 **真似しない**

```css
.idx-Main_Inner .bg-wrapper {width: 986.6568px; height: 579.9942px;} .idx-Main_Inner .bg-wrapper:before {width: 986.6568px; height: 295.99704px;} .sw-Pagetitle_Inner{-webkit-transform: translateX(10px); transform: translateX(10px); width: 960px;} .sw-Box{width: 960px; padding: 10px;} .sw-Box{width: 92.1875vw; padding: 1.3020833333vw;}
```

小数第4位までのpxは設計ツールからの書き出しそのまま。768〜1280pxという512px幅のレンジで986.6568px固定なので、768px側では画面からはみ出し、1280px側では余る。他6サイトがvwで流動化しているのに対し、ここだけ固定px。コンテナ本体も960px固定で、768〜960pxの画面幅では横スクロールが発生する。真似してはいけない。

#### WIT STUDIOの --vw-scale に `max(..., 1px)` の下限がついているため、1361〜1920pxのレンジでスケールが1pxに固定され、1920キャンバスの実寸がそのまま出る。1360pxでスケールが不連続に跳ぶ。

確度 **1サイトのみ**（WIT STUDIO）／判定 **真似しない**

```css
:root{--vw-base:1920;--vw-min:1360;--text-color:$green;--vw-scale:max(calc(100vw / var(--vw-base)), 1px);--index-gallery-width:0;--index-text-stroke-width:0} :root{--vw-scale:calc(100vw / 1360)} .p-home-dna .p-home-dna__background{top:calc(304 * var(--vw-scale));left:calc(50% - calc(960 * var(--vw-scale)));width:calc(1920 * var(--vw-scale));height:calc(993 * var(--vw-scale));-webkit-mask:url(../images/pc/index/mask_dna.png) no-repeat top center/100% auto;mask:url(../images/pc/index/mask_dna.png) no-repeat top center/100% auto} body{font-family:"Zen Kaku Gothic New","Helvetica Neue",Arial,"Hira …
```

1025〜1360pxは `calc(100vw/1360)` に上書きされ（max()なし）正しく縮むが、1361〜1920pxはどのメディアクエリにも入らず max(<1px, 1px)=1px に張り付く。結果、1400px幅のノートPCでは1920px設計の実寸が出て、width:calc(1920*var(--vw-scale)) の装飾背景がはみ出す。body の overflow-x:hidden で隠れているだけ。--vw-scale を使うなら max() の下限は外し、必要なら clamp で上限だけ付けるべき。なお --vw-min:1360 は宣言されているだけで参照0回の死んだトークン。

#### NOKIDだけ「デスクトップはpx、モバイルはvw」のハイブリッド。デスクトップは max-width:1620px / 1200px / gap 20px・30px・32px の固定px、モバイルは 89.58vw / 10.42vw と2桁丸めのvw。

確度 **1サイトのみ**（NOKID）／判定 **考え方だけ**

```css
.sw-Section{ max-width: 1200px; margin: 0 auto; } .sw-Section + .sw-Section{ margin-top: 140px; } .sw-Section + .sw-Section{ margin-top: 26.04vw; } .sw-WorksArchive {max-width: 1620px; margin: 0 auto; display: grid; grid-template-columns: repeat( 3, 1fr ); column-gap: 30px; grid-column-gap: 30px; row-gap: 70px; grid-row-gap: 70px;} .sw-WorksArchive {max-width: 89.58vw; grid-template-columns: repeat( 1, 1fr ); column-gap: 0; grid-column-gap: 0; row-gap: 10.42vw; grid-row-gap: 10.42vw;}
```

vwが147箇所すべて max-width:1024px 内＝デスクトップは一切流動させない割り切り。.sw-Section+.sw-Section が 140px→26.04vw(=200px@768) になるのが分かりやすく、「セクション間余白はモバイルで数値を増やす」原則の実例。デスクトップをpxで固定するとFigmaとCSSが1:1で照合できて検証が速い反面、1620pxより広い画面では余白が間延びする。文字中心のサイトなら有効な割り切り。

### カード・部品

#### カード本体（コンテナ）に border を付けている例は7サイト合計で0件。カードの分離は「影」「背景色差」「疑似要素オーバーレイの枠」の3手段だけで、実線の枠は使わない。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **流用可**

```css
.index-Blog{padding:100px 0 120px;background:#f7f6f6} .index-Blog_List_Item{background:#fff;position:relative} .p-home-support .p-home-support__list .p-home-support__item{position:relative;-webkit-box-shadow:0 0 calc(20 * var(--vw-scale)) rgba(20,22,20,.1);box-shadow:0 0 calc(20 * var(--vw-scale)) rgba(20,22,20,.1);background:#fff;border-radius:calc(20 * var(--vw-scale));padding:calc(40 * var(--vw-scale))}
```

セクション背景を #f7f6f6 のような薄いグレーにして、カードだけ #fff にする。これだけで枠も影も要らない。イロコト自社サイトのブログ一覧がこの最小構成。枠線を引く前にまず背景差で足りるか試す、という判断順序がそのまま流用できる。

#### 7サイト1.3MB中、table / th / td にスタイルを当てている宣言はリセット由来の padding:0 以外に存在しない。表組みは全部 dl か grid に置き換えられている。

確度 **7サイト全部**（エニーキャリア・ステイハングリー・ENILIS・WIT STUDIO・カミナリゲームス・NOKID・イロコト）／判定 **流用可**

```css
td,th{vertical-align:top;padding:0} address,blockquote,dl,figure,form,iframe,p,pre,table{margin:0}
```

会社概要・募集要項・料金表のような「表に見えるもの」を一切 table で組んでいない。理由はレスポンシブで、dl なら PC2列→SP1列、dt/dd の縦積みへの切り替えがメディアクエリ1個で済むのに対し、table はセル構造を崩せないから。次のサイトでも仕様表は dl から始めるのが安全。

#### ホバーは7サイト全てがホバー可否のメディアクエリで囲んである。6サイトが @media (any-hover:hover)、NOKIDだけ @media (hover: hover)。素の :hover は書かない。

確度 **7サイト全部**（エニーキャリア・ENILIS・ステイハングリー・WIT STUDIO・カミナリゲームス・NOKID・イロコト）／判定 **流用可**

```css
@media (any-hover:hover){.sw-Link:hover .txt{color:#35b1c1} @media (any-hover:hover){.sw-Pagenavi .wp-pagenavi .page:hover{border:1px solid rgba(53,177,193,.3);color:#35b1c1} @media (hover: hover) { .sw-DefinitionList dd > a:hover{ text-decoration: underline; } }
```

出現数は ENILIS 36、ステイハングリー 36、WIT STUDIO 33、エニーキャリア 23〜24、カミナリ 17、NOKID 24（hover:hover）、イロコト 4〜5。タッチ端末でホバー状態が「貼り付く」のを防ぐため。これが例外なく全サイトで守られている唯一のルール。any-hover は複数入力デバイスのどれかがホバー可能なら真、hover は主入力のみ。マウス併用タブレットを拾いたいなら any-hover、拾いたくないなら hover。

#### 画像のホバー拡大は overflow:hidden の親 + img の transform:scale で、倍率は1.05か1.1の2値だけ。duration はサイトの新旧で .2s → .3s → .4s と一貫して長くなっている。

確度 **ほぼ全サイト**（イロコト・ステイハングリー・WIT STUDIO・カミナリゲームス・ENILIS）／判定 **流用可**

```css
.index-Works_List_Item .img{position:relative;width:100%;border:1px solid #eee;overflow:hidden} .index-Works_List_Item img{-webkit-transition:opacity .2s,-webkit-transform .2s;transition:opacity .2s,transform .2s,-webkit-transform .2s;position:absolute;width:100%;height:100%;-o-object-fit:cover;object-fit:cover} .index-Works_List_Item:hover img{-webkit-transform:scale(1.05);transform:scale(1.05)} .p-home-message .p-home-message__list .p-home-message__item .p-home-message__thumbnail img{-webkit-transition:transform .4s,-webkit-transform .4s} .p-home-message .p-home-message__list .p-home-message …
```

倍率は1.05（控えめ）と1.1（はっきり）の二択で、1.08や1.15のような中間値を作っていない。duration はイロコト .2s、ENILIS .3s、ステイハングリー/WIT STUDIO .4s。新しいサイトほど遅い＝ゆったり見せる方向に寄っている。拡大のトリガは img ではなくカード全体（:hover img）に置くので、カードのどこを触っても画像が動く。

#### アスペクト比の確保は padding-top:% の擬似要素ハックが主流（11箇所）で、aspect-ratio プロパティを使っているのは最新のWIT STUDIOだけ（5箇所）。

確度 **ほぼ全サイト**（エニーキャリア・イロコト・ステイハングリー・WIT STUDIO）／判定 **考え方だけ**

```css
.index-Services_Contents_List_Item::before{content:"";display:block;padding-top:66.66%} .index-Services_Contents_List_Item::before{padding-top:17.96%} .index-Services_Contents_List_Item img{position:absolute;top:0;left:0} .c-interview-list .c-interview-list__item a .c-interview-list__thumbnail{position:relative;aspect-ratio:460/260;border-radius:calc(10 * var(--vw-scale));overflow:hidden}
```

考え方（カードは比率で高さを決め、画像は absolute で流し込む）は流用すべきだが、実装は aspect-ratio を使う。WIT STUDIO が aspect-ratio:460/260 のように「デザインデータの実寸をそのまま分数で書く」書き方をしているのが良い作法で、56.25% のような計算済みの数字より後から読める。注目すべきはエニーキャリアが PC 66.66%（3:2）→ SP 17.96%（約5.6:1の細長バナー）と比率そのものを切り替えている点で、画像を2種類用意する前提になっている。

#### ホバーの既定値は opacity:.6。ホバー時に変化するプロパティの集計は opacity 48件 > transform 42件 > color 37件 > background 31件で、影や枠の変化（box-shadow 5件、border-color 4件）は例外的。

確度 **ほぼ全サイト**（エニーキャリア・ENILIS・NOKID・WIT STUDIO・ステイハングリー・イロコト）／判定 **流用可**

```css
.st-Header .header-Logo a:hover{opacity:.6} .st-Footer .footer-Logo a:hover{opacity:.6} .st-Footer .footer-Nav .nav-List .nav-Item a:hover span{opacity:.6}
```

opacity の採用値は .6(17件)、.7(7件)、.8(4件)、.75(3件)、.9(2件)、.5(1件)。.6 が圧倒的で、ロゴ・ナビ・補助リンクといった「装飾を足したくない要素」の既定処理になっている。凝ったホバーは主要導線のカードとボタンだけに置き、それ以外は全部 opacity:.6 で済ませる、という割り切り。迷ったら .6。

#### カード一覧の列数は「2列」が標準で「3列」は少数。grid-template-columns の集計は repeat(2,1fr) 11件 vs repeat(3,1fr) 6件。さらに row-gap を0にしてカラム間だけ空ける書き方が多い（gap:0 20px / gap:0 24px）。

確度 **ほぼ全サイト**（エニーキャリア・WIT STUDIO・ENILIS・NOKID）／判定 **流用可**

```css
.index-Services_Contents_List{margin-top:40px;display:grid;grid-template-columns:repeat(3,1fr);gap:0 20px} .index-Sustainability_Contents_List{display:grid;grid-template-columns:repeat(3,1fr);margin-top:50px;gap:0 24px} @media print,screen and (min-width:1025px){.p-home-support .p-home-support__list{display:grid;grid-template-columns:repeat(2,1fr);gap:calc(20 * var(--vw-scale));margin:calc(30 * var(--vw-scale)) 0 0} @media print,screen and (max-width:1024px){.p-home-dna .p-home-dna__list{grid-template-columns:repeat(2,1fr);gap:calc(28 * var(--vw-scale));margin:calc(50 * var(--vw-scale)) 0 0}
```

gap の集計では gap:0 / gap: 0 / gap: 0px が計21件で最多。3列にするときは row-gap を0にして（gap:0 20px）1行で収まる前提にしている。注目すべきはWIT STUDIOのSP対応で、3列→2列に落として1列にしていない（max-width:1024px で repeat(2,1fr)）。日本語の短いカードなら SP 2列が成立する、という判断。列数の既定を3ではなく2に置き、SPでも1列に逃げない。

#### 影の型は「1層・オフセット0・ぼかしのみ・alpha .1」。WIT STUDIOでは全く同じ値がカード/ヘッダー/求人枠/FAQ/プロフィールに20回繰り返されている。方向を持つドロップシャドウではなく、全方位に均等に広がる「浮き」。

確度 **複数サイト**（WIT STUDIO・エニーキャリア）／判定 **流用可**

```css
box-shadow:0 0 calc(20 * var(--vw-scale)) rgba(20,22,20,.1) box-shadow:0 0 calc(30 * var(--vw-scale)) rgba(20,22,20,.06)
```

全1.3MB中で最頻の影（20回）。ぼかしを20pxから30pxに広げるときは alpha を .1 から .06 に下げてある（広い影は薄く）。この2値セットだけ持っておけばサイト全体の影が統一できる。影色は純黒ではなく rgba(20,22,20) というわずかに緑寄りの黒で、ブランドのグリーンと喧嘩しない。

#### 角丸は2段。カード外側20px、内側の画像/サムネ10pxで、内側が外側のちょうど半分。枠線オーバーレイは border-radius:inherit で親に追従させる。

確度 **複数サイト**（WIT STUDIO・エニーキャリア）／判定 **流用可**

```css
.p-home-support .p-home-support__list .p-home-support__item{position:relative;box-shadow:0 0 calc(20 * var(--vw-scale)) rgba(20,22,20,.1);background:#fff;border-radius:calc(20 * var(--vw-scale));padding:calc(40 * var(--vw-scale))} .p-home-support .p-home-support__list .p-home-support__item .p-home-support__image{position:absolute;top:calc(40 * var(--vw-scale));left:calc(40 * var(--vw-scale));border-radius:calc(10 * var(--vw-scale));overflow:hidden} .c-interview-list .c-interview-list__item a .c-interview-list__thumbnail{position:relative;aspect-ratio:460/260;border-radius:calc(10 * var(--vw-sc …
```

全サイトの border-radius 集計で 50%（50回・円形アイコン）、6px/.78125vw（29回・エニーキャリアのカード）、calc(20*--vw-scale)（11回・WIT STUDIOのカード）、calc(10*--vw-scale)（5回・内側画像）、calc(100*--vw-scale)（5回・ピル型ボタン）。つまり値は「円 / カード / 内側 / ピル」の4段しかない。border-radius:inherit は8箇所すべて疑似要素のオーバーレイで、角丸値の二重管理を消す。

#### カード/画像/装飾を角に貼るときは -1px はみ出させて継ぎ目を潰す。カミナリのコーナー装飾（left:-1px / right:-1px）とWIT STUDIOの番号バッジ（top:-1px）で同じ対処。

確度 **複数サイト**（カミナリゲームス・WIT STUDIO）／判定 **流用可**

```css
.deco-edge span:before { top: 0; left: -1px; } .deco-edge span:after { top: 0; right: -1px; -webkit-transform: scale(-1, 1); transform: scale(-1, 1); } .p-home-dna .p-home-dna__list .p-home-dna__item .p-home-dna__number{position:absolute;top:calc(-1 * var(--vw-scale));left:0;z-index:2}
```

要素の端をぴったり0に合わせると、ブラウザのサブピクセル丸めで背景が1px透けて細い線が見える。装飾側を1pxだけ外にずらすのが最小の対処。WIT STUDIOは calc(-1 * var(--vw-scale)) と書いているので、--vw-scale に max(...,1px) の床があるおかげでどの画面幅でも最低1pxはみ出す。この1pxは「デザイン」ではなく「実装の保険」なので、Figma上の座標と1px合わなくても直さない。

#### エニーキャリアのサービスカードは、ホバーで影が「消える」。通常時 0 0 20px 5px #ebebeb → ホバー時 0 0 0 0 #ebebeb。浮いているカードが押し込まれて紙面に沈む挙動。

確度 **1サイトのみ**（エニーキャリア）／判定 **考え方だけ**

```css
.index-Services_Contents_List_Item{width:100%;-webkit-box-shadow:0 0 20px 5px #ebebeb;box-shadow:0 0 20px 5px #ebebeb;border-radius:6px;overflow:hidden;position:relative;-webkit-transition:-webkit-box-shadow .3s;transition:-webkit-box-shadow .3s;transition:box-shadow .3s;transition:box-shadow .3s,-webkit-box-shadow .3s} @media (any-hover:hover){.index-Services_Contents_List_Item:hover{-webkit-box-shadow:0 0 0 0 #ebebeb;box-shadow:0 0 0 0 #ebebeb}
```

「ホバーで影を濃くする」の真逆。ぼかし20px/広がり5pxを両方0にしているので、影の色 #ebebeb は据え置きのまま値だけ畳んでいる（色を transparent にするより遷移がきれい）。考え方は流用価値が高いが、影が消えると押せる感じが弱いので、押下（:active）ではなくホバーに割り当てるなら他の変化と併用したい。

#### ステイハングリーは逆に、ホバーで影のalphaだけを .15 → .3 に上げる。ぼかし量とオフセットは一切変えず、濃度だけ2倍。同時に scale(1.025) で浮かせる。

確度 **1サイトのみ**（ステイハングリー）／判定 **流用可**

```css
.sw-Services .services-Item .link{height:100%;min-height:8.4375vw;padding:2.3958333333vw 2.6041666667vw 1.6666666667vw 3.125vw;display:block;background:#fff;-webkit-box-shadow:.7291666667vw .7291666667vw 1.5625vw rgba(73,57,17,.15);box-shadow:.7291666667vw .7291666667vw 1.5625vw rgba(73,57,17,.15);position:relative} .sw-Services .services-Item .link:hover{-webkit-transform:scale(1.025);transform:scale(1.025);-webkit-box-shadow:.7291666667vw .7291666667vw 1.5625vw rgba(73,57,17,.3);box-shadow:.7291666667vw .7291666667vw 1.5625vw rgba(73,57,17,.3)}
```

1920px換算で 14px 14px 30px の斜め影（右下方向）。影色が rgba(73,57,17) というブランドのゴールド寄りの茶で、グレーの影を使っていない。ホバーでぼかしを変えないのでGPU上で色の補間だけになり、ちらつかない。拡大は1.025（2.5%）と極小。

#### 枠線は「背景と同色」ではなく「alpha 0」で置く。しかもカード本体ではなく100%×100%の ::after に載せ、border-color だけを .4s で遷移させる。ホバー後の色も不透明ではなく alpha .4。

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
.p-home-message .p-home-message__list .p-home-message__item::after{content:"";display:block;position:absolute;top:0;left:0;width:100%;height:100%;z-index:3;border:calc(2 * var(--vw-scale)) solid rgba(26,126,58,0);border-radius:inherit;-webkit-transition:border-color .4s;transition:border-color .4s} .p-home-message .p-home-message__list .p-home-message__item:hover::after{border-color:rgba(26,126,58,.4)}
```

これがイロコト系で最も再利用価値の高い実装。(1)疑似要素なので border を足してもレイアウトが1pxも動かない。(2)border-radius:inherit でカードの角丸に自動追従する（値の二重管理が消える）。(3)遷移は border-color のみなので border-width のアニメが走らない。(4)ホバー時も alpha .4 止まりで、枠が主役に出てこない。影のあるカードにはこれを被せるだけでホバーが成立する。

#### 連番の実装は2流派あり、互いに正反対。ステイハングリーは140pxの袋文字（color:transparent + -webkit-text-stroke:1px）を opacity .3 でカード右上に置く装飾扱い。

確度 **1サイトのみ**（ステイハングリー）／判定 **考え方だけ**

```css
.sw-Services .services-Item{position:relative;counter-increment:number} .sw-Services .services-Item .link::after{content:"0" counter(number);position:absolute;top:.2604166667vw;right:.46875vw;font-family:Oswald,sans-serif;font-weight:600;font-size:14rem;color:transparent;-webkit-text-stroke:1px #cea948;opacity:.3}
```

font-size:14rem = 140px。塗りを transparent にして1pxのストロークだけ残す袋文字。CSSカウンタ（counter-increment:number）で番号を自動採番しているのは7サイト中ここだけ。位置が左上ではなく右上（top:5px / right:9px）で、だからカード本文の padding-left が padding-right より広い（下記参照）。ただし -webkit-text-stroke は非標準プロパティで、効かない環境では color:transparent だけが残り数字が完全に消える。標準の paint-order や SVG へのフォールバックを足して使うべき。

#### カミナリゲームスの連番は逆に極小。Oswaldでラベル部14px・数字部22px、中央揃え、直下に幅20px高さ1pxの罫線を :before で引く。装飾ではなく情報としての番号。

確度 **1サイトのみ**（カミナリゲームス）／判定 **流用可**

```css
.idx-Services_Inner .services-item_inner .number { position: relative; display: block; font-family: "Oswald", sans-serif; text-align: center; letter-spacing: 0.06em; } font-size: 0.7291666667vw; .idx-Services_Inner .services-item_inner .number:before { content: ""; position: absolute; bottom: 0; left: 50%; -webkit-transform: translateX(-50%); transform: translateX(-50%); height: 1px; background: #000; } width: 1.0416666667vw; font-size: 1.1458333333vw;
```

1920px換算で .number が14px、中の span が22px、罫線が幅20px。つまり「No.」のような小ラベルを14px、数字を22pxで組み、下に20pxの短い罫を引く。番号はカード上端中央で、タイトルの上に積む。ステイハングリーの140px袋文字と同じOswaldを使いながら、サイズを10分の1にして意味を反転させている。番号を大きくするか小さくするかは影ではなくサイト全体のトーンで決める、という判断材料になる。

#### WIT STUDIOの連番はテキストでも擬似要素でもなく、カード左上に絶対配置した固定サイズの箱（80×63px / SP 100×78px）。しかも top:-1px でカード外に1pxはみ出させている。

確度 **1サイトのみ**（WIT STUDIO）／判定 **考え方だけ**

```css
.p-home-dna .p-home-dna__list .p-home-dna__item .p-home-dna__number{position:absolute;top:calc(-1 * var(--vw-scale));left:0;z-index:2} .p-home-dna .p-home-dna__list .p-home-dna__item .p-home-dna__number{width:calc(80 * var(--vw-scale));height:calc(63 * var(--vw-scale))} .p-home-support .p-home-support__list .p-home-support__item .p-home-support__number{position:absolute;top:0;left:0;z-index:2;overflow:hidden;border-top-left-radius:calc(20 * var(--vw-scale))}
```

数字をフォントで組まず画像/SVGの箱として扱っている。注目すべきは2点。(1)top:-1px の1pxはみ出し＝カード上端との継ぎ目（アンチエイリアスの白い線）を潰すための常套手段。(2)support側は overflow:hidden + border-top-left-radius:20px で、番号バッジをカードの角丸にクリップしている。角に貼る装飾はカードと同じ角丸でクリップする、という規則。

#### コーナー装飾は1枚のSVGを scale(-1,1) / scale(1,-1) / rotate(180deg) で使い回し、4隅または対角2隅を作る。装飾レイヤーは常に position:absolute の 100%×100% + pointer-events:none。

確度 **1サイトのみ**（カミナリゲームス）／判定 **流用可**

```css
.deco-edge { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; } .deco-edge span:before, .deco-edge span:after { content: ""; position: absolute; width: 24px; height: 24px; background: url("data:image/svg+xml;charset=utf8,...") no-repeat top center/contain; } .deco-edge span:before { top: 0; left: -1px; } .deco-edge span:after { top: 0; right: -1px; -webkit-transform: scale(-1, 1); transform: scale(-1, 1); } .deco-edge span.bottom { bottom: 0; -webkit-transform: scale(1, -1); transform: scale(1, -1); }
```

24×24pxの凹んだ四分円SVG1枚だけで4隅を作る。.top/.bottom の span を2つ置き、各spanの :before が左、:after が右（scale(-1,1)で反転）、.bottom 側は scale(1,-1) で上下反転。素材は1個、CSSのtransformで4パターン。left:-1px / right:-1px の1pxはみ出しも継ぎ目潰し。pointer-events:none を忘れるとカード全体が押せなくなるので必須。

#### 二重枠は「外枠をラッパーの :before に、内枠を _Inner の border に」分けて実装する。枠の間隔はラッパーの padding（1920px換算10px）がそのまま決める。

確度 **1サイトのみ**（カミナリゲームス）／判定 **流用可**

```css
.sw-Box { position: relative; overflow: hidden; } .sw-Box:before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 1px solid #000; pointer-events: none; } .sw-Box_Inner { width: 100%; height: 100%; background: #fff; border: 1px solid #000; } padding: 0.5208333333vw;
```

外枠を要素自身の border にせず :before に載せる理由は、.sw-Box が overflow:hidden を持つため枠線を中身より上に出す必要があるから。1px + 10px空き + 1px の構成。同じ型が .idx-Services_Inner .services-item（padding 0.5208333333vw = 10px、:before に border:1px solid #000）でも使われていて、カード側と汎用部品側で同一の作法。

#### タグ/チップは角丸なし・padding:6px の完全均一・背景は真っ黒 #0f0f0f・13px白文字。並べる間隔は gap ではなく「親に負マージン、子に正マージン」の10px。

確度 **1サイトのみ**（NOKID）／判定 **流用可**

```css
.sw-WorksArchive_Category{ margin: 20px 0 -10px -10px; display: flex; flex-wrap: wrap; position: relative; z-index: 1; pointer-events: none; } .sw-WorksArchive_Category li{ margin: 0 0 10px 10px; } .sw-WorksArchive_Category li a{ padding: 6px; display: inline-block; background: #0f0f0f; font-weight: 500; font-size: 1.3rem; color: #fff; letter-spacing: .06em; pointer-events: all; }
```

一般的な「薄いグレーのピル型、padding 4px 12px」とは正反対の、角のある黒い小箱。padding が上下左右とも6pxで、横方向を広げていないのがポイント（文字詰めが .06em あるので横が窮屈に見えない）。最重要は pointer-events の使い分け：タグ列はカードリンクの上（z-index:1）に重なるので、親を pointer-events:none にしてカードのクリックを通し、タグの a だけ pointer-events:all で拾い直している。これを知らないとカード内タグは必ずどちらかのクリックを壊す。

#### 仕様表・概要表は table を使わず dl/dt/dd。2列グリッドで row-gap は0、各 dl に border-top のみ。2列なので最終行は2要素あり、:last-child に加えて :nth-last-child(2) にも border-bottom を足している。

確度 **1サイトのみ**（NOKID）／判定 **流用可**

```css
.sw-DefinitionList{ max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat( 2, 1fr ); column-gap: 20px; grid-column-gap: 20px; row-gap: 0px; grid-row-gap: 0px; } .sw-DefinitionList dl{ padding: 20px 0; border-top: 1px solid #C4C4C4; display: flex; font-weight: 500; font-size: 1.8rem; line-height: 180%; letter-spacing: .08em; } .sw-DefinitionList dl:last-child{ border-bottom: 1px solid #C4C4C4; } @media screen and (min-width:1025px) { .sw-DefinitionList dl:nth-last-child(2){ border-bottom: 1px solid #C4C4C4; } } .sw-DefinitionList dl dt{ min-width: 187px; font-weight: 7 …
```

罫線を border-top だけにして最後だけ border-bottom を足す、は定石だが「2列グリッドでは最後の行に2件あるので nth-last-child(2) も必要」は実装しないと気付けない。PC時のみ（min-width:1025px）に限定しているのも正しい（SP時は1列なので last-child だけで足りる）。dt は grid のトラックではなく flex 内の min-width:187px + flex-shrink:0。187pxという非キリ番は実コンテンツ（「お問い合わせ先」等）の実寸合わせ。

#### パンくずの区切りは「>」「/」のような文字ではなく、幅6px・高さ1pxの横線を :before で描く。:nth-child(n+2) で先頭だけ除外。狭い画面では折り返さず overflow-x:auto で横スクロールさせる。

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
.sub-Breadcrumb{border-top:1px solid rgba(32,32,32,.1);background:#fff;overflow-x:auto} .sub-Breadcrumb_Item{font-size:1.2rem;padding-right:34px;position:relative;white-space:nowrap} .sub-Breadcrumb_Item:nth-child(n+2)::before{content:"";display:block;position:absolute;height:1px;width:6px;background-color:rgba(32,32,32,.5);left:-20px;top:6px} .sub-Breadcrumb_List{width:clamp(10px,90%,1200px)}
```

区切りを矩形で描くとフォント依存の位置ズレ（「>」の重心が書体で変わる）が消える。top:6px で12pxテキストの視覚中心に合わせてある。色は本文色 #202020 の alpha .5 で、専用のグレーを定義していない。white-space:nowrap + overflow-x:auto の組み合わせはパンくずが2行になって高さが暴れるのを防ぐ常套手段で、下層ページのレイアウトを安定させる。

#### NOKIDのページネーションには数字が無い。中央に28pxの「4分割マスSVG」アイコン（=一覧へ戻る）を置き、prev/next を left:-114px / right:-114px に絶対配置した3点構成。

確度 **1サイトのみ**（NOKID）／判定 **考え方だけ**

```css
.sw-Pagenavi ul{ display: inline-flex; justify-content: center; position: relative; } .sw-Pagenavi .index{ width: 28px; height: 28px; } .sw-Pagenavi .prev{ left: -114px; } .sw-Pagenavi .next{ right: -114px; } .sw-Pagenavi .prev a, .sw-Pagenavi .next a{ padding-bottom: 21px; font-family: 'Jost', 'Noto Sans JP', sans-serif; font-weight: 700; font-size: 2.0rem; color: #0f0f0f; position: relative; display: inline-block; }
```

記事詳細ページ用の「前・一覧・次」ナビ。中央アイコンを inline-flex のフローに置き、prev/next だけ absolute で外に飛ばすので、中央アイコンが常に真ん中に来る（prev/nextの文字長に左右されない）。prev/next は Jost 700 の20pxで下に2pxの罫（::after）。ただし -114px という固定値なので、親に十分な幅がないと画面外に出る。max-width の狭いコンテナで使うなら vw 化が必要。

#### 数字つきページネーション（エニーキャリア）は current だけ塗りつぶし、通常ページのホバーは枠線をブランド色の alpha .3 で出す。塗らずに薄い枠だけ。

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
.sw-Pagenavi .wp-pagenavi .current{background:#35b1c1;border:1px solid #35b1c1;color:#fff} @media (any-hover:hover){.sw-Pagenavi .wp-pagenavi .page:hover{border:1px solid rgba(53,177,193,.3);color:#35b1c1} .sw-Pagenavi .wp-pagenavi .current:hover{pointer-events:none}
```

ホバー時に背景を塗らず border alpha .3 + 文字色だけ変える。current と hover が視覚的に競合しないので「今どこか」が見失われない。current:hover{pointer-events:none} で現在ページを押せなくしているのも地味に効く（無駄な再読込を防ぐ）。

#### 矢印つきボタンのホバーは「丸が縮んで、中の矢印が拡がる」逆方向のペア。丸 scale(.85) に対して中の矢印 ::after は scale(1.175)。

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
.c-btn a:hover > span{-webkit-transform:scale(.85);transform:scale(.85)} .c-btn a:hover > span::after{-webkit-transform:scale(1.175);transform:scale(1.175)} .c-btn a:hover.c-btn__arrow--left > span::after{-webkit-transform:scale(-1.175,1.175);transform:scale(-1.175,1.175)}
```

0.85 × 1.175 ≒ 1.0。つまり丸を15%縮めた分だけ矢印を拡大して、矢印の見た目のサイズを据え置いたまま丸だけが引き締まる。素朴に両方を scale すると矢印も一緒に小さくなって弱々しくなる。左向きボタンは scale(-1.175,1.175) で反転と拡大を同時に当てている（親の scaleX(-1) に上書きされないため）。この「子で逆数をかけて打ち消す」発想は他の入れ子装飾にもそのまま使える。

#### 画像のはめ方を内容で使い分ける。実績＝object-fit:cover で全面トリミング。ブログサムネ＝contain（max-width/max-height 100%）で中央寄せし、余白にブランドのピンク #fae1e4 を敷く。

確度 **1サイトのみ**（イロコト）／判定 **流用可**

```css
.index-Blog_List_Item .img{position:relative;background:#fae1e4;overflow:hidden;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center} .index-Blog_List_Item .img::after{padding-top:56.25%;display:block;content:""} .index-Blog_List_Item .img img{width:auto!important;height:auto!important;max-width:100%;max-height:100%;position:absolute;-webkit-transition:transform .2s;top:0;right:0;left:0;margin:0 auto}
```

イロコト自社サイト内で2つの画像ポリシーが共存している。入稿画像の比率がバラバラになるブログ側は cover で切ると文字が切れるので contain にし、生じる上下左右の帯をブランドのピンクで埋める。グレーのプレースホルダにしないのが要点で、比率がバラバラでも一覧が1枚の絵に見える。比率は ::before ではなく ::after の padding-top:56.25% で確保。

#### カードの内側余白は上下左右で揃えない。ステイハングリーのサービスカードは1920px換算で上46px / 右50px / 下32px / 左60px。右上に大きな連番が入るので左を厚く、下を薄くしている。

確度 **1サイトのみ**（ステイハングリー）／判定 **考え方だけ**

```css
.sw-Services .services-Item .link{height:100%;min-height:8.4375vw;padding:2.3958333333vw 2.6041666667vw 1.6666666667vw 3.125vw;display:block;background:#fff;box-shadow:.7291666667vw .7291666667vw 1.5625vw rgba(73,57,17,.15);position:relative} @media print,screen and (max-width:1024px){.sw-Services .services-Item .link{min-height:20.8333333333vw;padding:5.46875vw 0 5.46875vw 6.5104166667vw;
```

左60px > 右50px、上46px > 下32px。左を厚くするのは本文の視覚的な開始位置を揃えるため、下を薄くするのは min-height:8.4375vw(=162px) で高さを揃えているので下は余りが出る前提だから。SP時は padding-right が 0 になる（カード内が横並びで右端に矢印が付くため）。「カードの padding は4辺同値」という既定を疑う実例。ただし真似るなら中身の構成を同じにしないと破綻する。

#### カード内の注記パネルは枠も角丸も付けず、ブランド色をほぼ白まで薄めた背景（#fafff8）+ ブランド色の文字で作る。min-height でカード間の高さを揃える。

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
.p-home-support .p-home-support__list .p-home-support__item .p-home-support__detail{background:#fafff8;color:#1a7e3a;letter-spacing:.06em;line-height:1.8;margin:calc(20 * var(--vw-scale)) 0 0} .p-home-support .p-home-support__list .p-home-support__item .p-home-support__detail{padding:calc(20 * var(--vw-scale));min-height:calc(98 * var(--vw-scale));font-size:calc(16 * var(--vw-scale))}
```

ブランドグリーン #1a7e3a を背景側では #fafff8 まで薄めている（グレーを使わない）。20px角丸のカードの中に角丸なしの四角いパネルを入れているのも意図的で、入れ子の角丸が二重に見えるのを避けている。min-height:98px は2列並びのカードで注記の行数が違っても下端が揃うようにするためで、grid の align-items ではなく中身の min-height で解決している。

#### 引用は左の縦バーも引用符も使わない。グレーの面（#f5f5f5）+ padding 20px 40px + line-height 2 + 角丸6pxのパネル。リセット側で引用符を明示的に殺している。

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
.acf_content blockquote,.post-type-post blockquote,.sw-Txtarea blockquote{background:#f5f5f5;padding:20px 40px;line-height:2;border-radius:6px} blockquote,q{quotes:none} blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}
```

左右の padding が上下の2倍（20px / 40px）で、横に深く入れることで引用らしさを出している。line-height:2 は本文より明らかに緩い。角丸6pxはこのサイトのカード角丸と同値で、引用も「カード」の一種として扱われている。縦バーや「”」を足さなくても成立する実例。

#### 縦の装飾バーはブランド色ではなく本文色（#181818）で引き、太さは max() で1px未満に潰れないよう床を張る。PC 4px / SP 10px、テキストとの間隔は PC 24px。

確度 **1サイトのみ**（ENILIS）／判定 **流用可**

```css
.index-Hero .hero-Content .hero-Introduction .introduction-Text{padding-left:1.25vw;font-weight:500;font-size:1.6rem;line-height:240%;letter-spacing:.08em;color:#181818;border-left:max(.2083333333vw,1px) solid #181818} @media print,screen and (max-width:1024px){.index-Hero .hero-Content .hero-Introduction .introduction-Text{padding-left:3.125vw;font-size:2.4rem;line-height:200%;border-left:max(.5208333333vw,1px) solid #181818} .index-Service .service-Layout .service-Content .hook{margin-top:1.5625vw;padding-left:1.25vw;font-weight:900;font-size:1.8rem;line-height:200%;letter-spacing:.08em;colo …
```

vw指定の線幅は画面が狭いと0.5pxなどになって端末依存でちらつく／消える。max(.2083333333vw,1px) で必ず1px以上を保証している。これは7サイト中 max() を使っている唯一の箇所（4件すべてこの用途）で、vw設計で細線を引くときの必須イディオム。バー色をアクセントにせず本文色にしているので、色の管理対象が増えない。

#### イロコトの実績カードはホバーで、ブランドピンク alpha .7 のカバーを上から top:-100% → 0 でスライドさせる。中には実線リング（box-shadow:0 0 0 2px #fff）と破線リング（border:2px dashed #fff）の二重円があり、ホバーで実線リングが消え破線リングが6秒で回りだす。

確度 **1サイトのみ**（イロコト）／判定 **考え方だけ**

```css
.index-Works_List_Item .img .cover{position:absolute;left:0;width:100%;height:100%;background:rgba(240,155,165,.7);text-align:center;z-index:5;-webkit-transition:top .3s;transition:top .3s} .index-Works_List_Item .img .cover{top:-100%} .index-Works_List_Item .img .cover a{width:126px;height:126px;margin:0 25px;padding:23px 0 0;font-size:1.4rem;line-height:126px;border-radius:65px;box-shadow:0 0 0 2px #fff} .index-Works_List_Item .img .cover a:hover{box-shadow:0 0 0 2px transparent} .index-Works_List_Item .img .cover a:after{content:"";position:absolute;top:-2px;left:-2px;width:126px;height:126 …
```

考え方は3点流用できる。(1)カバーはフェードではなく上からスライド（transition:top .3s）で、覆う方向に意味を持たせている。(2)リングを box-shadow の spread（0 0 0 2px）で作ると要素サイズに影響しないので、border で作る破線リングと同心円で重ねられる。(3)ホバーで実線リングを transparent にして破線リングだけを回す＝「静→動」の切り替え。ただし実装には粗があり（下記 pitfalls 参照）、そのままコピーはしない。

### ボタン・リンク・フォーム

#### 矢印の実装が4通りあり、統一されていない。border三角 / clip-path三角 / data-URI背景 / インラインSVG+fill

確度 **7サイト全部**（イロコト・カミナリゲームス・ステイハングリー・ENILIS・NOKID）／判定 **考え方だけ**

```css
.sw-Btn a:after{content:"";width:0;height:0;border-style:solid;border-width:5px 0 5px 12px;border-color:transparent transparent transparent #fff;position:absolute;top:50%;right:25px;-webkit-transform:translateY(-50%);transform:translateY(-50%)} .sw-Button:before { right: 30px; width: 20px; height: 6px; background-color: #FFFFFF; -webkit-clip-path: polygon(0 0, 0% 100%, 100% 50%); clip-path: polygon(0 0, 0% 100%, 100% 50%); } .sw-TextAndBtn .textAndBtn-Content .textAndBtn-Btn .svg-Arrow{width:.7291666667vw;height:.4166666667vw;margin:auto 0;position:absolute;top:0;bottom:0;right:37.8%;fill:#111 …
```

採用すべきは clip-path 三角（カミナリ）かインラインSVG+fill（ステイハングリー）。理由: border三角（イロコト）は幅高さが border-width に化けるのでサイズ変更が直感的でなく、色も border-color の4値指定になる。data-URI背景（ENILIS）は色替えに画像差し替えが必要で transition が効かない。clip-path なら `background-color` 1行で色が変わりトランジションも効く。SVG+fill なら `fill` を transition できる。1サイト内では必ず1手法に統一されている点は見習うべき

#### リセットで全フォーム部品から outline を剥がし、どのサイトも :focus-visible を書き直していない。キーボードフォーカスが見えない

確度 **7サイト全部**（エニーキャリア・ENILIS・イロコト・ステイハングリー・WIT STUDIO・カミナリゲームス・NOKID）／判定 **真似しない**

```css
button,input,optgroup,select,textarea{-webkit-appearance:none;-moz-appearance:none;appearance:none;vertical-align:middle;color:inherit;font:inherit;background:0 0;padding:0;margin:0;outline:0;border-radius:0;text-align:inherit} focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText} button{background-color:transparent;border:none;cursor:pointer;outline:0;padding:0;-webkit-appearance:none;-moz-appearance:none;appearance:none} [contenteditable]{outline:0}
```

7サイト全部で `outline:0` がリセットに入っている。そして :focus / :focus-visible の自作スタイルは全1.3MB中で**ゼロ件**。`:focus-visible{outline:3px solid #0bf}` が ENILIS に8件あるが、これは swiper のライブラリCSS（enilis.lib.css）で自前実装ではない。`:-moz-focusring{outline:1px dotted ButtonText}` は normalize.css が Firefox 用に戻しているだけで、Chrome/Safari では一切フォーカスリングが出ない。Tabキーで操作すると今どこにいるか分からない。真似してはいけない。最低限 `:focus-visible{outline:2px solid currentColor;outline-offset:2px}` を書き足す

#### :active が7サイト・14ファイル・1.3MB中で1件も無い。-webkit-tap-highlight-color も0件

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **真似しない**

```css
button,input,optgroup,select,textarea{-webkit-appearance:none;-moz-appearance:none;appearance:none;vertical-align:middle;color:inherit;font:inherit;background:0 0;padding:0;margin:0;outline:0;border-radius:0;text-align:inherit}
```

`grep -o ':active' *.css` が全ファイルで0件。これが深刻なのは、ホバーを全部 @media (any-hover:hover) で囲っているから。つまりタッチ端末ではホバーも押下フィードバックも両方存在しない。指で押した瞬間に画面が何も変わらず、遷移が始まるまで押せたか分からない。スマホ流入が主ならここは必ず埋める。`:active{transform:scale(.97)}` を any-hover の外に1行書くだけで解決する。彼らの設計の最大の穴

#### NOKIDだけ (hover:hover) を使い、他6サイトは (any-hover:hover)。技術的には少数派のNOKIDが正しい

確度 **7サイト全部**（NOKID・イロコト・ステイハングリー・ENILIS・WIT STUDIO・エニーキャリア・カミナリゲームス）／判定 **考え方だけ**

```css
@media (hover: hover) { .btn-box a{ transition: opacity .3s; } .btn-box a:hover{ opacity: .6; } } @media (any-hover:hover){.sw-Btn a{-webkit-transition:.3s;transition:.3s} @media print and (any-hover:hover),screen and (any-hover:hover) and (min-width:1025px){
```

件数実測: any-hover は irokoto 4 / anycareer 23 / stayhungry 36 / kaminari 17 / enilis 36 / witstudio 33、NOKIDは any-hover 0 件で (hover:hover) 24 件。`any-hover` は『いずれかの入力機器がホバー可能なら真』なので、ペン入力を持つAndroid端末やタッチ対応ノートPCでも真になる。『主要な入力機器』で判定する `hover:hover` の方が意図に合う。多数決で any-hover を選ぶのではなく、`@media (hover:hover) and (pointer:fine)` が現時点のベスト。なお anycareer/stayhungry/witstudio は `print and (any-hover:hover),screen and (any-hover:hover) and (min-width:1025px)` と画面幅条件まで重ねており、ここまでやるなら最初から hover:hover でよい

#### ラベルを中央に置く部品は、下パディングを上より1〜2px多く取る。和文の視覚重心補正を「下を増やして文字を1px上げる」方向でやっている

確度 **ほぼ全サイト**（エニーキャリア・イロコト・NOKID・ENILIS）／判定 **流用可**

```css
.sw-Btn{display:inline-block;min-width:300px;background:#fff;border:1px solid #dedede;border-radius:200px;font-weight:700;font-size:1.6rem;padding:20px 40px 22px;text-align:center} .st-Footer_Bottom .access a{font-size:12px;display:inline-block;border:1px solid #fff;padding:2px 6px 4px} .sw-Heading_Content .jp .jp-content{ padding: 5px 12px 6px; .comment-Modal .comment-Modal_Content .comment-Content .text dl .role{margin-top:4px;padding:6px 16px 8px;
```

padding の3値指定（上/左右/下）は全体で16件、うち小部品のものはほぼ全部が「下＞上」。差は1〜2px、パディング量の約10%。上下を同値にすると和文は沈んで見えるので、これは必ず入れる。モバイルでも維持されている（4.1666666667vw / 4.6875vw = 32px / 36px @768px）ので、レスポンシブでも補正を捨てていない

#### transition 宣言そのものを @media (any-hover:hover) の中に書く。:hover だけを囲うのではない

確度 **ほぼ全サイト**（イロコト・WIT STUDIO・ENILIS・ステイハングリー）／判定 **流用可**

```css
@media (any-hover:hover){.sw-Btn a{-webkit-transition:.3s;transition:.3s}.sw-Btn a:after{-webkit-transition:.3s;transition:.3s}.sw-Btn a:hover{-webkit-transform:scale(1.03);transform:scale(1.03)}.sw-Btn a:hover:after{-webkit-transform:translate(6px,-50%) rotateX(180deg);transform:tran @media (any-hover:hover){.c-btn a{-webkit-transition:background .4s
```

これが一番真似する価値がある書き方。transition をブロックの外に出すとタッチ端末でもトランジションが生き、タップ後に :hover 相当の状態が張り付いてだらだらアニメーションする。宣言ごと囲えばタッチ端末では transition プロパティ自体が存在しないので、その事故が起きない。6サイトが any-hover を使用（irokoto 4箇所・anycareer 23・stayhungry 36・kaminari 17・enilis 36・witstudio 33）

#### 矢印アセットは1方向だけ作り、「戻る」は scale(-1,1) で反転して使い回す。4サイト共通の作法

確度 **ほぼ全サイト**（ステイハングリー・カミナリゲームス・WIT STUDIO・ENILIS）／判定 **流用可**

```css
.sw-TextAndBtn.sw-TextAndBtn-back .textAndBtn-Content .textAndBtn-Btn{-webkit-transform:scale(-1,1);transform:scale(-1,1)} .sw-Button.back:before { right: auto; -webkit-transform: translateY(-50%) scale(-1, 1); transform: translateY(-50%) scale(-1, 1); } .c-btn a.c-btn__arrow.c-btn__arrow--left > span::after{-webkit-transform:scaleX(-1);transform:scaleX(-1)} .c-btn a:hover.c-btn__arrow--left > span::after{-webkit-transform:scale(-1.175,1.175);transform:scale(-1.175,1.175)}
```

左向き矢印のSVGを別に作らない。あわせて並び順は `flex-direction:row-reverse` で入れ替える。ただし落とし穴があって、WIT STUDIO の `scale(-1.175,1.175)` が示す通り、ホバーで transform を上書きすると反転が外れるのでホバー側にもマイナス符号を書き直す必要がある。4サイトで確認、最も再現性の高い型

#### 矢印の移動量は10px以下。カミナリは right:30px→20px、イロコトは translate(6px)

確度 **ほぼ全サイト**（カミナリゲームス・イロコト・エニーキャリア）／判定 **流用可**

```css
.sw-Button:before { right: 30px; width: 20px; height: 6px; .sw-Button:hover:before { right: 20px; } .sw-Btn a:hover:after{-webkit-transform:translate(6px,-50%) rotateX(180deg);transform:translate(6px,-50%) rotateX(180deg)} .st-Header_Menu_Anchor:hover .arw-w{fill:#35b1c1;-webkit-transform:translate(3px,-3px);transform:translate(3px,-3px)} .st-Footer_Menu_Anchor:hover .arw-w{opacity:.7}
```

実測で 10px（カミナリ）、6px（イロコト）、3px（エニーキャリアの外部リンク斜め矢印は translate(3px,-3px)）。10pxを超えるものは1つも無い。外部リンクの斜め矢印だけ右上方向に3px、という使い分けも一貫している。移動量を20px以上にすると途端に安っぽくなるので、この上限は守る価値がある

#### ホバーの減光は opacity .6 が最頻値。.8 ではなく .6 まで落とす

確度 **ほぼ全サイト**（NOKID・ENILIS・ステイハングリー・エニーキャリア・イロコト）／判定 **流用可**

```css
.hover:hover{opacity:.75;cursor:pointer} .hover:hover{opacity:.7;cursor:pointer} .btn-box a:hover{ opacity: .6; } .sw-Form .form-Privacy a:hover{opacity:.6;text-decoration:underline} .st-Footer_Menu_Anchor:hover{opacity:.7} .st-Footer_Menu_Sub_Item:hover{opacity:.3}
```

ホバー時 opacity 値の全件集計: .6 が17件、.7 が7件、.8 が4件、.75 が3件、.9 が2件、.3 が2件、.5 が1件。一般的な .8 は少数派。既に薄い補助テキスト（opacity .5 のフッター小項目）はさらに .3 まで落としている。『元の濃さに対する相対的な落差』ではなく『絶対値で .6』という運用。なお `.hover` という汎用ユーティリティクラスがイロコト(.7)とエニーキャリア(.75)に存在する

#### リセットで select の appearance を剥がし、ネイティブの▼を戻していない。ドロップダウンに見えない

確度 **ほぼ全サイト**（エニーキャリア・ENILIS・ステイハングリー・WIT STUDIO・イロコト）／判定 **真似しない**

```css
button,input,optgroup,select,textarea{-webkit-appearance:none;-moz-appearance:none;appearance:none;vertical-align:middle;color:inherit;font:inherit;background:0 0;padding:0;margin:0;outline:0;border-radius:0;text-align:inherit} select::-ms-expand{display:none} button,select{text-transform:none}
```

`appearance:none` + `select::-ms-expand{display:none}` で矢印を消しているのに、背景画像や擬似要素で矢印を足している select のルールが全14ファイル中1件も見つからない（`grep 'select[^{};]{0,40}\{[^}]*background[^}]*\}'` の結果はリセット行と誤マッチのみ）。select が単なる四角いテキストボックスに見える。NOKIDだけはこのリセットを持たないのでネイティブ矢印が残っている。select を使うなら、消した分の矢印は自分で足す

#### タップターゲットの下限を保証する min-height が全7サイトで一度も使われていない。vw換算の結果、375px幅で44pxを割る部品が複数ある

確度 **ほぼ全サイト**（エニーキャリア・NOKID・WIT STUDIO・カミナリゲームス）／判定 **真似しない**

```css
.sw-Link .arw{width:9.1145833333vw;height:9.1145833333vw} .sw-ViewMore_Icon{ width: 9.38vw; height: 9.38vw; margin-right: 2.21vw; } .c-btn a{min-width:calc(302 * var(--vw-scale));height:calc(86 * var(--vw-scale));font-size:calc(26 * var(--vw-scale))} :root{--vw-base:768;--vw-scale:calc(100vw / var(--vw-base))} .sw-Button { width: 57.2916666667vw; height: 11.71875vw; font-size: 3.90625vw; }
```

min-height の全件集計は `min-height:1px`×9（画像潰れ防止）、`min-height:100%`×5、あとはライブラリ由来の46px/100pxと個別レイアウト値のみ。自前のタップ下限はゼロ。375px幅での実測換算: エニーキャリアの矢印円 9.1145833333vw=34.2px、NOKIDの菱形アイコン 9.38vw=35.2px、WIT STUDIOのボタン高 86/768×375=42.0px、カミナリのボタン高 11.71875vw=43.9px。いずれも44px未満。ENILIS/ステイハングリーの円 13.0208333333vw=48.8px とイロコトのボタン 13.0208333333vw=48.8px だけが合格。vw基準の設計は『768pxでは十分な大きさ』でも『375pxでは縮む』ことを忘れている。`min-height:44px` を1行足すだけで防げる

#### CTAは全部 <a>。<button> 要素はトップページ7枚で合計5個しかない

確度 **ほぼ全サイト**（イロコト・WIT STUDIO・エニーキャリア・ステイハングリー・NOKID）／判定 **考え方だけ**

```css
.sw-Btn a{width:100%;height:100%;padding:0 25px 0 0;text-align:center;font-size:1.6rem;font-weight:700;line-height:60px;letter-spacing:.2em;color:#fff;border-radius:78px;display:block;background:#ff777f;position:relative} .c-btn a{position:relative;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center
```

HTML実測: `<button` の数は anycareer 0 / irokoto 0 / nokid 0 / stayhungry 0 / witstudio 0 / enilis 2 / kaminari 3。ボタンのセレクタも `.sw-Btn a` `.c-btn a` のように <a> 前提で書かれている。ブローシャサイトなら妥当だが、そのままフォームに持ち込むと送信ボタンに <a> を使う誘惑が生まれる。スタイルは `.btn` クラス側に書いて <a> と <button> の両方に当たるようにしておくこと。<button> は line-height や font の継承が <a> と違うので、`font:inherit` と `line-height` の明示が必要

#### ピルの角丸は height より大きい適当な大きな px 値を直書きする。9999px や 50% は使わない

確度 **ほぼ全サイト**（エニーキャリア・イロコト・WIT STUDIO・ENILIS）／判定 **考え方だけ**

```css
.sw-Btn{display:inline-block;min-width:300px;background:#fff;border:1px solid #dedede;border-radius:200px;font-weight:700;font-size:1.6rem;padding:20px 40px 22px;text-align:center} .sw-Btn a{width:100%;height:100%;padding:0 25px 0 0;text-align:center;font-size:1.6rem;font-weight:700;line-height:60px;letter-spacing:.2em;color:#fff;border-radius:78px;display:block;background:#ff777f;position:relative} .index-Works_List_Item .img .cover a{width:126px;height:126px;margin:0 25px;padding:23px 0 0;font-size:1.4rem;line-height:126px;border-radius:65px;box-shadow:0 0 0 2px #fff} border-radius:calc(100  …
```

実測値は 200px / 100px / 78px / 70px / 65px / 5.2083333333vw(=50px) / 13.0208333333vw。どれも要素高さ（58〜86px）より大きいので結果はピルになる。イロコトの78pxは高さ60pxに対して中途半端で、意味のある数字ではない。カード類の角丸は `6px` が18件 + `.78125vw`（=6px@768）が15件で圧倒的な house value。真似するなら角丸は『カード=6px、ピル=9999px』の2値だけに決めてトークン化する方がよい。ENILISが `border-radius:5.2083333333vw` とピルをvwで書いているのは、角丸までカンバス比例にする一貫性の表れだが実利は薄い

#### 入力欄は逆。textarea / input は上パディングを下より2px多く取る。文字が上端から始まる部品は補正の向きが逆になる

確度 **複数サイト**（ENILIS・ステイハングリー）／判定 **流用可**

```css
.sw-Form .form-Item dd input[type=url],.sw-Form .form-Item dd textarea{padding:2.8645833333vw 2.6041666667vw 2.6041666667vw;font-size:2.4rem}
```

2.8645833333vw / 2.6041666667vw = 22px / 20px（768px基準）。中央寄せボタンは下を増やし、左上寄せの入力欄は上を増やす。「和文だから下を増やす」と機械的に覚えると入力欄で逆に崩れる。基準は『文字の塊が視覚的に中央に来るか』であって、プロパティではない

#### 円形アイコンボタンの寸法が2サイトで完全一致。PC 40px / SP 100px（768px基準）、border 1px、ホバーで円を塗りつぶして矢印を白に反転

確度 **複数サイト**（ENILIS・ステイハングリー）／判定 **流用可**

```css
.sw-CircleBtn{width:4.1666666667vw;height:4.1666666667vw;margin:0;position:relative;top:auto;left:auto;right:auto;border-radius:50%;border:1px solid #181818} .sw-CircleBtn{width:13.0208333333vw;height:13.0208333333vw} .sw-TextAndBtn .textAndBtn-Content .textAndBtn-Btn{width:4.1666666667vw;height:4.1666666667vw;margin:0;position:relative;top:auto;left:auto;right:auto;border-radius:50%;border:1px solid #111} .sw-TextAndBtn .textAndBtn-Content .textAndBtn-Btn{width:13.0208333333vw;height:13.0208333333vw} .sw-More .sw-More_Link:hover .sw-CircleBtn{background-color:#181818} .sw-TextAndBtn .textAndB …
```

`margin:0;top:auto;left:auto;right:auto` のリセットまで含めて一字一句同じで、色だけ #181818 / #111 に差し替えてある。社内の使い回し部品そのもの。4.1666666667vw=40px@1920、13.0208333333vw=100px@768。これが彼らの「もっと見る」の標準形。角丸ピルの横長ボタンより、この円＋テキストの方が出現頻度が高い

#### 円の中の矢印は px ではなく円に対する % で置く。1つの宣言でPC/SP両対応になる

確度 **複数サイト**（ENILIS・ステイハングリー）／判定 **流用可**

```css
.sw-CircleBtn::after{content:"";width:30%;height:10%;margin:auto;position:absolute;top:0;bottom:0;left:0;right:0;background:url( .sw-TextAndBtn .textAndBtn-Content .textAndBtn-Btn .svg-Arrow{width:.7291666667vw;height:.4166666667vw;margin:auto 0;position:absolute;top:0;bottom:0;right:37.8%;fill:#111}
```

ENILIS は `width:30%;height:10%` で矢印の寸法自体を%指定（SVGのviewBoxが24x8=3:1なので30%:10%と比率が一致している）。ステイハングリーは寸法はvwだが位置を `right:37.8%` で指定。どちらも円のサイズを変えれば矢印が自動で追従する。ブレークポイントごとに矢印の数値を書き直す手間が消える

#### ホバーで影が「消える」。カードは浮き上がらず、沈んで紙に馴染む

確度 **複数サイト**（エニーキャリア・イロコト）／判定 **流用可**

```css
.index-Services_Contents_List_Item{width:100%;-webkit-box-shadow:0 0 20px 5px #ebebeb;box-shadow:0 0 20px 5px #ebebeb;border-radius:6px;overflow:hidden;position:relative;-webkit-transition:-webkit-box-shadow .3s;transition:-webkit-box-shadow .3s;transition:box @media (any-hover:hover){.index-Services_Contents_List_Item:hover{-webkit-box-shadow:0 0 0 0 #ebebeb;box-shadow:0 0 0 0 #ebebeb} @media (any-hover:hover){.index-Sustainability_Contents_List_Item:hover{-webkit-box-shadow:0 0 0 0 #ebebeb;box-shadow:0 0 0 0 #ebebeb} .index-Works_List_Item .img .cover a{width:126px;height:126px;margin:0 25px …
```

セオリーの真逆。基本状態 `0 0 20px 5px #ebebeb` → ホバー `0 0 0 0`。影の色がほぼ白に近い #ebebeb なので、影があるときは「ふわっと浮いた紙」、ホバーで平たくなる。イロコトの白リング `0 0 0 2px #fff` → `0 0 0 2px transparent` も同じ思想で、装飾を引くことで反応を示す。加算ではなく減算でホバーを作る、という発想がこの会社の芯にある。モバイルは `0 0 2.6041666667vw .6510416667vw #ebebeb`（=20px/5px@768）で換算も揃えてある

#### ボタンの拡大は scale(1.03) まで。1.05〜1.1 は画像とカード専用で、ボタンには使わない

確度 **複数サイト**（イロコト・WIT STUDIO）／判定 **流用可**

```css
.sw-Btn a:hover{-webkit-transform:scale(1.03);transform:scale(1.03)} .st-Banner_Close:hover{-webkit-transform:scale(1.1);transform:scale(1.1)} .c-btn a:hover > span{-webkit-transform:scale(.85);transform:scale(.85)}
```

ホバー時 scale 値の全件集計: 1.1 が10件、1.05 が10件、1.025 が4件、1.175 が2件、1.03 が2件、.95/.9/.85 が各2件。ボタン本体に当たるのは1.03だけで、1.05以上は画像サムネイルとバナー閉じるボタン。横幅280pxのボタンを1.05すると14px伸びて隣とぶつかるので、横長の部品は1.03が上限、というのは物理的に妥当。WIT STUDIO は逆に .85 へ縮める方向を選んでいる

#### 本文エリアのリンクは初期状態で下線あり、ホバーで下線を外す。サイト共通リンクは最初から下線なし

確度 **複数サイト**（エニーキャリア・イロコト）／判定 **流用可**

```css
a{background-color:transparent;text-decoration:none;color:inherit} .acf_content a,.post-type-post a,.sw-Txtarea a{word-break:break-all;text-decoration:underline} @media (any-hover:hover){.acf_content a:hover,.post-type-post a:hover,.sw-Txtarea a:hover{text-decoration:none} .sw-Txt a{text-decoration:underline;color:#2e74aa} .sw-Txt a:hover{text-decoration:none;cursor:pointer}
```

セオリーの真逆。一般には「下線なし→ホバーで下線」だが、彼らは逆。理屈は通っていて、CMS本文内のリンクは下線が無いとリンクだと分からないので常時下線、ホバーは『下線を引く』余地がないので『外す』方向でしか変化を作れない。グローバルリセットは `a{text-decoration:none;color:inherit}` なので、デザインしたナビやボタンには下線が付かない。下線を出す範囲を .acf_content / .post-type-post / .sw-Txtarea（＝WYSIWYG出力）に限定しているのがうまい

#### 送信ボタンに :disabled{opacity:.4} を置き、ホバーを :not(:disabled) で囲って無効時は点灯させない

確度 **複数サイト**（ENILIS・ステイハングリー）／判定 **流用可**

```css
.sw-Form .form-Submit input[type=submit]{min-width:25vw;margin:0 auto;padding:2.0833333333vw;display:inline-block;position:relative;border-radius:5.2083333333vw;font-weight:700;font-size:2rem;letter-spacing:.08em;color:#fff;text-align:center;background:#181818} .sw-Form .form-Submit input[type=submit]:disabled{opacity:.4} .sw-Form .form-Submit input[type=submit]:not(:disabled){-webkit-transition:background-color .3s;transition:background-color .3s} .sw-Form .form-Submit input[type=submit]:not(:disabled):hover{background-color:#f1721c}
```

7サイト中これだけが唯一まともな状態設計。`:not(:disabled)` を transition 側にも付けているので、無効ボタンは transition すら持たない。送信ボタンだけは padding が上下対称（2.0833333333vw=20px 四方）で、横長ピルの `border-radius:5.2083333333vw`=50px。他サイトは disabled 状態を一切定義していない

#### checkbox を display:none で隠して擬似要素に置き換えている。キーボードでフォーカスできず、支援技術からも消える

確度 **複数サイト**（ENILIS・ステイハングリー・NOKID）／判定 **真似しない**

```css
.sw-Form .form-Privacy .wpcf7-list-item input[type=checkbox]{display:none} .sw-Form .form-Privacy .wpcf7-list-item .wpcf7-list-item-label::before{content:"";width:1.25vw;height:1.25vw;margin-right:.5208333333vw;display:block;background:#f5f5f5;border:1px solid #aaa;border-radius:.1041666667vw;-webkit-flex-shrink:0;flex-shrink:0} .sw-Form .form-Privacy .wpcf7-list-item input[type=checkbox]:checked + .wpcf7-list-item-label::before{background:url( .wpcf7-form .wpcf7-checkbox input[type="checkbox"] { appearance: none; -webkit-appearance: none; background-color: #fff; border: 1px solid #ccc; border …
```

2通りの間違いがある。(1) ENILIS/ステイハングリー: `display:none` は要素をアクセシビリティツリーから除去しフォーカス不能にする。Tabでプライバシーポリシー同意にたどり着けない＝キーボードだけでは送信できない。正しくは `appearance:none` で見た目だけ消すか、`opacity:0;position:absolute` で視覚的にだけ隠す。チェックボックス本体は 1.25vw=12px しかなく、::before も12px。(2) NOKID: `appearance:none` は正しいが `border-radius:50%` で**チェックボックスを丸く**している。丸はラジオボタン（単一選択）の記号なので、複数選択できることが伝わらない。16pxはタップ対象として小さすぎる。チェックボックスは角丸2〜4pxの四角、20px以上にする

#### 入力欄に枠線を一切付けず、白背景だけで成立させる。line-height:240% で高さを稼ぐ

確度 **複数サイト**（ENILIS・ステイハングリー）／判定 **考え方だけ**

```css
.sw-Form .form-Item dd input[type=url],.sw-Form .form-Item dd textarea{width:100%;max-width:100%;padding:.625vw 1.0416666667vw;background:#fff;font-weight:400;font-size:1.5rem;line-height:240%;letter-spacing:.08em;color:#181818} .sw-Form .form-Item dd input[type=url]::placeholder,.sw-Form .form-Item dd textarea::placeholder{color:#b8b8b8}
```

border 宣言が無い。ページ背景が薄いグレー系なので、白い矩形そのものが入力欄の記号になっている。NOKIDの `border:1px solid #ccc` と正反対のアプローチ。高さは `line-height:240%` で作っていて、15px×2.4+padding 6px×2 = 48px。枠線なしで44px超を確保する手として賢い。ただしページ背景が白いサイトでは入力欄が完全に消えるので、背景色の設計とセットでないと流用できない。placeholder は #b8b8b8（白地でコントラスト約2.3:1）で、プレースホルダに意味のある情報を入れるとまずい

#### ラベルは text-align:center のまま、矢印側にだけ padding を入れて視覚的に中央をずらす

確度 **複数サイト**（イロコト・WIT STUDIO）／判定 **流用可**

```css
.sw-Btn a{width:100%;height:100%;padding:0 25px 0 0;text-align:center;font-size:1.6rem;font-weight:700;line-height:60px;letter-spacing:.2em;color:#fff;border-radius:78px;display:block;background:#ff777f;position:relative} .c-btn a.c-btn__arrow.c-btn__arrow--left{padding:0 calc(65 * var(--vw-scale)) 0 calc(80 * var(--vw-scale))} .c-btn a.c-btn__arrow.c-btn__arrow--right{padding:0 calc(80 * var(--vw-scale)) 0 calc(65 * var(--vw-scale))}
```

イロコトは `padding:0 25px 0 0` で右だけ25px、中央寄せのまま文字が12.5px左へ寄る。矢印が右端25pxにあるので、文字と矢印がぶつからない。WIT STUDIOは左右非対称に 80px / 65px で、アイコンのある側を15px広く取っている（--right と --left で値が入れ替わる）。flexの justify-content:center と padding を併用するこの手が、矢印付きボタンでラベルを『光学的に中央』に見せる最短ルート。left/right を個別に position 指定するより壊れにくい。なおイロコトは `line-height:60px` が height:60px と同値で、flexを使わず行高で縦中央を取っている（古いが確実）

#### ホバーで円が縮み、中の矢印が同じ比率で拡大する。0.85 × 1.175 ≈ 1 なので矢印の見た目の大きさは変わらず、円だけが締まる

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
.c-btn a > span{-webkit-transition:-webkit-transform .4s;transition:-webkit-transform .4s;transition:transform .4s;transition:transform .4s,-webkit-transform .4s} .c-btn a:hover > span{-webkit-transform:scale(.85);transform:scale(.85)} .c-btn a:hover > span::after{-webkit-transform:scale(1.175);transform:scale(1.175)}
```

1/0.85 = 1.176 で、逆数をかけて打ち消している。これは実装を読まないと絶対に分からない。普通にやると円だけ縮めてアイコンも一緒に小さくなり「遠ざかる」印象になるが、アイコンのサイズを固定したまま台座だけ締めると「押し込まれた」印象になる。数値がきれいなので `--btn-icon-squeeze: .85` と逆数で持てばそのまま移植できる

#### グラデーションを横200%幅で敷き、ホバーで background-position をずらす。色の補間ではなく位置の移動でホバーを作っている

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
background:linear-gradient(to right,#629f2f 0,#1a7e3a 50%,#629f2f 100%) top left 0/200% 100%;color:#fff;font-weight:700;letter-spacing:.06em;line-height:1;border-radius:calc(100 * var(--vw-scale)) .c-btn a{-webkit-transition:background .4s;transition:background .4s} .c-btn a:hover{background-position:top left 100%}
```

両端と中央に3色（#629f2f / #1a7e3a / #629f2f）を置いて左右対称にしてあるのが肝。だから 0% と 100% のどちらで止まっても同じ色になり、往復しても破綻しない。background-color の単純なトランジションより「流れた」感じが出る。注意点として background-position のトランジションは合成レイヤーに乗らないので、大量に並べると重い

#### 矢印ホバーは「右へスライドして消え、左から入ってくる」。50%→51% の1%で瞬間移動させている

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
@keyframes moveArw{0%{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}50%{opacity:0;-webkit-transform:translateX(100%);transform:translateX(100%)}51%{opacity:0;-webkit-transform:translateX(-100%);transform:translateX(-100%)}100%{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}} @keyframes moveArw-b{0%{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}50%{opacity:0;-webkit-transform:translateX(-100%);transform:translateX(-100%)}51%{opacity:0;-webkit-transform:translateX(100%);transform:translateX(100%)}100%{opacity:1;-webkit-transform:translat …
```

矢印を transform:translateX(6px) で動かして戻すのが一般的だが、これは「通り抜ける」。opacity 0 の区間で反対側へ飛ばすので往復が見えない。方向別に3本（右=moveArw / 左=moveArw-b / 斜め右上=外部リンク用moveArw-w）用意してある。transition ではなく animation + forwards なので、ホバーを外しても逆再生されず必ず完走する。easing は cubic-bezier(.75,.25,.25,.75) = 中央が速い対称カーブで30箇所に使用

#### インク拡張ホバー。離脱時だけ 0s + 0.6s遅延 でサイズを瞬間リセットし、縮まずフェードで消す

確度 **1サイトのみ**（カミナリゲームス）／判定 **流用可**

```css
.sw-Button:after { content: ""; position: absolute; bottom: -100%; left: 50%; -webkit-transform: translateX(-50%); transform: translateX(-50%); width: 0px; height: 0px; background: #F8871E; border-radius: 50%; opacity: 0; -webkit-transition: width 0s ease-out 0.6s, height 0s ease-out 0.6s, opacity 0.6s ease-out; @media (any-hover: hover) { .sw-Button:hover:before { right: 20px; } .sw-Button:hover:after { width: 1080px; height: 1080px; opacity: 1; -webkit-transition: width 1s ease-out, height 1s ease-out, opacity 0s; transition: width 1s ease-out, height 1s ease-out, opacity 0s; } }
```

ホバー時とホバー解除時で transition を別に書き分けているのがポイント。入り＝サイズ1秒＋opacity 0秒（即不透明）、出＝opacity 0.6秒でフェード＋サイズは0.6s待って0秒で瞬間リセット。これをやらないと離脱時に巨大な円が1秒かけて縮むのが見えて気持ち悪くなる。親に `overflow:hidden` と `z-index:1`、円は `bottom:-100%` 起点で下から湧く。1080pxはボタン360x72pxを完全に覆う固定値

#### ホバーで枠線を消すのではなく、無彩色から30%アルファのアクセント色に差し替える。ベタ塗りのアクセント色にはしない

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
.sw-Link .arw{width:46px;height:46px;border:1px solid #b5b5b5;border-radius:50%;display:inline-block;position:relative;pointer-events:auto} .sw-Link:hover .arw{border:1px solid #35b1c1} .sw-Pagenavi .wp-pagenavi .page:hover{border:1px solid rgba(53,177,193,.3);color:#35b1c1} .sw-Pagenavi_Detail .back:hover{color:#35b1c1;border:1px solid rgba(53,177,193,.3)}
```

同じサイト内で2段階に使い分けている。主役の矢印ボタン（.sw-Link .arw）は #b5b5b5 → #35b1c1 のベタ。脇役のページネーション（.page / .back）は #35b1c1 を .3 アルファにした淡い枠。文字色だけはどちらも #35b1c1 のベタ。『枠線の彩度で部品の格を表す』という設計。全部ベタにすると画面がうるさくなる

#### テキスト＋矢印のリンクは、親に pointer-events:none を置き、テキストと矢印だけ auto に戻す。隙間ではホバーが発火しない

確度 **1サイトのみ**（エニーキャリア）／判定 **考え方だけ**

```css
.sw-Link{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:end;-webkit-justify-content:flex-end;justify-content:flex-end;-webkit-box-align:center;-webkit-align-items:center;align-items:center;pointer-events:none} .sw-Link .txt{font-size:1.4rem;font-weight:700;line-height:1;pointer-events:auto;padding-right:20px;height:46px;-webkit-box-align:center;-webkit-align-items:center;align-items:center;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-transition:color .2s;transition:color .2s} .sw-Link .arw{width:46px;height:46px;border:1px solid #b5b5b5;border-radius:50 …
```

考え方は流用価値がある。flex のコンテナは実際の文字より広い矩形を持つので、素直に書くと余白にカーソルが来ただけでホバーが点灯してしまう。親を pointer-events:none にして子だけ生かすと、見えている部分だけが反応する。ただし実装としては逆効果の面もあって、`.txt{padding-right:20px}` の20pxは当たり判定に含まれる（txt自身がautoなので）。真似するなら親をnoneにするより、親の幅を `width:fit-content` にする方が素直で壊れにくい。pointer-events:none は全7サイトで100件（auto/all 34件）と多用されているが、大半はKVやオーバーレイの貫通用

#### ホバーを [href] 属性セレクタで絞り、href が無いときは反応させない

確度 **1サイトのみ**（NOKID）／判定 **流用可**

```css
.sw-ViewMore_Link[href]:hover{ text-shadow: -3px 0 0 rgba(89, 255, 235, .5), 3px 0 0 rgba(255, 89, 89, .5); } .sw-ViewMore_Link[href]:hover .sw-ViewMore_Icon .dot::before{ transform: scaleX(1); transition-delay: .15s; }
```

NOKIDのみ23箇所で使用。CMSで「リンク先未設定」の場合に <a> から href が落ちるため、見た目だけ反応して押せないという事故を防いでいる。WordPress 案件なら必ず入れる価値がある1文字の保険。JSでクラスを付け外しする必要がない

#### 3つの点が外へ散って十字に変形する2段階モーフ。transition-delay の入れ替えだけで順序を制御している

確度 **1サイトのみ**（NOKID）／判定 **流用可**

```css
@media (hover: hover) { .sw-ViewMore_Link{ transition: text-shadow .3s } .sw-ViewMore_Icon .dot::before, .sw-ViewMore_Icon .dot::after{ transition: transform .15s; transition-delay: 0s; } .sw-ViewMore_Icon .dot span:nth-child(1), .sw-ViewMore_Icon .dot span:nth-child(3){ transition: transform .15s; transition-delay: .15s; } .sw-ViewMore_Link[href]:hover .sw-ViewMore_Icon .dot::before{ transform: scaleX(1); transition-delay: .15s; } .sw-ViewMore_Link[href]:hover .sw-ViewMore_Icon .dot span:nth-child(1){ transform: translateX(7px); transition-delay: 0s; }
```

delay を基本状態とホバー状態で入れ替えてあるのが技術の核。ホバー時は『点が動く(0s) → 十字が伸びる(.15s)』、離脱時は『十字が縮む(0s) → 点が戻る(.15s)』と自動的に逆順になる。JSもkeyframesも不要で往復の演出が成立する。各0.15秒なので合計0.3秒。アイコン台座は49px枠に34pxの正方形を -45deg 回転（34×√2=48.08）で菱形にしている。矢印が左側に付く（margin-right:10px）唯一のサイト

#### 文字のホバーを色変化ではなく色収差の text-shadow で作る。シアン-3px / レッド+3px

確度 **1サイトのみ**（NOKID）／判定 **考え方だけ**

```css
.sw-ViewMore_Link[href]:hover{ text-shadow: -3px 0 0 rgba(89, 255, 235, .5), 3px 0 0 rgba(255, 89, 89, .5); }
```

文字色（#0f0f0f）を一切変えずにホバーを表現している。グリッチ/RGBズレの表現で、ブランドの性格が強く出るサイトだけで成立する。アルファ .5 で左右対称に置くことで、文字本体の可読性は保ったまま『ブレ』だけが見える。考え方は流用可だが、たけい事務所のような士業サイトにそのまま持ってくると浮く。落ち着かせるなら ±1px / アルファ .25 まで落とす

#### NOKIDのフォームだけ px 固定・remでもvwでもない。しかもモバイルで font-size:14px に下げている

確度 **1サイトのみ**（NOKID）／判定 **真似しない**

```css
input[type="text"], input[type="email"], input[type="tel"], input[type="url"], select, textarea { width: 100%; padding: 5px 20px; font-size: 16px; border: 1px solid #ccc; border-radius: 3px; background-color: #fff; } @media screen and (max-width:1024px) { input[type="text"], input[type="email"], input[type="tel"], input[type="url"], select, textarea { font-size: 14px; } }
```

3つ問題がある。(1) iOS Safari は input の font-size が16px未満だとフォーカス時に自動ズームする。モバイルで14pxに下げているので、タップするたび画面が拡大して戻らない。フォームだけは16px以上を死守する。(2) `padding:5px 20px` + font-size:16px で算出高さは約31px。44pxの半分以下。(3) nokid.common.css 本体は `html{font-size:62.5%}` のrem設計なのに、このファイルだけ全部pxで書かれている。後から別の人が足したファイルだと分かる。流用するなら高さは `padding:12px 16px` 以上にして `min-height:48px` を付ける

#### NOKIDの送信ボタンはホバーで #0f0f0f から #ccc になり、白文字が読めなくなる

確度 **1サイトのみ**（NOKID）／判定 **真似しない**

```css
.wpcf7-form .submit-button,.btn-to-confirm,.btn-back { display: block; width: 200px; margin: 40px auto 0; background: #0f0f0f; color: white; font-size: 16px; padding: 12px 0; border: none; border-radius: 6px; cursor: pointer; text-align: center; font-weight: bold; transition: background 0.3s ease; } .wpcf7-form .submit-button:hover { background: #ccc; }
```

color:white のまま背景が #ccc になるので、ホバー中のコントラスト比は約1.6:1。WCAG AA の4.5:1 に遠く及ばず、文字が消える。おそらく `.btn-back{background-color:#ccc}` のグレーをコピペして間違えた。カーソルが乗っている＝今まさに読もうとしている瞬間に読めなくなるので最悪のパターン。ENILISの `:hover{background-color:#f1721c}`（濃いオレンジ、白文字でコントラスト維持）が正しい手本。ホバーで明度を上げるなら文字色も一緒に反転させる

#### 必須と任意の両方にバッジを出し、全項目を明示する。任意だけ無印にしない

確度 **1サイトのみ**（NOKID）／判定 **流用可**

```css
.wpcf7-form .label-wrapper span.required, .wpcf7-form .label-wrapper span.optional { width: 40px; color: #fff; font-size: 12px; font-weight: bold; padding: 5px; margin-right: 4px; display: block; text-align: center; line-height: 1; flex-shrink: 0; } .wpcf7-form .label-wrapper span.required { background: #d80000; } .wpcf7-form .label-wrapper span.optional { background: #b5b5b5; }
```

幅40px固定で揃えてあるのでラベルの開始位置が縦に揃う（`flex-shrink:0` で潰れない）。必須 #d80000 / 任意 #b5b5b5 と色で区別。『無印＝任意』にすると、ユーザーは全項目を読んで初めて任意だと分かるので入力の心理的負荷が上がる。両方書けば一目で埋めるべき数が分かる。ただしバッジ高さは 12px+5px×2=22px で、`required` を赤ベタにするなら白文字12pxはギリギリ（#d80000 on white text のコントラストは約5.3:1で合格）

#### エニーキャリアの .sw-Btn はホバー状態が一切存在しない。transitionも擬似要素も無い静的な白ピル

確度 **1サイトのみ**（エニーキャリア）／判定 **考え方だけ**

```css
.sw-Btn{display:inline-block;min-width:300px;background:#fff;border:1px solid #dedede;border-radius:200px;font-weight:700;font-size:1.6rem;padding:20px 40px 22px;text-align:center} .sw-Btn{min-width:62.5vw;max-width:100%;font-size:3.3854166667vw;padding:4.1666666667vw 5.2083333333vw 4.6875vw}
```

`grep -oE 'sw-Btn[^{,]{0,40}'` の結果が両ファイルで `sw-Btn` の1種類のみ。:hover も :after も transition も無い。意図的で、このサイトの主役は矢印円の .sw-Link（色変化+矢印アニメ）で、.sw-Btn は『見出しの下に置く二次的なテキストリンク』の役。部品に格付けをして、下位の部品は敢えて無反応にしている。ただしホバーフィードバックが皆無だとリンクだと気づかれないリスクがあるので、流用するなら border の色だけでも #dedede → アクセント30%アルファに変える（同じサイト内の .sw-Pagenavi がまさにそれをやっている）

#### ENILISは transition:background-image を書いているが、background-image はトランジションできないので効いていない

確度 **1サイトのみ**（ENILIS）／判定 **真似しない**

```css
.sw-CircleBtn{-webkit-transition:background-color .3s;transition:background-color .3s} .sw-CircleBtn::after{-webkit-transition:background-image .3s;transition:background-image .3s} .sw-More .sw-More_Link:hover .sw-CircleBtn::after{background-image:url(
```

background-image は離散プロパティで補間されない（グラデーション同士の一部ケースを除く）。円の背景色は .3s で滑らかに黒くなるのに、中の矢印は黒→白へ瞬間的に切り替わる。0.3秒間ズレて見える。同じ会社のステイハングリーは `.svg-Arrow` をインラインSVGにして `transition:fill .3s` で正しく解決している。矢印の色を変えるなら (a) インラインSVG + fill、(b) `mask` + `background-color`（WIT STUDIOの c-btn__plus がこの手）、(c) 擬似要素2枚を opacity でクロスフェード のどれかにする

#### アイコンは mask + background-color で塗る。SVGのfillをCSSから触れるようにしてある

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
.c-btn a.c-btn__plus > span::after{content:"";display:block;position:absolute;-webkit-mask:url(
```

data-URIのSVGを `mask` に渡し、`background:#1a7e3a` で色を付けている。これならアイコンの色が CSS 変数で変えられ、transition も効き、ダークモード対応も1行で済む。`background:url(...)` で画像として置くと色替えに別ファイルが必要になる（ENILISが実際そうなっている）。-webkit-mask と mask の両方を書く必要がある点だけ注意。同じサイトの c-btn__arrow は background:url() 方式で、1サイト内でも手法が混在している

#### WIT STUDIOだけ rem を使わず --vw-scale 変数で calc(240 * var(--vw-scale)) と書く

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
:root{--vw-base:1920;--vw-min:1360;--text-color:$green;--vw-scale:max(calc(100vw / var(--vw-base)), 1px);--index-gallery-width:0;--index-text-stroke-width:0} :root{--vw-scale:calc(100vw / 1360)} :root{--vw-base:768;--vw-scale:calc(100vw / var(--vw-base))} .c-btn a{min-width:calc(240 * var(--vw-scale));height:calc(58 * var(--vw-scale));font-size:calc(18 * var(--vw-scale))} .c-btn a{min-width:calc(302 * var(--vw-scale));height:calc(86 * var(--vw-scale));font-size:calc(26 * var(--vw-scale))}
```

他6サイトの `html{font-size:0.5208333333vw}` で 1rem=10px を作る手法より、こちらの方が明快。`calc(240 * var(--vw-scale))` は『デザインデータ上の240px』をそのまま書けるので、Figmaの数値を電卓なしで転記できる。`--vw-base` を 1920 → 1360 → 768 と差し替えるだけでブレークポイントが切り替わる。`max(calc(100vw / var(--vw-base)), 1px)` の 1px 下限は、極端に狭い幅でも1px未満に潰れないための保険で、これも賢い。rem方式は root の font-size を変えるのでユーザーのブラウザ文字サイズ設定を無視してしまう（アクセシビリティ上の欠点）が、--vw-scale 方式も vw 基準なので同じ欠点は残る。ただし本文だけ rem に戻す余地がある点で後者が有利

#### カミナリゲームスだけブレークポイントが 768/767。他6サイトは 1024/1025

確度 **1サイトのみ**（カミナリゲームス）／判定 **真似しない**

```css
@media print, screen and (min-width: 768px) { .sw-Button { width: 360px; height: 72px; font-size: 2rem; } } @media print, screen and (max-width: 767px) { .sw-Button { width: 57.2916666667vw; height: 11.71875vw; font-size: 3.90625vw; } } @media print, screen and (min-width: 768px) and (max-width: 1280px) { .sw-Button.responsive { width: 239.9976px; height: 47.99952px; font-size: 13.3332px; } }
```

`min-width: 768px` が125件、`min-width: 768px) and (max-width: 1280px)` が71件で、1025px は12件しかない。つまりカミナリはタブレットをPC扱いしている。さらに `width:239.9976px;height:47.99952px;font-size:13.3332px` という小数6桁のpx値は、vw値を1280pxで固定するためにSassが吐いた『下限クランプ』で、1280px未満でボタンが縮み続けるのを止めている。やりたいことは正しい（clamp相当）が、生成物が汚く保守できない。いま同じことをやるなら `clamp(240px, 18.75vw, 360px)` の1行で済む。小数px値が大量に出てきたらSassの計算に頼りすぎているサイン

### ヘッダー・ナビ・フッター

#### ヘッダーは7サイト全てがスクロールで縮む。例外ゼロ。ただし縮め方は2派に分かれる ——「width/height/paddingを個別に書き換える」(5サイト) と「transform:scale() 一発で済ませる」(2サイト)。後者の方が圧倒的に記述量が少なく、transform-origin を外側の角に置くのがコツ。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **流用可**

```css
[witstudio.app.css][@media print,screen and (min-width:1025px)] .l-header.--scroll .l-header__logo{-webkit-transform:scale(.85);transform:scale(.85)} [witstudio.app.css][@media print,screen and (min-width:1025px)] .l-header.--scroll .l-header__content{-webkit-transform:scale(.85);transform:scale(.85)} [nokid.common.css][@media screen and (min-width:1025px)] .st-Header.scrolled .st-Header_Logo{transform:scale(0.637);} [nokid.common.css][@media screen and (min-width:1025px)] .st-Header_Logo{transition:transform .3s;transform-origin:0 50%;} [anycareer.style.css][@media print,screen and (min-width …
```

7/7で例外なし。これは「作法」ではなく「必須仕様」として扱っていい。scale版（witstudio/nokid）を採用すればCSSが1〜2行で済み、ロゴ・ナビ・パディングの数値を2セット管理する必要が消える。

#### bodyのスクロールロックがCSSに1行も存在しない。7サイト14ファイルを全検索して、html/bodyに overflow:hidden や position:fixed を当てる状態クラスは0件。ドロワーを開いた時の背面固定は全サイトJS側でインラインスタイルを書いている。

確度 **7サイト全部**（イロコト・NOKID・ステイハングリー・エニーキャリア・ENILIS・カミナリゲームス・WIT STUDIO）／判定 **真似しない**

```css
[irokoto.style.css] body{margin:0 auto;font-family:source-han-sans-japanese,Noto Sans Japanese,Hiragino Kaku Gothic ProN,Hiragino Kaku Gothic Pro,"ＭＳ ゴシック","メイリオ",Meiryo,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;-webkit-text-size-adjust:none;letter-spacing:.1em;color:#595656} [nokid.common.css] body{font-family:'Noto Sans JP',"Helvetica Neue",Arial,"Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif;-webkit-font-smoothing:antialiased;word-wrap :break-word;overflow-wrap :break-word;background-color:#F2F2F2;} [stayhungry.style.css] body{height:100%;min-height:100% …
```

CSSだけを移植すると「ドロワーを開いた状態で背面がスクロールする」バグをそのまま引き継ぐ。自分でやるなら body{position:fixed;width:100%} + scrollY復元か、overscroll-behavior:contain をドロワーに当てる。ドロワー側に overflow-y:scroll は全サイト書いてあるので、そこに overscroll-behavior:contain を1行足すのが最小コスト。

#### 各サイトのトランジション時間は1つの値に統一されており、新しいサイトほど遅い。irokoto .2s（89回）→ anycareer .2s（66回）→ stayhungry/enilis/nokid .3s（81/85/45回）→ kaminari 0.4s（42回）→ witstudio .6s（1903回）。サイト内で時間を使い分けるのではなく、1本に決めて全部それでやる。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・ENILIS・NOKID・カミナリゲームス・WIT STUDIO）／判定 **流用可**

```css
[irokoto.style.css] .st-Header{position:fixed;left:0;width:100%;z-index:100;-webkit-transition:.2s;transition:.2s} [stayhungry.style.css] .st-Header .header-Logo{width:13.6979166667vw;min-width:220px;position:fixed;top:2.6041666667vw;left:3.3854166667vw;-webkit-transition:.3s;transition:.3s} [nokid.common.css] .st-Header_Bg{width:100%;height:66px;background-color:#0f0f0f;position:fixed;top:0;left:0;transition:transform .3s;transform:translateY(-101%);} [kaminari.style.css] .st-Header_Inner .header-hamburger span:before,.st-Header_Inner .header-hamburger span:after{-webkit-transition:0.6s ease; …
```

grep集計: 各ファイルの最頻値が全体の60〜80%を占める。「ヘッダーは速く、ドロワーは遅く」のような使い分けはしていない。.3s が3サイトで最頻値なので無難。transition:.3s のように省略形（プロパティ名なしでall扱い）で書くのも全サイト共通の省力化。

#### フッターの背景は全サイト暗色。#202020 / #595656 / #111 / #181818 / #0F0F0F / 画像。白や薄グレーのフッターは7サイト中0件。PC上パディングは100px前後に収束（100px×3、90px、80px、60px、110px）。

確度 **7サイト全部**（エニーキャリア・イロコト・ステイハングリー・ENILIS・NOKID・カミナリゲームス・WIT STUDIO）／判定 **流用可**

```css
[anycareer.style.css] .st-Footer{background:#202020;padding:100px 0 48px;color:#fff} [irokoto.style.css] .st-Footer{background:#595656;padding:60px 50px 90px;color:#fff} [stayhungry.style.css] .st-Footer{padding:5.2083333333vw 9.375vw 3.75vw;background:#111;position:relative;overflow:hidden} [enilis.style.css] .st-Footer .footer-Layout{padding:4.1666666667vw 5.2083333333vw;background:#181818;display:grid;-webkit-box-pack:start;-webkit-justify-content:start;justify-content:start;grid-auto-columns:auto 1fr;position:relative} [nokid.common.css] .st-Footer_Nav{padding:0 50px;background:#0F0F0F;} [ …
```

7/7で暗色。純黒 #000 も0件で、#111〜#595656 のレンジ。stayhungryの 5.2083333333vw は1920pxで100px、enilisの 4.1666666667vw は80px。上100px / 下50〜60px の非対称パディング（上が約2倍）も5サイトで共通。

#### ホバースタイルは7サイト全てがメディアクエリでゲートされている。6サイトが @media (any-hover:hover)、nokid だけ @media (hover:hover)。裸の :hover ルールは1つも書かない。

確度 **7サイト全部**（NOKID・WIT STUDIO・カミナリゲームス・エニーキャリア・ENILIS・ステイハングリー・イロコト）／判定 **流用可**

```css
[nokid.common.css][@media (hover:hover)] .st-Header_Logo a:hover{opacity:.6;} [nokid.common.css][@media (hover:hover)] .st-Header_Nav .globalnav nav ul li a:hover::after{transform:scaleX(1);} [witstudio.app.css][@media (any-hover:hover)] .l-header .l-header__hamburger:hover{background:#fff} [witstudio.app.css][@media (any-hover:hover)] .l-header .l-header__hamburger{cursor:pointer;-webkit-transition:background .4s;transition:background .4s} [kaminari.style.css][@media (any-hover:hover)] .st-Header_Inner .header-logo a:hover{-webkit-transform:scale(1.025);transform:scale(1.025);opacity:0.8;} [a …
```

grep集計: any-hover=hover は stayhungry:36 / enilis:36 / witstudio:33 / anycareer:23 / kaminari:17 / irokoto:4、nokid は hover:hover が24。タッチ端末でホバー状態が残る問題（タップ後も色が変わったまま）を防ぐ。transition や cursor:pointer までゲート内に入れているサイト（witstudio）もある。

#### スクロール後のヘッダー高さは 64〜74px に収束する。初期状態の高さはサイトによって81px〜180pxまでバラけるが、縮んだ後は全サイトほぼ同じ高さになる。つまり「縮小後の高さ=70px前後」が共通のゴールで、初期の背の高さだけがデザインの自由度。

確度 **ほぼ全サイト**（エニーキャリア・カミナリゲームス・NOKID・ステイハングリー・ENILIS）／判定 **流用可**

```css
[anycareer.style.css][@media print,screen and (min-width:1025px)] .st-Header.is-Scrolled .st-Header_Nav{height:72px;background-color:rgba(255,255,255,.9)} [kaminari.style.css][@media print,screen and (min-width:768px)] .st-Header.scrolled .st-Header_Inner{height:64px;} [nokid.common.css] .st-Header_Bg{width:100%;height:66px;background-color:#0f0f0f;position:fixed;top:0;left:0;transition:transform .3s;transform:translateY(-101%);} [stayhungry.style.css] .st-Header::before{content:"";width:100%;height:74px;position:fixed;top:0;left:0;background:url(../../images/common/bg_noise.png) 0 0/5.2083333 …
```

72/64/66/74px と4サイトが±5px以内。enilisの4.0104166667vw は1920pxで77px。70px前後を縮小後の目標値にすれば外さない。

#### ハンバーガーの線は3本ではなく2本が標準（6/7サイト）。3本線は enilis だけで、それもSVGのdata URI。しかもDOMは極小で、線は要素自身か span 1個の ::before/::after で描く。「span×3」のよくある実装は1サイトも無い。

確度 **ほぼ全サイト**（NOKID・カミナリゲームス・イロコト・WIT STUDIO・エニーキャリア・ステイハングリー）／判定 **流用可**

```css
[nokid.common.css][@media screen and (max-width:1024px)] .st-Header_Hamburger::before,.st-Header_Hamburger::after{content:"";width:9.9vw;height:0.78vw;min-height:1px;position:absolute;left:0;background-color:#3CAB8F;display:block;backface-visibility:hidden;transition:transform .3s;} [kaminari.style.css] .st-Header_Inner .header-hamburger span:before,.st-Header_Inner .header-hamburger span:after{content:"";position:absolute;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%);width:7.8125vw;height:1px;background:#fff;-webkit-transition:0.6s ease;transition:0.6s ease;} [irokoto …
```

HTMLも確認済み。nokid/stayhungry/enilisは子要素0個、irokoto/kaminariはspan1個、anycareerはspan2個、witstudioはdiv2個（open用/close用）。2本線は×印への変形が自然（2本を±45度で交差）で、3本線の「中央の線を消す」処理が要らない。

#### メニューを閉じている時の不活性化が4/7サイトで不完全。きちんと visibility:hidden か display:none を当てているのは nokid / stayhungry / enilis の3サイトだけ。残り4サイトは pointer-events:none や transform だけで、ドロワー内のリンクが画面外にあるままキーボードフォーカスで到達できてしまう。

確度 **ほぼ全サイト**（WIT STUDIO・カミナリゲームス・エニーキャリア・イロコト・NOKID・ステイハングリー・ENILIS）／判定 **真似しない**

```css
[witstudio.app.css][@media print,screen and (max-width:1024px)] .l-header .l-header__content{width:calc(630 * var(--vw-scale));height:100%;top:0;right:0;-webkit-transform:translateX(100%);transform:translateX(100%);-webkit-transition:transform .4s} [kaminari.style.css][@media print,screen and (max-width:767px)] .st-Header_Inner .header-nav{position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;pointer-events:none;z-index:-8;-webkit-transition:0.4s ease;transition:0.4s ease;} [anycareer.style.css][@media print,screen and (max-width:1024px)] .st-Header_Nav{-webkit-transition:0s;transition: …
```

pointer-events:none はマウスを止めるだけでTabキーを止めない。witstudioは translateX(100%) のみで不活性化が一切無く、Tabを押すと画面外のメニューにフォーカスが飛んで画面が横スクロールする。真似するなら nokid型（visibility:hidden を transition に含めて遅延で切る）か stayhungry型（display:none併記）。

#### ハンバーガーが <button> なのは7サイト中1サイト（カミナリゲームス）だけ。aria-expanded / aria-controls / role は7サイト全てのトップページHTMLで0件。irokotoは <a href="javascript:void(0);"> を使っている。

確度 **ほぼ全サイト**（カミナリゲームス・イロコト・エニーキャリア・ENILIS・ステイハングリー・NOKID・WIT STUDIO）／判定 **真似しない**

```css
[kaminarigames.html] <button class="header-hamburger sp_b"><span></span></button> [irokoto.html] <a class="st-Menu Gill_b closed" id="st-Menu" href="javascript:void(0);"> <span class="line"></span></a> [anycareer.html] <div class="st-Header_Hamburger hover"> [enilis.html] <div class="header-Hamburger"></div> [stayhungry.html] <div class="header-Hamburger"></div> [nokid.html] <div class="st-Header_Hamburger sp_b"> [witstudio.html] <div class="l-header__hamburger">
```

grep実測: aria-expanded=0 / aria-controls=0 / role=0 が7サイト全て。div のハンバーガーはキーボードで押せない。見た目は全部流用していいが、要素は <button type="button" aria-expanded aria-controls> に置き換えること。CSSセレクタは .st-Header_Hamburger のままで動く。

#### 6/7サイトが「リサイズ中は全要素のtransitionを殺す」グローバルクラスを持っている。vw基準レイアウトなので、ウィンドウ幅を変えると全要素のwidth/topが再計算されてtransitionが発火し、画面がニュルニュル動いてしまうのを防ぐための措置。クラス名はサイトごとに .resizing / .is-resizing / .--resizing と揺れるが中身は完全同一。

確度 **ほぼ全サイト**（NOKID・イロコト・エニーキャリア・WIT STUDIO・カミナリゲームス）／判定 **流用可**

```css
[nokid.common.css] .resizing *,.resizing *::before,.resizing *::after{transition:none !important;transition-delay:unset !important;} [nokid.common.css] .preload *{transition:none !important;transition-delay:unset !important;} [irokoto.style.css] .resizing *,.resizing *::after,.resizing *::before{-webkit-transition:none!important;transition:none!important;-webkit-transition-delay:unset!important;transition-delay:unset!important} [anycareer.style.css] .is-resizing *,.is-resizing *::after,.is-resizing *::before{-webkit-transition:none!important;transition:none!important;-webkit-transition-delay:u …
```

これは見ないと絶対に気づかない。1rem=10px固定（html{font-size:0.5208333333vw}）のレイアウトを採る以上、必須の副作用止め。.preload * も同じ中身で、初回描画時にアニメが暴発するのを防ぐ。2セットまとめてコピーでよい。

#### SPドロワーのナビ文字はPCの2.25〜3.75倍。PC側は全サイト16px前後（1.6rem）で揃っているのに、SPでは36px〜60pxまで跳ね上がる。enilisは 6rem=60px で、さらに1項目ごとに border-top:1px solid #fff を引いてリスト行を作っている。

確度 **ほぼ全サイト**（ステイハングリー・ENILIS・NOKID・イロコト・WIT STUDIO・エニーキャリア）／判定 **流用可**

```css
[stayhungry.style.css] .st-Header .header-Nav .nav-List .nav-Item a{font-family:"PT Sans",sans-serif;font-weight:700;font-size:16px;color:#000;letter-spacing:.08em;position:relative} [stayhungry.style.css][@media print,screen and (max-width:1024px)] .st-Header .header-Nav .nav-List .nav-Item a{font-size:3.6rem;color:#fff} [enilis.style.css] .st-Header .header-Nav .nav-Global .global-List .global-Item a{font-family:Poppins,sans-serif;font-weight:600;font-size:1.8rem;letter-spacing:.04em;color:#181818} [enilis.style.css][@media print,screen and (max-width:1024px)] .st-Header .header-Nav .nav-Glo …
```

3.6rem=36px が stayhungry と nokid で完全一致（最頻値）。768px基準の36pxは実機390px幅で約18px相当。2カラムにする場合は28px（witstudio）まで落とす。1列なら36pxを既定値にしてよい。enilisの60pxは1列×border-top区切りの場合のみ成立。

#### z-index の設計は2系統。ヘッダーを 99〜100 に置く派（irokoto 100、kaminari 99、witstudio 99）と 10番台に置く派（stayhungry 10、enilis 8〜11、nokid 11〜12）。どちらでもハンバーガーは必ずナビパネルより上（+1〜+20）。モーダルだけ別次元の7000番台。

確度 **ほぼ全サイト**（イロコト・カミナリゲームス・WIT STUDIO・NOKID・エニーキャリア）／判定 **考え方だけ**

```css
[irokoto.style.css] .st-Header{position:fixed;left:0;width:100%;z-index:100;-webkit-transition:.2s;transition:.2s} [irokoto.style.css][@media print,screen and (max-width:1199px)] .st-Menu{display:block;z-index:320;position:fixed;width:87px;height:33px;top:12px;right:2.8645833333vw} [kaminari.style.css] .st-Header_Inner{position:fixed;top:0;left:0;width:100%;background:#fff;z-index:99;} [witstudio.app.css] .l-header{position:fixed;top:0;right:0;z-index:99;width:100%} [nokid.common.css] .st-Header{width:100%;padding:40px 0 0 50px;position:fixed;top:0;left:0;z-index:11;} [nokid.common.css][@media …
```

grep集計でzの値は1〜12が大半、100超えは数件のみ。nokid型（ヘッダー11、ハンバーガー12、ナビは親の中で1）が最も整理されている：ヘッダー自身がスタッキングコンテキストになるので内部は1桁で足りる。witstudioは content/overlay に z-index を一切書かずDOM順だけで解決しており、これが理想。

#### ロゴの左端からの距離は PC 20〜65px、SP 0〜40px。SP側は 3.90625vw（=30px@768）が最頻値で stayhungry と enilis が一致。vw換算の共通グリッド値は 2.6041666667vw(20px) / 3.90625vw(30px) / 5.2083333333vw(40px) / 10.4166666667vw(80px) の4点で、全6ファイルに出現する。

確度 **ほぼ全サイト**（ステイハングリー・ENILIS・NOKID・WIT STUDIO・イロコト）／判定 **流用可**

```css
[stayhungry.style.css] .st-Header .header-Logo{width:13.6979166667vw;min-width:220px;position:fixed;top:2.6041666667vw;left:3.3854166667vw;-webkit-transition:.3s;transition:.3s} [stayhungry.style.css] .st-Header .header-Logo{width:41.6666666667vw;min-width:auto;position:absolute;top:4.4270833333vw;left:3.90625vw} [enilis.style.css] .st-Header .header-Logo{width:8.9583333333vw;position:fixed;top:2.0833333333vw;left:3.125vw;z-index:10} [enilis.style.css] .st-Header .header-Logo{width:25.1302083333vw;position:fixed;top:3.2552083333vw;left:3.90625vw} [nokid.common.css][@media screen and (max-width …
```

grep集計: 3.90625vw は stayhungry:30件 / enilis:27件 / kaminari:20件 / anycareer:14件 / irokoto:7件。2.6041666667vw は enilis:33 / stayhungry:24 / anycareer:15。この4値をトークン化すればSP側の余白判断がほぼ不要になる。PCロゴ幅は 172〜395px と幅広く、ここはブランド次第。

#### ハンバーガーのタップ領域が2サイトで小さすぎる。nokid は 9.9vw×3.39vw（実機390px幅で約39×13px）、irokoto は固定 87×33px。残り4サイトは110〜120px角（@768基準）で十分な大きさ。

確度 **ほぼ全サイト**（NOKID・イロコト・WIT STUDIO・ステイハングリー・エニーキャリア・カミナリゲームス・ENILIS）／判定 **考え方だけ**

```css
[nokid.common.css][@media screen and (max-width:1024px)] .st-Header_Hamburger{width:9.9vw;height:3.39vw;position:fixed;top:8.85vw;right:5.21vw;z-index:12;transition:transform .3s;} [irokoto.style.css][@media print,screen and (max-width:1199px)] .st-Menu{display:block;z-index:320;position:fixed;width:87px;height:33px;top:12px;right:2.8645833333vw;-webkit-transition:background .3s;transition:background .3s} [witstudio.app.css][@media print,screen and (max-width:1024px)] .l-header .l-header__hamburger{position:fixed;width:calc(110 * var(--vw-scale));height:calc(110 * var(--vw-scale));top:calc(20  …
```

nokid の height:3.39vw は線2本ぶんの高さしか確保しておらず、要素そのものが当たり判定なので実機で13px。44px未満。流用するなら 14.3229166667vw（110px@768、実機約56px）か 15.625vw（120px@768）を採る。見た目を小さくしたい場合は要素を大きく取って中の線を小さく描くこと。

#### ロゴのホバーは opacity:.6 固定。4サイトが同じ値。拡大やcolor変化ではなく透明度だけ。カミナリゲームスだけ scale(1.025)+opacity:0.8 を併用。

確度 **ほぼ全サイト**（ステイハングリー・ENILIS・WIT STUDIO・NOKID・カミナリゲームス）／判定 **流用可**

```css
[stayhungry.style.css] .st-Header .header-Logo a:hover{opacity:.6} [enilis.style.css] .st-Header .header-Logo a:hover{opacity:.6} [witstudio.app.css] .l-header .l-header__logo a:hover{opacity:.6} [nokid.common.css][@media (hover:hover)] .st-Header_Logo a:hover{opacity:.6;} [nokid.common.css][@media (hover:hover)] .sw-FixedBnr .close:hover,.sw-FixedBnr .bnr a:hover{opacity:.6;} [kaminari.style.css][@media (any-hover:hover)] .st-Header_Inner .header-logo a:hover{-webkit-transform:scale(1.025);transform:scale(1.025);opacity:0.8;}
```

opacity:.6 が4サイトで完全一致。.5 や .7 ではなく .6。画像・SVG・テキストどれでも使えるのでロゴの中身に依存しない。transitionは各サイトの共通値（.3s / .4s）をそのまま使う。

#### スクロール時のヘッダー背景は「要素自体を表示/非表示」ではなく、常に存在する帯を translateY(-101%) で画面外に逃がし、スクロール時に translateY(0) で降ろす。-100% ではなく -101% —— 3サイトで3回使われ、-100% は7ファイル中0件。1%余分に逃がすのはサブピクセルで線が1本残るのを防ぐため。

確度 **複数サイト**（ステイハングリー・NOKID・ENILIS）／判定 **流用可**

```css
[stayhungry.style.css] .st-Header::before{content:"";width:100%;height:74px;position:fixed;top:0;left:0;background:url(../../images/common/bg_noise.png) 0 0/5.2083333333vw repeat-y rgba(255,255,255,.84);-webkit-transform:translateY(-101%);transform:translateY(-101%);-webkit-transition:-webkit-transform .3s;transition:transform .3s,-webkit-transform .3s;-webkit-backdrop-filter:blur(.4166666667vw);backdrop-filter:blur(.4166666667vw);will-change:filter} [nokid.common.css] .st-Header_Bg{width:100%;height:66px;background-color:#0f0f0f;position:fixed;top:0;left:0;transition:transform .3s;transform:t …
```

grep結果: translateY(-101%) は enilis:2 / nokid:1 / stayhungry:2 の計5件、translateY(-100%) は全14ファイルで0件。偶然ではなく意図的な統一。opacityやdisplayを触らずtransformだけなのでGPU合成に乗る。

#### backdrop-filter は7サイト中2サイトだけ。しかも値は完全に同一で blur(.4166666667vw)（=1920pxで8px）、背景は rgba(255,255,255,.84)。「スクロール後のヘッダーはすりガラス」は彼らの標準作法ではない。無地の不透明色（#fff / #0f0f0f / rgba(255,255,255,.9)）の方が多数派。

確度 **複数サイト**（ENILIS・ステイハングリー・エニーキャリア・NOKID）／判定 **考え方だけ**

```css
[enilis.style.css][@media print,screen and (min-width:1025px)] .st-Header::before{content:"";width:100%;height:4.0104166667vw;position:fixed;top:0;left:0;background:rgba(255,255,255,.84);-webkit-backdrop-filter:blur(.4166666667vw);backdrop-filter:blur(.4166666667vw);-webkit-transform:translateY(-101%);transform:translateY(-101%);z-index:8} [stayhungry.style.css] .st-Header::before{background:url(../../images/common/bg_noise.png) 0 0/5.2083333333vw repeat-y rgba(255,255,255,.84);-webkit-backdrop-filter:blur(.4166666667vw);backdrop-filter:blur(.4166666667vw);will-change:filter} [anycareer.style. …
```

grep: backdrop-filter は enilis:2件 / stayhungry:2件、他5サイトは0件。使うなら 8px / α=.84 の組み合わせをそのまま。ただしstayhungryは will-change:filter を付けており、これは常時レイヤー確保でモバイルのメモリを食う。will-changeは外すこと。

#### stayhungry と enilis だけが、PCのナビに display:block!important / opacity:1!important / visibility:visible!important / pointer-events:all!important（enilisは clip-path:none!important）を並べている。そしてこの2サイトは、上記の .resizing トランジション殺しクラスを持たない唯一の2サイト。つまり !important の束はJSが残したインラインスタイルを力技で上書きするための後始末。

確度 **複数サイト**（ステイハングリー・ENILIS）／判定 **真似しない**

```css
[stayhungry.style.css][@media print,screen and (min-width:1025px)] .st-Header .header-Nav{display:block!important;opacity:1!important;visibility:visible!important;pointer-events:all!important;-webkit-transition:.3s;transition:.3s} [enilis.style.css][@media print,screen and (min-width:1025px)] .st-Header .header-Nav{display:block!important;-webkit-clip-path:none!important;clip-path:none!important;-webkit-transition:top .3s,right .3s;transition:top .3s,right .3s}
```

grep照合済み: .resizing / .is-resizing / .--resizing を持たないのは stayhungry.style.css と enilis.style.css の2ファイルだけで、!important でナビを叩き起こしているのもこの2ファイルだけ。相関は明確。設計として正しいのは .resizing 側。!importantの束を真似すると、後からナビを隠したい時に一切効かなくなる。

#### SPのドロワーナビは1列スタックではなく2カラムグリッドが3/7サイト。しかも列ギャップが異様に広い（stayhungryは 26.0416666667vw = 768px基準で200px）。フッターのナビも同じく2カラムに落とす。

確度 **複数サイト**（ステイハングリー・WIT STUDIO・エニーキャリア・ENILIS）／判定 **考え方だけ**

```css
[stayhungry.style.css][@media print,screen and (max-width:1024px)] .st-Header .header-Nav .nav-List{padding:0 17.1875vw;display:grid;-webkit-box-pack:start;-webkit-justify-content:start;justify-content:start;grid-template-columns:repeat(2,1fr);gap:11.71875vw 26.0416666667vw} [witstudio.app.css][@media print,screen and (max-width:1024px)] .l-header .l-header__content .l-header__navigation{display:grid;grid-template-columns:repeat(2,1fr);gap:calc(80 * var(--vw-scale)) calc(40 * var(--vw-scale))} [anycareer.style.css][@media print,screen and (max-width:1024px)] .st-Header_Menu{-webkit-transition: …
```

項目数が6以上ある時だけ有効。行ギャップ 11.71875vw（=90px@768）は共通値で、stayhungryとenilisで完全一致。ただしanycareerは grid-template-columns:40.3645833333vw 1fr（固定310px+残り）で、ナビ本体とサブメニューを横並びにするための2列なので意味が違う。項目が4つ以下なら1列で十分。

#### カレント/ホバーの印は下線ではなく直径5〜6pxの円。3サイトで確認でき、サイズが 5px / 6px / .2604166667vw(=5px@1920) と実質同一。位置はラベルの上（anycareer: top:-15px）か左（witstudio: left:-16px）か右上（enilis）。

確度 **複数サイト**（エニーキャリア・WIT STUDIO・ENILIS）／判定 **流用可**

```css
[anycareer.style.css] .st-Header_Menu_Anchor.current::after{content:"";display:block;position:absolute;width:5px;height:5px;top:-15px;left:0;right:0;margin:0 auto;background-color:#35b1c1;border-radius:50%;-webkit-transition:.2s;transition:.2s} [anycareer.style.css][@media print,screen and (min-width:1025px)] .st-Header.is-Scrolled .st-Header_Menu_Anchor.current::after{top:-10px} [witstudio.app.css] .l-header .l-header__content .l-header__navigation .l-header__navigation-item a.--current::before{content:"";display:block;position:absolute;pointer-events:none;border-radius:50%;background:#1a7e3a …
```

5〜6pxという具体値が3サイトで一致。色はアクセントカラー（#35b1c1 / #1a7e3a / #f1721c）。下線だと文字幅に依存して長さが変わるが、円は常に同じ大きさなのでナビ全体のリズムが崩れない。anycareerはスクロール縮小時に top:-15px → -10px と追従させている点まで芸が細かい。

#### ホバー下線は「左から入って右へ抜ける」ワンウェイ。3サイトが3通りの実装で同じ挙動を作っている —— left/right アンカーの入れ替え（irokoto）、transform-origin の right→left 入れ替え（witstudio）、background-position の right→left 入れ替え（enilis）。往復しない下線は意図的な共通作法。

確度 **複数サイト**（イロコト・WIT STUDIO・ENILIS）／判定 **流用可**

```css
[irokoto.style.css][@media print,screen and (min-width:1200px)] .st-Header_Nav_Item::before{content:"";width:0;position:absolute;-webkit-transition:all .2s linear;transition:all .2s linear;height:2px;background:#f09ba5;bottom:4px;right:1px;-webkit-transition:.2s;transition:.2s} [irokoto.style.css][@media print,screen and (min-width:1200px)] .st-Header_Nav_Item:hover::before{width:100%;-webkit-transition:width .2s;transition:width .2s;left:-1px;right:auto} [witstudio.app.css] .l-header .l-header__content .l-header__navigation .l-header__navigation-item a::after{content:"";display:block;position …
```

採用するなら witstudio 型（transform-origin を right→left に入れ替えて scaleX するだけ）。GPU合成に乗り、記述も4行。enilis型は background-size をアニメートしていて毎フレーム再描画が走るうえ will-change:background-size を付けており、これは効果がなくメモリだけ食う。irokoto型は transition:all なのでレイアウト再計算が入る。挙動は同じでも実装コストが3倍違う。

#### イージングもサイトごとに1本。anycareer は cubic-bezier(.22,1,.36,1)（easeOutQuint）を34回、witstudio は cubic-bezier(.31,2.8,.5,1.2) というy=2.8のオーバーシュート曲線を240回。irokoto のヘッダー背景カーテンだけ cubic-bezier(.86,0,.07,1)（easeInOutQuart）。

確度 **複数サイト**（エニーキャリア・イロコト・WIT STUDIO）／判定 **考え方だけ**

```css
[anycareer.style.css] .st-Header_Hamburger .hamburger-Line .line{position:absolute;display:block;background:#fff;height:2px;left:0;top:0;-webkit-transition:top .4s cubic-bezier(.22,1,.36,1),transform .4s cubic-bezier(.22,1,.36,1);-webkit-transform:skewX(-20deg);transform:skewX(-20deg)} [anycareer.style.css][@media print,screen and (max-width:1024px)] .st-Header_Nav_Inner{background-color:#f5f5f5;position:absolute;top:0;right:-82.8125vw;width:82.8125vw;height:100%;overflow-y:auto;-webkit-transition:right .65s cubic-bezier(.22,.46,0,1);transition:right .65s cubic-bezier(.22,.46,0,1)} [irokoto.st …
```

grep件数: cubic-bezier(.22,1,.36,1) は anycareer のみ34件、cubic-bezier(.31,2.8,.5,1.2) は witstudio のみ240件。サイトをまたいだ共通曲線は存在しない。つまりイージングはブランドの声として1本選ぶもの。.22,1,.36,1 は上品で外さない。.31,2.8,.5,1.2 は明確に跳ねるので、たけい事務所のような士業では避ける。

#### フッターのPCレイアウトは grid-template-areas で「ロゴ列は固定幅、ナビは1fr、最下段は全幅」の2行構成。ロゴ列の幅は 180px / 290px。irokotoは1行目の高さを 42px に固定している。

確度 **複数サイト**（イロコト・エニーキャリア）／判定 **流用可**

```css
[irokoto.style.css][@media print,screen and (min-width:1200px)] .st-Footer{display:grid;grid-template-columns:180px 1fr;grid-template-rows:42px auto;grid-template-areas:"logo nav" "bottom bottom"} [irokoto.style.css][@media print,screen and (min-width:768px) and (max-width:1199px)] .st-Footer{display:grid;grid-template-columns:180px 1fr;grid-template-rows:60px 42px auto;grid-template-areas:"logo logo" "nav nav" "bottom bottom"} [anycareer.style.css] .st-Footer_Inner{width:calc(100% - 12.5vw);margin:0 auto;display:grid;grid-auto-columns:1fr;grid-template-columns:290px 1fr;grid-template-rows:aut …
```

grid-template-areas を使っているので、SPでロゴとナビの順序を入れ替えるのが1行で済む（anycareerはSPで Menu→Logo→Bottom に並べ替え、PCと逆）。HTMLの並びを触らずに済むのが要点。irokotoは中間幅(768-1199px)で2列→1列に落とす段を挟んでおり、ロゴが上・ナビが下になる。

#### IE用の -ms-grid プレフィックスが irokoto に32件、anycareer に14件残っている。新しい5サイト（stayhungry / enilis / kaminari / nokid / witstudio）は0件。display:-webkit-box のflexフォールバックは nokid だけが2件まで削り込んでいる（他は19〜43件）。

確度 **複数サイト**（イロコト・エニーキャリア・NOKID）／判定 **真似しない**

```css
[irokoto.style.css][@media print,screen and (min-width:1200px)] .st-Footer_Logo{-ms-grid-row:1;-ms-grid-column:1} [irokoto.style.css][@media print,screen and (min-width:1200px)] .st-Footer_Bottom{-ms-grid-row:2;-ms-grid-column:1;-ms-grid-column-span:2} [anycareer.about.css] .st-Footer_Bottom{-ms-grid-row:3;-ms-grid-column:1;-ms-grid-column-span:3;grid-area:st-Footer_Bottom} [nokid.common.css] .st-Header_Content{display:flex;justify-content:space-between;} [nokid.common.css] .st-Header_Nav{min-height:46px;display:flex;align-items:center;justify-content:flex-end;}
```

grep実測: -ms-grid は irokoto:32 / anycareer.style:14 / anycareer.about:14、他5ファイルは0。display:-webkit-box は witstudio:43 / stayhungry:31 / enilis:25 / irokoto:24 / anycareer:21 / nokid:2。-ms-grid は grid-template-areas の名前と行番号を二重管理することになり、レイアウト変更のたびに両方直す羽目になる。autoprefixerのtargetsからIEを外すだけで消える。nokid.common.css が最もクリーンな手書きCSSで、参照するならこのファイル。

#### ヘッダーのロゴを明背景/暗背景で切り替える手法が2通りある。nokid は1枚のSVGの fill を .white 状態クラスで切り替え、irokoto は白版と色版の画像を2枚重ねて opacity で入れ替える。切り替えのトリガーも違い、nokid はページ単位（.st-Header.white）、irokoto はスクロール（.st-Header-Shorten）とドロワー開閉（.opened）の両方。

確度 **複数サイト**（NOKID・イロコト）／判定 **考え方だけ**

```css
[nokid.common.css] .st-Header_Logo svg{fill:#fff;} [nokid.common.css] .st-Header_Logo .logo_black a svg{fill:#000000;} [nokid.common.css][@media screen and (min-width:1025px)] .st-Header_Logo svg{transition:fill .3s;} [nokid.common.css][@media screen and (min-width:1025px)] .st-Header.scrolled .st-Header_Logo svg{fill:#fff;} [nokid.common.css][@media screen and (min-width:1025px)] .st-Header.white .st-Header_Nav .globalnav nav ul li a{color:#fff;} [irokoto.style.css] .st-Header_Logo img{position:absolute;top:0;left:0;-webkit-transition:.2s;transition:.2s} [irokoto.style.css] .st-Header_Logo im …
```

nokid型（インラインSVG+fill切り替え）が優位：画像1枚でリクエストも半分、transition:fill .3s で色が滑らかに補間される。irokoto型は2枚重ねなのでロード時に両方落ちてくるし、opacityのクロスフェード中に半透明が重なって一瞬濁る。ただしロゴが多色なら fill 1本では足りないのでirokoto型になる。

#### モバイル下部の固定CTAバーは7サイト中0件。固定追従要素は nokid の右下バナー（360px、translateX(100%)で隠して .visible で出す、×ボタン付き）と irokoto の右下バナー（460px）とページトップボタン（50px角）だけ。

確度 **複数サイト**（NOKID・イロコト）／判定 **考え方だけ**

```css
[nokid.common.css] .sw-FixedBnr{width:360px;padding-right:15px;position:fixed;bottom:60px;right:0;z-index:5;transform:translateX(100%);transition:transform .3s;} [nokid.common.css] .sw-FixedBnr.visible{transform:translateX(0);} [nokid.common.css][@media screen and (max-width:1024px)] .sw-FixedBnr{width:94.79vw;padding-right:5.21vw;bottom:5.21vw;} [nokid.common.css] .sw-FixedBnr .close{width:24px;height:16px;margin:0 0 6px auto;transition:opacity .3s;cursor:pointer;} [irokoto.style.css] .st-Banner{position:fixed;bottom:14px;right:18px;width:460px;height:auto;-webkit-transition:.6s ease;transiti …
```

日本の制作会社サイトで定番の「SP下部に電話/お問い合わせの固定バー」を誰もやっていない。position:fixed で bottom:0 を取る要素を全14ファイルから検索して4件しかなく、どれも右下の小さいバナーかページトップ。コンバージョンはフッター直前の大きなCTAブロック（nokidの .st-Footer_Contact は padding:76px 100px の巨大ボタン2枚）で取る設計。nokidのSP時 width:94.79vw（=両端に5.21vw=40px残す）と ×ボタン必須は流用価値あり。

#### irokotoのハンバーガーは線だけでなく「Menu」というテキストラベルを ::before の content で持ち、開くと「Close」に差し替わる。さらに2本の線の幅が 30px / 20px と非対称で、開くと両方25pxに揃う。アイコンだけで済ませていない唯一のサイト。

確度 **1サイトのみ**（イロコト）／判定 **考え方だけ**

```css
[irokoto.style.css][@media print,screen and (max-width:1199px)] .st-Menu{display:block;z-index:320;position:fixed;width:87px;height:33px;top:12px;right:2.8645833333vw;-webkit-transition:background .3s;transition:background .3s} [irokoto.style.css][@media print,screen and (max-width:1199px)] .st-Menu::before{display:block;position:absolute;font-size:14px;content:"Menu";color:#fff;top:10px;left:5px;letter-spacing:.1em} [irokoto.style.css][@media print,screen and (max-width:1199px)] .st-Menu.opened::before{content:"Close";color:#595656} [irokoto.style.css][@media print,screen and (max-width:1199p …
```

考え方（ラベルを添える／開閉で文言を変える）は40代以上の読者に対して有効。ただし content:"Menu" はスクリーンリーダーが読まない実装であり、テキストは実DOMに置いて視覚的にだけ切り替えるべき。14px/letter-spacing:.1em の見た目は流用可。

#### nokidのドロワー開閉は150ms刻みの3段ステージング。背景カーテン→装飾テキスト→ナビ本体の順で、transition-delay を状態クラスの有無で入れ替えることで「開く時は順送り、閉じる時は逆送り」を1つのtransition定義で実現している。

確度 **1サイトのみ**（NOKID）／判定 **流用可**

```css
[nokid.common.css][@media screen and (max-width:1024px)] .st-Header_Bg{height:100%;transition-delay:.15s,.15s;} [nokid.common.css][@media screen and (max-width:1024px)] .st-Header.opened .st-Header_Bg{transform:translateY(0);transition-delay:0s,0s;} [nokid.common.css][@media screen and (max-width:1024px)] .st-Header_LoopText{width:41.93vw;height:100%;position:fixed;top:0;right:0;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s;transition-delay:0s,0s;} [nokid.common.css][@media screen and (max-width:1024px)] .st-Header.opened .st-Header_LoopText{opacity:1;visibility:visible;tra …
```

delay値が 0s / .15s / .3s と等間隔。閉じる時は Bg だけが .15s 遅れ、他は0sなので中身が先に消えてカーテンが最後に上がる。JSを一切書かず、クラス1個のトグルで両方向の順序制御ができる。transition に visibility を含めているのでフォーカス制御も正しい。この1サイトだけだが、実装品質が最も高い。

#### フッター最下段（コピーライト行）の数値が明確に決まっている。上に border-top:1px solid rgba(245,245,245,.1)、文字は rgba(255,255,255,.5)、font-size:1.2rem(=12px)、padding-top:30px。暗背景に対してグレーの実色ではなく白の低α。

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
[anycareer.style.css] .st-Footer_Bottom{border-top:1px solid rgba(245,245,245,.1);padding-top:30px;color:rgba(255,255,255,.5);display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;line-height:240%;font-size:1.2rem} [anycareer.style.css] .st-Footer_Bottom a{color:rgba(255,255,255,.5)} [anycareer.style.css][@media print,screen and (max-width:1024px)] .st-Footer_Bottom{padding-top:10.4166666667vw;margin:11.71875vw auto 0;width:77.6041666667vw;line-height:2;display:block;font-size:2.6041666667vw} [anycaree …
```

1サイトだが数値が具体的で即使える。line-height:240% は12pxに対して28.8pxで、住所など2〜3行になる小さい文字の可読性確保。プライバシーポリシーのリンクだけ平常時 underline でホバーで外す（通常と逆）のも実測どおり。SPでは font-size:2.6041666667vw=20px@768 に上げている。

#### カミナリゲームスのSPドロワーは z-index:-8 という負の値。開く時も z-index は変えず opacity と pointer-events だけを切り替えるので、ドロワーは常にページ本体の背面にいる。親の .st-Header_Inner が z-index:99 の別レイヤーなので画面には出るが、設計としては危うい。

確度 **1サイトのみ**（カミナリゲームス）／判定 **真似しない**

```css
[kaminari.style.css][@media print,screen and (max-width:767px)] .st-Header_Inner .header-nav{position:fixed;top:0;left:0;width:100%;height:100%;background:url("../../images/common/bg_pattern_orange.png") repeat top center/93.75vw 93.75vw;opacity:0;pointer-events:none;z-index:-8;-webkit-transition:0.4s ease;transition:0.4s ease;} [kaminari.style.css][@media print,screen and (max-width:767px)] .st-Header_Inner .header-nav.open{opacity:1;pointer-events:auto;} [kaminari.style.css][@media print,screen and (max-width:767px)] .st-Header_Inner .header-nav:before{content:"";position:absolute;top:0;left …
```

負のz-indexは親のスタッキングコンテキストに依存して挙動が変わるので、後から .st-Header_Inner の position や transform を変えた瞬間にドロワーが消える。さらに閉じている時も visibility が hidden ではないためリンクがフォーカス可能。正の小さい値（1〜2）で組んで、親で浮かせるのが正解。

#### 100dvh を使っているのは7サイト中1サイト（anycareer）だけ。しかも height:100vh; height:100dvh; の2行併記で古いブラウザにフォールバック。残り6サイトのSPドロワーは height:100% か 100vh なので、iOSのアドレスバーぶんだけ下が切れる。

確度 **1サイトのみ**（エニーキャリア・ステイハングリー・WIT STUDIO・ENILIS）／判定 **流用可**

```css
[anycareer.style.css][@media print,screen and (max-width:1024px)] .st-Header_Nav{-webkit-transition:0s;transition:0s;width:100%;pointer-events:none;height:100vh;height:100dvh;background-color:transparent;z-index:19} [anycareer.style.css] .sw-Youtube{display:none;width:100%;height:100vh;height:100dvh;position:fixed;top:0;left:0;z-index:7000} [stayhungry.style.css][@media print,screen and (max-width:1024px)] .st-Header .header-Nav{width:100%;height:100%;padding:40.8854166667vw 0;top:0;left:0;background:#111;overflow-x:hidden;overflow-y:scroll;display:none;opacity:0;visibility:hidden;pointer-even …
```

grep実測: 100dvh は anycareer.style.css:3件 / anycareer.about.css:3件のみ、他5サイトは0件。height:100vh;height:100dvh; の2行併記は今すぐ全サイトに入れるべき1行。witstudioの height:100vh（.l-header__inner）はiOSで下端220pxのパディングが見切れる原因になっている。

#### PCのドロップダウンを持つのは7サイト中1サイト（anycareer）だけ。残り6サイトはPCナビをフラットな1階層で押し通している。そのドロップダウンも動きは translateY(-5px) → 0 の5pxだけで、SPでは階層を潰して親の下に opacity:.5 で平置きする（アコーディオンにしない）。

確度 **1サイトのみ**（エニーキャリア）／判定 **考え方だけ**

```css
[anycareer.style.css][@media print,screen and (min-width:1025px)] .st-Header_Menu_Sub{background:#fff;border-radius:0 0 6px 6px;padding:30px 40px 26px 30px;position:absolute;top:17px;left:-30px;visibility:hidden;opacity:0;-webkit-transform:translateY(-5px);transform:translateY(-5px);-webkit-transition:opacity .3s,transform .3s} [anycareer.style.css][@media (any-hover:hover)] .st-Header_Menu_Item:hover .st-Header_Menu_Sub{-webkit-transform:translateY(0);transform:translateY(0);opacity:1;visibility:visible} [anycareer.style.css][@media print,screen and (max-width:1024px)] .st-Header_Menu_Sub{dis …
```

情報設計の示唆として重要：彼らは階層を作らない方を選んでいる（6/7）。やるなら動きは5pxに留め、SPでは開閉UIを作らず opacity:.5 で平置きするのが彼らの答え。サブ項目の文字はPCで1.4rem(14px)、親が1.6rem(16px)なので差は2pxだけ。

#### anycareer に死んだCSSがある。.st-Header_Menu_Sub:hover{opacity:1;visibility:visible} は visibility:hidden の要素に :hover を当てており、hidden な要素はポインタイベントを受けないので永久に発火しない。実際に機能しているのは親側の .st-Header_Menu_Item:hover .st-Header_Menu_Sub。

確度 **1サイトのみ**（エニーキャリア）／判定 **真似しない**

```css
[anycareer.style.css][@media print,screen and (min-width:1025px)] .st-Header_Menu_Sub{background:#fff;border-radius:0 0 6px 6px;padding:30px 40px 26px 30px;position:absolute;top:17px;left:-30px;visibility:hidden;opacity:0;-webkit-transform:translateY(-5px);transform:translateY(-5px)} [anycareer.style.css][@media print and (any-hover:hover),screen and (min-width:1025px) and (any-hover:hover)] .st-Header_Menu_Sub:hover{opacity:1;visibility:visible} [anycareer.style.css][@media (any-hover:hover)] .st-Header_Menu_Item:hover .st-Header_Menu_Sub{-webkit-transform:translateY(0);transform:translateY(0 …
```

「ドロップダウン自体にマウスを乗せても閉じないように」という意図は正しいが、実装として成立していない。親要素（.st-Header_Menu_Item）にホバー判定を持たせれば十分で、子側の :hover は不要。コピーする時にこの1ルールは落とすこと。

#### witstudio は rem の代わりに --vw-scale というカスタムプロパティでスケールしている。max(calc(100vw/1920),1px) で最小1pxの床を持ち、1025〜1360pxでは 100vw/1360 に切り替えて縮みすぎを防ぐ。全サイズを calc(数値 * var(--vw-scale)) で書くのでデザインデータの実寸をそのまま書き写せる。

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
[witstudio.app.css] :root{--vw-base:1920;--vw-min:1360;--text-color:$green;--vw-scale:max(calc(100vw / var(--vw-base)),1px);--index-gallery-width:0;--index-text-stroke-width:0} [witstudio.app.css][@media print,screen and (min-width:1025px) and (max-width:1360px)] :root{--vw-scale:calc(100vw / 1360)} [witstudio.app.css][@media print,screen and (max-width:1024px)] :root{--vw-base:768;--vw-scale:calc(100vw / var(--vw-base))} [witstudio.app.css] .l-header .l-header__content .l-header__navigation .l-header__navigation-item a::after{content:"";display:block;position:absolute;bottom:calc(-5 * var(--v …
```

既知の html{font-size:0.5208333333vw} 方式の後継。優位点が2つ：(1) 1px の床があるのでヘアライン（height:calc(1 * var(--vw-scale))）が狭幅でも消えない、(2) 1360px未満で縮小が止まるので小さいノートPCで文字が潰れない。rem方式にはこの2つがない。--vw-base を切り替えるだけでPC/SPを同じ記法で書ける。ただし :root に --text-color:$green というSass変数が解決されず残っている（ビルド事故）。

#### エニーキャリアのヘッダーは全幅バーではなく「左上の白い札＋右上の水色の札」という左右対称のコーナータブ。border-radius は画面の外側に接する角だけ0で、内側だけ丸める（ロゴ側 0 0 6px 6px、ハンバーガー側 0 0 0 6px）。スクロールすると白い札の背景が rgba(255,255,255,0) に抜けて札が消え、下に敷かれた帯だけが残る。

確度 **1サイトのみ**（エニーキャリア）／判定 **考え方だけ**

```css
[anycareer.style.css] .st-Header_Logo{width:270px;height:180px;top:0;left:0;position:fixed;z-index:10;-webkit-transition:.3s;transition:.3s} [anycareer.style.css] .st-Header_Logo_Anchor{padding:40px;background:#fff;display:block;border-radius:0 0 6px 6px;-webkit-transition:.3s;transition:.3s} [anycareer.style.css][@media print,screen and (min-width:1025px)] .st-Header.is-Scrolled .st-Header_Logo{width:170px;max-height:72px} [anycareer.style.css][@media print,screen and (min-width:1025px)] .st-Header.is-Scrolled .st-Header_Logo_Anchor{padding:12px 40px;max-height:100%;background:rgba(255,255,25 …
```

「画面の端に接する角は直角、内側だけ丸める」は札やタブを作る時にそのまま使える原則。.78125vw は768px基準で6pxで、PC側の6pxと一致させている（SPでvw換算しても同じ見た目の6px）。札の背景を rgba(255,255,255,0) に抜いて消す（display:noneにしない）のでtransitionが効く。ただし 270×180px は相当大きく、ブランドの主張が強いサイト向け。

#### WIT STUDIO のPCヘッダーは全幅バーではなく右上に浮かぶピル型。right:30px / top:30px、border-radius:100px、padding の左だけ60pxで中身を右に寄せ、box-shadow は 0 0 20px rgba(20,22,20,.1) の極薄。CTAボタンだけナビの最後の項目として :last-of-type で緑のピルに化ける。

確度 **1サイトのみ**（WIT STUDIO）／判定 **考え方だけ**

```css
[witstudio.app.css] .l-header .l-header__content{position:fixed;-webkit-box-shadow:0 0 calc(20 * var(--vw-scale)) rgba(20,22,20,.1);box-shadow:0 0 calc(20 * var(--vw-scale)) rgba(20,22,20,.1)} [witstudio.app.css] .l-header .l-header__content{top:calc(30 * var(--vw-scale));right:calc(30 * var(--vw-scale));border-radius:calc(100 * var(--vw-scale));padding:calc(12 * var(--vw-scale)) calc(12 * var(--vw-scale)) calc(12 * var(--vw-scale)) calc(60 * var(--vw-scale));background:#fff;-webkit-transform-origin:top right;transform-origin:top right;-webkit-transition:transform .4s,padding-left .4s} [witstu …
```

CTAボタンを別マークアップにせず、ナビの最後のli に :last-of-type で別スタイルを当てているのが要点。HTMLがナビのリスト1本で済む。ホバーは背景グラデを 200% 幅にして background-position を動かすだけ（色のtransitionより滑らか）。padding-left:60px / gap:38px / ボタン160×50px / 角丸100px は数値をそのまま流用できる。

#### irokotoのSPドロワーは width:0 ↔ width:100% で開閉し、transition に width 0s .4s を入れて「閉じるアニメが終わってから幅を0に落とす」。さらに白いカーテン（.st-Header_Bg）は height:0 → 100% の高さアニメーションで、border-top:2px solid #f09ba5 のアクセント線を上端に持つ。

確度 **1サイトのみ**（イロコト）／判定 **考え方だけ**

```css
[irokoto.style.css] .st-Header_Nav{width:100%;height:100%;z-index:300;position:fixed;top:0;right:0;overflow-x:hidden;overflow-y:scroll;-webkit-overflow-scrolling:touch;height:100%;width:0;-webkit-transform:translateY(-2em);transform:translateY(-2em);opacity:0;pointer-events:none;-webkit-transition:opacity .2s,width 0s .4s,-webkit-transform .2s;transition:transform .2s,opacity .2s,width 0s .4s,-webkit-transform .2s;padding:0 0 50px} [irokoto.style.css] .st-Header_Nav.opened{pointer-events:inherit;-webkit-transition:opacity .2s .2s,-webkit-transform .2s .2s;transition:transform .2s .2s,opacity . …
```

考え方（開く時は中身を遅らせ、閉じる時は幅の消去を遅らせる）は正しいが実装は古い。width と height のアニメーションは毎フレームレイアウトが再計算される。同じ順序制御は nokid の transition-delay 方式で transform/opacity/visibility だけで組める。border-top:2px のアクセント線（#f09ba5）をカーテンの上端に乗せる見せ方だけは流用価値あり。translateY(-2em) の em 単位も1箇所だけの例外で、他は全部rem/px/vw。

#### エニーキャリアのSPドロワーは「半透明の暗幕が右から幅を伸ばす」+「中身のパネルが右から滑り込む」の2層。暗幕は width:0→100% を .6s .1s で、パネルは right:-82.8125vw→0 を .65s で。わずか50msと100msの差でレイヤーがずれて見える。イージングは cubic-bezier(.22,.46,0,1)。

確度 **1サイトのみ**（エニーキャリア）／判定 **考え方だけ**

```css
[anycareer.style.css][@media print,screen and (max-width:1024px)] .st-Header_Nav_Bg{width:0;height:100%;position:absolute;display:-webkit-box;display:-webkit-flex;display:flex;top:0;right:0;background:rgba(32,32,32,.8);-webkit-transition:width .6s .1s cubic-bezier(.22,.46,0,1);transition:width .6s .1s cubic-bezier(.22,.46,0,1)} [anycareer.style.css][@media print,screen and (max-width:1024px)] .st-Header_Nav_Inner{background-color:#f5f5f5;position:absolute;top:0;right:-82.8125vw;width:82.8125vw;height:100%;overflow-y:auto;-webkit-transition:right .65s cubic-bezier(.22,.46,0,1);transition:right  …
```

ドロワー幅 82.8125vw（=636px@768、画面の83%）で右に17%の暗幕を残す配分は流用価値あり。開く時は暗幕のdelayを0に、閉じる時は.1sにして「中身が先に出る/暗幕が後に消える」を作っている（nokidと同じ発想）。ただし width と right のアニメーションなのでレイアウト再計算が走る。transform:translateX に置き換えるべき。is-opened に visibility:visible があるのに閉状態に visibility:hidden が無いので、この1行は効いていない。

#### ENILISのドロワーは clip-path:inset(0 100% 0 0) で右から左へ開く。PCでは clip-path:none!important で無効化。SPナビの各項目は border-top:1px solid #fff で区切られ、padding は 5.2083333333vw 3.90625vw 4.5572916667vw（=40px 30px 35px @768）の上下非対称。

確度 **1サイトのみ**（ENILIS）／判定 **考え方だけ**

```css
[enilis.style.css][@media print,screen and (max-width:1024px)] .st-Header .header-Nav{width:100%;height:100%;padding:30.5989583333vw 3.90625vw 20.8333333333vw;position:fixed;top:0;left:0;background:#181818;overflow-x:hidden;overflow-y:scroll;-webkit-clip-path:inset(0 100% 0 0);clip-path:inset(0 100% 0 0);display:none} [enilis.style.css][@media print,screen and (min-width:1025px)] .st-Header .header-Nav{display:block!important;-webkit-clip-path:none!important;clip-path:none!important;-webkit-transition:top .3s,right .3s;transition:top .3s,right .3s} [enilis.style.css][@media print,screen and (m …
```

clip-path:inset() は transform と違って中身が変形しないので、文字が歪まずに「切り出されるように」開く。display:none が併記されているので閉状態のフォーカス漏れもない（この点は4サイトより良い）。ただし clip-path は transition させるとSafariで描画が重い。パディング上 30.5989583333vw（=235px@768）はヘッダーのロゴとハンバーガーを避けるための実測値で、ロゴ位置を変えたら要再計算。

### モーション

#### リサイズ中とロード中は全要素のtransitionを!importantで強制停止する。7サイト全部にある唯一の完全共通モーション作法。

確度 **7サイト全部**（イロコト・エニーキャリア・ENILIS・カミナリゲームス・NOKID・ステイハングリー・WIT STUDIO）／判定 **流用可**

```css
.is-resizing *,.is-resizing *::after,.is-resizing *::before{-webkit-transition:none!important;transition:none!important;-webkit-transition-delay:unset!important;transition-delay:unset!important} .is-loading *{-webkit-transition:none!important;transition:none!important;-webkit-transition-delay:unset!important;transition-delay:unset!important} .--resizing *,.--resizing *::after,.--resizing *::before{-webkit-transition:none!important;transition:none!important;-webkit-transition-delay:unset!important;transition-delay:unset!important} .preload *{-webkit-transition:none!important;transition:none!imp …
```

これが無いと、ウィンドウ幅を変えた瞬間にvwベースの全レイアウトが0.3〜0.6秒かけてウニャウニャ動く。イロコトのCSSは幅基準がvw固定(1rem=10px維持のため)なのでリサイズ即レイアウト再計算が走る。クラス名は3流派(is-resizing/--resizing/resizing)あるが実装は完全同一。JS側はresizeでbodyにクラスを付け、150ms程度のdebounce後に外すだけ。

#### prefers-reduced-motion への対応が7サイト全部で完全に0件。CSSもHTMLも1件も無い。

確度 **7サイト全部**（イロコト・エニーキャリア・ENILIS・カミナリゲームス・NOKID・ステイハングリー・WIT STUDIO）／判定 **真似しない**

```css
anycareer.about.css:0 anycareer.style.css:0 enilis.style.css:0 irokoto.style.css:0 kaminari.style.css:0 nokid.common.css:0 stayhungry.style.css:0 witstudio.app.css:0
```

grep -c で全14ファイル・全7HTML が 0。前庭障害や片頭痛のある利用者はOS設定で『視差効果を減らす』を有効にしているが、これらのサイトは最大5.2秒の連続スタッガー、無限マーキー、オーバーシュート2.8倍のバウンスを全部そのまま再生する。WCAG 2.3.3(Animation from Interactions, AAA)および2.2.2に関わる。皮肉なのは .is-resizing で全transitionを止める仕組みを既に持っていることで、同じ宣言を @media (prefers-reduced-motion: reduce) に流用すれば3行で対応できる(tokens参照)。ここは絶対に真似しないこと。

#### 片道モーションを 50%/51% の1%フレームで瞬間ワープさせ、無限ループや単発hoverに見せる。4サイトで同一手口。

確度 **ほぼ全サイト**（エニーキャリア・ステイハングリー・ENILIS・カミナリゲームス）／判定 **流用可**

```css
@keyframes moveArw{0%{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}50%{opacity:0;-webkit-transform:translateX(100%);transform:translateX(100%)}51%{opacity:0;-webkit-transform:translateX(-100%);transform:translateX(-100%)}100%{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}} @keyframes clipPathInsetBottomToTop{0%{-webkit-clip-path:inset(0 0 0 0);clip-path:inset(0 0 0 0)}50%{-webkit-clip-path:inset(0 0 100% 0);clip-path:inset(0 0 100% 0)}51%{-webkit-clip-path:inset(100% 0 0 0);clip-path:inset(100% 0 0 0)}100%{-webkit-clip-path:inset(0 0 0 0);clip-path:inse …
```

これが一番再利用価値が高い発見。0→50%で画面外へ出し、50→51%の1%(=.4sなら4ms、知覚不可)で反対側へテレポート、51→100%で戻る。要素を2個重ねたりJSでリセットしたりせず、keyframes1本で『矢印がスッと抜けて、次がスッと入る』が作れる。clip-path版は inset の bottom 100% → top 100% で入れ替えており、同じ発想を切り抜きに適用している。カミナリのスクロールインジケータ(scrline-pc)も 50%/51% で bottom基準→top基準 に入れ替える同型。

#### マーキーは translateX(0) → translateX(-50%) で、コンテンツを2回複製する前提。必ず linear、15〜75秒。

確度 **ほぼ全サイト**（ENILIS・ステイハングリー・イロコト・カミナリゲームス）／判定 **流用可**

```css
@keyframes scrollText{0%{-webkit-transform:translateX(0);transform:translateX(0)}100%{-webkit-transform:translateX(-50%);transform:translateX(-50%)}} @keyframes scrollTextRight{0%{-webkit-transform:translateX(0);transform:translateX(0)}100%{-webkit-transform:translateX(50%);transform:translateX(50%)}} animation:scrollTextRight 30s linear infinite forwards animation:scrollTextLeft 30s linear infinite forwards animation:scrollText 15s linear 0s infinite
```

-100%ではなく-50%が肝。中身を2セット並べて半分だけ動かすと、1周した瞬間の見た目が開始時と完全に一致するので継ぎ目が出ない。-100%だと後半が空になる。速度は30sが標準、15sが速め。Left/Right の2本持ちで上下段を逆方向に流す使い方。duration を変えるだけで速度調整でき、キーフレームは触らない。

#### 無限ループのイージングは用途で2択。平行移動・回転は必ず linear、往復運動(浮遊・脈動)は必ず ease-in-out。混ざった例が1件も無い。

確度 **ほぼ全サイト**（ENILIS・ステイハングリー・エニーキャリア・カミナリゲームス・WIT STUDIO）／判定 **流用可**

```css
animation:scrollTextRight 30s linear infinite forwards animation:moveBg 75s linear infinite animation:moveBgSP 55s linear infinite animation:wk-circleAnim 6s linear infinite animation:gallery 60s infinite linear animation:text-stroke 60s infinite linear reverse animation:circleUp 5s ease-in-out 0s infinite animation:circleDown 5s ease-in-out 0s infinite animation: scrline-pc 2s ease-in-out infinite
```

機械的だが例外ゼロなので規則として使える。一方向に流れ続けるもの(マーキー、背景スクロール、回転)にイージングを当てると1周ごとに加減速して『カクつき』に見える。逆に0→50%→0で戻る往復(circleUp は translateY 0→-20%→0)にlinearを当てると折返しが鋭角になって機械的。往復は5s、回転は6s、スクロールインジケータは2s。

#### プロパティごとに速度階層がある。色(color/fill)は.2s、形(transform)と背景は.3〜.4s、スクロール登場は.6〜.8s。色は動きの倍速。

確度 **ほぼ全サイト**（エニーキャリア・イロコト・ENILIS・ステイハングリー・WIT STUDIO）／判定 **流用可**

```css
transition:color .2s transition:fill .2s,-webkit-transform .2s transition:opacity .3s transition:background-color .3s transition:transform .4s,-webkit-transform .4s transition:background .4s transition:opacity .7s .6s,-webkit-transform .8s cubic-bezier(.31,2.8,.5,1.2) .6s
```

全サイト集計で color .2s=42件/fill .2s=16件、background-color .3s=16件、transform .4s=42件、登場系 .6〜.8s。色変化は位置が動かないので速くても目が追える(むしろ遅いとモッサリする)。移動は軌跡を追う必要があるので倍の時間が要る。opacity .3s は5サイトで確認でき、横断で最も再現性の高い単一値。『全部0.3sで統一』より、色だけ0.2sに落とす方が反応が良く感じる。

#### ホバーの画像ズームは scale(1.05) が標準。最大でも1.1で、1.2以上は1件も無い。

確度 **ほぼ全サイト**（イロコト・ステイハングリー・WIT STUDIO・カミナリゲームス）／判定 **流用可**

```css
transform:scale(1.05) transform:scale(1.025) transform:scale(1.1) transform:scale(1.03) transform:scale(.95)
```

1.05=5%拡大。サムネイルが400px幅なら20pxしか伸びない。親に overflow:hidden がある前提で、画像が枠内でわずかに押し広がるだけ。集計上1.05が10件で最多、1.025/1.03という2〜3%の例もある。ボタン自体の縮小側は .95 や .85。『ズームは5%、縮みは5〜15%』と覚える。1.2のような派手な倍率を使っていないのは、カード一覧で複数が同時にホバーされたときに画面が騒がしくなるのを避けているため。

#### ホバー演出は @media (any-hover:hover) で囲い、タッチ端末では一切適用しない。5サイトで採用。

確度 **ほぼ全サイト**（WIT STUDIO・エニーキャリア・ENILIS・ステイハングリー・イロコト）／判定 **考え方だけ**

```css
@media (any-hover:hover){.l-footer .l-footer__hp a::before{content:"";display:block;position:absolute;left:0;-webkit-transform-origin:right;transform-origin:right;width:100%;height:calc(1 * var(--vw-scale));background:#fff;-webkit-transform:scaleX(0);transform:scaleX(0);-webkit-transition:-webkit-transform .4s;transition:-webkit-transform .4s;transition:transform .4s;transition:transform .4s,-webkit-transform .4s}
```

件数は enilis 36 / stayhungry 36 / witstudio 33 / anycareer 24+23 / irokoto 4。カミナリとNOKIDは0件なので、新しい案件から導入された作法と読める。スマホで :hover が『タップ後に貼り付いたまま残る』問題を防ぐのが目的。ただし any-hover は『何かひとつでもホバー可能な入力があれば真』なので、タッチ対応ノートPCやスタイラス接続端末で意図せず真になる。主入力で判定する (hover:hover) の方が正確で、全サイト0件だったのでここは真似せず改善すべき。

#### will-change はほぼ使わない。CSS 1.3MB 全体で22件、イロコトとエニーキャリアは0件。

確度 **ほぼ全サイト**（ENILIS・カミナリゲームス・ステイハングリー・NOKID・WIT STUDIO）／判定 **流用可**

```css
will-change:clip-path will-change:transform will-change:background-size will-change:filter will-change: opacity, transform will-change: auto
```

件数の少なさ自体が作法。will-change は指定した要素を常時別レイヤーに昇格させるので、多用するとメモリを食って逆に遅くなる。transform/opacity のアニメは元から合成されるため指定不要で、彼らはそれを理解している。同様に backface-visibility:hidden も自作CSSでは1〜4件で、70件という総数は swiper/splide などライブラリ由来。『とりあえず translate3d や will-change を付ける』は2015年頃の手法で、真似しなくてよい。

#### @media print,screen を1465回使う一方 @media print 単独の打ち消しが0件。登場前の opacity:0 が印刷にも効き、スクロール前に印刷すると本文が白紙になる。

確度 **ほぼ全サイト**（エニーキャリア・ENILIS・イロコト・ステイハングリー・WIT STUDIO・NOKID）／判定 **真似しない**

```css
@media print,screen and (max-width:1024px){.js-fade:not(.is-animated){-webkit-transform:translateY(3.90625vw);transform:translateY(3.90625vw)} .js-fade:not(.is-animated){opacity:0;-webkit-transform:translateY(20px);transform:translateY(20px)}
```

@media print,screen の件数は witstudio 561 / irokoto 192 / enilis 186 / stayhungry 183 / anycareer 174+161。対して @media print{ は全ファイル0件。スクロール登場の待機状態 opacity:0 はメディアクエリ外のベースルールなので印刷にも適用され、JSがクラスを付ける前(ページを開いた直後にCtrl+P)だと該当セクションが消えた紙が出る。採用サイトや会社案内は印刷される前提があるので実害が出る。@media print で .js-fade{opacity:1!important;transform:none!important} を1本足すだけで防げる。

#### リセットCSSで button/input/select/textarea の outline を0にしたまま、:focus-visible の代替指定が自作CSS側に0件。

確度 **ほぼ全サイト**（エニーキャリア・ENILIS・イロコト・ステイハングリー・WIT STUDIO）／判定 **真似しない**

```css
button,input,optgroup,select,textarea{-webkit-appearance:none;-moz-appearance:none;appearance:none;vertical-align:middle;color:inherit;font:inherit;background:0 0;padding:0;margin:0;outline:0;border-radius:0;text-align:inherit} button{background-color:transparent;border:none;cursor:pointer;outline:0;padding:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}
```

ファイル別で outline:0 が各2件、:focus-visible は自作CSSで全ファイル0件。唯一の5件は enilis.lib.css(Splideライブラリ)の .splide.is-focus-in で、サードパーティが入れたもの。つまりキーボード操作時にボタンとフォームのフォーカス位置が全サイトで見えない。NOKIDはフォームを持つ(nokid.form.css)ので実害が大きい。WCAG 2.4.7違反。outline:0 を書くなら同じリセット内に :focus-visible{outline:2px solid currentColor;outline-offset:2px} を必ず対で書くこと。

#### 無限ループアニメに停止手段が無い。animation-play-state が全CSSで0件、hoverで止める指定も無い。

確度 **ほぼ全サイト**（ENILIS・ステイハングリー・エニーキャリア・WIT STUDIO）／判定 **真似しない**

```css
animation:scrollTextRight 30s linear infinite forwards animation:moveBg 75s linear infinite animation:gallery 60s infinite linear animation:text-stroke 60s infinite linear reverse animation:clipPathInsetBottomToTop 1.25s ease-in-out infinite forwards
```

grep で animation-play-state は全14ファイル0件。WCAG 2.2.2(Pause, Stop, Hide)は5秒を超えて自動で動き続けるコンテンツに一時停止手段を要求するが、15〜75秒の無限マーキーが止められない。マーキーに文字情報(実績社名など)を載せている場合、読み終わる前に流れていくので内容が取得できない。:hover と :focus-within で animation-play-state:paused を足すだけで満たせるので、流用時は必ず追加する。

#### CSSは -webkit- 付きと無しを4重に書き出すため、grepの出現回数が実体の4〜8倍に膨らむ。頻度をそのまま重要度と読むと誤る。

確度 **ほぼ全サイト**（WIT STUDIO・エニーキャリア・ENILIS・ステイハングリー）／判定 **真似しない**

```css
transition:-webkit-transform .4s;transition:-webkit-transform .4s;transition:transform .4s;transition:transform .4s,-webkit-transform .4s -webkit-transition:opacity .6s .7s,-webkit-transform .6s .7s;transition:opacity .6s .7s,-webkit-transform .6s .7s;transition:transform .6s .7s,opacity .6s .7s;transition:transform .6s .7s,opacity .6s .7s,-webkit-transform .6s .7s
```

Autoprefixer が transform を含む transition を4パターンに展開するため。実例:cubic-bezier(.31,2.8,.5,1.2) は240回ヒットするが実体はフッター6要素のみ。transition:(transform|opacity) .6s は818回ヒットするが witstudio の delay ユーティリティ100個の展開。調査でも制作でも、件数は『何セレクタか』で数えること。なお -webkit-transform のプレフィクスは2026年時点で不要(Safari 9以降不要)なので、ビルド設定の browserslist を見直せば CSS量が実質1/4になる。

#### 登場前の状態を :not(.is-animated) で書き、登場後の値は一切書かない。JSはクラスを足すだけで、要素は「素の状態」に戻ることで登場する。

確度 **1サイトのみ**（エニーキャリア）／判定 **考え方だけ**

```css
.js-fade{-webkit-transition:.7s cubic-bezier(0,.55,.45,1);transition:.7s cubic-bezier(0,.55,.45,1)} .js-fade:not(.is-animated){opacity:0;-webkit-transform:translateY(20px);transform:translateY(20px)} .sw-Ttl:not(.is-animated){opacity:0;-webkit-transform:translateX(-20px);transform:translateX(-20px)}
```

考え方は秀逸。通常は .fade{opacity:0} + .fade.is-visible{opacity:1} と2状態書くが、この書き方なら登場後=CSSを書かない素の状態になるので、opacity:1やtransform:noneを書き忘れる事故が消える。ただしJSが落ちた場合コンテンツが永久にopacity:0のまま見えなくなる(pitfalls参照)。noscript用の打ち消しを足して流用すべき。

#### 見出しは横から(translateX -20px)、本文ブロックは下から(translateY 20px)入れる。方向を役割で使い分けている。

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
.sw-Ttl:not(.is-animated){opacity:0;-webkit-transform:translateX(-20px);transform:translateX(-20px)} .js-fade:not(.is-animated){opacity:0;-webkit-transform:translateY(20px);transform:translateY(20px)}
```

移動量は20pxで共通、向きだけ変える。見出しが横、本文が縦なので、同じ画面に両方が登場したとき動きがぶつからず階層が読める。全部translateYで揃えるより情報構造が伝わる。量が同じで向きだけ違うのがポイントで、見出しだけ大きく動かすのは逆効果。

#### 見出しのワイプは、文字を覆う ::after の width を 100%→0 にして引く。right:0 でアンカーするので色ブロックは右へ引き、文字は左から現れる。

確度 **1サイトのみ**（エニーキャリア）／判定 **考え方だけ**

```css
.sw-Ttl .ja{font-size:3rem;font-weight:700;line-height:1;display:inline-block;position:relative;overflow:hidden} .sw-Ttl .ja::after{content:"";display:block;position:absolute;background:#35b1c1;width:100%;height:calc(100% + 10px);top:-5px;right:0} .sw-Ttl.is-animated .ja::after{width:0;-webkit-transition:width .7s .15s cubic-bezier(.22,1,.36,1);transition:width .7s .15s cubic-bezier(.22,1,.36,1)}
```

構造は3点セット:親に position:relative + overflow:hidden + display:inline-block(インラインブロックにしないと幅が文字幅にならず、ブロック幅いっぱいの色帯になって破綻する)。アンカーをright:0にするかleft:0にするかで引く向きが決まる。横書き日本語はright:0(左から文字が出る)が自然。ただし width のアニメはGPU合成されないので、transform:scaleX(1→0)+transform-origin:right に置き換えて流用するのが正解。

#### ワイプの色ブロックは文字boxより上下5pxずつ大きい。height:calc(100% + 10px) と top:-5px のペア。

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
.sw-Ttl .ja::after{content:"";display:block;position:absolute;background:#35b1c1;width:100%;height:calc(100% + 10px);top:-5px;right:0}
```

実装を見ないと絶対分からない類の作法。line-height:1 を指定しても日本語フォントのグリフは行box を上下にはみ出す(特に括弧、濁点、英数混在時のディセンダ)。height:100% ちょうどだと文字の先端がブロックの外に顔を出して、ワイプ前なのに文字が見えてしまう。+10px/-5px は font-size:3rem(30px) に対して約33%の余裕。見出しサイズを変えるならこの10pxも比例で増やす必要がある。

#### 見出しの英語ラベルは opacity:.2 のまま固定で、動くのは translateX だけ。アニメーションの終着点が opacity:1 ではない。

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
.sw-Ttl .en{display:block;opacity:.2;font-size:1.4rem;line-height:1;margin-top:16px;opacity:0;-webkit-transform:translateX(-20px);transform:translateX(-20px)} .sw-Ttl.is-animated .en{opacity:.2;-webkit-transform:translateX(0);transform:translateX(0);-webkit-transition:.5s .2s cubic-bezier(.22,1,.36,1);transition:.5s .2s cubic-bezier(.22,1,.36,1)}
```

既に判明している「英語は装飾」の方針が、モーションの終状態にまで一貫している。0→.2 のフェードなので、英語ラベルは『現れる』というより『薄く滲み出る』。これを 0→1 にすると英語が主役に見えてしまう。登場アニメを作るとき、終状態を反射的に opacity:1 にしないこと。装飾要素は装飾のままフェードインさせる。

#### 見出しの3パーツは 0 → .15s → .2s の順で出る。duration は変えず delay だけずらす。

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
.sw-Ttl{-webkit-transition:.7s cubic-bezier(.22,1,.36,1);transition:.7s cubic-bezier(.22,1,.36,1)} .sw-Ttl.is-animated .ja::after{width:0;-webkit-transition:width .7s .15s cubic-bezier(.22,1,.36,1);transition:width .7s .15s cubic-bezier(.22,1,.36,1)} .sw-Ttl.is-animated .en{opacity:.2;-webkit-transform:translateX(0);transform:translateX(0);-webkit-transition:.5s .2s cubic-bezier(.22,1,.36,1);transition:.5s .2s cubic-bezier(.22,1,.36,1)}
```

全体の枠(opacity+translateX)が delay 0 で .7s、日本語のワイプが delay .15s で .7s、英語が delay .2s で .5s。刻みが .15s / .05s と非常に細かい。人間が『順番に出た』と認識する最小差が .1s 前後なので、.15s はギリギリ知覚できる最小の時間差。これ以上開けると見出しがバラバラに見える。イージングは3つ全部 cubic-bezier(.22,1,.36,1) で統一。

#### スクロール登場のdelayは nth-child ではなく、連番ユーティリティクラスで持つ。WIT STUDIOは delay = 0.2s + N×0.05s の式で1〜100まで100個生成している。

確度 **1サイトのみ**（WIT STUDIO）／判定 **考え方だけ**

```css
.u-animation--delay1{-webkit-transition:opacity .6s .25s .u-animation--delay2{-webkit-transition:opacity .6s .3s .u-animation--delay3{-webkit-transition:opacity .6s .35s .u-animation--delay20{-webkit-transition:opacity .6s 1.2s .u-animation--delay50{-webkit-transition:opacity .6s 2.7s .u-animation--delay99{-webkit-transition:opacity .6s 5.15s .u-animation--delay100{-webkit-transition:opacity .6s 5.2s
```

式は実測で完全一致(N=1→.25s, N=20→1.2s, N=50→2.7s, N=100→5.2s)。クラス数は厳密に100個。基準delay .2s + 刻み .05s。利点はデザイナーが『この要素はステップ7』と指定すれば実装が一意に決まること。7サイト横断で nth-child ベースのスタッガーは0件だったので、彼らは意図的にクラス指定派。ただし100個×ベンダープレフィクス4重書きでこのファイルだけ285KBに膨れている。実務では N=1..12 程度に절って、CSS変数 --d:7 + calc(.2s + var(--d)*.05s) 1ルールにすべき。

#### 登場アニメは opacity と transform で duration とイージングを別々に指定する。opacity は .7s でイージング無指定(既定ease)、transform は .8s でバウンス曲線。

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
transition:opacity .7s .6s,-webkit-transform .8s cubic-bezier(.31,2.8,.5,1.2) .6s transition:opacity .7s .5s,-webkit-transform .8s cubic-bezier(.31,2.8,.5,1.2) .5s transition:opacity .7s .75s,-webkit-transform .8s cubic-bezier(.31,2.8,.5,1.2) .75s
```

delay は両者同じ、duration だけ opacity .7s / transform .8s と 0.1s ずらす。狙いは明確で、不透明度が先に完走するのでバウンスの跳ね返り(y1=2.8の大きなオーバーシュート)が『完全に見えている要素』の上で起きる。逆(transformが先に終わる)だと跳ねている間は半透明で、せっかくのバウンスが見えない。さらにイージングも分けていて、opacityは素のease、動きだけバウンス。1宣言に同じイージングを流すのは手抜きだと分かる。

#### バウンスイージング cubic-bezier(.31,2.8,.5,1.2) は全CSS中240回出るが、実体はWIT STUDIO1サイトのフッター6要素のみ。

確度 **1サイトのみ**（WIT STUDIO）／判定 **考え方だけ**

```css
cubic-bezier(.31,2.8,.5,1.2) .l-footer .l-footer__logo .l-footer .l-footer__sns .l-footer .l-footer__hp .l-footer .l-footer__background
```

y1=2.8 は約2.8倍のオーバーシュート、y2=1.2 で戻りも行き過ぎる二段跳ね。フッターのロゴ/SNS/リンクという『画面最下部の、読まなくてよい要素』だけに使っている。本文やカード一覧には一切使っていない。文字ブロックにこれを当てると読もうとした瞬間に行が跳ねて読めなくなる。ロゴ・アイコン・バッジのような単体図形限定で流用すること。

#### 無限ループの位相差スタッガーには負の animation-delay を使う。-0.1s刻みで11段。

確度 **1サイトのみ**（イロコト）／判定 **流用可**

```css
animation-delay:-.1s animation-delay:-.2s animation-delay:-.3s animation-delay:-.4s animation-delay:-.5s animation-delay:-.6s animation-delay:-.7s animation-delay:-.8s animation-delay:-.9s animation-delay:-1s animation-delay:-1.1s @keyframes sk-circleFadeDelay{0%,100%,39%{opacity:0}40%{opacity:1}}
```

正のdelayだと『全員止まったまま順番に動き出す』立ち上がりが見えてしまう。負のdelayはアニメを途中から開始したことにするので、ページ表示の瞬間から12個全部が別の位相で回っている。ローディングスピナーや脈動する装飾で必須のテクニック。keyframes側も1%フレーム芸で、39%→40%の1%で opacity 0→1 に立ち上げ、40%→100%の60%かけてゆっくり消す(鋭く点いてだらりと消える)。

#### ローディング幕は99%でopacity:0、100%でwidth/heightを0に畳む。JSもpointer-eventsも使わずクリック透過させる。

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
@keyframes fadeOutLoading{0%{opacity:1}99%{opacity:0;width:100%;height:100vh}100%{opacity:0;width:0;height:0}}
```

実装を見ないと分からない作法の典型。opacity:0 の全画面オーバーレイは見えないだけで残り続け、下のリンクが全部クリックできなくなる。普通は pointer-events:none を足すかJSで要素を消すが、この書き方は最後の1%で箱を潰すだけで解決している。99%までフルサイズを維持しているのでフェード中の見た目は変わらない。animation-fill-mode:forwards が必須(畳んだ状態を保持するため)。

#### ホバーで円が縮み、中の矢印は 0.85 × 1.175 ≈ 1 の反比例カウンタースケールで実寸を保つ。

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
.c-btn a:hover > span{-webkit-transform:scale(.85);transform:scale(.85)} .c-btn a:hover > span::after{-webkit-transform:scale(1.175);transform:scale(1.175)} .c-interview-list .c-interview-list__item a:hover .c-interview-list__thumbnail .c-interview-list__arrow::after{-webkit-transform:scale(1.175);transform:scale(1.175)}
```

1 / 0.85 = 1.1765 で、採用値1.175はその丸め。::after は span の子なので transform が乗算され、0.85 × 1.175 = 0.99875 ≒ 1。つまり『円だけが15%縮んで、中のアイコンはピクリとも動かない』。親を縮めれば子も縮むという当たり前の挙動を、子に逆数を当てて打ち消している。アイコン入りの丸ボタンでホバー時にアイコンが潰れて汚くなる問題の正解。.85と1.175はセットで覚える。

#### 下線は transform-origin を right(通常時)→ left(ホバー時)に切り替える。出入りとも左→右に進んで、巻き戻しに見えない。

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
.l-header .l-header__content .l-header__hp a::before{content:"";display:block;position:absolute;bottom:calc(-2 * var(--vw-scale));left:0;-webkit-transform-origin:right;transform-origin:right;width:100%;height:calc(1 * var(--vw-scale));background:#1a7e3a;-webkit-transform:scaleX(0);transform:scaleX(0);-webkit-transition:-webkit-transform .4s;transition:-webkit-transform .4s;transition:transform .4s;transition:transform .4s,-webkit-transform .4s} .l-header .l-header__content .l-header__hp a:hover::before{-webkit-transform-origin:left;transform-origin:left;-webkit-transform:scaleX(1);transform:sc …
```

transform-origin を固定したままだと、マウスを外した線は入ってきた方向へ逆再生で引っ込む(ビデオの巻き戻しに見える)。originを入れ替えると、ホバー時は左端から伸び、離脱時は左端から消えるので線は常に左→右へ流れる。origin:right 14件 / origin:left 14件と完全にペアで出ており、意図的。transform(scaleX)なのでGPU合成され、widthアニメより軽い。

#### ヘッダーの縮小は scale(.85) で行い、height や font-size は触らない。1025〜1500pxでは最初から縮んだ状態。

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
@media print,screen and (min-width:1025px){.l-header.--scroll .l-header__logo{-webkit-transform:scale(.85);transform:scale(.85)} @media print,screen and (min-width:1025px){.l-header.--scroll .l-header__content{-webkit-transform:scale(.85);transform:scale(.85)} @media print,screen and (min-width:1025px) and (max-width:1500px){.l-header:not(.--scroll) .l-header__logo{-webkit-transform:scale(.85);transform:scale(.85)}
```

height/font-size/paddingを個別にアニメすると毎フレーム再レイアウトが走り、スクロール中に重くなる上に中の要素の折返しが変わってガタつく。scaleは合成処理だけで済み、子要素の関係も壊れない。縮小率を.85の1値に決めているので、スクロール時とタブレット幅時で同じ見た目を共有できる。1500px以下では非スクロール時も.85にして、幅が足りないときのロゴ縮小を別途書かずに済ませている。

#### モバイルの移動距離はPCより大きい。登場時の持ち上げが PC 20px → タブレット/SP 3.90625vw(768px時30px)に増える。

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
.js-fade:not(.is-animated){opacity:0;-webkit-transform:translateY(20px);transform:translateY(20px)} @media print,screen and (max-width:1024px){.js-fade:not(.is-animated){-webkit-transform:translateY(3.90625vw);transform:translateY(3.90625vw)}
```

一般論の逆。画面が小さいほど動きを控えるのが普通だが、1.5倍に増やしている。3.90625vw は 768px 時に 30px、かつ root font-size が 1.3020833vw(=768pxで10px)なので厳密に 3rem。理由は、SPでは1画面に入る要素数が少なく縦スクロール量が大きいので、20pxの持ち上げでは登場したことに気づかれないため。PC 2rem / SP 3rem と rem で覚えればブレークポイント間で一貫する。

#### ヒーロー画像のケンバーンズは scale(1.15)→1 のズームアウトで、6.5秒かけて前半偏重のイージングで効かせる。

確度 **1サイトのみ**（エニーキャリア）／判定 **流用可**

```css
@keyframes kvImg{from{-webkit-transform:scale(1.15);transform:scale(1.15)}to{-webkit-transform:scale(1);transform:scale(1)}} animation:kvImg 6.5s cubic-bezier(0,.8,.2,1)
```

方向がズームアウト(拡大→等倍)。ズームインは終端で画像が切れて構図が崩れるが、アウトなら終状態が必ず等倍=デザイン通りの構図に着地する。cubic-bezier(0,.8,.2,1) は立ち上がりで一気に進んで長い減速尾を引く形なので、最初の1秒で大半のズームが済み、残り5秒はほぼ止まって見える『気配だけ動いている』状態。6.5sという長さはこの尾を作るためで、2sでは機械的なズームになる。

#### transition:all は使わない。7サイト中イロコト自社の4件だけで、他6サイトは0件。

確度 **1サイトのみ**（イロコト）／判定 **真似しない**

```css
transition:all .2s linear
```

transition:all は変化しうる全プロパティを監視するので、意図しないプロパティ(width、height、boxの位置)まで巻き込んでアニメし、重くなる上に原因不明のガタつきを生む。6サイトで0件なのは明確な方針。唯一残っている4件は自社サイトという一番古い実装で、彼ら自身も後から辞めたと読める。プロパティは必ず列挙する。

### レスポンシブ

#### レイアウトを担うブレークポイントは1サイトに1本だけ。7サイト中5サイトが1024/1025px、古い2サイトが767/768px。それ以外の数値（1160/1199/1360/1388/1700/1920）は全部ヘッダーとフッターの微調整専用で、コンテンツには一切使っていない。

確度 **7サイト全部**（エニーキャリア・ENILIS・ステイハングリー・NOKID・WIT STUDIO・イロコト・カミナリゲームス）／判定 **流用可**

```css
enilis.style.css の全ブレークポイント値: 1024px 1025px 1920px stayhungry.style.css の全ブレークポイント値: 1024px 1025px 1920px anycareer.style.css の @media 全種: @media (any-hover:hover) @media print and (any-hover:hover),screen and (min-width:1025px) and (any-hover:hover) @media print and (orientation:landscape),screen and (max-width:1024px) and (orientation:landscape) @media print,screen and (max-width:1024px) @media print,screen and (max-width:1160px) @media print,screen and (max-width:1199px) @media print,screen and (max-width:1388px) @media print,screen and (max-width:1700px) @media print,screen and (min-width: …
```

「SP/TAB/PCの3段」ではなく「PCとSPの2段だけ」。ENILISとステイハングリーは1024/1025と1920しか持たず、合計2本で全画面をカバーしている。スマホ専用の追加ブレークポイント（480pxや375px）は7サイト中ゼロ。設計・実装コストが激減するので、まずこの1本主義から始めるべき。

#### モバイル側のデザインキャンバスは7サイト全部768px。vw値は必ず768pxでピッタリ整数pxになるように算出されている。つまり「書いた数値 × 0.488 = iPhone(375px)での実寸px」。コードに書く30pxは画面では14.6pxになる。

確度 **7サイト全部**（イロコト・エニーキャリア・ENILIS・ステイハングリー・NOKID・WIT STUDIO・カミナリゲームス）／判定 **考え方だけ**

```css
vw値の出現頻度（全CSS横断、= px@768 / px@375）: 115 3.90625vw = 30px@768 → 14.6px@375 111 2.6041666667vw = 20px@768 → 9.8px@375 103 5.2083333333vw = 40px@768 → 19.5px@375 70 1.0416666667vw = 8px@768 → 3.9px@375 65 6.5104166667vw = 50px@768 → 24.4px@375 60 13.0208333333vw =100px@768 → 48.8px@375 53 3.125vw = 24px@768 → 11.7px@375 47 3.3854166667vw = 26px@768 → 12.7px@375 46 7.8125vw = 60px@768 → 29.3px@375 46 2.0833333333vw = 16px@768 → 7.8px@375 38 10.4166666667vw = 80px@768 → 39.1px@375 25 3.6458333333vw = 28px@768 → 13.7px@375
```

この換算係数0.488を知らないとSPの数値設計が全部狂う。モバイルで14pxの本文が欲しければCSSには28pxと書く。モバイルの余白を15px見せたければ30pxと書く。間隔の刻みは8/10/12/14/16/20/22/24/26/28/30/32（2px刻み）→40/50/60/70/80/90/100/110/120（10px刻み）と完全にきれい。adapt理由は後述の1024px問題。

#### `clamp()` `min()` を font-size に使っているサイトはゼロ。流体タイポグラフィは一切使わず、全部メディアクエリとvwキャンバスで処理している。`@container` もコンテナクエリ単位(cqw/cqi)も7サイト全部で使用ゼロ。

確度 **7サイト全部**（イロコト・エニーキャリア・ENILIS・ステイハングリー・NOKID・WIT STUDIO・カミナリゲームス）／判定 **考え方だけ**

```css
font-size: clamp( / min( / max( の出現数（全14ファイル）: 0 clamp( の総出現数: anycareer.about.css clamp=6 min=0 max=0 anycareer.style.css clamp=6 min=0 max=0 enilis.style.css clamp=0 min=0 max=4 witstudio.app.css clamp=0 min=0 max=4 irokoto.style.css clamp=0 min=0 max=0 kaminari.style.css clamp=0 min=0 max=0 nokid.common.css clamp=0 min=0 max=0 stayhungry.style.css clamp=0 min=0 max=0 @container / cqw / cqi の出現数: 0
```

一般的なセオリーと真逆。「font-size: clamp(1.6rem, 2vw, 2.4rem)」のような流体タイポは1箇所も使っていない。理由は明白で、rootをvwにしてある時点で全remが自動的に流体になるから、個別のclampは二重管理になる。つまり「clampを使わない」のではなく「rootで一括してclamp相当をやっている」。この思想は流用価値が高い。ただしclampなら下限が入るのに対しvwキャンバスには下限がないので、root側にmin/maxを足すのが正解。

#### ホバーは2重ガード。`any-hover:hover` だけでなく `min-width:1025px` も同時に要求する書式が37回。タッチ対応ノートPCやタブレットでホバーが張り付く問題を潰している。しかも `print and (any-hover:hover)` を併記して印刷でもホバー装飾を効かせている。

確度 **7サイト全部**（イロコト・エニーキャリア・ENILIS・ステイハングリー・NOKID・WIT STUDIO・カミナリゲームス）／判定 **流用可**

```css
68 @media (any-hover:hover) 37 @media print and (any-hover:hover),screen and (any-hover:hover) and (min-width:1025px) 24 @media (hover: hover) 17 @media (any-hover: hover) 5 @media print and (any-hover:hover),screen and (min-width:1025px) and (any-hover:hover) 2 @media print and (any-hover:hover),screen and (any-hover:hover) and (max-width:1024px)
```

7サイト全部が必ずホバーをメディアクエリで囲っている。素の `:hover` を書いているサイトはない。`(any-hover:hover) and (min-width:1025px)` の2重ガードがもっとも堅い書式。ただし `print and (any-hover:hover)` の併記は不要（印刷にホバーは存在しない）。コピーするなら `@media (any-hover:hover) and (min-width:1025px)` だけで十分。

#### 7サイト全部が「PC/SP表示切替ユーティリティ」を `!important` 付きで持つ。block/inline/inline-block/flexの4種が標準で、WIT STUDIOはgrid/inline-gridも追加。命名は3流派（pc_b系／block-Pc系／u-display__block--pc系）。

確度 **7サイト全部**（イロコト・エニーキャリア・ENILIS・ステイハングリー・NOKID・WIT STUDIO・カミナリゲームス）／判定 **流用可**

```css
@media print,screen and (max-width:1024px){.pc_b{display:none!important} @media print,screen and (max-width:1024px){.sp_b{display:block!important} @media print,screen and (max-width:1024px){.sp_f{display:-webkit-box!important;display:-webkit-flex!important;display:flex!important} .pc_ib{display:inline-block!important} .pc_i{display:inline!important} .tab_b{display:none!important} .tab_b{display:block!important} .pc_ri{display:inline!important} .block-Pc{display:block!important} .block-Sp{display:block!important} .inlineBlock-Pc{display:inline-block!important} .flex-Sp{display:-webkit-box!impor …
```

例外なし7/7。日本語サイトでは必須装備。displayの種類ごとにクラスを分けるのが肝（単に .sp-only だと元のdisplayがblockに戻ってflexが壊れる）。イロコトには `.tab_b` というタブレット帯専用もある。WIT STUDIOの `.u-display__inline-block--pc{display:inline-flex!important}` は名前と中身が食い違っているバグ（inline-blockと言いながらinline-flexを当てている）。

#### `@media print,screen and (max-width:1024px)` という書式が927回。これはカンマ区切りなので「print全体」または「screen かつ 1024px以下」の意味になり、印刷時に必ずモバイルレイアウト（768キャンバスのvw）が適用される。`min-width:1025px` 側も印刷にマッチするので、どちらが勝つかはソース順次第という不定な状態。

確度 **7サイト全部**（イロコト・エニーキャリア・ENILIS・ステイハングリー・NOKID・WIT STUDIO・カミナリゲームス）／判定 **真似しない**

```css
927 @media print,screen and (max-width:1024px) 287 @media print,screen and (min-width:1025px) 103 @media print,screen and (max-width:767px) 38 @media print,screen and (min-width:768px) 144 @media print, screen and (max-width: 767px) 125 @media print, screen and (min-width: 768px) witstudio.app.css: 277 @media print,screen and (max-width:1024px) / 264 @media print,screen and (min-width:1025px)
```

7サイト全部が同じ書き方をしているが間違っている。`print,screen and (max-width:1024px)` は `(print) OR (screen AND max-width:1024px)` と解釈される。印刷プレビューでSPとPCの両方のブロックが適用され、vwの基準幅も印刷メディアでは不定。会社概要や採用要項を印刷する需要がある業種（たけい事務所のような士業は特に）では致命的。正しくは `@media screen and (max-width:1024px)` にして、印刷用は別に `@media print{}` を1本書く。NOKIDだけは `@media screen and (max-width:1024px)` が183回で正しく書けている（print併記は8回だけ）。

#### 1rem=10pxにするrootの切り替え方に3方式ある。(A)PC固定10px＋SPだけvw（エニーキャリア）(B)PCもSPも完全vw、固定値なし（ENILIS、ステイハングリー）(C)3段：通常10px固定／1921px以上でvw拡大／1024px以下でvw（WIT STUDIO）。イロコトとカミナリは62.5%固定のみ、またはroot指定なし。

確度 **ほぼ全サイト**（エニーキャリア・ENILIS・ステイハングリー・WIT STUDIO・イロコト）／判定 **考え方だけ**

```css
html{font-size:62.5%;line-height:1} @media print,screen and (max-width:1024px){html{font-size:1.3020833333vw} html{height:100%;min-height:100%;font-size:.5208333333vw;line-height:1;-webkit-font-feature-settings:"palt" 1;font-feature-settings:"palt" 1} html{height:100%;min-height:100%;font-size:.5208333333vw;line-height:1} html{font-size:62.5%} @media print,screen and (min-width:1921px){html{font-size:.5208333333vw}} @media print,screen and (max-width:1024px){html{font-size:1.3020833333vw}
```

(B)方式は危険。`html{font-size:.5208333333vw}`にmin()の下限がないので、1280pxのノートPCでは1rem=6.67pxになり16px想定の本文が10.7pxで表示される。採用するなら(C)方式か、せめて `font-size:max(.5208333333vw, 10px)` と下限を入れるべき。(A)は無難で、PCは普通にpx/rem固定、SPだけ可変というもっとも読みやすい構成。

#### 1024px以下がSPブロックで、そのキャンバスが768px。上限キャップがないので、iPad横（1024px）ではモバイルレイアウトが1.333倍に拡大表示される。本文26pxのつもりが34.7pxで出る。7サイト中5サイトが769〜1023pxの間にメディアクエリを1本も持たない。

確度 **ほぼ全サイト**（エニーキャリア・ENILIS・ステイハングリー・NOKID・WIT STUDIO）／判定 **真似しない**

```css
@media print,screen and (max-width:1024px){html{font-size:1.3020833333vw} ← 5ファイルで一致 @media print,screen and (max-width:1024px){:root{--vw-base:768;--vw-scale:calc(100vw / var(--vw-base))} .sw-Txt{line-height:2.2;font-size:3.3854166667vw} ブレークポイント値の全列挙: enilis.style.css: 1024px 1025px 1920px stayhungry.style.css: 1024px 1025px 1920px witstudio.app.css: 1024px 1025px 1360px 1361px 1440px 1500px 1520px 1600px 1680px 1920px 1921px nokid.common.css: 768px 1024px 1025px 1360px 1361px 1920px
```

1.3020833333vw も calc(100vw / 768) も上限がない。1024pxでは1rem=13.33pxになり、3.3854166667vw=34.7px。iPad横で見ると文字も余白も1/3増しのでかさで、「タブレット対応」として成立していない。真似するなら `html{font-size:min(1.3020833333vw, 10px)}` または `--vw-scale:min(calc(100vw / 768), 1px)` でキャップを入れること。もしくはSPブレークポイントを767pxにして（イロコト／カミナリ方式）、768〜1024はPCレイアウトに任せる。

#### モバイルのコンテナ幅はcalc(100% - 余白)ではなく「vwのパーセンテージ」で直接指定する。本文コンテナは86.98vw（＝左右6.51%＝50px@768＝実寸24.4px@375）か92.19vw（＝左右30px@768＝実寸14.6px@375）の2系統。KVだけ96.09vwでほぼ全幅。

確度 **ほぼ全サイト**（エニーキャリア・イロコト・WIT STUDIO）／判定 **流用可**

```css
.subpage-Inner{width:clamp(10px,90%,1200px);margin:0 auto} .subpage-Inner{width:86.9791666667vw} .st-Footer_Inner{width:calc(100% - 12.5vw)} →SP: .st-Footer_Inner{width:86.9791666667vw} .index-KV_Inner || PC=calc(100% - 7.2916666667vw) SP=96.09375vw .st-Header_Nav_Inner || PC=- SP=82.8125vw .sp_Inner{width:85.9375vw;margin:0 auto} .p-home-message .p-home-message__inner{width:calc(1200 * var(--vw-scale))} .p-home-message .p-home-message__inner{width:calc(708 * var(--vw-scale))}
```

vw指定にすると画面幅が変わってもガター比率が固定され、どのスマホでも「左右6.5%」という見え方が一致する。pxのpaddingだと320pxでは窮屈、430pxでは余りすぎる。覚える数値は3つだけ：86.98vw（＝標準本文、375pxで左右24px）、92.19vw（＝広め、375pxで左右15px）、96.09vw（＝KVほぼ全幅）。ドロワーメニューだけ82.81vwでさらに内側に寄せている。

#### 左右ガターは全プロパティの中でもっとも強く圧縮される。PC100px→SP30px@768（実寸14.6px@375）で比率0.15。一方セクション間の縦余白は0.26〜0.49、本文サイズは0.79。「横は潰す、縦はそれなり、文字はあまり変えない」という非対称な圧縮設計。

確度 **ほぼ全サイト**（ENILIS・ステイハングリー・エニーキャリア・イロコト）／判定 **流用可**

```css
.index-Service .service-Layout || PC=0 5.2083333333vw SP=0 3.90625vw .index-News .news-Layout || PC=0 5.2083333333vw SP=0 3.90625vw .index-Nav .nav-Layout || PC=0 5.2083333333vw SP=0 3.90625vw （5.2083333333vw=100px@1920 / 3.90625vw=30px@768=14.6px@375 → 比率0.146） margin-top のPC→SP@375px実測比率: n=102 p25=0.47 median=0.61 p75=0.78 padding のPC→SP@375px実測比率: n=73 p25=0.49 median=0.59 p75=0.78 font-size のPC→SP@375px実測比率: n=172 帯別 median 0.49〜0.81 大きいセクション間余白の実測: enilis .index-Service PC=260px SP@768=246px SP@375=120.1px ratio=0.46 stayhungry .index-Conclusion PC=240px SP@768=190px SP@375=92.8px ratio= …
```

数値で直接使える。PCで200〜260pxのセクション間余白はスマホで80〜120pxに（0.4倍）、PCで100pxの左右ガターはスマホで15pxに（0.15倍）。逆に小さい余白（PC20〜40px）はほぼ等倍のまま。一律0.5倍で縮めると横がゆるすぎ、縦が詰まりすぎる。

#### セクション余白のSP値は「PCのpx数値をそのまま768キャンバスに書く」ことが多い。手で選び直していない。結果として実寸は自動的に0.488倍になる。

確度 **ほぼ全サイト**（イロコト・ステイハングリー・ENILIS・エニーキャリア）／判定 **流用可**

```css
irokoto .index-Works PC=100px SP@768=100px SP@375=48.8px ratio375=0.49 irokoto .index-Blog PC=100px SP@768=100px SP@375=48.8px ratio375=0.49 irokoto .index-Services PC=100px SP@768=100px SP@375=48.8px ratio375=0.49 irokoto .st-Contact PC=80px SP@768=80px SP@375=39.1px ratio375=0.49 stayhungry .st-Footer PC=100px SP@768=100px SP@375=48.8px ratio375=0.49 enilis .sw-Form PC=80px SP@768=80px SP@375=39.1px ratio375=0.49 anycareer.about .subpage-List PC=90px SP@768=90px SP@375=43.9px ratio375=0.49 stayhungry .index-Works PC=184px SP@768=180px SP@375=87.9px ratio375=0.48 stayhungry .sw-Form .form-Sub …
```

作業ショートカットとして実用的。SPの余白設計で迷ったら「PCと同じ数値を768キャンバスに置く」が初期値になる。それで実寸が自動的に約半分になり、見た目の縮小率0.49が自然に出る。ただし大きい値（200px超）はこれだと詰まりすぎるので0.7〜0.85掛けで書き直している（260→246、240→190）。

#### モバイルのタイプスケールは一律縮小ではなく「圧縮」される。小さい文字はほぼそのまま、ディスプレイ文字は半分になる。PC12px→実寸9.8px(0.81)／16px→12.7px(0.79)／18px→14.6px(0.75)／28px→16.6px(0.59)／34px→23.4px(0.69)／108px→56.6px(0.49)。

確度 **ほぼ全サイト**（エニーキャリア・ENILIS・ステイハングリー・イロコト・WIT STUDIO）／判定 **考え方だけ**

```css
PC 0-12px n=26 medianPC=12.0 -> SP@375=9.8px ratio=0.81 PC 13-16px n=95 medianPC=16.0 -> SP@375=12.7px ratio=0.79 PC 17-22px n=21 medianPC=18.0 -> SP@375=14.6px ratio=0.75 PC 23-32px n=7 medianPC=28.0 -> SP@375=16.6px ratio=0.59 PC 33-48px n=10 medianPC=34.0 -> SP@375=23.4px ratio=0.69 PC 49px+ n=13 medianPC=108.0-> SP@375=56.6px ratio=0.49 実例（コードに書く数値の倍率）: .sw-Txt || PC=1.6rem SP=3.3854166667vw （16px → 26px@768 = ×1.63） .sw-Subheading || PC=1.8rem SP=3.6458333333vw （18px → 28px@768 = ×1.56） .sw-Heading || PC=3.4rem SP=6.25vw （34px → 48px@768 = ×1.41） .sw-Ttl .ja || PC=3rem SP=4.4270833333vw （ …
```

コードに書く倍率のルール：本文〜中見出し（PC12〜40px）は×1.4〜1.65で書く／大見出し（PC100px超）は×0.74〜1.2で書く／PC42px前後は等倍で書く。つまりスケールの上下の開きがスマホでは詰まる。adapt理由：PC12px→実寸9.8pxは小さすぎる（WCAGの実用下限を割る）。キャプションや英語ラベルの最小値は768キャンバスで28px（=実寸13.7px）以上にすべき。

#### グリッドの潰し方は「3列→1列」が主流で、2列は経由しない。例外はWIT STUDIO（最新サイト）だけが「3列→2列」。しかも1列に潰すとき `gap:0` にして、カード個別の背景ではなくリスト自体に背景・角丸・影を付け替え、3枚のカードが1枚の分割カードに変わる。

確度 **ほぼ全サイト**（エニーキャリア・ENILIS・ステイハングリー・WIT STUDIO）／判定 **流用可**

```css
.index-Sustainability_Contents_List{display:grid;grid-template-columns:repeat(3,1fr);margin-top:50px;gap:0 24px} .index-Sustainability_Contents_List{grid-template-columns:repeat(1,1fr);margin-top:7.8125vw;gap:0;background:#fff;border-radius:.78125vw;-webkit-box-shadow:0 0 2.6041666667vw .6510416667vw #ebebeb;box-shadow:0 0 2.6041666667vw .6510416667vw #ebebeb} .index-Services_Contents_List{margin-top:40px;display:grid;grid-template-columns:repeat(3,1fr);gap:0 20px} .index-Services_Contents_List{grid-template-columns:repeat(1,1fr);gap:2.0833333333vw 0;margin-top:7.8125vw} .sw-NewsArchive .newsA …
```

「3列→2列→1列の3段階」という定石を使っていない。1024pxで一気に1列にする。そのうえ `gap:0`＋リストに背景を移すというのは実装を見ないと絶対に気づけない。1列化でカード間に隙間を残すと「縦に並んだ3枚の浮いた板」になるが、gapを0にして外側に影を移すと「1枚のリストカード」になり、スマホでまとまりが出る。

#### gapはPCで `0 X`（列方向だけ）、SPで `Y 0`（行方向だけ）に軸を入れ替える。縦横の値を両方書いたままにせず、使わない軸は必ず0にしている。

確度 **ほぼ全サイト**（エニーキャリア・ENILIS・ステイハングリー）／判定 **流用可**

```css
.index-Services_Contents_List || PC=0 20px SP=2.0833333333vw 0 .subpage-Intro || PC=0 56px SP=5.2083333333vw .subpage-List_Item || PC=0 60px SP=6.5104166667vw .sw-Contact .contact-Heading || PC=0 4.0625vw SP=6.5104166667vw 0 .index-Services .services-Heading || PC=0 4.0625vw SP=6.5104166667vw 0 .index-Clients .clients-Heading || PC=0 6.9270833333vw SP=6.5104166667vw 0 .st-Footer .footer-Access || PC=0 1.0416666667vw SP=3.125vw 0 .sw-Services || PC=.625vw .625vw SP=1.3020833333vw 0 .index-Hero .hero-Text .hero-Text_Catch || PC=0 2.03125vw SP=1.5625vw 0 .sw-NewsArchive .newsArchive-List || PC=2. …
```

`gap: 2.0833333333vw 0` のように使わない軸を明示的に0にしておくと、将来レイアウトを変えたとき予期しない隙間が出ない。地味だが7サイトで徹底されている。セクション見出しもPCは横並び（0 78px）、SPは縦積み（50px 0）に軸が回る。

#### ナビゲーションのリストはPCでflex横並び、SPで `grid-template-columns:repeat(2,1fr)` に変わる。1列に潰すのではなく、スマホで列数が「増える」。ヘッダードロワーもフッターナビも同じ型。

確度 **ほぼ全サイト**（WIT STUDIO・ステイハングリー・ENILIS・エニーキャリア）／判定 **流用可**

```css
.l-header .l-header__content .l-header__navigation{display:flex;align-items:center;gap:calc(38 * var(--vw-scale));-webkit-transition:gap .4s;transition:gap .4s} .l-header .l-header__content .l-header__navigation{display:grid;grid-template-columns:repeat(2,1fr);gap:calc(80 * var(--vw-scale)) calc(40 * var(--vw-scale))} .st-Header .header-Nav .nav-List{display:flex;gap:0 34px} .st-Header .header-Nav .nav-List{padding:0 17.1875vw;display:grid;justify-content:start;grid-template-columns:repeat(2,1fr);gap:11.71875vw 26.0416666667vw} .st-Footer .footer-Nav .nav-List{display:flex;gap:0 2.0833333333vw …
```

セオリー逆。「スマホは1カラム」の反対で、ナビだけは縦1列に伸ばさず2列にして画面内に収めている。行gapが90〜100px@768（実寸44〜49px）と大きいのでタップしやすく、しかもスクロールが要らない。ドロワーの行gapが異常にデカいのは全画面メニューを「余白で見せる」ための意図的な設計。

#### PCの2カラムは `repeat(2,1fr)` ではなく「固定px + 1fr」の非対称。290px/380px/550px/850px/260px/115px など。SPで1列化するとき `1fr` ではなく `100%` と書く。ただし会社概要の定義リストだけは2列を維持して固定列をvwに置換する。

確度 **ほぼ全サイト**（エニーキャリア・ENILIS・ステイハングリー・WIT STUDIO）／判定 **流用可**

```css
.st-Footer_Inner || PC=290px 1fr SP=100% .subpage-Intro || PC=380px 1fr SP=100% .subpage-List_Item || PC=550px 1fr SP=100% .subpage-2Col || PC=260px 1fr SP=100% .index-Recruit_Contents || PC=850px 1fr SP=100% .index-KV_News || PC=115px 1fr SP=- .index-Services_Contents || PC=850px 1fr SP=- .sw-Form .form-Item || PC=13.5416666667vw 1fr SP=1fr .st-Footer .footer-Content-top || PC=18.2291666667vw 1fr SP=- .l-footer .l-footer__navigation || PC=repeat(2,1fr) SP=calc(260 * var(--vw-scale)) auto .company-List || PC=260px 1fr SP=24.7395833333vw 1fr ← 2列維持（190px@768） @media print,screen and (max-width: …
```

「固定px + 1fr」は見出し列とテキスト列の関係が崩れないので、画面幅が変わっても見出しの折り返し位置が動かない。1frと1frだと両方伸び縮みして可読幅が崩れる。SPで `100%` と書くのは意図の明示（「1列しかない」という宣言）。会社概要のdlだけ2列維持（190px 1fr）は、項目名が短いので潰す必要がないという判断。

#### モバイルの主要ボタン高さは `13.0208333333vw` = 100px@768 = 実寸48.8px@375 で3サイト共通。PCの高さ58〜80pxから「数値は上げて実寸はタップ可能な48pxに着地させる」という設計。円形ボタンはPC50〜80px→SP100px@768。

確度 **ほぼ全サイト**（イロコト・ENILIS・ステイハングリー・WIT STUDIO）／判定 **流用可**

```css
.sw-Btn{width:280px;height:60px} .sw-Btn{width:57.2916666667vw;height:13.0208333333vw} .sw-CircleBtn || PC=4.1666666667vw SP=13.0208333333vw .index-Nav .nav-Layout .nav-List .nav-Item .item-Link .sw-CircleBtn || PC=2.6041666667vw SP=13.0208333333vw .sw-TextAndBtn .textAndBtn-Content .textAndBtn-Btn || PC=4.1666666667vw SP=13.0208333333vw .swiper .swiper-nav .swiper-button || PC=4.1666666667vw SP=13.0208333333vw .c-btn a || PC=calc(58 * var(--vw-scale)) SP=calc(86 * var(--vw-scale)) .c-btn a.c-btn__arrow > span || PC=calc(40 * var(--vw-scale)) SP=calc(56 * var(--vw-scale)) （13.0208333333vw の全CS …
```

13.0208333333vw という値が3サイト・60回出てくる事実上のトークン。375pxで48.8px＝Googleの推奨48pxにぴったり着地する。逆に言えば320pxのスマホでは41.7pxまで落ちるので、本当に最小端末を気にするなら `max(13.0208333333vw, 44px)` にする。WIT STUDIOのcalc(86)は実寸42px@375でやや小さい。

#### 中間ブレークポイント（1160/1199/1360/1388/1700px）はヘッダーとフッターの修正にしか使われていない。コンテンツセクションの数値は一切触らない。WIT STUDIOの1360〜1680pxの5本はヒーロー装飾の座標補間専用。

確度 **ほぼ全サイト**（エニーキャリア・NOKID・WIT STUDIO）／判定 **流用可**

```css
@media print,screen and (max-width:1160px) の中身（全3件）: .st-Header_Logo {width:179.99982px;height:119.99988px} .st-Header_Logo_Anchor {padding:26.66664px} .st-Header_Menu_Item + .st-Header_Menu_Item {margin-left:32px} @media print,screen and (max-width:1388px): .st-Footer_Inner {width:clamp(10px,90%,1200px)} @media print,screen and (max-width:1700px): .st-Footer_Menu {display:grid;grid-template-columns:180px 188px 233px 1fr;grid-template-columns:160px 168px 169px 169px 118px;gap:64px 0} @media screen and (max-width:1360px) / (min-width:1361px)（NOKID）: .st-Header_Nav .globalnav { margin-right: 50p …
```

役割分担が明確で設計しやすい。「レイアウト用の1本（1024px）」＋「ヘッダー専用の微調整（1160や1360）」。ヘッダーは横一列に固定数の要素を並べるので幅に一番敏感で、コンテンツより早く限界が来る。だから微調整のブレークポイントはヘッダー/フッターに集中する。これを知っていればブレークポイントを増やすべき場所が判断できる。

#### レガシープレフィックスが大量に残っている。`display:-webkit-box` が全ファイルで20〜43回、`-ms-grid-*` がイロコト32回・エニーキャリア14回。WIT STUDIOには未コンパイルのSass変数 `--text-color:$green` が本番CSSに漏れている。

確度 **ほぼ全サイト**（イロコト・エニーキャリア・ENILIS・ステイハングリー・WIT STUDIO・カミナリゲームス）／判定 **真似しない**

```css
display:-webkit-box の出現数: anycareer.about.css: 19 / anycareer.style.css: 21 / enilis.style.css: 25 irokoto.style.css: 24 / kaminari.style.css: 26 / nokid.common.css: 3 stayhungry.style.css: 31 / witstudio.app.css: 43 -ms-grid の出現数: anycareer.about.css: 14 / anycareer.style.css: 14 / irokoto.style.css: 32 anycareer.about [SP] .st-Footer_Logo {-ms-grid-row:3;-ms-grid-column:1} anycareer.about [SP] .st-Footer_Bottom {-ms-grid-row:5;-ms-grid-column:1;-ms-grid-column-span:1} :root{--vw-base:1920;--vw-min:1360;--text-color:$green;--vw-scale:max(calc(100vw / var(--vw-base)), 1px);--index-gallery-widt …
```

`display:-webkit-box` は2009年版flexbox仕様で、iOS 6以前・Android 4.3以前しか必要ない。`-ms-grid-*` はIE11専用で、IE11は2022年にサポート終了。`-ms-high-contrast` も非推奨。autoprefixerのtargetsが10年前のまま放置されている。CSS容量が1.3MBある原因の一部。`--text-color:$green` はSassのビルド設定ミスで、このカスタムプロパティを参照している箇所は全部無効値になる。autoprefixerは `> 0.5%, last 2 versions, not dead` 程度にすべき。

#### clamp()はfont-sizeではなく「コンテナ幅」専用に使われている。書式は必ず `clamp(10px, 90%, 1200px)` で、第1引数の10pxはダミーの下限、実質は「親の90%、最大1200px」。PC本文コンテナは1200px、ワイド行は1560px。

確度 **複数サイト**（エニーキャリア・WIT STUDIO）／判定 **流用可**

```css
.subpage-Inner{width:clamp(10px,90%,1200px);margin:0 auto} .index-Services_Contents{width:clamp(10px,90%,1200px) .index-Sustainability_Contents{position:relative;width:clamp(10px,100%,1200px) .index-Sustainability_Contents_Inner{width:clamp(10px,90%,960px) .index-Recruit_Contents{width:clamp(10px,90%,1200px) .index-About_Contents{position:relative;width:clamp(10px,90%,960px) @media print,screen and (max-width:1388px){.st-Footer_Inner{width:clamp(10px,90%,1200px) .l-sub .l-sub__inner{width:calc(1200 * var(--vw-scale))} .p-home-recruit .p-home-recruit__inner{max-width:calc(1560 * var(--vw-scale) …
```

`width:clamp(10px, 90%, 1200px)` はmax-width+paddingの組み合わせより宣言が1本で済む。90%という指定なので、1333px以下の画面では左右5%ずつの可変ガター、それ以上では1200px固定＋余り。ブレークポイント不要でガターが成立する。PC本文幅1200px／ワイド1560pxという数値セットも7サイトで共通性が高い。

#### line-heightはモバイルで「詰まる」。本文2.4→2.2、見出し1.7→1.6、リード240%→200%。ただしディスプレイ級の大文字だけは逆に140%→170%に緩む。

確度 **複数サイト**（エニーキャリア・ENILIS）／判定 **流用可**

```css
.sw-Txt{font-size:1.6rem;line-height:2.4} .sw-Txt{line-height:2.2;font-size:3.3854166667vw} .sw-Heading || PC=1.7 SP=1.6 .sw-Txtarea || PC=2.4 SP=2.2 .st-Footer_Bottom || PC=240% SP=2 .subpage-Intro_Heading || PC=1.7 SP=1.6 .index-Hero .hero-Content .hero-Introduction .introduction-Text || PC=240% SP=200% .index-Service .service-Layout .service-Content .catch || PC=140% SP=170%
```

一般のセオリー逆。「スマホは行間を広げて読みやすく」が定説だが、彼らは詰めている。理由は推測できる：測幅が狭い（375pxで約24文字）ので行送りが同じだと縦に伸びすぎてスクロール量が増える。逆に大見出しはスマホで3〜4行に折り返すので、PCの140%だと窮屈になるため170%に緩める。PC本文240%というのも和文としてかなり大きい（欧文の1.5の1.6倍）。

#### モバイルで `display:none` にするのは装飾レイヤーと英語サブラベル。カミナリゲームスは `.deco-shapes` `.deco-pattern` `.deco-text` `.deco-edge span` `.pagetitle-sub` `.idx-Columntitle span.sub` `.main-scroll` を全部消している。縮小ではなく削除。

確度 **複数サイト**（カミナリゲームス・エニーキャリア）／判定 **考え方だけ**

```css
kaminari.style | .deco-edge.responsive span kaminari.style | .deco-edge span kaminari.style | .st-Contents.lower .deco-pattern kaminari.style | .st-Footer .deco-shapes kaminari.style | .sw-Pagetitle .deco-text kaminari.style | .sw-Pagetitle_Inner .pagetitle-sub kaminari.style | .idx-Columntitle span.sub kaminari.style | .idx-Main_Inner .main-scroll kaminari.style | .idx-Works .deco-shapes kaminari.style | .idx-Services .deco-shapes kaminari.style | .idx-Recruit .deco-shapes anycareer.style | .index-KV_News_Ttl anycareer.style | .index-KV_News_Contents .sw-Link .txt anycareer.style | .index-Ser …
```

装飾を小さくして残すのではなく消す、という判断。SP側のdisplay:noneが65件に対しPC側は10件（しかもほぼ全部ハンバーガー関連）。つまりモバイルは「PCの引き算版」で、SP専用の追加要素はほぼない。adapt理由：英語サブラベルを消すとSEO・情報設計上の意味が変わる場合があるので、消す対象は純装飾だけに絞るべき。『main-scroll』（スクロール誘導）を消すのは妥当。

#### 画像の出し分けは `<picture><source media="(max-width: 1024px)">` で、CSSと同じ1024/1025境界を使う。アセットは `assets/{webp,images}/{pc,sp,common}/` の3フォルダ構成。古い3サイト（イロコト・カミナリ・ステイハングリー）はpicture未使用で、PC用SP用の2つのimg/svgをクラスで切り替えている。

確度 **複数サイト**（WIT STUDIO・エニーキャリア・NOKID・ステイハングリー・イロコト・カミナリゲームス）／判定 **流用可**

```css
HTML内のレスポンシブ画像技術: anycareer.html picture=8 source[media]=16 srcset=16 enilis.html picture=1 source[media]=2 srcset=3 irokoto.html picture=0 source[media]=0 srcset=4 kaminarigames.html picture=0 source[media]=0 srcset=0 nokid.html picture=5 source[media]=8 srcset=9 stayhungry.html picture=0 source[media]=0 srcset=0 witstudio.html picture=34 source[media]=21 srcset=48 source の media 値の全列挙: 30 media="(max-width: 1024px)" 15 media="(min-width: 1025px)" 2 media="(max-width: 767px)" <picture> <source media="(max-width: 1024px)" srcset=".../assets/webp/sp/index/bg_hero.webp" type="image/webp"/> <sour …
```

納品時のアセット命名がそのまま決まる：pc/sp/common × webp/png の6通り。1枚のpictureにsource4本（sp-webp / sp-png / pc-webp / pc-png）＋img。ブレークポイント非依存の画像は `common/` に入れてmedia属性を省く。古いサイトのクラス切り替え方式は両方ダウンロードされるので避けるべきだが、ロゴタイプだけは別（横組1307×183 / 縦組593×352 とアスペクトが全く違うのでSVGを2本持つのが正解）。

#### 横スクロールは表には使わず、パンくずとカテゴリナビに使っている。表の横スクロール実装は7サイトで1件もない。

確度 **複数サイト**（エニーキャリア・イロコト・NOKID・WIT STUDIO）／判定 **流用可**

```css
anycareer.about [BASE] .sub-Breadcrumb {border-top:1px solid rgba(32,32,32,.1);background:#fff;overflow-x:auto} irokoto.style [SP] .category_Nav {overflow-x:scroll;-webkit-overflow-scrolling:touch;padding:2.6041666667vw 0;margin:5.2083333333vw auto} nokid.common [BASE] .breadcrumb .breadcrumb-list { width: fit-content; display: flex; align-items: center; white-space: nowrap; overflow-x: scroll; padding: 1vw 0; } witstudio.app [BASE] .p-home-faq .p-home-faq__tab .swiper-wrapper {display:flex;gap:calc(40 * var(--vw-scale));overflow-x:scroll;-ms-overflow-style:none;scrollbar-width:none}
```

`width:fit-content; white-space:nowrap; overflow-x:scroll` の3点セットがパンくずの定番。FAQタブはswiperに `scrollbar-width:none` と `-ms-overflow-style:none` を足してスクロールバーを隠している（スワイプ前提）。会社概要などの表は横スクロールにせず定義リストの2列（190px 1fr）で成立させているので、そもそも横スクロール表が要らない設計になっている。

#### vh単位はほとんど使わない（14ファイル中4ファイル、最大8箇所）。全画面ヒーローは100vhではなく「100vh＋vwベースのmax-height/min-height」で挟む。モバイルだけJSの `--vh` カスタムプロパティに差し替える。

確度 **複数サイト**（ENILIS・エニーキャリア・WIT STUDIO）／判定 **流用可**

```css
.index-Hero{width:100%;height:100vh;max-height:55.2083333333vw;min-height:37.2395833333vw;padding-bottom:9.53125vw;position:relative;z-index:1} @media print,screen and (max-width:1024px){.index-Hero{height:calc(var(--vh) * 1px);max-height:174.21875vw;min-height:131.7708333333vw;padding-bottom:11.5885416667vw} .sw-Youtube{display:none;width:100%;height:100vh;height:100dvh;position:fixed;top:0;left:0;z-index:7000} .sw-Youtube_Content{max-width:100%;height:100vh;height:100dvh;margin:0 auto;position:fixed;top:50%;transform:translateY(-50%);left:0;right:0;z-index:7010} .st-Header_Nav {width:100%;po …
```

`height:100vh; max-height:55.2083333333vw; min-height:37.2395833333vw` は1920px換算でmax1060px / min715px。これでヒーローが縦長モニタで間延びせず、横長モニタで潰れない。アスペクト比をvwで縛るというのは思いつきにくい。`height:100vh; height:100dvh` の2行併記はiOSアドレスバー対策の最小コスト版（dvh非対応ブラウザは1行目を使う）。これは今すぐ流用できる。

#### 中間帯の値がSassの係数掛け算で生成され、5〜7桁の小数pxとして本番に出ている。カミナリの768〜1280px帯は71ルール全部がデスクトップ値×0.6666で、`font-size:7.99992px` や `1075.98924px` のような値が並ぶ。エニーキャリアのヘッダーロゴも `179.99982px`。

確度 **複数サイト**（カミナリゲームス・エニーキャリア）／判定 **真似しない**

```css
@media print, screen and (min-width: 768px) and (max-width: 1280px) の中身（抜粋）: .sw-Button.responsive { width: 239.9976px; height: 47.99952px; font-size: 13.3332px; } .idx-Columntitle span.ja { height: 56.6661px; margin: 3.99996px 0 0 13.3332px; font-size: 7.99992px; } .idx-Main_Inner .main-catchs span.ja { margin: 26.6664px 0 0; font-size: 25.33308px; } .idx-Main_Inner .main-scroll span { font-size: 9.33324px; } .idx-News_Inner h2 { margin: 0 26.6664px 0 0; padding: 0 26.6664px 0 0; font-size: 13.3332px; } .idx-News_Inner .news-title { margin: 0 0 0 13.3332px; font-size: 9.33324px; } .idx-Works_ …
```

3つ問題がある。(1) 保守不能：71ルール全部に手計算の係数が焼き込まれていて、1つ直すと全部ずれる (2) `font-size:7.99992px` `9.33324px` は和文で8〜9pxで、1280pxのノートPCで実際に出る。読めない (3) `.st-Footer_Menu` は `grid-template-columns` を2回宣言していて1本目が死んでいる。中間帯を縮めたいなら係数の掛け算ではなくroot側のvwスケール（WIT STUDIO方式）で一括処理すべき。

#### `overflow-x:hidden` のガードをbodyに入れているのは7サイト中3サイトだけ（イロコト、カミナリ、WIT STUDIO）。vwを多用する設計でこれがないのは危ない。

確度 **複数サイト**（イロコト・カミナリゲームス・WIT STUDIO）／判定 **真似しない**

```css
irokoto.style [BASE] body {margin:0 auto;font-family:source-han-sans-japanese,Noto Sans Japanese,Hiragino Kaku Gothic ProN,...} kaminari.style [BASE] body { witstudio.app [BASE] body {font-family:"Zen Kaku Gothic New","Helvetica Neue",Arial,"Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif;-webkit-font-smoothing:antialiased;word-wrap:break-word;overf... （body/html に overflow-x:hidden があるのは上記3ファイルのみ。anycareer / enilis / stayhungry / nokid にはない） min-width:Npx 宣言の全集計: 355 min-width:1025px 239 min-width:768px 19 min-width:1200px 14 min-width:1920px 6 min-width:1361px 5 min-width:1px 2  …
```

`100vw` や `96.09375vw` のような値を使うとスクロールバー分（Windowsで約15px）だけ横にはみ出す。bodyに `overflow-x:hidden` がない4サイトは、Windows+Chromeで横スクロールバーが出る可能性がある。vwベースの設計をするなら必須のガード。なおページ全体のmin-width下限はカミナリの1280pxを除いて7サイト全部でゼロなので、320pxまで無限に縮み続ける。

#### ブランドアセットだけは `min-width` のpx下限で縮小を止める。ステイハングリーのロゴは `width:13.6979166667vw; min-width:220px`（=263px@1920、画面1606px以下で220px固定）。ヘアラインは `max(Xvw, 1px)` で最低1pxを保証。

確度 **複数サイト**（ステイハングリー・ENILIS・WIT STUDIO）／判定 **流用可**

```css
.st-Header .header-Logo{width:13.6979166667vw;min-width:220px;position:fixed;top:2.6041666667vw;left:3.3854166667vw;-webkit-transition:.3s;transition:.3s} .st-Header.is-Scrolled .header-Logo{width:7.8125vw;min-width:150px;position:fixed;top:18px;left:3.3854166667vw} border-left:max(.2083333333vw,1px) solid #181818 border-left:max(.5208333333vw,1px) solid #181818 （enilis.style.css の max() 使用は全4件すべてborder、他用途ゼロ） .p-home-hero .p-home-hero__content{padding:0 max(calc(calc(110 * var(--vw-scale)) - 1680px * .125 + 100vw * .125),calc(60 * var(--vw-scale)))} right:max(calc(calc(54 * var(--vw-scale)) - …
```

完全可変vw設計の唯一の救命弁。`max(.2083333333vw, 1px)` は「1920pxでは4pxの太い罫線、小さい画面でも1px以下にはしない」という意味。これがないと1280pxで2.6px、375pxで0.78pxになり罫線が消えたり滲む。ロゴの `min-width:220px` も同じ発想で、vwで素直に縮めるとロゴが読めなくなるから下限を切る。ENILISはmax()をborderにしか使っていない（4件中4件）のが示唆的で、「vwで壊れるのは1px級の細部だけ」と見切っている。

#### SPでの並び替えはflexの `order` ではなく「gridの明示配置」と「column-reverse」の2手。ENILISは見出しブロックに `column-reverse` を当てて、日本語メイン見出しと英語サブラベルの上下を入れ替える。

確度 **複数サイト**（ENILIS・ステイハングリー・カミナリゲームス）／判定 **流用可**

```css
enilis.style [SP] .index-PickUp .pickUp-Layout .pickUp-Heading {flex-direction:column-reverse} enilis.style [SP] .index-Service .service-Layout .service-Heading {grid-column:1/2;flex-direction:column-reverse} enilis.style [SP] .index-News .news-Layout .news-Heading {flex-direction:column-reverse} kaminari.style [SP] .st-Footer_Inner .footer-top { flex-direction: column-reverse; } kaminari.style [SP] .idx-Recruit_Inner .recruit-flex { flex-direction: column-reverse; } enilis.style [SP] .index-Service .service-Layout {padding:0 3.90625vw;grid-template-rows:auto auto auto;grid-template-columns:au …
```

セクション単位では `grid-template-rows` を宣言して各要素に `grid-row:2/3` を割り当てる（見出し→画像→本文の順に組み替え）。小さい見出しペアは `column-reverse` 1行で済ます。既知の「日本語が主役、英語はopacity .2の装飾」という発見と繋がる所見で、SPでは英語サブラベルが日本語見出しの上に回る。flexの `order` より意図が読めるので保守性が高い。

#### 1列化したリストは `gap:0` にして、各アイテムの `border-top` と `border-bottom`（1px）を重ねて連続した区切り線にする。隙間ではなく線で区切る。

確度 **複数サイト**（ENILIS・ステイハングリー）／判定 **流用可**

```css
.index-Nav .nav-Layout .nav-List .nav-Item .item-Link{padding:2.6041666667vw 0;display:block;border-top:1px solid #181818;border-bottom:1px solid #181818;position:relative} .index-Nav .nav-Layout .nav-List || PC=repeat(2,1fr) SP=1fr .index-Nav .nav-Layout .nav-List (gap) || PC=2.0833333333vw 2.0833333333vw SP=0 .index-Service .service-Layout (gap) || PC=0 2.8645833333vw SP=0 .index-Company .company-Body (gap) || PC=3.125vw 3.125vw SP=0 .st-Header .header-Nav .nav-Global .global-List (gap) || PC=0 2.0833333333vw SP=0
```

PCでは40pxのgapで区切られた2列カードが、SPでは `gap:0` になって border 同士が接し、1本の線で分割された連続リストになる（日本のニュース一覧の定番の見え方）。borderは最初から BASE に書いてあるので、SP側は gap を0にするだけ。実装コストがほぼゼロなのに見え方が大きく変わる。

#### WIT STUDIOだけremキャンバス方式を捨て、`--vw-scale`というカスタムプロパティ1本で全スケールを制御している。`max(calc(100vw / var(--vw-base)), 1px)` という書き方が肝で、「1920pxより大きい画面では拡大、小さい画面では1px＝デザイン値そのまま（縮小しない）」を1行で表現している。

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
:root{--vw-base:1920;--vw-min:1360;--text-color:$green;--vw-scale:max(calc(100vw / var(--vw-base)), 1px);--index-gallery-width:0;--index-text-stroke-width:0} @media print,screen and (min-width:1025px) and (max-width:1360px){:root{--vw-scale:calc(100vw / 1360)} @media print,screen and (max-width:1024px){:root{--vw-base:768;--vw-scale:calc(100vw / var(--vw-base))} font-size:calc(16 * var(--vw-scale)) font-size:calc(26 * var(--vw-scale))
```

7サイト中もっとも新しく、もっとも堅牢。(1) PC1361〜1920pxは1px固定＝Figmaの数値がそのままpxで出る（デザイナーが検証しやすい）(2) 1025〜1360pxは1360基準で縮小(3) 1921px以上は拡大。しかもCSS内は `calc(26 * var(--vw-scale))` と書くだけでFigmaの数値をそのまま貼れる。remに割り算して書き換える必要がない。これが最善。ただし `--text-color:$green` という未コンパイルのSass変数が本番に漏れている（後述）。

#### イロコトはナビのブレークポイント（1200/1199px）とコンテンツのブレークポイント（768/767px）を別軸にしている。1200pxでハンバーガー化し、768pxでコンテンツが1列になる。その間の帯（768〜1199px）用に `.tab_b` ユーティリティがある。

確度 **1サイトのみ**（イロコト）／判定 **流用可**

```css
irokoto.style.css の @media 内訳: 103 @media print,screen and (max-width:767px) 38 @media print,screen and (min-width:768px) 23 @media print,screen and (max-width:1199px) 19 @media print,screen and (min-width:1200px) 5 @media print,screen and (min-width:768px) and (max-width:1199px) @media print,screen and (max-width:1199px) の中身（抜粋）: .tab_b {display:block!important} .st-Header_Logo a {width:120px;height:30px;z-index:300;margin:14px 0 0 2.8645833333vw} .st-Header_Nav {width:100%;height:100%;z-index:300;position:fixed;top:0;right:0;overflow-x:hidden;overflow-y:scroll;-webkit-overflow-scrolling:touc …
```

これが一番実務的に効く発見。ナビが折り返す幅とコンテンツが1列になる幅は本来無関係。ナビは「ロゴ幅＋項目数×文字幅」で決まるので1200pxで限界が来るが、コンテンツは768pxまで2列で持つ。この2軸を混ぜて1024pxに統一すると、1100pxの画面でナビが窮屈なのに2列レイアウトのまま、という破綻が出る。ドロワー内のナビ項目は30px（PC横並びは16px）で約2倍に拡大する点も共通の型。

#### カミナリゲームスはタブレットにレイアウトを作らず、viewportを `width=1440` に書き換えてPCデザインを縮小表示させている。さらに768〜1280pxの帯では `body{min-width:1280px; overflow-x:scroll}` でページ全体を横スクロールにしている。

確度 **1サイトのみ**（カミナリゲームス）／判定 **真似しない**

```css
<script> if (/iPad|Macintosh/i.test(navigator.userAgent)&& 'ontouchend' in document || (navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') == -1)) { document.write('<meta name="viewport" content="width=1440, maximum-scale=2, user-scalable=yes">'); } else { document.write('<meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1, maximum-scale=2, user-scalable=no">'); } </script> @media print, screen and (min-width: 768px) and (max-width: 1280px) { body { min-width: 1280px; overflow-x: scroll; } }
```

考え方（タブレット専用レイアウトを作らない）は検討に値するが、この実装は真似すべきでない。(1) `document.write` をhead内で使うとレンダリングがブロックされ、最新ブラウザでは非同期スクリプトで動かない (2) UserAgent判定でデバイスを分けるのは壊れやすい（iPadOSがMacintoshを名乗るので `Macintosh && ontouchend` という苦しい判定になっている） (3) `user-scalable=no` でピンチズームを禁止している（WCAG 1.4.4違反） (4) `body{min-width:1280px;overflow-x:scroll}` は1280pxのノートPCで常に横スクロールバーが出る。同じ狙いなら `@media (max-width:1280px){ body{zoom:calc(100vw/1280)} }` 等の方が安全。

### アクセシビリティと堅牢性

#### 7サイト1.3MBのCSS全量で、自社記述の :focus-visible は1件もない。唯一の1件は Splide（スライダーライブラリ）のデフォルト #0bf シアン輪郭で、ブランド調整すらされていない。

確度 **7サイト全部**（ENILIS（ライブラリ由来のみ））／判定 **真似しない**

```css
@supports(outline-offset:-3px){.splide__slide:focus-visible{outline:3px solid #0bf;outline-offset:-3px} .splide__arrow:focus-visible{outline:3px solid #0bf;outline-offset:3px} .splide__pagination__page:focus-visible{outline:3px solid #0bf;outline-offset:3px}
```

grep -c 'focus-visible' *.css の結果は enilis.lib.css が1、残り13ファイルすべて0。:focus も enilis.lib.css の7件だけで、7サイトの自社CSSにフォーカス指定が一行も存在しない。キーボード操作でどこにいるかが一切分からないサイトが7本ある、ということ。真似の対象ではなく、ここを埋めるだけで差別化できる箇所。

#### prefers-reduced-motion の記述が1.3MB・全14ファイルでゼロ件。一方で transition は -webkit- 込みで542箇所、clip-path アニメが99箇所、will-change が23箇所ある。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **真似しない**

```css
$ grep -c 'prefers-reduced-motion' *.css anycareer.about.css:0 anycareer.lib.css:0 anycareer.style.css:0 enilis.lib.css:0 enilis.style.css:0 irokoto.style.css:0 kaminari.style.css:0 nokid.common.css:0 nokid.form.css:0 nokid.lib.css:0 stayhungry.style.css:0 witstudio.app.css:0 witstudio.lib.css:0
```

スクロール連動の出現アニメーションが各サイト数十箇所あるのに、動きを減らす設定への対応が一切ない。前庭障害・めまいのあるユーザーには読めないページになる。@media (prefers-reduced-motion: reduce) を1ブロック足すだけで済むので、ここは真似せず必ず足す。

#### role属性とtabindex属性が7サイトのトップページ全体でゼロ件。aria-label はNOKIDの23件のみで、他6サイトは0。スキップリンクもゼロ。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **真似しない**

```css
$ grep -ohE 'role="[a-z]+"' *.html | wc -l → 0 $ grep -ohE 'tabindex="[-0-9]+"' *.html | wc -l → 0 $ for f in *.html; do echo "$f: $(grep -oE 'aria-[a-z]+=' $f | wc -l)"; done anycareer.html: 0 enilis.html: 0 irokoto.html: 0 kaminarigames.html: 0 nokid.html: 23 stayhungry.html: 0 witstudio.html: 0
```

div製のモーダル閉じるボタン（<div class="youtube-Modal_Close">、<div class="youtube-Modal_Overlay">）に role も tabindex も aria-label もないので、キーボードだけの利用者は動画モーダルを開いたら閉じられない。js- プレフィックスの付いたクリック可能要素のタグ内訳は div 32件 / span 5件 / h* 4件 / p 1件 / footer 1件で、button は0件。NOKIDだけは aria-label に実績名を入れていて（例: aria-label="株式会社セガ様 - 発売ロンチトレーラー【ENDLESS Dungeon】の実績を見る"）、これは7サイト中で唯一真似する価値がある書き方。

#### -webkit- プレフィックスが3287箇所。-webkit-transition 542件、-webkit-transform 351件、display:-webkit-box 194件で、2012年頃のiOS/Androidを対象にした自動プレフィックスが丸ごと残っている。

確度 **7サイト全部**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **真似しない**

```css
$ for p in '\-webkit-' '\-moz-' '\-ms-' '\-o-'; do echo -n "$p => "; grep -ohE "$p" *.css | wc -l; done \-webkit- => 3287 \-moz- => 92 \-ms- => 118 \-o- => 30 display:-webkit-box;display:-webkit-flex;display:flex -webkit-box-align:center;-webkit-align-items:center;align-items:center -webkit-box-pack:center;-webkit-justify-content:center;justify-content:center
```

-webkit-box / -webkit-box-align / -webkit-box-pack は2009年版の旧Flexbox仕様で、現在サポートが必要なブラウザは一つもない。CSSの素のサイズが940KB（ミニファイ後）になっている主因の一つ。autoprefixer の browserslist 設定を放置した結果で、意図的な判断ではない。.browserslistrc を > 0.5%, last 2 versions, not dead 程度にするだけで数割減る。なおカミナリゲームス（4224行）とNOKID（4083行）はミニファイすらされずに出荷されている。

#### リセットCSSの段階で button / input / select / textarea のフォーカス輪郭を outline:0 で全部潰している。代替のフォーカス表示は後から足されていない。

確度 **ほぼ全サイト**（エニーキャリア・ENILIS・ステイハングリー・WIT STUDIO・イロコト）／判定 **真似しない**

```css
button,input,optgroup,select,textarea{-webkit-appearance:none;-moz-appearance:none;appearance:none;vertical-align:middle;color:inherit;font:inherit;background:0 0;padding:0;margin:0;outline:0;border-radius:0;text-align:inherit} [contenteditable]{outline:0} button{background-color:transparent;border:none;cursor:pointer;outline:0;padding:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}
```

outline宣言の総数は全ファイルで29件、うち outline:0 / outline:none が14件。前者の宣言（5サイトのリセット）はフォーム部品すべてに効くので、問い合わせフォームの入力欄・送信ボタンがフォーカス不可視になる。イロコト自社サイトは button だけを別記法で同じことをしている。このリセットブロックをコピーするなら outline:0 を削るか、直後に :focus-visible を書くこと。

#### SP（1024px以下）でルートフォントサイズを vw にしているため、iPhone実機の root は 10px ではなく 4.88px になる。1rem=10px が成立するのは768px幅のときだけ。

確度 **ほぼ全サイト**（エニーキャリア・ENILIS・ステイハングリー・WIT STUDIO・NOKID・カミナリゲームス）／判定 **考え方だけ**

```css
@media print,screen and (max-width:1024px){html{font-size:1.3020833333vw}} @media screen and (max-width:1024px) { html{ font-size: 1.3vw; } } @media print, screen and (max-width: 768px) { html { font-size: 1.3020833333vw; } }
```

実測値: 1.3020833333vw は 768px幅で 10.000px、375px幅で 4.8828px、390px幅で 5.0781px、430px幅で 5.5990px。つまり SPのデザインカンプは768px（またはJPで一般的な750px）幅で作る前提で、実機ではその約49%に縮む。KEISUKEが『SPは375pxで作る』と思って font-size:1.6rem と書くと実機で 7.8px になる。NOKIDだけ 1.3vw に丸めており768pxで9.984pxと0.16%ずれる。考え方（カンバス幅で割って1rem=10pxを作る）は流用価値があるが、どのカンバス幅のカンプを渡されたかを必ず確認すること。

#### SPのメニューボタンが7サイト中6サイトで div。ボタンラベルはCSSの content:"Menu" で入れており、アクセシブルネームが存在しない。イロコト自社サイトだけ a href="javascript:void(0);"。

確度 **ほぼ全サイト**（イロコト・エニーキャリア・ステイハングリー・NOKID・ENILIS・WIT STUDIO）／判定 **真似しない**

```css
.st-Menu::before{display:block;position:absolute;font-size:14px;content:"Menu";color:#fff;top:10px;left:5px;letter-spacing:.1em} .st-Menu.opened::before{content:"Close";color:#595656} .st-Menu{display:block;z-index:320;position:fixed;width:87px;height:33px;top:12px;right:2.8645833333vw;-webkit-transition:background .3s;transition:background .3s} .l-header .l-header__hamburger{cursor:pointer;-webkit-transition:background .4s;transition:background .4s}
```

HTMLを grep した結果、ハンバーガーのタグは anycareer=div / enilis=div / nokid=div / stayhungry=div / witstudio=div / kaminarigames=button。カミナリゲームスだけが button。divはキーボードでフォーカスできず Enter/Space も効かない。イロコトは <a class="st-Menu" id="st-Menu" href="javascript:void(0);"> でフォーカスはできるが、ラベルがCSS content なので読み上げ名が取れず、javascript: スキームは厳しいCSPで止まる。さらに .st-Menu は 87×33px で、33pxは44pxの最小タップ領域を下回る。ここは素直に <button type="button" aria-expanded aria-label="メニュー"> にすること。

#### 画像の alt が空文字で埋められている。ステイハングリー45枚中45枚、ENILIS 27枚中27枚、WIT STUDIO 59枚中50枚が alt=""。

確度 **ほぼ全サイト**（ステイハングリー・ENILIS・WIT STUDIO・エニーキャリア）／判定 **真似しない**

```css
$ for f in *.html; do t=$(grep -oE '<img' $f | wc -l); e=$(grep -oE 'alt=""' $f | wc -l); echo "$f: img=$t alt_empty=$e"; done anycareer.html: img=15 alt_empty=13 enilis.html: img=27 alt_empty=27 irokoto.html: img=25 alt_empty=3 kaminarigames.html: img=13 alt_empty=0 nokid.html: img=19 alt_empty=8 stayhungry.html: img=45 alt_empty=45 witstudio.html: img=59 alt_empty=50
```

制作実績やサービス紹介が主コンテンツのサイトで、代替テキストが一枚もない状態。alt="" は『この画像は装飾である』という明示的な宣言なので、スクリーンリーダーは完全に読み飛ばす。SEO（画像検索）にも効く箇所なので実利でも損をしている。逆にカミナリゲームスは13枚すべてに alt が入っており（alt_empty=0）、イロコトも25枚中22枚に入っている。同じ制作会社の中でも案件ごとにバラバラで、社内ルールとして固まっていないことが分かる。

#### @media (any-hover:hover) を7サイト中6サイトで合計173回使い、ホバー演出をマウス環境に限定している。これは7サイト中で最も徹底している良い作法。

確度 **ほぼ全サイト**（ENILIS・ステイハングリー・WIT STUDIO・エニーキャリア・カミナリゲームス・イロコト）／判定 **流用可**

```css
$ grep -ohE '@media[^{]{0,60}any-hover[^{]{0,30}' *.css | sort | uniq -c | sort -rn 68 @media (any-hover:hover) 37 @media print and (any-hover:hover),screen and (any-hover:hover) and (min-width:1025px) 17 @media (any-hover: hover) 5 @media print and (any-hover:hover),screen and (min-width: 2 @media print and (any-hover:hover),screen and (any-hover:hover) and (max-width:1024px)
```

ファイル別件数は enilis 36 / stayhungry 36 / witstudio 33 / anycareer.about 24 / anycareer 23 / kaminari 17 / irokoto 4、NOKIDのみ0。@media print and (any-hover:hover),screen and (any-hover:hover) and (min-width:1025px) という形で any-hover と min-width を二重に掛けているのが上手い。タッチ端末でホバー状態が張り付く事故（タップ後に色が残る）を構造的に防いでいる。これはそのままコピーしてよい。ただし :hover をここまで丁寧に守りながら :focus を1行も書いていないという非対称が、この会社の盲点そのもの。

#### !important は全体で396回だが、うち248回が display で、その実体は .pc_b / .sp_b 系の表示切替ユーティリティ1セットだけ。!important の件数は保守性の指標にならなかった。

確度 **ほぼ全サイト**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **考え方だけ**

```css
$ grep -ohE '[a-z-]+:[^;{}]*!important' *.css | grep -oE '^[a-z-]+' | sort | uniq -c | sort -rn | head -5 248 display 16 transition 15 transition-delay 14 -webkit-transition 13 -webkit-transition-delay .pc_b{display:block!important} .sp_b{display:none!important} @media print,screen and (max-width:1024px){.pc_b{display:none!important}} @media print,screen and (max-width:1024px){.sp_b{display:block!important}}
```

ユーティリティの内訳は .pc_b/.sp_b（block）.pc_f/.sp_f（flex）.pc_ib/.sp_ib（inline-block）.pc_i/.sp_i（inline）.pc_ri/.sp_ri で、各breakpointで裏返す設計。!important はこのユーティリティが他の指定に必ず勝つための意図的なもので、場当たりの上書きではない。残りの148件も transition / transition-delay 系58件（アニメーション無効化）に集中している。考え方は流用可、ただしPC用とSP用のマークアップを両方DOMに置いて片方を display:none で隠す運用になるので、画像を2セット読み込む可能性がある。<picture> か CSS だけで出し分けられる構造を優先し、このユーティリティは最後の逃げ道に留めること。

#### ルートに html{line-height:1} を置いている。日本語テキストで line-height:1 は字が接触するので、全テキストに個別指定することが前提の設計になっている。

確度 **ほぼ全サイト**（エニーキャリア・ステイハングリー・ENILIS・WIT STUDIO・イロコト）／判定 **真似しない**

```css
html{font-size:62.5%;line-height:1} html{height:100%;min-height:100%;font-size:.5208333333vw;line-height:1} html{height:100%;min-height:100%;font-size:.5208333333vw;line-height:1;-webkit-font-feature-settings:"palt" 1;font-feature-settings:"palt" 1}
```

line-height の値分布を取ると line-height:1 が47件（32 + 15）で最多。これはリセット思想（意図しない行間を全部消して各所で明示する）だが、WordPressの本文エリアや後から追加されたマークアップで指定が漏れると、日本語が行間ゼロで重なって表示される。彼らは本文側で line-height:160% / 180% / 200% / 240% を明示してカバーしているが、漏れた瞬間に崩れる。ベースは line-height:1.7 程度にして、行間を詰めたい見出しだけ 1 に落とすほうが壊れにくい。

#### CSSカスタムプロパティがデザイントークンとして一切使われていない。5サイトは var() が0件で、色は生のhexを7〜69回繰り返している。

確度 **ほぼ全サイト**（イロコト・エニーキャリア・ステイハングリー・カミナリゲームス・NOKID・ENILIS・WIT STUDIO）／判定 **真似しない**

```css
$ for f in irokoto.style.css anycareer.style.css anycareer.about.css stayhungry.style.css kaminari.style.css nokid.common.css enilis.style.css witstudio.app.css; do echo "$f: $(grep -oE 'var\(--' $f | wc -l)"; done irokoto.style.css: 0 anycareer.style.css: 0 anycareer.about.css: 0 stayhungry.style.css: 0 kaminari.style.css: 0 nokid.common.css: 36 enilis.style.css: 1 witstudio.app.css: 1065 $ grep -ohE 'color:#[0-9a-fA-F]{3,6}' *.css | sort | uniq -c | sort -rn | head -6 69 color:#fff 34 color:#35b1c1 21 color:#1a7e3a 21 color:#181818 15 color:#111 9 color:#cea948
```

var() 1065件の WIT STUDIO も中身は --vw-scale / --vw-base というvw換算機構だけで、色・余白・タイプスケールのトークンは一つもない（唯一の色トークン --text-color は $green のまま壊れている）。NOKIDの36件は --text-glitch-y1〜y4 というグリッチアニメの座標。つまりDRYはすべてSassのビルド時に解決していて、ブラウザ側には展開済みのhexが散っている。結果としてダークモード対応・テーマ切替・配色の一括変更がどれも不可能。これは真似すべきでない点。WIT STUDIO の --vw-scale 機構は残したまま、色と余白を :root のトークンに切り出すのが次のサイトでやるべきこと。

#### デスクトップのルートも無制限に vw なので、1366pxのノートPCでは本文16pxが11.4pxに、1280pxでは10.7pxに縮む。下限がない。

確度 **複数サイト**（ステイハングリー・ENILIS）／判定 **真似しない**

```css
html{height:100%;min-height:100%;font-size:.5208333333vw;line-height:1} html{height:100%;min-height:100%;font-size:.5208333333vw;line-height:1;-webkit-font-feature-settings:"palt" 1;font-feature-settings:"palt" 1}
```

この html 宣言はメディアクエリの外（素のルール）にあり、min-width の下限ガードが存在しない（grep '@media[^{]*min-width[^{]*{html{' で両ファイル0件）。実測: .5208333333vw は 1920pxで10.00px、1440pxで7.50px、1366pxで7.11px、1280pxで6.67px、1025pxで5.34px。両サイトの本文は font-size:1.6rem（stayhungry 6件 / enilis 12件）なので、1366pxで11.38px、1025pxで8.54px。日本の主流ノートPC解像度で本文が11px台になるのは単純に読めない。デスクトップ側には必ず床を入れる。

#### 問い合わせフォームの入力欄の実効font-sizeが、デスクトップでもSPでも16px未満。iOS Safariがフォーカス時に必ず自動ズームする。

確度 **複数サイト**（ENILIS・ステイハングリー・NOKID）／判定 **真似しない**

```css
.sw-Form .form-Item dd input[type=text],.sw-Form .form-Item dd input[type=url],.sw-Form .form-Item dd textarea{width:100%;max-width:100%;padding:.625vw 1.0416666667vw;background:#fff;font-weight:400;font-size:1.5rem;line-height:240%;letter-spacing:.08em;color:#181818} .sw-Form .form-Item dd input[type=text],.sw-Form .form-Item dd textarea{padding:2.8645833333vw 2.6041666667vw 2.6041666667vw;font-size:2.4rem} input[type="text"], input[type="email"], input[type="tel"], input[type="url"], select, textarea { font-size: 14px; }
```

ENILIS/ステイハングリー: デスクトップ 1.5rem は 1920pxでも15px（既に16px未満）、1366pxでは10.67px。SPの 2.4rem は root 1.3020833vw なので 375pxで11.72px、390pxで12.19px、430pxで13.44px。NOKIDは別アプローチで素のCSSは font-size:16px（正解）なのに、max-width:1024px のブロックで 14px に落として台無しにしている。しかもこの入力欄は前述のリセットで outline:0 なのでフォーカスも見えない。コンバージョンに直結する部品でフォーカス不可視＋自動ズームの二重事故。input/select/textarea の font-size だけは全breakpointで px 固定の16px以上にすること。

#### 未解決のSass関数とSass変数が本番CSSにそのまま出荷されており、該当宣言がブラウザで丸ごと無効になっている。

確度 **複数サイト**（エニーキャリア・WIT STUDIO）／判定 **真似しない**

```css
@media print,screen and (max-width:1024px){.acf_content iframe,.post-type-post iframe,.sw-Txtarea iframe{height:_vwSP(376)} @media print,screen and (max-width:1024px){.sw-Pagenavi_Detail .next-article,.sw-Pagenavi_Detail .prev-article{font-size:_vwSP(24);top:_vwSP(30)} @media print,screen and (max-width:1024px){.company-Team_List_Ttl .role{font-size:vwPS(28);display:block;margin-bottom:.6510416667vw} :root{--vw-base:1920;--vw-min:1360;--text-color:$green;--vw-scale:max(calc(100vw / var(--vw-base)), 1px)...}
```

エニーキャリアは _vwSP() が11件（font-size 2件、height 2件、width 2件、top 4件）。height:_vwSP(376) はSPで記事内iframe（YouTube埋め込み等）の高さ指定が消えるので実害がある。vwPS(28) は vwSP の打ち間違いで、1件だけ関数名ごと違う。WIT STUDIO は --text-color:$green のまま出荷され、var(--text-color) が7箇所で参照されていて全部無効。教訓は『ビルド後のCSSを grep して $ と未解決関数が残っていないか確認する』という工程を1つ足すこと。grep -E ':\s*\$[a-zA-Z]' と grep -E ':\s*_?vw(SP|PS)\(' の2本で検出できる。

#### 見出しの英語ラベルは opacity:.2 だが、同じブロック内で opacity が二重宣言されていて初期値は 0。JSが .is-animated を付けないと永久に見えない。

確度 **複数サイト**（エニーキャリア）／判定 **真似しない**

```css
.sw-Ttl .en{display:block;opacity:.2;font-size:1.4rem;line-height:1;margin-top:16px;opacity:0;-webkit-transform:translateX(-20px);transform:translateX(-20px)} .sw-Ttl.is-animated .en{opacity:.2;-webkit-transform:translateX(0);transform:translateX(0);-webkit-transition:.5s .2s cubic-bezier(.22,1,.36,1);transition:.5s .2s cubic-bezier(.22,1,.36,1)} .subpage-List_Item_Txt .ttl .en{display:block;opacity:.2;font-size:1.2rem;line-height:1;margin-top:11px}
```

1つのルール内に opacity:.2 と opacity:0 が両方書かれており、CSSは後勝ちなので初期値は 0。IntersectionObserver が発火しない状況（JSエラー、古いブラウザ、Reader系の処理）では英語ラベルが出ないまま終わる。さらに opacity:.2 のテキストは白背景で約1.5:1のコントラストなので、見えた後も読めない。装飾なら CSSの content か aria-hidden のspanにしてDOMから外す。opacity:0→.2 の二重宣言はビルド事故なので、英語ラベルを使うなら opacity ではなく色トークン（--en-label-color）で薄くすること。

#### メタ情報（日付・英語サブラベル・スクロール文字）に #a1a4a7、プレースホルダに #b8b8b8 を使っている。白背景でそれぞれ約2.5:1、約2.0:1。

確度 **複数サイト**（ENILIS・ステイハングリー）／判定 **真似しない**

```css
.index-News .news-Layout .news-Heading .heading-Sub{margin:.9375vw 0 0 1.0416666667vw;font-weight:500;font-size:1.2rem;letter-spacing:.08em;color:#a1a4a7;position:relative} .sw-NewsArchive .newsArchive-List .newsArchive-Item .item-Anchor .item-Date{margin-top:auto;font-family:Poppins,sans-serif;font-weight:400;font-size:1.6rem;line-height:180%;color:#a1a4a7} .sw-Form .form-Item dd textarea::placeholder{color:#b8b8b8} .index-Hero .hero-Text .hero-Text_Introduction{font-family:"PT Sans",sans-serif;font-weight:700;font-size:1.2rem;color:rgba(17,17,17,.4)}
```

#a1a4a7 は enilis.style.css で7箇所、全部が heading-Sub / item-Date / hero-Catch_En / hero-Scroll。WCAG計算で白背景に対して約2.5:1（AA基準4.5:1に対して半分強）。しかも font-size:1.2rem なので 1366pxのノートPCでは8.5px。日付は装飾ではなく本文なのでここは落とせない。::placeholder の #b8b8b8 は約2.0:1 でさらに悪く、プレースホルダをラベル代わりに使っている箇所では入力内容が分からなくなる。薄いグレーの雰囲気を出したいなら #6b6e71（白背景で約5.1:1）まで。

#### タップターゲットが44px未満の箇所が実在する。しかも vw で書いた箇所も px で書いた箇所も両方ある。vw採用はタップ領域を守ってくれない。

確度 **複数サイト**（エニーキャリア・イロコト）／判定 **真似しない**

```css
.sw-Pagenavi_Detail .next-article,.sw-Pagenavi_Detail .prev-article{width:62px;height:16px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;position:absolute;top:0;bottom:0;margin:auto 0;white-space:nowrap} @media print,screen and (max-width:1024px){.sw-Pagenavi_Detail .next-article,.sw-Pagenavi_Detail .prev-article{width:12.2395833333vw;height:3.3854166667vw}} .st-Menu{display:block;z-index:320;position:fixed;width:87px;height:33px;top:12px;right:2.8645833333vw} .st-Banner_Close{position:absolute;top:-37px;right:0;wid …
```

実測: 前後記事リンクはデスクトップ 62×16px、SPは 12.2395833333vw × 3.3854166667vw なので 375px幅で 45.9 × 12.7px。高さ12.7pxは指で押せない。イロコトのバナー閉じるは31×31px、動画閉じるは80×36px、メニューは87×33px で全部44px未満。一方、同じ会社の .st-Header_Hamburger{width:15.625vw;height:15.625vw} は375pxで58.6×58.6px、WIT STUDIOの calc(110 * var(--vw-scale)) は375pxで53.7px と十分大きい。つまり vw を使っているかどうかは無関係で、カンプの数値が小さいかどうかだけが効いている。SPカンプ（768px想定）で 88px 未満の押せる要素があったら、それは実機で44px未満だと覚えること。

#### -webkit-text-size-adjust:none を body に当てている。iOSの文字拡大を無効化する指定で、SPでvwを使っていることと合わせて二重に文字サイズ変更を封じている。

確度 **複数サイト**（イロコト・カミナリゲームス）／判定 **真似しない**

```css
body{margin:0 auto;font-family:source-han-sans-japanese,Noto Sans Japanese,Hiragino Kaku Gothic ProN,Hiragino Kaku Gothic Pro,"ＭＳ ゴシック","メイリオ",Meiryo,"ヒラギノ角ゴ Pro W3",Hiragino Kaku Gothic Pro,Osaka,"ＭＳ Ｐゴシック",MS PGothic,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;-webkit-text-size-adjust:none;letter-spacing:.1em;color:#595656} -webkit-text-size-adjust: none;
```

-webkit-text-size-adjust の値分布は 100% が9件、none が2件。100%（ノーマライズ由来）は正しいが、イロコトとカミナリゲームスは body で none に上書きしている。none はiOSの自動文字拡大を止めるので、小さい文字が小さいまま固定される。html{font-size:62.5%} はユーザーのブラウザ文字サイズ設定を尊重する書き方（既定16px→10px、既定20px→12.5px）なのに、body で text-size-adjust:none を当てることでその尊重を打ち消している。この1行は削ること。

#### WIT STUDIO だけが vw スケールに max() で床を入れ、さらに1360pxで基準を打ち直している。7サイト中これだけがデスクトップ縮小問題を解いている。

確度 **1サイトのみ**（WIT STUDIO）／判定 **流用可**

```css
:root{--vw-base:1920;--vw-min:1360;--text-color:$green;--vw-scale:max(calc(100vw / var(--vw-base)), 1px);--index-gallery-width:0;--index-text-stroke-width:0} @media print,screen and (min-width:1025px) and (max-width:1360px){:root{--vw-scale:calc(100vw / 1360)}} @media print,screen and (max-width:1024px){:root{--vw-base:768;--vw-scale:calc(100vw / var(--vw-base))}} font-size:calc(26 * var(--vw-scale))
```

max(calc(100vw/1920), 1px) は 1920px以下で 1px に張り付くので、1361〜1920pxの間は文字も余白もカンプの実寸のまま縮まない。1025〜1360pxは基準を1360に打ち直すので最小でも0.754倍（26px→19.6px）で止まる。さらに calc(26 * var(--vw-scale)) という書き方はカンプの数値をそのまま書けるので、Sassのmixinなしで運用できる。7サイト中これが唯一の正解パターン。これをベースにすること。

#### カミナリゲームスは「vwが縮みすぎないようpx固定帯を作る」正しい発想を持っているが、固定した値が 9.33px / 7.99px という読めない数値。

確度 **1サイトのみ**（カミナリゲームス）／判定 **考え方だけ**

```css
@media print, screen and (min-width: 768px) and (max-width: 1280px) { .idx-News_Inner .news-title { font-size: 9.33324px; } } @media print, screen and (min-width: 768px) and (max-width: 1280px) { .idx-Columntitle span.ja { font-size: 7.99992px; } }
```

768〜1280pxの帯で font-size:0.7291666667vw を 1280px基準の実px（0.7291666667 × 1280 = 9.333px）に凍結している。帯の下限で値を凍結する手法自体は正しいが、凍結先が既に9.33pxで、ニュース見出しが9px、日本語の見出し span.ja が8pxになっている。帯は 9.33324px / 7.99992px / 10.66656px / 11.99988px 等で合計15件。発想（下限で凍結）だけ借りて、凍結値は 16px 以上に書き換えること。

#### pointer-events:none でリンクを無効化しているが href="" のまま。キーボードではTabで到達でき、Enterで現在ページがリロードされる。

確度 **1サイトのみ**（WIT STUDIO）／判定 **真似しない**

```css
.c-job .c-job__item .c-job__list .c-job__list-item a[href=""]{pointer-events:none;color:rgba(20,22,20,.2)} .c-job .c-job__item .c-job__list .c-job__list-item a[href=""]::after{opacity:.2}
```

witstudio.html には href="" が12件ある。pointer-events:none はマウスのヒットテストだけを止める指定で、キーボードのフォーカスと Enter による活性化は止まらない。さらに色が rgba(20,22,20,.2)（白背景で約1.5:1）なので『無効です』という情報が視覚的にも伝わらない。無効リンクは <a> をやめて <span> にするか、aria-disabled="true" と tabindex="-1" を併記すること。pointer-events:none は全ファイルで100件使われており、装飾オーバーレイに使う分には問題ないが、インタラクティブ要素の無効化に使うのは誤り。

---