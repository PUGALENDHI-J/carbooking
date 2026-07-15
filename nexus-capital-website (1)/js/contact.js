/* ==========================================================================
   CONTACT FORM — builds a formatted WhatsApp message, no backend required
   ========================================================================== */
(function () {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  // Nexus Capital WhatsApp business number (country code + number, no + or spaces)
  const WHATSAPP_NUMBER = '914221234567';

  const statusEl = form.querySelector('.form-status');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      showStatus('Please fill in your name, email, and message before sending.', 'error');
      return;
    }

    const lines = [
      'Hello Nexus Capital,',
      '',
      'Name:',
      name,
      '',
      'Email:',
      email,
    ];

    if (phone) {
      lines.push('', 'Phone:', phone);
    }

    lines.push('', 'Message:', message);

    const text = encodeURIComponent(lines.join('\n'));
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`
      : `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`;

    showStatus('Opening WhatsApp with your message ready to send…', 'success');

    window.open(url, '_blank', 'noopener');
    form.reset();
  });

  function showStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.remove('success', 'error');
    statusEl.classList.add(type, 'is-visible');
  }
})();
