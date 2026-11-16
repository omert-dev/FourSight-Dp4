// ---- Shared data + app state. Edit hardcoded data here. ----
const money = n => '$' + (Number.isInteger(n) ? n : n.toFixed(2));
const CARD = 'Visa ••1234';
const TAX = 0.10; // whole-dollar tax to keep prices simple
const DEFAULT_SHIP = { name: 'Robert', place: '123 Real St' };

const BAGS = [
  { id: 'tan',   name: 'Tan crossbody bag',    price: 20, color: '#D9B98F', says: 'sturdy, color matches photo, good gift' },
  { id: 'black', name: 'Black tote',           price: 15, color: '#3B4650', says: 'roomy, easy to clean, comfortable straps' },
  { id: 'red',   name: 'Red mini bag',         price: 10, color: '#C9533B', says: 'small but holds a phone, bright color' },
  { id: 'sage',  name: 'Sage green pouch bag', price: 25, color: '#9DB59E', says: 'light, zipper works well, nice size' },
  { id: 'navy',  name: 'Navy shoulder bag',    price: 40, color: '#35507A', says: 'looks nicer than the price, holds a lot' },
  { id: 'cream', name: 'Cream leather purse',  price: 45, color: '#EADFCB', says: 'soft leather, shows dirt a little' },
  { id: 'brown', name: 'Brown satchel',        price: 50, color: '#8A5A3C', says: 'heavy duty, feels like it will last' },
  { id: 'plum',  name: 'Plum travel bag',      price: 65, color: '#6B3E5E', says: 'great size for trips, a bit heavy' },
  { id: 'blue',  name: 'Blue phone bag',        price: 18, color: '#6C8EBF', says: 'easy to carry, fits a phone and keys' },
  { id: 'rose',  name: 'Rose zip pouch',        price: 22, color: '#C9838D', says: 'smooth zipper, useful pockets, cheerful color' },
  { id: 'gray',  name: 'Gray work tote',        price: 35, color: '#7B858C', says: 'stands upright, roomy inside, strong handles' },
  { id: 'gold',  name: 'Golden evening bag',    price: 55, color: '#B4934B', says: 'dressy but simple, secure clasp, compact size' }
];
const ITEMS = { coffee: { name: 'Coffee maker', category: 'Kitchen', price: 50, icon: 'coffee', color: '#E8DCCB' } };
BAGS.forEach(b => ITEMS[b.id] = { name: b.name, category: 'Gifts Bags Handbags', price: b.price, icon: 'bag', color: b.color });

const searchProducts = query => {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return Object.entries(ITEMS).filter(([, item]) => {
    const text = `${item.name} ${item.category}`.toLowerCase();
    return terms.every(term => text.includes(term));
  });
};

const fresh = () => ({
  flow: 'B', cart: ['coffee'], delivery: 'free', protect: false, searchQuery: '',
  newCard: false, dontSave: true, receipt: false, wrap: false, note: false, giftMessage: '',
  helper: 'Lisa', tipSaved: false, overlay: null, ship: { ...DEFAULT_SHIP },
  lastOrderId: null,
  tips: ['Check the delivery date before you pay.', 'Never read your card number to someone who calls you.'],
  orders: [
    { id: 'toaster', name: 'Toaster', status: 'Shipped', shipped: 'Fri, Oct 30', arrives: 'Fri, Nov 6', paid: '$30', card: CARD },
    { id: 'kettle', name: 'Kettle', status: 'Delivered Sep 12', old: 1, paid: '$25', card: CARD },
    { id: 'towels', name: 'Dish towels', status: 'Delivered Aug 3', old: 1, paid: '$15', card: CARD }
  ]
});
let S = fresh();

function totals() {
  const it = ITEMS[S.cart[0]] || { price: 0 };
  const isCoffee = S.flow === 'B', isGift = S.flow === 'C';
  const item = it.price, ship = isCoffee && S.delivery === 'express' ? 10 : 0;
  const prot = isCoffee && S.protect ? 8 : 0, wrap = isGift && S.wrap ? 5 : 0;
  const tax = Math.round(item * TAX);
  return { item, ship, prot, wrap, tax, total: item + ship + prot + wrap + tax };
}
