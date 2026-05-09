export function createSlideController(root, options = {}) {
  const slides = Array.from(root.querySelectorAll(".story-slide"));
  const progress = root.querySelector("[data-progress]");
  const dots = root.querySelector("[data-dots]");
  const hint = root.querySelector("[data-hint]");
  const onChange = options.onChange || (() => {});
  let current = 0;
  let startX = 0;
  let startY = 0;
  let typingTimer = null;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `跳转到第 ${index + 1} 页`);
    dot.addEventListener("click", () => show(index));
    dots.appendChild(dot);
  });

  function typeActiveText(slide) {
    clearInterval(typingTimer);
    slides.forEach((item) => item.classList.remove("is-typed"));
    const target = slide.querySelector("[data-type]");
    if (!target) return;

    const text = target.dataset.type || "";
    let index = 0;
    target.textContent = "";
    typingTimer = setInterval(() => {
      target.textContent = text.slice(0, index);
      index += 1;
      if (index > text.length) {
        clearInterval(typingTimer);
        slide.classList.add("is-typed");
      }
    }, options.typeSpeed || 34);
  }

  function show(index) {
    current = Math.max(0, Math.min(index, slides.length - 1));
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === current);
      slide.setAttribute("aria-hidden", String(slideIndex !== current));
    });

    Array.from(dots.children).forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === current);
    });

    progress.textContent = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    hint.textContent = current === slides.length - 1 ? "上滑或右滑重新开始" : "上滑或右滑继续";
    typeActiveText(slides[current]);
    onChange(current, slides[current]);
  }

  function next() {
    show(current === slides.length - 1 ? 0 : current + 1);
  }

  function prev() {
    show(current === 0 ? slides.length - 1 : current - 1);
  }

  root.addEventListener("touchstart", (event) => {
    startX = event.changedTouches[0].clientX;
    startY = event.changedTouches[0].clientY;
  }, { passive: true });

  root.addEventListener("touchend", (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (Math.max(absX, absY) < 42) return;
    if (absY > absX) {
      deltaY < 0 ? next() : prev();
    } else {
      deltaX < 0 ? next() : prev();
    }
  }, { passive: true });

  root.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) < 24) return;
    event.deltaY > 0 ? next() : prev();
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (["ArrowRight", "ArrowDown", " "].includes(event.key)) next();
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) prev();
  });

  show(0);

  return {
    show,
    next,
    prev,
    get current() {
      return current;
    }
  };
}
