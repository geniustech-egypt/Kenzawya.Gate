import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, set, onValue, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// يجب أن تكون جميع الأكواد الخاصة بالتطبيق داخل هذه الوظيفة
document.addEventListener('DOMContentLoaded', () => {

    // تكوين Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCnRLUzLraNE-AR94ZlRGIAFOKks74ZtyQ",
        authDomain: "kenz--project.firebaseapp.com",
        databaseURL: "https://kenz--project-default-rtdb.firebaseio.com",
        projectId: "kenz--project",
        storageBucket: "kenz--project.firebasestorage.app",
        messagingSenderId: "435317870255",
        appId: "1:435317870255:web:f521650dcfeb63a7378e5a",
        measurementId: "G-FX6BSCQ8KQ"
    };

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'device-' + Date.now();
        localStorage.setItem('deviceId', deviceId);
    }

    // جميع المجموعات (الصيغة الأصلية)
    const groups = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36'],
        ['76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92'],
        ['126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137'],
        ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230', '231', '232', '233', '234', '235', '236', '237', '238', '239', '240', '241'],
        ['276', '277', '278', '279', '280', '281', '282', '283', '284'],
        ['351', '352', '353', '354', '355', '356', '357', '358'],
        ['426', '427', '428', '429', '430', '431', '432', '433'],
        ['501', '502', '503', '504', '505', '506', '507'],
        ['576', '577', '578', '579', '580', '581'],
        ['651', '652', '653', '654', '655', '656', '657', '658', '659', '660', '661', '662', '663', '664', '665', '666', '667', '668', '669', '670', '671', '672', '673', '674', '675', '676', '677', '678', '679', '680', '681', '682', '683', '684', '685', '686', '687', '688', '689', '690', '691', '692', '693', '694', '695', '696', '697', '698', '699', '700', '701', '702', '703', '704'],
        ['726', '727', '728', '729', '730', '731', '732', '733', '734', '735', '736', '737', '738', '739', '740', '741'],
        ['801', '802', '803', '804', '805', '806']
    ];

    // دالة لعرض عداد الاعجاب وعدم الاعجاب لكل العناصر في نفس الوقت
    function displayAllOldRatings() {
        const allRatingsRef = ref(database, 'ratings');
        onValue(allRatingsRef, (snapshot) => {
            const allRatings = snapshot.val() || {};
            groups.forEach(group => {
                group.forEach(id => {
                    const oldLikesDiv = document.getElementById(`old-likes-${id}`);
                    if (!oldLikesDiv) return;
                    const likeSpan = oldLikesDiv.querySelector('.like-count');
                    const dislikeSpan = oldLikesDiv.querySelector('.dislike-count');
                    const data = allRatings[id] || { likes: 0, dislikes: 0 };
                    if (likeSpan) likeSpan.textContent = data.likes || 0;
                    if (dislikeSpan) dislikeSpan.textContent = data.dislikes || 0;
                });
            });
        });
    }

    // عرض احصائيات الاعجاب وعدم الاعجاب القديمة لكل العناصر
    displayAllOldRatings();

    // نظام التقييم بالنجوم + تعليق (مع نقل متوسط التقييم فقط)
    document.querySelectorAll('.star-rating-comment').forEach(block => {
        const serviceId = block.getAttribute('data-service-id');
        const stars = block.querySelectorAll('.star');
        const textarea = block.querySelector('.comment-text');
        const submitBtn = block.querySelector('.submit-rating');
        const commentsDiv = block.querySelector('.all-comments');
        let selectedRating = 0;
        let userRatingKey = null;

        const avgDiv = block.querySelector('.average-rating') || document.createElement('div');
        avgDiv.className = 'average-rating';
        avgDiv.style.cssText = "margin: 5px 0 10px 0; font-weight: bold; color: #ff9800;";

        if (!avgDiv.parentNode) block.insertBefore(avgDiv, block.firstChild);

        // تظليل النجوم عند المرور أو الاختيار
        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const val = parseInt(star.getAttribute('data-value'));
                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-value')) <= val) {
                        s.classList.add('hovered');
                    } else {
                        s.classList.remove('hovered');
                    }
                });
            });
            star.addEventListener('mouseleave', () => {
                stars.forEach(s => s.classList.remove('hovered'));
            });
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.getAttribute('data-value'));
                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-value')) <= selectedRating) {
                        s.classList.add('selected');
                    } else {
                        s.classList.remove('selected');
                    }
                });
            });
        });

        // جلب تقييم المستخدم الحالي
        function fetchUserRating() {
            const ratingsRef = ref(database, `starRatings/${serviceId}`);
            userRatingKey = null;
            get(ratingsRef).then(snapshot => {
                if (snapshot.exists()) {
                    snapshot.forEach(child => {
                        const data = child.val();
                        if (data.deviceId === deviceId) {
                            userRatingKey = child.key;
                            selectedRating = data.rating;
                            textarea.value = data.comment;
                            stars.forEach(s => {
                                if (parseInt(s.getAttribute('data-value')) <= selectedRating) {
                                    s.classList.add('selected');
                                } else {
                                    s.classList.remove('selected');
                                }
                            });
                        }
                    });
                } else {
                    selectedRating = 0;
                    textarea.value = "";
                    stars.forEach(s => s.classList.remove('selected'));
                }
            });
        }
        fetchUserRating();

        // عند الإرسال
        submitBtn.addEventListener('click', () => {
            if (selectedRating === 0) {
                alert("يرجى اختيار عدد النجوم أولاً");
                return;
            }
            const commentText = textarea.value.trim();
            if (commentText.length < 2) {
                alert("يرجى كتابة تعليق مناسب");
                return;
            }
            const ratingsRef = ref(database, `starRatings/${serviceId}`);
            const newRatingData = {
                deviceId,
                rating: selectedRating,
                comment: commentText,
                time: Date.now()
            };

            if (userRatingKey) {
                const userRatingRef = ref(database, `starRatings/${serviceId}/${userRatingKey}`);
                set(userRatingRef, newRatingData).then(() => {
                    alert("تم تعديل تقييمك بنجاح");
                }).catch(error => {
                    console.error("خطأ في تعديل التقييم:", error);
                    alert("حدث خطأ أثناء تعديل تقييمك. يرجى المحاولة مرة أخرى.");
                });
            } else {
                const newRatingRef = push(ratingsRef);
                set(newRatingRef, newRatingData).then(() => {
                    alert("تم إضافة تقييمك بنجاح");
                    fetchUserRating();
                }).catch(error => {
                    console.error("خطأ في إضافة التقييم:", error);
                    alert("حدث خطأ أثناء إضافة تقييمك. يرجى المحاولة مرة أخرى.");
                });
            }
        });

        // نافذة منبثقة لعرض كل التعليقات
        let modal = document.getElementById('comments-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'comments-modal';
            modal.style.display = 'none';
            modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <span class="close-modal" title="إغلاق">×</span>
                    <h3 style="margin-top:0;">كل التعليقات</h3>
                    <div class="modal-comments-list"></div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('.close-modal').onclick = () => { modal.style.display = 'none'; };
            modal.querySelector('.modal-backdrop').onclick = () => { modal.style.display = 'none'; };
        }
        const modalCommentsList = modal.querySelector('.modal-comments-list');

        // عرض زر "عرض كل التعليقات"
        const ratingsRef = ref(database, `starRatings/${serviceId}`);
        onValue(ratingsRef, (snapshot) => {
            commentsDiv.innerHTML = "";
            let ratingsArr = [];
            if (snapshot.exists()) {
                snapshot.forEach(child => {
                    ratingsArr.push(child.val());
                });
                ratingsArr.reverse();

                if (ratingsArr.length > 0) {
                    const btn = document.createElement('button');
                    btn.className = 'show-comments-btn';
                    btn.textContent = `عرض كل التعليقات (${ratingsArr.length})`;
                    btn.onclick = () => {
                        modalCommentsList.innerHTML = "";
                        ratingsArr.forEach(data => {
                            const commentDiv = document.createElement('div');
                            commentDiv.className = 'user-comment';
                            commentDiv.innerHTML = `
                                <span style="color:#ffc107;">${'★'.repeat(data.rating)}</span>
                                <span style="color:#bbb;">${'★'.repeat(5 - data.rating)}</span>
                                <span style="margin-right:8px;">${data.comment}</span>
                                <span style="font-size:10px; color:#888; float:left;">${new Date(data.time).toLocaleDateString('ar-EG')}</span>
                            `;
                            modalCommentsList.appendChild(commentDiv);
                        });
                        modal.style.display = 'block';
                    };
                    commentsDiv.appendChild(btn);
                }
                // حساب المتوسط
                const sum = ratingsArr.reduce((a, b) => a + b.rating, 0);
                const avg = ratingsArr.length > 0 ? (sum / ratingsArr.length).toFixed(1) : "0.0";

                // تظليل الكارت وإضافة أيقونة البلاك ليست
const card = block;
card.style.backgroundColor = '';
card.style.border = '';
card.style.color = '';
const existingIcon = card.querySelector('.blacklist-icon');
if (existingIcon) existingIcon.remove();

if (avg < 2) {
    if (ratingsArr.length >= 5) {
        // أحمر قوي + كتابة داكنة
        card.style.backgroundColor = '#ffcccc'; // أحمر قوي
        card.style.border = '2px solid #ff0000';
        card.style.color = '#222'; // كتابة داكنة
    } else if (ratingsArr.length > 0) {
        // أحمر فاتح جدًا + كتابة داكنة
        card.style.backgroundColor = '#fff0f0'; // أحمر فاتح جدًا
        card.style.border = '2px solid #ffb6b6';
        card.style.color = '#444'; // كتابة داكنة
    }
    card.style.position = 'relative';

    // علامة ممنوع
    const blacklistIcon = document.createElement('span');
    blacklistIcon.textContent = '🚫';
    blacklistIcon.className = 'blacklist-icon';
    blacklistIcon.style.position = 'absolute';
    blacklistIcon.style.top = '10px';
    blacklistIcon.style.right = '10px';
    blacklistIcon.style.fontSize = '24px';
    blacklistIcon.style.cursor = 'pointer';
    blacklistIcon.style.zIndex = '10';
    blacklistIcon.title = 'الخدمة مصنفة سيئة من المستخدمين';

    card.appendChild(blacklistIcon);
} else {
    card.style.backgroundColor = '';
    card.style.border = '';
    card.style.color = '';
    // إزالة أيقونة البلاك ليست لو موجودة
    const blacklistIcon = card.querySelector('.blacklist-icon');
    if (blacklistIcon) blacklistIcon.remove();
}

avgDiv.innerHTML = `
    متوسط التقييم: <span style="color:#ffc107;">${avg}</span> / 5
    <span style="font-size:18px;">
        ${'★'.repeat(Math.round(avg))}
        <span style="color:#bbb;">${'★'.repeat(5 - Math.round(avg))}</span>
    </span>
    <span style="font-size:12px; color:#666; margin-right:5px;">(${ratingsArr.length} تقييم)</span>
`;
            }
        });
    });

    /* ================= SEARCH (Legacy + New Architecture) ================= */
    const searchInput  = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const autocompleteResults = document.getElementById('autocomplete-results') || (() => {
        const div = document.createElement('div');
        div.id = 'autocomplete-results';
        document.body.appendChild(div);
        return div;
    })();

    const serviceSections = document.querySelectorAll('.info');
    const allListItems   = document.querySelectorAll('.info li');
    const NEW_ARCH = serviceSections.length === 0;

    let noResultsMessage = document.getElementById('no-results-message');
    if (!noResultsMessage && searchInput) {
        noResultsMessage = document.createElement('div');
    noResultsMessage.id = 'no-results-message';
    noResultsMessage.textContent = 'لا توجد نتائج مطابقة.';
    noResultsMessage.style.cssText = `
            display:none;text-align:center;margin-top:20px;
            font-size:1.2em;color:#e74c3c;font-weight:bold;
    `;
        searchInput.parentNode.parentNode.insertAdjacentElement('afterend', noResultsMessage);
    }

    function normalizeArabic(text){
        if(!text) return '';
        return text
            .replace(/[أإآ]/g,'ا')
            .replace(/ى/g,'ي')
            .replace(/ة/g,'ه')
            .replace(/َ|ً|ُ|ٌ|ِ|ٍ|ْ|ّ/g,'')
            .trim()
            .toLowerCase();
    }

    /* ====== الوضع القديم ====== */
    function resetOldDisplay(){
        serviceSections.forEach(sec => { sec.style.display='none'; sec.querySelectorAll('li').forEach(li=>li.style.display='list-item'); });
        document.querySelectorAll('.buttons li').forEach(li=>li.style.display='block');
        if (noResultsMessage) noResultsMessage.style.display='none';
        autocompleteResults.style.display='none';
    }
    function navigateToSection(id){
        serviceSections.forEach(sec=>{
            sec.style.display='none';
            sec.querySelectorAll('li').forEach(li=>li.style.display='list-item');
        });
        document.querySelectorAll('.buttons li').forEach(li=>li.style.display='block');
        if (noResultsMessage) noResultsMessage.style.display='none';
        const section = document.getElementById(id);
        if (section){
            section.style.display='block';
            section.scrollIntoView({behavior:'smooth'});
        }
    }
    if (!NEW_ARCH){
        document.querySelectorAll('.buttons li button').forEach(btn=>{
            btn.addEventListener('click', ()=>{
                const target = btn.dataset.target;
                if (target) navigateToSection(target);
            });
        });
    }

    /* ====== الوضع الجديد (صفحات منفصلة) ====== */
    const SERVICE_PAGES = [
        { url: 'services/pharmacies.html'   , selector: '.service-card' },
        { url: 'services/supermarket.html'  , selector: '.service-card' },
        { url: 'services/vegetables.html'   , selector: '.service-card' },
        { url: 'services/meat.html'         , selector: '.service-card' },
        { url: 'services/restaurants.html'  , selector: '.service-card' },
        { url: 'services/clinics.html'      , selector: '.service-card' },
        { url: 'services/cleaning.html'     , selector: '.service-card' },
        { url: 'services/milk.html'         , selector: '.service-card' },
        { url: 'services/grocery.html'      , selector: '.service-card' },
        { url: 'services/bookstore.html'    , selector: '.service-card' },
        { url: 'services/other_services.html',selector: '.service-card' },
        { url: 'services/general_services.html',selector: '.service-card' }
    ];

    let servicesData = [];
    let pagesLoaded = false;

    async function loadAllServices(){
        if (pagesLoaded) return;
        const parser = new DOMParser();
        for (const p of SERVICE_PAGES){
            try{
                const res = await fetch(p.url);
                if(!res.ok) continue;
                const html = await res.text();
                const doc = parser.parseFromString(html,'text/html');
                const cards = doc.querySelectorAll(p.selector);
                cards.forEach(card=>{
                    const titleEl = card.querySelector('.service-title');
                    const ratingBlock = card.querySelector('.star-rating-comment');
                    const sid = ratingBlock?.getAttribute('data-service-id');
                    if (!titleEl) return;
                    const name = titleEl.textContent.trim();
                    servicesData.push({
                        nameOriginal: name,
                        nameNorm: normalizeArabic(name),
                        url: sid ? `${p.url}?id=${sid}` : p.url,
                        serviceId: sid || null
                    });
                });
            }catch(e){
                console.warn('Failed to load', p.url, e);
            }
        }
        pagesLoaded = true;
    }
    if (NEW_ARCH && searchInput){
        loadAllServices();
    }

    function renderAutocomplete(matches){
        autocompleteResults.innerHTML = '';
        matches.forEach(m=>{
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.textContent = m.nameOriginal;
            div.onclick = ()=> { window.location.href = m.url; };
            autocompleteResults.appendChild(div);
        });
        autocompleteResults.style.display = matches.length ? 'block':'none';
    }

    function liveSearchNew(){
        const term = normalizeArabic(searchInput.value);
        if (!term){
            autocompleteResults.style.display='none';
            return;
        }
        if (!pagesLoaded){
            renderAutocomplete([{nameOriginal:'... جاري تحميل البيانات ...', url:'#', nameNorm:'', serviceId:null}]);
            return;
        }
        const matches = servicesData.filter(s=>s.nameNorm.includes(term)).slice(0,40);
        renderAutocomplete(matches);
    }

    function fullSearchNew(){
        const term = normalizeArabic(searchInput.value);
        if (!term){
            autocompleteResults.style.display='none';
            return;
        }
        if (!pagesLoaded){
            alert("البيانات لم تكتمل بعد، حاول بعد ثوانٍ.");
            return;
        }
        const matches = servicesData.filter(s=>s.nameNorm.includes(term));
        if (matches.length === 0){
            autocompleteResults.innerHTML = '<div class="autocomplete-item" style="cursor:default;">لا توجد نتائج</div>';
            autocompleteResults.style.display='block';
            return;
                }
        if (matches.length === 1){
            window.location.href = matches[0].url;
            return;
        }
        renderAutocomplete(matches);
    }

    function highlightLocal(term){
        if (!term) return;
        const cards = document.querySelectorAll('.service-card .service-title');
        let firstMatch = null;
        cards.forEach(c=>{
            const txt = normalizeArabic(c.textContent);
            if (txt.includes(term)){
                c.style.background = 'linear-gradient(90deg,#ffe9a8,#fff)';
                if(!firstMatch) firstMatch = c;
            } else {
                c.style.background = '';
            }
        });
        if (firstMatch){
            firstMatch.scrollIntoView({behavior:'smooth', block:'center'});
        }
    }

    if (searchInput && searchButton){
        if (NEW_ARCH){
            searchInput.addEventListener('input', ()=>{ liveSearchNew(); highlightLocal(normalizeArabic(searchInput.value)); });
            searchInput.addEventListener('keypress', e=>{ if(e.key==='Enter'){ e.preventDefault(); fullSearchNew(); } });
            searchButton.addEventListener('click', fullSearchNew);
        } else {
            function performLiveSearchOld(){
                const term = normalizeArabic(searchInput.value);
                autocompleteResults.innerHTML = '';
                if (!term){
                    autocompleteResults.style.display='none';
                    resetOldDisplay();
                    return;
                }
                const matches = [];
                allListItems.forEach(li=>{
                    const liTxt = normalizeArabic(li.textContent);
                    if (liTxt.includes(term)){
                        const sec = li.closest('.info');
                        if (sec){
                            matches.push({ text: li.textContent.trim(), id: sec.id });
                        }
                    }
                });
                const unique = [...new Map(matches.map(m=>[m.text,m])).values()];
                unique.forEach(m=>{
                    const el = document.createElement('div');
                    el.className='autocomplete-item';
                    el.textContent = m.text;
                    el.onclick = ()=>{
                        searchInput.value = m.text;
                        navigateToSection(m.id);
                        autocompleteResults.style.display='none';
                    };
                    autocompleteResults.appendChild(el);
                });
                autocompleteResults.style.display = unique.length ? 'block':'none';
            }

            function performFullSearchOld(){
                const term = normalizeArabic(searchInput.value);
                if (!term){
                    resetOldDisplay();
            return;
        }
                let found = false;
                serviceSections.forEach(sec=>{
                    let sectionHas = false;
                    sec.querySelectorAll('li').forEach(li=>{
                        const liTxt = normalizeArabic(li.textContent);
                        if (liTxt.includes(term)){
                            li.style.display='list-item';
                            sectionHas = true;
                        } else {
                            li.style.display='none';
                        }
                    });
                    if (sectionHas){
                        sec.style.display='block';
                        found = true;
                    } else {
                        sec.style.display='none';
                    }
                });
                document.querySelectorAll('.buttons li').forEach(li=>li.style.display='none');
                if (!found){
                    if (noResultsMessage) noResultsMessage.style.display='block';
                } else {
                    const first = document.querySelector('.info[style*="block"]');
                    first?.scrollIntoView({behavior:'smooth'});
                }
                autocompleteResults.style.display='none';
                }

            searchInput.addEventListener('input', performLiveSearchOld);
            searchInput.addEventListener('keypress', e=>{ if(e.key==='Enter'){ e.preventDefault(); performFullSearchOld(); } });
            searchButton.addEventListener('click', performFullSearchOld);
            }
    }

    document.addEventListener('click', (e)=>{
        if (autocompleteResults && !autocompleteResults.contains(e.target) && e.target !== searchInput){
            autocompleteResults.style.display='none';
        }
    });

    /* ========= إظهار خدمة واحدة في الصفحات المنفصلة عند قدوم id ========= */
    (function isolateServiceIfRequested(){
        const params = new URLSearchParams(location.search);
        const targetId = params.get('id');
        if (!targetId) return;
        const allCards = document.querySelectorAll('.service-card');
        let targetCard = null;

        allCards.forEach(card=>{
            const rating = card.querySelector('.star-rating-comment');
            const sid = rating?.getAttribute('data-service-id');
            if (sid === targetId){
                targetCard = card;
            } else {
                card.style.display = 'none';
            }
        });

        if (targetCard){
            targetCard.style.outline = '3px solid #ffb400';
            targetCard.style.animation = 'pulse 1.2s ease-in-out 2';
            setTimeout(()=>targetCard.scrollIntoView({behavior:'smooth', block:'start'}), 150);

            const showAllBtn = document.createElement('button');
            showAllBtn.textContent = 'عرض كل الخدمات';
            showAllBtn.style.cssText = `
                margin:15px 0;
                background:#4a90e2;
                color:#fff;
                border:none;
                padding:10px 18px;
                border-radius:8px;
                cursor:pointer;
                font-weight:600;
                font-family:inherit;
            `;
            showAllBtn.onclick = () => {
                allCards.forEach(c=>{ c.style.display=''; c.style.outline=''; c.style.animation=''; });
                history.replaceState(null, '', location.pathname);
                showAllBtn.remove();
            };
            targetCard.parentNode.insertBefore(showAllBtn, targetCard);
        }
    })();

    /* === تفعيل التنقّل عبر الأزرار الرئيسية في الوضع الجديد (NEW_ARCH) === */
    (function enableMainButtonsNavigation(){
        if (!NEW_ARCH) return;
        const mainButtons = document.querySelectorAll('.buttons button[data-link]');
        if (!mainButtons.length) return;
        mainButtons.forEach(btn=>{
            btn.addEventListener('click', ()=>{
                const url = btn.getAttribute('data-link');
                if (url) window.location.href = url;
            });
        });
    })();

    /* ================= Utility Buttons (traffic) ================= */
    document.getElementById('traffic-button')?.addEventListener('click', ()=>{
        const link = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("كنز كمبوند، السادس من أكتوبر، الجيزة، مصر")}&travelmode=driving`;
        window.open(link,'_blank');
    });

    /* ================= Floating Cards (news/emergency) ================= */
    const allCardsFloat = document.querySelectorAll('.floating-info-card');
    function toggleCard(card){
        allCardsFloat.forEach(c=>{
            if (c === card) c.classList.toggle('show'); else c.classList.remove('show');
        });
    }
    const newsCard = document.getElementById('news-card');
    const emergencyCard = document.getElementById('emergency-card');
    document.getElementById('news-button')?.addEventListener('click', ()=>toggleCard(newsCard));
    document.getElementById('emergency-button')?.addEventListener('click', ()=>toggleCard(emergencyCard));
    document.querySelectorAll('.close-btn').forEach(btn=>{
        btn.addEventListener('click', ()=> btn.closest('.floating-info-card')?.classList.remove('show'));
    });
    document.addEventListener('click', e=>{
        if (!e.target.closest('.icon-with-card-container')){
            allCardsFloat.forEach(c=>c.classList.remove('show'));
        }
    });

    /* ================= Accordion ================= */
    document.querySelectorAll('.accordion-header').forEach(h=>{
        h.addEventListener('click', ()=>{
            const content = h.nextElementSibling;
            h.classList.toggle('active');
            content.style.maxHeight = h.classList.contains('active') ? content.scrollHeight + 'px' : 0;
        });
    });

    /* ================= Slideshow (if exists) ================= */
    const slides = document.querySelectorAll('.image-slideshow .slide');
    let currentSlide = 0;
    if (slides.length){
        slides[0].classList.add('active');
        setInterval(()=>{
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    fetch('news.html')
        .then(response => response.ok ? response.text() : Promise.reject('network'))
        .then(data => {
            document.getElementById('news-container').innerHTML = data;
        })
        .catch(error => {
            document.getElementById('news-container').innerHTML = '<p>تعذر تحميل الأخبار. يرجى المحاولة لاحقًا.</p>';
        });
});
