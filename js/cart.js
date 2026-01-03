/* Cart module - localStorage based cart management */
const CART_KEY = 'babyclouser_cart';

(function (window, document) {
  'use strict';

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to read cart', e);
      return [];
    }
  }

  function writeCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      dispatchUpdate();
    } catch (e) {
      console.error('Failed to write cart', e);
    }
  }

  function getCart() {
    return readCart();
  }

  function clearCart() {
    localStorage.removeItem(CART_KEY);
    dispatchUpdate();
  }

  function findIndex(cart, id) {
    return cart.findIndex(i => String(i.id) === String(id));
  }

  function addToCart(product) {
    const cart = readCart();
    const idx = findIndex(cart, product.id);
    if (idx > -1) {
      cart[idx].quantity = (Number(cart[idx].quantity) || 0) + (Number(product.quantity) || 1);
    } else {
      cart.push({
        id: String(product.id),
        name: product.name,
        price: Number(product.price) || 0,
        quantity: Number(product.quantity) || 1,
        image: product.image || ''
      });
    }
    writeCart(cart);
    // Open sidebar to show added item
    try { document.body.classList.add('cart-sidebar-open'); } catch (e) {}
  }

  function removeFromCart(productId) {
    const cart = readCart().filter(i => String(i.id) !== String(productId));
    writeCart(cart);
  }

  function updateQuantity(productId, quantity) {
    const cart = readCart();
    const idx = findIndex(cart, productId);
    if (idx > -1) {
      cart[idx].quantity = Number(quantity) || 0;
      if (cart[idx].quantity <= 0) cart.splice(idx, 1);
      writeCart(cart);
    }
  }

  function getCartCount() {
    return readCart().reduce((s, i) => s + (Number(i.quantity) || 0), 0);
  }

  function getCartTotal() {
    return readCart().reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0);
  }

  function calculateDelivery(total) {
    return total < 3000 ? 270 : 0;
  }

  /* UI helpers */
  function dispatchUpdate() {
    const ev = new CustomEvent('cart.updated', { detail: { count: getCartCount(), total: getCartTotal() } });
    document.dispatchEvent(ev);
    renderCartCount();
    renderCartSidebar();
    renderCartPage();
  }

  function renderCartCount() {
    const els = document.querySelectorAll('.cart-count');
    els.forEach(el => { el.textContent = getCartCount(); });
  }

  function formatCurrency(v) { return '₹' + (Number(v) || 0).toLocaleString('en-IN'); }

  function renderCartSidebar() {
    const container = document.querySelector('.cart-sidebar-items');
    if (!container) return;
    const cart = readCart();
    container.innerHTML = '';
    if (!cart.length) {
      container.innerHTML = '<p class="empty">Your cart is empty</p>';
      document.querySelectorAll('.cart-sidebar-subtotal, .cart-sidebar-delivery, .cart-sidebar-grand').forEach(el => el.textContent = formatCurrency(0));
      return;
    }
    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-sidebar-item';
      row.innerHTML = `
        <div class="item-img"><img src="${item.image}" alt="${item.name}"></div>
        <div class="item-body">
          <div class="item-name">${item.name}</div>
          <div class="item-meta">${formatCurrency(item.price)} x <span class="qty">${item.quantity}</span></div>
        </div>
        <div class="item-actions">
          <button class="btn-theme qty-decrease" data-id="${item.id}">-</button>
          <button class="btn-theme qty-increase" data-id="${item.id}">+</button>
          <button class="btn-theme del-btn-bg remove-item" data-id="${item.id}"><i class="fa fa-trash"></i></button>
        </div>
      `;
      container.appendChild(row);
    });
    const subtotal = getCartTotal();
    const delivery = calculateDelivery(subtotal);
    document.querySelector('.cart-sidebar-subtotal').textContent = formatCurrency(subtotal);
    document.querySelector('.cart-sidebar-delivery').textContent = formatCurrency(delivery);
    document.querySelector('.cart-sidebar-grand').textContent = formatCurrency(subtotal + delivery);
  }

  function renderCartPage() {
    const table = document.querySelector('.cart-items');
    if (!table) return;
    const cart = readCart();
    table.innerHTML = '';
    if (!cart.length) {
      table.innerHTML = '<tr><td colspan="6" class="text-center">Your cart is empty</td></tr>';
      document.querySelectorAll('.cart-summary .cart-content p span, .cart-summary .cart-content h4 span').forEach(el => el.textContent = '₹0');
      return;
    }
    cart.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><a href="#"><img src="${item.image}" alt="${item.name}" style="max-width:80px"></a></td>
        <td><a href="#">${item.name}</a></td>
        <td>${formatCurrency(item.price)}</td>
        <td>
          <div class="qty">
            <button class="btn-minus" data-id="${item.id}">-</button>
            <input type="text" value="${item.quantity}" data-id="${item.id}" class="qty-input">
            <button class="btn-plus" data-id="${item.id}">+</button>
          </div>
        </td>
        <td class="item-total">${formatCurrency(item.price * item.quantity)}</td>
        <td><button class="remove-item" data-id="${item.id}"><i class="fa fa-trash"></i></button></td>
      `;
      table.appendChild(tr);
    });
    const subtotal = getCartTotal();
    const delivery = calculateDelivery(subtotal);
    const subEl = document.querySelector('.cart-summary .cart-content p span');
    if (subEl) subEl.textContent = formatCurrency(subtotal);
    const shipEl = document.querySelector('.cart-summary .cart-content p + p span');
    if (shipEl) shipEl.textContent = formatCurrency(delivery);
    const grandEl = document.querySelector('.cart-summary .cart-content h4 span');
    if (grandEl) grandEl.textContent = formatCurrency(subtotal + delivery);
  }

  /* Event handlers */
  document.addEventListener('click', function (e) {
    const a = e.target.closest('.add-to-cart');
    if (a) {
      e.preventDefault();
      const dataset = a.dataset || {};

      // determine quantity: dataset -> nearby qty input -> default 1
      let quantity = Number(dataset.quantity || dataset.qty) || 0;
      if (!quantity) {
        const ctxQty = a.closest('.product-detail') || a.closest('.product-item') || a.closest('.product-image') || document;
        const qtyInput = ctxQty.querySelector('.quantity .qty input, .qty input');
        if (qtyInput) quantity = Number(qtyInput.value) || 1;
      }
      if (!quantity) quantity = 1;

      // gather product data from dataset or fall back to DOM
      const ctx = a.closest('.product-item') || a.closest('.product-detail') || a.closest('.product-image') || document;
      const name = dataset.name || (ctx.querySelector('.title a') ? ctx.querySelector('.title a').textContent.trim() : (ctx.querySelector('.title') ? ctx.querySelector('.title').textContent.trim() : 'Product'));
      const priceText = dataset.price || (ctx.querySelector('.price') ? ctx.querySelector('.price').textContent : '0');
      const priceMatch = String(priceText).match(/[\d,]+/);
      const price = Number((priceMatch && priceMatch[0].replace(/,/g, '')) || dataset.price || 0);
      const image = dataset.image || (ctx.querySelector('img') ? ctx.querySelector('img').getAttribute('src') : '');

      const id = dataset.id || dataset.productId || ('p_' + Date.now());

      addToCart({ id, name, price, image, quantity });
      return;
    }

    const inc = e.target.closest('.btn-plus, .qty-increase');
    if (inc) {
      const id = inc.dataset.id;
      const cart = readCart();
      const i = cart.find(x => String(x.id) === String(id));
      if (i) updateQuantity(id, Number(i.quantity) + 1);
      return;
    }

    const dec = e.target.closest('.btn-minus, .qty-decrease');
    if (dec) {
      const id = dec.dataset.id;
      const cart = readCart();
      const i = cart.find(x => String(x.id) === String(id));
      if (i) updateQuantity(id, Number(i.quantity) - 1);
      return;
    }

    const rem = e.target.closest('.remove-item');
    if (rem) {
      const id = rem.dataset.id;
      removeFromCart(id);
      return;
    }
  });

  // handle manual quantity inputs on cart page
  document.addEventListener('change', function (e) {
    if (e.target.classList.contains('qty-input')) {
      const id = e.target.dataset.id;
      const val = Number(e.target.value) || 0;
      updateQuantity(id, val);
    }
  });

  // show/hide sidebar
  document.addEventListener('click', function (e) {
    const open = e.target.closest('.cart-icon');
    if (open) {
      e.preventDefault();
      document.body.classList.add('cart-sidebar-open');
      return;
    }
    const close = e.target.closest('.cart-sidebar-close') || e.target.closest('.cart-sidebar-overlay');
    if (close) {
      document.body.classList.remove('cart-sidebar-open');
      return;
    }

    // handle checkout button click from cart page
    const checkoutBtn = e.target.closest('.cart-btn button:last-child');
    if (checkoutBtn && checkoutBtn.textContent.trim().toLowerCase() === 'checkout') {
      e.preventDefault();
      const cart = readCart();
      if (!cart.length) {
        alert('Your cart is empty');
        return;
      }
      window.location.href = 'checkout.html';
      return;
    }
  });

  // initial render
  document.addEventListener('DOMContentLoaded', function () {
    renderCartCount();
    renderCartSidebar();
    renderCartPage();
  });

  // Expose API
  window.BabyCart = {
    addToCart,
    removeFromCart,
    updateQuantity,
    getCart,
    clearCart,
    getCartCount,
    getCartTotal,
    calculateDelivery
  };

})(window, document);
