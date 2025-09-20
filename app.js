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
        ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230', '231', '232', '233', '234', '235', '236', '237', '238', '239', '240'],
        ['276', '277', '278', '279', '280', '281', '282', '283', '284'],
        ['351', '352', '353', '354', '355', '356', '357', '358'],
        ['426', '427', '428', '429', '430', '431', '432', '433'],
        ['501', '502', '503', '504', '505', '506', '507'],
        ['576', '577', '578', '579', '580', '581'],
        ['651', '652', '653', '654', '655', '656', '657', '658', '659', '660', '661', '662', '663', '664', '665', '666', '667', '668', '669', '670', '671', '672', '673', '674', '675', '676', '677', '678', '679', '680', '681', '682', '683', '684', '685', '686', '687', '688', '689', '690', '691', '692', '693', '694', '695', '696', '697', '698', '699', '700', '701', '702', '703', '704'],
        ['726', '727', '728', '729', '730', '731', '732', '733', '734', '735', '736', '737', '738', '739'],
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
    document.querySelectorAll('#clinics .star-rating-comment, #pharmacies .star-rating-comment, #supermarket .star-rating-comment, #restaurants .star-rating-comment, #vegetables .star-rating-comment, #meat .star-rating-comment, #Cleaning .star-rating-comment, #Milk .star-rating-comment, #Grocery .star-rating-comment, #bookstore .star-rating-comment, #Grocery .star-rating-comment, #other_services .star-rating-comment, #General_services .star-rating-comment').forEach(block => {
        const serviceId = block.getAttribute('data-service-id');
        const stars = block.querySelectorAll('.star');
        const textarea = block.querySelector('.comment-text');
        const submitBtn = block.querySelector('.submit-rating');
        const commentsDiv = block.querySelector('.all-comments');
        let selectedRating = 0;
        let userRatingKey = null;

        // نقل عنصر متوسط التقييم ليكون أول عنصر في البلوك
        const avgDiv = block.querySelector('.average-rating') || document.createElement('div');
        avgDiv.className = 'average-rating';
        avgDiv.style.cssText = "margin: 5px 0 10px 0; font-weight: bold; color: #ff9800;";
        
        // إعادة ترتيب العناصر: متوسط التقييم أولاً
        const container = document.createElement('div');
        container.appendChild(avgDiv);
        
        container.appendChild(stars[0].parentNode); // النجوم
        container.appendChild(textarea);
        container.appendChild(submitBtn);
        container.appendChild(commentsDiv);
        
        // استبدال محتوى البلوك بالترتيب الجديد
        block.innerHTML = '';
        block.appendChild(container);

        // باقي الكود يبقى كما هو تمامًا بدون أي تغييرات ▼▼▼

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
                const card = block; // البلوك يمثل الكارت الحالي
                card.style.backgroundColor = '';
                const existingIcon = card.querySelector('.blacklist-icon');
                if (existingIcon) existingIcon.remove();

                if (ratingsArr.length >= 1 && avg < 2) {
                    // تظليل ملفت للكارت
                    card.style.backgroundColor = '#f7dadaff'; // أحمر فاتح للتنبيه
                    card.style.border = '2px solid #ff0000';
                    card.style.position = 'relative';

                    // أيقونة بلاك ليست
                    const blacklistIcon = document.createElement('span');
                    blacklistIcon.textContent = '🚫';
                    blacklistIcon.className = 'blacklist-icon';
                    blacklistIcon.style.position = 'absolute';
                    blacklistIcon.style.top = '10px';
                    blacklistIcon.style.right = '10px';
                    blacklistIcon.style.fontSize = '24px';
                    blacklistIcon.style.cursor = 'pointer';
                    blacklistIcon.title = 'الخدمة مصنفة سيئة من المستخدمين';

                    card.appendChild(blacklistIcon);
                } else {
                    // الكارت طبيعي بدون أي تمييز
                    card.style.backgroundColor = '';
                    card.style.border = '';
                }
                avgDiv.innerHTML = `
                    متوسط التقييم: <span style="color:#ffc107;">${avg}</span> / 5
                    <span style="font-size:18px;">
                        ${'★'.repeat(Math.round(avg))}
                        <span style="color:#bbb;">${'★'.repeat(5 - Math.round(avg))}</span>
                    </span>
                    <span style="font-size:12px; color:#666; margin-right:5px;">(${ratingsArr.length} تقييم)</span>
                `;
            } else {
                avgDiv.innerHTML = `
                    متوسط التقييم: <span style="color:#ffc107;">0.0</span> / 5
                    <span style="font-size:16px;">
                        <span style="color:#bbb;">★★★★★</span>
                    </span>
                    <span style="font-size:12px; color:#666; margin-right:5px;">(0 تقييم)</span>
                `;
            }
        });
    });

    // عناصر البحث
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const serviceSections = document.querySelectorAll('.info');
    const allListItems = document.querySelectorAll('.info li');
    const allMainButtons = document.querySelectorAll('.buttons li');
    const autocompleteResults = document.getElementById('autocomplete-results');

    const noResultsMessage = document.createElement('div');
    noResultsMessage.id = 'no-results-message';
    noResultsMessage.textContent = 'لا توجد نتائج مطابقة.';
    noResultsMessage.style.cssText = `
        display: none;
        text-align: center;
        margin-top: 20px;
        font-size: 1.2em;
        color: #e74c3c;
        font-weight: bold;
    `;
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.parentNode.insertBefore(noResultsMessage, searchContainer.nextSibling);
    }

    
    // دالة لإعادة الصفحة إلى الحالة الافتراضية (إخفاء كل الأقسام)
    function resetPageDisplay() {
        // إخفاء جميع الأقسام
        serviceSections.forEach(section => {
            section.style.display = 'none';
        });
        // إعادة إظهار جميع الأزرار الرئيسية وعناصر الصفحة العلوية
        allMainButtons.forEach(button => button.style.display = 'block');
        noResultsMessage.style.display = 'none';
        autocompleteResults.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // دالة موحدة للتنقل بين الأقسام
    function navigateToSection(id) {
        // إخفاء جميع الأقسام أولاً
        serviceSections.forEach(s => {
            s.style.display = 'none';
            s.querySelectorAll('li').forEach(li => li.style.display = 'list-item');
        });
        allMainButtons.forEach(button => button.style.display = 'block');
        noResultsMessage.style.display = 'none';
        autocompleteResults.style.display = 'none';

        // إظهار القسم المطلوب والتمرير إليه
        const section = document.getElementById(id);
        if (section) {
            section.style.display = 'block';
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // ربط الأزرار الرئيسية بوظيفة التمرير الجديدة
    document.querySelectorAll('.buttons li button').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            if (targetId) {
                navigateToSection(targetId);
            }
        });
    });

    // دالة تطبيع النص العربي
    function normalizeArabic(text) {
        if (!text) return '';
        let normalizedText = text.replace(/[أإآ]/g, 'ا');
        normalizedText = normalizedText.replace(/ى/g, 'ي');
        normalizedText = normalizedText.replace(/ة/g, 'ه');
        normalizedText = normalizedText.replace(/َ|ً|ُ|ٌ|ِ|ٍ|ْ|ّ/g, '');
        return normalizedText.trim().toLowerCase();
    }

    // دالة البحث الفوري (Live Search)
function performLiveSearch() {
    const searchTerm = normalizeArabic(searchInput.value);
    autocompleteResults.innerHTML = '';

    if (searchTerm.length === 0) {
        autocompleteResults.style.display = 'none';
        resetPageDisplay();
        return;
    }

    const matches = [];
    allListItems.forEach(item => {
        const itemText = normalizeArabic(item.textContent);
        if (itemText.includes(searchTerm)) {
            const parentSection = item.closest('.info');
            if (parentSection) {
                const sectionId = parentSection.id;
                let matchText = '';
                item.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A')) {
                        matchText += node.textContent.trim() + ' ';
                    }
                });
                matches.push({ text: matchText.trim(), id: sectionId });
            }
        }
    });

    if (matches.length > 0) {
        const uniqueMatches = [...new Map(matches.map(item => [item.text, item])).values()];
        uniqueMatches.forEach(match => {
            const p = document.createElement('p');
            p.textContent = match.text;
            p.className = 'autocomplete-item';
            p.style.cssText = `
                padding: 10px;
                cursor: pointer;
                border-bottom: 1px solid #eee;
            `;
            p.onmouseover = () => p.style.backgroundColor = '#f0f0f0';
            p.onmouseout = () => p.style.backgroundColor = '#fff';
            p.onclick = () => {
                searchInput.value = match.text;
                performFullSearch(); 
            };
            autocompleteResults.appendChild(p);
        });
        autocompleteResults.style.display = 'block'; // هذا هو السطر الصحيح الذي لا يمحو باقي التنسيقات
    } else {
        autocompleteResults.style.display = 'none';
    }
}

    // دالة البحث الكامل (Full Search)
    function performFullSearch() {
        const searchTerm = normalizeArabic(searchInput.value);
        let foundMatch = false;

        // إخفاء جميع العناصر أولاً
        serviceSections.forEach(section => {
            section.style.display = 'none';
            section.querySelectorAll('li').forEach(li => li.style.display = 'none');
        });
        allMainButtons.forEach(button => button.style.display = 'none');
        noResultsMessage.style.display = 'none';
        autocompleteResults.style.display = 'none';

        if (searchTerm === '') {
            resetPageDisplay();
            return;
        }

        // عرض العناصر التي تطابق البحث فقط
        serviceSections.forEach(section => {
            let sectionHasMatch = false;
            const listItems = section.querySelectorAll('li');
            listItems.forEach(item => {
                const itemText = normalizeArabic(item.textContent);
                if (itemText.includes(searchTerm)) {
                    item.style.display = 'list-item';
                    sectionHasMatch = true;
                } else {
                    item.style.display = 'none';
                }
            });
            if (sectionHasMatch) {
                section.style.display = 'block';
                foundMatch = true;
            }
        });

        if (!foundMatch) {
            noResultsMessage.style.display = 'block';
        } else {
            const firstResultSection = document.querySelector('.info[style*="block"]');
            if (firstResultSection) {
                firstResultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    searchButton.addEventListener('click', performFullSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performFullSearch();
        }
    });
    searchInput.addEventListener('input', performLiveSearch);
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            autocompleteResults.style.display = 'none';
        }
    });

    const trafficButton = document.getElementById('traffic-button');
    // إضافة مستمعي الأحداث لأزرار الأيقونات
    trafficButton?.addEventListener('click', ()=>{
        const link = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("كنز كمبوند، السادس من أكتوبر، الجيزة، مصر")}&travelmode=driving`;
        window.open(link,'_blank');
    });

    // بداية الكود الجديد للتحكم في البطاقات العائمة
    const newsCard = document.getElementById('news-card');
    const emergencyCard = document.getElementById('emergency-card');
    const allCards = document.querySelectorAll('.floating-info-card');

    // دالة موحدة للتحكم في عرض البطاقات
    function toggleCard(cardToShow) {
        allCards.forEach(card => {
            if (card === cardToShow) {
                card.classList.toggle('show'); // تبديل حالة الظهور للبطاقة المطلوبة فقط
            } else {
                card.classList.remove('show'); // إخفاء جميع البطاقات الأخرى
            }
        });
    }

    // إضافة مستمعي الأحداث لأزرار الأيقونات
    document.getElementById('news-button')?.addEventListener('click', () => {
        toggleCard(newsCard);
    });

    document.getElementById('emergency-button')?.addEventListener('click', () => {
        toggleCard(emergencyCard);
    });

    // إضافة مستمعي الأحداث لزر الإغلاق
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.floating-info-card').classList.remove('show');
        });
    });

    // إغلاق البطاقات عند الضغط خارجها
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.icon-with-card-container')) {
            allCards.forEach(card => card.classList.remove('show'));
        }
    });
    // نهاية الكود الجديد


    // ==================== Accordion functionality ====================
    document.querySelectorAll('.accordion-header').forEach(button => {
        button.addEventListener('click', () => {
            const accordionContent = button.nextElementSibling;
            button.classList.toggle('active');
            accordionContent.style.maxHeight = button.classList.contains('active') ? accordionContent.scrollHeight + 'px' : 0;
        });
    });

    // ==================== Image Slideshow ====================
    const slides = document.querySelectorAll('.image-slideshow .slide');
    let currentSlide = 0;

    if (slides.length > 0) {
        slides[0].classList.add('active');
    
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }
    // الكود الجديد لجلب الأخبار
    fetch('news.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('news-container').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading the news content:', error);
            document.getElementById('news-container').innerHTML = '<p>تعذر تحميل الأخبار. يرجى المحاولة لاحقًا.</p>';
        });
});
