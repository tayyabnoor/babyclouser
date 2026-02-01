/* Checkout helpers: read cart, validate form, build mailto order */
(function (window, document) {
  'use strict';

  function qs(id) { return document.getElementById(id); }

  function formatCurrency(v) { return '₨' + (Number(v) || 0).toLocaleString('en-IN'); }

  function buildOrderSummary() {
    const container = document.getElementById('checkout-order-summary');
    if (!container || !window.BabyCart) return;
    const cart = BabyCart.getCart();
    container.innerHTML = '';
    if (!cart.length) {
      container.innerHTML = '<p>No items in your cart</p>';
      return;
    }
    const ul = document.createElement('div');
    cart.forEach(i => {
      const p = document.createElement('p');
      p.textContent = `${i.name} — ${i.quantity} x ${formatCurrency(i.price)} = ${formatCurrency(i.price * i.quantity)}`;
      ul.appendChild(p);
    });
    container.appendChild(ul);
    // totals
    const subtotal = BabyCart.getCartTotal();
    const delivery = BabyCart.calculateDelivery(subtotal);
    const grand = subtotal + delivery;
    const subEl = document.querySelector('.checkout-subtotal'); if (subEl) subEl.textContent = formatCurrency(subtotal);
    const delEl = document.querySelector('.checkout-delivery'); if (delEl) delEl.textContent = formatCurrency(delivery);
    const grandEl = document.querySelector('.checkout-grand'); if (grandEl) grandEl.textContent = formatCurrency(grand);
  }

  function validateForm() {
    const name = qs('billing-first-name').value.trim();
    const email = qs('billing-email').value.trim();
    const phone = qs('billing-phone').value.trim();
    const address = qs('billing-address').value.trim();
    if (!name || !email || !phone || !address) return { ok: false, message: 'Please fill all required fields' };
    return { ok: true, data: { name, email, phone, address } };
  }

  function buildMailto(recipients, subject, body) {
    const to = encodeURIComponent(recipients.join(','));
    return `mailto:${recipients.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function redirectToThankYou(status, params) {
    try {
      const qs = new URLSearchParams({ status: status, ...(params || {}) });
      window.location.href = `thankyou.html?${qs.toString()}`;
    } catch (e) {
      window.location.href = `thankyou.html?status=${encodeURIComponent(status)}`;
    }
  }

  function setPlacingOrderState(btn, placing) {
    if (!btn) return;
    try {
      if (placing) {
        if (!btn.dataset.originalText) btn.dataset.originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Placing order...';
      } else {
        btn.disabled = false;
        btn.textContent = btn.dataset.originalText || 'Place Order';
      }
    } catch (e) {
      // ignore
    }
  }

  function placeOrder() {
    const btn = document.getElementById('place-order-btn');

    const v = validateForm();
    if (!v.ok) {
      redirectToThankYou('order_failed', { error: v.message || 'Please fill all required fields' });
      return;
    }
    const cart = BabyCart.getCart();
    if (!cart.length) {
      redirectToThankYou('order_failed', { error: 'Cart is empty' });
      return;
    }

    setPlacingOrderState(btn, true);

    const subtotal = BabyCart.getCartTotal();
    const delivery = BabyCart.calculateDelivery(subtotal);
    const grand = subtotal + delivery;

    // Build order object
    const order = {
      timestamp: new Date().toISOString(),
      customer: {
        name: v.data.name,
        email: v.data.email,
        phone: v.data.phone,
        address: v.data.address
      },
      items: cart,
      totals: {
        subtotal: subtotal,
        delivery: delivery,
        grand: grand
      }
    };

    // Store order in localStorage for backup
    let orderId = 'ORD-' + Date.now();
    try {
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      orders.push({ id: orderId, ...order });
      localStorage.setItem('orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Could not store order locally', e);
    }

    // Try to send order to backend API
    const apiUrl = 'process_checkout.php';
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      setPlacingOrderState(btn, false);
      redirectToThankYou('order_failed', { error: 'Order request timed out. Please try again or place order on WhatsApp.' });
    }, 25000); // 25 seconds timeout

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })
    .then(r => {
      clearTimeout(timeoutId);
      if (timedOut) return; // already handled by timeout
      if (!r.ok) throw new Error('Server response: ' + r.status);
      return r.json();
    })
    .then(data => {
      clearTimeout(timeoutId);
      if (timedOut) return; // already handled by timeout
      if (data.success && data.orderId) {
        orderId = data.orderId;
        // Success: clear cart and redirect to thank you page
        BabyCart.clearCart();
        redirectToThankYou('order_success', { order: orderId });
      } else {
        throw new Error(data.message || 'Order processing failed');
      }
    })
    .catch(e => {
      clearTimeout(timeoutId);
      if (timedOut) return; // already handled by timeout
      console.error('Order submission error:', e.message);
      // Failure: keep cart so user can try again
      setPlacingOrderState(btn, false);
      redirectToThankYou('order_failed', { error: e.message || 'Order not placed' });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildOrderSummary();
    const btn = document.getElementById('place-order-btn');
    if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); placeOrder(); });
    // refresh order summary when cart changes
    document.addEventListener('cart.updated', buildOrderSummary);
  });

})(window, document);
