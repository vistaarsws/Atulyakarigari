import useEmblaCarousel from "embla-carousel-react";
import "./EmblaSlider.css";
import PropTypes from "prop-types";
import Autoplay from "embla-carousel-autoplay";
import AutoScroll from "embla-carousel-auto-scroll";
import ClassNames from "embla-carousel-class-names";
import { useEffect, useState, useCallback, useRef } from "react";
import slider_left_arrow from "../../../assets/images/slider_left_arrow.svg";
import slider_right_arrow from "../../../assets/images/slider_right_arrow.svg";

const TWEEN_FACTOR_BASE = 0.52;

// Utility function to constrain a number within a range
const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max);

export function EmblaSlider({
  options = {
    loop: true,
    dragFree: true,
    draggable: false,
    preventScrollOnTouch: true,
    delay: 2000,
  },
  slides = [],
  plugins = [],
  slides_in_view = { xl: 1, lg: 1, md: 1, sm: 1, xs: 1 },
  navigationDots = true,
  navigationArrow = false,

  centerSlideStyle = {},
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(slides_in_view);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef([]);

  // -------------------------------------------Create plugin instances based on configurations------------------------------------
  const pluginInstances = plugins.map((plugin) => {
    if (plugin.toLowerCase() === "autoscroll")
      return AutoScroll({ play: true, stopOnInteraction: false });
    if (plugin.toLowerCase() === "autoplay") {
      return Autoplay({ delay: options.delay, stopOnInteraction: false });
    }
    if (plugin.toLowerCase() === "classname") return ClassNames();
    return plugin;
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(options, pluginInstances);

  // ---------------------------------------------- Handle window resize to update slides per view-------------------------------------
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 425) setSlidesPerView(slides_in_view.xs);
      else if (width < 768) setSlidesPerView(slides_in_view.sm);
      else if (width < 1024) setSlidesPerView(slides_in_view.md);
      else if (width < 1440) setSlidesPerView(slides_in_view.lg);
      else setSlidesPerView(slides_in_view.xl);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [slides_in_view]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    // Auto-scroll on pointerUp if AutoScroll plugin is used
    emblaApi.on("pointerUp", () => {
      if (plugins.includes(AutoScroll)) emblaApi.scrollNext();
    });
  }, [emblaApi, plugins]);

  // Scroll controls
  const scrollTo = (index) => emblaApi?.scrollTo(index);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const setTweenNodes = useCallback((emblaApi) => {
    tweenNodes.current = emblaApi
      .slideNodes()
      .map((slideNode) => slideNode.querySelector(".embla__slide__number"));
  }, []);

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback(
    (emblaApi, eventName) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";
      const scrollSnaps = emblaApi.scrollSnapList();
      const slideNodes = emblaApi.slideNodes();

      if (centerSlideStyle) {
        const middleIndex = Math.floor(slidesInView.length / 2);
        const centerSlideIndex = slidesInView[middleIndex];

        slidesInView.forEach((slideIndex) => {
          const tweenNode = slideNodes[slideIndex];
          if (!tweenNode) return;

          // Toggle center slide style
          tweenNode.classList.toggle(
            centerSlideStyle.style,
            slideIndex === centerSlideIndex
          );
        });
      }

      // Calculate and apply scale transformations
      scrollSnaps.forEach((scrollSnap, snapIndex) => {
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          let diffToTarget = scrollSnap - scrollProgress;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              if (slideIndex === loopItem.index && loopItem.target() !== 0) {
                diffToTarget =
                  scrollSnap +
                  Math.sign(loopItem.target()) * (1 - scrollProgress);
              }
            });
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
          const scale = numberWithinRange(tweenValue, 0, 1);
          const tweenNode = tweenNodes.current[slideIndex];

          if (tweenNode) tweenNode.style.transform = `scale(${scale})`;
        });
      });
    },
    [centerSlideStyle]
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);

    emblaApi
      .on("reInit", () => {
        setTweenNodes(emblaApi);
        setTweenFactor(emblaApi);
        tweenScale(emblaApi);
      })
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale);
  }, [emblaApi, tweenScale]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div
              className="embla__slide"
              key={index}
              style={{ flexBasis: `${(1 / slidesPerView) * 100}%` }}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {navigationArrow && (
        <div className="navigationArrows_container">
          <button className="embla__prev" onClick={scrollPrev}>
            <svg
              width="19"
              height="20"
              viewBox="0 0 19 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.11753 0.000121189C0.855974 4.52088e-05 0.602671 0.0799142 0.401735 0.225818C0.2008 0.371722 0.0649643 0.574416 0.0178852 0.798603L3.8147e-06 0.97388V18.5015C-0.000511169 18.7449 0.103552 18.9796 0.291697 19.1594C0.479843 19.3392 0.738436 19.4511 1.01656 19.4731C1.29468 19.4951 1.57216 19.4255 1.79438 19.2782C2.01659 19.1308 2.16743 18.9163 2.21718 18.6768L2.23506 18.5015V0.97388C2.23506 0.715623 2.11732 0.467944 1.90775 0.285329C1.69817 0.102714 1.41392 0.000121189 1.11753 0.000121189ZM18.6717 0.284459C18.4865 0.123447 18.2424 0.0241495 17.9818 0.00386457C17.7212 -0.0164204 17.4607 0.0435939 17.2457 0.173451L17.0893 0.284459L7.0315 9.04829C6.84671 9.20965 6.73276 9.42239 6.70948 9.64944C6.6862 9.87648 6.75507 10.1035 6.9041 10.2908L7.0315 10.4271L17.0893 19.191C17.2864 19.3635 17.5505 19.4654 17.8296 19.4767C18.1086 19.4879 18.3824 19.4077 18.597 19.2518C18.8115 19.0959 18.9513 18.8756 18.9887 18.6343C19.0261 18.3931 18.9585 18.1484 18.7991 17.9484L18.6717 17.8121L9.40289 9.73771L18.6717 1.6633C18.7758 1.57285 18.8583 1.46539 18.9147 1.34709C18.971 1.22879 19 1.10196 19 0.97388C19 0.845797 18.971 0.718972 18.9147 0.60067C18.8583 0.482368 18.7758 0.374912 18.6717 0.284459Z"
                fill="#60A487"
              />
            </svg>
          </button>
          <button className="embla__next" onClick={scrollNext}>
            <svg
              width="19"
              height="20"
              viewBox="0 0 19 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.8825 0.000121189C18.144 4.52088e-05 18.3973 0.0799142 18.5983 0.225818C18.7992 0.371722 18.935 0.574416 18.9821 0.798603L19 0.97388V18.5015C19.0005 18.7449 18.8964 18.9796 18.7083 19.1594C18.5202 19.3392 18.2616 19.4511 17.9834 19.4731C17.7053 19.4951 17.4278 19.4255 17.2056 19.2782C16.9834 19.1308 16.8326 18.9163 16.7828 18.6768L16.7649 18.5015V0.97388C16.7649 0.715623 16.8827 0.467944 17.0923 0.285329C17.3018 0.102714 17.5861 0.000121189 17.8825 0.000121189ZM0.328316 0.284459C0.513503 0.123447 0.757649 0.0241495 1.01822 0.00386457C1.27879 -0.0164204 1.53927 0.0435939 1.75428 0.173451L1.91074 0.284459L11.9685 9.04829C12.1533 9.20965 12.2672 9.42239 12.2905 9.64944C12.3138 9.87648 12.2449 10.1035 12.0959 10.2908L11.9685 10.4271L1.91074 19.191C1.71363 19.3635 1.44951 19.4654 1.17043 19.4767C0.891355 19.4879 0.61756 19.4077 0.403005 19.2518C0.188451 19.0959 0.0486999 18.8756 0.0112938 18.6343C-0.0261122 18.3931 0.0415403 18.1484 0.200918 17.9484L0.328316 17.8121L9.59711 9.73771L0.328316 1.6633C0.224244 1.57285 0.141674 1.46539 0.0853364 1.34709C0.0289985 1.22879 0 1.10196 0 0.97388C0 0.845797 0.0289985 0.718972 0.0853364 0.60067C0.141674 0.482368 0.224244 0.374912 0.328316 0.284459Z"
                fill="#60A487"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Navigation Dots */}
      {navigationDots && (
        <div className="embla__dots">
          {Array.from({ length: emblaApi?.scrollSnapList().length || 0 }).map(
            (_, index) => (
              <button
                key={index}
                className="embla__dot"
                type="button"
                onClick={() => scrollTo(index)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

EmblaSlider.propTypes = {
  options: PropTypes.object,
  slides: PropTypes.array.isRequired,
  plugins: PropTypes.array,
  slides_in_view: PropTypes.object,
  navigationDots: PropTypes.bool,
  navigationArrow: PropTypes.bool,
  centerSlideStyle: PropTypes.object,
};
