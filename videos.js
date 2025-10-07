// مصفوفة الفيديوهات (محلي + يوتيوب + Cloudinary عبر URL)
const videos = [
  
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
  },


  // الفيديو الأول (LandScape1)
  {
    type: "cloudinary",
    src: "https://res.cloudinary.com/drilxe8qd/video/upload/v1759840281/landS_iyfqg9.mp4",
    // الترويسة (Poster) مأخوذة من نفس الفيديو (فريم في الثانية 1) مع تحويلات جودة تلقائية
    poster: "https://res.cloudinary.com/drilxe8qd/video/upload/so_1,q_auto,f_auto/v1759840281/landS_iyfqg9.jpg",
    title: "أخر تطورات اللاند سكيب 28-9-2025"
  },

  // الفيديو الثاني (open-day)
  {
    type: "cloudinary",
    src: "https://res.cloudinary.com/drilxe8qd/video/upload/v1759510794/open-day_peiasf.mp4",
    poster: "https://res.cloudinary.com/drilxe8qd/video/upload/so_1,q_auto,f_auto/v1759510794/open-day_peiasf.jpg",
    title: "فعاليات Open Day 12-9-2025"
  }
];

// الكونتينر
const videoGallery = document.getElementById("videoGallery");

// دالة مساعدة (محاولة اشتقاق بوستر لو لم يتوفر)
function deriveCloudinaryPoster(videoSrc) {
  try {
    const parts = videoSrc.split("/");
    const filePart = parts.pop(); // اسم الملف مع الامتداد
    if (!/\.[a-z0-9]+$/i.test(filePart)) return "";
    const withoutExt = filePart.replace(/\.[a-z0-9]+$/i, "");
    const uploadIndex = parts.findIndex(p => p === "upload");
    if (uploadIndex === -1) return "";
    const afterUpload = parts[uploadIndex + 1];
    if (afterUpload && afterUpload.includes(",")) {
      if (!afterUpload.includes("so_")) {
        parts[uploadIndex + 1] = "so_1," + afterUpload;
      }
      if (!/q_auto/.test(parts[uploadIndex + 1])) {
        parts[uploadIndex + 1] += ",q_auto,f_auto";
      }
    } else {
      parts.splice(uploadIndex + 1, 0, "so_1,q_auto,f_auto");
    }
    return parts.join("/") + "/" + withoutExt + ".jpg";
  } catch {
    return "";
  }
}

// توليد الكروت
videos.forEach(video => {
  const card = document.createElement("div");
  card.classList.add("video-card");

  if (video.type === "youtube") {
    card.innerHTML = `
      <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" rel="noopener noreferrer">
        <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="${video.title}" loading="lazy" />
        <div class="video-overlay"><i class="fas fa-play-circle"></i></div>
      </a>
      <p>${video.title}</p>
    `;
  } else if (video.type === "local") {
    card.innerHTML = `
      <a href="${video.src}" target="_blank" rel="noopener noreferrer">
        <img src="${video.poster}" alt="${video.title}" loading="lazy" />
        <div class="video-overlay"><i class="fas fa-play-circle"></i></div>
      </a>
      <p>${video.title}</p>
    `;
  } else if (video.type === "cloudinary") {
    let poster = video.poster;
    if (!poster) {
      poster = deriveCloudinaryPoster(video.src) || "";
    }
    card.innerHTML = `
      <a href="${video.src}" target="_blank" rel="noopener noreferrer">
        ${poster
          ? `<img src="${poster}" alt="${video.title}" loading="lazy" />`
          : `<div class="video-fallback-poster" style="background:#111;color:#fff;display:flex;align-items:center;justify-content:center;height:180px;font-size:14px;">Cloudinary Video</div>`
        }
        <div class="video-overlay"><i class="fas fa-play-circle"></i></div>
      </a>
      <p>${video.title}</p>
    `;
  }

  videoGallery.appendChild(card);
});

