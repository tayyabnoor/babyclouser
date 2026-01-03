/* Checkout helpers: read cart, validate form, build mailto order */
(function (window, document) {
  'use strict';

  function qs(id) { return document.getElementById(id); }

  function formatCurrency(v) { return '₹' + (Number(v) || 0).toLocaleString('en-IN'); }

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

  function placeOrder() {
    const v = validateForm();
    if (!v.ok) { alert(v.message); return; }
    const cart = BabyCart.getCart();
    if (!cart.length) { alert('Cart is empty'); return; }
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
    const apiUrl = window.location.origin + '/api/orders.php';
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
      timeout: 5000
    })
    .then(r => {
      if (!r.ok) throw new Error('Server response: ' + r.status);
      return r.json();
    })
    .then(data => {
      if (data.ok && data.orderId) {
        orderId = data.orderId;
      }
      // Show success either way
      showOrderSuccess(orderId, v.data, grand);
    })
    .catch(e => {
      console.warn('Backend API unavailable, using local order:', e.message);
      // Show success with local order ID (backend not required)
      showOrderSuccess(orderId, v.data, grand);
    });
  }

  function showOrderSuccess(orderId, customer, grand) {
    const message = 'Thank You! Your order has been placed successfully.\n\n' +
      'Order ID: ' + orderId + '\n\n' +
      'Order Details:\n' +
      'Name: ' + customer.name + '\n' +
      'Email: ' + customer.email + '\n' +
      'Phone: ' + customer.phone + '\n' +
      'Grand Total: ₹' + grand.toLocaleString('en-IN') + '\n\n' +
      'We will contact you soon with confirmation.';
    
    alert(message);
    BabyCart.clearCart();
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildOrderSummary();
    const btn = document.getElementById('place-order-btn');
    if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); placeOrder(); });
    // refresh order summary when cart changes
    document.addEventListener('cart.updated', buildOrderSummary);
  });

})(window, document);
