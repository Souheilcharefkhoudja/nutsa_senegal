// Nutsa Sénégal — storefront logic
// - Renders product rows from window.PRODUCTS
// - Cart state, sticky bar, modal, delivery fee calc
// - Form is a "site vitrine" stub: shows a WhatsApp CTA on submit

(function(){
  const PRODUCTS = window.PRODUCTS || [];
  const REGIONS  = window.REGIONS  || {};
  const fmt = n => (n|0).toLocaleString('fr-FR').replace(/ /g,' ');
  const cart = {};       // id -> qty
  let deliveryMode = 'home';

  // ── Render product rows
  const list = document.getElementById('products');
  PRODUCTS.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'product-row';
    row.dataset.id = p.id;
    row.dataset.price = p.price;
    row.dataset.is15 = p.is15 ? '1' : '';
    row.innerHTML = `
      <img class="thumb" src="${p.image}" alt="${p.title}" loading="lazy">
      <div class="info">
        <div class="num">Nº ${String(i+1).padStart(2,'0')}</div>
        <h3>${p.title}</h3>
      </div>
      <div class="qty">
        <button type="button" data-qty="-" aria-label="Diminuer">−</button>
        <input type="number" min="0" value="0" inputmode="numeric" data-qty-input>
        <button type="button" data-qty="+" aria-label="Augmenter">+</button>
      </div>
      <div class="price"><b>${fmt(p.price)}</b><span class="cur">CFA</span><div class="unit">/ unité</div></div>
    `;
    list.appendChild(row);
  });

  // ── Quantity handlers
  document.querySelectorAll('.product-row').forEach(row => {
    const input = row.querySelector('[data-qty-input]');
    row.querySelectorAll('[data-qty]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cur = parseInt(input.value) || 0;
        input.value = Math.max(0, cur + (btn.dataset.qty === '+' ? 1 : -1));
        recompute();
      });
    });
    input.addEventListener('input', recompute);
  });

  function recompute(){
    let total = 0, count = 0;
    for (const k in cart) delete cart[k];
    document.querySelectorAll('.product-row').forEach(row => {
      const qty = parseInt(row.querySelector('[data-qty-input]').value) || 0;
      row.classList.toggle('selected', qty > 0);
      if (qty > 0) {
        const id = row.dataset.id;
        const price = parseFloat(row.dataset.price) || 0;
        cart[id] = { qty, price, is15: row.dataset.is15 === '1', title: row.querySelector('h3').textContent };
        total += qty * price;
        count += qty;
      }
    });
    document.getElementById('bar-count').textContent = count;
    document.getElementById('bar-total').textContent = fmt(total);
    document.getElementById('order-bar').classList.toggle('show', count > 0);
    return { total, count };
  }

  document.getElementById('bar-reset').addEventListener('click', () => {
    document.querySelectorAll('.product-row [data-qty-input]').forEach(i => i.value = 0);
    recompute();
  });

  // ── Region / dept dropdowns
  const regionSel = document.getElementById('cust-region');
  const deptSel   = document.getElementById('cust-dept');
  Object.keys(REGIONS).sort().forEach(r => {
    const o = document.createElement('option');
    o.value = r; o.textContent = r;
    regionSel.appendChild(o);
  });
  regionSel.addEventListener('change', () => {
    deptSel.innerHTML = '';
    const r = REGIONS[regionSel.value];
    if (!r) {
      deptSel.innerHTML = '<option value="">Sélectionnez d\'abord une région</option>';
      return;
    }
    deptSel.innerHTML = '<option value="">— département —</option>';
    r.depts.forEach(d => {
      const o = document.createElement('option');
      o.value = d; o.textContent = d;
      deptSel.appendChild(o);
    });
    updateFees();
    updateModalTotal();
  });

  // ── Delivery mode
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('on'));
      card.classList.add('on');
      deliveryMode = card.dataset.mode;
      updateModalTotal();
    });
  });

  // Fee rules:
  //   Dakar (01) always free
  //   Multiple distinct items → free
  //   Single non-1.5kg item → free
  //   Single 1.5kg item → pays home or relay
  function getDeliveryFee(){
    const r = REGIONS[regionSel.value];
    if (!r) return 0;
    if (regionSel.value.indexOf('01 — ') === 0) return 0;
    const items = Object.values(cart);
    if (items.length !== 1) return 0;
    if (!items[0].is15) return 0;
    return deliveryMode === 'home' ? r.home : r.relay;
  }
  function updateFees(){
    const r = REGIONS[regionSel.value];
    const homeEl = document.querySelector('[data-fee-home]');
    const relayEl = document.querySelector('[data-fee-relay]');
    if (!r) { homeEl.textContent = '—'; relayEl.textContent = '—'; return; }
    const items = Object.values(cart);
    const free = regionSel.value.indexOf('01 — ') === 0
              || items.length > 1
              || (items.length === 1 && !items[0].is15);
    homeEl.textContent = free ? 'Gratuit' : fmt(r.home);
    relayEl.textContent = free ? 'Gratuit' : fmt(r.relay);
  }
  function updateModalTotal(){
    const c = recompute();
    updateFees();
    document.getElementById('modal-total').textContent = fmt(c.total + getDeliveryFee());
  }

  // ── Modal open/close
  const modal = document.getElementById('order-modal');
  function open(){
    if (recompute().count === 0) return;
    updateModalTotal();
    modal.classList.add('show');
    document.body.classList.add('modal-open');
  }
  function close(){
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    document.getElementById('form-view').style.display = '';
    document.getElementById('success-view').style.display = 'none';
    const btn = document.getElementById('modal-submit');
    btn.disabled = false; btn.textContent = 'Confirmer la commande';
  }
  document.getElementById('bar-checkout').addEventListener('click', open);
  document.getElementById('modal-close').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // ── Submit (site vitrine — WhatsApp handoff)
  document.getElementById('order-form').addEventListener('submit', e => {
    e.preventDefault();
    if (document.querySelector('[name="hp"]').value) return;
    const c = recompute();
    if (c.count === 0) return;

    const name  = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const region = regionSel.value;
    const dept   = deptSel.value;
    if (!name || !phone || !region || !dept) {
      alert('Merci de remplir tous les champs.');
      return;
    }

    const fee = getDeliveryFee();
    const grand = c.total + fee;
    const ref = 'NS-' + Math.floor(Math.random() * 90000 + 10000);

    // Success screen
    document.getElementById('form-view').style.display = 'none';
    document.getElementById('success-view').style.display = 'block';
    document.getElementById('order-ref').textContent = ref;

    // Clear cart shortly after
    setTimeout(() => {
      document.querySelectorAll('.product-row [data-qty-input]').forEach(i => i.value = 0);
      recompute();
    }, 500);
  });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();
})();
