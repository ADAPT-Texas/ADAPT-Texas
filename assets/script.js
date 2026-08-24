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

/**
 * ADAPT Texas — sitewide dismissible banner
 * ------------------------------------------
 * HOW TO USE:
 * 1. Save this file as /assets/banner.js on your site (next to your other assets).
 * 2. Edit the CONFIG section below (message, link, color).
 * 3. Add this one line before the closing </body> tag on every page:
 *      <script src="/assets/banner.js"></script>
 * 4. Done. The banner appears at the top of every page that includes the script.
 *    Once someone clicks the X, it won't show again for them for 7 days
 *    (change DISMISS_DAYS below to control that, or set to 0 to show every visit).
 */

(function () {
  // ------------- CONFIG: edit these -------------
  const CONFIG = {
    message: "📣 ADAPT Texas Info Session 1 & 2 Coming Up!!",
    linkText: "Learn more",
    linkUrl: "https://forms.gle/UsU5ntxZbC3WqeBdA", // set to "" to hide the link
    bgColor: "#6a1b9a",      // ADAPT purple — change if you'd like
    textColor: "#ffffff",
    dismissDays: 7,          // days before the banner reappears after being closed; 0 = always show
    storageKey: "adapt_banner_dismissed_v1" // bump the "_v1" when you change the message,
                                             // so people who already dismissed the old one see the new one
  };
  // ------------------------------------------------

  function isDismissed() {
    if (CONFIG.dismissDays === 0) return false;
    const stored = localStorage.getItem(CONFIG.storageKey);
    if (!stored) return false;
    const dismissedAt = parseInt(stored, 10);
    const msElapsed = Date.now() - dismissedAt;
    const msLimit = CONFIG.dismissDays * 24 * 60 * 60 * 1000;
    return msElapsed < msLimit;
  }

  function dismiss(banner) {
    localStorage.setItem(CONFIG.storageKey, Date.now().toString());
    banner.style.transform = "translateY(-100%)";
    setTimeout(() => banner.remove(), 250);
    document.body.style.marginTop = "";
  }

  function buildBanner() {
    const banner = document.createElement("div");
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Site announcement");
    banner.style.cssText = `
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: ${CONFIG.bgColor};
      color: ${CONFIG.textColor};
      font-family: inherit;
      font-size: 15px;
      padding: 10px 44px 10px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
      text-align: center;
      transition: transform 0.25s ease;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    `;

    const text = document.createElement("span");
    text.textContent = CONFIG.message;
    banner.appendChild(text);

    if (CONFIG.linkUrl) {
      const link = document.createElement("a");
      link.href = CONFIG.linkUrl;
      link.textContent = CONFIG.linkText;
      link.style.cssText = `color: ${CONFIG.textColor}; text-decoration: underline; font-weight: 600; white-space: nowrap;`;
      banner.appendChild(link);
    }

    const closeBtn = document.createElement("button");
    closeBtn.setAttribute("aria-label", "Close announcement");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = `
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: ${CONFIG.textColor};
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      padding: 4px 8px;
    `;
    closeBtn.addEventListener("click", () => dismiss(banner));
    banner.appendChild(closeBtn);

    return banner;
  }

  function init() {
    if (isDismissed()) return;
    const banner = buildBanner();
    document.body.prepend(banner);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
