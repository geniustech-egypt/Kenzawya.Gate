(function () {
  const API_VISIT = '/api/visit';
  const API_STATS = '/api/visitors';

  function ensureCookie(name) {
    const parts = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    if (parts) return parts.split('=')[1];
    const id = 'sid-' + Math.random().toString(36).slice(2, 12);
    document.cookie = name + '=' + id + '; path=/; max-age=' + (365 * 24 * 3600);
    return id;
  }

  function createBar() {
    if (document.getElementById('visitor-stats-bar')) return document.getElementById('visitor-stats-bar');
    const bar = document.createElement('div');
    bar.id = 'visitor-stats-bar';
    bar.innerHTML = `\n      <div class="container">\n        <div class="stat"><div class="label">الزوار الآن</div><div class="value" id="visitors-now">...</div></div>\n        <div class="stat"><div class="label">الزوار آخر 7 أيام</div><div class="value" id="visitors-7">...</div></div>\n        <div class="stat"><div class="label">الزوار آخر 30 يوم</div><div class="value" id="visitors-30">...</div></div>\n      </div>\n    `;
    document.body.appendChild(bar);
    bar.style.position = 'fixed';
    bar.style.left = '0';
    bar.style.right = '0';
    bar.style.zIndex = '9999';
    return bar;
  }

  function adjustForBar(bar) {
    const footer = document.querySelector('footer');
    const footerHeight = footer ? footer.offsetHeight : 0;
    const barHeight = bar.offsetHeight;
    document.body.style.paddingBottom = (barHeight + footerHeight) + 'px';
    bar.style.bottom = footerHeight + 'px';
  }

  async function sendHeartbeat(sessionId) {
    try {
      await fetch(API_VISIT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sid: sessionId })
      });
    } catch (e) {
    }
  }

  async function fetchStatsAndUpdate() {
    try {
      const res = await fetch(API_STATS, {cache: 'no-store'});
      if (!res.ok) return;
      const json = await res.json();
      document.getElementById('visitors-now').textContent = json.active ?? '0';
      document.getElementById('visitors-7').textContent = json.last7 ?? '0';
      document.getElementById('visitors-30').textContent = json.last30 ?? '0';
    } catch (e) {
    }
  }

  const sessionId = ensureCookie('visitor_sid');
  const bar = createBar();

  window.addEventListener('load', () => {
    adjustForBar(bar);
    const footer = document.querySelector('footer');
    if (footer && window.ResizeObserver) {
      const ro = new ResizeObserver(() => adjustForBar(bar));
      ro.observe(footer);
    }
    sendHeartbeat(sessionId);
    setInterval(() => sendHeartbeat(sessionId), 20 * 1000);
    fetchStatsAndUpdate();
    setInterval(fetchStatsAndUpdate, 10 * 1000);
  });
})();
