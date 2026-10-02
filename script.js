/* =========================================================
   BAGINA — script.js
   Ganti nomor WhatsApp di CONFIG di bawah ini dengan nomor
   tokomu sendiri (format: kode negara tanpa tanda + atau 0).
   Contoh: "0812-3456-7890" ditulis "6281234567890"
   ========================================================= */

const CONFIG = {
  whatsappNumber: "6287891860447",
  storeName: "Bagina",
};

// ▶ TAMBAHAN — peta logo brand (dipakai di kartu produk)
const BRAND_ICONS = {}; // opsional: isi logo/foto per grup produk

// ▶ TAMBAHAN — ambil icon brand; kalau tidak ada, pakai inisial otomatis
function brandIcon(name) {
  if (BRAND_ICONS[name]) return BRAND_ICONS[name];
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=4F46E5&color=fff&size=128&bold=true`;
}

/* ---------- Helper: buka WhatsApp dengan pesan siap pakai ---------- */
function orderViaWhatsApp(productName, priceLabel) {
  const text = priceLabel
    ? `Halo ${CONFIG.storeName}, saya mau pesan *${productName}* (${priceLabel}). Mohon info lebih lanjut ya!`
    : `Halo ${CONFIG.storeName}, saya mau tanya-tanya soal *${productName}*.`;
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener");
}

/* ---------- Set link WhatsApp umum (tombol mengambang, navbar, CTA) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-wa-general]").forEach((el) => {
    const msg = `Halo ${CONFIG.storeName}, saya mau tanya-tanya soal produk yang tersedia.`;
    el.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    el.target = "_blank";
    el.rel = "noopener";
  });

  initNavToggle();
  initActiveNav();
  initCarousel();
  initProductTabs();
});

/* ---------- Mobile nav toggle ---------- */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });
}

/* ---------- Highlight nav link aktif ---------- */
function initActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[data-page]").forEach((a) => {
    if (a.dataset.page === path) a.classList.add("active");
  });
}

/* ---------- Testimonial carousel (home) ---------- */
function initCarousel() {
  const track = document.querySelector(".carousel-track");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".carousel-slide"));
  const dotsWrap = document.querySelector(".carousel-dots");
  const prevBtn = document.querySelector(".carousel-arrow.prev");
  const nextBtn = document.querySelector(".carousel-arrow.next");
  let current = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Testimoni ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  function next() {
    goTo(current + 1);
  }
  function prev() {
    goTo(current - 1);
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, 5000);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  nextBtn.addEventListener("click", () => {
    next();
    startAuto();
  });
  prevBtn.addEventListener("click", () => {
    prev();
    startAuto();
  });
  track.addEventListener("mouseenter", stopAuto);
  track.addEventListener("mouseleave", startAuto);

  startAuto();
}

/* Data produk — HARGA DI BAWAH ADALAH CONTOH, ganti dengan harga aslimu */
// Foto produk: taruh file di folder images/ dengan nama sesuai nama produk
// (contoh: "Kaos Oversize" -> images/kaos-oversize.jpg), atau isi parameter
// terakhir dengan path/URL sendiri. Kalau file tidak ada, tampil placeholder.
const slug = (t) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
// ▶ HARGA — semua produk "mulai dari" harga ini (ubah di sini)
const START_PRICE = "Mulai dari Rp 2.500.000";
const P = (group, name, detail, image) => ({
  group,
  name,
  price: START_PRICE,
  priceNote: "",
  image: image || `images/${slug(name)}.jpg`,
  features: ["Harga langsung grosir", detail, "Boleh campur ukuran"],
});
const K = (group, name, detail, image) => ({
  group,
  name,
  price: START_PRICE,
  priceNote: "",
  image: image || `images/${slug(name)}.jpg`,
  features: ["Siap jual", detail, "Dikemas rapi"],
});
const PRODUCT_DATA = {
  pria: {
    label: "Pakaian Pria",
    desc: "Kaos, kemeja, dan celana pria harga grosir. Harga langsung grosir, boleh campur ukuran.",
    items: [
      P("Kaos", "Kaos Polos Cotton Combed 30s", "Bahan adem, size M–XXL"),
      P("Kaos", "Kaos Oversize", "Bahan tebal, size all size"),
      P("Kaos", "Polo Shirt", "Kerah rapi, size M–XXL"),
      P("Kemeja", "Kemeja Flanel", "Motif kotak, size M–XL"),
      P("Kemeja", "Kemeja Oxford", "Lengan panjang, size M–XL"),
      P("Celana", "Celana Jeans", "Size 28–36"),
      P("Celana", "Celana Chino", "Size 28–36"),
      P("Celana", "Celana Training", "Size M–XL"),
    ],
  },
  wanita: {
    label: "Pakaian Wanita",
    desc: "Atasan, gamis, dress, dan bawahan wanita harga grosir. Harga langsung grosir, boleh campur ukuran.",
    items: [
      P("Atasan", "Blouse Rayon", "Size S–XL"),
      P("Atasan", "Kaos Crop", "Size all size"),
      P("Atasan", "Kemeja Oversize", "Size all size"),
      P("Gamis & Dress", "Gamis Polos", "Size M–XXL"),
      P("Gamis & Dress", "Dress Rayon", "Size S–XL"),
      P("Bawahan & Hijab", "Rok Plisket", "Size all size"),
      P("Bawahan & Hijab", "Celana Kulot", "Size S–XL"),
      P("Bawahan & Hijab", "Hijab Voal", "Aneka warna"),
    ],
  },
  paket: {
    label: "Paket Reseller",
    desc: "Paket campur model pria dan wanita, siap dijual lagi.",
    items: [
      K(
        "Paket Campur Model",
        "Paket Starter",
        "Campur model pria & wanita",
        "images/100-pcs-campur-model.jpg",
      ),
      // K(
      //   "Paket Campur Model",
      //   "Paket Reseller",
      //   "Campur model pria & wanita",
      //   "images/100-pcs-campur-model.jpg",
      // ),
      // K(
      //   "Paket Campur Model",
      //   "Paket Partai Besar",
      //   "Harga terbaik, siap dijual lagi",
      //   "images/100-pcs-campur-model.jpg",
      // ),
    ],
  },
};

const CHECK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function initProductTabs() {
  const tabBar = document.querySelector(".tab-bar");
  const groupsWrap = document.querySelector(".product-groups");
  if (!tabBar || !groupsWrap) return;

  // render satu <section class="product-group"> per kategori
  Object.keys(PRODUCT_DATA).forEach((key) => {
    const cat = PRODUCT_DATA[key];
    const section = document.createElement("div");
    section.className = "product-group";
    section.id = `group-${key}`;

    let html = `<div class="group-head"><h2>${cat.label}</h2><p>${cat.desc}</p></div>`;

    // group by item.group
    const bySub = {};
    cat.items.forEach((item) => {
      if (!bySub[item.group]) bySub[item.group] = [];
      bySub[item.group].push(item);
    });

    Object.keys(bySub).forEach((sub) => {
      html += `<h3 style="font-size:1.05rem;margin:0 0 14px;">${sub}</h3><div class="item-grid">`;
      bySub[sub].forEach((item) => {
        const hasFeatures = item.features && item.features.length > 0;
        const cardClass = hasFeatures ? "item-card kasir-card" : "item-card";
        html += `
          <div class="${cardClass}">
            <div class="item-photo">
              ${item.image ? `<img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.remove()">` : ""}
            </div>
            <h4>${item.name}</h4>
            <div class="item-desc">${sub}</div>
            <div class="item-price">${item.price}${item.priceNote ? `<span>${item.priceNote}</span>` : ""}</div>
            ${hasFeatures ? `<ul class="kasir-features">${item.features.map((f) => `<li>${CHECK_ICON}<span>${f}</span></li>`).join("")}</ul>` : ""}
            <button class="btn btn-accent btn-block" data-order="${sub} — ${item.name}" data-price="${item.price}${item.priceNote ? " " + item.priceNote : ""}">
              ${hasFeatures ? "Pesan via WhatsApp" : "Pesan Sekarang"}
            </button>
          </div>`;
      });
      html += `</div>`;
    });

    section.innerHTML = html;
    groupsWrap.appendChild(section);
  });

  // pasang event listener tombol pesan
  groupsWrap.querySelectorAll("[data-order]").forEach((btn) => {
    btn.addEventListener("click", () => {
      orderViaWhatsApp(btn.dataset.order, btn.dataset.price);
    });
  });

  // logic tab
  const tabs = Array.from(tabBar.querySelectorAll(".tab-btn"));
  const groups = Array.from(groupsWrap.querySelectorAll(".product-group"));

  function activate(key) {
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === key));
    groups.forEach((g) =>
      g.classList.toggle("active", g.id === `group-${key}`),
    );
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activate(tab.dataset.tab);
      history.replaceState(null, "", `#${tab.dataset.tab}`);
    });
  });

  const initialKey =
    window.location.hash.replace("#", "") || tabs[0]?.dataset.tab;
  activate(PRODUCT_DATA[initialKey] ? initialKey : tabs[0]?.dataset.tab);
}
