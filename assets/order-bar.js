// ═══════════════════════════════════════════════════════════
//  NUTSA — Order bar + COD modal + real Shopify submit
//  Meta Pixel: browser AddToCart / InitiateCheckout / Purchase.
//  Purchase is fired here (not by the F&I sales channel) because
//  orders skip Shopify's hosted checkout / thank-you page —
//  they're created via Admin API from Google Apps Script. The
//  Purchase event fires on the success screen using the Shopify
//  order number as the dedupe key (eventID = "order-<N>"), so
//  any future server-side CAPI event will merge cleanly.
//  TikTok tracking: DISABLED — see TIKTOK_RESTORE.md.
//  Delivery rules:
//    1. Dakar (région 01) = always free
//    2. Multiple distinct items = free
//    3. Single non-1.5kg item = free
//    4. Single 1.5kg item = pays (home or desk fee)
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────
// ONBOARDING ARROW — points at the first product's "+" button.
// Auto-hides forever on the first quantity tap (any row).
// ─────────────────────────────────────────────────────────
(function initNutsaOnboardingArrow(){
  try {
    if (sessionStorage.getItem('nutsa_arrow_dismissed') === '1') return;
  } catch(_) {}

  const firstRow = document.querySelector('.product-row');
  if (!firstRow) return;
  const target = firstRow.querySelector('[data-qty="+"]')
              || firstRow.querySelector('[data-qty-input]');
  if (!target) return;

  const style = document.createElement('style');
  style.id = 'nutsa-arrow-css';
  style.textContent = `
    #nutsa-onboarding-arrow {
      position: fixed;
      z-index: 9998;
      width: 68px; height: 46px;
      pointer-events: none;
      transition: opacity .3s ease;
      filter: drop-shadow(0 4px 10px rgba(231,76,60,.55));
    }
    #nutsa-onboarding-arrow.hiding { opacity: 0; }
    #nutsa-onboarding-arrow .nutsa-arrow-inner {
      width: 100%; height: 100%;
      transform-origin: 90% 50%;
      animation: nutsaTap 1.4s cubic-bezier(.36, 1.6, .3, 1) infinite;
      will-change: transform;
    }
    #nutsa-onboarding-arrow svg { width:100%; height:100%; display:block; }
    @keyframes nutsaTap {
      0%   { transform: translateX(0)    rotate(0deg)   scale(1); }
      12%  { transform: translateX(12px) rotate(6deg)   scale(1.02); }
      28%  { transform: translateX(-22px) rotate(-4deg) scale(1.14); }
      36%  { transform: translateX(-16px) rotate(-2deg) scale(1.10); }
      44%  { transform: translateX(-20px) rotate(-3deg) scale(1.12); }
      55%  { transform: translateX(0)    rotate(0deg)   scale(1); }
      100% { transform: translateX(0)    rotate(0deg)   scale(1); }
    }
    #nutsa-onboarding-ripple {
      position: fixed;
      z-index: 9997;
      width: 44px; height: 44px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, rgba(231,76,60,.55) 0%, rgba(231,76,60,0) 70%);
      transform: translate(-50%, -50%) scale(1);
      animation: nutsaRipple 1.4s ease-out infinite;
      transition: opacity .3s ease;
    }
    #nutsa-onboarding-ripple.hiding { opacity: 0; }
    @keyframes nutsaRipple {
      0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 0.9; }
      70%  { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
      100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
    }
    @media (max-width: 600px) {
      #nutsa-onboarding-arrow { width: 50px; height: 34px; }
      #nutsa-onboarding-ripple { width: 34px; height: 34px; }
      @keyframes nutsaTap {
        0%   { transform: translateX(0)    rotate(0deg)   scale(1); }
        12%  { transform: translateX(9px)  rotate(6deg)   scale(1.02); }
        28%  { transform: translateX(-16px) rotate(-4deg) scale(1.14); }
        36%  { transform: translateX(-12px) rotate(-2deg) scale(1.10); }
        44%  { transform: translateX(-15px) rotate(-3deg) scale(1.12); }
        55%  { transform: translateX(0)    rotate(0deg)   scale(1); }
        100% { transform: translateX(0)    rotate(0deg)   scale(1); }
      }
    }
    @media (prefers-reduced-motion: reduce) {
      #nutsa-onboarding-arrow .nutsa-arrow-inner,
      #nutsa-onboarding-ripple { animation: none; }
    }
  `;
  document.head.appendChild(style);

  const ripple = document.createElement('div');
  ripple.id = 'nutsa-onboarding-ripple';
  ripple.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ripple);

  const arrow = document.createElement('div');
  arrow.id = 'nutsa-onboarding-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.innerHTML = `
    <div class="nutsa-arrow-inner">
      <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 20 L35 5 L35 14 L55 14 L55 26 L35 26 L35 35 Z"
              fill="#e74c3c" stroke="#a02219"
              stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
    </div>
  `;
  document.body.appendChild(arrow);

  function positionArrow(){
    const r = target.getBoundingClientRect();
    const gap = 10;
    const aw = arrow.offsetWidth;
    const ah = arrow.offsetHeight;
    ripple.style.top  = (r.top + r.height/2) + 'px';
    ripple.style.left = (r.left + r.width/2) + 'px';
    let left = r.right + gap;
    if (left + aw > window.innerWidth - 4) {
      left = r.left - gap - aw;
      arrow.style.transform = 'scaleX(-1)';
    } else {
      arrow.style.transform = '';
    }
    arrow.style.top  = (r.top + r.height/2 - ah/2) + 'px';
    arrow.style.left = left + 'px';
  }
  positionArrow();
  let ticking = false;
  function schedule(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { positionArrow(); ticking = false; });
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);

  function dismiss(){
    arrow.classList.add('hiding');
    ripple.classList.add('hiding');
    try { sessionStorage.setItem('nutsa_arrow_dismissed', '1'); } catch(_) {}
    setTimeout(() => {
      if (arrow.parentNode)  arrow.remove();
      if (ripple.parentNode) ripple.remove();
    }, 350);
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    document.removeEventListener('click', clickHandler, true);
    document.removeEventListener('input', inputHandler, true);
  }
  function clickHandler(e){
    if (e.target.closest('[data-qty], [data-qty-input]')) dismiss();
  }
  function inputHandler(e){
    if (e.target.matches('[data-qty-input]')) dismiss();
  }
  document.addEventListener('click', clickHandler, true);
  document.addEventListener('input', inputHandler, true);
  setTimeout(dismiss, 25000);
})();

// ─────────────────────────────────────────────────────────
// CART LOGIC
// ─────────────────────────────────────────────────────────
const WILAYAS = window.WILAYAS || {};
const CONFIG  = window.NUTSA_CONFIG || {};

const cart = {};

function getRows(){ return document.querySelectorAll('.product-row'); }

function atcAlreadyFired(){
  try { return sessionStorage.getItem('nutsa_atc_fired') === '1'; } catch(_) { return false; }
}
function markAtcFired(){
  try { sessionStorage.setItem('nutsa_atc_fired', '1'); } catch(_) {}
}
function icAlreadyFired(){
  try { return sessionStorage.getItem('nutsa_ic_fired') === '1'; } catch(_) { return false; }
}
function markIcFired(){
  try { sessionStorage.setItem('nutsa_ic_fired', '1'); } catch(_) {}
}
function purchaseAlreadyFired(ref){
  if (!ref) return false;
  try { return sessionStorage.getItem('nutsa_purchase_fired_' + ref) === '1'; } catch(_) { return false; }
}
function markPurchaseFired(ref){
  if (!ref) return;
  try { sessionStorage.setItem('nutsa_purchase_fired_' + ref, '1'); } catch(_) {}
}

function isFifteenKg(row){
  const text = (row.textContent || "").toLowerCase();
  return /\b1[,.]5\s*kg\b/.test(text);
}

// ─────────────────────────────────────────────────────────
// META PIXEL EVENT HELPERS (browser only)
//
// The Meta ad account for this pixel is set to EUR. XOF is
// pegged to EUR at 655.957 (BCEAO fixed rate). Convert every
// monetary event XOF → EUR and send with currency:'EUR'.
// ─────────────────────────────────────────────────────────
const XOF_PER_EUR = 655.957;
function dzdToEur(xof){
  const eur = (parseFloat(xof) || 0) / XOF_PER_EUR;
  return Math.round(eur * 100) / 100;
}

function trackAddToCart(totalDzd){
  const variantIds = Object.keys(cart);
  if (typeof fbq === 'function') {
    fbq('track', 'AddToCart', {
      value: dzdToEur(totalDzd),
      currency: 'EUR',
      content_ids: variantIds,
      content_type: 'product'
    });
  }
}

function trackInitiateCheckout(amountDzd){
  const variantIds = Object.keys(cart);
  if (typeof fbq === 'function') {
    fbq('track', 'InitiateCheckout', {
      value: dzdToEur(amountDzd),
      currency: 'EUR',
      content_ids: variantIds,
      content_type: 'product'
    });
  }
}

// Fires Meta browser Purchase on the success screen. The Shopify order
// number (e.g. "#2728") is stripped and used as the dedupe key. Same-tab
// duplicate calls are guarded by sessionStorage so a refresh of the success
// screen can't double-count.
function trackPurchase(amountDzd, itemsArr, shopifyRef){
  if (typeof fbq !== 'function' || !shopifyRef) return;
  const cleanRef = String(shopifyRef).replace(/^#/, '');
  if (!cleanRef || purchaseAlreadyFired(cleanRef)) return;
  markPurchaseFired(cleanRef);

  const contentIds = (itemsArr || []).map(function(it){ return String(it.variant_id || ''); });
  const numItems   = (itemsArr || []).reduce(function(n, it){ return n + (parseInt(it.quantity) || 0); }, 0);

  try {
    fbq('track', 'Purchase', {
      value: dzdToEur(amountDzd),
      currency: 'EUR',
      content_ids: contentIds,
      content_type: 'product',
      num_items: numItems
    }, { eventID: 'order-' + cleanRef });
  } catch (e) {
    console.warn('Purchase pixel fire failed:', e);
  }
}

function recomputeCart(){
  let total = 0, count = 0;
  for(const k in cart) delete cart[k];
  getRows().forEach(function(row){
    const input = row.querySelector('[data-qty-input]');
    const qty = parseInt(input.value) || 0;
    if(qty > 0){
      const variantId = row.dataset.variantId;
      const price = parseFloat(row.dataset.price.replace(/[^\d.]/g,'')) || 0;
      const title = row.querySelector('.info h3') ? row.querySelector('.info h3').textContent.trim() : '';
      cart[variantId] = { qty: qty, price: price, title: title, is15: isFifteenKg(row) };
      total += qty * price;
      count += qty;
    }
  });
  document.getElementById('bar-count').textContent = count;
  document.getElementById('bar-total').textContent = total.toLocaleString('fr-FR').replace(/,/g,' ');
  document.getElementById('order-bar').classList.toggle('show', count > 0);

  if (count > 0 && !atcAlreadyFired()) {
    markAtcFired();
    trackAddToCart(total);
  }

  return { total: total, count: count };
}

getRows().forEach(function(row){
  const input = row.querySelector('[data-qty-input]');
  if(!input) return;
  row.querySelectorAll('[data-qty]').forEach(function(b){ b.addEventListener('click', recomputeCart); });
  input.addEventListener('input', recomputeCart);
});

document.getElementById('bar-reset').addEventListener('click', function(){
  getRows().forEach(function(row){
    const input = row.querySelector('[data-qty-input]');
    if(input){ input.value = 0; row.classList.remove('selected'); }
  });
  recomputeCart();
});

// ─────────────────────────────────────────────────────────
// WILAYA / COMMUNE DROPDOWNS
// ─────────────────────────────────────────────────────────
const wilayaSelect = document.getElementById('cust-wilaya');
const communeSelect = document.getElementById('cust-commune');
Object.keys(WILAYAS).sort().forEach(function(w){
  const opt = document.createElement('option');
  opt.value = w; opt.textContent = w;
  wilayaSelect.appendChild(opt);
});

wilayaSelect.addEventListener('change', function(){
  communeSelect.innerHTML = '';
  const w = WILAYAS[wilayaSelect.value];
  if(!w){
    communeSelect.innerHTML = '<option value="">Sélectionnez d\'abord une wilaya</option>';
    return;
  }
  communeSelect.innerHTML = '<option value="">— commune —</option>';
  w.communes.forEach(function(c){
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    communeSelect.appendChild(opt);
  });
  updateFeeDisplay();
  updateModalTotal();
});

// ─────────────────────────────────────────────────────────
// DELIVERY MODE
// ─────────────────────────────────────────────────────────
let deliveryMode = 'home';
document.querySelectorAll('.mode-card').forEach(function(card){
  card.addEventListener('click', function(){
    document.querySelectorAll('.mode-card').forEach(function(c){ c.classList.remove('on'); });
    card.classList.add('on');
    deliveryMode = card.dataset.mode;
    updateModalTotal();
  });
});

function getDeliveryFee(){
  const w = WILAYAS[wilayaSelect.value];
  if(!w) return 0;
  if(wilayaSelect.value.indexOf("01 — ") === 0) return 0;
  const items = Object.values(cart);
  if(items.length === 0) return 0;
  if(items.length > 1) return 0;
  const item = items[0];
  if(!item.is15) return 0;
  return deliveryMode === 'home' ? w.home : w.desk;
}

function updateFeeDisplay(){
  const w = WILAYAS[wilayaSelect.value];
  if(!w){
    document.querySelector('[data-fee-home]').textContent = '—';
    document.querySelector('[data-fee-desk]').textContent = '—';
    return;
  }
  const isDakar = wilayaSelect.value.indexOf("01 — ") === 0;
  const items = Object.values(cart);
  const multiple = items.length > 1;
  const singleNot15 = items.length === 1 && !items[0].is15;
  const isFree = isDakar || multiple || singleNot15;
  document.querySelector('[data-fee-home]').textContent = isFree ? 'Gratuit' : w.home;
  document.querySelector('[data-fee-desk]').textContent = isFree ? 'Gratuit' : w.desk;
}

function updateModalTotal(){
  const c = recomputeCart();
  updateFeeDisplay();
  document.getElementById('modal-total').textContent = (c.total + getDeliveryFee()).toLocaleString('fr-FR').replace(/,/g,' ');
}

// ─────────────────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────────────────
const modal = document.getElementById('order-modal');

function openModal(){
  const c = recomputeCart();
  if(c.count === 0) return;
  updateModalTotal();
  modal.classList.add('show');
  document.body.classList.add('modal-open');
}

function closeModal(){
  modal.classList.remove('show');
  document.body.classList.remove('modal-open');
  document.getElementById('form-view').style.display = '';
  document.getElementById('success-view').style.display = 'none';
  const btn = document.getElementById('modal-submit');
  btn.disabled = false; btn.textContent = 'Confirmer la commande';
  const notice = document.getElementById('nutsa-submit-notice');
  if (notice) notice.remove();
}

document.getElementById('bar-checkout').addEventListener('click', openModal);
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-cancel').addEventListener('click', closeModal);
modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });
document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });

// ─────────────────────────────────────────────────────────
// REAL SHOPIFY SUBMIT (with progress + friendly error UI)
// ─────────────────────────────────────────────────────────
document.getElementById('order-form').addEventListener('submit', async function(e){
  e.preventDefault();
  if(document.querySelector('[name="hp_field"]').value) return;

  const submitBtn = document.getElementById('modal-submit');
  const oldNotice = document.getElementById('nutsa-submit-notice');
  if (oldNotice) oldNotice.remove();

  submitBtn.disabled = true;
  submitBtn.textContent = 'Envoi en cours...';

  const startTs = Date.now();
  const progressTimer = setInterval(function(){
    const sec = Math.floor((Date.now() - startTs) / 1000);
    if (sec >= 3 && sec < 12) submitBtn.textContent = 'Traitement... (' + sec + 's)';
    if (sec >= 12) submitBtn.textContent = 'Presque prêt... 🙏';
  }, 1000);

  function showError(msgFr){
    let notice = document.getElementById('nutsa-submit-notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.id = 'nutsa-submit-notice';
      notice.style.cssText = 'color:#c0392b;font-size:13px;margin-top:8px;text-align:center;line-height:1.4';
      submitBtn.parentElement.appendChild(notice);
    }
    notice.textContent = msgFr;
  }

  if(!CONFIG.appsScriptUrl || !CONFIG.intakeToken){
    clearInterval(progressTimer);
    submitBtn.disabled = false; submitBtn.textContent = 'Confirmer la commande';
    showError("Configuration manquante 🙏 Contacte-nous directement.");
    return;
  }

  const c = recomputeCart();
  if(c.count === 0){
    clearInterval(progressTimer);
    submitBtn.disabled = false; submitBtn.textContent = 'Confirmer la commande';
    showError("Ton panier est vide.");
    return;
  }

  const items = Object.keys(cart).map(function(variantId){
    return { variant_id: variantId, quantity: cart[variantId].qty, title: cart[variantId].title };
  });

  // Client-side pre-order id — sent to GAS so TikTok server events can
  // dedupe with any browser events fired before the Shopify order exists.
  // The Meta Purchase dedupe key is generated later from the Shopify ref.
  const eventId = 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);

  // Fire InitiateCheckout only now — after form is filled and cart is real,
  // right before the actual submit. (Previously fired on modal open, which
  // inflated IC counts and polluted the IC retargeting audience.)
  if (!icAlreadyFired()) {
    markIcFired();
    trackInitiateCheckout(c.total + getDeliveryFee());
  }

  const payload = {
    action:        'create_shopify_order',
    token:         CONFIG.intakeToken,
    name:          document.getElementById('cust-name').value.trim(),
    phone:         document.getElementById('cust-phone').value.trim(),
    wilaya:        wilayaSelect.value,
    commune:       communeSelect.value,
    delivery_mode: deliveryMode,
    delivery_fee:  getDeliveryFee(),
    subtotal:      c.total,
    items:         items,
    event_id:      eventId,
    page_url:      window.location.href,
    client_ua:     navigator.userAgent
  };

  async function attemptSubmit(){
    const res = await fetch(CONFIG.appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });
    const rawText = await res.text();
    console.log('NUTSA submit response:', res.status, rawText);
    let data;
    try { data = JSON.parse(rawText); }
    catch(_) { throw new Error('bad_json'); }
    if(!data.ok){
      console.error('NUTSA full error:', data);
      throw new Error(data.error || 'server_error');
    }
    return data;
  }

  let data;
  let failures = 0;
  while (true) {
    try {
      data = await attemptSubmit();
      break;
    } catch (err) {
      failures++;
      console.error('NUTSA submit attempt', failures, 'failed:', err);
      if (failures >= 2) {
        clearInterval(progressTimer);
        submitBtn.disabled = false;
        submitBtn.textContent = '🔄 Réessayer';
        showError("Réseau instable 🙏 Ton panier est gardé — retente dans un instant.");
        return;
      }
      submitBtn.textContent = 'Nouvelle tentative...';
      await new Promise(function(r){ setTimeout(r, 1500); });
    }
  }

  clearInterval(progressTimer);
  document.getElementById('form-view').style.display = 'none';
  document.getElementById('success-view').style.display = 'block';

  const shopifyRef = data.ref || data.order_number || '';
  document.getElementById('order-ref').textContent = shopifyRef;

  // Fire Meta browser Purchase with eventID keyed on the Shopify order
  // number. This is the single source of Meta Purchase attribution for
  // website orders — the F&I sales channel can't fire it because we
  // bypass Shopify's hosted checkout.
  trackPurchase(c.total + getDeliveryFee(), items, shopifyRef);

  setTimeout(function(){
    getRows().forEach(function(row){
      const input = row.querySelector('[data-qty-input]');
      if(input){ input.value = 0; row.classList.remove('selected'); }
    });
    recomputeCart();
  }, 500);
});

recomputeCart();