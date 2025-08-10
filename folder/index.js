// Bootstrap with dynamic imports and fallbacks so it works even if some CDNs fail
(async () => {
  // GSAP core
  let gsap;
  try {
    ({ default: gsap } = await import(
      "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js"
    ));
  } catch (e) {
    console.error("GSAP failed to load", e);
    return;
  }

  // CustomEase (optional)
  try {
    const { CustomEase } = await import(
      "https://cdn.jsdelivr.net/npm/gsap@3.12.5/CustomEase.js"
    );
    gsap.registerPlugin(CustomEase);
    CustomEase.create("hop", "0.87, 0, 0.13, 1");
  } catch (e) {
    // Continue without CustomEase
  }

  // Lenis smooth scroll (optional)
  let lenis;
  try {
    const { default: Lenis } = await import(
      "https://cdn.jsdelivr.net/npm/lenis@1.0.32/bundled/lenis.esm.min.js"
    );
    lenis = new Lenis();
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  } catch (e) {
    lenis = { stop: () => {}, start: () => {} };
  }

  // SplitText (optional)
  let SplitText;
  try {
    ({ SplitText } = await import(
      "https://cdn.jsdelivr.net/npm/gsap@3.12.5/SplitText.js"
    ));
  } catch (e) {
    SplitText = class {
      constructor(el) {
        this.lines = [el];
      }
    };
  }

  // Elements
  const container = document.querySelector(".container");
  const menuToggleBtn = document.querySelector(".menu-toggle-btn");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuMediaWrapper = document.querySelector(".menu-media-wrapper");
  const copyContainer = document.querySelectorAll(".menu-col");
  const menuToggleLabel = document.querySelector(".menu-toggle-label p");
  const hamburgerIcon = document.querySelector(".menu-hamburger-icon");

  if (!container || !menuOverlay) return;
  if (menuMediaWrapper) gsap.set(menuMediaWrapper, { opacity: 0 });

  // Split text init
  const splitTextByContainer = [];
  copyContainer.forEach((containerEl) => {
    const textElements = containerEl.querySelectorAll("a, p");
    const containerSplits = [];
    textElements.forEach((el) => {
      const split = new SplitText(el, {
        type: "lines",
        mask: "lines",
        lineClass: "line",
      });
      containerSplits.push(split);
      if (split.lines) gsap.set(split.lines, { y: "-110%", autoAlpha: 0 });
    });
    splitTextByContainer.push(containerSplits);
  });

  let isMenuOpen = false;
  let isAnimation = false;

  menuToggleBtn?.addEventListener("click", () => {
    if (isAnimation) return;
    if (!isMenuOpen) {
      isAnimation = true;
      lenis.stop();
      const tl = gsap.timeline({
        onComplete: () => {
          isMenuOpen = true;
          isAnimation = false;
        },
      });
      if (menuToggleLabel)
        tl.to(menuToggleLabel, { y: "-110%", duration: 1, ease: "hop" });
      if (container)
        tl.to(container, { y: "100vh", duration: 1, ease: "hop" }, "<");
      tl.to(
        menuOverlay,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "hop",
        },
        "<"
      );
      if (menuMediaWrapper)
        tl.to(menuMediaWrapper, {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          delay: 0.25,
        });
      splitTextByContainer.forEach((containerSplits) => {
        const lines = containerSplits.flatMap((s) => s.lines || []);
        if (lines.length) {
          tl.to(
            lines,
            {
              y: "0%",
              autoAlpha: 1,
              duration: 1.5,
              ease: "hop",
              stagger: -0.06,
            },
            -0.1
          );
        } else {
          tl.fromTo(
            copyContainer,
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, ease: "hop", stagger: 0.05 },
            -0.1
          );
        }
      });
      hamburgerIcon?.classList.add("active");
    } else {
      isAnimation = true;
      hamburgerIcon?.classList.remove("active");
      const tl = gsap.timeline({
        onComplete: () => {
          isMenuOpen = false;
          isAnimation = false;
          lenis.start();
        },
      });
      if (container) tl.to(container, { y: "0%", duration: 1, ease: "hop" });
      tl.to(
        menuOverlay,
        {
          clipPath: "polygon(0% 0%, 100% 0, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "hop",
        },
        "<"
      );
      if (menuToggleLabel)
        tl.to(menuToggleLabel, { y: "0%", duration: 1, ease: "hop" }, "<");
      tl.to(
        copyContainer,
        { autoAlpha: 0.25, duration: 0.6, ease: "hop" },
        "<"
      );
      if (menuMediaWrapper)
        tl.to(
          menuMediaWrapper,
          { opacity: 0, duration: 0.6, ease: "power1.out" },
          "<"
        );
      tl.call(() => {
        splitTextByContainer.forEach((containerSplits) => {
          const lines = containerSplits.flatMap((s) => s.lines || []);
          if (lines.length) gsap.set(lines, { y: "-110%", autoAlpha: 0 });
        });
        gsap.set(copyContainer, { autoAlpha: 1 });
      });
    }
  });
})();
