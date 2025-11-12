document.addEventListener("DOMContentLoaded", () => {
  const previews = document.querySelectorAll(".overlay");
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  const lightboxImg = lightbox.querySelector("img");
  const btnNext = lightbox.querySelector(".arrow-next");
  const btnPrev = lightbox.querySelector(".arrow-back");

  let currentIndex = 0;

  if (window.innerWidth > 768) {
    function openLightbox(index) {
      currentIndex = index;
      const img = previews[currentIndex].querySelector(".preview");
      lightboxImg.src = img.src;
      lightbox.classList.add("visible");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("visible");
      document.body.style.overflow = "";
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % previews.length;
      const img = previews[currentIndex].querySelector(".preview");
      lightboxImg.src = img.src;
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + previews.length) % previews.length;
      const img = previews[currentIndex].querySelector(".preview");
      lightboxImg.src = img.src;
    }

    previews.forEach((figure, index) => {
      figure.addEventListener("click", () => openLightbox(index));
    });

    btnNext.addEventListener("click", (e) => {
      e.stopPropagation();
      nextImage();
    });

    btnPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      prevImage();
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("visible")) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".abt-content");

  const navEntries = performance.getEntriesByType("navigation");
  const isReload = navEntries[0] && navEntries[0].type === "reload";

  if (!isReload) {
    elements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.5}s`;
      el.classList.add("animate-once");
    });
  } else {
    elements.forEach((el) => (el.style.animation = "none"));
  }

  if (
    navEntries[0] &&
    (navEntries[0].type === "reload" || navEntries[0].type === "back_forward")
  ) {
    elements.forEach((el) => (el.style.animation = "none"));
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".abt-content");

  const navEntries = performance.getEntriesByType("navigation");
  const isReload =
    navEntries[0] &&
    (navEntries[0].type === "reload" || navEntries[0].type === "back_forward");

  const fromOtherPage = document.referrer.includes(window.location.hostname);

  if (!isReload && !fromOtherPage) {
    elements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.5}s`;
      el.classList.add("animate-once");
    });
  } else {
    elements.forEach((el) => (el.style.animation = "none"));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const menuBurger = document.querySelector(".burger");
  const menu = document.querySelector(".menu");

  if (window.innerWidth > 768) {
    menu.classList.remove("active");
  }

  menuBurger.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      menu.classList.remove("active");
    }
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200 && menu.classList.contains("active")) {
      requestAnimationFrame(() => {
        menu.classList.remove("active");
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const scrollBtn = document.getElementById("scrollBtn");
  if (!scrollBtn) return;
  const scrollTo = document.getElementById("scrollTo");

  scrollBtn.addEventListener("click", () => {
    scrollTo.scrollIntoView({
      behavior: "smooth",
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".gallery-wrapper");
  const counter = document.getElementById("carousel-counter");

  if (!wrapper || !counter) return;
  if (window.innerWidth > 768) return;

  let origSlides = Array.from(wrapper.querySelectorAll(".overlay"));
  const total = origSlides.length;
  if (total === 0) return;

  wrapper.querySelectorAll(".overlay.clone").forEach((n) => n.remove());

  const firstClone = origSlides[0].cloneNode(true);
  const lastClone = origSlides[origSlides.length - 1].cloneNode(true);
  firstClone.classList.add("clone");
  lastClone.classList.add("clone");

  wrapper.insertBefore(lastClone, wrapper.firstChild);
  wrapper.appendChild(firstClone);

  let slides = Array.from(wrapper.querySelectorAll(".overlay"));

  function calcSlideCenters() {
    return slides.map((slide) => {
      const rect = slide.getBoundingClientRect();
      const left = slide.offsetLeft;
      const width = rect.width;
      const centerOffset = left + width / 2;
      return { left, width, centerOffset };
    });
  }

  let slideData = calcSlideCenters();
  let currentIndex = 1;
  let isJumping = false;
  let scrollTimeout = null;

  function scrollToIndex(index, behavior = "auto") {
    const sd = slideData[index];
    if (!sd) return;
    const target = sd.left - (wrapper.clientWidth - sd.width) / 2;
    wrapper.style.scrollBehavior = behavior;
    wrapper.scrollLeft = Math.round(target);
    if (behavior === "auto") {
      void wrapper.offsetWidth;
      wrapper.style.scrollBehavior = "smooth";
    }
  }

  function findClosestIndex() {
    const wrapperRect = wrapper.getBoundingClientRect();
    const centerX = wrapperRect.left + wrapperRect.width / 2;
    let closest = 0;
    let minDist = Infinity;
    slides.forEach((slide, i) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const dist = Math.abs(centerX - slideCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    return closest;
  }

  function toDisplayIndex(idx) {
    let disp = idx - 1;
    disp = ((disp % total) + total) % total;
    return disp + 1;
  }

  function refreshUI(idx) {
    slides.forEach((s) => s.classList.remove("active"));
    if (slides[idx]) slides[idx].classList.add("active");
    counter.textContent = `${toDisplayIndex(idx)} / ${total}`;
    currentIndex = idx;
  }

  function recalc() {
    slideData = calcSlideCenters();
    scrollToIndex(currentIndex, "auto");
  }

  function onScrollEnd() {
    const closest = findClosestIndex();

    if (closest === 0) {
      wrapper.style.scrollBehavior = "auto";

      const target =
        slideData[total].left -
        (wrapper.clientWidth - slideData[total].width) / 2;
      wrapper.scrollLeft = target;
      refreshUI(total);
      currentIndex = total;
      return;
    }

    if (closest === slides.length - 1) {
      wrapper.style.scrollBehavior = "auto";
      const target =
        slideData[1].left - (wrapper.clientWidth - slideData[1].width) / 2;
      wrapper.scrollLeft = target;
      refreshUI(1);
      currentIndex = 1;
      return;
    }

    wrapper.style.scrollBehavior = "smooth";
    scrollToIndex(closest, "smooth");
    refreshUI(closest);
    currentIndex = closest;
  }

  function handleScrollEvent() {
    if (isJumping) return;

    const closest = findClosestIndex();

    refreshUI(closest);

    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      onScrollEnd();
      scrollTimeout = null;
    }, 250);
  }

  requestAnimationFrame(() => {
    recalc();
    refreshUI(currentIndex);
  });

  wrapper.addEventListener("scroll", handleScrollEvent, { passive: true });
  ["touchend", "mouseup"].forEach((ev) => {
    wrapper.addEventListener(
      ev,
      () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          onScrollEnd();
          scrollTimeout = null;
        }, 80);
      },
      { passive: true }
    );
  });

  window.addEventListener("resize", () => {
    setTimeout(() => recalc(), 120);
  });

  wrapper.addEventListener("layout:changed", () => {
    setTimeout(() => {
      slideData = calcSlideCenters();
      scrollToIndex(currentIndex, "auto");
      refreshUI(currentIndex);
    }, 250);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const element = document.querySelector(".gallery-wrapper");
  if (!element) return;

  let msnry = null;
  let isDesktop = window.innerWidth > 768;

  function initMasonry() {
    if (window.innerWidth > 768 && !msnry) {
      imagesLoaded(element, function () {
        msnry = new Masonry(element, {
          itemSelector: ".overlay",
          columnWidth: ".overlay",
          percentPosition: true,
          gutter: 10,
        });
        element.dispatchEvent(new Event("layout:changed"));
      });
    } else if (window.innerWidth <= 768 && msnry) {
      msnry.destroy();
      msnry = null;
      element.removeAttribute("style");
      element.querySelectorAll(".overlay").forEach((item) => {
        item.removeAttribute("style");
      });
      element.dispatchEvent(new Event("masonry:toggled"));
    }
  }

  window.addEventListener("load", initMasonry);

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newIsDesktop = window.innerWidth > 768;
      if (newIsDesktop !== isDesktop) {
        isDesktop = newIsDesktop;
        initMasonry();
      }
    }, 200);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const scrollUpBtn = document.querySelector("#scrollUpBtn");
  const scrollUpTo = document.getElementById("scrollUpTo");
  if (!scrollUpBtn || !scrollUpTo) return;

  scrollUpBtn.addEventListener("click", () => {
    scrollUpTo.scrollIntoView({ behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      scrollUpBtn.classList.add("show");
    } else {
      scrollUpBtn.classList.remove("show");
    }
  });
});
