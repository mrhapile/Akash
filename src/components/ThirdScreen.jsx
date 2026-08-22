import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const thirdScreenSrc = `${import.meta.env.BASE_URL}hero/ThirdScreen.mp4`;
const END_FRAME_OFFSET = 0.02;
const SCROLL_PIXELS_PER_SECOND = 520;
const SEEK_THRESHOLD = 1 / 30;
let firstFrameReadyDispatched = false;

export function ThirdScreen({ reducedMotion }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) {
      return undefined;
    }

    let scrollTrigger = null;
    let seekFrame = 0;
    let requestedTime = 0;
    let seekInFlight = false;

    const getEndTime = () => Math.max(video.duration - END_FRAME_OFFSET, 0);

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

    const syncSceneToScroll = (progress) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      requestedTime = gsap.utils.clamp(0, getEndTime(), progress * getEndTime());
      requestSeek();
    };

    const setupScrollScrub = () => {
      if (reducedMotion || scrollTrigger || !Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      video.pause();
      video.currentTime = 0;

      scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.max(window.innerHeight * 5, video.duration * SCROLL_PIXELS_PER_SECOND)}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => syncSceneToScroll(self.progress),
        onRefresh: (self) => syncSceneToScroll(self.progress),
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
    video.pause();
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', signalFirstFrameReady);
    video.addEventListener('seeked', handleSeeked);
    window.addEventListener('portfolio:loader-complete', handleLoaderComplete);

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
      window.cancelAnimationFrame(seekFrame);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', signalFirstFrameReady);
      video.removeEventListener('seeked', handleSeeked);
      window.removeEventListener('portfolio:loader-complete', handleLoaderComplete);
      scrollTrigger?.kill();
    };
  }, [reducedMotion]);

  return (
    <section className="third-screen" ref={sectionRef} aria-label="Featured motion sequence">
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
    </section>
  );
}
