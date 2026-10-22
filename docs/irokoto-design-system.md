# イロコトの設計言語 — 生CSS 1.3MB の実測

株式会社イロコトが制作した7サイトのCSSを**実際にダウンロードして grep で測った**結果。
印象や推測は含まない。数値はすべて実CSSからの採取で、各項目に採取元の宣言を併記している。

| | |
|---|---|
| 調査日 | 2026-10-22 |
| 対象 | 7サイト / CSS 14ファイル / 1.3MB / 9,009ルール |
| 方法 | 9観点を並列解析、ツール呼び出し557回 |
| 採取数 | 作法 270件 / 逆説 145件 / 要注意 101件 |

**対象サイト**

| サイト | CSS |
|---|---|
| [イロコト](https://irokoto.co.jp/) | `/wp/wp-content/themes/irokoto_v0/assets/css/index/style.css` |
| [エニーキャリア](https://anycareer.co.jp/) | `/wp-content/themes/anycareer_v0/assets/css/{index,about}/style.css` |
| [ステイハングリー](https://www.stayhungry.jp/) | `/wordpress/wp-content/themes/stayhungry/assets/css/index/style.css` |
| [カミナリゲームス](https://kaminarigames.com/) | `/assets/css/index/style.css` |
| [NOKID](https://nokid.jp/) | `/wp-content/themes/nokid_corp_v2/assets/css/common.css` |
| [ENILIS](https://enilis.co.jp/) | `/wp-content/themes/enilis/assets/css/index/style.css` |
| [WIT STUDIO 採用](https://recruit.witstudio.co.jp/) | `/wordpress/wp-content/themes/recruit_v1/assets/css/app.css` |

クラス命名は `sw-`（共通部品）`st-`（構造）`js-`（JS用）で横断して共通。同一の設計システムが使い回されている。
ただし最新の WIT STUDIO だけ FLOCSS（`l-` `p-` `c-`）に移行していて、ほぼ別の設計言語になっている。

---

## 1. 一般論と逆だったこと

この資料で最も価値があるのはここ。どれも実装を読まないと出てこない。

### タイポグラフィ

- タイプスケールが比率ではなく2px刻みの等差ラダー。12/14/16/18/20/22/24/26/28/30/32/34/36/42px で、偶数px率95%（偶数578件 vs 奇数・非整数30件）。×1.25 や ×1.333 のモジュラースケールはどのサイトにも無い。和文は字面が正方形なのでキリのいい偶数のほうが揃うという判断
- 和文でも letter-spacing が常に正。全233宣言中、負は2件だけで、その2件とも欧文（PT Sans 380pxの数字 letter-spacing:-.02em と、手動カーニング用の .kerning{letter-spacing:-.3em}）。「大見出しは字間を詰める」という欧文の定石を和文に一切持ち込んでいない。108pxの巨大キャッチでも .08em のまま広げている
- line-height がモバイルで狭くなる。.sw-Txt{line-height:2.4} → @media max-width:1024px で 2.2。「狭い画面では行間を広げて読みやすく」の逆。1行の文字数が減るので行間は詰めてよい、という判断
- 本文の font-weight が 400 ではなく 500。しかも Google Fonts のリクエスト自体が wght@500;700 で、Regular を読み込んでいないサイトがある（エニーキャリア）。和文ゴシックのRegularは画面で細すぎるという前提で設計している
- 巨大な和文キャッチでも line-height を 1.0 に落とさない。108px→130%、100px→120%、74px→130%、64px→128%。line-height:1 を使うのは単行の欧文ラベルと数字だけ
- text-transform:uppercase が7サイトで0件。ALL CAPS は全部HTMLに直接大文字で書いてある（<span class="en">ARCADE GAME</span>）。CSSで大文字化しない
- 日本の制作会社なのに和文の縦組みが0件。writing-mode:vertical-lr の6件すべてが SCROLL / BACK TO TOP の欧文マイクロラベル用
- font-feature-settings:"palt" 1 が7サイト中1サイトだけ。和文Webフォント組版の定番扱いされている割に、実務では使っていない
- clamp() を font-size に一度も使っていない（clamp() 自体は24件あるが全部レイアウト用）。流体タイポグラフィは @media でサイズを総入れ替えする旧来方式。代わりに max(.2083333333vw, 1px) で罫線の最小値だけ守っている
- 縦余白を px ではなく em で取っている。段落間 1em、段落→見出し 2.5em。しかも margin-bottom を使わず p + p / p + h2 の隣接セレクタだけで組むので、ブロックの先頭と末尾に余計な余白が出ない
- WIT STUDIOだけ rem を完全に捨てている（font-size の rem 使用が0件）。font-size:calc(18 * var(--vw-scale)) でデザインデータのpxをそのまま書く。クラス命名も sw-/st- ではなく FLOCSS の l-/p-/c-、和文も Zen Kaku Gothic New で、ほぼ別の設計言語になっている。7サイトのうち最新世代
- 同じ英単語をHTMLに2回書いて、120px opacity .2 の背景ゴーストと36pxの実見出しを重ねる（ENILIS）。1つのテキストを拡大縮小するのではなく、別要素として2つ置く

### カラー

- 影に純黒を使わない。影色は「そのサイトのインク色の rgba」か「アクセント色を暗くした色」。サイトCSS全体で rgba(0,0,0,.x) の影はたった2件しかなく、代わりに rgba(20,22,20,.1)（=WIT STUDIOのインク #141614）が27回、rgba(73,57,17,.15)（=ステイハングリーのゴールド #cea948 を暗くした色で、hexパレットには存在しない影専用色）が8回、rgba(24,24,24,.2)（=ENILISのインク #181818）が6回。黒い影は青みが出て浮く、という前提で設計されている。
- フッターの背景色が本文の文字色と完全に同じ値。イロコトは body{color:#595656} と .st-Footer{background:#595656}、エニーキャリアは body{color:#202020} と .st-Footer{background:#202020}。ステイハングリー #111、ENILIS #181818 も同様。「ダークグレー」を別に作らず、1サイト1インク色を前景と背景で使い回している。色数が増えないのに統一感が出る。
- エニーキャリアは影をホバーで「消す」。通常 box-shadow:0 0 20px 5px #ebebeb → ホバー box-shadow:0 0 0 0 #ebebeb。一般的な「ホバーで浮かせる」の完全な逆で、カードが紙に吸い付く挙動になる。しかも影色が alpha ではなく不透明な薄グレー #ebebeb で、このhexは罫線の #dedede とは別に影専用で持っている。
- アクセント色を文字に使うかどうかは、アクセントの明度が決めている。明るいアクセントのサイト（イロコト #f09ba5 は color:1回 / background:12回 / border:11回、ENILIS #f1721c は color:1回 / background:5回、NOKID #3CAB8F は color:5回 / background:10回）は面と線専用。暗めのアクセント（WIT STUDIO #1a7e3a は color:20 / bg:28、エニーキャリア #35b1c1 は color:15 / bg:7）は文字色でも使う。配色を決める段階で「このアクセントは文字に使えるのか」を先に判定している。
- イロコトは同じピンクを2値持って役割を完全に分離している。#f09ba5 は background:12回 / border:11回 / color:1回、#ee7785 は color:4回 / background:0回。薄い方を面に、濃い方を文字に。1つのブランドカラーで面も文字もやろうとせず、最初から2値作るのが前提になっている。さらに #fae1e4 を足した3段で、面・濃面・文字に対応。
- セクションの薄色背景がニュートラルグレーではなく、アクセント色の色相をわずかに含んだ白。WIT STUDIO #f4fdf2（R244 G253 B242、緑最大、アクセントは緑 #1a7e3a）、NOKID #ECF7F4（R236 G247 B244、緑寄り、アクセントはミント #3CAB8F）、ステイハングリー #f4e9cb（金寄り、アクセントはゴールド #cea948）。彩度1〜4%入れるだけで「このサイトの白」になる。
- 純白 #fff はまったく避けていない。全CSSで最頻出の色（236回）。避けているのは純黒の方（#000 の出現数はイロコト0 / エニーキャリア0 / WIT STUDIO0 / ENILIS1 / NOKID2）。しかも #fff は「地色」ではなく「カードの面」として使い、ページの地色はむしろ #F2F2F2（NOKID）や #fafafa（ENILIS）に落として、#fff のカードを立てている。
- 「同じ色を2回書くグラデーション」が下線アニメーションの実装。linear-gradient(90deg,#181818,#181818) no-repeat right bottom 0 に background-size:0 1px → 100% 1px を transition させる。グラデーションではなく「background-size でアニメーションできる1px の線」を作るための書き方で、border-bottom では幅を 0→100% にできないのでこうなる。
- 色のCSSカスタムプロパティが7サイト14ファイルで完全にゼロ。--vw-scale や --index-gallery-width のようなレイアウト用変数はちゃんと作っているのに、色だけ全部ハードコード。しかも WIT STUDIO の :root には未コンパイルの Sass 変数 `--text-color:$green` が本番CSSに漏れていて、1箇所がそれを var() で参照している（=無効値）。トップクラスの制作会社でもこの事故は起きる。
- ステイハングリーはナビの現在地マーカー（CSS三角形）の色をPCとSPで入れ替えている。PCは border-color:#111（インク色）、1024px以下では border-color:#cea948（ゴールド）。SPでナビが暗いドロワーに変わるとインク色の三角が消えるため。レスポンシブで「レイアウト」ではなく「色」を切り替える必要がある箇所が実在する、という発見。
- ホバーで付く色がアクセント色ではなくインク色、というサイトがある。ENILIS の .sw-More_Link:hover .sw-CircleBtn は background-color:#181818 で、アクセントのオレンジは出てこない。ENILIS はアクセント #f1721c を全CSSで6回しか使っていない（7サイト最少）のに、オレンジの印象が一番強い。アクセントを出す回数を絞るほど1回が効く。
- 1サイトのユニーク色数は6〜20で、「3色以内」ではない。最小はカミナリゲームスの6色だけ（#000 / #fff / #ffffff / #f8871e / #969696 / #000000）で、黒・白・オレンジ・補助グレーの4役でサイト全体を成立させている。逆にWIT STUDIOは緑のランプを #1c3a22 / #1a7e3a / #629f2f / #80cb43 / #96d2a9 / #aad786 / #d5eac3 / #f4fdf2 の8段持つ唯一の例で、職種カテゴリの色分けという機能要件があったから。色数は役割の数で決まる。
- ホバーの色変化が必ず any-hover:hover かつ min-width:1025px で囲まれていて、transition 宣言自体もその中にある。any-hover の出現数はステイハングリー36 / ENILIS36 / WIT STUDIO33 / エニーキャリア23 / カミナリ17。タッチデバイスでホバー色が残る事故を構造的に防いでいる。ただしイロコト（自社サイト）だけ4回で、一番手が入っていない。
- mix-blend-mode が7サイトで0件。filter も blur のみ7件で、グラデーションで作った光彩を柔らかくする用途に限定。色の見え方を予測可能に保つため、混色系の表現を意図的に封印している。

### 幅・グリッド・余白

- スペーシングが8の倍数ではなく10の倍数。gap実測225個のうち54%が10/20/30/40/50/60/80/90の8段に集中し、8系（12/16/24/32/64）は合わせても13%しかない。1rem=10pxに揃える設計の必然的な帰結で、8pxグリッドのFigmaテンプレを持ち込むと全部噛み合わない。
- グリッドの既定形は等分列ではなく「固定px + 1fr」の非対称2列。`850px 1fr` `290px 1fr` `180px 1fr` などが約25パターンあり、repeat(2,1fr)の8回・repeat(3,1fr)の8回を大きく上回る。左に固定幅のラベル列、右に可変の本文という日本語の雑誌組みが彼らの標準。カード3列は例外的な形。
- position:sticky が7サイト・1.3MBのCSSで0回。追従要素を一切使っていない。
- aspect-ratio も7サイト中1サイト（最新のWIT STUDIO）で5回だけ。残り6サイトは padding-top のパーセントハック。この制作会社のモダンCSS採用は想像よりかなり遅い。
- gapを必ず2値で書き、使わない軸に明示的に `0` を入れる。`gap:0 60px` `gap:11.71875vw 0` が2値gapの大多数。ブレークポイントで列数を変えたときに余白が残るのを防ぐ防御的な書き方。
- カード一覧の行gapは列gapの約2.3倍（列30px／行70px）。NOKIDとWIT STUDIOが独立に同じ 30/70 にたどり着いている。ただしテキストだけのニュース一覧は 20/20 の1:1で、画像があるかどうかで比率を切り替えている。
- フルブリードは要素自体を広げず、`position:absolute` の擬似要素に `width:100vw` を当てて作る。しかも `right:calc(50% - 50vw + 7.2916666667vw)` と+140pxを足して、右側だけ流す「ハーフブリード」にしている。左端はコンテンツのラインに揃ったまま、グレーの面だけ画面外へ逃げる。
- モバイル版では小さい部品を「拡大」して描き直す。縮小ではない。アイコン10px→14px、12px→18px、16px→22px、ボタン80px→100px、180px→220px。768/1920=0.4倍でレンダリングされる分を1.2〜1.5倍の描き直しで打ち消している。
- grid-template-areas の使用は全7サイトで6箇所、全部フッター。本文セクションには一切使わず、順序が変わる箇所だけに限定している。
- 共通コンテナクラスが存在しない。1200pxという同じ値が26の別セレクタに、86.9791666667vwが11セレクタに、92.1875vwが13セレクタにコピペされている。見た目の統一は結果的に取れているが、仕組みで担保していない。
- モバイルの縦paddingがデスクトップと同じか大きい。デスクトップ100pxが21回に対しモバイル100pxが18回、さらにモバイルだけに110px/140px/200pxが出る。「モバイルは余白を詰める」の逆。
- モバイルのコンテナが708px＝左右30pxしかない。768キャンバスで30pxは実機375px幅だと約15pxで、スマホの画面端余白としては相当狭い。画像を端まで見せるための意図的な選択で、4サイトが同値。
- ブレークポイントは1024/1025が5サイトだが、イロコトとカミナリゲームスは767/768。同じ制作会社でも主ブレークポイントが統一されていない。カミナリゲームスは768〜1280pxのタブレット域だけ非整数pxを焼き込む第3の方式。
- デスクトップ専用ルールとモバイル用ルールの比が極端に偏っている（ステイハングリー187対7、NOKID 205対21）。完全なデスクトップファースト。唯一WIT STUDIOだけが264対278とほぼ対称で、最新案件で方針を変えている。
- 最新のWIT STUDIOには、宣言されているが参照0回の死んだトークン（--vw-min:1360）と、Sass変数が未解決のまま漏れた --text-color:$green（7箇所から参照されていて全部無効）がある。一番整理されたサイトにこそ本番バグが残っている。

### カード・部品

- 枠線を「背景と同色」にするのではなく alpha 0 にし、しかも要素本体ではなく100%×100%の ::after に載せる。`border:2px solid rgba(26,126,58,0)` を置いて `transition:border-color .4s` だけを張り、ホバーで `border-color:rgba(26,126,58,.4)` にする。疑似要素なのでレイアウトが1pxも動かず、`border-radius:inherit` で親の角丸に自動追従する。さらにホバー後も alpha .4 止まりで、枠が主役に出てこない。WIT STUDIOで3箇所、同一の型。
- ホバーで影を濃くするのではなく「消す」。エニーキャリアのサービスカードは通常時 `box-shadow:0 0 20px 5px #ebebeb` → ホバー時 `box-shadow:0 0 0 0 #ebebeb`。色は据え置きでぼかしと広がりだけを0に畳むので、浮いていたカードが紙面に沈む。一方ステイハングリーは逆に alpha だけ .15→.3 にしてぼかしは一切変えない。「影は濃くするもの」という前提が2サイトで正反対に実装されている。
- 連番の扱いが2サイトで完全に逆。ステイハングリーは `font-size:14rem`（140px）の袋文字を opacity .3 でカード右上に置く純粋な装飾。カミナリゲームスは同じ Oswald でラベル14px・数字22px、中央揃え、下に幅20pxの1px罫を引く情報としての番号で、タイトルの上に積む。番号を大きくするか小さくするかはサイトのトーンで決める判断事項で、どちらかが正解ではない。
- カード本体に border を付けている例が7サイトで0件。分離は「セクション背景を #f7f6f6 にしてカードを #fff にする」背景色差、1層の影、疑似要素オーバーレイの3つだけ。枠線は常に装飾レイヤー側の仕事になっている。
- 矢印ボタンは丸が縮んで中のアイコンが拡がる。`span:hover{scale(.85)}` に対して `span::after:hover{scale(1.175)}`。0.85×1.175≒1なので、アイコンの見た目サイズは変わらず丸だけが引き締まる。素朴に親だけ scale するとアイコンも一緒に縮んで弱くなる。「子で逆数をかけて打ち消す」という発想。
- 画像を object-fit:cover で統一していない。イロコト自社サイトは実績＝cover（全面トリミング）、ブログサムネ＝contain + 余白にブランドのピンク #fae1e4 を敷く、と内容で使い分けている。入稿画像の比率がバラバラになるブログ側はグレーのプレースホルダではなくブランド色の下敷きで埋めるので、比率が揃っていなくても一覧が1枚の絵に見える。
- カードの padding が4辺で違う。ステイハングリーのサービスカードは1920px換算で上46 / 右50 / 下32 / 左60px。左を厚くして本文の視覚的開始位置を揃え、下は min-height で高さを固定しているから薄くし、右上に140pxの連番が入るので右は中間。「カードの余白は4辺同値」という既定が明確に破られている。
- パンくずの区切りが文字ではなく矩形。`width:6px; height:1px; background-color:rgba(32,32,32,.5)` の横線を `:nth-child(n+2)::before` で描く。「>」や「/」を使うと書体によって重心がずれるのを避けている。色も専用のグレーではなく本文色の alpha .5。
- 表組みが7サイトで一度も使われていない。`table`/`th`/`td` に当たっているのはリセット由来の `td,th{vertical-align:top;padding:0}` だけ。会社概要や募集要項のような「表に見えるもの」は全部 dl/dt/dd か grid。PC2列→SP1列の切り替えがメディアクエリ1個で済むからで、レスポンシブを優先して table を捨てている。
- 2列グリッドの定義リストで、最終行の罫線に `:nth-last-child(2)` を使っている。各 dl は border-top のみ、`:last-child` に border-bottom を足すのが定石だが、2列だと最終行に2件あるので最後から2番目にも必要。しかも PC時（min-width:1025px）に限定している（SP は1列なので不要）。実装しないと絶対に気付かない詰め。
- コーナー装飾は1枚のSVGで4隅を作る。24×24pxの凹んだ四分円を1つ用意し、`:before` が左、`:after` が `scale(-1,1)` で右、`.bottom` 側の span が `scale(1,-1)` で上下反転。対角2隅の場合は `rotate(180deg)`。素材は1個、CSSのtransformで4パターン。装飾レイヤーには必ず `pointer-events:none`。
- 角に貼る装飾を -1px はみ出させる。カミナリのコーナー装飾は `left:-1px` / `right:-1px`、WIT STUDIOの番号バッジは `top:calc(-1 * var(--vw-scale))`。サブピクセル丸めで背景が1px透ける細線を潰すための実装上の保険で、デザインデータと1pxズレても直さない。
- タグが角丸のピルではなく角のある黒い小箱。`padding:6px`（上下左右均一、横を広げない）、`background:#0f0f0f`、`font-size:1.3rem`、border-radius なし。間隔も gap ではなく親の負マージン（-10px）と子の正マージン（10px）。さらに親に `pointer-events:none` / a に `pointer-events:all` で、下のカードリンクとクリックを住み分けている。
- 細線を vw で指定するとき `max()` で床を張る。`border-left:max(.2083333333vw,1px) solid #181818`。vw指定の線幅は画面が狭いと0.5pxになって端末依存で消える。7サイト中 max() が使われているのはこの4箇所だけで、vw設計で細線を引くときの必須イディオム。バー色をアクセントにせず本文色 #181818 にしているのも意外。
- SP で1列に逃げない。WIT STUDIO は PC 3列のカードリストを `max-width:1024px` で `repeat(2,1fr)` に落とし、1列にしていない。全体でも repeat(2,1fr) が11件で repeat(3,1fr) の6件より多く、しかも `gap:0 20px` のように row-gap を0にする書き方が多い（gap:0 系は計21件で最頻）。
- `@media (any-hover:hover)` が7サイト全てで例外なく守られている唯一のルール（NOKIDだけ `@media (hover: hover)`）。素の :hover は書かない。ところがその対になる `:focus-visible` は自前コンポーネントに1件も無く、全てスライダーライブラリ由来。タッチ対応には徹底しているのにキーボード対応は完全に抜けている、という非対称。
- 引用に左の縦バーも引用符も使わない。`background:#f5f5f5; padding:20px 40px; line-height:2; border-radius:6px` のグレーの面だけ。しかもリセット側で `blockquote:after,blockquote:before{content:none}` と引用符を明示的に殺している。左右の padding が上下の2倍で、横に深く入れることだけで引用らしさを出している。
- 二重枠の間隔はカードの padding がそのまま決める。外枠をラッパーの `:before`（pointer-events:none）に、内枠を `_Inner` の border に分け、ラッパーの `padding:0.5208333333vw`（1920pxで10px）が枠の隙間になる。外枠を要素自身の border にしないのは、ラッパーが `overflow:hidden` を持つため枠線を中身より上に出す必要があるから。

### ボタン・リンク・フォーム

- ホバーで影が『消える』。anycareerのカードは基本状態 `box-shadow:0 0 20px 5px #ebebeb` → ホバー `box-shadow:0 0 0 0 #ebebeb`。業界標準の『lift on hover』の真逆で、カードは浮かずに紙へ沈む。イロコトの白リング `0 0 0 2px #fff` → `0 0 0 2px transparent` も同じ思想。この会社は加算ではなく減算でホバーを作る
- ホバーで円が縮み、中の矢印が同じ比率で拡大する。WIT STUDIO: `.c-btn a:hover > span{transform:scale(.85)}` と `.c-btn a:hover > span::after{transform:scale(1.175)}`。0.85×1.175≈1なので矢印の見た目は変わらず台座だけが締まり、『押し込まれた』感が出る。普通にやるとアイコンも一緒に小さくなって『遠ざかる』印象になる。逆数をかけて打ち消すこの発想はCSSを読まないと絶対に分からない
- 矢印は『スライドして戻る』のではなく『通り抜ける』。anycareerの@keyframes moveArwは 50%で opacity:0 + translateX(100%)、51%で translateX(-100%) に瞬間移動して100%で戻る。往復が一切見えない。方向別に3本（右 moveArw / 左 moveArw-b / 斜め右上の外部リンク用 moveArw-w）用意され、transition ではなく animation + forwards なのでホバーを外しても必ず完走する
- 本文リンクは初期状態で下線あり、ホバーで下線を『外す』。`.acf_content a,.post-type-post a,.sw-Txtarea a{text-decoration:underline}` → `:hover{text-decoration:none}`。一般の『下線なし→ホバーで下線』の逆。グローバルは `a{text-decoration:none;color:inherit}` なので、下線はCMS出力エリアにだけ限定されている
- transition 宣言そのものを @media (any-hover:hover) の中に入れている。:hover ルールだけを囲うのではない。これによりタッチ端末では transition プロパティ自体が存在せず、タップ後にホバー状態が張り付いてだらだらアニメーションする事故が構造的に起きない。4サイトで確認できた、最も実用価値の高い書き方
- 離脱アニメだけ transition を書き分けて『縮まずフェード』させる。カミナリの `.sw-Button:after` は基本 `transition: width 0s ease-out 0.6s, height 0s ease-out 0.6s, opacity 0.6s ease-out`、ホバー `transition: width 1s ease-out, height 1s ease-out, opacity 0s`。入りはサイズ1秒、出はopacityだけ0.6秒フェードしてサイズは0.6秒後に0秒でリセット。これを書かないと巨大な円が1秒かけて縮むのが見えてしまう
- テキストのホバーが色変化ではなく色収差。NOKID: `text-shadow: -3px 0 0 rgba(89,255,235,.5), 3px 0 0 rgba(255,89,89,.5)`。文字色 #0f0f0f は一切変えず、シアンを左3px・レッドを右3pxに置いてRGBズレだけを見せる
- ホバーの枠線は『無彩色→アクセント色のベタ』ではなく、部品の格に応じて彩度を2段階に使い分ける。主役の矢印円は `#b5b5b5` → `#35b1c1`（ベタ）、脇役のページネーションは `rgba(53,177,193,.3)`（30%アルファの淡い枠）。全部ベタにすると画面がうるさくなる
- エニーキャリアの横長ボタン .sw-Btn にはホバー状態が一切存在しない。:hover も :after も transition もゼロ。意図的で、主役は矢印円の .sw-Link、.sw-Btn は『敢えて無反応にした二次的リンク』。部品に格付けして下位は動かさないという設計
- 円の中の矢印を px ではなく円に対する % で置く。ENILIS `width:30%;height:10%`（SVG viewBox 24x8 の3:1と比率が一致）、ステイハングリー `right:37.8%`。円のサイズを変えれば矢印が自動追従するので、ブレークポイントごとに矢印の数値を書き直す手間が消える
- ENILISとステイハングリーの円形ボタンは `margin:0;top:auto;left:auto;right:auto` のリセットまで含めて一字一句同じで、色だけ #181818 / #111 に差し替わっている。社内で使い回している部品そのものが見える。そして横長ピルより、この『円＋テキスト』の方が出現頻度が高い
- ホバー減光の house value は opacity .6。全件集計で .6 が17件、.7 が7件、.8 が4件、.75 が3件。一般的な .8 は少数派。既に薄い補助テキスト（元 opacity .5）はさらに .3 まで落としており、相対的な落差ではなく絶対値で運用している
- ボタンの拡大は scale(1.03) が上限で、1.05〜1.1 は画像とカード専用。横幅280pxのボタンを1.05すると14px伸びて隣とぶつかるので物理的に妥当。部品の種類ごとに拡大率の上限を分けている
- 矢印の実装が社内で4通り混在している。border三角（イロコト）/ clip-path:polygon(0 0, 0% 100%, 100% 50%)（カミナリ）/ data-URI背景（ENILIS）/ インラインSVG+fill（ステイハングリー）。1サイト内では統一されているが会社としての標準が無い。採用すべきは clip-path か SVG+fill で、この2つだけが色をCSSからトランジションできる
- 少数派のNOKIDが技術的には正しい。NOKIDだけ `@media (hover: hover)` を24件使い、他6サイトは `any-hover` を17〜36件使っている。any-hover は『いずれかの入力機器がホバー可能なら真』なのでペン付きAndroidやタッチ対応ノートPCでも発火する。主要入力機器で判定する hover:hover の方が意図に合う。多数決で選ぶと間違える
- WIT STUDIOだけ rem を捨てて `--vw-scale: calc(100vw / var(--vw-base))` + `calc(240 * var(--vw-scale))` で書いている。Figmaの数値をそのまま転記できるので、他6サイトの『html font-sizeで1rem=10pxを作る』方式より明快。`--vw-base` を 1920→1360→768 と差し替えるだけでブレークポイントが切り替わり、`max(..., 1px)` で下限も保険してある
- ホバーの色変化をグラデーションの位置移動で作る。WIT STUDIO: `linear-gradient(to right,#629f2f 0,#1a7e3a 50%,#629f2f 100%) top left 0/200% 100%` → `:hover{background-position:top left 100%}`。両端と中央に3色を置いて左右対称にしてあるので、0%でも100%でも同じ色になり往復しても破綻しない
- ホバーを `[href]` 属性セレクタで絞っている（NOKID、23箇所）。CMSでリンク先未設定だと <a> から href が落ちるため、見た目だけ反応して押せない事故を1文字で防いでいる。JSでクラスを付け外しする必要がない
- テキスト＋矢印リンクの親に `pointer-events:none` を置き、テキストと矢印だけ `auto` に戻している（anycareer .sw-Link）。flexコンテナは文字より広い矩形を持つので、素直に書くと余白にカーソルが来ただけでホバーが点灯する。それを防ぐ処理だが、実装としては width:fit-content の方が素直で壊れにくい
- ラベルは text-align:center のまま、矢印側にだけ padding を入れて光学的中央を作る。イロコト `padding:0 25px 0 0` で文字が12.5px左へ寄る。WIT STUDIOは左右非対称に 80px / 65px でアイコン側を15px広く取る。left/right を個別に position 指定するより壊れにくい
- イロコトのボタンは flex を使わず `line-height:60px`（height:60px と同値）で縦中央を取っている。そして `:hover:after{transform:translate(6px,-50%) rotateX(180deg)}` の rotateX(180deg) は、border-width:5px 0 5px 12px の上下対称な三角形に対しては視覚的に何も起きない無意味な指定。完璧ではない
- 必須だけでなく任意にもバッジを出す（nokid、幅40px固定 + flex-shrink:0）。『無印＝任意』にすると全項目を読むまで任意だと分からず入力の心理的負荷が上がる。両方書けば埋めるべき数が一目で分かる
- ENILISの入力欄には border 宣言が一切ない。白背景だけで入力欄を成立させ、高さは `line-height:240%` で稼いでいる（15px×2.4 + padding 6px×2 = 48px）。NOKIDの `border:1px solid #ccc` と正反対。枠線なしで44px超を確保する手として賢いが、ページ背景が白いサイトでは完全に消える
- ピルの角丸に 9999px や 50% を使わず、200px / 100px / 78px / 70px / 65px と適当な大きな値を直書きしている。イロコトの78pxは高さ60pxに対して中途半端で意味のある数字ではない。一方カードの角丸は 6px が18件 + .78125vw（=6px@768）が15件で、house value として完全に固まっている

### ヘッダー・ナビ・フッター

- ハンバーガーの線は3本ではなく2本。6/7サイトが2本線で、3本線は enilis だけ（それもSVGのdata URI）。さらにDOMが極小で、線は要素自身か span 1個の ::before/::after で描く。span×3 のよくある実装は1サイトも無い。irokoto は2本の線の幅が 30px / 20px と非対称で、開くと両方25pxに揃う
- 画面外に逃がす値が -100% ではなく translateY(-101%)。全14ファイルを grep して -101% が5件（enilis:2 / nokid:1 / stayhungry:2）、-100% が0件。1%余分に逃がしてサブピクセルで線が1本残るのを防ぐ、という判断が3サイトで一致している
- SPのドロワーナビは1列スタックではなく2カラムグリッドが3/7サイト（stayhungry / witstudio / anycareer）。しかも列ギャップが異様に広く、stayhungry は gap:11.71875vw 26.0416666667vw（=90px 200px @768）。フッターナビも stayhungry / enilis が同じく2カラムに落とす
- カレントページとホバーの印は下線ではなく直径5〜6pxの円。anycareer 5px / witstudio 6px / enilis .2604166667vw(=5px@1920) と3サイトで実質同一サイズ。しかも anycareer はスクロール縮小時に top:-15px → -10px と円の位置まで追従させている
- PCのドロップダウンを持つのは7サイト中1サイト（anycareer）だけ。残り6サイトはPCナビをフラット1階層で押し通している。その1サイトも動きは translateY(-5px) → 0 の5pxだけで、SPでは階層を潰して親の下に opacity:.5 で平置きする（アコーディオンを作らない）
- モバイル下部の固定CTAバーが7サイト中0件。日本の制作会社サイトの定番なのに誰もやっていない。position:fixed で bottom を取る要素を全ファイルから検索して4件しかなく、どれも右下の小さいバナーかページトップボタン。コンバージョンはフッター直前の巨大CTAブロック（nokid の .st-Footer_Contact は padding:76px 100px の大ボタン2枚）で取る設計
- ホバー下線は「左から入って右へ抜ける」ワンウェイで、往復しない。しかも3サイトが3通りの実装で同じ挙動を作っている —— irokoto は left/right アンカーの入れ替え、witstudio は transform-origin の right→left 入れ替え、enilis は background-position の right→left 入れ替え。実装は違うのに挙動が一致しているので、意図的な共通作法
- 6/7サイトが「リサイズ中は全要素のtransitionを殺す」グローバルクラス（.resizing / .is-resizing / .--resizing）を持っている。中身は完全同一で transition:none!important;transition-delay:unset!important。そして持っていない2サイト（stayhungry / enilis）が、ナビに !important を4つ並べて同じ問題を力技で解決している。相関が完全に一致
- トランジション時間がサイトごとに1本に統一されていて、新しいサイトほど遅い。irokoto .2s(89回) → anycareer .2s(66回) → stayhungry/enilis/nokid .3s(81/85/45回) → kaminari 0.4s(42回) → witstudio .6s(1903回)。「ヘッダーは速く、ドロワーは遅く」のような使い分けを一切しない
- イージングもサイトごとに1本で、サイトをまたいだ共通曲線が存在しない。cubic-bezier(.22,1,.36,1) は anycareer のみ34件、cubic-bezier(.31,2.8,.5,1.2)（y=2.8 のオーバーシュート）は witstudio のみ240件。イージングはブランドの声として1本選ぶもの、という扱い
- backdrop-filter のすりガラスヘッダーは2/7サイトだけ。しかも値が blur(.4166666667vw)=8px と rgba(255,255,255,.84) で完全一致。多数派は無地の不透明色（#fff / #0f0f0f / rgba(255,255,255,.9)）。「固定ヘッダーはすりガラス」は彼らの標準ではない
- フッターの背景が7/7サイトで暗色（#202020 / #595656 / #111 / #181818 / #0F0F0F / #282828）。白や薄グレーのフッターは0件。しかも純黒 #000 も0件で、#111〜#595656 のレンジに収まる
- 暗いフッターの区切り線と文字がグレーの実色ではなく白の低α。border-top:1px solid rgba(245,245,245,.1) と color:rgba(255,255,255,.5)。背景色を変えても自動で馴染む
- nokid のドロワー開閉が150ms刻みの3段ステージングで、しかも transition-delay を状態クラスの有無で入れ替えるだけで「開く時は順送り、閉じる時は逆送り」を実現している（Bg:.15s↔0s、LoopText:0s↔.15s、Nav:0s↔.3s）。JSを1行も書かずにクラス1個のトグルで双方向の順序制御ができる
- 100dvh を使っているのは7サイト中1サイト（anycareer）だけで、height:100vh;height:100dvh; の2行併記。残り6サイトのSPドロワーは iOS でアドレスバーぶん下が切れている。彼らも最新ではない
- witstudio だけ rem をやめて --vw-scale: max(calc(100vw / 1920),1px) というカスタムプロパティに移行している。1px の床があるのでヘアライン（height:calc(1 * var(--vw-scale))）が狭幅でも消えず、1025〜1360px では 100vw/1360 に切り替えて縮みすぎを防ぐ。既知の html{font-size:0.5208333333vw} 方式にはこの2つの保険がない
- ホバースタイルが7/7サイトでメディアクエリにゲートされている（6サイトが any-hover:hover、nokid だけ hover:hover）。裸の :hover ルールが1つも無く、cursor:pointer や transition までゲート内に入れているサイトもある
- ロゴのホバーが4サイトで opacity:.6 ぴったり一致。.5 や .7 ではない
- witstudio のPCヘッダーは全幅バーではなく右上に浮かぶピル型（right:30px / top:30px / border-radius:100px / padding-left:60px / box-shadow 0 0 20px rgba(20,22,20,.1)）。しかもCTAボタンを別マークアップにせず、ナビの最後の li に :last-of-type で緑のピルを当てている。HTMLがリスト1本で済む
- anycareer のヘッダーは「左上の白い札＋右上の水色の札」の左右対称コーナータブで、border-radius は画面の外側に接する角だけ0にして内側だけ丸める（ロゴ側 0 0 6px 6px / ハンバーガー側 0 0 0 6px）。さらにスクロールすると白い札の背景が rgba(255,255,255,0) に抜けて札だけが消える（display:none にしないので transition が効く）
- ヘッダーの縮小後の高さが4サイトで ±5px に収束（72 / 64 / 66 / 74px）。初期高さは 81〜180px とバラバラなのに、縮んだ先だけ揃っている
- スクロール縮小の実装が2派に分かれ、少数派（witstudio / nokid）の transform:scale() 一発の方が圧倒的に記述量が少ない。witstudio は .l-header__logo と .l-header__content に scale(.85) を当てるだけで、transform-origin をロゴは top left、右寄せ要素は top right にして角を固定している
- -ms-grid（IE用）が古い2サイトに46件残っている一方、nokid.common.css は display:-webkit-box が2件しかない（他サイトは19〜43件）。nokid はミニファイされておらず整形済みで、7サイト中もっともクリーンな手書きCSS。参照実装としてこの1ファイルだけ読む価値がある

### モーション

- grepの出現回数は重要度と一致しない。最多のイージング cubic-bezier(.31,2.8,.5,1.2) は240回ヒットするが、実体はWIT STUDIO1サイトのフッター6要素だけ。transition:(transform|opacity) .6s は818回ヒットするが delay ユーティリティ100個の展開。Autoprefixerが transform入りの transition を4パターンに書き出すため、全部が4〜8倍に膨らんでいる。『一番使われているイージング』を頻度で決めると1つのフッターを社の標準だと誤認する。
- モバイルの移動距離がPCより大きい。登場時の持ち上げが PC 20px(2rem)→ max-width:1024px で 3.90625vw = 768px時30px(3rem)と1.5倍に増える。小さい画面では動きを控えるのが定石だが逆。SPは1画面の要素数が少なく縦スクロール量が大きいので、20pxでは登場に気づかれないため。
- opacity と transform で duration を意図的にずらす。同じ宣言内で opacity .7s / transform .8s と0.1s差をつけ、さらにイージングも opacity は無指定(既定ease)、transform だけバウンス曲線にしている。不透明度を先に完走させることで、跳ね返りが『完全に見えている要素』の上で起きる。逆だとバウンスが半透明の間に終わって見えない。1宣言に同じ値を流すのは手抜きだと分かる。
- 50%/51% の1%フレームで瞬間ワープさせ、片道モーションをループに見せる手口が4サイトで共通。0→50%で画面外へ出し、50→51%(.4sなら4ms、知覚不可)で反対側へテレポート、51→100%で戻る。要素を2個重ねたりJSでリセットせず、keyframes1本で『矢印がスッと抜けて次がスッと入る』が作れる。clip-path版(inset bottom100%→top100%)、kaminariのスクロールインジケータ版(bottom基準→top基準)と、同じ発想を3種の異なるプロパティに適用している。
- ローディング幕を 99%でopacity:0、100%でwidth/heightを0 に畳んで捨てる。opacity:0 の全画面オーバーレイは見えないだけで残り、下のリンクが全部クリックできなくなる。普通は pointer-events:none かJSで要素削除するが、最後の1%で箱を潰すだけで解決している。99%までフルサイズを維持するのでフェード中の見た目は変わらない。JSもpointer-eventsも不要。
- ホバーで円が縮むとき、中のアイコンに逆数を当てて実寸を打ち消す。親 scale(.85) × 子::after scale(1.175) = 0.99875 ≒ 1。『円だけが15%縮んで、中の矢印はピクリとも動かない』。親を縮めれば子も縮むという当たり前の挙動を、子に1/0.85を当てて殺している。アイコン入り丸ボタンでアイコンが潰れて汚くなる問題の正解。.85と1.175はセットで覚える値。
- 下線は transform-origin を right(通常)→ left(ホバー)に切り替える。originを固定すると離脱時に線が入ってきた方向へ逆再生で引っ込み、ビデオの巻き戻しに見える。入れ替えると出入りとも左→右に流れる。origin:right 14件 / origin:left 14件と完全にペアで出ており意図的。
- 登場後の値を一切書かない。`.js-fade{transition:.7s ...}` を常時かけ、`:not(.is-animated)` に opacity:0 と translateY だけ置く。JSがクラスを足すと :not() が外れて要素が『素の状態』に戻ることで登場する。opacity:1 や transform:none を書き忘れる事故が原理的に起きない。通常の2状態記法の逆。
- ケンバーンズがズームアウト(1.15→1)。ズームインは終端で画像が切れて構図が崩れるが、アウトなら終状態が必ず等倍=デザイン通りの構図に着地する。しかも 6.5s という長尺に cubic-bezier(0,.8,.2,1) の前半偏重イージングを当てて、最初の1秒で大半のズームを済ませ残り5秒はほぼ静止させている。
- ヘッダーの縮小が scale(.85) のみで、height も font-size も padding も触らない。しかも 1025〜1500px では非スクロール時も .85 にして、幅が足りないときのロゴ縮小を別のフォントサイズ指定で書かずに済ませている。1つの縮小率でスクロール時とタブレット幅時を兼用している。
- 無限ループのイージングが用途で完全に2択。平行移動・回転は必ず linear(マーキー30s、背景75s、回転6s)、往復運動は必ず ease-in-out(浮遊5s、インジケータ2s)。混ざった例が1件も無い。一方向に流れるものにイージングを当てると1周ごとに加減速してカクつきに見え、往復にlinearを当てると折返しが鋭角になる。
- 無限ループの位相差に負の animation-delay を使う。-0.1s刻みで11段。正のdelayだと『全員止まったまま順番に動き出す』立ち上がりが見えるが、負なら表示の瞬間から12個全部が別の位相で回っている。keyframes側も1%フレーム芸で、39%→40%の1%で opacity 0→1 に鋭く点け、40%→100%の60%かけてだらりと消す。
- 色の変化は動きの倍速。color/fill は .2s、transform は .4s と階層が分かれている。『全部0.3sで統一』より、色だけ0.2sに落とす方が反応が良く感じる。位置が動かない変化は目が追えるので速くてよく、むしろ遅いとモッサリする。
- will-change をほぼ使わない(1.3MBで22件、イロコト自社とエニーキャリアは0件)。backface-visibility:hidden の70件も、自作CSSでは1〜4件で残りはswiper/splideライブラリ由来。『とりあえず translate3d や will-change を付けて GPU 化』は真似すべきでない旧手法だと彼らの実装が示している。
- 見出しワイプの色ブロックは文字boxより上下5pxずつ大きい(height:calc(100% + 10px) / top:-5px)。line-height:1 でも日本語グリフは行boxを上下にはみ出すので、height:100%ちょうどだとワイプ前なのに文字の先端が顔を出す。font-size:3rem(30px)に対して約33%の余裕。実装を見ないと絶対に分からない類の数値。
- nth-child によるスタッガーが7サイトで0件。全部クラス指定(js-fade-delay / u-animation--delay7)。デザイナーが『この要素はステップ7』と指定すれば実装が一意に決まるので、指示と実装のズレが起きない。自動化より明示を選んでいる。

### レスポンシブ

- font-size に clamp() を使っているサイトがゼロ。14ファイル全部で font-size:clamp( / min( / max( の出現数が0。流体タイポグラフィを個別に書く代わりに、html の font-size 自体を vw にして全rem を一括で流体化している。「clampを使わない」のではなく「rootで一括clampをやっている」。コンテナクエリ（@container / cqw）も7サイト全部で使用ゼロ、100%メディアクエリ。
- グリッドは3列→2列→1列の段階を踏まない。1024pxで一気に3列→1列に落とす（エニーキャリア2箇所、ENILIS、ステイハングリー2箇所）。3列→2列にしているのは最新のWIT STUDIOだけ。中間段階を作らないほうが設計・検証コストが激減するという割り切り。
- ナビゲーションのリストはスマホで列数が「増える」。PCは display:flex の横1列、SPは grid-template-columns:repeat(2,1fr) の2列。しかも行gapが80〜100px@768（実寸39〜49px）と極端に大きい。「スマホは1カラム」の真逆。
- 1列化するとき gap を0にして、カード個別ではなくリスト自体に background:#fff / border-radius / box-shadow を付け替える。3枚の浮いたカードが1枚の分割カードに変わる。CSSを読まないと絶対に気づけない（anycareer .index-Sustainability_Contents_List）。
- line-height がモバイルで「詰まる」。本文2.4→2.2、見出し1.7→1.6、リード240%→200%。「スマホは行間を広げて読みやすく」の定説と逆。ただし42px級のディスプレイ文字だけ140%→170%に緩む。PC本文の240%という和文行送りの大きさ自体も驚き（欧文1.5の1.6倍）。
- ブレークポイントは「ナビ用」と「コンテンツ用」で別軸に分けられる。イロコトは1200pxでハンバーガー化し、768pxでコンテンツを1列化する。間の768〜1199px用に .tab_b というタブレット専用ユーティリティまで用意している。1024pxに統一すると1100pxの画面でナビが窮屈なのに2列のままという破綻が出る。
- 中間ブレークポイント（1160/1199/1360/1388/1700px）はヘッダーとフッターの修正にしか使われていない。1160pxの3ルール全部がヘッダーロゴ、1388pxはフッターコンテナ、1700pxはフッターメニューの列幅。コンテンツセクションの数値は一切触らない。ブレークポイントを増やすべき場所が明確に決まっている。
- PCの2カラムは repeat(2,1fr) ではなく「固定px + 1fr」の非対称（290px 1fr / 380px 1fr / 550px 1fr / 850px 1fr / 115px 1fr）。1fr同士だと両方伸び縮みして可読幅が崩れるから。SPで1列化するとき 1fr ではなく 100% と書くのも意図の明示。
- max() の使いどころがヘアラインだけ。ENILISの max() 使用4件は全部 border（max(.2083333333vw, 1px)）。可変vw設計で本当に壊れるのは1px級の細部だけ、と見切っている。
- モバイルの vw 値は全部768pxでピッタリ整数pxになる。しかも768と1920が1:2.5の比なので、同じvw文字列がPCでもSPでもキリのいいpxになる（5.2083333333vw = 40px@768 = 100px@1920）。だからデザイナーはPC値を25の倍数で選べば、SPは自動的に10の倍数に着地する。
- タブレット専用レイアウトを作らず、viewportを width=1440 に書き換えてPCデザインを縮小表示させる手がある（カミナリゲームス）。さらに768〜1280pxでは body{min-width:1280px; overflow-x:scroll} でページ全体を横スクロールにしている。実装は古くて真似できないが、「タブレットに専用デザインを作らない」という判断自体は検討に値する。
- モバイルで display:none にするのは装飾と英語サブラベル。カミナリは .deco-shapes / .deco-pattern / .deco-text / .pagetitle-sub / .main-scroll を全部消している。縮小せず削除。SP側のdisplay:noneが65件に対しPC側は10件（ほぼ全部ハンバーガー関連）で、モバイルは完全に「PCの引き算版」。
- 横スクロールは表ではなくパンくずとカテゴリナビに使う。7サイトで表の横スクロール実装は1件もない。会社概要は定義リストの2列（260px 1fr → SPは190px 1fr で2列維持）で成立させているので、そもそも横スクロール表が不要な設計になっている。
- vh単位をほとんど使わない（14ファイル中4ファイル、最大8箇所）。全画面ヒーローは height:100vh; max-height:55.2083333333vw; min-height:37.2395833333vw と vw で上下を挟んでアスペクトを縛る。100vh ベタ書きのフルスクリーンセクションは存在しない。
- エニーキャリアはPCでもハンバーガーメニューを使っている（.st-Header_Hamburger が BASE かつ :hover 定義あり、PC側のdisplay:noneリストに不在）。横並びナビをPCで出さない選択もある。

### アクセシビリティと堅牢性

- 『!important の回数は保守性の指標』は、このコードベースでは完全に成立しなかった。396回のうち248回が display で、その実体は .pc_b/.sp_b/.pc_f/.sp_f/.pc_ib/.sp_ib という表示切替ユーティリティ1セットだけ。残りも transition / transition-delay 系が58件でアニメーション無効化に集中。場当たりの上書きは実質ゼロ。!important は数えるのではなく、どのプロパティに付いているかを数えるべき
- ホバーには異常に丁寧で、フォーカスには一行も書いていない。@media (any-hover:hover) を173回・6サイトで使い、さらに @media print and (any-hover:hover),screen and (any-hover:hover) and (min-width:1025px) と二重に掛けてタッチ端末のホバー張り付きを構造的に防いでいる。その同じ会社が、1.3MB中で :focus-visible を一行も書いていない（唯一の1件はSplideライブラリの #0bf デフォルト）。『マウス以外の入力』への想像力がタッチにだけ向いていて、キーボードには向いていない
- 未解決のSassが本番に出荷されている。height:_vwSP(376) / font-size:_vwSP(24) / top:_vwSP(30) が11箇所、関数名を打ち間違えた font-size:vwPS(28) が1箇所、そして --text-color:$green。しかも var(--text-color) は7箇所で参照されていて全部無効。これは『生CSSを読まないと絶対に分からない』類の発見で、ビルド結果を検品していない証拠。真似する側は納品前grepを工程に入れるべき
- カミナリゲームスは『vwが縮みすぎないようpx固定帯を作る』という、7サイト中で最も正しい発想を持っている。768〜1280pxの帯で vw を実pxに凍結している。ところが凍結した値が font-size:9.33324px（ニュース見出し、5箇所）と font-size:7.99992px（日本語の見出し）。発想は満点、数値は0点。発想だけ借りて数値は捨てる、という読み方が必要
- タップターゲットが小さいのは『vwを使っていないサイト』と『vwを使っているサイト』の両方だった。イロコト（px固定）はメニュー87×33px、バナー閉じる31×31px。エニーキャリア（vw）は前後記事リンクが height:3.3854166667vw で375pxで12.7px。一方で同じエニーキャリアのハンバーガーは width:15.625vw = 375pxで58.6px。単位は無関係で、SPカンプ上の数値が小さいかどうかだけが効いている。『vwで組めばタップ領域は比例して守られる』は誤り
- html{line-height:1} をベースに置いている（5サイト）。line-height の値分布で 1 が47件と最多。日本語で line-height:1 は字が接触するので、全テキストに個別指定（160%/180%/200%/240%）することが前提の設計。1箇所でも漏れた瞬間に崩れる構造を、意図して選んでいる
- デザイントークンという層が存在しない。var() は irokoto / anycareer / stayhungry / kaminari で0件。WIT STUDIO の1065件も中身は --vw-scale / --vw-base というvw換算機構だけで、色・余白・タイプスケールのトークンはゼロ。色は color:#fff が69回、color:#35b1c1 が34回と生hexで散っている。DRYを全部Sassのビルド時に解決してしまっているので、ダークモードもテーマ切替も配色の一括変更も構造的に不可能。彼らの設計の一番古い部分
- 英語ラベルの opacity:.2 は、同じルール内で opacity:.2 → opacity:0 と二重宣言されていて初期値は0。.sw-Ttl.is-animated .en が付いて初めて .2 になる。つまりあの『英語は opacity .2 の装飾』という作法は、静的なスタイルではなくJS依存のアニメーション演出の到達点だった。JSが動かないと英語ラベルは存在しないのと同じになる

---

## 2. 真似してはいけないこと

彼らも完璧ではない。ここを一緒にコピーすると事故る。

### タイポグラフィ

- モバイルの font-size を 3.3854166667vw のような生vwで書くと、768pxカンバスで26pxの設計が実機390pxのiPhoneでは13.2pxになる。彼らのCSSには767px以下でルートを戻す段が1つも無い（@media で html{font-size} を触るのは max-width:1024px と min-width:1921px の2本だけ）。本文だけは max(3.3854166667vw, 15px) のように床を作ること
- 1rem=10px は「カンバス幅ぴったりのとき」だけ成立する。1920pxデザインを1440pxのノートPCで見ると全部 0.75倍になり、16px本文が12pxになる。px固定レンジを作りたいなら WIT STUDIO の max(calc(100vw / 1920), 1px) を使う（1361〜1920pxでデザインpxに張り付く）
- font-size に em を使うと親から乗算されて入れ子で膨らむ。NOKIDに 2.0rem と 2.0em の取り違えが実際に残っている。font-size=rem、縦余白=em と固定する
- opacity:.2 の装飾英語をHTMLに本物のテキストで置くと、7サイト全てが aria-hidden 0件なのでスクリーンリーダーが同じ単語を二度読む。装飾側に aria-hidden="true" を足す
- 欧文書体を "PT Sans", sans-serif のように和文フォールバック無しで書くと、その要素に日本語が1文字混ざった瞬間にOSデフォルトに落ちる。NOKIDの 'Jost', 'Noto Sans JP', sans-serif が正しい順序
- palt と正の letter-spacing は喧嘩する。font-feature-settings:"palt" 1 を入れるなら letter-spacing は .02em 以下に落とす。ENILISは palt + .08em で両方かけていて詰めが効いていない
- ボタンラベルの縦センターを line-height:60px（＝ボタン高さ）でやると2行折り返しで壊れる。flexで組む
- CSSカスタムプロパティの中にSass変数を書いても展開されない。WIT STUDIO の :root に --text-color:$green が文字列で残って出荷されている。#{$green} と補間が必要
- カミナリゲームスのHTMLには viewport meta が2本（width=1440 と width=device-width）入っていて、どちらが効くかブラウザ依存。1本に絞る

### カラー

- アクセント色のベタ塗りに白文字を乗せる実装をそのままコピーすると、コントラスト不足を引き継ぐ。#fff on #f09ba5 は約2.1:1、#fff on #35b1c1 は約2.5:1 で、WCAG AA の 4.5:1 に遠く届かない。しかもイロコトはそれを 4px 8px の小さいカテゴリタグでやっている。明るいアクセントのベタ塗りには白ではなくインク色を乗せる、または枠線+アクセント文字に変える。
- 色をCSSカスタムプロパティで一切管理していないので、彼らのCSSから色の構造を読み取ることはできても、構造ごとコピーすると後から1色も変えられないサイトになる。彼らの「色の決め方」だけ借りて、「色の持ち方」は :root トークンにすること。
- SVGアイコンの色が data URI に %23XXXXXX で直書きされていて、7サイト合計148箇所ある。アイコンをホバーで色変えするために background-image をもう1本まるごと書き直す実装になっている。アイコンは inline SVG + fill:currentColor、または mask-image + background-color にしないと、色トークンがアイコンに届かない。
- body に color を書かないとリセット（destyle.css v2.0.2、7サイト全部これ）が色を設定しないので、クラスが当たらない要素だけ純黒 #000 で出る。NOKID は #0f0f0f をインク色として24回指定しているのに body には載せておらず、実際にこの穴が開いている。
- PCで決めたインク色の罫線や三角マーカーは、SPでナビやセクションが暗転すると背景に溶けて消える。ステイハングリーは 1024px 以下で border-color を #111 → #cea948 に差し替えてこれを回避している。SPで暗いドロワーを使う設計なら、インク色指定を全部ブレークポイントで見直すチェックが必要。
- グラデーションの角度や停止位置に Figma 書き出しの端数（89.89deg / 1.09% / 46.41% / 88.1%）がそのまま残っている箇所がある。コピーすると意味のない端数を引き継ぎ、後から手で調整できなくなる。90deg / 0% / 46% / 88% に丸める。
- カテゴリ色の切り替えを !important 付きモディファイアでやっている（WIT STUDIO の #ff6485/#ee8421/#59a8e4 が各3宣言すべて !important）。これを真似ると、そのカテゴリ色をホバーで変えることすらできなくなる。「後から色を差し替える仕組み」が必要な箇所こそ、!important ではなくカスタムプロパティを使う合図。
- prefers-color-scheme が14ファイル中0件で、ダークモードは後付け不可能な構造になっている。色をハードコードした結果なので、トークン化しておけば同じ見た目を保ったまま余地を残せる。
- 影に不透明な薄グレー（エニーキャリアの #ebebeb）を使う手法は、カードが #fff の上にあるときだけ成立する。#f5f5f5 のセクションに同じカードを置くと、影が四角い縁として見えてしまう。流用するなら alpha に置き換える。

### 幅・グリッド・余白

- rootフォントサイズの3段切り替え（62.5% / 0.5208333333vw / 1.3020833333vw）を先に入れないと、rem値だけ流用した瞬間に全部1.6倍になる。コンテナ幅のCSSより先にこれを書く。
- vwの小数を手打ちすると `9.375vw` が180pxなのか判読不能になり、修正時に必ず事故る。WIT STUDIO方式の `calc(180 * var(--u))` にすれば設計値がそのまま読める。既存6サイトの手打ち小数vwはコピペ元として使わない。
- WIT STUDIOの `--vw-scale:max(calc(100vw / var(--vw-base)), 1px)` をそのままコピーすると、1361〜1920pxのレンジでスケールが1pxに固定され、1920px幅の装飾背景が画面からはみ出す（body の overflow-x:hidden で隠れているだけ）。max() の下限は外すこと。
- `width: calc(1200 * var(--u))` は固定幅なので、ビューポートが1200px+ガターを下回ると横スクロールが出る。コンテナは必ず `max-width` で当てて `width:100%` と併用する。WIT STUDIOの --wide は max-width、--inner は width で書かれていて不統一。
- モバイルの縦余白をデスクトップの半分にすると実機で余白が消える。768キャンバスの数値は実機で0.4〜0.5倍に縮むので、デスクトップと同値から始めて必要なら増やす（イロコト120px→140px、NOKID 140px→200px）。
- 小さい部品（アイコン・罫線・ボタン）を1920版の数値のまま768版に持ち込むと実機で見えなくなる。アイコンは1.4倍、ボタンは1.25倍を目安に768版で描き直す。ステイハングリーは10px→14px、12px→18px、80px→100px、180px→220px。
- `padding-top: 65.789%` のような手計算の比率はコピペしてはいけない。画像を差し替えた瞬間に枠と中身が合わなくなる。aspect-ratio を使い、WIT STUDIO式に `aspect-ratio:460/260` と実寸をそのまま比で書く。
- カミナリゲームス式の非整数px（986.6568px / 579.9942px）を768〜1280pxのような広いレンジに焼き込むと、レンジ両端で必ず破綻する。設計ツールの書き出し値をそのまま貼らない。
- gapを片軸だけ書く彼らの流儀（`gap:0 60px`）は、両軸書くつもりで読んだ人が列方向だけ効いていることに気付かず事故る。チームで使うなら「gapは常に2値」をルールとして明文化する。
- `-ms-grid-row` / `-ms-grid-column` / `grid-column-gap` / `-webkit-box` 系のプレフィックスは全部autoprefixerの遺産。browserslistを現行にして消す。イロコトは60宣言、NOKIDは24箇所が無駄。
- 単一コンテナクラスが無い作りをそのまま真似すると、1200pxを変えるのに26箇所の修正が必要になる。最初に `.l-inner` と3つのモディファイアを作ってからページを組む。
- position:sticky がこの7サイトに1回も出てこない。追従ヘッダー・追従目次・追従CTAを入れる場合、参考にできる前例がゼロなので自分で設計・検証する必要がある。
- `--text-color:$green` のようにSass変数が未解決のまま本番CSSに漏れて、それを参照する7宣言が無効化されている実例がある（witstudio.app.css）。ビルド後のCSSに `$` が残っていないかgrepで確認する工程を入れる。
- 同一ルール内で同じプロパティを2回書いて前者を殺している箇所がある（`grid-template-columns` 4列→5列、`gap:13.02vw 0;gap:0`）。彼らも消し忘れている。

### カード・部品

- WIT STUDIOの :root に Sassの変数が未解決で残っている。`--text-color:$green` は全1.3MB中で1回しか定義されず上書きもされないのに、`var(--text-color)` が7箇所で使われている。`$green` はCSSとして無効な値なので、`color:var(--text-color)` は継承色に落ち、`background:var(--text-color)` は透明になる。結果として `.c-job__item-heading::before` と `.p-job__category::before` の丸ポチ（8px/10px）が2箇所とも見えず、`.c-job__list-item a::before` の下線バー（scaleX(0)→1のアニメ）も透明のまま動いている。CSS変数でブランド色を配る設計は正しいが、ビルド後のCSSを `grep -oE '\-\-[a-z-]+:\s*\$'` で必ず検査すること。
- ステイハングリーの連番に死んだセレクタがある。`.sw-Services .services-Item:nth-of-type(9) ~ .servicesList-Item .link::after{content:counter(number)}` は「10件目以降は先頭の0を外す」ためのルールだが、兄弟側のクラス名が `.servicesList-Item` になっていて、実際のマークアップは `.services-Item`。`.servicesList-Item` はCSS中に1回しか出てこず、HTMLには0件。サービスが10件を超えると「010」「011」と表示される。連番を counter() で組むときは桁が増える境界を実データで必ず確認する。
- 自前コンポーネントに focus / focus-visible のスタイルが1つも無い。7サイト1.3MB中の `:focus-visible` 宣言はすべてスライダーライブラリ Splide 由来（`.splide__arrow:focus-visible{outline:3px solid #0bf;outline-offset:3px}` など）で、カード・ボタン・アコーディオン・タグには皆無。一方で `button,input,optgroup,select,textarea{...outline:0...}` のリセットが14ファイル中12で効いている。つまりキーボード操作時にフォーカス位置が完全に見えない。ホバーを `@media (any-hover:hover)` で律儀に囲む作法は全サイト徹底しているのに、その対になる「ホバーできない人向けのフォーカス表示」が抜けている。ここは真似してはいけない唯一の重大点で、`--ring-hover` と同じ色で `:focus-visible{outline:2px solid; outline-offset:2px}` を必ず足す。
- WIT STUDIOは `u-animation--delay1` から `u-animation--delay100` までを手書き展開しており、各クラスがベンダープレフィックス込みの transition を4行繰り返している。この部分だけで66,334バイト＝ファイル全体285,643バイトの23%。しかもトップページのHTMLで実際に使われているのは11種類だけ。遅延は `style="--d:0.25s"` のようなインライン変数か、`:nth-child(n)` で `calc(var(--i) * .05s)` にして、クラスの事前生成はしない。
- -webkit-text-stroke は標準プロパティではない。ステイハングリーの袋文字連番は `color:transparent` と併用しているので、ストロークが効かない環境では数字が完全に消える。袋文字を使うなら、ストロークが無効なときに読める色へフォールバックするか、SVGのtextでstroke/fillを指定する。
- イロコトの実績カードのホバー円は実装が粗い。`line-height:126px`（=要素の高さと同値＝完全な垂直中央）と `padding:23px 0 0`（=23px下げる）が同じ宣言に同居しているので、文字が中心から23pxずれて下寄りになる。さらに126px角の要素に `border-radius:65px` を当てているが、真円に必要なのは63px（半分）なので3px余分。真円なら `border-radius:50%` と書くのが安全。この2点はコピーせず、`display:flex` + `align-items:center` と `border-radius:50%` に置き換える。
- アスペクト比を `padding-top:%` のハックで作ると、デザインの元寸が読めなくなる。エニーキャリアは PC `padding-top:66.66%` / SP `padding-top:17.96%` と比率を切り替えているが、17.96% が何対何なのか数字から復元できない。WIT STUDIOのように `aspect-ratio:460/260` と元寸の分数で書けば、後から誰が見ても元のカンバスが分かる。新規サイトでは aspect-ratio を使う。
- カード内にリンク付きのタグ列を重ねるときは pointer-events の二段構えが必須。NOKIDは親に `pointer-events:none`、タグの a に `pointer-events:all` を置いている。これを忘れると、タグ列の矩形がカード全体のリンクを食い、カードのどこを押してもタグに吸われるか、逆にタグが押せなくなる。z-index を上げただけでは解決しない。
- kaminari.style.css と nokid.common.css は未ミニファイ（それぞれ4,224行 / 4,083行）で、destyle.css や他のリセットが丸ごと含まれている。`border: 1px solid #000` や `td,th{padding:0}` のような宣言はリセット由来で、サイトの設計意図ではない。grepで値を集計するときはリセット部分を除外しないと数字が歪む。

### ボタン・リンク・フォーム

- ホバーを @media (any-hover:hover) で囲うなら、:active を必ずその外に書く。7サイト全部が :active ゼロ件で、タッチ端末では押下フィードバックが完全に無い。ホバーを囲っただけで満足すると、スマホユーザーに何の反応も返さないサイトになる
- リセットの `button,input,optgroup,select,textarea{...outline:0...}` をコピーしたら、:focus-visible を自分で書き足さないと Tab 操作で現在位置が完全に消える。7サイト14ファイル1.3MB中、自作のフォーカススタイルは0件。ENILISに見える `:focus-visible{outline:3px solid #0bf}` は swiper のライブラリCSS（enilis.lib.css）で彼らの実装ではない
- 同じリセットは select の appearance も剥がす（`select::-ms-expand{display:none}` 付き）。6サイトとも矢印を戻していないので、select が四角いテキストボックスに見える。リセットを流用するなら背景SVGか擬似要素で▼を自分で足す
- vw指定の部品は『768pxでは十分』でも『375pxでは44pxを割る』。実測でエニーキャリアの矢印円 9.1145833333vw=34.2px、NOKIDの菱形 9.38vw=35.2px、WIT STUDIOのボタン高 42.0px、カミナリ 43.9px。min-height が自前で使われている箇所は全7サイトで0件なので、ここは彼らを真似してはいけない
- フォームの font-size をモバイルで16px未満にすると iOS Safari がフォーカス時に自動ズームする。nokid.form.css は 16px→14px に下げていて実際にこの症状が出る。フォーム部品だけは rem/vw スケールの対象外にして16px固定にする
- `display:none` でチェックボックスを隠す（ENILIS・ステイハングリー）とキーボードでフォーカスできず、支援技術からも消える。プライバシーポリシー同意がこれだと、キーボードだけでは送信が完了できない。`appearance:none` か `opacity:0;position:absolute` にする
- ホバーで背景を明るくするときは文字色も一緒に反転させる。nokid の送信ボタンは `background:#0f0f0f` → `:hover{background:#ccc}` で color:white のまま、ホバー中のコントラスト比が約1.6:1になり文字が消える。カーソルが乗っている瞬間に読めなくなる最悪のパターン
- `transition:background-image` は効かない（ENILIS の .sw-CircleBtn::after）。背景色は .3s で滑らかに変わるのに中の矢印だけ瞬間的に切り替わり、0.3秒ズレて見える。アイコンの色を変えるなら インラインSVG+fill / mask+background-color / 擬似要素2枚のクロスフェード のどれかにする
- 矢印を scale(-1,1) で反転させている部品は、ホバーで transform を上書きすると反転が外れる。WIT STUDIOが `scale(-1.175,1.175)` とホバー側にもマイナスを書き直しているのはそのため。ここを忘れると「戻る」ボタンの矢印がホバー時だけ右を向く
- ボタンのスタイルが `.sw-Btn a` `.c-btn a` と <a> 前提で書かれている。HTML実測で <button> はトップページ7枚合計5個しかない。フォームに流用すると送信ボタンに <a> を使う誘惑が生まれる。スタイルはクラス側に置いて <a> と <button> 両方に当て、<button> には font:inherit と line-height の明示を足す
- ブレークポイントは1024/1025が基本だが、カミナリゲームスだけ768/767（min-width:768px が125件に対し min-width:1025px は12件）。複数サイトのCSSを混ぜると分岐がねじれる。流用元を1サイトに決めてから着手する
- 小数6桁のpx値（`width:239.9976px` `height:47.99952px`）が出てきたらSassの計算に頼りすぎたサイン。カミナリはvw値を1280pxで固定する下限クランプをこれでやっているが、いまは `clamp(240px, 18.75vw, 360px)` の1行で済む
- padding の上下非対称は『和文だから下を増やす』と機械的に覚えると入力欄で逆になる。基準は『文字の塊が視覚的に中央に来るか』。中央寄せボタンは下を+2px、左上寄せのtextareaは上を+2px（ENILIS実測 22px/20px）

### ヘッダー・ナビ・フッター

- CSSを移植してもドロワーの背面スクロールは止まらない。7サイト14ファイルに html/body へ overflow:hidden や position:fixed を当てる状態クラスは1件も無く、全部JS側のインラインスタイルでやっている。最小コストの対策は、各サイトが既にドロワーに書いている overflow-y:scroll の隣に overscroll-behavior:contain を1行足すこと。完全に止めるなら body{position:fixed;width:100%} + scrollY復元をJSで書く必要がある
- ハンバーガーのCSSだけコピーすると要素がdivのままになり、キーボードで押せないメニューができる。aria-expanded / aria-controls / role は7サイト全てのトップページで0件、<button>は1/7サイト（カミナリゲームスのみ）、irokotoは <a href="javascript:void(0);">。見た目のCSSはそのまま使って、要素だけ <button type="button" aria-expanded="false" aria-controls="nav"> に差し替える
- 閉じている時のドロワーを pointer-events:none だけで止めると、Tabキーで画面外のリンクにフォーカスが飛んで画面が横スクロールする。witstudio（transformのみ）、kaminari（opacity+pointer-events+負のz-index）、anycareer（pointer-eventsのみ）、irokoto（width:0+pointer-events）の4サイトがこの状態。nokid の transition:transform .3s,opacity .3s,visibility .3s のように visibility をtransitionに含める書き方に直すこと
- stayhungry と enilis の !important の束（display:block!important;opacity:1!important;visibility:visible!important;pointer-events:all!important）をそのままコピーすると、後からナビを隠したい時に一切効かなくなる。この2サイトは .resizing トランジション殺しクラスを持たない唯一の2サイトで、!importantはJSが残したインラインスタイルを力技で消すための後始末。正解は .resizing *{transition:none!important} を入れること（他5サイトは全部これを持っている）
- 1rem=10px固定（html{font-size:0.5208333333vw}）やvw基準レイアウトを採るなら、.resizing *,.resizing *::before,.resizing *::after{transition:none!important;transition-delay:unset!important} と .preload *{同じ} をセットで入れないと、ウィンドウリサイズ中に全要素がニュルニュル動く。6/7サイトが持っている必須の副作用止めで、これを知らずにvw設計を始めると原因不明の挙動に悩む
- width や height や right のアニメーションは真似しない。irokoto（width:0↔100%、height:0↔100%）、anycareer（width:0↔100%、right:-82.8vw↔0）が使っているが毎フレームレイアウト再計算が走る。同じ見た目は transform:translateX/scale + transition-delay で作れる（nokid / witstudio がそうしている）
- enilis の下線ホバー（background-size:0 1px → 100% 1px + will-change:background-size）は真似しない。background-size はGPU合成に乗らず、will-change:background-size は効果がなくメモリだけ確保する。同じ挙動は witstudio の transform-origin:right→left + scaleX で4行
- SPドロワーの高さに height:100% や height:100vh を使うと iOS でアドレスバーぶん下が切れる。height:100vh;height:100dvh; の2行併記をしているのは anycareer だけ（100dvh の出現は anycareer.style.css:3件 / anycareer.about.css:3件、他5サイトは0件）。witstudio の .l-header__inner{height:100vh;padding:...220px} は下端のパディングが見切れている
- irokoto（-ms-grid 32件）と anycareer（14件）のフッターgridをコピーすると、grid-template-areas の名前と -ms-grid-row/-ms-grid-column の行番号を二重管理することになり、レイアウト変更のたびに両方直す羽目になる。新しい5サイトは0件なので、-ms-grid 系の宣言は全部落として grid-template-areas だけ残す
- kaminari の z-index:-8（SPドロワー）は親の .st-Header_Inner{z-index:99} に依存して成立している。親の position や transform を後から変えた瞬間にドロワーが画面から消える。負のz-indexは使わず、正の小さい値（1〜2）で組んで親で浮かせる
- ハンバーガーのサイズを nokid（width:9.9vw;height:3.39vw → 実機390px幅で約39×13px）や irokoto（87×33px固定）から取ると、タップできないボタンになる。44px未満。14.3229166667vw（110px@768）以上を取って、中の線だけ小さく描くこと
- anycareer の .st-Header_Menu_Sub:hover{opacity:1;visibility:visible} は親要素が visibility:hidden なので永久に発火しない死んだCSS。コピーする時はこの1ルールを落とす。ドロップダウンを閉じないようにする判定は親の .st-Header_Menu_Item:hover 側だけで足りる
- witstudio の :root に --text-color:$green というSass変数が解決されずそのまま残っている（ビルド事故）。カスタムプロパティをコピーする時はこれを除くこと

### モーション

- prefers-reduced-motion が7サイト全部で0件。CSSもHTMLも1件も無い。最大5.2秒の連続スタッガー、無限マーキー、2.8倍オーバーシュートを全員に強制している。彼らが既に持っている .is-resizing の全停止宣言を @media (prefers-reduced-motion: reduce) にコピーするだけで対応できるので、流用時は必ず足すこと。これを一緒に真似すると制作物がWCAG 2.3.3に引っかかる。
- 登場待機の opacity:0 がメディアクエリ外のベースルールにあり、@media print の打ち消しが全ファイル0件。スクロール前にCtrl+Pすると本文が白紙で出る。@media print,screen を1465回も書いているのに print 単独が0という非対称。採用サイトや会社案内は印刷されるので @media print{.js-fade{opacity:1!important;transform:none!important}} を足す。
- リセットで button/input/select/textarea の outline:0 を書いたまま :focus-visible の代替が自作CSSに0件(唯一の5件はSplideライブラリ由来)。キーボード操作でフォーカス位置が全サイト見えない。outline:0 を書くなら同じブロックに :focus-visible の指定を対で書く。
- `:not(.is-animated)` で登場前を書く方式は、JSが落ちた/IntersectionObserverが発火しなかった場合にコンテンツが永久に opacity:0 で残る。htmlに .no-js クラスを立てて打ち消すか、observerのfallbackタイマーを置く。クローラは見えるがユーザーに見えない状態は最悪。
- 無限マーキーに animation-play-state での停止手段が0件。15〜75秒のループに実績社名などの文字情報を載せると読み終わる前に流れる。WCAG 2.2.2。:hover と :focus-within で paused にするのを足す。
- WIT STUDIOの delay ユーティリティ100個をそのまま真似すると、ベンダープレフィクス4重書きと掛け算でCSSが285KBまで膨れる。発想(delay = .2s + N×.05s)だけ採って、CSS変数1本 --d:7 + calc(var(--stagger-base) + var(--d) * var(--stagger)) に置き換える。
- 見出しワイプが width:100%→0 のアニメーション。width はGPU合成されないので要素数が多いと落ちる。transform:scaleX(1)→(0) + transform-origin:right に置き換えれば見た目は同じで軽い。ただし色ブロックが文字と同じ要素内の::afterなので、scaleXに変えると --wipe-bleed の上下はみ出しは height で持つままにできる(縦方向はスケールしないため問題なし)。
- `@media (any-hover:hover)` は『何かひとつでもホバー可能な入力があれば真』なので、タッチ対応ノートPCやスタイラス端末で意図せず真になる。主入力で判定する (hover:hover) が正確。全サイト0件だったのでここは真似せず改善する。
- clipPathInsetBottomToTop に will-change:transform が付いているが、実際にアニメしているのは clip-path。プロパティ名が合っていない will-change は無意味(効果ゼロでレイヤーだけ増える)。will-change を書くなら必ずアニメ対象と同じプロパティ名にする。そもそも全CSS1.3MBで22件しか使っていないので、基本は書かない方針に倣うのが正しい。
- -webkit-transform のプレフィクスを全ファイルで4重に書き出しているが2026年時点で不要(Safari 9以降不要)。真似する必要はない。browserslist を現代的な設定にすればCSS量が実質1/4になる。

### レスポンシブ

- 【最大の罠】SPブレークポイントが1024pxでキャンバスが768pxなのに上限キャップがない。1024pxのiPad横では全数値が1.333倍で表示される（本文26px指定が34.7pxになる）。そして7サイト中5サイトが769〜1023pxの間にメディアクエリを1本も持たないので、この帯は誰も検証していない。真似するなら html{font-size:min(1.3020833333vw, 10px)} か --vw-scale:min(calc(100vw / 768), 1px) を必ず入れる。
- SP側の数値は「768pxキャンバスのpx」なので、画面で見える実寸はその0.488倍（375px端末）。CSSに書いた26pxは12.7pxで表示される。この換算を忘れると全部のサイズが2倍狂う。逆算式：欲しい実寸px × 2.048 = CSSに書く数値。
- ページ全体の min-width 下限が7サイト中6サイトでゼロ。320px端末では全数値が0.417倍になり、PC12px相当のラベルは実寸8.3pxになる。CSSに書く最小font-sizeは768キャンバスで28px（=実寸13.7px@375 / 11.7px@320）を下限にすること。
- ENILISとステイハングリーの html{font-size:.5208333333vw} には下限がない。1280pxのノートPCでは1rem=6.67pxになり、16px想定の本文が10.7pxで表示される。デザインカンプ（1920px）だけ見て承認すると実機で文字が小さすぎる事故になる。検証は必ず1280px・1440px・1024px・768px・375pxの5点で行う。
- @media print,screen and (max-width:1024px) は印刷時にモバイルレイアウトを適用する。しかも min-width:1025px 側も印刷にマッチするのでソース順次第の不定動作。会社概要・採用要項・料金表を印刷する業種では必ず @media screen and (...) に直して @media print を別に書く。
- vwベースの設計で body に overflow-x:hidden を入れていないサイトが4つ。100vw や 96.09375vw を使うとWindowsのスクロールバー分（約15px）だけ横にはみ出す。body{overflow-x:hidden} は必須。
- clamp(10px, 90%, 1200px) の 10px はダミー下限。親要素が flex や grid の子だと % が期待通りに効かないことがあるので、使う場所は block レベルの要素に限る。
- grid の 1列化で gap:0 にするパターンは、アイテム側に border-top と border-bottom が先に入っていることが前提。borderがないと要素がベタッと繋がって読めなくなる。
- 1200px台の中間ブレークポイントで係数掛け算（×0.6666）した小数pxを書くのは絶対にやらない。カミナリは71ルールで font-size:7.99992px のような和文8px級を本番に出している。中間帯の縮小は root の vw スケール1本で処理する。
- .u-display__inline-block--pc が display:inline-flex を当てている（WIT STUDIO）、.st-Footer_Menu が grid-template-columns を2回宣言している（エニーキャリア）など、ユーティリティと中間帯のコードには死んだ宣言が混ざっている。コピペする前に1宣言ずつ確認すること。
- user-scalable=no（イロコト・カミナリのSP）はWCAG 1.4.4違反。たけい事務所のように40代以上の読者が多いサイトでは絶対に入れない。
- autoprefixerの設定が10年前のまま。display:-webkit-box（2009年版flexbox）が1ファイル20〜43回、-ms-grid-* がイロコト32回。CSSが1.3MBある原因の一部。targets は > 0.5%, last 2 versions, not dead 程度に。

### アクセシビリティと堅牢性

- SPカンプの幅を確認せずに rem を書くと即死する。1.3020833333vw は768pxで1rem=10pxになる設計なので、375pxの実機では1rem=4.88px。『SPは375px』と思って font-size:1.6rem と書くと実機7.8pxになる。彼らのSPカンプは768px（またはJPで一般的な750px）幅前提
- html{font-size:62.5%} はユーザーのブラウザ文字サイズ設定を尊重するが、html{font-size:1.3020833333vw} は完全に無視する。この2つを『同じ設計の2段』として扱うと、デスクトップだけアクセシブルでSPだけ非アクセシブルという非対称が生まれる。7サイト全部がこの状態
- デスクトップのrootをvwにするなら必ず下限を入れる。ステイハングリー/ENILIS は html{font-size:.5208333333vw} をメディアクエリの外に素で置いていて下限がなく、1366pxのノートPCで本文1.6remが11.38px、1280pxで10.67pxになる。WIT STUDIOの max() と1360px再ペグだけが正解
- リセットCSSの button,input,optgroup,select,textarea{...outline:0...} をそのままコピーすると、問い合わせフォームのフォーカス表示が全滅する。コピーするなら outline:0 を削るか、直後に :focus-visible ブロックを足す
- input / select / textarea の font-size は rem でも vw でも必ず16px未満になる。彼らは desktop 1.5rem（1920pxで15px）、SP 2.4rem（375pxで11.7px）、NOKIDは素で16pxなのにSPで14pxに落としている。ここだけは px 固定
- pointer-events:none はキーボードのフォーカスと Enter を止めない。WIT STUDIOは href="" のリンク12本をこれで無効化しているが、Tabで到達してEnterで現在ページがリロードされる
- ラベルを CSS の content:"Menu" で入れると、スクリーンリーダーに読み上げ名が渡らない。6サイトのハンバーガーが div + content で、カミナリゲームスの <button> だけが正しい
- ビルド後のCSSを grep せずに出荷すると未解決のSassが混ざる。エニーキャリアは _vwSP() が11箇所残って iframe の高さ指定が消え、WIT STUDIOは --text-color:$green のまま var(--text-color) を7箇所で参照している。grep -E ':\s*\$[a-zA-Z]' と grep -E ':\s*_?vw[A-Z]{2}\(' の2本を納品前チェックに入れる
- vwで組んでもタップ領域は守られない。エニーキャリアの前後記事リンクは height:3.3854166667vw で375pxで12.7px。SPカンプで88px未満の押せる要素があったら実機で44px未満だと即判定する
- opacity を2回書くと後勝ちで初期値が0になる。エニーキャリアの .sw-Ttl .en は opacity:.2 の後に opacity:0 があり、JSが .is-animated を付けないと英語ラベルが永久に見えない
- alt="" は『装飾である』という明示宣言。制作実績が主コンテンツなのにステイハングリー45/45枚、ENILIS 27/27枚が alt="" で、読み上げもSEOも効いていない
- カミナリゲームス（4224行）とNOKID（4083行）はミニファイされずに出荷されている。彼らの納品物はクオリティが一定ではないので、どのサイトを参照するかで結論が変わる

---

## 3. 作法の一覧（実測の根拠つき）

270件の作法を、採取元のCSS宣言つきで別ファイルにまとめてある。
「この数値の根拠は？」と聞かれたときに引く用。通読するものではない。

→ [irokoto-design-system-evidence.md](./irokoto-design-system-evidence.md)

---


## 4. 次のサイトで使うトークン案

各観点のエージェントが提案した値。そのまま使うのではなく、
**そのサイトの制約（読者層・本文サイズの下限・素材の量）と突き合わせてから**採用すること。

### タイポグラフィ

| トークン | 値 | 備考 |
|---|---|---|
| `--root-font-size` | `62.5% / 1.3020833333vw (≤1024px) / .5208333333vw (≥1921px)` | html に当てる3段。1rem=10px を全幅で維持する。3段とも実採取値。@media print,screen and (max-width:1024px){html{font-size:1.3020833333vw} |
| `--fs-caption` | `1.2rem` | 12px。日付・copyright・注釈。line-height は 140%。出現29回 |
| `--fs-small` | `1.4rem` | 14px。英語サブラベル・タグ。出現24回 |
| `--fs-body` | `1.6rem` | 16px。本文の基準。全サイト最頻値（54回）。font-weight:500 とセット |
| `--fs-body-lg` | `1.8rem` | 18px。リード文・ナビ。出現28回 |
| `--fs-h4` | `2.4rem` | 24px。カード見出し。出現32回（2番目に多い） |
| `--fs-h3` | `2.6rem` | 26px。出現27回。モバイル本文の設計値でもある（3.3854166667vw = 26/768） |
| `--fs-h2` | `3.0rem` | 30px。セクション見出しの和文。.sw-Ttl .ja{font-size:3rem;font-weight:700;line-height:1} |
| `--fs-h1` | `4.2rem` | 42px。ページタイトル。出現7回 |
| `--fs-display` | `10.8rem` | 108px。和文キャッチの最大。font-weight:900 / line-height:130% / letter-spacing:.08em とセット |
| `--fs-deco` | `12rem` | 120px。背景に置く欧文ゴースト専用。opacity:.2 とセット。文字としては読ませない |
| `--lh-flat` | `1` | 単行の欧文ラベル・数字のみ。和文には使わない |
| `--lh-display` | `1.3` | 60〜108px の和文。120〜140%の帯。1.0 には落とさない |
| `--lh-heading` | `1.4` | 30〜42px の和文見出し。WIT STUDIO の最頻値（line-height:1.4 が23回） |
| `--lh-body` | `1.8` | 18〜26px の本文。180〜200% |
| `--lh-body-loose` | `2.4` | 16px のリード文・導入文。.sw-Txt{font-size:1.6rem;line-height:2.4}。モバイルでは 2.2 に狭める |
| `--ls-base` | `.06em` | 全体の基準。body に1行書いて継承させる。全サイト合計100回で最頻 |
| `--ls-loose` | `.08em` | リード文・導入文。61回で2位 |
| `--ls-tight` | `.04em` | 欧文ラベル・ナビ。33回 |
| `--ls-label` | `.2em` | ボタンラベル・和文の黒タグ。最大値。2回しかないが両方ボタン/タグ |
| `--fw-body` | `500` | 本文。400ではなく500。Google Fonts も wght@500;700 だけ読む |
| `--fw-bold` | `700` | 見出し・ラベル。全体298回で最頻 |
| `--opacity-en` | `.2` | 見出しの英語サブラベルと背景の装飾欧文。.sw-Ttl .en{opacity:.2} / .heading-Bg{opacity:.2} |
| `--gap-p` | `1em` | 段落間。p + p で当てる。px ではなく em |
| `--gap-heading` | `2.5em` | 段落→見出し。p + h2 で当てる。段落間の2.5倍 |
| `--hairline` | `max(.2083333333vw, 1px)` | 引用線・下線・縦罫。vwで縮んでも1px未満にならない。border-left:max(.2083333333vw,1px) solid #181818 |
| `--vw-scale` | `max(calc(100vw / 1920), 1px)` | WIT STUDIO方式。font-size:calc(18 * var(--vw-scale)) と書けばFigmaのpxをそのまま使える。1025〜1360pxは calc(100vw / 1360)、≤1024pxは calc(100vw / 768) に差し替え |

### カラー

| トークン | 値 | 備考 |
|---|---|---|
| `--ink` | `#202020` | 本文色。同時にフッターの背景色にもなる。純黒は使わず #0f0f0f〜#595656 の範囲で選ぶ。やわらかいブランドなら #595656 まで明るくしてよい（イロコト実例）。body に必ず color として書く（NOKID/カミナリがこれを忘れて純黒が混ざっている）。 |
| `--ink-weak` | `rgba(32,32,32,.5)` | 補助テキスト。--ink と同じhexの alpha .5。暗背景上では rgba(255,255,255,.5) に切り替える（エニーキャリア・ステイハングリーのフッターのコピーライトがこれ）。別のグレーhexを作らない。 |
| `--line` | `rgba(32,32,32,.1)` | 罫線。--ink の alpha .1。これ1本で全部の仕切り線を通す。不透明グレー（#dedede / #C4C4C4 / #eee）でもよいが、サイト内で1値に絞ること。 |
| `--shadow` | `rgba(32,32,32,.1)` | 影。純黒 rgba(0,0,0,x) を絶対に使わない。--ink と同じ三原色で alpha .1。強調したいときだけ .15〜.2 に上げる。WIT STUDIO は rgba(20,22,20,.1) を影として20回使い、他の影色を持っていない。 |
| `--accent` | `#35b1c1` | アクセント1色。明度を先に決める。明るい色（#f09ba5 / #f8871e / #3cab8f）を選んだら文字色に使う計画を捨てて、background と border 専用にする。暗めの色（#1a7e3a / #35b1c1）なら文字色にも使える。 |
| `--accent-ink` | `#2a8b98` | アクセントを文字として使うための暗い方の同系色。イロコトの #f09ba5（面）と #ee7785（文字）の関係。--accent を白背景に文字で置くとコントラストが足りないときはこちらを使う。--accent より明度を15〜20%下げる。 |
| `--accent-10` | `rgba(53,177,193,.1)` | アクセントのごく薄い面。カードの選択状態や注釈ブロックの背景。alphaで作るので地色が変わっても馴染む。 |
| `--accent-30` | `rgba(53,177,193,.3)` | アクセントの薄い枠線と、蛍光ペン風ハイライト。エニーキャリアは border:1px solid rgba(53,177,193,.3) でページネーションのホバー枠に、イロコトは linear-gradient(transparent 70%, rgba(240,155,165,.3) 70%) で見出しのマーカーに … |
| `--surface` | `#fff` | カードの面。地色と必ず差をつける。地色を #fff にするならカードには影か罫線が必須になる。 |
| `--bg` | `#f7f7f7` | ページの地色。#fff にしないことでカードの #fff が立つ。NOKID は #F2F2F2、ENILIS は #fafafa。カードを使わないデザインなら #fff でよい。 |
| `--tint` | `#f2f9fa` | セクションの薄色背景。ニュートラルグレーではなく --accent の色相を彩度1〜4%だけ入れる。WIT STUDIO #f4fdf2（緑）、NOKID #ECF7F4（緑）、ステイハングリー #f4e9cb（金）が実例。 |
| `--alpha-step` | `.1 / .15 / .2 / .3 / .5` | alphaはこの5値だけ。実測で全CSSのalphaの約90%がこの5値に入る（.1が51回、.5が47回）。.1=罫線と影、.15〜.2=強い影、.3=アクセントの薄面と薄枠、.5=暗背景上の補助テキスト。中間値を作ると統一感が崩れる。 |
| `--hover-fill` | `var(--ink)` | ホバーの塗り色。アクセント色をホバーに使わず、インク色への反転で済ませる（ENILIS の .sw-CircleBtn:hover が background-color:#181818）。アクセントを出す箇所を減らすほど1箇所が効く。 |

### 幅・グリッド・余白

| トークン | 値 | 備考 |
|---|---|---|
| `--vw-base` | `1920` | デザインキャンバス幅。1920px版のカンプを基準にする。モバイルのメディアクエリ内で 768 に差し替える。WIT STUDIOの実装そのまま。 |
| `--u` | `calc(100vw / var(--vw-base))` | 1設計px＝1単位のスケール。幅・余白は全部 calc(180 * var(--u)) のように「カンプのpx × --u」で書く。WIT STUDIOの --vw-scale と同じだが max(...,1px) の下限は付けない（1361〜1920pxで固まるバグを避ける）。 |
| `--w-wide` | `calc(1560 * var(--u))` | ワイドコンテナ。カード一覧・大見出しブロック用。7サイトの実測レンジは1500〜1620pxで、WIT STUDIOとステイハングリーが1560px。max-width で当てる。 |
| `--w-base` | `calc(1200 * var(--u))` | 標準コンテナ。6/7サイトが1200pxを使う最頻値。本文セクションの既定。 |
| `--w-narrow` | `calc(960 * var(--u))` | ナローコンテナ。記事本文・モーダル・テキスト主体のブロック。7サイト全部に出現。 |
| `--w-sp` | `calc(708 * var(--u))` | モバイルコンテナ（--vw-base:768 のとき708px＝左右30px）。ステイハングリー・ENILIS・カミナリゲームス・WIT STUDIOの4サイトが同値。 |
| `--gutter` | `calc(60 * var(--u))` | デスクトップ左右ガター。案件ごとに20〜180pxでバラけるので「1値に決めて例外を作らない」のが本質。WIT STUDIOの60pxを初期値に。 |
| `--gutter-sp` | `calc(30 * var(--u))` | モバイル左右ガター。4サイトが30pxで収束している数少ない定数。 |
| `--sp-1` | `calc(10 * var(--u))` | スペーシング最小単位。1rem=10px設計なので8ではなく10刻み。 |
| `--sp-2` | `calc(20 * var(--u))` | gap実測で最頻（27回）。グリッドの既定gap。 |
| `--sp-3` | `calc(30 * var(--u))` | カードグリッドの列gap。3列・4列カードはこれ（実測30px/32px）。 |
| `--sp-4` | `calc(40 * var(--u))` | gap実測2位（20回）。ブロック内要素の標準間隔。 |
| `--sp-6` | `calc(60 * var(--u))` | 小セクション間。 |
| `--sp-8` | `calc(80 * var(--u))` | 見出しと本文の間など、中サイズの区切り。 |
| `--sp-section` | `calc(100 * var(--u))` | セクション上下paddingの既定。デスクトップ21回・モバイル18回で全体1位。迷ったらこれ。 |
| `--gap-card` | `calc(70 * var(--u)) calc(30 * var(--u))` | カード一覧のgap（行70px／列30px）。NOKIDとWIT STUDIOが独立に同じ比率。行は列の約2.3倍にする。 |
| `--bp` | `1024px` | 主ブレークポイント。5/7サイトがこれ（max-width:1024px / min-width:1025px）。タブレット専用の中間段は作らず、グリッドは全部1列に落とす。 |

### カード・部品

| トークン | 値 | 備考 |
|---|---|---|
| `--shadow-card` | `0 0 20px rgba(20,22,20,.1)` | 全サイト最頻の影（WIT STUDIOで20回）。1層・オフセット0・ぼかしのみ。影色は純黒ではなくわずかに緑寄りの黒。カードはこれ1個で足りる |
| `--shadow-card-wide` | `0 0 30px rgba(20,22,20,.06)` | ぼかしを広げるときは必ずalphaを下げる。.1→.06。--shadow-cardとこれの2値だけ持つ |
| `--shadow-card-drop` | `14px 14px 30px rgba(73,57,17,.15)` | ステイハングリー型。方向を持たせる場合。影色をグレーにせずブランドの茶/金寄りにするのが要点。ホバー時はalphaだけ.3へ（ぼかしは変えない） |
| `--radius-card` | `20px` | カード外側。エニーキャリア系なら6px。サイト内で1値に固定する |
| `--radius-inner` | `10px` | カード内の画像/サムネ。常に--radius-cardの半分 |
| `--radius-pill` | `100px` | ボタン。999pxではなく100pxで足りている |
| `--ring-idle` | `rgba(26,126,58,0)` | ホバーで出す枠の通常色。背景と同色ではなくブランド色のalpha 0。これをborder-colorで遷移させる |
| `--ring-hover` | `rgba(26,126,58,.4)` | ホバー後の枠色。不透明にしない。alpha .4止まりで枠が主役に出ない |
| `--ring-width` | `2px` | オーバーレイ枠の太さ。小さい部品（タグ・ロール表示）は1px |
| `--dur-hover` | `.4s` | 枠色・画像拡大の遷移。イロコト世代は.2s、ENILIS .3s、最新のWIT STUDIO/ステイハングリーは.4s。新しいほど遅い |
| `--dur-ui` | `.3s` | 影の変化・カバーのスライドなど形が動くもの |
| `--scale-img` | `1.05` | 画像ホバー拡大の控えめ版。はっきり見せたいときだけ1.1。中間値は作らない |
| `--scale-shrink` | `.85` | 矢印ボタンの丸を縮める値。中のアイコンには逆数の1.175を当てて打ち消す |
| `--scale-counter` | `1.175` | --scale-shrinkの逆数。0.85×1.175≒1で、アイコンの見た目サイズが据え置きになる |
| `--hover-opacity` | `.6` | ロゴ・ナビ・補助リンクのホバー既定。全サイト最頻（17件）。凝った演出は主要導線だけにして、残りは全部これ |
| `--rule-color` | `#C4C4C4` | 定義リストの区切り罫。1px solid。dlにborder-topのみ、最終行にborder-bottom |
| `--chip-bg` | `#0f0f0f` | タグ/チップの背景。薄いグレーのピルではなく角のある黒い小箱。文字は#fff 13px、padding 6px均一、border-radiusなし |
| `--chip-gutter` | `10px` | チップ間隔。親に margin:0 0 -10px -10px、子に margin:0 0 10px 10px。親はpointer-events:none、aはpointer-events:all |
| `--panel-tint` | `#fafff8` | カード内の注記パネル背景。ブランド色をほぼ白まで薄めた色。グレーを使わない。文字はブランド色そのまま |
| `--bleed` | `1px` | 角に貼る装飾のはみ出し量。top/left/rightを-1pxにして継ぎ目の白線を潰す。デザインデータと1pxズレても直さない |
| `--bar-width` | `max(0.2083333333vw, 1px)` | 縦装飾バーの太さ（1920pxで4px）。vwで細線を引くときはmax()で1pxの床を張る。色はアクセントではなく本文色 |
| `--num-label` | `14px` | 情報としての連番のラベル部（カミナリ型）。下に幅20px高さ1pxの罫を:beforeで引く |
| `--num-digit` | `22px` | 情報としての連番の数字部。ラベルの約1.6倍。font-familyはOswald |
| `--num-deco` | `140px` | 装飾としての連番（ステイハングリー型）。color:transparent + 1pxストローク + opacity .3。カード右上 |

### ボタン・リンク・フォーム

| トークン | 値 | 備考 |
|---|---|---|
| `--btn-pad-y-top` | `20px` | 中央寄せラベルのボタン上パディング。下とペアで使う。anycareer .sw-Btn の実測 padding:20px 40px 22px より |
| `--btn-pad-y-bottom` | `22px` | 上より1〜2px多くする。和文の視覚重心補正。パディング量の約10%増が目安（20→22、6→8、2→4、5→6） |
| `--btn-pad-x` | `40px` | 左右パディング。矢印を付ける側だけ +15px する（WIT STUDIO: 65px / 80px） |
| `--btn-min-width` | `300px` | PCの横長ボタン最小幅。実測レンジは 240/280/300/302/360/380px。モバイルは 62.5vw（=480px@768） |
| `--btn-height` | `60px` | PC固定高の実測は 58/60/72/86px。line-height を同値にすると flex 不要で縦中央が取れる（イロコト方式） |
| `--btn-min-tap` | `44px` | ⚠️イロコトには存在しないトークン。vw指定の部品が375px幅で34〜43pxに縮む事故を防ぐため min-height として必ず足す |
| `--btn-radius-pill` | `9999px` | 彼らは 200px/100px/78px/70px/65px と適当な大きな値を直書きしているが、9999px で意図が明確になる |
| `--radius-card` | `6px` | house value。border-radius:6px が18件 + .78125vw（=6px@768）が15件で最頻。カード・サムネイル・ヘッダー角はすべてこれ |
| `--radius-input` | `3px` | 入力欄の角丸。nokid.form.css の border-radius:3px。ボタン(6px)より小さくして部品の格を分ける |
| `--icon-circle-size` | `40px` | 円形アイコンボタンのPC径。ENILIS/ステイハングリーで一致（4.1666666667vw=40px@1920）。モバイルは 13.0208333333vw=100px@768 / 48.8px@375 |
| `--icon-circle-border` | `1px solid currentColor` | 円の枠は1px。ホバーで背景を currentColor に塗り、中の矢印を反転させる |
| `--icon-arrow-w` | `30%` | 円の中の矢印幅を%で指定すると、円のサイズを変えても追従する。高さは10%（SVG viewBox 24x8 の3:1と一致） |
| `--hover-dim` | `0.6` | ホバー減光の最頻値。全件集計で .6 が17件、.7 が7件、.8 が4件。一般的な .8 より深く落とす |
| `--hover-scale-btn` | `1.03` | ボタン本体の拡大上限。横長ボタンを1.05にすると幅が隣とぶつかる |
| `--hover-scale-img` | `1.05` | 画像・カードの拡大。1.05が10件、1.1が10件。ボタンとは別の値を持つ |
| `--hover-squeeze` | `0.85` | WIT STUDIO方式。台座を縮める倍率。中のアイコンには逆数 1.175 をかけて見た目のサイズを保つ |
| `--hover-squeeze-inv` | `1.175` | --hover-squeeze の逆数（1/0.85）。アイコン側に適用。左右反転時は scale(-1.175, 1.175) と符号を書き直す |
| `--arrow-shift` | `6px` | 矢印のホバー移動量。実測 3px(斜め外部リンク) / 6px(イロコト) / 10px(カミナリ)。10pxが上限 |
| `--dur-hover` | `.3s` | ホバー基本。ボタン系は .3s/.4s に集中。サイト全体の最頻は .6s だがそれはスクロール演出用 |
| `--dur-hover-slow` | `.4s` | グラデーション移動・transform系。WIT STUDIO の c-btn は全部 .4s |
| `--ease-pass` | `cubic-bezier(.75,.25,.25,.75)` | 中央が速い対称カーブ。矢印の通り抜けアニメ（moveArw）用。全30件 |
| `--ease-out-soft` | `cubic-bezier(.22,1,.36,1)` | easeOutQuint相当。要素の出現・見出しの立ち上がりに62件 |
| `--ease-overshoot` | `cubic-bezier(.31,2.8,.5,1.2)` | y1=2.8 で大きく跳ねる。全体最頻の240件だが使い所はアクセント専用。ボタンには使われていない |
| `--input-height` | `48px` | ENILIS実測（font-size 15px × line-height 240% + padding 6px×2 = 48px）。44px下限をクリアする設計値 |
| `--input-pad` | `12px 16px` | ⚠️ nokid の padding:5px 20px（算出高31px）は小さすぎるので置き換えた値。入力欄は上を2px多くする（12px / 10px） |
| `--input-font-size` | `16px` | モバイルでも16px未満にしない。14pxにするとiOS Safariがフォーカス時に自動ズームする（nokid.form.cssの実害） |
| `--input-border` | `1px solid #ccc` | 枠線あり方式（nokid）。枠線なしで白背景だけにする方式（ENILIS/ステイハングリー）もあるが、ページ背景が白いサイトでは使えない |
| `--input-placeholder` | `#b8b8b8` | ENILIS実測。白地でコントラスト約2.3:1なので、プレースホルダに必須情報を入れないこと |
| `--checkbox-size` | `20px` | ⚠️ ENILIS 12px / nokid 16px はどちらも小さすぎるので引き上げた値。角丸は2〜4pxの四角にする（丸はラジオの記号） |
| `--label-col-width` | `300px` | PCのラベル列固定幅。1024px以下で display:block に切り替えて縦積みにする（nokid.form.css） |
| `--form-row-gap` | `32px` | 行の margin-bottom。padding-bottom:24px + border-bottom:1px solid #aaa で区切る。:last-child で枠線を消す |
| `--badge-width` | `40px` | 必須/任意バッジの固定幅。flex-shrink:0 を付けてラベル開始位置を縦に揃える |
| `--badge-required-bg` | `#d80000` | 必須バッジ。白文字でコントラスト約5.3:1（AA合格） |
| `--badge-optional-bg` | `#b5b5b5` | 任意バッジ。無印にせず必ず出すことで、埋めるべき項目数が一目で分かる |
| `--focus-ring` | `2px solid currentColor` | ⚠️ イロコト系7サイトに存在しないトークン。リセットの outline:0 を :focus-visible で必ず打ち消す |
| `--focus-offset` | `2px` | outline-offset。枠線ありの入力欄で outline が border と重なって見えなくなるのを防ぐ |
| `--active-scale` | `0.97` | ⚠️ :active が7サイト0件という最大の穴を埋めるための値。@media (hover:hover) の外に書くこと |
| `--shadow-card` | `0 0 20px 5px #ebebeb` | anycareer実測。ホバーで 0 0 0 0 に畳んで『沈ませる』。影を足すのではなく引く |
| `--ring-white` | `0 0 0 2px #fff` | イロコト実測。ホバーで 0 0 0 2px transparent にして消す。border を使わないのでレイアウトが動かない |

### ヘッダー・ナビ・フッター

| トークン | 値 | 備考 |
|---|---|---|
| `--header-h-scrolled` | `70px` | スクロール縮小後のヘッダー高さ。実測 anycareer 72px / kaminari 64px / nokid 66px / stayhungry 74px の中央値。初期高さは自由だが、縮んだ先はここに揃える |
| `--header-shrink-scale` | `0.85` | transform:scale() でヘッダーを縮める場合の倍率。witstudio が .85。nokid は .637（ロゴだけ大きく縮める場合）。transform-origin は PCロゴ top left / 右寄せ要素 top right |
| `--dur` | `0.3s` | サイト共通のトランジション時間。1つだけ決めて全部これでやるのが7サイト共通の作法。stayhungry 81回/enilis 85回/nokid 45回が .3s。速めなら .2s、ゆったりなら .4s。使い分けはしない |
| `--ease` | `cubic-bezier(.22,1,.36,1)` | easeOutQuint。anycareer が34回使用。サイトごとに1本決める。士業・医療などでは witstudio の cubic-bezier(.31,2.8,.5,1.2)（跳ねる）は避ける |
| `--gutter-sp` | `3.90625vw` | 768px基準で30px。SP左右余白の最頻値。stayhungry 30件/enilis 27件/kaminari 20件。ロゴのleft、ドロワーのpadding左右、フッター左右に使う |
| `--gutter-sp-l` | `5.2083333333vw` | 768px基準で40px。広めのSP余白。nokidは 5.21vw として34回使用。セクション左右に使う |
| `--space-sp-s` | `2.6041666667vw` | 768px基準で20px。SPの最小余白。enilis 33件/stayhungry 24件。ハンバーガーのtop/rightなど |
| `--space-sp-xl` | `10.4166666667vw` | 768px基準で80px。SPのセクション間。enilis 16件。フッター上下パディングにも |
| `--header-z` | `99` | 固定ヘッダーのz-index。irokoto 100/kaminari 99/witstudio 99。10番台派（nokid 11/stayhungry 10）もあるが、ヘッダー自身をスタッキングコンテキストにして内部は1桁で足りる設計が最良 |
| `--hamburger-z` | `100` | ハンバーガーはナビパネルより必ず上。--header-z + 1。全サイト例外なし（nokid 11→12、anycareer 19→20、irokoto 300→320） |
| `--modal-z` | `7000` | モーダル/動画オーバーレイ。anycareer が 7000/7010/7020 の3段。ヘッダー系とは桁を分けて衝突を防ぐ |
| `--tap-min` | `14.3229166667vw` | 768px基準で110px。SPハンバーガーの最小サイズ。実機390px幅で約56px。stayhungry 110px/witstudio 110px/anycareer 120px/kaminari 120px。nokidの 9.9vw×3.39vw は小さすぎるので真似しない |
| `--nav-gap-pc` | `38px` | PCナビ項目間。witstudio 38px/stayhungry 34px/enilis 40px/anycareer margin-left:40px（1160px以下で32px）。30〜40pxに収束 |
| `--nav-font-pc` | `1.6rem` | PCナビの文字。16px。全サイト 16〜18px。縮小後に 1.6rem へ落とすサイト（nokid 1.8rem→1.6rem、enilis 1.8rem→1.6rem）もある |
| `--nav-font-sp` | `3.6rem` | SPドロワーの文字。36px。stayhungry と nokid が完全一致（最頻値）。2カラムにするなら 28px、1列でborder-top区切りなら 60px（enilis）まで上げられる |
| `--nav-row-gap-sp` | `11.71875vw` | 768px基準で90px。SPドロワー/フッターナビの行間。stayhungry と enilis と anycareer で一致 |
| `--marker-dot` | `5px` | カレント/ホバーの円マーカー直径。anycareer 5px/witstudio 6px/enilis 5px。下線より崩れない。色はアクセントカラー、border-radius:50% |
| `--underline-h` | `1px` | ホバー下線の太さ。witstudio calc(1 * var(--vw-scale))/enilis 1px。nokid は 2px、irokoto は 2px。transform-origin を right→left に入れ替えて scaleX する（左から入って右へ抜ける） |
| `--footer-bg` | `#181818` | フッター背景。7/7サイトが暗色。実測 #202020/#595656/#111/#181818/#0F0F0F/#282828。純黒 #000 は0件 |
| `--footer-pt` | `100px` | フッター上パディング。anycareer 100px/kaminari 100px/stayhungry 5.2083333333vw(=100px@1920)/witstudio 110px/nokid 90px。下は50〜60pxで上の約半分（非対称） |
| `--footer-pb` | `50px` | フッター下パディング。anycareer 48px/witstudio 60px/nokid 60px。上の約半分 |
| `--footer-divider` | `rgba(245,245,245,.1)` | 暗いフッター内の区切り線。border-top:1px solid。グレーの実色ではなく白の低α |
| `--footer-muted` | `rgba(255,255,255,.5)` | コピーライト/住所の文字色。font-size:1.2rem(12px)、line-height:240% と組む |
| `--footer-logo-col` | `180px` | フッターgridのロゴ列固定幅。irokoto 180px/anycareer 290px。grid-template-columns:180px 1fr、grid-template-areas で SP時の順序を入れ替える |
| `--hover-opacity` | `0.6` | ロゴ/画像リンクのホバー透明度。stayhungry/enilis/witstudio/nokid の4サイトで opacity:.6 が完全一致。.5や.7ではない |
| `--glass-blur` | `8px` | スクロール後ヘッダーのすりガラス。2サイトのみ blur(.4166666667vw)=8px@1920、背景 rgba(255,255,255,.84)。will-change:filter は付けない（stayhungryは付けているが無駄） |
| `--header-slide-hide` | `translateY(-101%)` | スクロール追従バーの隠し位置。-100% は7サイト14ファイルで0件、-101% が5件。1%余分に逃がしてサブピクセルの残り線を防ぐ |

### モーション

| トークン | 値 | 備考 |
|---|---|---|
| `--ease-reveal` | `cubic-bezier(.22,1,.36,1)` | スクロール登場・見出しワイプの標準。エニーキャリアで62件。いわゆるeaseOutQuart相当で、立ち上がりが速く終端が長く伸びる。登場系はこれ1本で足りる。 |
| `--ease-fade` | `cubic-bezier(0,.55,.45,1)` | js-fade(本文ブロックの下からの持ち上げ)専用。x1=0なので開始の加速が一切なく、クラス付与と同時に動き出す。遅延を感じさせたくない登場に使う。 |
| `--ease-swap` | `cubic-bezier(.75,.25,.25,.75)` | 50%/51%ヒンジの往復モーション(moveArw)専用の対称曲線。行きと帰りで同じ加減速になるので、矢印が抜けて入る動きが左右対称に見える。片道モーションには使わない。 |
| `--ease-drift` | `cubic-bezier(0,.8,.2,1)` | ヒーロー画像のケンバーンズ用。前半で一気に進み長い減速尾を引く。6.5s のような長尺と組んで『気配だけ動く』を作る。短い時間で使うと意味がない。 |
| `--ease-bounce` | `cubic-bezier(.31,2.8,.5,1.2)` | 約2.8倍のオーバーシュート。WIT STUDIOのフッターのロゴ/SNS/リンクのみに使用。ロゴ・アイコン・バッジ限定。文字ブロックに当てると読めなくなる。 |
| `--dur-color` | `.2s` | color / fill の変化。位置が動かないので速くてよく、遅いとモッサリする。color .2s=42件、fill .2s=16件。 |
| `--dur-ui` | `.3s` | opacity / background-color のホバー。5サイトで確認できた最も再現性の高い値。迷ったらこれ。 |
| `--dur-move` | `.4s` | transform(移動・拡大・scaleX下線)のホバー。色の倍。軌跡を目で追う必要があるため。 |
| `--dur-reveal` | `.7s` | スクロール登場のopacity。彼らは .6s〜.8s の範囲で、.7s が最頻。 |
| `--dur-reveal-move` | `.8s` | 登場のtransformだけopacityより0.1s長くする。不透明度が先に完走し、動きの終端(特にバウンス)が見えている要素の上で起きる。 |
| `--stagger` | `.05s` | スタッガーの刻み。WIT STUDIOは0.05s刻みで100段、エニーキャリアの見出し内は0.05〜0.15s。delay = .2s + N * var(--stagger) で算出する。 |
| `--stagger-base` | `.2s` | スタッガーの基準delay。N=1 から始めて .25s。スクロール検知からの最初の反応までの余白。 |
| `--stagger-block` | `.2s` | ブロック単位(カード群・セクション間)の粗い刻み。js-fade-delay=.2s / js-fade-delay2=.4s の2段しか用意していない。パーツ内は.05s、ブロック間は.2sと階層を分ける。 |
| `--rise` | `2rem` | 登場時の持ち上げ量。PC 20px。1rem=10px設計なので2rem。 |
| `--rise-sp` | `3rem` | タブレット/SP(max-width:1024px)の持ち上げ量。3.90625vw=768px時30px=3rem。PCより1.5倍大きい。小画面ほど控えるという一般論の逆。 |
| `--slide-ttl` | `-2rem` | 見出しのtranslateX。見出しは横(-20px)、本文は縦(20px)で方向を役割分担する。量は同じ。 |
| `--zoom-hover` | `1.05` | サムネイル画像のホバーズーム。親にoverflow:hidden必須。1.1が上限、1.2以上は7サイトで0件。 |
| `--shrink-hover` | `.85` | 丸ボタン等のホバー縮小。中のアイコンに1.175(=1/.85)を当てて実寸を打ち消すのがセット。 |
| `--counter-shrink` | `1.175` | --shrink-hover の逆数。親.85 × 子1.175 = 0.99875 ≒ 1。円だけ縮んでアイコンは動かない。 |
| `--marquee-dur` | `30s` | マーキーの標準速度。15sが速め、60〜75sが背景用。keyframesはtranslateX(0)→(-50%)固定で、中身を2セット複製する前提。速度調整はdurationだけ触る。 |
| `--wipe-bleed` | `5px` | 見出しワイプの色ブロックを文字boxの上下にはみ出させる量。height:calc(100% + var(--wipe-bleed)*2); top:calc(var(--wipe-bleed)*-1)。日本語グリフが行boxを超えるため必須。font-size:3rem での実測値なので見出しを大きくするなら比例で増 … |
| `--motion-kill` | `none` | リサイズ/ロード中の全停止用。.is-resizing *, .is-resizing *::before, .is-resizing *::after { transition: var(--motion-kill) !important; transition-delay: unset !important } で … |

### レスポンシブ

| トークン | 値 | 備考 |
|---|---|---|
| `--vw-base` | `1920 (PC) / 768 (≤1024px)` | デザインキャンバス幅。@media (max-width:1024px) で 768 に差し替える。WIT STUDIO方式。 |
| `--vw-scale` | `max(calc(100vw / var(--vw-base)), 1px)` | これ1本で全スケールを制御。1920px超で拡大、1361〜1920pxは1px固定（=Figma値そのまま）。SP側は min(calc(100vw / 768), 1px) にキャップを追加すること（原典にはキャップがなく1024pxで1.33倍に膨らむ）。font-size:calc(16 * var(--vw- … |
| `--bp-layout` | `1024px / 1025px` | レイアウトを担う唯一のブレークポイント。@media screen and (max-width:1024px) と @media screen and (min-width:1025px) の2本だけでサイト全体を組む。print は併記せず別に @media print を書く。 |
| `--bp-nav` | `1200px / 1199px` | ナビをハンバーガー化する幅。レイアウトのブレークポイントとは別軸で持つ（イロコト方式）。ロゴ幅＋項目数で決まるので1024pxより早く限界が来る。 |
| `--container-pc` | `clamp(10px, 90%, 1200px)` | PC本文コンテナ。max-width+paddingの代わりに1行で。ワイドなセクションは1560px、ナロー（ミッション/メッセージ）は clamp(10px, 86%, 640px)。 |
| `--container-sp` | `86.9791666667vw` | SP本文コンテナ（=668px@768、左右6.51%＝実寸24.4px@375）。広めは 92.1875vw（左右15px@375）、KVほぼ全幅は 96.09375vw、ドロワーは 82.8125vw。 |
| `--gutter-pc` | `5.2083333333vw` | PCの左右ガター（=100px@1920）。コンテナ幅を使わない全幅セクションに padding:0 var(--gutter-pc)。 |
| `--gutter-sp` | `3.90625vw` | SPの左右ガター（=30px@768＝実寸14.6px@375）。全CSS横断で最頻出のvw値（115回）。PCの0.15倍まで潰すのが彼らの作法。 |
| `--tap` | `13.0208333333vw` | SPの主要ボタン・円形ボタンの高さ（=100px@768＝実寸48.8px@375）。3サイト・60回出現する事実上の標準。320px端末を気にするなら max(13.0208333333vw, 44px)。 |
| `--space-sp-xs` | `1.0416666667vw` | =8px@768（実寸3.9px@375）。SP余白スケールの最小。以降 1.3020833333vw=10px / 1.5625vw=12px / 1.8229166667vw=14px / 2.0833333333vw=16px と2px刻み。 |
| `--space-sp-s` | `2.6041666667vw` | =20px@768（実寸9.8px@375）。2番目に多用されるvw値（111回）。以降 2.8645833333vw=22px / 3.125vw=24px / 3.3854166667vw=26px / 3.6458333333vw=28px / 4.1666666667vw=32px。 |
| `--space-sp-m` | `5.2083333333vw` | =40px@768（実寸19.5px@375）。3番目に多用（103回）。以降10px刻みで 6.5104166667vw=50px / 7.8125vw=60px / 9.1145833333vw=70px / 10.4166666667vw=80px / 11.71875vw=90px。 |
| `--space-sp-section` | `13.0208333333vw 〜 15.625vw` | =100〜120px@768（実寸48.8〜58.6px@375）。PCで200〜260pxのセクション間余白に対応（実測比率0.4）。14.3229166667vw=110px も頻出。 |
| `--hairline` | `max(.2083333333vw, 1px)` | 可変キャンバス設計のヘアライン。1920pxで4px、小さい画面でも1px以下にならない。太い罫線は max(.5208333333vw, 1px)（=10px@1920）。ENILISがmax()を使う唯一の用途。 |
| `--hero-h` | `height:100vh; max-height:55.2083333333vw; min-height:37.2395833333vw` | PCヒーロー。100vhをvwで挟んでアスペクトを縛る（=max1060px / min715px @1920）。SPは height:calc(var(--vh) * 1px); max-height:174.21875vw; min-height:131.7708333333vw。 |
| `--overlay-h` | `height:100vh; height:100dvh` | 全画面オーバーレイ／ドロワーの高さ。2行併記でdvh非対応ブラウザにフォールバック。iOSアドレスバー対策の最小コスト版。 |
| `--lh-body` | `2.4 (PC) / 2.2 (SP)` | 和文本文の行送り。SPで詰める（セオリー逆）。見出しは1.7→1.6、リードは240%→200%。逆に大見出し（42px級）だけ140%→170%に緩める。 |
| `@media (hover)` | `@media (any-hover:hover) and (min-width:1025px)` | ホバーの2重ガード。7サイト全部がホバーをメディアクエリで囲っている。素の :hover は使わない。原典の print 併記は不要。 |

### アクセシビリティと堅牢性

| トークン | 値 | 備考 |
|---|---|---|
| `--vw-base` | `1920` | デザインカンプの横幅。WIT STUDIO方式。SPでは @media (max-width:1024px) 内で 768（または渡されたSPカンプの実幅）に差し替える。これだけでカンプの数値をそのままCSSに書ける |
| `--vw-scale` | `max(calc(100vw / var(--vw-base)), 0.78px)` | WIT STUDIOの max(..., 1px) の改良版。1px床だと1920px以下で完全に縮まなくなり横スクロールのリスクがあるので、0.78px（= 1500px相当）を床にして最大22%だけ縮ませる。使い方は font-size:calc(26 * var(--vw-scale)) でカンプの26pxをその … |
| `--vw-scale-sp` | `calc(100vw / 768)` | @media (max-width:1024px) で --vw-scale をこれに差し替える。375px幅で 0.488 倍になるので、SPカンプで32px未満の文字と88px未満の押せる要素は実機で破綻すると判断できる |
| `--fz-form` | `16px` | input / select / textarea の font-size だけに使う。rem も vw も使わない。イロコト系7サイトはここを全部16px未満にしていてiOSが必ず自動ズームする。全breakpointで固定 |
| `--tap-min` | `44px` | 押せる要素に min-width / min-height で当てる。vwで書いた要素にも併記する（min-height:max(44px, calc(60 * var(--vw-scale))) の形）。イロコト33px、エニーキャリア12.7pxという実測の反省 |
| `--focus-ring` | `2px solid #1a1a1a` | 7サイトに1行も存在しなかったもの。:focus-visible { outline: var(--focus-ring); outline-offset: var(--focus-offset); } を1ブロック置くだけで、彼らの最大の弱点を回避できる。リセットの outline:0 はそのまま残してよい（:foc … |
| `--focus-offset` | `2px` | outline-offset。背景と同色の枠線をホバーで色付けする彼らの流儀（別観点の発見）と組み合わせると、枠線とフォーカスリングが重なって見分けられなくなるので、offsetで必ず離す |
| `--text-muted` | `#6b6e71` | 日付・英語サブラベル・補足テキスト用。彼らの #a1a4a7（白背景で約2.5:1）の置き換え。#6b6e71 は約5.1:1でAA合格。薄グレーの雰囲気はほぼ変わらない |
| `--text-placeholder` | `#757575` | ::placeholder 用。彼らの #b8b8b8（約2.0:1）の置き換え。#757575 は約4.6:1でAA合格。これより薄くするとプレースホルダがラベル代わりに機能しない |
| `--en-label-color` | `#c9ccce` | 見出しの英語ラベルを薄く見せる用。彼らの opacity:.2 の置き換え。opacity は子要素も半透明にしてしまい、さらにJSアニメの初期値0と二重宣言で事故る（エニーキャリアの実例）。色で薄くすれば静的に成立する |
| `--motion-duration` | `.5s` | @media (prefers-reduced-motion: reduce) { :root { --motion-duration: .01ms } } を必ずセットで書く。7サイト・1.3MBで prefers-reduced-motion はゼロ件だった。transition 宣言すべてでこのトークンを参照すれ … |
| `--lh-body` | `1.75` | html{line-height:1} を置く彼らの流儀は、指定漏れの瞬間に日本語が重なる。ベースは本文想定の値にして、詰めたい見出しだけ line-height:1 に落とす |
