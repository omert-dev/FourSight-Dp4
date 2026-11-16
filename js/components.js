// ---- Reusable UI pieces (match the Figma components) ----
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5v10H14v-6h-4v6H3z"/>',
  shop: '<path d="M6 8h12l1 13H5L6 8zM9 9V6a3 3 0 0 1 6 0v3"/>',
  orders: '<path d="M4 7l8-4 8 4-8 4-8-4zm0 0v10l8 4 8-4V7M12 11v10"/>',
  help: '<path d="M4 5h16v12H9l-5 4V5zM8 11h.01M12 11h.01M16 11h.01"/>',
  cart: '<path d="M3 4h2l2 11h10l3-8H6M9 20h.01M17 20h.01"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  coffee: '<path d="M5 8h12v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8zm12 2h2a3 3 0 0 1 0 6h-3M8 3v2m4-2v2"/>',
  bag: '<path d="M5 8h14l1 13H4L5 8zm4 1V6a3 3 0 0 1 6 0v3"/>'
};
const icon = name => `<svg class="icon icon-${name}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
const bar = active => `<nav class="bar">${[['Home','A1','home'],['Shop','B1','shop'],['Orders','A2','orders'],['Help','A4','help']]
  .map(([label,target,name]) => `<button data-go="${target}" class="${active===label?'on':''}">${icon(name)}${label}</button>`).join('')}</nav>`;
const btn = (label, attrs, kind = 'primary') => `<button class="btn ${kind}" ${attrs}>${label}</button>`;
const TAGS = { req: ['Required','p-req'], opt: ['Optional','p-opt'], choice: ['Your choice','p-choice'] };
const coach = (step, total, tag, text, topic) => `<div class="coach"><div class="row"><b>Step ${step} of ${total}</b><span class="pill ${TAGS[tag][1]}">${TAGS[tag][0]}</span></div><p>${text}</p><button class="link" data-overlay="${topic}">What does this mean?</button></div>`;
const optCard = (key, val, title, price, detail, on) => `<button class="opt ${on?'on':''}" role="radio" aria-checked="${!!on}" data-act="pick" data-key="${key}" data-val="${val}"><span class="dot"></span><span class="txt"><b>${title}</b><small>${detail}</small></span><b class="price">${price}</b></button>`;
const checkRow = (key, label, on, extra = '', cls = '') => `<button class="check ${on?'on':''} ${cls}" role="checkbox" aria-checked="${!!on}" data-act="toggle" data-key="${key}"><span class="box">${on?'✓':''}</span><span>${label}</span><b>${extra}</b></button>`;
const avatar = (n, c) => `<div class="av" style="background:${c}" aria-hidden="true">${n[0]}</div>`;
const tile = (it, size = '') => `<div class="tile ${size}" style="background:${it.color}" aria-hidden="true">${icon(it.icon)}</div>`;
const escapeHTML = text => String(text || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cartButton = () => { const count = S.cart.length, target = S.cart[0] && S.cart[0] !== 'coffee' ? 'C5' : 'B2';
  return `<button class="cart" data-go="${target}" aria-label="Cart, ${count} ${count === 1 ? 'item' : 'items'}">${icon('cart')}${count ? `<em>${count}</em>` : ''}</button>`; };
const page = (body, o = {}) => `${o.banner ? `<div class="banner ${o.help?'help':''}">${o.banner}</div>` : ''}${o.top === false ? '' : `<div class="top">${o.back === false ? '<span></span>' : '<button class="back" data-back aria-label="Go back">← Back</button>'}${o.cart === false ? '' : cartButton()}</div>`}<main>${body}</main>${bar(o.nav)}`;

const HELP = {
  shipping: ['Where it goes', 'Check the name and address. This is where your package will go.'],
  delivery: ['Delivery speed', 'Free delivery takes longer. Express costs $10 and arrives sooner.'],
  protect: ['Protection plan', 'This costs $8. It helps pay for repairs if the item breaks. You can skip it.'],
  payment: ['Paying', 'Choose a card. Nothing is charged until you tap Pay.'],
  gift: ['Gift choices', 'A gift receipt hides the price. Gift wrap costs $5. A message is free. You can skip any of these.'],
  safe: ['Safe to Pay', 'Check the total, card, delivery date, and address before you pay.'],
  return: ['Return or cancel', 'To cancel within 1 hour, open the order in My Orders and tap Cancel. After it arrives, open the order and tap Return.'],
  tip: ['Save this tip?', 'Show this tip next time you see gift options?']
};
