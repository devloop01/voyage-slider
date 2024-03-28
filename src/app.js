import imagesLoaded from "imagesloaded";

import { lerp } from "./utils";
import { tilt } from "./utils/tilt";
import { raf } from "./utils/Raf";

const DEV = import.meta.env.MODE === "development";

// if (DEV) {
//   init();
// } else {
//   setup();
// }

setup();

function init() {
  const loader = document.querySelector(".loader");

  const slides = [...document.querySelectorAll(".slide")];
  const slideInfos = [...document.querySelectorAll(".slide-info")];

  const buttons = {
    prev: document.querySelector(".slider--btn__prev"),
    next: document.querySelector(".slider--btn__next"),
  };

  loader.style.opacity = 0;
  loader.style.pointerEvents = "none";

  slides.forEach((slide, index) => {
    const slideInner = slide.querySelector(".slide__inner");
    const slideInfoInner =
      slideInfos[index].querySelector(".slide-info__inner");

    tilt(slide, { target: [slideInner, slideInfoInner] });
  });

  buttons.prev.addEventListener("click", swapCards("left"));
  buttons.next.addEventListener("click", swapCards("right"));
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

function swapCards(direction) {
  return () => {
    const slideCurrent = document.querySelector(".slide[data-current]");
    const slidePrevious = document.querySelector(".slide[data-previous]");
    const slideNext = document.querySelector(".slide[data-next]");

    const slideWrapperCurrent = slideCurrent.parentElement;
    const slideWrapperPrevious = slidePrevious.parentElement;
    const slideWrapperNext = slideNext.parentElement;

    const slideInfoCurrent = document.querySelector(
      ".slide-info[data-current]",
    );
    const slideInfoPrevious = document.querySelector(
      ".slide-info[data-previous]",
    );
    const slideInfoNext = document.querySelector(".slide-info[data-next]");

    slideCurrent.removeAttribute("data-current");
    slidePrevious.removeAttribute("data-previous");
    slideNext.removeAttribute("data-next");

    slideInfoCurrent.removeAttribute("data-current");
    slideInfoPrevious.removeAttribute("data-previous");
    slideInfoNext.removeAttribute("data-next");

    if (direction === "right") {
      slideWrapperNext.style.zIndex = "20";
      slideWrapperCurrent.style.zIndex = "30";
      slideWrapperPrevious.style.zIndex = "10";

      slideCurrent.setAttribute("data-previous", "");
      slidePrevious.setAttribute("data-next", "");
      slideNext.setAttribute("data-current", "");

      slideInfoCurrent.setAttribute("data-previous", "");
      slideInfoNext.setAttribute("data-current", "");
      slideInfoPrevious.setAttribute("data-next", "");
    } else if (direction === "left") {
      slideWrapperPrevious.style.zIndex = "20";
      slideWrapperCurrent.style.zIndex = "30";
      slideWrapperNext.style.zIndex = "10";

      slideCurrent.setAttribute("data-next", "");
      slidePrevious.setAttribute("data-current", "");
      slideNext.setAttribute("data-previous", "");

      slideInfoCurrent.setAttribute("data-next", "");
      slideInfoPrevious.setAttribute("data-current", "");
      slideInfoNext.setAttribute("data-previous", "");
    }
  };
}
