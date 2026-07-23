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
const DRINKS = {
  "sunset":            { cat: "FOCUS ／ SIGNATURE", flavor: "sunset",    name: "サンセットティーソーダ", sub: "with アップルマンゴーソルベ", price: "¥800", img: "drink-sunset.png",
    desc: "カクテル「テキーラサンライズ」から着想した看板フロート。アールグレイ オレンジペコとオレンジのベースに、真夏の夕日に見立てた完熟アップルマンゴーのソルベを浮かべ、最後にグレナデンを沈めて夕陽のグラデーションを描きます。アールグレイの華やぎとオレンジの甘みが層をなし、後半はドライフルーツが溶け出してトロピカルな表情に変わります。", tags: ["アールグレイ", "完熟アップルマンゴー", "グレナデン", "夕方〜夜に"] },
  "herbal":            { cat: "FOCUS ／ SIGNATURE", flavor: "herbal",    name: "ハーバルティーソーダ", sub: "with ハニーレモンソルベ", price: "¥800", img: "drink-herbal.png",
    desc: "機能性レモン「OFF LEMON」のスカッシュに、真夏の昼の太陽をイメージした福岡県産はちみつレモンのソルベを浮かべた昼の看板。仕上げにシトラスカモミールをそっと浮かせ、澄んだグラデーションを描きます。レモンの酸味にカモミールの華やかさが重なり、後半ははちみつ×シトラスの表情へ。ノンカフェインで、暑い日にごくごくひと息つきたい時に。", tags: ["福岡産はちみつレモン", "シトラスカモミール", "ノンカフェイン", "昼に"] },
  "earlgrey-peach":    { cat: "TEA SODA", flavor: "rose", name: "アールグレイ ピーチ ソーダ", sub: "", price: "¥700", img: "",
    desc: "アールグレイ オレンジペコの芳醇な香りに、ホワイトピーチのジューシーな甘みを重ねた分かりやすい人気者。香りとピーチの、迷いのない美味しさで「とりあえずの一杯」にも自信を持っておすすめできます。", tags: ["アールグレイ", "ホワイトピーチ", "終日"] },
  "earlgrey-orange":   { cat: "TEA SODA", flavor: "rose", name: "アールグレイ オレンジ ソーダ", sub: "", price: "¥700", img: "",
    desc: "アールグレイ オレンジペコにオレンジシロップを重ねた、香り高い柑橘ソーダ。サンセットティーソーダのベースにも使う王道の一杯で、ベルガモットとオレンジが重層的に華やかに香ります。甘さはそこまでガツンときません。", tags: ["アールグレイ", "オレンジ", "終日"] },
  "straight-earlgrey": { cat: "STRAIGHT TEA", flavor: "tea-brown", name: "アールグレイ オレンジペコ ICE", sub: "", price: "¥600", img: "",
    desc: "アールグレイ オレンジペコのティーコンクを水で割っただけの、香りをまっすぐ味わうアイスストレート。甘さは茶葉本来のもので、素材の実力がそのまま出る一杯です。", tags: ["アールグレイ", "ストレート", "甘さ控えめ"] },
  "chamomile":         { cat: "STRAIGHT TEA", flavor: "tea-brown", name: "カモミール シトラスブレンド ICE", sub: "", price: "¥600", img: "",
    desc: "クロアチア産カモミールを主役に、ローズヒップやレモングラスなど7種のハーブと果皮をブレンドしたノンカフェインのアイスハーブティー。ハーブのくせはありつつも、心が落ち着く穏やかな味わい。夜、リラックスしたい時に。", tags: ["クロアチア産カモミール", "7種のハーブ", "ノンカフェイン"] },
  "lemon-squash":      { cat: "SETOUCHI LEMON", flavor: "lemon", name: "プレミアム瀬戸内レモンスカッシュ", sub: "OFF LEMON 使用", price: "¥700", img: "",
    desc: "機能性レモン「OFF LEMON」を濃いめに、しっかりめの炭酸で仕立てたスカッシュ。甘さ控えめで炭酸強め、キレのある爽快感が特徴です。GABA配合で、暑い日にごくごく効く一杯。", tags: ["瀬戸内レモン100%", "GABA配合", "甘さ控えめ"] },
  "lemonade":          { cat: "SETOUCHI LEMON", flavor: "lemon", name: "瀬戸内レモネード", sub: "OFF LEMON 使用", price: "¥700", img: "",
    desc: "「OFF LEMON」のやさしい甘みを活かした、まろやかなレモネード。スカッシュより飲みやすく、甘めが好きな方にぴったりの定番です。", tags: ["瀬戸内レモン100%", "GABA配合", "まろやか"] },
  "boso-highball":     { cat: "ALCOHOL", flavor: "amber", name: "BOSOハイボール", sub: "房総ウイスキー", price: "¥700", img: "",
    desc: "千葉県初の地ウイスキー「房総ウイスキー」（須藤本家・君津）を、しっかりめの炭酸で。ほのかなスモーキーさとキレのある喉ごしが心地よい、地元・千葉を味わう大人の一杯です。", tags: ["房総ウイスキー", "スモーキー", "20歳以上限定"] },
  "lemon-sour":        { cat: "ALCOHOL", flavor: "amber", name: "プレミアムレモンサワー", sub: "ウィルキンソンウォッカ × OFF LEMON", price: "¥700", img: "",
    desc: "ウィルキンソンウォッカに機能性レモン「OFF LEMON」を合わせた、キレ抜群の本格レモンサワー。甘さ控えめで、さっぱり飲みたい夜にぴったりです。", tags: ["ウィルキンソンウォッカ", "瀬戸内レモン", "20歳以上限定"] }
};

const FLAVOR_HEX = { sunset: "#C55A3B", herbal: "#5F7A54", "tea-brown": "#8C6E54", lemon: "#8A9A3A", amber: "#9A6B3A", rose: "#C97B84" };

const modal = document.getElementById("drinkModal");
if (modal) {
  const base = modal.dataset.assetBase || "assets/img/";
  const $ = (id) => document.getElementById(id);
  let lastFocused = null;

  const openDrink = (id) => {
    const d = DRINKS[id];
    if (!d) return;
    lastFocused = document.activeElement;
    $("dmMedia").innerHTML = d.img ? `<img src="${base}${d.img}" alt="${d.name}">` : "";
    $("dmMedia").style.display = d.img ? "" : "none";
    $("dmTag").textContent = d.cat;
    $("dmTag").style.color = FLAVOR_HEX[d.flavor] || "#C55A3B";
    $("dmName").textContent = d.name;
    $("dmSub").textContent = d.sub || "";
    $("dmSub").style.display = d.sub ? "" : "none";
    $("dmDesc").textContent = d.desc;
    $("dmTags").innerHTML = (d.tags || []).map((t) => `<span class="drink-modal__chip">${t}</span>`).join("");
    $("dmPrice").textContent = d.price;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    // Background is left scrollable on purpose — locking it caused a layout
    // shift when the scrollbar disappeared/reappeared. The dialog is short
    // enough now that this trade-off is barely noticeable.
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
