import { tilt } from "./utils/tilt";

const buttons = {
  prev: document.querySelector(".slider--btn__prev"),
  next: document.querySelector(".slider--btn__next"),
};

const slides = document.querySelectorAll(".slide");

slides.forEach((slide) => {
  const slideWrapper = slide.parentElement;
  const slideInner = slide.querySelector(".slide__inner");
  const slideInfoInner = slideWrapper.querySelector(".slide-info__inner");

  tilt(slide, { target: [slideInner, slideInfoInner] });
});

buttons.prev.addEventListener("click", swapCards("left"));
buttons.next.addEventListener("click", swapCards("right"));

function swapCards(direction) {
  return () => {
    const slidesWrappper = document.querySelector(".slides__wrapper");

    const slideCurrent = document.querySelector(".slide[data-current]");
    const slidePrevious = document.querySelector(".slide[data-previous]");
    const slideNext = document.querySelector(".slide[data-next]");

    const slideWrapperCurrent = slideCurrent.parentElement;
    const slideWrapperPrevious = slidePrevious.parentElement;
    const slideWrapperNext = slideNext.parentElement;

    const slideInfoCurrent = slideWrapperCurrent.querySelector(".slide-info");
    const slideInfoPrevious = slideWrapperPrevious.querySelector(".slide-info");
    const slideInfoNext = slideWrapperNext.querySelector(".slide-info");

    slidesWrappper.setAttribute("data-direction", direction);

    slideCurrent.removeAttribute("data-current");
    slidePrevious.removeAttribute("data-previous");
    slideNext.removeAttribute("data-next");

    slideInfoCurrent.removeAttribute("data-current");

    if (direction === "right") {
      slideWrapperNext.style.zIndex = "30";
      slideWrapperCurrent.style.zIndex = "20";
      slideWrapperPrevious.style.zIndex = "10";

      slideCurrent.setAttribute("data-previous", "");
      slidePrevious.setAttribute("data-next", "");
      slideNext.setAttribute("data-current", "");

      slideInfoNext.setAttribute("data-current", "");
    } else if (direction === "left") {
      slideWrapperPrevious.style.zIndex = "30";
      slideWrapperCurrent.style.zIndex = "20";
      slideWrapperNext.style.zIndex = "10";

      slideCurrent.setAttribute("data-next", "");
      slidePrevious.setAttribute("data-current", "");
      slideNext.setAttribute("data-previous", "");

      slideInfoPrevious.setAttribute("data-current", "");
    }
  };
}
