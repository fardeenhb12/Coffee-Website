/**
 * AROMA COFFEE CO. — PRODUCTION CLIENT INTERACTION ENGINE
 * Implements exact scroll dynamics, micro-interactions, cart drawer,
 * video lightbox, and cart logic.
 */

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

  if (prefersReducedMotion()) {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
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
    freeShippingGoal: 3000,
  };

  // A row is identified by coffee + grind, so two grinds of the same lot
  // never mutate each other's stepper.
  function cartKey(item) {
    return `${item.id}::${item.calibration}`;
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
  const cartFooter = document.querySelector('.cart-drawer-footer');
  const cartTrap = createFocusTrap([cartDrawer]);
  const cartFooterMarkup = cartFooter ? cartFooter.innerHTML : '';

  function getCartTotals() {
    const totalCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { totalCount, subtotal };
  }

  function openCartDrawer() {
    if (!cartDrawer || !cartDrawerOverlay) return;
    restoreCartFooter();
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

  // The footer is replaced wholesale by the checkout stages, so its inner
  // nodes must be re-queried after every restore.
  function restoreCartFooter() {
    if (!cartFooter) return;
    cartFooter.innerHTML = cartFooterMarkup;
    renderCart();
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

    // Update Drawer Subtotal (re-queried: the footer is rebuilt on checkout)
    const drawerSubtotalEl = document.getElementById('cart-drawer-subtotal');
    if (drawerSubtotalEl) {
      drawerSubtotalEl.textContent = `৳ ${subtotal.toLocaleString()}`;
    }

    // Update Shipping Progress
    if (shippingBarFill && shippingNote) {
      const remaining = cartState.freeShippingGoal - subtotal;
      const progressPercent = Math.min(100, (subtotal / cartState.freeShippingGoal) * 100);
      shippingBarFill.style.width = `${progressPercent}%`;

      if (remaining <= 0) {
        shippingNote.innerHTML = `<strong>Complimentary Nationwide Shipping Unlocked!</strong>`;
      } else {
        shippingNote.innerHTML = `Add <strong>৳ ${remaining.toLocaleString()}</strong> more to unlock Free Nationwide Dispatch`;
      }
    }

    // Render Items
    if (!cartItemsList) return;
    if (cartState.items.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <span class="material-symbols-outlined cart-empty-icon">shopping_bag</span>
          <p class="cart-empty-title">Your Roastery Bag is Empty</p>
          <p class="cart-empty-text">Discover our single-origin micro-lots roasted in Banani.</p>
        </div>
      `;
      return;
    }

    cartItemsList.innerHTML = cartState.items
      .map((item) => {
        const key = cartKey(item);
        return `
      <div class="cart-item-row">
        <div class="cart-item-thumb" style="background-image: url('${item.image}');"></div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-calib">${item.calibration}</div>
          <div class="cart-item-bottom">
            <div class="quantity-stepper cart-item-stepper">
              <button type="button" class="stepper-btn cart-dec-btn" data-key="${key}" aria-label="Decrease quantity of ${item.name}, ${item.calibration}">−</button>
              <span class="stepper-val">${item.quantity}</span>
              <button type="button" class="stepper-btn cart-inc-btn" data-key="${key}" aria-label="Increase quantity of ${item.name}, ${item.calibration}">+</button>
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

  // Checkout: staged in-drawer confirmation instead of window.alert()
  function renderCheckoutConfirm() {
    if (!cartFooter) return;
    const { subtotal } = getCartTotals();
    cartFooter.innerHTML = `
      <div class="cart-confirm-panel">
        <div class="cart-confirm-head">
          <span class="material-symbols-outlined">local_shipping</span>
          <span>Confirm Express Dispatch</span>
        </div>
        <p>Same-day rider dispatch across Banani, Gulshan, and Dhaka metropolitan. Orders confirmed before 2 PM leave the roastery the same afternoon.</p>
        <div class="cart-confirm-total">
          <span>Total due</span>
          <strong>৳ ${subtotal.toLocaleString()}</strong>
        </div>
        <button type="button" class="btn-checkout" id="checkout-confirm-btn">
          <span class="material-symbols-outlined icon-sm">lock</span>
          <span>Confirm Order</span>
        </button>
        <button type="button" class="btn-checkout-secondary" id="checkout-back-btn">Back to Bag</button>
      </div>
    `;
    const confirmBtn = document.getElementById('checkout-confirm-btn');
    if (confirmBtn) confirmBtn.focus();
  }

  function renderCheckoutDone() {
    if (!cartFooter) return;
    const { subtotal } = getCartTotals();
    const ticket = `AR-${String(Date.now()).slice(-6)}`;
    cartFooter.innerHTML = `
      <div class="cart-confirm-done">
        <span class="material-symbols-outlined">task_alt</span>
        <h4>Order Confirmed</h4>
        <p>Dispatch ticket <strong>${ticket}</strong> for ৳ ${subtotal.toLocaleString()} is with our Banani rider. A confirmation has been logged for the concierge team.</p>
        <button type="button" class="btn-checkout" id="checkout-done-btn">
          <span>Continue Browsing</span>
        </button>
      </div>
    `;
    cartState.items = [];
    renderCart();
    const doneBtn = document.getElementById('checkout-done-btn');
    if (doneBtn) doneBtn.focus();
  }

  if (cartFooter) {
    // Delegated so the handlers survive the innerHTML swaps above.
    cartFooter.addEventListener('click', (event) => {
      const btn = event.target.closest('button');
      if (!btn) return;

      if (btn.id === 'checkout-btn') {
        if (cartState.items.length === 0) {
          showToast('Your bag is currently empty', 'info');
          return;
        }
        renderCheckoutConfirm();
      } else if (btn.id === 'checkout-confirm-btn') {
        renderCheckoutDone();
        showToast('Order confirmed — rider dispatch scheduled', 'task_alt');
      } else if (btn.id === 'checkout-back-btn') {
        restoreCartFooter();
        const restored = document.getElementById('checkout-btn');
        if (restored) restored.focus();
      } else if (btn.id === 'checkout-done-btn') {
        closeCartDrawer();
      }
    });
  }

  // Initial cart render
  renderCart();

  // ------------------------------------------------------------------------
  // 6. Product Quantity, Add to Bag & Waitlist
  // ------------------------------------------------------------------------
  const qtyInput = document.getElementById('qty-input');
  const qtyInc = document.getElementById('qty-inc');
  const qtyDec = document.getElementById('qty-dec');
  const grindSelect = document.getElementById('grind-type');
  const addToBagBtn = document.getElementById('add-nicaragua-cart');
  const addToBagLabel = addToBagBtn ? addToBagBtn.innerHTML : '';
  const QTY_MAX = 999;

  function clampQuantity(value) {
    const parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed)) return 1;
    return Math.min(QTY_MAX, Math.max(1, parsed));
  }

  function setQuantity(value) {
    if (qtyInput) qtyInput.value = String(clampQuantity(value));
  }

  function currentQuantity() {
    return qtyInput ? clampQuantity(qtyInput.value) : 1;
  }

  if (qtyInput) {
    qtyInput.addEventListener('change', () => setQuantity(qtyInput.value));
    qtyInput.addEventListener('blur', () => setQuantity(qtyInput.value));
    qtyInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        setQuantity(qtyInput.value);
      }
    });
  }

  if (qtyInc) {
    qtyInc.addEventListener('click', () => setQuantity(currentQuantity() + 1));
  }

  if (qtyDec) {
    qtyDec.addEventListener('click', () => setQuantity(currentQuantity() - 1));
  }

  const NICARAGUA_LOT = {
    id: 'nicaragua-single-estate',
    name: 'Missionary Grown',
    origin: 'Matagalpa, Nicaragua',
    price: 1650,
    image: 'assets/images/lot-nicaragua.jpg',
  };

  if (addToBagBtn) {
    addToBagBtn.addEventListener('click', () => {
      const quantity = currentQuantity();
      const selectedGrind = grindSelect
        ? grindSelect.options[grindSelect.selectedIndex].text
        : 'Whole Bean';

      const item = { ...NICARAGUA_LOT, calibration: selectedGrind, quantity };
      const existingItem = cartState.items.find((i) => cartKey(i) === cartKey(item));

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cartState.items.push(item);
      }

      // Button feedback. The resting label is captured once at load so rapid
      // clicks cannot save the "Added" state as the label to restore.
      addToBagBtn.innerHTML = `<span class="material-symbols-outlined icon-sm">check</span> Added ${quantity} to Bag`;
      addToBagBtn.classList.add('is-success');

      renderCart();

      // Open the bag immediately so the next step never requires a scroll
      // back to the header pill. The drawer label announces the new total,
      // which replaces the toast this flow used to show over the checkout
      // button.
      openCartDrawer();

      setQuantity(1);

      setTimeout(() => {
        addToBagBtn.innerHTML = addToBagLabel;
        addToBagBtn.classList.remove('is-success');
      }, 2000);
    });
  }

  // Sold-out lots: send the visitor to the concierge form, pre-filled.
  const waitlistBtns = document.querySelectorAll('.btn-waitlist');

  waitlistBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lot = btn.dataset.lot || 'the next harvest';
      const origin = btn.dataset.origin || 'our partner farms';
      const contactSec = document.getElementById('contact-section');
      const inquirySelect = document.getElementById('inquiry-type');
      const messageField = document.getElementById('message');
      const firstName = document.getElementById('first-name');

      if (inquirySelect) inquirySelect.value = 'waitlist';
      if (messageField) {
        messageField.value = `Please add me to the waitlist for ${lot} from ${origin}. Notify me when the next harvest lands in Banani.`;
      }

      if (contactSec) {
        contactSec.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'start',
        });
      }

      showToast(`Waitlist request prepared for ${lot}`, 'notifications');
      window.setTimeout(() => {
        if (firstName) firstName.focus({ preventScroll: true });
      }, prefersReducedMotion() ? 0 : 600);
    });
  });

  // ------------------------------------------------------------------------
  // 7. Documentary Video Lightbox Modal & Ambient Hero Video
  // ------------------------------------------------------------------------
  const videoModalBackdrop = document.getElementById('video-modal-backdrop');
  const videoModalClose = document.getElementById('video-modal-close');
  const playHeroSecondaryBtn = document.getElementById('hero-play-secondary-btn');
  const videoSimulation = document.getElementById('video-simulation');
  const heroBgVideo = document.getElementById('hero-bg-video');
  const videoModalTrap = createFocusTrap([videoModalBackdrop]);

  let heroVideoInView = true;

  function heroVideoShouldPlay() {
    return (
      !prefersReducedMotion() &&
      heroVideoInView &&
      !document.hidden &&
      !(videoModalBackdrop && videoModalBackdrop.classList.contains('is-active'))
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

  function openVideoModal() {
    if (!videoModalBackdrop) return;
    if (heroBgVideo) {
      heroBgVideo.pause();
    }
    videoModalBackdrop.classList.add('is-active');
    lockScroll('video-modal');
    pushOverlay('video-modal', closeVideoModal);
    videoModalTrap.activate(videoModalClose);
    if (videoSimulation) {
      videoSimulation.currentTime = 0;
      videoSimulation.muted = false;
      videoSimulation.play().catch(() => {});
    }
  }

  function closeVideoModal() {
    if (!videoModalBackdrop) return;
    videoModalBackdrop.classList.remove('is-active');
    unlockScroll('video-modal');
    removeOverlay('video-modal');
    videoModalTrap.deactivate();
    if (videoSimulation) {
      videoSimulation.pause();
    }
    syncHeroVideoPlayback();
  }

  if (playHeroSecondaryBtn) playHeroSecondaryBtn.addEventListener('click', openVideoModal);
  if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);

  if (videoModalBackdrop) {
    videoModalBackdrop.addEventListener('click', (event) => {
      if (event.target === videoModalBackdrop) {
        closeVideoModal();
      }
    });
  }

  // Reduced motion: never autoplay the ambient loop.
  if (heroBgVideo && prefersReducedMotion()) {
    heroBgVideo.removeAttribute('autoplay');
    heroBgVideo.pause();
  }

  // ------------------------------------------------------------------------
  // 8. Roastery Consultation Request Form
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('concierge-contact-form');
  const formFeedback = document.getElementById('form-feedback-alert');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm && formFeedback && formSubmitBtn) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // Reset any previous confirmation before the new request goes out.
      formFeedback.classList.remove('show');

      const origText = formSubmitBtn.innerHTML;
      formSubmitBtn.innerHTML = `
        <span class="material-symbols-outlined icon-pulse">autorenew</span>
        Dispatching...
      `;
      formSubmitBtn.disabled = true;

      setTimeout(() => {
        formFeedback.classList.add('show');
        formSubmitBtn.innerHTML = origText;
        formSubmitBtn.disabled = false;
        contactForm.reset();

        showToast('Consultation request dispatched to Banani Lab', 'mark_email_read');

        setTimeout(() => {
          formFeedback.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'nearest',
          });
        }, 100);
      }, 1200);
    });
  }

  // ------------------------------------------------------------------------
  // 9. Newsletter Form
  // ------------------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      if (input && input.value) {
        showToast('Subscribed to Banani Roast Dispatches', 'verified');
        input.value = '';
      }
    });
  }

  // ------------------------------------------------------------------------
  // 10. Cupping Table Booking Button
  // ------------------------------------------------------------------------
  const bookTableBtn = document.getElementById('btn-book-table');
  if (bookTableBtn) {
    bookTableBtn.addEventListener('click', () => {
      const contactSec = document.getElementById('contact-section');
      if (contactSec) {
        contactSec.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
        const inquirySelect = document.getElementById('inquiry-type');
        if (inquirySelect) {
          inquirySelect.value = 'cupping';
        }
        showToast('Selected "Private Cupping Session" in Concierge form', 'event');
      }
    });
  }

});
