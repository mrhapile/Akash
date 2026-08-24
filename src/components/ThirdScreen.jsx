import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const thirdScreenSrc = `${import.meta.env.BASE_URL}hero/ThirdScreen.mp4`;
const transitionSrc = `${import.meta.env.BASE_URL}hero/Transition.png`;
const monkPeaceSrc = `${import.meta.env.BASE_URL}hero/Monk-Peace.png`;
const END_FRAME_OFFSET = 0.02;
const SCROLL_PIXELS_PER_SECOND = 520;
const TRANSITION_SCROLL_VIEWPORTS = 1.25;
const MIN_TRANSITION_SCROLL_DISTANCE = 1000;
const MAX_TRANSITION_SCROLL_DISTANCE = 1800;
const MONK_SCROLL_VIEWPORTS = 1;
const MIN_MONK_SCROLL_DISTANCE = 900;
const MAX_MONK_SCROLL_DISTANCE = 1600;
const ENTRY_BLEND_ALPHA = 0.88;
const TRANSITION_ENTRY_SCALE = 1.06;
const MONK_ENTRY_SCALE = 1.07;
const SEEK_THRESHOLD = 1 / 30;
let firstFrameReadyDispatched = false;

export function ThirdScreen({ reducedMotion }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const videoPanelRef = useRef(null);
  const trackRef = useRef(null);
  const transitionPanelRef = useRef(null);
  const transitionImageRef = useRef(null);
  const monkPanelRef = useRef(null);
  const monkImageRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const videoPanel = videoPanelRef.current;
    const track = trackRef.current;
    const transitionPanel = transitionPanelRef.current;
    const transitionImage = transitionImageRef.current;
    const monkPanel = monkPanelRef.current;
    const monkImage = monkImageRef.current;

    if (
      !section ||
      !video ||
      !videoPanel ||
      !track ||
      !transitionPanel ||
      !transitionImage ||
      !monkPanel ||
      !monkImage
    ) {
      return undefined;
    }

    let scrollTrigger = null;
    let seekFrame = 0;
    let requestedTime = 0;
    let seekInFlight = false;
    let latestTrigger = null;
    let transitionImageReady = transitionImage.complete && transitionImage.naturalWidth > 0;
    let transitionImageFailed = transitionImage.complete && transitionImage.naturalWidth === 0;
    let monkImageReady = monkImage.complete && monkImage.naturalWidth > 0;
    let monkImageFailed = monkImage.complete && monkImage.naturalWidth === 0;
    let disposed = false;

    const getEndTime = () => Math.max(video.duration - END_FRAME_OFFSET, 0);
    const getVideoScrollDistance = () =>
      Math.max(window.innerHeight * 5, video.duration * SCROLL_PIXELS_PER_SECOND);
    const canRunOutro = () =>
      transitionImageReady && monkImageReady && !transitionImageFailed && !monkImageFailed;
    const getTransitionScrollDistance = () => {
      if (!canRunOutro()) {
        return 0;
      }

      return Math.round(
        gsap.utils.clamp(
          MIN_TRANSITION_SCROLL_DISTANCE,
          MAX_TRANSITION_SCROLL_DISTANCE,
          window.innerHeight * TRANSITION_SCROLL_VIEWPORTS,
        ),
      );
    };
    const getMonkScrollDistance = () => {
      if (!canRunOutro()) {
        return 0;
      }

      return Math.round(
        gsap.utils.clamp(
          MIN_MONK_SCROLL_DISTANCE,
          MAX_MONK_SCROLL_DISTANCE,
          window.innerHeight * MONK_SCROLL_VIEWPORTS,
        ),
      );
    };
    const getOutroScrollDistance = () => getTransitionScrollDistance() + getMonkScrollDistance();

    const resetScene = () => {
      if (reducedMotion) {
        gsap.set([videoPanel, transitionPanel, monkPanel], {
          xPercent: 0,
          autoAlpha: 1,
          '--edge-veil-opacity': 0,
        });
        gsap.set([transitionImage, monkImage], { scale: 1 });
        return;
      }

      gsap.set(videoPanel, { xPercent: 0, autoAlpha: 1 });
      gsap.set(transitionPanel, {
        xPercent: 100,
        autoAlpha: ENTRY_BLEND_ALPHA,
        '--edge-veil-opacity': 1,
      });
      gsap.set(monkPanel, {
        xPercent: 100,
        autoAlpha: ENTRY_BLEND_ALPHA,
        '--edge-veil-opacity': 1,
      });
      gsap.set(transitionImage, { scale: TRANSITION_ENTRY_SCALE });
      gsap.set(monkImage, { scale: MONK_ENTRY_SCALE });
    };

    const syncOutroToScroll = (transitionProgress, monkProgress) => {
      if (!canRunOutro()) {
        resetScene();
        return;
      }

      const clampedTransitionProgress = gsap.utils.clamp(0, 1, transitionProgress);
      const clampedMonkProgress = gsap.utils.clamp(0, 1, monkProgress);

      gsap.set(videoPanel, { xPercent: -100 * clampedTransitionProgress });
      gsap.set(transitionPanel, {
        xPercent: 100 - 100 * clampedTransitionProgress - 100 * clampedMonkProgress,
        autoAlpha: ENTRY_BLEND_ALPHA + (1 - ENTRY_BLEND_ALPHA) * clampedTransitionProgress,
        '--edge-veil-opacity': 1 - clampedTransitionProgress,
      });
      gsap.set(monkPanel, {
        xPercent: 100 - 100 * clampedMonkProgress,
        autoAlpha: ENTRY_BLEND_ALPHA + (1 - ENTRY_BLEND_ALPHA) * clampedMonkProgress,
        '--edge-veil-opacity': 1 - clampedMonkProgress,
      });
      gsap.set(transitionImage, {
        scale: TRANSITION_ENTRY_SCALE - (TRANSITION_ENTRY_SCALE - 1) * clampedTransitionProgress,
      });
      gsap.set(monkImage, {
        scale: MONK_ENTRY_SCALE - (MONK_ENTRY_SCALE - 1) * clampedMonkProgress,
      });
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
      const transitionDistance = getTransitionScrollDistance();
      const monkDistance = getMonkScrollDistance();
      const scrollDistance = trigger.progress * (trigger.end - trigger.start);
      const videoProgress = gsap.utils.clamp(0, 1, scrollDistance / videoDistance);
      const transitionProgress = transitionDistance
        ? gsap.utils.clamp(0, 1, (scrollDistance - videoDistance) / transitionDistance)
        : 0;
      const monkProgress = monkDistance
        ? gsap.utils.clamp(
            0,
            1,
            (scrollDistance - videoDistance - transitionDistance) / monkDistance,
          )
        : 0;

      requestedTime = videoProgress * getEndTime();
      syncOutroToScroll(transitionProgress, monkProgress);
      requestSeek();
    };

    const resyncCurrentScene = () => {
      scrollTrigger?.refresh();

      if (latestTrigger) {
        syncSceneToScroll(latestTrigger);
      }
    };

    const handleTransitionImageReady = () => {
      if (disposed) {
        return;
      }

      transitionImageReady = transitionImage.naturalWidth > 0;
      transitionImageFailed = !transitionImageReady;
      resyncCurrentScene();
    };

    const handleTransitionImageLoad = () => {
      if (typeof transitionImage.decode !== 'function') {
        handleTransitionImageReady();
        return;
      }

      transitionImage.decode().then(handleTransitionImageReady).catch(handleTransitionImageReady);
    };

    const handleTransitionImageError = () => {
      if (disposed) {
        return;
      }

      transitionImageReady = false;
      transitionImageFailed = true;
      resyncCurrentScene();
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
      resetScene();

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
    resetScene();
    video.pause();
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', signalFirstFrameReady);
    video.addEventListener('seeked', handleSeeked);
    transitionImage.addEventListener('load', handleTransitionImageLoad);
    transitionImage.addEventListener('error', handleTransitionImageError);
    monkImage.addEventListener('load', handleMonkImageLoad);
    monkImage.addEventListener('error', handleMonkImageError);
    window.addEventListener('portfolio:loader-complete', handleLoaderComplete);

    if (transitionImage.complete) {
      if (transitionImage.naturalWidth > 0) {
        handleTransitionImageLoad();
      } else {
        handleTransitionImageError();
      }
    }

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
      transitionImage.removeEventListener('load', handleTransitionImageLoad);
      transitionImage.removeEventListener('error', handleTransitionImageError);
      monkImage.removeEventListener('load', handleMonkImageLoad);
      monkImage.removeEventListener('error', handleMonkImageError);
      window.removeEventListener('portfolio:loader-complete', handleLoaderComplete);
      scrollTrigger?.kill();
      gsap.set([track, transitionPanel, transitionImage, monkPanel, monkImage], {
        clearProps:
          'transform,transformOrigin,filter,opacity,visibility,width,height,--edge-veil-opacity',
      });
      gsap.set(videoPanel, {
        clearProps:
          'transform,transformOrigin,filter,opacity,visibility,width,height,--edge-veil-opacity',
      });
      gsap.set(video, {
        clearProps: 'transform,transformOrigin,filter,opacity,visibility,width,height',
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
      <div className="third-screen__track" ref={trackRef}>
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
        <div
          className="third-screen__panel third-screen__panel--transition"
          ref={transitionPanelRef}
          aria-hidden="true"
        >
          <img
            ref={transitionImageRef}
            className="third-screen__transition"
            src={transitionSrc}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="low"
          />
        </div>
        <div
          className="third-screen__panel third-screen__panel--monk"
          ref={monkPanelRef}
          aria-hidden="true"
        >
          <img
            ref={monkImageRef}
            className="third-screen__monk"
            src={monkPeaceSrc}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="low"
          />
        </div>
      </div>
    </section>
  );
}
