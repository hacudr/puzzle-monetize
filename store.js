// Whether the app has been bought, and the one place where money changes hands.
// There is one purchase, the whole app, which opens every picture.
//
// No shop is wired up yet. `pay` and `fetchOwned` below are where one goes:
// StoreKit through a native wrapper, or a checkout page with a server behind
// it. Until then a purchase goes through only on the machine the app is being
// developed on, so the locks can be tried, and is refused everywhere else.
// What is kept here is only a copy for drawing the locks; the shop's own
// record is what counts, and `restore` reads it back.
const store = (() => {
  const KEY = 'puzzle.owned';
  // the shop's id for the purchase, and its price where the app is sold
  const PRODUCT = 'full';
  const PRICE = '$9.99';
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);

  let owned = false;
  try {
    owned = localStorage.getItem(KEY) === PRODUCT;
  } catch {}

  const save = () => {
    try {
      if (owned) localStorage.setItem(KEY, PRODUCT);
      else localStorage.removeItem(KEY);
    } catch {}
  };

  // Takes the money; resolves once it is paid for, and rejects with a message
  // for the buyer if it is not.
  async function pay(id) {
    if (!local) throw new Error('Purchases are not open yet.');
  }

  // Whether this buyer has paid, as the shop has it.
  async function fetchOwned() {
    if (!local) throw new Error('Purchases are not open yet.');
    return owned;
  }

  return {
    owned: () => owned,
    price: () => PRICE,
    async buy() {
      await pay(PRODUCT);
      owned = true;
      save();
    },
    // resolves with whether the purchase was found
    async restore() {
      owned = await fetchOwned();
      save();
      return owned;
    },
    // for trying the locks again while developing: store.forget() in the console
    forget() {
      owned = false;
      save();
    },
  };
})();
