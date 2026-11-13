/* يرسم خدمات ملف data الخاص بالصفحة قبل تهيئة التقييمات في app.js. */
function renderServicesData() {
  const page = document.body?.dataset.page || location.pathname.split('/').pop().replace(/\.html$/i, '');
  const list = document.querySelector('.services-list');
  const services = Array.isArray(window.servicesPageData) ? window.servicesPageData : [];
  if (!page || !list || !services.length) return;

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const makePhone = phone => String(phone ?? '').replace(/[^0-9+]/g, '');
  const makeStableId = (service, phones) => {
    const value = `${page}|${service.title}|${phones.join('|')}`;
    const hash = seed => {
      let result = seed;
      for (let index = 0; index < value.length; index += 1) {
        result = Math.imul(result ^ value.charCodeAt(index), 16777619);
      }
      return (result >>> 0).toString(36);
    };
    return `svc_${hash(2166136261)}_${hash(2166136261 ^ 0x9e3779b9)}`;
  };

  // كل صفحة حمّلت ملف بياناتها الخاص، لذلك لا نحتاج لتصفية السجلات باسم الصفحة.
  services.forEach(service => {
    const phones = (Array.isArray(service.phones) ? service.phones : [service.phone])
      .map(makePhone).filter(Boolean);
    const manualId = String(service.id ?? '').trim();
    const id = manualId || makeStableId(service, phones);
    if (!/^[A-Za-z0-9_-]+$/.test(id) || document.querySelector(`.star-rating-comment[data-service-id="${id}"]`)) {
      console.warn('تم تجاهل خدمة لأن رقمها غير صالح أو مكرر:', service);
      return;
    }

    const phoneLinks = phones
      .map(phone => `<a href="tel:${phone}">${escapeHtml(phone)}</a>`).join('');
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.type = String(service.type || 'other');
    card.innerHTML = `
      <div class="service-title">${escapeHtml(service.title)}</div>
      <div class="service-address">${escapeHtml(service.address)}</div>
      <div class="service-phone"><i class="fa-solid fa-phone-volume"></i>${phoneLinks}</div>
      <div class="old-likes-info" id="old-likes-${id}">
        👍 <span class="like-count">0</span> | 👎 <span class="dislike-count">0</span>
        <small style="display:block;color:#888;">التقييم القديم</small>
      </div>
      <div class="star-rating-comment" data-service-id="${id}">
        <div class="star-rating"><span class="star" data-value="1">★</span><span class="star" data-value="2">★</span><span class="star" data-value="3">★</span><span class="star" data-value="4">★</span><span class="star" data-value="5">★</span></div>
        <textarea class="comment-text" placeholder="اكتب تعليقك عن الخدمة..."></textarea>
        <button class="submit-rating">إرسال التقييم</button><div class="all-comments"></div>
      </div>`;
    list.appendChild(card);
  });
}

// يعمل سواء كان الملف قد حُمّل أثناء بناء الصفحة أو بعد اكتمالها.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderServicesData, { once: true });
} else {
  renderServicesData();
}
