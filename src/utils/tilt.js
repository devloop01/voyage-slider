import { vec2 } from "./Vec2";
import { raf } from "./Raf";

export function tilt(node, options) {
  let { trigger, target } = resolveOptions(node, options);

  let lerpAmount = 0.06;

  const rotDeg = { current: vec2(), target: vec2() };
  const bgPos = { current: vec2(), target: vec2() };

  const update = (newOptions) => {
    destroy();
    ({ trigger, target } = resolveOptions(node, newOptions));
    init();
  };

  let rafId;

  function ticker({ id }) {
    rafId = id;

    rotDeg.current.lerp(rotDeg.target, lerpAmount);
    bgPos.current.lerp(bgPos.target, lerpAmount);

    for (const el of target) {
      el.style.setProperty("--rotX", rotDeg.current.y.toFixed(2) + "deg");
      el.style.setProperty("--rotY", rotDeg.current.x.toFixed(2) + "deg");

      el.style.setProperty("--bgPosX", bgPos.current.x.toFixed(2) + "%");
      el.style.setProperty("--bgPosY", bgPos.current.y.toFixed(2) + "%");
    }
  }

  const onMouseMove = ({ offsetX, offsetY }) => {
    lerpAmount = 0.1;

    for (const el of target) {
      const ox = (offsetX - el.clientWidth * 0.5) / (Math.PI * 3);
      const oy = -(offsetY - el.clientHeight * 0.5) / (Math.PI * 4);

      rotDeg.target.set(ox, oy);
      bgPos.target.set(-ox * 0.3, oy * 0.3);
    }
  };

  const onMouseLeave = () => {
    lerpAmount = 0.06;

    rotDeg.target.set(0, 0);
    bgPos.target.set(0, 0);
  };

  const addListeners = () => {
    trigger.addEventListener("mousemove", onMouseMove);
    trigger.addEventListener("mouseleave", onMouseLeave);
  };

  const removeListeners = () => {
    trigger.removeEventListener("mousemove", onMouseMove);
    trigger.removeEventListener("mouseleave", onMouseLeave);
  };

  const init = () => {
    addListeners();
    raf.add(ticker);
  };

  const destroy = () => {
    removeListeners();
    raf.remove(rafId);
  };

  init();

  return { destroy, update };
}

function resolveOptions(node, options) {
  return {
    trigger: options?.trigger ?? node,
    target: options?.target
      ? Array.isArray(options.target)
        ? options.target
        : [options.target]
      : [node],
  };
}
