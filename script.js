const root = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

if (!prefersReducedMotion) {
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;

    const px = (event.clientX / window.innerWidth - 0.5) * 30;
    const py = (event.clientY / window.innerHeight - 0.5) * 20;

    root.style.setProperty("--parallax-x", `${px}px`);
    root.style.setProperty("--parallax-y", `${py}px`);
  }, { passive: true });

  function animateCursorGlow() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    root.style.setProperty("--mx", `${currentX}px`);
    root.style.setProperty("--my", `${currentY}px`);

    requestAnimationFrame(animateCursorGlow);
  }

  animateCursorGlow();
}

const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.14,
  rootMargin: "0px 0px -8% 0px"
});

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 60, 360)}ms`;
  revealObserver.observe(item);
});

const cards = document.querySelectorAll(".brand-card, .use-card, .acquisition-panel");

cards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const localX = ((event.clientX - rect.left) / rect.width) * 100;
    const localY = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--mx-local", `${localX}%`);
    card.style.setProperty("--my-local", `${localY}%`);
  }, { passive: true });
});

const magneticButtons = document.querySelectorAll(".magnetic");

if (!prefersReducedMotion) {
  magneticButtons.forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${clamp(x * 0.055, -8, 8)}px, ${clamp(y * 0.08, -8, 8)}px)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "translate(0, 0)";
    });
  });
}

const header = document.querySelector(".site-header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  const opacity = clamp(y / 260, 0, 1);

  header.style.background = `linear-gradient(180deg, rgba(3, 4, 10, ${0.72 + opacity * 0.18}), rgba(3, 4, 10, ${opacity * 0.38}))`;
  header.style.borderBottom = opacity > 0.22 ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent";

  lastScroll = y;
}, { passive: true });
