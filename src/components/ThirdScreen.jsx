import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const thirdScreenSrc = `${import.meta.env.BASE_URL}hero/ThirdScreen.mp4`;
const monkPeaceSrc = `${import.meta.env.BASE_URL}hero/Monk-Peace.png`;
const END_FRAME_OFFSET = 0.02;
const SCROLL_PIXELS_PER_SECOND = 520;
const OUTRO_SCROLL_VIEWPORTS = 2.4;
const MIN_OUTRO_SCROLL_DISTANCE = 1800;
const MAX_OUTRO_SCROLL_DISTANCE = 3000;
const OUTRO_CLOSE_END = 0.3;
const OUTRO_HOLD_END = 0.45;
const CURTAIN_TRAVEL = 118;
const SEEK_THRESHOLD = 1 / 30;
let firstFrameReadyDispatched = false;

export function ThirdScreen({ reducedMotion }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const videoPanelRef = useRef(null);
  const monkPanelRef = useRef(null);
  const monkImageRef = useRef(null);
  const curtainRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const videoPanel = videoPanelRef.current;
    const monkPanel = monkPanelRef.current;
    const monkImage = monkImageRef.current;
    const curtain = curtainRef.current;

    if (!section || !video || !videoPanel || !monkPanel || !monkImage || !curtain) {
      return undefined;
    }

    let scrollTrigger = null;
    let seekFrame = 0;
    let requestedTime = 0;
    let seekInFlight = false;
    let latestTrigger = null;
    let monkImageReady = monkImage.complete && monkImage.naturalWidth > 0;
    let monkImageFailed = monkImage.complete && monkImage.naturalWidth === 0;
    let disposed = false;
    const easePassage = gsap.parseEase('power2.inOut');

    const getEndTime = () => Math.max(video.duration - END_FRAME_OFFSET, 0);
    const getVideoScrollDistance = () =>
      Math.max(window.innerHeight * 5, video.duration * SCROLL_PIXELS_PER_SECOND);
    const getOutroScrollDistance = () =>
      Math.round(
        gsap.utils.clamp(
          MIN_OUTRO_SCROLL_DISTANCE,
          MAX_OUTRO_SCROLL_DISTANCE,
          window.innerHeight * OUTRO_SCROLL_VIEWPORTS,
        ),
      );

    const resetOutro = () => {
      gsap.set(videoPanel, { xPercent: 0, scale: 1 });
      gsap.set(monkPanel, { autoAlpha: 0 });
      gsap.set(monkImage, {
        xPercent: 4,
        scale: 1.12,
        filter: 'brightness(0.55) saturate(0.65) hue-rotate(8deg)',
      });
      gsap.set(curtain, { xPercent: CURTAIN_TRAVEL, autoAlpha: 1 });
    };

    const syncOutroToScroll = (progress) => {
      if (!monkImageReady || monkImageFailed) {
        resetOutro();
        return;
      }

      const closeProgress = easePassage(gsap.utils.clamp(0, 1, progress / OUTRO_CLOSE_END));
      const revealProgress = easePassage(
        gsap.utils.clamp(0, 1, (progress - OUTRO_HOLD_END) / (1 - OUTRO_HOLD_END)),
      );
      let curtainPosition = 0;

      if (progress < OUTRO_CLOSE_END) {
        curtainPosition = CURTAIN_TRAVEL * (1 - closeProgress);
      } else if (progress > OUTRO_HOLD_END) {
        curtainPosition = -CURTAIN_TRAVEL * revealProgress;
      }

      gsap.set(videoPanel, {
        xPercent: -14 * closeProgress,
        scale: 1 + 0.04 * closeProgress,
      });
      gsap.set(monkPanel, {
        autoAlpha: progress >= OUTRO_HOLD_END ? 1 : 0,
      });
      gsap.set(monkImage, {
        xPercent: 4 * (1 - revealProgress),
        scale: 1.12 - 0.12 * revealProgress,
        filter: `brightness(${0.55 + 0.45 * revealProgress}) saturate(${0.65 + 0.35 * revealProgress}) hue-rotate(${8 * (1 - revealProgress)}deg)`,
      });
      gsap.set(curtain, { xPercent: curtainPosition, autoAlpha: 1 });
    };

    const revealVideo = () => {
      gsap.set(video, { autoAlpha: 1 });
    };

    const signalFirstFrameReady = () => {
      revealVideo();

      if (!firstFrameReadyDispatched) {
        firstFrameReadyDispatched = true;
        window.dispatchEvent(new Event('portfolio:first-frame-ready'));
      }
    };

    const commitRequestedSeek = () => {
      seekFrame = 0;

      if (seekInFlight || Math.abs(video.currentTime - requestedTime) < SEEK_THRESHOLD) {
        return;
      }

      seekInFlight = true;
      video.pause();
      video.currentTime = requestedTime;
    };

    const requestSeek = () => {
      if (!seekFrame) {
        seekFrame = window.requestAnimationFrame(commitRequestedSeek);
      }
    };

    const handleSeeked = () => {
      seekInFlight = false;
      revealVideo();

      if (Math.abs(video.currentTime - requestedTime) >= SEEK_THRESHOLD) {
        requestSeek();
      }
    };

    const syncSceneToScroll = (trigger) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      latestTrigger = trigger;
      const videoDistance = getVideoScrollDistance();
      const scrollDistance = trigger.progress * (trigger.end - trigger.start);
      const videoProgress = gsap.utils.clamp(0, 1, scrollDistance / videoDistance);
      const outroProgress = gsap.utils.clamp(
        0,
        1,
        (scrollDistance - videoDistance) / getOutroScrollDistance(),
      );

      requestedTime = videoProgress * getEndTime();
      syncOutroToScroll(outroProgress);
      requestSeek();
    };

    const resyncCurrentScene = () => {
      if (latestTrigger) {
        syncSceneToScroll(latestTrigger);
      }
    };

    const handleMonkImageReady = () => {
      if (disposed) {
        return;
      }

      monkImageReady = monkImage.naturalWidth > 0;
      monkImageFailed = !monkImageReady;
      resyncCurrentScene();
    };

    const handleMonkImageLoad = () => {
      if (typeof monkImage.decode !== 'function') {
        handleMonkImageReady();
        return;
      }

      monkImage.decode().then(handleMonkImageReady).catch(handleMonkImageReady);
    };

    const handleMonkImageError = () => {
      if (disposed) {
        return;
      }

      monkImageReady = false;
      monkImageFailed = true;
      resyncCurrentScene();
    };

    const setupScrollScrub = () => {
      if (reducedMotion || scrollTrigger || !Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      video.pause();
      video.currentTime = 0;
      syncOutroToScroll(0);

      scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${getVideoScrollDistance() + getOutroScrollDistance()}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: syncSceneToScroll,
        onRefresh: syncSceneToScroll,
      });

      ScrollTrigger.refresh();
    };

    const handleLoadedMetadata = () => {
      if (reducedMotion) {
        video.pause();
        video.currentTime = 0;
        return;
      }

      setupScrollScrub();
    };

    const handleLoaderComplete = () => {
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    gsap.set(video, { autoAlpha: 0 });
    resetOutro();
    video.pause();
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', signalFirstFrameReady);
    video.addEventListener('seeked', handleSeeked);
    monkImage.addEventListener('load', handleMonkImageLoad);
    monkImage.addEventListener('error', handleMonkImageError);
    window.addEventListener('portfolio:loader-complete', handleLoaderComplete);

    if (monkImage.complete) {
      if (monkImage.naturalWidth > 0) {
        handleMonkImageLoad();
      } else {
        handleMonkImageError();
      }
    }

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.load();
    }

    if (video.readyState >= 2) {
      signalFirstFrameReady();
    }

    if (window.__portfolioLoaderComplete) {
      handleLoaderComplete();
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(seekFrame);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', signalFirstFrameReady);
      video.removeEventListener('seeked', handleSeeked);
      monkImage.removeEventListener('load', handleMonkImageLoad);
      monkImage.removeEventListener('error', handleMonkImageError);
      window.removeEventListener('portfolio:loader-complete', handleLoaderComplete);
      scrollTrigger?.kill();
      gsap.set([videoPanel, monkPanel, monkImage, curtain], {
        clearProps: 'transform,filter,opacity,visibility',
      });
    };
  }, [reducedMotion]);

  return (
    <section
      id="featured-sequence"
      className={`third-screen${reducedMotion ? ' third-screen--reduced' : ''}`}
      ref={sectionRef}
      aria-label="Forest journey to a peaceful clearing"
    >
      <div className="third-screen__panel third-screen__panel--video" ref={videoPanelRef}>
        <video
          ref={videoRef}
          className="third-screen__video"
          src={thirdScreenSrc}
          preload="auto"
          muted
          playsInline
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
      <div className="third-screen__panel third-screen__panel--monk" ref={monkPanelRef}>
        <img
          ref={monkImageRef}
          className="third-screen__monk"
          src={monkPeaceSrc}
          alt="A monk meditating in a sunlit forest clearing"
          loading="eager"
          decoding="async"
          fetchPriority="low"
        />
      </div>
      <div className="third-screen__curtain" ref={curtainRef} aria-hidden="true" />
    </section>
  );
}
