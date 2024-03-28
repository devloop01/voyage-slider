import imagesLoaded from "imagesloaded";

import { lerp } from "./utils";
import { tilt } from "./utils/tilt";
import { raf } from "./utils/Raf";

const DEV = import.meta.env.MODE === "development";

if (DEV) {
  init();
} else {
  setup();
}

function init() {
  const loader = document.querySelector(".loader");

  const slides = [...document.querySelectorAll(".slide")];
  const slidesInfo = [...document.querySelectorAll(".slide-info")];

  const buttons = {
    prev: document.querySelector(".slider--btn__prev"),
    next: document.querySelector(".slider--btn__next"),
  };

  loader.style.opacity = 0;
  loader.style.pointerEvents = "none";

  slides.forEach((slide, i) => {
    const slideInner = slide.querySelector(".slide__inner");
    const slideInfoInner = slidesInfo[i].querySelector(".slide-info__inner");

    tilt(slide, { target: [slideInner, slideInfoInner] });
  });

  buttons.prev.addEventListener("click", change(-1));
  buttons.next.addEventListener("click", change(1));
}

function setup() {
  const loaderText = document.querySelector(".loader__text");

  const images = [...document.querySelectorAll("img")];
  const totalImages = images.length;
  let loadedImages = 0;
  let progress = {
    current: 0,
    target: 0,
  };

  // update progress target
  images.forEach((image) => {
    imagesLoaded(image, (instance) => {
      if (instance.isComplete) {
        loadedImages++;
        progress.target = loadedImages / totalImages;
      }
    });
  });

  // lerp progress current to progress target
  raf.add(({ id }) => {
    progress.current = lerp(progress.current, progress.target, 0.06);

    const progressPercent = Math.round(progress.current * 100);
    loaderText.textContent = `${progressPercent}%`;

    // hide loader when progress is 100%
    if (progressPercent === 100) {
      init();

      // remove raf callback when progress is 100%
      raf.remove(id);
    }
  });
}

function change(direction) {
  return () => {
    let current = {
      slide: document.querySelector(".slide[data-current]"),
      slideInfo: document.querySelector(".slide-info[data-current]"),
      slideBg: document.querySelector(".slide__bg[data-current]"),
    };
    let previous = {
      slide: document.querySelector(".slide[data-previous]"),
      slideInfo: document.querySelector(".slide-info[data-previous]"),
      slideBg: document.querySelector(".slide__bg[data-previous]"),
    };
    let next = {
      slide: document.querySelector(".slide[data-next]"),
      slideInfo: document.querySelector(".slide-info[data-next]"),
      slideBg: document.querySelector(".slide__bg[data-next]"),
    };

    Object.values(current).map((el) => el.removeAttribute("data-current"));
    Object.values(previous).map((el) => el.removeAttribute("data-previous"));
    Object.values(next).map((el) => el.removeAttribute("data-next"));

    if (direction === 1) {
      let temp = current;
      current = next;
      next = previous;
      previous = temp;

      current.slide.style.zIndex = "20";
      previous.slide.style.zIndex = "30";
      next.slide.style.zIndex = "10";
    } else if (direction === -1) {
      let temp = current;
      current = previous;
      previous = next;
      next = temp;

      current.slide.style.zIndex = "20";
      previous.slide.style.zIndex = "10";
      next.slide.style.zIndex = "30";
    }

    Object.values(current).map((el) => el.setAttribute("data-current", ""));
    Object.values(previous).map((el) => el.setAttribute("data-previous", ""));
    Object.values(next).map((el) => el.setAttribute("data-next", ""));
  };
}
