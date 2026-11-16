// ---- Router, click handling, overlays, actions ----
let timer, lastId = null;
const AUTO = { C11: 'C13', C12: 'C13' }; // auto-advance after 2 seconds

function hashParts() { return (location.hash.replace(/^#\/?/, '') || 'A1').split('/'); }
function overlayHTML() {
  if (!S.overlay) return '';
  const [title, body] = HELP[S.overlay] || ['', ''];
  const tip = S.overlay === 'tip';
  return `<div class="scrim"><div class="sheet" role="dialog" aria-modal="true"><h2>${tip ? 'Save ' + S.helper + '’s tip?' : title}</h2><p>${body}</p>
  ${tip ? btn('Save tip', 'data-act="saveTip"') + btn('No thanks', 'data-act="closeOv"', 'secondary') : btn('Got it', 'data-act="closeOv"')}</div></div>`;
}
function render() {
  const [id, arg] = hashParts();
  const app = document.getElementById('app');
  const old = app.querySelector('main');
  const keep = old && lastId === id ? old.scrollTop : 0;
  app.innerHTML = (SCREENS[id] || SCREENS.A1)(arg) + overlayHTML();
  const m = app.querySelector('main'); if (m) m.scrollTop = keep;
  lastId = id; clearTimeout(timer);
  if (AUTO[id]) timer = setTimeout(() => go(AUTO[id]), 2000);
}
function go(t) { S.overlay = null; const h = '#/' + t; if (location.hash === h) render(); else location.hash = h; }
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.getElementById('phone').appendChild(t); setTimeout(() => t.remove(), 2500); }
const val = id => (document.getElementById(id) || {}).value;

const ACTS = {
  pick: d => { S[d.key] = d.val; },
  toggle: d => { S[d.key] = !S[d.key]; },
  protect: d => { S.protect = d.val === '1'; },
  helper: d => { S.helper = d.val; },
  chooseLisa: () => { S.helper = 'Lisa'; },
  addCoffee: () => { S.cart = ['coffee']; S.flow = 'B'; },
  addBag: d => { S.cart = [d.val]; S.flow = 'C'; },
  checkout: () => { S.flow = S.cart[0] === 'coffee' ? 'B' : 'C'; S.ship = { ...DEFAULT_SHIP }; go(S.flow === 'B' ? 'B3' : 'C6'); return 'nav'; },
  newCard: () => { S.newCard = true; },
  saveAddr: () => { const name = val('an').trim(), place = val('ap').trim();
    if (!name) { toast('Enter a name.'); return 'stay'; }
    if (!place) { toast('Enter a street and city.'); return 'stay'; }
    S.ship = { name, place }; },
  shipEmma: () => { S.ship = { name: 'Emma', place: '456 Real St' }; },
  pay: () => { if (!S.cart[0]) return 'nav';
    const orderTotals = totals(), isCoffee = S.flow === 'B', orderId = isCoffee ? '123A' : '456B';
    S.orders = S.orders.filter(order => order.id !== orderId);
    S.orders.unshift({ id: orderId, name: ITEMS[S.cart[0]].name, status: 'Placed',
      arrives: isCoffee && S.delivery === 'express' ? 'Thu, Nov 5' : 'Mon, Nov 9 – Wed, Nov 11', paid: money(orderTotals.total), card: CARD,
      delivery: isCoffee ? (S.delivery === 'express' ? 'Express ($10)' : 'Free standard') : 'Free standard',
      protection: isCoffee && S.protect, giftWrap: !isCoffee && S.wrap, giftReceipt: !isCoffee && S.receipt,
      giftMessage: !isCoffee && S.note ? S.giftMessage : '' });
    S.cart = []; S.lastOrderId = orderId; },
  endHelp: () => { S.overlay = null; location.hash = '#/C15'; S.overlay = 'tip'; return 'nav'; },
  saveTip: () => { const tip = 'Pick a gift receipt so the person can exchange the gift without seeing the price.';
    S.tipSaved = true; if (!S.tips.includes(tip)) S.tips.unshift(tip); S.overlay = null; },
  closeOv: () => { S.overlay = null; },
  soon: () => { toast('Kitchen and Home are not ready. Try Gifts or Search.'); return 'nav'; },
  restart: () => { S = fresh(); go('A1'); return 'nav'; }
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-go],[data-back],[data-act],[data-overlay]'); if (!el) return;
  const d = el.dataset;
  if (d.overlay) { S.overlay = d.overlay; render(); return; }
  if (d.back !== undefined) { S.overlay = null; history.length > 1 ? history.back() : go('A1'); return; }
  const r = d.act && ACTS[d.act] ? ACTS[d.act](d) : null;
  if (r === 'stay') return;
  if (d.go) go(d.go); else if (r !== 'nav') render();
});
document.addEventListener('input', e => { if (e.target.dataset.bind) { S[e.target.dataset.bind] = e.target.value; const count = e.target.parentElement.querySelector('small'); if (count) count.textContent = `${e.target.value.length}/180 characters`; } });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && S.overlay) { S.overlay = null; render(); return; } // Esc closes any open pop-up
  if ((e.key === 'r' || e.key === 'R') && !/INPUT|TEXTAREA/.test(e.target.tagName)) ACTS.restart();
});
window.addEventListener('hashchange', render);
render();
