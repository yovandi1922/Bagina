/* =========================================================
   BAGINA — script.js
   Ganti nomor WhatsApp di CONFIG di bawah ini dengan nomor
   tokomu sendiri (format: kode negara tanpa tanda + atau 0).
   Contoh: "0812-3456-7890" ditulis "6281234567890"
   ========================================================= */

const CONFIG = {
  whatsappNumber: "6281111851191",
  storeName: "Bagina",
};

// ▶ TAMBAHAN — peta logo brand (dipakai di kartu produk)
const BRAND_ICONS = {
  "Mobile Legends":
    "https://www.google.com/s2/favicons?domain=mobilelegends.com&sz=128",
  "Free Fire": "https://www.google.com/s2/favicons?domain=ff.garena.com&sz=128",
  "PUBG Mobile":
    "https://www.google.com/s2/favicons?domain=pubgmobile.com&sz=128",
  "Genshin Impact":
    "https://www.google.com/s2/favicons?domain=hoyoverse.com&sz=128",
  "Google Play":
    "https://www.google.com/s2/favicons?domain=play.google.com&sz=128",
  "Steam Wallet":
    "https://www.google.com/s2/favicons?domain=steampowered.com&sz=128",
  "PlayStation Store":
    "https://www.google.com/s2/favicons?domain=playstation.com&sz=128",
  "iTunes & App Store":
    "https://www.google.com/s2/favicons?domain=apple.com&sz=128",
  "Aplikasi Kasir":
    "https://ui-avatars.com/api/?name=AK&background=06B58A&color=fff&size=128&bold=true",
  "Aplikasi Parkir":
    "https://ui-avatars.com/api/?name=AP&background=4F46E5&color=fff&size=128&bold=true",
  "Aplikasi Antrian":
    "https://ui-avatars.com/api/?name=AA&background=FF6B35&color=fff&size=128&bold=true",
};

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

/* ---------- Data produk (halaman Produk) ---------- */
const PRODUCT_DATA = {
  game: {
    label: "Top Up Game",
    desc: "Isi ulang diamond, UC, dan item favorit langsung masuk ke akun game-mu. Tersedia paket mulai Rp 1 juta.",
    items: [
      // Mobile Legends
      { group: "Mobile Legends", name: "4000 Diamonds", price: "Rp 1.000.000" },
      { group: "Mobile Legends", name: "8000 Diamonds", price: "Rp 2.000.000" },
      { group: "Mobile Legends", name: "12000 Diamonds", price: "Rp 3.000.000" },
      { group: "Mobile Legends", name: "20000 Diamonds", price: "Rp 5.000.000" },
      { group: "Mobile Legends", name: "40000 Diamonds", price: "Rp 10.000.000" },
      // Free Fire
      { group: "Free Fire", name: "7000 Diamonds", price: "Rp 1.000.000" },
      { group: "Free Fire", name: "14000 Diamonds", price: "Rp 2.000.000" },
      { group: "Free Fire", name: "21000 Diamonds", price: "Rp 3.000.000" },
      { group: "Free Fire", name: "35000 Diamonds", price: "Rp 5.000.000" },
      { group: "Free Fire", name: "70000 Diamonds", price: "Rp 10.000.000" },
      // PUBG Mobile
      { group: "PUBG Mobile", name: "4000 UC", price: "Rp 1.000.000" },
      { group: "PUBG Mobile", name: "8000 UC", price: "Rp 2.000.000" },
      { group: "PUBG Mobile", name: "12000 UC", price: "Rp 3.000.000" },
      { group: "PUBG Mobile", name: "20000 UC", price: "Rp 5.000.000" },
      { group: "PUBG Mobile", name: "40000 UC", price: "Rp 10.000.000" },
      // Genshin Impact
      { group: "Genshin Impact", name: "4000 Genesis Crystal", price: "Rp 1.000.000" },
      { group: "Genshin Impact", name: "8000 Genesis Crystal", price: "Rp 2.000.000" },
      { group: "Genshin Impact", name: "12000 Genesis Crystal", price: "Rp 3.000.000" },
      { group: "Genshin Impact", name: "20000 Genesis Crystal", price: "Rp 5.000.000" },
      { group: "Genshin Impact", name: "40000 Genesis Crystal", price: "Rp 10.000.000" },
    ],
  },
  voucher: {
    label: "Top Up Voucher",
    desc: "Kode voucher digital untuk belanja aplikasi, game, dan hiburan favoritmu.",
    items: [
      { group: "Google Play", name: "Gift Card Rp 10.000", price: "Rp 11.000" },
      { group: "Google Play", name: "Gift Card Rp 50.000", price: "Rp 52.500" },
      { group: "Google Play", name: "Gift Card Rp 100.000", price: "Rp 103.000" },
      { group: "Steam Wallet", name: "Kode Rp 45.000", price: "Rp 47.000" },
      { group: "Steam Wallet", name: "Kode Rp 90.000", price: "Rp 92.500" },
      { group: "Steam Wallet", name: "Kode Rp 180.000", price: "Rp 183.000" },
      { group: "PlayStation Store", name: "Voucher Rp 90.000", price: "Rp 93.000" },
      { group: "PlayStation Store", name: "Voucher Rp 180.000", price: "Rp 184.000" },
      { group: "PlayStation Store", name: "Voucher Rp 450.000", price: "Rp 455.000" },
      { group: "iTunes & App Store", name: "Gift Card Rp 60.000", price: "Rp 62.000" },
      { group: "iTunes & App Store", name: "Gift Card Rp 120.000", price: "Rp 123.000" },
      { group: "iTunes & App Store", name: "Gift Card Rp 300.000", price: "Rp 305.000" },
    ],
  },
  software: {
    label: "Software",
    desc: "Solusi software untuk bisnis: aplikasi kasir, parkir, dan antrian. Harga mulai dari Rp 2.750.000.",
    items: [
      // Aplikasi Kasir
      {
        group: "Aplikasi Kasir",
        name: "Kasir Basic",
        price: "Rp 2.750.000",
        priceNote: "lisensi",
        features: [
          "1 outlet, 1 kasir",
          "Manajemen produk & stok",
          "Laporan penjualan harian",
          "Support QRIS & tunai",
        ],
      },
      {
        group: "Aplikasi Kasir",
        name: "Kasir Standard",
        price: "Rp 4.950.000",
        priceNote: "lisensi",
        features: [
          "1 outlet, 3 kasir",
          "Manajemen stok multi-gudang",
          "Laporan penjualan & laba",
          "Integrasi printer thermal",
        ],
      },
      {
        group: "Aplikasi Kasir",
        name: "Kasir Pro",
        price: "Rp 9.750.000",
        priceNote: "lisensi",
        features: [
          "1 outlet, 10 kasir",
          "CRM & program loyalitas",
          "Multi-payment & e-wallet",
          "Dashboard analitik real-time",
        ],
      },
      {
        group: "Aplikasi Kasir",
        name: "Kasir Business",
        price: "Rp 14.950.000",
        priceNote: "lisensi",
        features: [
          "3 outlet, 20 kasir",
          "Manajemen inventori lanjutan",
          "Integrasi marketplace",
          "Absensi karyawan & payroll",
        ],
      },
      {
        group: "Aplikasi Kasir",
        name: "Kasir Enterprise",
        price: "Rp 19.250.000",
        priceNote: "lisensi",
        features: [
          "5 outlet, 50 kasir",
          "Multi-currency & multi-bahasa",
          "API integration",
          "Priority support 24/7",
        ],
      },
      {
        group: "Aplikasi Kasir",
        name: "Kasir Ultimate",
        price: "Rp 24.950.000",
        priceNote: "lisensi",
        features: [
          "10 outlet, unlimited kasir",
          "Custom report & dashboard",
          "Dedicated account manager",
          "On-site training",
        ],
      },
      {
        group: "Aplikasi Kasir",
        name: "Kasir Platinum",
        price: "Rp 29.250.000",
        priceNote: "lisensi",
        features: [
          "Unlimited outlet & kasir",
          "White-label & custom branding",
          "Full API access",
          "SLA 99.9% uptime",
        ],
      },
      // Aplikasi Parkir
      {
        group: "Aplikasi Parkir",
        name: "Parkir Basic",
        price: "Rp 5.000.000",
        priceNote: "lisensi",
        features: [
          "1 gate masuk/keluar",
          "Tiket manual & barcode",
          "Laporan pendapatan harian",
          "Integrasi printer tiket",
        ],
      },
      {
        group: "Aplikasi Parkir",
        name: "Parkir Standard",
        price: "Rp 10.000.000",
        priceNote: "lisensi",
        features: [
          "2 gate masuk/keluar",
          "RFID & kartu member",
          "Display tarif otomatis",
          "Laporan multi-shift",
        ],
      },
      {
        group: "Aplikasi Parkir",
        name: "Parkir Pro",
        price: "Rp 15.000.000",
        priceNote: "lisensi",
        features: [
          "4 gate masuk/keluar",
          "Kamera LPR (plat nomor)",
          "Integrasi e-money",
          "Dashboard monitoring",
        ],
      },
      {
        group: "Aplikasi Parkir",
        name: "Parkir Business",
        price: "Rp 20.000.000",
        priceNote: "lisensi",
        features: [
          "8 gate masuk/keluar",
          "Sistem reservasi parkir",
          "Aplikasi mobile untuk pengguna",
          "Analitik okupansi",
        ],
      },
      {
        group: "Aplikasi Parkir",
        name: "Parkir Enterprise",
        price: "Rp 25.000.000",
        priceNote: "lisensi",
        features: [
          "Unlimited gate",
          "Integrasi dengan sistem gedung",
          "Custom workflow",
          "Support prioritas",
        ],
      },
      // Aplikasi Antrian
      {
        group: "Aplikasi Antrian",
        name: "Antrian Basic",
        price: "Rp 5.000.000",
        priceNote: "lisensi",
        features: [
          "1 loket, 1 display",
          "Nomor antrian kertas",
          "Panggilan suara",
          "Laporan antrian harian",
        ],
      },
      {
        group: "Aplikasi Antrian",
        name: "Antrian Standard",
        price: "Rp 10.000.000",
        priceNote: "lisensi",
        features: [
          "3 loket, 2 display",
          "Antrian online via web",
          "Estimasi waktu tunggu",
          "Integrasi TV display",
        ],
      },
      {
        group: "Aplikasi Antrian",
        name: "Antrian Pro",
        price: "Rp 15.000.000",
        priceNote: "lisensi",
        features: [
          "5 loket, 3 display",
          "Aplikasi mobile untuk petugas",
          "Sistem prioritas & reservasi",
          "Dashboard real-time",
        ],
      },
      {
        group: "Aplikasi Antrian",
        name: "Antrian Business",
        price: "Rp 20.000.000",
        priceNote: "lisensi",
        features: [
          "10 loket, 5 display",
          "Multi-layanan & multi-lokasi",
          "API untuk integrasi",
          "Analitik kepuasan pelanggan",
        ],
      },
      {
        group: "Aplikasi Antrian",
        name: "Antrian Enterprise",
        price: "Rp 25.000.000",
        priceNote: "lisensi",
        features: [
          "Unlimited loket & display",
          "Custom branding & voice",
          "Integrasi CRM & ERP",
          "Dedicated support",
        ],
      },
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
            <div class="item-icon">
              <img src="${brandIcon(sub)}" alt="${sub}" loading="lazy">
            </div>
            <h4>${item.name}</h4>
            <div class="item-desc">${sub}</div>
            <div class="item-price">${item.price}${item.priceNote ? `<span>${item.priceNote}</span>` : ''}</div>
            ${hasFeatures ? `<ul class="kasir-features">${item.features.map((f) => `<li>${CHECK_ICON}<span>${f}</span></li>`).join("")}</ul>` : ''}
            <button class="btn btn-accent btn-block" data-order="${sub} — ${item.name}" data-price="${item.price}${item.priceNote ? ' ' + item.priceNote : ''}">
              ${hasFeatures ? 'Pesan via WhatsApp' : 'Pesan Sekarang'}
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