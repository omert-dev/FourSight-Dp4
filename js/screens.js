// ---- One function per Figma frame (A1…C18). Shared steps are reused by both flows. ----
const flowIs = f => S.flow === f;
const cartScreen = () => { const it = ITEMS[S.cart[0]];
  return page(it
    ? `<h1>Your cart</h1><div class="card row">${tile(it,'sm')}<div><b>${it.name}</b><br>${money(it.price)}</div></div>${btn('Check out with Coach','data-act="checkout"')}`
    : `<h1>Your cart is empty</h1>${btn('Keep shopping','data-go="B1"')}`, { banner: 'Coach is on', nav: 'Shop' }); };

const shipScreen = (totalSteps, otherAddressScreen, nextScreen) => page(
  coach(1, totalSteps, 'req', 'Check where your package will go.', 'shipping') +
  `<div class="card"><b>Robert’s address</b><br>${DEFAULT_SHIP.place}</div>` +
  btn('Send to this address', `data-go="${nextScreen}"`) + btn('Use another address', `data-go="${otherAddressScreen}"`, 'secondary'),
  { banner: 'Coach is on', nav: 'Shop' });

const payScreen = (step, totalSteps, nextScreen) => page(
  coach(step, totalSteps, 'req', 'Choose a card.', 'payment') +
  `<div class="opt on"><span class="dot"></span><span class="txt"><b>${CARD}</b><small>Your saved card</small></span></div>` +
  btn('Next', `data-go="${nextScreen}"`) + btn('Use a different card', 'data-go="B7"', 'secondary'),
  { banner: 'Coach is on', nav: 'Shop' });

const safeScreen = () => { const orderTotals = totals(), isCoffee = flowIs('B'), item = ITEMS[S.cart[0]] || {};
  const arrives = isCoffee ? (S.delivery === 'express' ? 'Thu, Nov 5' : 'Nov 9 – 11') : 'Nov 9 – 11';
  return page(`<h1>Safe to Pay</h1>
  <div class="card"><div class="line"><span>${item.name}</span><span>${money(orderTotals.item)}</span></div>
  <div class="line"><span>Delivery</span><span>${orderTotals.ship ? money(orderTotals.ship) : 'Free'}</span></div>
  ${orderTotals.prot ? `<div class="line"><span>Protection plan</span><span>${money(orderTotals.prot)}</span></div>` : ''}
  ${orderTotals.wrap ? `<div class="line"><span>Gift wrap</span><span>${money(orderTotals.wrap)}</span></div>` : ''}
  ${!isCoffee && S.receipt ? `<div class="line"><span>Gift receipt</span><span>Included</span></div>` : ''}
  ${!isCoffee && S.note ? `<div class="line"><span>Gift message</span><span>Included</span></div>` : ''}
  <div class="line"><span>State tax</span><span>${money(orderTotals.tax)}</span></div>
  <div class="total"><span>Total</span><span>${money(orderTotals.total)}</span></div></div>
  <p><b>Paying with:</b> ${CARD}<br><b>Arrives:</b> ${arrives}<br><b>Ships to:</b> ${escapeHTML(S.ship.name)}, ${escapeHTML(S.ship.place)}</p>
  <p class="ver">✓ Maple &amp; Main is a verified store<br>✓ You can cancel within 1 hour</p>
  ${btn('Pay ' + money(orderTotals.total), `data-act="pay" data-go="${isCoffee ? 'B9' : 'C18'}"`)}
  ${btn('Change something', `data-go="${isCoffee ? 'B4' : 'C9'}"`, 'secondary')}`, { banner: 'Coach is on', nav: 'Shop' }); };

const bagGrid = list => `<div class="grid">${list.map(b => `<button class="prod" data-go="C4/${b.id}">${tile(ITEMS[b.id])}<b>${b.name}</b><span>${money(b.price)}</span></button>`).join('')}</div>`;
const under30 = BAGS.filter(b => b.price < 30);

const giftScreen = mode => page(
  coach(2, 3, 'choice', 'Choose any gift extras you want.', 'gift') +
  checkRow('receipt', 'Gift receipt (no prices shown)', S.receipt, '', mode === 'help' ? 'hl' : '') +
  checkRow('wrap', 'Gift wrap', S.wrap, '+$5') +
  checkRow('note', 'Gift message', S.note) +
  (S.note ? `<div><label for="giftMessage">Message for Emma</label><textarea id="giftMessage" data-bind="giftMessage" maxlength="180" placeholder="Write your message">${escapeHTML(S.giftMessage)}</textarea><small>${S.giftMessage.length}/180 characters</small></div>` : '') +
  (mode === 'help' ? `<div class="note"><b>${S.helper}’s tip</b><p>A gift receipt lets Emma exchange the gift without seeing the price. Gift wrap costs $5.</p></div>${btn('Save tip','data-act="endHelp"')}` : '') +
  (mode === 'done' && S.tipSaved ? `<span class="chip">${S.helper}’s tip</span>` : '') +
  (mode === 'plain' ? btn('Ask Lisa for help', 'data-act="chooseLisa" data-go="C10"', 'family') : '') +
  (mode !== 'help' ? btn('Next', 'data-go="C16"') : ''),
  mode === 'help' ? { banner: `${S.helper} can point, but only you can tap`, help: 1, nav: 'Shop' } : { banner: 'Coach is on', nav: 'Shop' });

const SCREENS = {
// ---------- A: Home & Orders ----------
A1: () => { const toasterOrder = S.orders.find(order => order.id === 'toaster');
  return page(`<h1>Hi Robert</h1>
  <button class="card" data-go="A3/toaster"><b>Your toaster shipped</b><span>Arrives ${toasterOrder.arrives}</span></button>
  ${btn('Shop at Maple &amp; Main','data-go="B1"')}${btn('My Orders','data-go="A2"','secondary')}${btn('Family Helpers','data-go="A4"','secondary')}`, { back: false, nav: 'Home' }); },
A2: () => page(`<h1>My Orders</h1>${S.orders.map(o => `<button class="card ${o.old ? 'old' : ''}" data-go="A3/${o.id}"><b>${o.name}</b><span>${o.status}${o.arrives && !o.old ? ' · arrives ' + o.arrives : ''}</span></button>`).join('')}`, { nav: 'Orders' }),
A3: id => { const order = S.orders.find(item => item.id === id) || S.orders[0];
  return page(`<div class="ok" aria-hidden="true">✓</div><h1>Order details</h1>
  ${order.arrives ? `<div class="arrive"><span>Arrives</span><strong>${order.arrives}</strong></div>` : ''}<div class="facts">
  <p><b>Item</b>${order.name}${/^\d{3}[A-Z]$/.test(order.id) ? ' (order ' + order.id + ')' : ''}</p>
  ${order.shipped ? `<p><b>Shipped</b>${order.shipped}</p>` : ''}${order.arrives ? '' : `<p><b>Status</b>${order.status}</p>`}
  <p><b>Paid</b>${order.paid} with ${order.card}</p>
  ${order.delivery ? `<p><b>Delivery</b>${order.delivery}</p>` : ''}
  ${order.protection ? `<p><b>Protection plan</b>$8</p>` : ''}
  ${order.giftWrap ? `<p><b>Gift wrap</b>$5</p>` : ''}
  ${order.giftReceipt ? `<p><b>Gift receipt</b>Included. Price hidden.</p>` : ''}
  ${order.giftMessage ? `<p><b>Gift message</b>${escapeHTML(order.giftMessage)}</p>` : ''}</div>
  <p class="ver">✓ Maple &amp; Main is a verified store</p>${btn('How to return or cancel','data-overlay="return"','secondary')}`, { nav: 'Orders' }); },
A4: () => page(`<h1>Family Helpers</h1>
  <div class="card row">${avatar('Lisa','#7A4E9E')}<div><b>Lisa</b><span>Daughter</span></div></div>
  <div class="card row">${avatar('Mark','#2E7D4F')}<div><b>Mark</b><span>Son</span></div></div>
  <h2>Saved tips (${S.tips.length})</h2>${S.tips.map(t => `<div class="note">${t}</div>`).join('')}`, { nav: 'Help' }),

// ---------- B: Coffee checkout ----------
B1: () => { const n = S.cart.length;
  return page(`<div class="storehead"><div class="logo"><i>M</i><span>Maple &amp; Main</span></div>
  <button class="cart" data-go="B2" aria-label="Cart, ${n} items">${icon('cart')}${n ? `<em>${n}</em>` : ''}</button></div>
  <button class="search" data-go="C1">${icon('search')}Search the store</button>
  <h2>Shop by kind</h2>
  <div class="cats"><button data-act="soon">Kitchen</button><button data-go="C3">Gifts</button><button data-act="soon">Home</button></div>
  ${n ? '' : `<div class="card row">${tile(ITEMS.coffee,'sm')}<div><b>Coffee maker</b><br>$50</div></div>${btn('Add to cart','data-act="addCoffee" data-go="B2"')}`}`,
  { banner: 'Coach is on', nav: 'Shop', top: false }); },
B2: cartScreen,
B3: () => shipScreen(4, 'C8', 'B4'),
B4: () => page(coach(2, 4, 'choice', 'Choose a delivery speed.', 'delivery') +
  optCard('delivery', 'free', 'Free standard', 'Free', 'Arrives Nov 9 – 11', S.delivery === 'free') +
  optCard('delivery', 'express', 'Express', '$10', 'Arrives Thu, Nov 5', S.delivery === 'express') +
  btn('Next', 'data-go="B5"'), { banner: 'Coach is on', nav: 'Shop' }),
B5: () => page(coach(3, 4, 'opt', 'You can skip this.', 'protect') +
  `<p>Protection helps pay for repairs if the coffee maker breaks.</p>` +
  `<button class="opt ${S.protect ? '' : 'on'}" role="radio" aria-checked="${!S.protect}" data-act="protect" data-val="0"><span class="dot"></span><span class="txt"><b>Skip protection</b><small>No extra charge</small></span><b class="price">$0</b></button>` +
  `<button class="opt ${S.protect ? 'on' : ''}" role="radio" aria-checked="${S.protect}" data-act="protect" data-val="1"><span class="dot"></span><span class="txt"><b>Add protection</b><small>Covers repairs</small></span><b class="price">$8</b></button>` +
  btn('Next', 'data-go="B6"'), { banner: 'Coach is on', nav: 'Shop' }),
B6: () => payScreen(4, 4, 'B8'),
B7: () => page(`<h1>New card</h1>
  <div><label for="cn">Card number</label><input id="cn" value="4111 1111 1111 1234" inputmode="numeric"></div>
  <div><label for="ce">Expires</label><input id="ce" value="08 / 29"></div>
  <div><label for="cs">Security code (3 digits on the back)</label><input id="cs" value="123"></div>
  ${checkRow('dontSave', 'Don’t save this card', S.dontSave)}
  ${btn('Continue', `data-act="newCard" data-go="${flowIs('B') ? 'B8' : 'C17'}"`)}`, { banner: 'Coach is on', nav: 'Shop' }),
B8: safeScreen,
B9: () => { const id = S.lastOrderId || '123A';
  return page(`<div class="ok" aria-hidden="true">✓</div><h1>Order placed</h1><p>Order ${id} is in My Orders. We’ll email you when it ships.</p>${btn('See it in My Orders','data-go="A2"')}`, { back: false, nav: 'Orders' }); },

// ---------- C: Gift for Emma ----------
C1: () => page(`<div class="search">${icon('search')}handbag</div><div class="chips"><button class="filter-primary" data-go="C2">Under $30</button><button data-go="C3">Gifts</button></div>${bagGrid(BAGS)}`, { banner: 'Coach is on', nav: 'Shop' }),
C2: () => page(`<h1>Bags under $30</h1>${bagGrid(under30)}`, { banner: 'Coach is on', nav: 'Shop' }),
C3: () => page(`<h1>Gifts › Bags</h1>${bagGrid(under30)}`, { banner: 'Coach is on', nav: 'Shop' }),
C4: id => { const b = BAGS.find(x => x.id === id) || BAGS[0];
  return page(`${tile(ITEMS[b.id], 'big')}<h1>${b.name}</h1><div class="price"><b>${money(b.price)}</b></div>
  <p><b>What buyers say, in plain words:</b> ${b.says}.</p><p>★ 4.6 from 212 buyers</p>
  ${btn('Add to cart', `data-act="addBag" data-val="${b.id}" data-go="C5"`)}`, { banner: 'Coach is on', nav: 'Shop' }); },
C5: cartScreen,
C6: () => page(
  coach(1, 3, 'req', 'Choose where to send Emma’s gift.', 'shipping') +
  `<button class="card address" data-act="shipEmma" data-go="C9"><b>Emma’s saved address</b><span>456 Real St</span></button>` +
  btn('Enter a new address', 'data-go="C8"', 'secondary'),
  { banner: 'Coach is on', nav: 'Shop' }),
C7: () => page(`<h1>Who is it going to?</h1>
  <button class="card row" data-act="shipEmma" data-go="C9">${avatar('Emma','#C0612B')}<div><b>Emma (granddaughter)</b><span>456 Real St</span></div></button>
  ${btn('Add a new address', 'data-go="C8"', 'secondary')}`, { banner: 'Coach is on', nav: 'Shop' }),
C8: () => { const g = flowIs('C');
  return page(`<h1>Where should it go?</h1>
  <div><label for="an">Name</label><input id="an" value="${g ? 'Emma' : 'Robert'}"></div>
  <div><label for="ap">Street and city</label><input id="ap" value="${g ? '456 Real St' : '789 Real St'}"></div>
  ${btn('Save', `data-act="saveAddr" data-go="${g ? 'C9' : 'B4'}"`)}`, { banner: 'Coach is on', nav: 'Shop' }); },
C9: () => giftScreen('plain'),
C10: () => page(`<h1>Ask Lisa for help</h1><div class="card helper"><div class="row">${avatar('Lisa','#7A4E9E')}<div><b>Lisa</b><span>Daughter</span></div></div>
  <p>Lisa can explain these choices. Only you can tap or pay.</p>
  <div class="btns">${btn('Call Lisa', 'data-act="helper" data-val="Lisa" data-go="C11"')}${btn('Send Lisa a link', 'data-act="helper" data-val="Lisa" data-go="C12"', 'secondary')}</div></div>`, { banner: 'Coach is on', nav: 'Shop' }),
C11: () => page(`${avatar(S.helper, S.helper === 'Lisa' ? '#7A4E9E' : '#2E7D4F')}<h1>Calling ${S.helper}…</h1>`, { back: false, nav: 'Shop' }).replace('<main>', '<main class="big-center">'),
C12: () => page(`<h1>Link sent</h1><p>${S.helper} will join soon…</p>`, { back: false, nav: 'Shop' }).replace('<main>', '<main class="big-center">'),
C13: () => giftScreen('help'),
C15: () => giftScreen('done'),
C16: () => payScreen(3, 3, 'C17'),
C17: safeScreen,
C18: () => page(`<div class="ok" aria-hidden="true">✓</div><h1>Gift ordered for Emma!</h1>${S.tipSaved ? `<p>${S.helper}’s tip is saved for next time.</p>` : ''}${btn('See it in My Orders','data-go="A2"')}`, { back: false, nav: 'Orders' })
};
