// ===== Theme toggle =====
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const stored = localStorage.getItem("theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const initial = stored || (prefersLight ? "light" : "dark");

  root.setAttribute("data-theme", initial);
  if (toggle) toggle.setAttribute("aria-pressed", String(initial === "dark"));

  toggle?.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    toggle.setAttribute("aria-pressed", String(next === "dark"));
    localStorage.setItem("theme", next);
  });
})();

// ===== Mobile menu =====
(function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navList = document.getElementById("nav-list");
  if (!menuToggle || !navList) return;

  function closeMenu() {
    navList.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }

  menuToggle.addEventListener("click", function () {
    const open = navList.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // Close when a link is clicked (mobile)
  navList.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
})();

// ===== Header shadow on scroll =====
(function () {
  const header = document.getElementById("site-header");
  if (!header) return;
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// ===== Scroll-spy active nav link =====
(function () {
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = links
    .map(function (link) {
      const id = link.getAttribute("href");
      return id && id.startsWith("#") ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = "#" + entry.target.id;
          links.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();

// ===== Reveal on scroll =====
(function () {
  const items = Array.from(document.querySelectorAll(".reveal"));
  if (items.length === 0) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(function (el) {
      el.classList.add("visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach(function (el, i) {
    el.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
    observer.observe(el);
  });
})();

// ===== Contact form validation =====
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");

  function setError(field, message) {
    const input = form.querySelector("#" + field);
    const error = form.querySelector('[data-error-for="' + field + '"]');
    if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message || "";
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name) { setError("name", "Please enter your name."); valid = false; }
    else setError("name", "");

    if (!email) { setError("email", "Please enter your email."); valid = false; }
    else if (!validateEmail(email)) { setError("email", "Please enter a valid email."); valid = false; }
    else setError("email", "");

    if (!message) { setError("message", "Please enter a message."); valid = false; }
    else setError("message", "");

    if (!valid) {
      if (status) { status.textContent = ""; }
      return;
    }

    if (status) status.textContent = "Thanks, " + name + "! Your message has been sent.";
    form.reset();
  });
})();

// ===== Footer year =====
(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
