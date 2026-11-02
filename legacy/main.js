/**
 * DAY THREE SPECIALTY ROASTERS — PRODUCTION CLIENT INTERACTION ENGINE
 * Freshness-first roastery platform with WhatsApp order request handoff.
 */

// LAUNCH BLOCKER: Replace with owner's active WhatsApp phone number (country code + number, no symbols)
const WHATSAPP_NUMBER = '8801700000000';

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 0. Shared Utilities (scroll lock, focus trap, overlay stack)
  // ------------------------------------------------------------------------
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = () => reduceMotionQuery.matches;

  // Two frames so the browser paints the hero's hidden state before it moves.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => document.body.classList.add('is-loaded'))
  );

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  // Reference-counted body scroll lock so closing one overlay never unlocks
  // the page while another is still open.
  const scrollLocks = new Set();

  function lockScroll(owner) {
    scrollLocks.add(owner);
    document.body.classList.add('scroll-locked');
  }

  function unlockScroll(owner) {
    scrollLocks.delete(owner);
    if (scrollLocks.size === 0) {
      document.body.classList.remove('scroll-locked');
    }
  }

  // Overlay stack: Escape always dismisses the topmost layer only.
  const overlayStack = [];

  function pushOverlay(name, closeFn) {
    overlayStack.push({ name, closeFn });
  }

  function removeOverlay(name) {
    const index = overlayStack.findIndex((overlay) => overlay.name === name);
    if (index !== -1) overlayStack.splice(index, 1);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || overlayStack.length === 0) return;
    const topmost = overlayStack[overlayStack.length - 1];
    topmost.closeFn();
  });

  /**
   * Keyboard focus trap for a set of containers.
   * Toggling `inert` also removes the closed panels from the tab order and
   * the accessibility tree, which is what the CSS-only transform cannot do.
   * `inertTargets` defaults to the containers themselves; pass a narrower list
   * when a container (e.g. the burger button) must stay interactive.
   */
  function createFocusTrap(containers, inertTargets) {
    const nodes = containers.filter(Boolean);
    const inertNodes = (inertTargets || containers).filter(Boolean);
    let previousFocus = null;

    function getFocusable() {
      return nodes.flatMap((node) =>
        Array.from(node.querySelectorAll(FOCUSABLE)).filter(
          (el) => !el.hasAttribute('inert') && el.getClientRects().length > 0
        )
      );
    }

    function handleKeydown(event) {
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    return {
      activate(initialFocus) {
        previousFocus = document.activeElement;
        inertNodes.forEach((node) => node.removeAttribute('inert'));
        document.addEventListener('keydown', handleKeydown, true);
        const target = initialFocus || getFocusable()[0];
        if (target) target.focus();
      },
      deactivate() {
        document.removeEventListener('keydown', handleKeydown, true);
        inertNodes.forEach((node) => node.setAttribute('inert', ''));
        if (previousFocus && typeof previousFocus.focus === 'function') {
          previousFocus.focus();
        }
        previousFocus = null;
      },
    };
  }

  // ------------------------------------------------------------------------
  // 1. Toast Notification System
  // ------------------------------------------------------------------------
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, icon = 'check_circle') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="material-symbols-outlined toast-icon">${icon}</span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('is-hiding');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }

  // ------------------------------------------------------------------------
  // 2. Sticky Header Scroll Observer & Shrink Dynamics
  // ------------------------------------------------------------------------
  const header = document.getElementById('site-header');
  const headerContainer = document.getElementById('site-header-container');

  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('shrink');
      if (headerContainer) headerContainer.classList.add('is-scrolled');
    } else if (window.scrollY < 20) {
      header.classList.remove('shrink');
      if (headerContainer) headerContainer.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ------------------------------------------------------------------------
  // 3. Viewport Scroll Reveal Engine (Intersection Observer)
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('[data-scroll-reveal]');
  let revealObserver = null;

  if (prefersReducedMotion()) {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  } else if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;

          if (entry.isIntersecting) {
            el.classList.add('is-revealed');
            return;
          }

          // Reset on exit so the entrance replays on the way back. The hidden
          // offset follows the exit edge, so a block that scrolled out through
          // the top slides back down from above, and vice versa.
          el.classList.remove('is-revealed');
          el.classList.toggle('is-above', entry.boundingClientRect.top < 0);
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  function observeReveal(el) {
    if (!el) return;
    if (prefersReducedMotion() || !revealObserver) {
      el.classList.add('is-revealed');
    } else {
      revealObserver.observe(el);
    }
  }

  // ------------------------------------------------------------------------
  // 4. Mobile Navigation Drawer & Hamburger Morph
  // ------------------------------------------------------------------------
  const burgerBtn = document.getElementById('burger-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileNavTrap = createFocusTrap([burgerBtn, mobileNavDrawer], [mobileNavDrawer]);

  function toggleMobileMenu(forceState) {
    if (!burgerBtn || !mobileNavDrawer) return;
    const isOpen =
      forceState !== undefined ? forceState : !burgerBtn.classList.contains('is-active');

    if (isOpen) {
      burgerBtn.classList.add('is-active');
      mobileNavDrawer.classList.add('is-open');
      burgerBtn.setAttribute('aria-expanded', 'true');
      burgerBtn.setAttribute('aria-label', 'Close navigation menu');
      lockScroll('mobile-nav');
      pushOverlay('mobile-nav', () => toggleMobileMenu(false));
      mobileNavTrap.activate(mobileNavDrawer.querySelector('.mobile-nav-link'));
    } else {
      burgerBtn.classList.remove('is-active');
      mobileNavDrawer.classList.remove('is-open');
      burgerBtn.setAttribute('aria-expanded', 'false');
      burgerBtn.setAttribute('aria-label', 'Open navigation menu');
      unlockScroll('mobile-nav');
      removeOverlay('mobile-nav');
      mobileNavTrap.deactivate();
    }
  }

  if (burgerBtn && mobileNavDrawer) {
    burgerBtn.addEventListener('click', () => toggleMobileMenu());

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });
  }

  // ------------------------------------------------------------------------
  // 5. Cart State & Slide-Out Drawer Engine
  // ------------------------------------------------------------------------
  const cartState = {
    items: [],
    freeShippingGoal: 2500,
  };

  // Cart row identity: lot ID + bag size + grind
  function cartKey(item) {
    return `${item.id}::${item.size}::${item.grind}`;
  }

  const cartPillBtn = document.getElementById('cart-pill-btn');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartDrawerClose = document.getElementById('cart-drawer-close');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartHeaderCount = document.getElementById('cart-header-count');
  const cartHeaderPrice = document.getElementById('cart-header-price');
  const shippingBarFill = document.getElementById('shipping-bar-fill');
  const shippingNote = document.getElementById('shipping-note');
  const drawerSubtotalEl = document.getElementById('cart-drawer-subtotal');
  const orderRequestBtn = document.getElementById('order-request-btn');
  const cartTrap = createFocusTrap([cartDrawer]);

  function getCartTotals() {
    const totalCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { totalCount, subtotal };
  }

  function openCartDrawer() {
    if (!cartDrawer || !cartDrawerOverlay) return;
    const { totalCount, subtotal } = getCartTotals();
    cartDrawer.setAttribute(
      'aria-label',
      `Shopping Bag, ${totalCount} ${totalCount === 1 ? 'item' : 'items'}, ৳ ${subtotal.toLocaleString()}`
    );
    cartDrawerOverlay.classList.add('is-active');
    cartDrawer.classList.add('is-active');
    lockScroll('cart');
    pushOverlay('cart', closeCartDrawer);
    cartTrap.activate(cartDrawerClose);
  }

  function closeCartDrawer() {
    if (!cartDrawer || !cartDrawerOverlay) return;
    cartDrawerOverlay.classList.remove('is-active');
    cartDrawer.classList.remove('is-active');
    unlockScroll('cart');
    removeOverlay('cart');
    cartTrap.deactivate();
  }

  if (cartPillBtn) {
    cartPillBtn.addEventListener('click', (event) => {
      event.preventDefault();
      openCartDrawer();
    });
  }

  if (cartDrawerClose) {
    cartDrawerClose.addEventListener('click', closeCartDrawer);
  }

  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', closeCartDrawer);
  }

  function renderCart() {
    const { totalCount, subtotal } = getCartTotals();

    // Update Header Pill
    if (cartHeaderCount) {
      cartHeaderCount.textContent = `(${totalCount})`;
      cartHeaderCount.classList.remove('bounce');
      void cartHeaderCount.offsetWidth; // Trigger reflow
      cartHeaderCount.classList.add('bounce');
    }
    if (cartHeaderPrice) {
      cartHeaderPrice.textContent = `৳ ${subtotal.toLocaleString()}`;
    }
    if (cartPillBtn) {
      cartPillBtn.setAttribute(
        'aria-label',
        `Open Shopping Bag, ${totalCount} ${totalCount === 1 ? 'item' : 'items'}`
      );
    }

    // Update Drawer Subtotal
    if (drawerSubtotalEl) {
      drawerSubtotalEl.textContent = `৳ ${subtotal.toLocaleString()}`;
    }

    // Update Free Delivery Progress (goal: ৳2,500)
    if (shippingBarFill && shippingNote) {
      const remaining = cartState.freeShippingGoal - subtotal;
      const progressPercent = Math.min(100, (subtotal / cartState.freeShippingGoal) * 100);
      shippingBarFill.style.width = `${progressPercent}%`;

      if (remaining <= 0) {
        shippingNote.innerHTML = `<strong>Free delivery unlocked (over ৳ ${cartState.freeShippingGoal.toLocaleString()})</strong>`;
      } else {
        shippingNote.innerHTML = `Add <strong>৳ ${remaining.toLocaleString()}</strong> more for free delivery`;
      }
    }

    // Render Items
    if (!cartItemsList) return;
    if (cartState.items.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <span class="material-symbols-outlined cart-empty-icon">shopping_bag</span>
          <p class="cart-empty-title">Your Roastery Bag is Empty</p>
          <p class="cart-empty-text">Select freshly roasted single-origin lots and house blends from this week's roast.</p>
        </div>
      `;
      return;
    }

    cartItemsList.innerHTML = cartState.items
      .map((item) => {
        const key = cartKey(item);
        return `
      <div class="cart-item-row">
        <div class="cart-item-thumb">
          <span class="cart-thumb-weight">${item.size}</span>
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-spec">${item.size} &middot; ${item.grind}</div>
          <div class="cart-item-bottom">
            <div class="quantity-stepper cart-item-stepper">
              <button type="button" class="stepper-btn cart-dec-btn" data-key="${key}" aria-label="Decrease quantity of ${item.name}, ${item.size}, ${item.grind}">−</button>
              <span class="stepper-val">${item.quantity}</span>
              <button type="button" class="stepper-btn cart-inc-btn" data-key="${key}" aria-label="Increase quantity of ${item.name}, ${item.size}, ${item.grind}">+</button>
            </div>
            <div class="cart-item-price">৳ ${(item.price * item.quantity).toLocaleString()}</div>
          </div>
        </div>
      </div>
    `;
      })
      .join('');

    // Attach row stepper listeners
    cartItemsList.querySelectorAll('.cart-inc-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = cartState.items.find((i) => cartKey(i) === btn.dataset.key);
        if (item) {
          item.quantity += 1;
          renderCart();
        }
      });
    });

    cartItemsList.querySelectorAll('.cart-dec-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = cartState.items.findIndex((i) => cartKey(i) === btn.dataset.key);
        if (index !== -1) {
          if (cartState.items[index].quantity > 1) {
            cartState.items[index].quantity -= 1;
          } else {
            cartState.items.splice(index, 1);
            showToast('Item removed from bag', 'delete');
          }
          renderCart();
        }
      });
    });
  }

  function buildWhatsAppMessage() {
    const { subtotal } = getCartTotals();
    const lines = [
      "Hi Day Three — I'd like to order:",
      ""
    ];

    cartState.items.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      lines.push(`• ${item.name} — ${item.size}, ${item.grind} — ×${item.quantity} — ৳${itemTotal.toLocaleString()}`);
    });

    lines.push("");
    lines.push(`Subtotal: ৳${subtotal.toLocaleString()}`);
    if (subtotal >= cartState.freeShippingGoal) {
      lines.push(`Free delivery (over ৳${cartState.freeShippingGoal.toLocaleString()})`);
    } else {
      lines.push(`Delivery: standard courier in Dhaka (free over ৳${cartState.freeShippingGoal.toLocaleString()})`);
    }

    return lines.join("\n");
  }

  if (orderRequestBtn) {
    orderRequestBtn.addEventListener('click', () => {
      if (cartState.items.length === 0) {
        showToast('Your bag is currently empty', 'info');
        return;
      }
      const message = buildWhatsAppMessage();
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // Initial cart render
  renderCart();

  // ------------------------------------------------------------------------
  // 6. The Seven Lots Grid
  // ------------------------------------------------------------------------
  const LOTS = [
    {
      id: 'dhaka-daily',
      name: 'Dhaka Daily',
      category: 'Blend',
      origin: 'Ethiopia + Brazil',
      region: 'Guji & Cerrado Mineiro',
      process: 'Washed & Natural',
      altitude: '1,100 – 1,950 MASL',
      notes: ['Milk chocolate', 'Roasted hazelnut', 'Brown sugar'],
      price250: 995,
      price1000: 3400,
      roastDate: '21.10.2026',
      nextRoastDate: '28.10.2026',
      stock: true,
      image: 'assets/images/lot-dhaka-daily.jpg',
    },
    {
      id: 'espresso-no-1',
      name: 'Espresso No. 1',
      category: 'Blend',
      origin: 'Brazil + Colombia',
      region: 'Sul de Minas & Huila',
      process: 'Natural & Washed',
      altitude: '1,200 – 1,800 MASL',
      notes: ['Dark cocoa', 'Caramelized toffee', 'Orange zest'],
      price250: 1050,
      price1000: 3400,
      roastDate: '21.10.2026',
      nextRoastDate: '28.10.2026',
      stock: true,
      image: 'assets/images/lot-espresso-no-1.jpg',
    },
    {
      id: 'uraga-natural',
      name: 'Uraga Natural',
      category: 'Single',
      origin: 'Guji, Ethiopia',
      region: 'Uraga, Guji Zone',
      process: 'Natural',
      altitude: '2,100 – 2,300 MASL',
      notes: ['Blueberry jam', 'Wildflower honey', 'Bergamot'],
      price250: 1295,
      price1000: 4100,
      roastDate: '21.10.2026',
      nextRoastDate: '28.10.2026',
      stock: true,
      image: 'assets/images/lot-uraga-natural.jpg',
    },
    {
      id: 'las-nubes',
      name: 'Las Nubes',
      category: 'Single',
      origin: 'Matagalpa, Nicaragua',
      region: 'Finca Las Nubes',
      process: 'Washed',
      altitude: '1,350 – 1,500 MASL',
      notes: ['Red apple', 'Pecan praline', 'Cane sugar'],
      price250: 1195,
      price1000: 4100,
      roastDate: '21.10.2026',
      nextRoastDate: '28.10.2026',
      stock: true,
      image: 'assets/images/lot-las-nubes.jpg',
    },
    {
      id: 'el-bosque',
      name: 'El Bosque',
      category: 'Single',
      origin: 'San Ignacio, Peru',
      region: 'Cajamarca, San Ignacio',
      process: 'Washed',
      altitude: '1,750 – 1,900 MASL',
      notes: ['Jasmine', 'Yellow peach', 'Lime zest'],
      price250: 1250,
      price1000: 4100,
      roastDate: '21.10.2026',
      nextRoastDate: '28.10.2026',
      stock: true,
      image: 'assets/images/lot-el-bosque.jpg',
    },
    {
      id: 'mogiana',
      name: 'Mogiana',
      category: 'Single',
      origin: 'Mogiana, Brazil',
      region: 'Alta Mogiana',
      process: 'Pulped natural',
      altitude: '1,050 – 1,250 MASL',
      notes: ['Roasted almond', 'Dark chocolate', 'Dried fig'],
      price250: 1195,
      price1000: 4100,
      roastDate: '21.10.2026',
      nextRoastDate: '28.10.2026',
      stock: true,
      image: 'assets/images/lot-mogiana.jpg',
    },
    {
      id: 'worka-anaerobic',
      name: 'Worka Anaerobic',
      category: 'Seasonal',
      origin: 'Worka, Ethiopia',
      region: 'Gedeb, Yirgacheffe',
      process: 'Anaerobic',
      altitude: '2,000 – 2,200 MASL',
      notes: ['Strawberry wine', 'Passion fruit', 'Cacao nibs'],
      price250: 1750,
      price1000: 5200,
      roastDate: '21.10.2026',
      nextRoastDate: '28.10.2026',
      stock: true,
      image: 'assets/images/lot-worka-anaerobic.jpg',
    },
  ];

  const lotsGrid = document.getElementById('lots-grid') || document.querySelector('.products-grid');

  function renderLots() {
    if (!lotsGrid) return;

    lotsGrid.innerHTML = LOTS.map((lot, index) => {
      const isSoldOut = !lot.stock;
      return `
        <article class="lot-card ${isSoldOut ? 'is-soldout' : ''}" data-lot-id="${lot.id}" data-scroll-reveal data-stagger="${(index % 4) + 1}">
          <div class="lot-card-inner">
            ${lot.image ? `
              <figure class="lot-media">
                <img src="${lot.image}" alt="${lot.name} — ${lot.origin} coffee" width="1200" height="1500" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async">
              </figure>
            ` : ''}

            <div class="lot-date-row">
              <div class="lot-roast-badge">
                <span class="material-symbols-outlined lot-calendar-icon" aria-hidden="true">calendar_today</span>
                <span class="lot-roast-text">Roasted ${lot.roastDate}</span>
              </div>
              ${isSoldOut ? `<span class="lot-category-chip">Sold Out</span>` : `<span class="lot-category-chip">${lot.category}</span>`}
            </div>

            ${isSoldOut && lot.nextRoastDate ? `
              <div class="lot-next-roast-banner">
                <span class="material-symbols-outlined icon-sm" aria-hidden="true">event_repeat</span>
                <span>Next roast: ${lot.nextRoastDate}</span>
              </div>
            ` : ''}

            <h3 class="product-name lot-name">${lot.name}</h3>

            <div class="lot-meta-row">
              <span class="lot-meta-item">${lot.origin}</span>
              <span class="lot-meta-sep" aria-hidden="true">&middot;</span>
              <span class="lot-meta-item">${lot.process ? lot.process : 'House Blend'}</span>
              <span class="lot-meta-sep" aria-hidden="true">&middot;</span>
              <span class="lot-meta-item">${lot.altitude}</span>
            </div>

            <ul class="product-notes" aria-label="Tasting notes for ${lot.name}">
              ${lot.notes.map((note) => `<li>${note}</li>`).join('')}
            </ul>

            <div class="lot-purchase-header ${isSoldOut ? 'is-disabled' : ''}">
              <div class="lot-size-toggle" role="group" aria-label="Choose bag size for ${lot.name}">
                <button type="button" class="lot-size-btn is-active" data-size="250g" ${isSoldOut ? 'disabled' : ''} aria-pressed="true">250g</button>
                <button type="button" class="lot-size-btn" data-size="1kg" ${isSoldOut ? 'disabled' : ''} aria-pressed="false">1kg</button>
              </div>

              <div class="lot-price-row">
                <span class="product-price lot-price" data-price-250="${lot.price250}" data-price-1000="${lot.price1000}">৳ ${lot.price250.toLocaleString()}</span>
                <span class="product-unit lot-unit">/ 250g bag</span>
              </div>
            </div>

            <div class="grind-select-group ${isSoldOut ? 'is-disabled' : ''}">
              <label class="grind-label" for="grind-${lot.id}">Grind</label>
              <div class="select-wrapper">
                <select class="grind-select" id="grind-${lot.id}" ${isSoldOut ? 'disabled' : ''}>
                  <option value="whole bean">Whole bean (Recommended)</option>
                  <option value="V60 grind">V60 filter grind</option>
                  <option value="Espresso grind">Espresso / Moka grind</option>
                  <option value="French press grind">French press grind</option>
                </select>
                <span class="material-symbols-outlined select-chevron" aria-hidden="true">expand_more</span>
              </div>
            </div>
          </div>

          <div class="product-actions-block buy-block">
            ${isSoldOut ? `
              <button type="button" class="btn-waitlist" disabled>
                <span class="material-symbols-outlined icon-sm">event_busy</span>
                <span>Sold Out &middot; Next Roast ${lot.nextRoastDate || 'Tuesday'}</span>
              </button>
            ` : `
              <div class="product-buy-row">
                <div class="qty-field">
                  <label class="quantity-label" for="qty-${lot.id}">Qty</label>
                  <div class="qty-control">
                    <button type="button" class="qty-step qty-dec" data-lot-id="${lot.id}" aria-label="Decrease quantity of ${lot.name}">−</button>
                    <input type="number" class="qty-input" id="qty-${lot.id}" value="1" min="1" max="999" step="1" inputmode="numeric" aria-label="Quantity of ${lot.name}">
                    <button type="button" class="qty-step qty-inc" data-lot-id="${lot.id}" aria-label="Increase quantity of ${lot.name}">+</button>
                  </div>
                </div>

                <button type="button" class="btn-add-bag lot-add-btn" data-lot-id="${lot.id}">
                  <span class="material-symbols-outlined icon-sm">shopping_bag</span>
                  <span>Add to Bag</span>
                </button>
              </div>
            `}
          </div>
        </article>
      `;
    }).join('');

    // Observe newly rendered cards for scroll reveals
    lotsGrid.querySelectorAll('.lot-card').forEach((card) => observeReveal(card));

    // Attach card event listeners
    attachLotCardListeners();
  }

  function clampQuantity(value) {
    const parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed)) return 1;
    return Math.min(999, Math.max(1, parsed));
  }

  function attachLotCardListeners() {
    if (!lotsGrid) return;

    lotsGrid.querySelectorAll('.lot-card').forEach((card) => {
      const sizeBtns = card.querySelectorAll('.lot-size-btn');
      const priceEl = card.querySelector('.lot-price');
      const unitEl = card.querySelector('.lot-unit');

      // Size toggle: 250g vs 1kg
      sizeBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          sizeBtns.forEach((b) => {
            b.classList.remove('is-active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('is-active');
          btn.setAttribute('aria-pressed', 'true');

          const size = btn.dataset.size;
          if (priceEl && unitEl) {
            if (size === '1kg') {
              const p1000 = parseInt(priceEl.getAttribute('data-price-1000'), 10);
              priceEl.textContent = `৳ ${p1000.toLocaleString()}`;
              unitEl.textContent = '/ 1kg bag';
            } else {
              const p250 = parseInt(priceEl.getAttribute('data-price-250'), 10);
              priceEl.textContent = `৳ ${p250.toLocaleString()}`;
              unitEl.textContent = '/ 250g bag';
            }
          }
        });
      });

      // Stepper: + / - controls and direct entry
      const qtyInput = card.querySelector('.qty-input');
      const decBtn = card.querySelector('.qty-dec');
      const incBtn = card.querySelector('.qty-inc');

      if (qtyInput) {
        qtyInput.addEventListener('change', () => {
          qtyInput.value = String(clampQuantity(qtyInput.value));
        });
        qtyInput.addEventListener('blur', () => {
          qtyInput.value = String(clampQuantity(qtyInput.value));
        });
        qtyInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            qtyInput.value = String(clampQuantity(qtyInput.value));
          }
        });
      }

      if (decBtn && qtyInput) {
        decBtn.addEventListener('click', () => {
          const current = clampQuantity(qtyInput.value);
          qtyInput.value = String(Math.max(1, current - 1));
        });
      }

      if (incBtn && qtyInput) {
        incBtn.addEventListener('click', () => {
          const current = clampQuantity(qtyInput.value);
          qtyInput.value = String(Math.min(999, current + 1));
        });
      }

      // Add to bag button
      const addBtn = card.querySelector('.lot-add-btn');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          const lotId = addBtn.dataset.lotId;
          const lot = LOTS.find((l) => l.id === lotId);
          if (!lot) return;

          const activeSizeBtn = card.querySelector('.lot-size-btn.is-active');
          const size = activeSizeBtn ? activeSizeBtn.dataset.size : '250g';
          const price = size === '1kg' ? lot.price1000 : lot.price250;
          const grindEl = card.querySelector('.grind-select');
          const grind = grindEl ? grindEl.value : 'whole bean';
          const qty = qtyInput ? clampQuantity(qtyInput.value) : 1;

          const item = {
            id: lot.id,
            name: lot.name,
            size,
            grind,
            price,
            quantity: qty,
          };

          const existingItem = cartState.items.find((i) => cartKey(i) === cartKey(item));
          if (existingItem) {
            existingItem.quantity += qty;
          } else {
            cartState.items.push(item);
          }

          // Button feedback: swap label and revert after 2s
          const origLabel = addBtn.innerHTML;
          addBtn.innerHTML = `<span class="material-symbols-outlined icon-sm">check</span> Added ${qty} to Bag`;
          addBtn.classList.add('is-success');

          renderCart();
          openCartDrawer();

          if (qtyInput) qtyInput.value = '1';

          setTimeout(() => {
            addBtn.innerHTML = origLabel;
            addBtn.classList.remove('is-success');
          }, 2000);
        });
      }
    });
  }

  // ------------------------------------------------------------------------
  // 6b. Lots Carousel Controller
  // ------------------------------------------------------------------------
  function initLotsCarousel() {
    const prevBtn = document.getElementById('lots-prev');
    const nextBtn = document.getElementById('lots-next');
    const indicator = document.getElementById('lots-indicator');
    const track = document.getElementById('lots-grid') || document.querySelector('.products-grid');

    if (!track) return;

    function getCardStride() {
      const card = track.querySelector('.lot-card');
      if (!card) return 380;
      const cardWidth = card.getBoundingClientRect().width;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap) || 28;
      return cardWidth + gap;
    }

    function updateCarouselState() {
      const stride = getCardStride();
      const scrollLeft = track.scrollLeft;
      const maxScroll = track.scrollWidth - track.clientWidth;
      
      const cards = track.querySelectorAll('.lot-card');
      const totalCards = cards.length;
      if (totalCards === 0) return;

      const currentIndex = Math.min(totalCards, Math.max(1, Math.round(scrollLeft / stride) + 1));

      if (indicator) {
        const paddedCurrent = String(currentIndex).padStart(2, '0');
        const paddedTotal = String(totalCards).padStart(2, '0');
        indicator.textContent = `${paddedCurrent} / ${paddedTotal}`;
      }

      if (prevBtn) {
        const atStart = scrollLeft <= 4;
        prevBtn.disabled = atStart;
        prevBtn.setAttribute('aria-disabled', String(atStart));
      }

      if (nextBtn) {
        const atEnd = scrollLeft >= maxScroll - 6;
        nextBtn.disabled = atEnd;
        nextBtn.setAttribute('aria-disabled', String(atEnd));
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const stride = getCardStride();
        track.scrollBy({ left: -stride, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const stride = getCardStride();
        track.scrollBy({ left: stride, behavior: 'smooth' });
      });
    }

    let scrollRaf = null;
    track.addEventListener('scroll', () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(updateCarouselState);
    }, { passive: true });

    window.addEventListener('resize', () => {
      updateCarouselState();
    });

    updateCarouselState();
  }

  // Initial lot render & carousel initialization
  renderLots();
  initLotsCarousel();

  // ------------------------------------------------------------------------
  // 7. Ambient Hero Video Engine
  // ------------------------------------------------------------------------
  const heroBgVideo = document.getElementById('hero-bg-video');
  let heroVideoInView = true;

  function heroVideoShouldPlay() {
    return (
      !prefersReducedMotion() &&
      heroVideoInView &&
      !document.hidden
    );
  }

  function syncHeroVideoPlayback() {
    if (!heroBgVideo) return;
    if (heroVideoShouldPlay()) {
      heroBgVideo.play().catch(() => {});
    } else {
      heroBgVideo.pause();
    }
  }

  // Autoplay can be deferred by the browser (low-power mode, data saver, or a
  // blocked policy). Retry when the file is ready and on the first gesture.
  if (heroBgVideo) {
    heroBgVideo.addEventListener('canplay', syncHeroVideoPlayback);
    const resumeAmbientFilm = () => syncHeroVideoPlayback();
    window.addEventListener('pointerdown', resumeAmbientFilm, { once: true, passive: true });
    window.addEventListener('keydown', resumeAmbientFilm, { once: true });
  }

  // Stop the ambient loop when it scrolls out of view (saves battery/CPU).
  if (heroBgVideo && 'IntersectionObserver' in window) {
    const heroVideoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          heroVideoInView = entry.isIntersecting;
          syncHeroVideoPlayback();
        });
      },
      { threshold: 0.15 }
    );
    heroVideoObserver.observe(heroBgVideo);
  }

  reduceMotionQuery.addEventListener('change', syncHeroVideoPlayback);
  document.addEventListener('visibilitychange', syncHeroVideoPlayback);

  // Reduced motion: never autoplay the ambient loop.
  if (heroBgVideo && prefersReducedMotion()) {
    heroBgVideo.removeAttribute('autoplay');
    heroBgVideo.pause();
  }

  // ------------------------------------------------------------------------
  // 8. Newsletter Form
  // ------------------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      if (input && input.value) {
        showToast('Subscribed to Tuesday Roast Dispatches', 'verified');
        input.value = '';
      }
    });
  }

});
