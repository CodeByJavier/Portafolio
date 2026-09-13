initScrollReveal();
initSpotlight();
initProjectsCarousel();

function initScrollReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((item) => observer.observe(item));
}

function initSpotlight() {
  const cards = document.querySelectorAll(".project-feature");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--x", x + "%");
      card.style.setProperty("--y", y + "%");
    });
  });
}

function initProjectsCarousel() {
  const track = document.querySelector("[data-projects-track]");
  const dotsWrap = document.querySelector("[data-projects-dots]");
  const cards = document.querySelectorAll(".project-feature");
  if (!track) return;

  const slides = Array.from(track.children);

  // Un punto por proyecto; al hacer clic, centra ese proyecto en pantalla
  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Ir al proyecto " + (index + 1));
    dot.addEventListener("click", () => {
      slide.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
    if (dotsWrap) dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

  // Vigila, dentro del propio track, qué tarjeta está más visible ahora mismo
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = slides.indexOf(entry.target);
        dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
      });
    },
    { root: track, threshold: 0.6 }
  );
  slides.forEach((slide) => observer.observe(slide));

  // Arrastrar con el ratón
  let isDragging = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener("mousedown", (event) => {
    isDragging = true;
    track.classList.add("is-dragging");
    startX = event.pageX;
    startScroll = track.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    track.classList.remove("is-dragging");
  });

  window.addEventListener("mousemove", (event) => {
    if (!isDragging) return;
    event.preventDefault();
    const delta = event.pageX - startX;
    track.scrollLeft = startScroll - delta;
    cards.forEach((card) => {card.addEventListener("mouseup", (event) => {
      card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });});
    });
  });
}
