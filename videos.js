const videos = [
  {
    type: "local",
    src: "open-day.mp4",       // الفيديو المحلي
    poster: "photo-day.jpg",   // صورة الغلاف
    title: "KENZ Open Day"
  },  
  {
    type: "youtube",
    id: "h4HI7YG02j0",
    title: "ازالة ورق حماية الشباك الالوميتال"
  },
  {
    type: "youtube",
    id: "OZFrD2xI21M",
    title: "تسليك البلاعات والقضاء علي الروائح المزعجة"
  },
  {
    type: "youtube",
    id: "vw2H3CGKNcQ",
    title: "طريقة التخلص من الهاموش في المنزل"
  },
  {
    type: "youtube",
    id: "RGuSkOi3ujQ",
    title: "إزالة الروائح الكريهة من الثلاجة"
  },
  {
    type: "youtube",
    id: "tJ5wfSydliQ",
    title: "القضاء علي الذباب والناموس من الحديقة"
  },
  {
    type: "youtube",
    id: "z-dxAbbu7Ms",
    title: "طريقة عمل توصيلة بين بطارية سيارتين "
  }
];

// جلب الكونتينر بتاع الفيديوهات
const videoGallery = document.getElementById("videoGallery");

// توليد الكروت تلقائيًا
videos.forEach(video => {
  const card = document.createElement("div");
  card.classList.add("video-card");

  if (video.type === "youtube") {
    // فيديو يوتيوب
    card.innerHTML = `
      <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" rel="noopener noreferrer">
        <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="${video.title}" loading="lazy" />
        <div class="video-overlay"><i class="fas fa-play-circle"></i></div>
      </a>
      <p>${video.title}</p>
    `;
  } else if (video.type === "local") {
    // فيديو محلي بنفس شكل يوتيوب
    card.innerHTML = `
      <a href="${video.src}" target="_blank" rel="noopener noreferrer">
        <img src="${video.poster}" alt="${video.title}" loading="lazy" />
        <div class="video-overlay"><i class="fas fa-play-circle"></i></div>
      </a>
      <p>${video.title}</p>
    `;
  }

  // إضافة الكارت للكونتينر
  videoGallery.appendChild(card);
});
