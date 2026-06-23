const root = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* Desktop-only pointer glow/parallax.
   Touch devices get the lighter CSS performance mode. */
if (!prefersReducedMotion && !isCoarsePointer && window.innerWidth > 720) {
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let ticking = false;

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        const px = (targetX / window.innerWidth - 0.5) * 24;
        const py = (targetY / window.innerHeight - 0.5) * 16;

        root.style.setProperty("--parallax-x", `${px}px`);
        root.style.setProperty("--parallax-y", `${py}px`);
        ticking = false;
      });

      ticking = true;
    }
  }, { passive: true });

  function animateCursorGlow() {
    currentX += (targetX - currentX) * 0.075;
    currentY += (targetY - currentY) * 0.075;

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
  item.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
  revealObserver.observe(item);
});

const cards = document.querySelectorAll(".brand-card, .use-card, .acquisition-panel");

if (!isCoarsePointer) {
  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const localX = ((event.clientX - rect.left) / rect.width) * 100;
      const localY = ((event.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty("--mx-local", `${localX}%`);
      card.style.setProperty("--my-local", `${localY}%`);
    }, { passive: true });
  });
}

const magneticButtons = document.querySelectorAll(".magnetic");

if (!prefersReducedMotion && !isCoarsePointer) {
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
let headerTicking = false;

window.addEventListener("scroll", () => {
  if (headerTicking) return;

  window.requestAnimationFrame(() => {
    const y = window.scrollY;
    const opacity = clamp(y / 260, 0, 1);

    header.style.background = `linear-gradient(180deg, rgba(3, 4, 10, ${0.72 + opacity * 0.18}), rgba(3, 4, 10, ${opacity * 0.38}))`;
    header.style.borderBottom = opacity > 0.22 ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent";

    headerTicking = false;
  });

  headerTicking = true;
}, { passive: true });
