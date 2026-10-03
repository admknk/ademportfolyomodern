/* Adem Kınık — Portfolyo (Modern) etkileşimleri */

// Yeni çizim eklemek için assets/works/ klasörüne "<slug>.jpg" ve "<slug>-sm.jpg"
// koyup buraya bir satır ekleyin.
const WORKS = [
  { slug: "sakalli-genc",           title: "Sakallı Genç",        tech: "Pastel",           tags: ["portre", "renkli"],     w: 564, h: 720 },
  { slug: "rembrandt-calismasi",    title: "Rembrandt Etüdü",     tech: "Karakalem",        tags: ["portre", "karakalem"],  w: 558, h: 720 },
  { slug: "iris",                   title: "İris",                tech: "Kuru boya",        tags: ["renkli"],               w: 720, h: 435 },
  { slug: "seyyar-tamirci",         title: "Seyyar Tamirci",      tech: "Kurşun kalem",     tags: ["figur", "karakalem"],   w: 540, h: 720 },
  { slug: "gumus-ibrik",            title: "Gümüş İbrik",         tech: "Suluboya",         tags: ["renkli"],               w: 521, h: 720 },
  { slug: "pencere-isigi",          title: "Pencere Işığı",       tech: "Karakalem",        tags: ["portre", "karakalem"],  w: 470, h: 720 },
  { slug: "okul-bahcesi",           title: "Okul Bahçesi",        tech: "Boya",             tags: ["renkli", "figur"],      w: 536, h: 708 },
  { slug: "sirtinda-tasimak",       title: "Sırtında Taşımak",    tech: "Renkli kalem",     tags: ["figur"],                w: 540, h: 720 },
  { slug: "genc-portre",            title: "Genç Portre",         tech: "Karakalem",        tags: ["portre", "karakalem"],  w: 540, h: 720 },
  { slug: "takim-elbiseli-portre",  title: "Takım Elbiseli",      tech: "Kuru boya",        tags: ["portre", "renkli"],     w: 540, h: 720 },
  { slug: "flut-calan-cocuk",       title: "Flüt Çalan Çocuk",    tech: "Sepya · 1 saat",   tags: ["figur"],                w: 540, h: 720 },
  { slug: "aile-portresi",          title: "Aile Portresi",       tech: "Kurşun kalem",     tags: ["portre", "karakalem"],  w: 720, h: 540 },
  { slug: "bekleyis",               title: "Bekleyiş",            tech: "Kurşun kalem",     tags: ["figur", "karakalem"],   w: 516, h: 720 },
  { slug: "eskiz-defteri-askerler", title: "Eskiz Defteri",       tech: "Kurşun kalem",     tags: ["figur", "karakalem"],   w: 720, h: 593 },
];

const ACCENTS = ["var(--violet)", "var(--pink)", "var(--cyan)", "var(--lime)", "var(--amber)"];

const gallery = document.getElementById("gallery");
const pad = (n) => String(n).padStart(2, "0");

// ---------- render gallery ----------
gallery.innerHTML = WORKS.map((w, i) => `
  <figure class="card reveal" data-index="${i}" data-tags="${w.tags.join(" ")}"
          style="--accent:${ACCENTS[i % ACCENTS.length]}"
          tabindex="0" role="button" aria-label="${w.title} — büyüt">
    <span class="card-num">${pad(i + 1)}</span>
    <div class="card-frame">
      <img src="assets/works/${w.slug}-sm.jpg" alt="${w.title} — ${w.tech}"
           width="${w.w}" height="${w.h}" loading="lazy" decoding="async">
    </div>
    <figcaption>
      <span class="card-title">${w.title}</span>
      <span class="card-tech">${w.tech}</span>
    </figcaption>
  </figure>`).join("");

document.getElementById("work-count").textContent = WORKS.length;

const cards = [...gallery.querySelectorAll(".card")];

// ---------- reveal on scroll ----------
function observeReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: .08 });
  els.forEach((e) => io.observe(e));
}
observeReveal();

// ---------- filters ----------
let activeFilter = "all";
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c === chip));
    activeFilter = chip.dataset.filter;
    let count = 0;
    cards.forEach((card) => {
      const show = activeFilter === "all" || card.dataset.tags.split(" ").includes(activeFilter);
      card.style.display = show ? "" : "none";
      if (show) {
        count++;
        card.style.animation = "none";
        void card.offsetWidth;
        card.style.animation = "";
      }
    });
    document.getElementById("work-count").textContent = count;
  });
});

// ---------- lightbox ----------
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
let current = 0;
let lastFocus = null;

function visibleIndexes() {
  return cards
    .filter((c) => c.style.display !== "none")
    .map((c) => Number(c.dataset.index));
}

function show(i) {
  current = i;
  const w = WORKS[i];
  lbImg.style.animation = "none";
  void lbImg.offsetWidth;
  lbImg.style.animation = "";
  lbImg.src = `assets/works/${w.slug}.jpg`;
  lbImg.alt = `${w.title} — ${w.tech}`;
  document.getElementById("lb-title").textContent = w.title;
  document.getElementById("lb-meta").textContent = w.tech;
  document.getElementById("lb-num").textContent = `${pad(i + 1)} / ${pad(WORKS.length)}`;
  [step(1), step(-1)].forEach((j) => { new Image().src = `assets/works/${WORKS[j].slug}.jpg`; });
}

function step(dir) {
  const list = visibleIndexes().length ? visibleIndexes() : WORKS.map((_, i) => i);
  const pos = list.indexOf(current);
  return list[(pos + dir + list.length) % list.length];
}

function open(i) {
  lastFocus = document.activeElement;
  show(i);
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  lb.querySelector(".lb-close").focus();
}

function close() {
  lb.hidden = true;
  document.body.style.overflow = "";
  lastFocus && lastFocus.focus();
}

gallery.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) open(Number(card.dataset.index));
});
gallery.addEventListener("keydown", (e) => {
  const card = e.target.closest(".card");
  if (card && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    open(Number(card.dataset.index));
  }
});

// hero showcase cards open their work
document.querySelectorAll(".show-card").forEach((s) => {
  s.addEventListener("click", () => {
    const slug = s.querySelector("img").src.split("/").pop().replace("-sm.jpg", "");
    const i = WORKS.findIndex((w) => w.slug === slug);
    if (i >= 0) open(i);
  });
});

lb.querySelector(".lb-close").addEventListener("click", close);
lb.querySelector(".lb-prev").addEventListener("click", () => show(step(-1)));
lb.querySelector(".lb-next").addEventListener("click", () => show(step(1)));
lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-figure")) close(); });

document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowRight") show(step(1));
  if (e.key === "ArrowLeft") show(step(-1));
  if (e.key === "Tab") {
    const f = [...lb.querySelectorAll("button")];
    const idx = f.indexOf(document.activeElement);
    e.preventDefault();
    f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
  }
});

// swipe on touch
let touchX = null;
lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) show(step(dx < 0 ? 1 : -1));
  touchX = null;
});

// ---------- order form → mailto ----------
const form = document.getElementById("order-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = form.querySelector(".form-msg");
  const data = new FormData(form);
  const name = data.get("name").trim();
  const text = data.get("msg").trim();
  if (!name || !text) {
    msg.textContent = "✎ adını ve mesajını yazmayı unutma!";
    msg.style.color = "var(--amber)";
    return;
  }
  const email = document.querySelector('a[href^="mailto:"]').getAttribute("href").replace("mailto:", "");
  const subject = encodeURIComponent(`Sipariş: ${data.get("type")} — ${name}`);
  const body = encodeURIComponent(`Merhaba Adem,\n\n${text}\n\n— ${name}`);
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  msg.textContent = "✓ e-posta uygulaman açılıyor, teşekkürler!";
  msg.style.color = "var(--lime)";
});

// nav background on scroll
window.addEventListener("scroll", () => {
  document.getElementById("nav").style.background = scrollY > 30
    ? "rgba(18, 18, 31, .82)"
    : "rgba(18, 18, 31, .62)";
}, { passive: true });

document.getElementById("year").textContent = new Date().getFullYear();
