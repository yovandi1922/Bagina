/* =========================================================
   BAGINA — script.js
   Ganti nomor WhatsApp di CONFIG di bawah ini dengan nomor
   tokomu sendiri (format: kode negara tanpa tanda + atau 0).
   Contoh: "0812-3456-7890" ditulis "6281234567890"
   ========================================================= */

const CONFIG = {
  whatsappNumber: "6287891860447",
  storeName: "Bagina",
  // PIN untuk membuat link konfirmasi pembayaran (cek-pembayaran.html#admin). GANTI!
  adminPin: "bagina-2026",
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
  initFaqAccordion(); // ← FAQ accordion
  initCartUI();
  initCartPage();
  initStatusPage();
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
  sepatu: {
    label: "Sepatu",
    desc: "Sepatu branded pria & wanita harga grosir — Nike, Adidas, Macbeth, Vans, Converse, dan lainnya. Siap jual lagi.",
    items: [
      P(
        "Sneakers Pria",
        "Nike Air Force 1",
        "Sol tebal, size 39–44",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Sneakers Pria",
        "Nike Air Max",
        "Air cushion, size 39–44",
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Sneakers Pria",
        "Adidas Ultraboost",
        "Bahan knit, size 39–44",
        "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Sneakers Pria",
        "Macbeth Brighton",
        "Kanvas tebal, size 39–44",
        "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Sneakers Pria",
        "Vans Old Skool",
        "Kanvas + suede, size 39–44",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Sneakers Pria",
        "Converse Chuck Taylor",
        "High top, size 39–44",
        "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Sneakers Pria",
        "New Balance 574",
        "Suede + mesh, size 39–44",
        "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Sneakers Pria",
        "Puma Suede Classic",
        "Suede, size 39–44",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Sneakers Wanita",
        "Nike Air Zoom Wanita",
        "Ringan, size 36–40",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Sneakers Wanita",
        "Adidas Superstar Wanita",
        "Classic shell toe, size 36–40",
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Sneakers Wanita",
        "Vans Ward Wanita",
        "Kanvas, size 36–40",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Sneakers Wanita",
        "Converse All Star Wanita",
        "Low top, size 36–40",
        "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Sneakers Wanita",
        "New Balance 327 Wanita",
        "Retro running, size 36–40",
        "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Sneakers Wanita",
        "Skechers D'Lites Wanita",
        "Chunky sole, size 36–40",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Formal & Flat Wanita",
        "Flat Shoes Wanita",
        "Kulit sintetis, size 36–40",
        "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80",
      ),
      P(
        "Formal & Flat Wanita",
        "Heels Wanita",
        "Tinggi 5 cm, size 36–40",
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
      ),
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
            <button class="btn btn-primary btn-block" style="margin-bottom:8px" data-cart data-name="${item.name}" data-sub="${sub}">+ Tambah ke Keranjang</button>
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

  groupsWrap.querySelectorAll("[data-cart]").forEach((btn) => {
    btn.addEventListener("click", () =>
      addToCart(btn.dataset.name, btn.dataset.sub),
    );
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

/* ---------- FAQ Accordion (faq.html) ---------- */
function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;

    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Tutup item lain di kategori yang sama (biar rapi)
      const parent = item.closest(".faq-cat");
      if (parent) {
        parent.querySelectorAll(".faq-item.open").forEach((other) => {
          if (other !== item) {
            other.classList.remove("open");
            const oa = other.querySelector(".faq-a");
            if (oa) oa.style.maxHeight = null;
          }
        });
      }

      item.classList.toggle("open", !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + "px" : null;
    });
  });
}

/* =========================================================
   KERANJANG, CHECKOUT & CEK PEMBAYARAN
   - Data keranjang & pesanan disimpan di localStorage perangkat pembeli.
   - Pembayaran manual via WhatsApp. Admin mengonfirmasi dengan
     mengirim LINK STATUS (dibuat di cek-pembayaran.html#admin).
   - Isi harga per produk di PRICES agar total dihitung otomatis.
   ========================================================= */
const PRICES = {}; // contoh: { "Kaos Oversize": 45000, "Celana Jeans": 120000 }
const STAGES = [
  ["menunggu", "Menunggu pembayaran"],
  ["dibayar", "Pembayaran diterima"],
  ["diproses", "Pesanan diproses"],
  ["dikirim", "Dikirim"],
  ["selesai", "Selesai"],
];
const store = {
  get(k, d) {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v ?? d;
    } catch (e) {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  },
};
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const rp = (n) => "Rp " + Number(n).toLocaleString("id-ID");
const waUrl = (t) =>
  `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(t)}`;
const orderSig = (id, s) => {
  let h = 5381;
  for (const ch of `${id}|${s}|${CONFIG.adminPin}`)
    h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0;
  return h.toString(36);
};
const getCart = () => store.get("bagina_cart", []);
function saveCart(c) {
  store.set("bagina_cart", c);
  updateCartBadge();
}
function updateCartBadge() {
  const n = getCart().reduce((a, i) => a + i.qty, 0);
  document.querySelectorAll(".cart-badge").forEach((b) => {
    b.textContent = n;
    b.dataset.n = n;
  });
}
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 1800);
}
function addToCart(name, sub) {
  const c = getCart(),
    id = `${sub} — ${name}`;
  const f = c.find((i) => i.id === id);
  f ? f.qty++ : c.push({ id, name, sub, qty: 1 });
  saveCart(c);
  toast("Ditambahkan ke keranjang ✓");
}

/* ikon keranjang di navbar + link di footer (otomatis di semua halaman) */
function initCartUI() {
  const right = document.querySelector(".nav-right");
  if (right) {
    const a = document.createElement("a");
    a.href = "cart.html";
    a.className = "cart-link";
    a.setAttribute("aria-label", "Keranjang");
    a.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"></path></svg><span class="cart-badge" data-n="0"></span>`;
    right.prepend(a);
  }
  document.querySelectorAll(".footer-col").forEach((col) => {
    if (col.querySelector("h5")?.textContent.trim() === "Halaman") {
      col.insertAdjacentHTML(
        "beforeend",
        `<a href="cart.html">Keranjang</a><a href="cek-pembayaran.html">Cek Pembayaran</a>`,
      );
    }
  });
  updateCartBadge();
}

/* ---------- Halaman keranjang (cart.html) ---------- */
function initCartPage() {
  const root = document.getElementById("cart-root");
  if (!root) return;
  // tombol ke cek pembayaran: hanya muncul kalau sudah pernah membuat pesanan
  const trackBtn = () =>
    store.get("bagina_orders", []).length
      ? `<div class="cart-card cart-empty" style="margin-top:20px"><h2>Sudah punya pesanan?</h2><p>Cek apakah pembayaranmu sudah diterima dan sampai mana prosesnya.</p><a class="btn btn-primary" href="cek-pembayaran.html">Cek Status Pembayaran →</a></div>`
      : "";
  function render() {
    const c = getCart();
    if (!c.length) {
      root.innerHTML =
        `<div class="cart-card cart-empty"><h2>Keranjangmu masih kosong</h2><p>Pilih produk dulu, lalu klik "Tambah ke Keranjang".</p><a class="btn btn-primary" href="produk.html">Lihat Produk</a></div>` +
        trackBtn();
      return;
    }
    let total = 0,
      known = true;
    const rows = c
      .map((i, idx) => {
        const p = PRICES[i.name];
        p ? (total += p * i.qty) : (known = false);
        return `<div class="cart-row"><div><strong>${esc(i.name)}</strong><small>${esc(i.sub)}${p ? " · " + rp(p) + "/pcs" : ""}</small></div>
        <div class="qty"><button type="button" data-q="${idx}" data-d="-1">−</button><span>${i.qty}</span><button type="button" data-q="${idx}" data-d="1">+</button></div>
        <button type="button" class="cart-del" data-rm="${idx}" aria-label="Hapus">✕</button></div>`;
      })
      .join("");
    root.innerHTML =
      `<div class="cart-grid">
      <div class="cart-card"><h2>Pesanan (${c.length} produk)</h2>${rows}
        <p class="cart-note">Rincian ukuran/warna bisa kamu tulis di kolom catatan.</p></div>
      <div class="cart-card"><h2>Data Pengiriman</h2>
        <form id="checkout-form" class="cart-form">
          <label for="f-nama">Nama</label><input id="f-nama" required>
          <label for="f-wa">No. WhatsApp</label><input id="f-wa" type="tel" required placeholder="08xxxxxxxxxx">
          <label for="f-alamat">Alamat lengkap</label><textarea id="f-alamat" rows="3" required></textarea>
          <label for="f-eks">Ekspedisi</label><select id="f-eks"><option>JNE</option><option>J&amp;T</option><option>SiCepat</option><option>Lainnya</option></select>
          <label for="f-cat">Catatan (ukuran, warna, dll)</label><textarea id="f-cat" rows="2"></textarea>
          <div class="cart-sum"><span>Total</span><span>${known ? rp(total) : "Dikonfirmasi admin"}</span></div>
          <p class="cart-note">Minimal order Rp 2.500.000. Ongkir belum termasuk. Pembayaran dilakukan via transfer; nomor rekening dikirim admin lewat WhatsApp.</p>
          <button class="btn btn-accent btn-block">Buat Pesanan &amp; Bayar via WhatsApp</button>
        </form></div></div>` + trackBtn();
    root.querySelectorAll("[data-q]").forEach((b) =>
      b.addEventListener("click", () => {
        const cart = getCart(),
          it = cart[b.dataset.q];
        it.qty = Math.max(1, it.qty + Number(b.dataset.d));
        saveCart(cart);
        render();
      }),
    );
    root.querySelectorAll("[data-rm]").forEach((b) =>
      b.addEventListener("click", () => {
        const cart = getCart();
        cart.splice(b.dataset.rm, 1);
        saveCart(cart);
        render();
      }),
    );
    root.querySelector("#checkout-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (id) => root.querySelector(id).value.trim();
      const d = new Date(),
        pad = (n) => String(n).padStart(2, "0");
      const id = `BGN-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const cust = {
        nama: v("#f-nama"),
        wa: v("#f-wa"),
        alamat: v("#f-alamat"),
        eks: v("#f-eks"),
        cat: v("#f-cat"),
      };
      const order = {
        id,
        date: Date.now(),
        items: c,
        total: known ? total : null,
        cust,
        status: "menunggu",
      };
      store.set("bagina_orders", [order, ...store.get("bagina_orders", [])]);
      store.set("bagina_last", id);
      const lines = c
        .map((i, n) => `${n + 1}. ${i.sub} — ${i.name} x${i.qty}`)
        .join("\n");
      const msg = `Halo ${CONFIG.storeName}, saya mau checkout pesanan *${id}*\n\n*Pesanan:*\n${lines}\n\n*Total:* ${known ? rp(total) : "mohon dihitungkan"}\n\n*Data pengiriman:*\nNama: ${cust.nama}\nWA: ${cust.wa}\nAlamat: ${cust.alamat}\nEkspedisi: ${cust.eks}\nCatatan: ${cust.cat || "-"}\n\nMohon info total & nomor rekening untuk pembayaran. Bukti transfer saya kirim setelah ini ya!`;
      saveCart([]);
      window.open(waUrl(msg), "_blank", "noopener");
      location.href = "cek-pembayaran.html?id=" + encodeURIComponent(id);
    });
  }
  render();
}

/* ---------- Halaman cek pembayaran (cek-pembayaran.html) ---------- */
function initStatusPage() {
  const root = document.getElementById("status-root");
  if (!root) return;
  const q = new URLSearchParams(location.search);
  const orders = store.get("bagina_orders", []);
  const statuses = store.get("bagina_status", {});
  let id = (q.get("id") || "").trim().toUpperCase();
  const s = q.get("s"),
    k = q.get("k");
  let html = "";
  if (id && s && k) {
    if (STAGES.some((x) => x[0] === s) && k === orderSig(id, s)) {
      statuses[id] = s;
      store.set("bagina_status", statuses);
      html += `<div class="cart-alert">✓ Status diperbarui dari konfirmasi admin.</div>`;
    } else
      html += `<div class="cart-alert">Link konfirmasi tidak valid. Hubungi admin lewat WhatsApp.</div>`;
  }
  if (!id) id = store.get("bagina_last", "");
  const order = orders.find((o) => o.id === id);
  const cur = statuses[id] || (order ? order.status : null);

  html += `<div class="cart-card"><h2>Cek Status Pesanan</h2><form id="find-form" class="cart-form">
    <label for="oid">Nomor pesanan</label><input id="oid" placeholder="BGN-260102-AB12" value="${esc(id)}" required>
    <button class="btn btn-primary btn-block" style="margin-top:14px">Cek Status</button></form></div>`;

  if (id && cur) {
    const idx = STAGES.findIndex((x) => x[0] === cur);
    const items = order
      ? order.items.map((i) => `<li>${esc(i.name)} × ${i.qty}</li>`).join("")
      : "";
    html += `<div class="cart-card" style="margin-top:20px">
      <h2>${esc(id)} <span class="status-badge ${idx > 0 ? "ok" : ""}">${STAGES[idx][1]}</span></h2>
      <ul class="timeline">${STAGES.map((st, i) => `<li class="${i <= idx ? "done" : ""} ${i === idx ? "now" : ""}">${st[1]}</li>`).join("")}</ul>
      ${order ? `<p class="cart-note"><strong>Pesanan atas nama ${esc(order.cust.nama)}</strong></p><ul>${items}</ul><p class="cart-note">Total: ${order.total ? rp(order.total) : "dikonfirmasi admin"}</p>` : ""}
      ${idx === 0 ? `<p class="cart-note">Transfer sesuai nominal dari admin, lalu kirim bukti transfer lewat WhatsApp. Admin akan mengirim link konfirmasi setelah pembayaran diterima.</p>` : ""}
      <a class="btn btn-accent" target="_blank" rel="noopener" href="${waUrl(`Halo ${CONFIG.storeName}, ini bukti transfer untuk pesanan ${id}.`)}">Kirim Bukti Transfer</a>
      <a class="btn btn-ghost" target="_blank" rel="noopener" href="${waUrl(`Halo ${CONFIG.storeName}, mau tanya status pesanan ${id}.`)}">Tanya Admin</a></div>`;
  } else if (id) {
    html += `<div class="cart-card" style="margin-top:20px"><p>Pesanan <strong>${esc(id)}</strong> belum tercatat di perangkat ini dan belum ada konfirmasi admin. Kalau kamu memesan dari perangkat lain, tanyakan ke admin.</p>
      <a class="btn btn-accent" target="_blank" rel="noopener" href="${waUrl(`Halo ${CONFIG.storeName}, mau tanya status pesanan ${id}.`)}">Tanya Admin</a></div>`;
  }

  if (location.hash === "#admin") {
    html += `<div class="cart-card cart-form" style="margin-top:20px"><h2>Admin: buat link konfirmasi</h2>
      <label>Nomor pesanan</label><input id="a-id" value="${esc(id)}">
      <label>Status</label><select id="a-st">${STAGES.map((x) => `<option value="${x[0]}">${x[1]}</option>`).join("")}</select>
      <label>PIN admin</label><input id="a-pin" type="password">
      <button type="button" id="a-go" class="btn btn-primary btn-block" style="margin-top:14px">Buat Link</button>
      <input id="a-out" readonly style="margin-top:12px" placeholder="Link muncul di sini, salin & kirim ke pembeli"></div>`;
  }
  root.innerHTML = html;

  root.querySelector("#find-form").addEventListener("submit", (e) => {
    e.preventDefault();
    location.href =
      "cek-pembayaran.html?id=" +
      encodeURIComponent(root.querySelector("#oid").value.trim());
  });
  const go = root.querySelector("#a-go");
  if (go)
    go.addEventListener("click", () => {
      if (root.querySelector("#a-pin").value !== CONFIG.adminPin)
        return toast("PIN salah");
      const aid = root.querySelector("#a-id").value.trim().toUpperCase(),
        st = root.querySelector("#a-st").value;
      const out = root.querySelector("#a-out");
      out.value = `${location.origin}${location.pathname}?id=${encodeURIComponent(aid)}&s=${st}&k=${orderSig(aid, st)}`;
      out.select();
    });
}