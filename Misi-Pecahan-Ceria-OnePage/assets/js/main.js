// Misi Pecahan Ceria — navigation and fraction explorer
(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const header = document.querySelector(".site-header");
  const navLinks = [...document.querySelectorAll(".nav-link")];

  // Mobile navigation
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Buka menu navigasi" : "Tutup menu navigasi");
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Buka menu navigasi");
        nav.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Buka menu navigasi");
        nav.classList.remove("is-open");
      }
    });
  }

  // Header shadow while scrolling
  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Highlight the navigation link for the section currently in view
  const sections = navLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            const active = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      });
    }, { rootMargin: "-28% 0px -60% 0px", threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Interactive fraction explorer
  const choices = document.querySelectorAll(".fraction-choice");
  const fractionOutput = document.getElementById("explorer-fraction");
  const bar = document.getElementById("explorer-bar");
  const nameOutput = document.getElementById("explorer-name");
  const descriptionOutput = document.getElementById("explorer-description");

  const names = {
    "1/2": "Satu perdua",
    "1/4": "Satu perempat",
    "2/4": "Dua perempat",
    "3/4": "Tiga perempat"
  };

  function showFraction(numerator, denominator, selectedButton) {
    const key = `${numerator}/${denominator}`;
    fractionOutput.textContent = key;
    nameOutput.textContent = names[key];
    descriptionOutput.textContent = `${numerator} bahagian diwarnakan daripada ${denominator} bahagian yang sama besar.`;
    bar.replaceChildren();

    for (let i = 0; i < denominator; i += 1) {
      const segment = document.createElement("span");
      if (i < numerator) segment.classList.add("filled");
      bar.appendChild(segment);
    }
    bar.setAttribute("aria-label", `${numerator} daripada ${denominator} bahagian diwarnakan`);

    choices.forEach(button => {
      const active = button === selectedButton;
      button.classList.toggle("selected", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  choices.forEach(button => {
    button.addEventListener("click", () => {
      showFraction(
        Number(button.dataset.numerator),
        Number(button.dataset.denominator),
        button
      );
    });
  });

  // Footer year
  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();
})();
