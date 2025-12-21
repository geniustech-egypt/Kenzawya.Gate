// الإعلانات
const ads = [
  {
    title: "جبنالك أجود أنواع الزيوت العطرية علشان نعملك أفضل البرفانات العالمية بنفس جودة و ثبات الاصلي والسعر حكاية",
    image: "diga mo.jpeg", // رابط صورة الشعار أو الغلاف
    url: "https://www.facebook.com/people/Diga-Mo-Perfumes/61584082016759/?rdid=76CK0PUiUGUiQRmx&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17bjQbcoVa%2F",
    phone: "01021247327", // رقم هاتف للاتصال
    type: "facebook" // نحدد نوع الإعلان كـ Facebook
  },
  {
    title: "صيانة وتصليح جميع أنواع الميكرويفات في بيتك بدون قلق النقل بأفضل الخامات وأحسن الأسعار",
    image: "microwave.jpeg",  
    url: "https://www.facebook.com/profile.php?id=100085221263194",
    phone: "01270952128", 
    type: "facebook"
  },
  {
    title: "كسر أرفف وأدراج ثلاجتك مهما كان نوعها وأحنا نوفرلك غيرها بسعر مناسب والتوصيل لعندك بمصاريف شحن بسيطة ",
    image: "makka.jpeg", // رابط صورة الشعار أو الغلاف
    url: "https://www.facebook.com/groups/126761025839298/?ref=share&mibextid=KtfwRi",
    phone: ["01027252135 / 01274529364"],
    type: "facebook"
  },
  {
    title: "شركة متخصصة في مكافحة الحشرات المنزلية والآفات الزراعية في الحدائق واللاندسكيب بأحدث الطرق الآمنة  ",
    image: "insects.jpeg", // رابط صورة الشعار أو الغلاف
    url: "https://www.facebook.com/groups/292013278376893/?ref=share&mibextid=KtfwRi",
    phone: ["01044438382 / 01034161403"],
    type: "facebook"
  },
  {
    title: "هنا هتلاقي تقييم لكل الأجهزة الكهربائية اللي انت عاوز تشتريها وكمان تقدر تستفسر عن شرح إمكانيات الاجهزة الكهربائية ",
    image: "taqeem.jpeg", // رابط صورة الشعار أو الغلاف
    url: "https://www.facebook.com/groups/550164346241614/?ref=share&mibextid=KtfwRi",
    type: "facebook"
  }
];

// توليد الإعلانات ديناميكيًا
const adsContainer = document.getElementById("ads-carousel");

ads.forEach(ad => {
  // توفير صورة افتراضية في حال عدم توفر صورة
  const adImage = ad.image || "default-ad.jpg";

  // إنشاء بطاقة الإعلان
  const adCard = document.createElement("div");
  adCard.classList.add("ad-card");

  // إذا كان الإعلان خاص بفيسبوك، أضف التنسيق الخاص
  if (ad.type === "facebook") {
    adCard.classList.add("facebook");
  }

  // إضافة محتويات البطاقة
  adCard.innerHTML = `
    <a href="${ad.url}" target="_blank" rel="noopener noreferrer">
      <img src="${ad.image}" alt="${ad.title}" loading="lazy">
      <p class="ad-title">${ad.title}</p>
    </a>
    ${
      ad.type === "facebook" 
        ? `<div class="facebook-link">
             <a href="${ad.url}" target="_blank" class="facebook-button">زيارة صفحتنا</a>
           </div>`
        : ""
    }
    ${
      ad.phone
        ? `<div class="ad-phone">
            <i class="fa-solid fa-phone"></i>
            <span class="phone-numbers">${ad.phone}</span>
           </div>`
        : ""
    }
  `;

  // إضافة البطاقة إلى الحاوية الرئيسية
  adsContainer.appendChild(adCard);
});