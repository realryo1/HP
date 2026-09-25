(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector("#site-nav");
  const topButton = document.querySelector(".back-to-top");

  const blockData = {
    1: { content: "ウインターアトラクションなど", description: "会場の入口から、冬の街歩きをスタートする丁目。" },
    2: { content: "札幌国際芸術祭2027", description: "雪まつりとあわせて、札幌のアートに出会う丁目。" },
    3: { content: "小雪像など", description: "歩くほどに表情が変わる、中小雪像などを楽しむ丁目。" },
    4: { content: "大雪像", description: "大通会場の見どころのひとつ。まずはここから、街のスケールを感じてみよう。" },
    5: { content: "大雪像", description: "大きな雪の造形を見上げながら、会場の熱気を感じる丁目。" },
    6: { content: "中小雪像など", description: "さまざまな雪の表現を見つけながら歩く丁目。" },
    7: { content: "大雪像", description: "大雪像を中心に、夜のライトアップも楽しみたい丁目。" },
    8: { content: "大雪像", description: "雪と光がつくる景色を、ゆっくり味わう丁目。" },
    9: { content: "中小雪像など", description: "会場を歩く楽しさが続く、中小雪像などの丁目。" },
    10: { content: "大雪像", description: "端から端へ歩いてきた人を迎える、大雪像の丁目。" },
    11: { content: "国際雪像コンクールなど", description: "大通会場の端で、国際色豊かな雪の表現に出会う丁目。" }
  };

  function updateScrollState() {
    const scrolled = window.scrollY > 20;
    if (header) header.classList.toggle("is-scrolled", scrolled);
    if (topButton) topButton.classList.toggle("is-visible", window.scrollY > 500);
  }

  function createSnow() {
    const layer = document.querySelector("#snow-layer");
    if (!layer || prefersReducedMotion) return;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 40; i += 1) {
      const flake = document.createElement("span");
      flake.style.setProperty("--left", `${Math.random() * 100}%`);
      flake.style.setProperty("--size", `${Math.random() * 4 + 2}px`);
      flake.style.setProperty("--duration", `${Math.random() * 14 + 12}s`);
      flake.style.setProperty("--delay", `${Math.random() * -20}s`);
      flake.style.setProperty("--drift", `${Math.random() * 100 - 50}px`);
      flake.style.setProperty("--opacity", `${Math.random() * 0.55 + 0.25}`);
      fragment.appendChild(flake);
    }
    layer.appendChild(fragment);
  }

  function setupReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
  }

  function selectBlock(blockNumber) {
    const data = blockData[blockNumber];
    if (!data) return;
    document.querySelectorAll("[data-block]").forEach((button) => {
      const selected = button.dataset.block === String(blockNumber);
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    const label = document.querySelector("#block-label");
    const content = document.querySelector("#block-content");
    const description = document.querySelector("#block-description");
    if (label) label.textContent = String(blockNumber).padStart(2, "0");
    if (content) content.textContent = data.content;
    if (description) description.textContent = data.description;
  }

  function setupBlocks() {
    document.querySelectorAll("[data-block]").forEach((button) => {
      button.addEventListener("click", () => selectBlock(button.dataset.block));
    });
  }

  function setupMenu() {
    if (!menuToggle || !siteNav) return;
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      siteNav.classList.toggle("is-open", !isOpen);
    });
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("is-open");
      });
    });
  }

  function setupTopButton() {
    if (!topButton) return;
    topButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());
  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();
  createSnow();
  setupReveal();
  setupBlocks();
  setupMenu();
  setupTopButton();
})();
