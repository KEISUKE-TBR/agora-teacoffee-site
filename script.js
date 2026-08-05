// Deter casual image saving (right-click / drag). Not foolproof — a
// determined visitor can still grab an image via devtools or a screenshot —
// but this stops the common "right click > save image" / drag-out paths.
document.addEventListener("contextmenu", (e) => {
  if (e.target.tagName === "IMG") e.preventDefault();
});
document.addEventListener("dragstart", (e) => {
  if (e.target.tagName === "IMG") e.preventDefault();
});

// Scroll reveal
document.querySelectorAll(".reveal[data-delay]").forEach((el) => {
  el.style.setProperty("--delay", el.dataset.delay);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Header background on scroll (skipped when the header is pinned solid, e.g. subpages)
const header = document.querySelector(".header");
if (header && !header.classList.contains("header--solid")) {
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
toggle.addEventListener("click", () => {
  const open = header.classList.toggle("nav-open");
  toggle.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

// ============ Drink detail modal ============
// 出典: A.G.O.R.A. Promotion / Staff Training Guide（2026 Edition）の商品ページより。
// taste は 3 段階（1〜3）。銘柄が日替わりで固定できないものは taste を持たない。
const DRINKS = {
  "sunset": { cat: "SEASONAL ／ 期間限定", flavor: "sunset", name: "サンセットティーソーダ", sub: "with アップルマンゴーソルベ", price: "¥800", img: "drink-sunset.png",
    desc: "グラスの底に沈んだ深い紅から、アールグレイの琥珀色へ。夕焼けがそのまま一杯になったようなグラデーションです。完熟アップルマンゴーのソルベがゆっくり溶けだすと、ベルガモットの香りに南国の甘さが重なって、飲み進めるほど表情が変わっていきます。",
    caffeine: true, taste: { sweet: 2, refresh: 1, aroma: 3 },
    ingredients: ["アールグレイ紅茶", "完熟アップルマンゴーソルベ", "オレンジ", "グレナデン", "ドライフルーツ（オレンジピール・マンゴー・パパイヤ・りんご・クランベリー・ハイビスカス）"],
    note: "ドライフルーツのトッピングに保存料（亜硫酸塩）を使用しています" },
  "herbal": { cat: "SEASONAL ／ 期間限定", flavor: "herbal", name: "ハーバルティーソーダ", sub: "with ハニーレモンソルベ", price: "¥800", img: "drink-herbal.png",
    desc: "きりっと冷えた瀬戸内レモンのスカッシュに、ふわりと浮かぶはちみつレモンのソルベ。ひと口ごとにソルベが溶けて、レモンの酸味がまろやかな甘さへと変わっていきます。仕上げに香るカモミールが、真昼の暑さをすっとほどいてくれる一杯。",
    caffeine: false, taste: { sweet: 1, refresh: 3, aroma: 2 },
    ingredients: ["瀬戸内レモン", "はちみつレモンソルベ（福岡県産）", "シトラスカモミール", "ドライフルーツ（りんご・アロエベラ・クランベリー・パイナップル・パパイヤ・ハイビスカス）"],
    note: "ドライフルーツのトッピングに保存料（亜硫酸塩）を使用しています" },
  "earlgrey-peach": { cat: "TEA SODA", flavor: "rose", name: "アールグレイ ピーチ ソーダ", sub: "", price: "¥700", img: "",
    desc: "ひと口飲むと、ベルガモットの華やかな香りのあとから、白桃のやわらかな甘みがふわっと広がります。炭酸のはじけ方もちょうどよく、香りと甘さのバランスが心地いい。迷ったらまずこれを。",
    caffeine: true, taste: { sweet: 3, refresh: 2, aroma: 2 },
    ingredients: ["アールグレイ紅茶", "ホワイトピーチ", "炭酸"] },
  "earlgrey-orange": { cat: "TEA SODA", flavor: "rose", name: "アールグレイ オレンジ ソーダ", sub: "", price: "¥700", img: "",
    desc: "アールグレイの気品ある香りに、オレンジのみずみずしい甘酸っぱさ。ベルガモットと柑橘が二重に立ちのぼって、鼻に抜けていく余韻まで気持ちいい。甘さは控えめなので、食べものと一緒でもすっきり飲めます。",
    caffeine: true, taste: { sweet: 2, refresh: 2, aroma: 3 },
    ingredients: ["アールグレイ紅茶", "オレンジ", "炭酸"] },
  "straight-earlgrey": { cat: "STRAIGHT TEA", flavor: "tea-brown", name: "アールグレイ オレンジペコ ICE", sub: "", price: "¥600", img: "",
    desc: "混じりけなし、茶葉の香りだけで勝負する一杯。口に含むとベルガモットの香りがすっと鼻へ抜けて、後にはほのかな甘みだけが残ります。よく冷えたグラスで、紅茶そのもののおいしさを。",
    caffeine: true, taste: { sweet: 1, refresh: 2, aroma: 3 },
    ingredients: ["アールグレイ紅茶", "水"] },
  "chamomile": { cat: "STRAIGHT TEA", flavor: "tea-brown", name: "カモミール シトラスブレンド ICE", sub: "", price: "¥600", img: "",
    desc: "クロアチア産カモミールを主役に、ローズヒップやレモングラスをブレンド。りんごのようなやさしい甘い香りが立ちのぼって、ひと口飲むとふっと力が抜けていきます。ノンカフェインなので、遅い時間でも心配なく。",
    caffeine: false, taste: { sweet: 1, refresh: 2, aroma: 2 },
    ingredients: ["カモミール", "ハーブブレンド（ローズヒップ・レモングラス 他）"] },
  "lemon-squash": { cat: "SETOUCHI LEMON", flavor: "lemon", name: "プレミアム瀬戸内レモンスカッシュ", sub: "OFF LEMON 使用", price: "¥700", img: "",
    desc: "瀬戸内レモンをたっぷり、強めの炭酸でキリッと。ひと口目からレモンの酸味が突き抜けて、暑さでまいった体にすーっと染みわたります。甘さを抑えているぶん、ごくごくいけてしまう爽快さ。",
    caffeine: false, taste: { sweet: 1, refresh: 3, aroma: 1 },
    ingredients: ["瀬戸内レモン", "炭酸"] },
  "lemonade": { cat: "SETOUCHI LEMON", flavor: "lemon", name: "瀬戸内レモネード", sub: "OFF LEMON 使用", price: "¥700", img: "",
    desc: "瀬戸内レモンのやさしい甘みをそのままに、まろやかに仕上げました。炭酸がないぶん口当たりがやわらかく、果実そのものの風味をゆっくり味わえます。甘めが好きな方はこちらを。",
    caffeine: false, taste: { sweet: 2, refresh: 2, aroma: 1 },
    ingredients: ["瀬戸内レモン", "水"] },
  "boso-highball": { cat: "ALCOHOL", flavor: "amber", name: "BOSOハイボール", sub: "房総ウイスキー", price: "¥700", img: "",
    desc: "千葉県で初めて生まれた地ウイスキー「房総ウイスキー」。君津の蔵元・須藤本家が手がける一本は、ほのかなスモーキーさの奥に、やわらかな甘い香りが潜んでいます。強めの炭酸で割ると、その香りがふわっと立ちのぼって、喉ごしはどこまでもキレよく。千葉の土地で生まれた味を、千葉の空の下で。",
    age: true, ingredients: ["房総ウイスキー", "炭酸"] },
  "highball-other": { cat: "ALCOHOL", flavor: "amber", name: "ハイボール（その他銘柄）", sub: "銘柄は日替わり", price: "¥800〜¥1,000", img: "",
    desc: "潮の香りとスモーキーさが力強いタリスカー、華やかで飲みやすいグレンリベットなど、その日ご用意している銘柄からお好みの一杯を。「軽やかなものを」「香りの強いものを」とお伝えいただければ、ぴったりの一本をご提案します。ラインナップは日替わりです。",
    age: true, ingredients: ["ウイスキー（銘柄は日替わり）", "炭酸"] },
  "lemon-sour": { cat: "ALCOHOL", flavor: "amber", name: "プレミアムレモンサワー", sub: "ウィルキンソンウォッカ × OFF LEMON", price: "¥700", img: "",
    desc: "ウィルキンソンの強炭酸に、瀬戸内レモンをぎゅっと。甘さをぐっと抑えているので、レモンの香りと酸味がまっすぐ届きます。キレのある後味で、気づけば次のひと口に手が伸びる本格レモンサワー。",
    age: true, taste: { sweet: 1, refresh: 3, aroma: 1 },
    ingredients: ["ウィルキンソンウォッカ", "瀬戸内レモン", "炭酸"] }
};

const FLAVOR_VAR = { sunset: "var(--sunset)", herbal: "var(--herbal)", "tea-brown": "var(--tea-brown)", lemon: "var(--lemon)", amber: "var(--amber)", rose: "var(--rose)" };

const modal = document.getElementById("drinkModal");
if (modal) {
  const base = modal.dataset.assetBase || "assets/img/";
  const $ = (id) => document.getElementById(id);
  let lastFocused = null;

  // Pages carry different subsets of these fields, so every write is optional.
  const set = (id, value, display) => {
    const el = $(id);
    if (!el) return;
    el.textContent = value || "";
    if (display !== undefined) el.style.display = display ? "" : "none";
  };

  const dots = (n) => {
    let out = "";
    for (let i = 1; i <= 3; i++) out += `<span class="taste__dot${i <= n ? " filled" : ""}"></span>`;
    return out;
  };

  const openDrink = (id) => {
    const d = DRINKS[id];
    if (!d) return;
    lastFocused = document.activeElement;

    // Accent flows through CSS so light/dark handling stays in the stylesheet.
    modal.style.setProperty("--accent", FLAVOR_VAR[d.flavor] || "var(--sunset)");

    const media = $("dmMedia");
    if (media) {
      media.innerHTML = d.img ? `<img src="${base}${d.img}" alt="${d.name}">` : "";
      media.style.display = d.img ? "" : "none";
    }
    set("dmTag", d.cat);
    set("dmName", d.name);
    set("dmSub", d.sub, !!d.sub);
    set("dmPrice", d.price);
    set("dmIngredients", (d.ingredients || []).join(" ／ "), !!(d.ingredients || []).length);
    set("dmNote", d.note ? "※ " + d.note : "", !!d.note);
    set("dmDesc", d.desc);

    const facts = $("dmFacts");
    if (facts) {
      let html = "";
      if (d.age) html = '<span class="fact fact--age">20歳以上のお客様限定</span>';
      else if (d.caffeine) html = '<span class="fact fact--caffeine-yes">カフェインあり</span>';
      else html = '<span class="fact fact--caffeine-no">カフェインなし</span>';
      facts.innerHTML = html;
    }

    const taste = $("dmTaste");
    if (taste) {
      taste.style.display = d.taste ? "" : "none";
      taste.innerHTML = d.taste
        ? `<div class="taste__row"><span class="taste__label">甘さ</span><span class="taste__dots">${dots(d.taste.sweet)}</span></div>` +
          `<div class="taste__row"><span class="taste__label">爽快感</span><span class="taste__dots">${dots(d.taste.refresh)}</span></div>` +
          `<div class="taste__row"><span class="taste__label">香り</span><span class="taste__dots">${dots(d.taste.aroma)}</span></div>`
        : "";
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    // Background is left scrollable on purpose — locking it caused a layout
    // shift when the scrollbar disappeared/reappeared.
    modal.querySelector(".drink-modal__close").focus();
  };

  const closeDrink = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  };

  document.querySelectorAll("[data-drink]").forEach((el) => {
    if (el.tagName !== "BUTTON") { el.setAttribute("role", "button"); el.setAttribute("tabindex", "0"); }
    el.addEventListener("click", () => openDrink(el.dataset.drink));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDrink(el.dataset.drink); }
    });
  });
  modal.querySelectorAll("[data-close]").forEach((c) => c.addEventListener("click", closeDrink));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeDrink();
  });
}
