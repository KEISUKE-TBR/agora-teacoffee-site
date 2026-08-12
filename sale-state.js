// ============ Date-driven page states ============
// Loaded by every page that shows a time-limited state. Kept separate from the
// per-page scripts so the deadlines live in exactly one place.
//
// These only control what the page SHOWS. The authoritative stop for sales is
// the Square checkout link itself — deactivate it in Square at the same time,
// so a visitor with a wrong device clock (or JS disabled) still cannot buy.

// MEGURI ticket sales close at the end of 2026-08-13 JST.
var MEGURI_DEADLINE = new Date("2026-08-14T00:00:00+09:00");
// The listed appearances (8/15, 8/16) are over after this.
var EVENTS_END = new Date("2026-08-17T00:00:00+09:00");

// Preview helper: ?now=2026-08-14 renders the page as if it were that date, so
// the later states can be checked before they go live. Display only.
function siteNow() {
  var override = new URLSearchParams(location.search).get("now");
  if (override) {
    var d = new Date(override.indexOf("T") !== -1 ? override : override + "T12:00:00+09:00");
    if (!isNaN(d)) return d;
  }
  return new Date();
}

(function applyDateStates() {
  var now = siteNow();

  var closed = now >= MEGURI_DEADLINE;
  document.querySelectorAll("[data-sale]").forEach(function (el) {
    el.hidden = (el.dataset.sale === "closed") !== closed;
  });
  document.documentElement.classList.toggle("meguri-closed", closed);

  var past = now >= EVENTS_END;
  document.querySelectorAll("[data-events]").forEach(function (el) {
    el.hidden = (el.dataset.events === "past") !== past;
  });
})();
