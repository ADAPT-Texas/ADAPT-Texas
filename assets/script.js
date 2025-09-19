const hamburger = document.querySelector(".hamburger");
const navMenu   = document.querySelector(".tabs");
const dropdownButtons = document.querySelectorAll(".dropdown-button");

// 1) Attach submenu‐toggle handlers once
dropdownButtons.forEach(btn => {
  btn.addEventListener("click", e => {
    if (!navMenu.classList.contains("active")) return;  
    e.preventDefault();
    btn.parentElement.classList.toggle("active");
  });
});


hamburger.addEventListener("click", () => {
  // Are we opening the menu now?
  const willOpen = !navMenu.classList.contains("active");

  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
  document.body.classList.toggle("menu-open");

  // 2) If we just closed it, collapse _all_ submenus
  if (!willOpen) {
    document.querySelectorAll(".dropdown.active")
            .forEach(drop => drop.classList.remove("active"));
  }
});

const faders = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,   // fire when 10% of the element is visible
  rootMargin: '0px 0px -50% 0px', // only trigger when the element is in the bottom 20% of the viewport
});

faders.forEach(el => fadeObserver.observe(el));