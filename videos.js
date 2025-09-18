const videos = [
  {
    id: "h4HI7YG02j0",
    title: "ازالة ورق حماية الشباك الالوميتال"
  },
  {
    id: "OZFrD2xI21M",
    title: "تسليك البلاعات والقضاء علي الروائح المزعجة"
  },
  {
    id: "vw2H3CGKNcQ",
    title: "طريقة التخلص من الهاموش في المنزل"
  },
  {
    id: "RGuSkOi3ujQ",
    title: "إزالة الروائح الكريهة من الثلاجة"
  },
  {
    id: "tJ5wfSydliQ",
    title: "القضاء علي الذباب والناموس من الحديقة"
  },
  {
    id: "z-dxAbbu7Ms",
    title: "طريقة عمل توصيلة بين بطارية سيارتين "
  }
  
];

// جلب الكونتينر بتاع الفيديوهات
const videoGallery = document.getElementById("videoGallery");

// توليد الكروت تلقائيًا
videos.forEach(video => {
  // عنصر الكارت
  const card = document.createElement("div");
  card.classList.add("video-card");

  // رابط الفيديو
  card.innerHTML = `
    <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" rel="noopener noreferrer">
      <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="${video.title}" loading="lazy" />
      <div class="video-overlay"><i class="fas fa-play-circle"></i></div>
    </a>
    <p>${video.title}</p>
  `;

  // إضافة الكارت للكونتينر
  videoGallery.appendChild(card);
});
