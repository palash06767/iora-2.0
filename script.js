const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const cursor = document.querySelector(".cursor");
const cursorRing = document.querySelector(".cursor-ring");

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReduced && window.Lenis) {
  const lenis = new Lenis({
    duration: 1.35,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}, { passive: true });

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });
});

if (!prefersReduced && cursor && cursorRing && matchMedia("(pointer:fine)").matches) {
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }, { passive: true });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }

  renderCursor();

  document.querySelectorAll("a, button, .portfolio-item").forEach((item) => {
    item.addEventListener("mouseenter", () => cursorRing.classList.add("is-hovering"));
    item.addEventListener("mouseleave", () => cursorRing.classList.remove("is-hovering"));
  });
}

if (!prefersReduced && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".reveal").forEach((element) => {
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 1.25,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 84%"
      }
    });
  });

  gsap.utils.toArray(".parallax-media img").forEach((image) => {
    gsap.to(image, {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: image.closest(".panel, .story-panel"),
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  gsap.utils.toArray(".portfolio-item").forEach((item, index) => {
    gsap.fromTo(item,
      { clipPath: "inset(10% 0 10% 0)" },
      {
        clipPath: "inset(0% 0 0% 0)",
        duration: 1.15,
        delay: (index % 4) * 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 86%"
        }
      }
    );
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "none";
  });
}
