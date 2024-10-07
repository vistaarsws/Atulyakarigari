import useEmblaCarousel from "embla-carousel-react";
import "./EmblaSlider.css";
import PropTypes from "prop-types";
import Autoplay from "embla-carousel-autoplay";
import AutoScroll from "embla-carousel-auto-scroll";
import ClassNames from "embla-carousel-class-names";
import { useEffect, useState, useCallback, useRef } from "react";
import slider_left_arrow from "../../../assets/images/slider_left_arrow.png";
import slider_right_arrow from "../../../assets/images/slider_right_arrow.png";

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
      const { delay = 2000 } = options;
      return Autoplay({ delay, stopOnInteraction: false });
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
      const middleIndex = Math.floor(slidesInView.length / 2);

      {
        centerSlideStyle &&
          slidesInView.forEach((slideIndex) => {
            const tweenNode = emblaApi.slideNodes()[slideIndex];
            if (tweenNode) {
              const isCenterSlide = slideIndex === slidesInView[middleIndex];

              tweenNode.classList.remove(centerSlideStyle.style);

              if (isCenterSlide) {
                tweenNode.classList.add(centerSlideStyle.style);
              }
            }
          });
      }

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
          const scale = numberWithinRange(tweenValue, 0, 1).toString();
          const tweenNode = tweenNodes.current[slideIndex];
          if (tweenNode) {
            tweenNode.style.transform = `scale(${scale})`;
          }
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
            <img src={slider_left_arrow} alt="Left Arrow" />
          </button>
          <button className="embla__next" onClick={scrollNext}>
            <img src={slider_right_arrow} alt="Right Arrow" />
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
