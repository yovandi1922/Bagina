/* =========================================================
   BAGINA — script.js
   Ganti nomor WhatsApp di CONFIG di bawah ini dengan nomor
   tokomu sendiri (format: kode negara tanpa tanda + atau 0).
   Contoh: "0812-3456-7890" ditulis "6281234567890"
   ========================================================= */

const CONFIG = {
  whatsappNumber: "081111851191",
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
  "Kasir Warung & Sembako":
    "https://ui-avatars.com/api/?name=WS&background=06B58A&color=fff&size=128&bold=true",
  "Kasir Resto & Cafe":
    "https://ui-avatars.com/api/?name=RC&background=FF6B35&color=fff&size=128&bold=true",
  "Kasir Retail & Fashion":
    "https://ui-avatars.com/api/?name=RF&background=4F46E5&color=fff&size=128&bold=true",
  "Kasir Toko Online":
    "https://ui-avatars.com/api/?name=TO&background=FFC93C&color=fff&size=128&bold=true",
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
    desc: "Isi ulang diamond, UC, dan item favorit langsung masuk ke akun game-mu.",
    items: [
      { group: "Mobile Legends", name: "86 Diamonds", price: "Rp 20.000" },
      { group: "Mobile Legends", name: "172 Diamonds", price: "Rp 40.000" },
      { group: "Mobile Legends", name: "344 Diamonds", price: "Rp 75.000" },
      {
        group: "Mobile Legends",
        name: "Weekly Diamond Pass",
        price: "Rp 28.000",
      },
      { group: "Free Fire", name: "70 Diamond", price: "Rp 10.000" },
      { group: "Free Fire", name: "140 Diamond", price: "Rp 20.000" },
      { group: "Free Fire", name: "355 Diamond", price: "Rp 50.000" },
      { group: "Free Fire", name: "Membership Mingguan", price: "Rp 27.000" },
      { group: "PUBG Mobile", name: "60 UC", price: "Rp 15.000" },
      { group: "PUBG Mobile", name: "325 UC", price: "Rp 75.000" },
      { group: "PUBG Mobile", name: "660 UC", price: "Rp 150.000" },
      {
        group: "Genshin Impact",
        name: "60 Genesis Crystal",
        price: "Rp 16.000",
      },
      { group: "Genshin Impact", name: "300 + 30 Crystal", price: "Rp 79.000" },
      {
        group: "Genshin Impact",
        name: "Welkin Moon (30 hari)",
        price: "Rp 30.000",
      },
    ],
  },
  voucher: {
    label: "Top Up Voucher",
    desc: "Kode voucher digital untuk belanja aplikasi, game, dan hiburan favoritmu.",
    items: [
      { group: "Google Play", name: "Gift Card Rp 10.000", price: "Rp 11.000" },
      { group: "Google Play", name: "Gift Card Rp 50.000", price: "Rp 52.500" },
      {
        group: "Google Play",
        name: "Gift Card Rp 100.000",
        price: "Rp 103.000",
      },
      { group: "Steam Wallet", name: "Kode Rp 45.000", price: "Rp 47.000" },
      { group: "Steam Wallet", name: "Kode Rp 90.000", price: "Rp 92.500" },
      { group: "Steam Wallet", name: "Kode Rp 180.000", price: "Rp 183.000" },
      {
        group: "PlayStation Store",
        name: "Voucher Rp 90.000",
        price: "Rp 93.000",
      },
      {
        group: "PlayStation Store",
        name: "Voucher Rp 180.000",
        price: "Rp 184.000",
      },
      {
        group: "PlayStation Store",
        name: "Voucher Rp 450.000",
        price: "Rp 455.000",
      },
      {
        group: "iTunes & App Store",
        name: "Gift Card Rp 60.000",
        price: "Rp 62.000",
      },
      {
        group: "iTunes & App Store",
        name: "Gift Card Rp 120.000",
        price: "Rp 123.000",
      },
      {
        group: "iTunes & App Store",
        name: "Gift Card Rp 300.000",
        price: "Rp 305.000",
      },
    ],
  },
  kasir: {
    label: "Aplikasi Kasir",
    desc: "Rekomendasi aplikasi kasir (POS) populer untuk berbagai jenis usaha — dari warung, resto, retail, sampai toko online. Pilih yang paling cocok, kami bantu setup-nya.",
    items: [
      {
        name: "Majoo",
        price: "Rp 249.000",
        priceNote: "per outlet / bulan (Starter)",
        features: [
          "Kasir multi-platform (desktop, tablet, smartphone)",
          "Inventori & manajemen stok otomatis",
          "CRM, akuntansi, dan analisa bisnis",
          "Integrasi toko online & marketplace",
        ],
      },
      {
        name: "Qasir",
        price: "Rp 70.792",
        priceNote: "per bulan (Qasir Pro)",
        features: [
          "Pencatatan transaksi & laporan penjualan",
          "Manajemen stok dan produk",
          "Pembayaran QRIS & multi-metode",
          "Gratis untuk fitur dasar (versi free)",
        ],
      },
      {
        name: "Pawoon",
        price: "Rp 149.000",
        priceNote: "per bulan (Basic)",
        features: [
          "Transaksi tidak terbatas (unlimited)",
          "Multi-outlet / multi-cabang",
          "Manajemen inventori & CRM dasar",
          "Pembayaran digital (GoPay, OVO, Dana)",
        ],
      },
      {
        name: "Olsera",
        price: "Rp 199.000",
        priceNote: "per bulan (mulai dari)",
        features: [
          "POS offline & online (fleksibel)",
          "Manajemen stok multi-cabang",
          "Integrasi marketplace & QRIS",
          "Fitur promosi, CRM, dan absensi karyawan",
        ],
      },
      {
        name: "Moka POS",
        price: "Rp 299.000",
        priceNote: "per outlet / bulan (Basic)",
        features: [
          "Dashboard laporan real-time",
          "Manajemen stok & promo",
          "Pembayaran digital via e-wallet QRIS",
          "Manajemen meja untuk resto & cafe",
        ],
      },
      {
        name: "Kasir Pintar",
        price: "Rp 55.500",
        priceNote: "per bulan (Pro)",
        features: [
          "Kasir cepat dengan scan barcode",
          "Multi-payment (QRIS, EDC, tunai)",
          "Manajemen stok & karyawan (StaffPlus)",
          "POS offline & sinkronisasi cloud",
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

    if (key === "kasir") {
      html += `<div class="item-grid">`;
      cat.items.forEach((item) => {
        // ▶ TAMBAHAN — <div class="item-icon"> di bawah ini
        html += `
          <div class="item-card kasir-card">
            <div class="item-icon">
              <img src="${brandIcon(item.name)}" alt="${item.name}" loading="lazy">
            </div>
            <h4>${item.name}</h4>
            <div class="item-price">${item.price}<span>${item.priceNote}</span></div>
            <ul class="kasir-features">
              ${item.features.map((f) => `<li>${CHECK_ICON}<span>${f}</span></li>`).join("")}
            </ul>
            <button class="btn btn-accent btn-block" data-order="${item.name}" data-price="${item.price} ${item.priceNote}">
              Pesan via WhatsApp
            </button>
          </div>`;
      });
      html += `</div>`;
    } else {
      // group by sub-kategori (mis. Mobile Legends, Free Fire, ...)
      const bySub = {};
      cat.items.forEach((item) => {
        if (!bySub[item.group]) bySub[item.group] = [];
        bySub[item.group].push(item);
      });
      Object.keys(bySub).forEach((sub) => {
        html += `<h3 style="font-size:1.05rem;margin:0 0 14px;">${sub}</h3><div class="item-grid">`;
        bySub[sub].forEach((item) => {
          // ▶ TAMBAHAN — <div class="item-icon"> di bawah ini
          html += `
            <div class="item-card">
              <div class="item-icon">
                <img src="${brandIcon(sub)}" alt="${sub}" loading="lazy">
              </div>
              <h4>${item.name}</h4>
              <div class="item-desc">${sub}</div>
              <div class="item-price">${item.price}</div>
              <button class="btn btn-accent btn-block" data-order="${sub} — ${item.name}" data-price="${item.price}">
                Pesan Sekarang
              </button>
            </div>`;
        });
        html += `</div>`;
      });
    }

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
