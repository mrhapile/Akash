import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const thirdScreenSrc = `${import.meta.env.BASE_URL}hero/ThirdScreen.mp4`;
const END_FRAME_OFFSET = 0.02;
const SCROLL_PIXELS_PER_SECOND = 520;

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

    const getEndTime = () => Math.max(video.duration - END_FRAME_OFFSET, 0);

    const revealVideo = () => {
      gsap.set(video, { autoAlpha: 1 });
    };

    const syncVideoToScroll = (progress) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      const nextTime = gsap.utils.clamp(0, getEndTime(), progress * getEndTime());
      video.pause();
      video.currentTime = nextTime;
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
        onUpdate: (self) => syncVideoToScroll(self.progress),
        onRefresh: (self) => syncVideoToScroll(self.progress),
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

    gsap.set(video, { autoAlpha: 0 });
    video.pause();
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', revealVideo);
    video.addEventListener('seeked', revealVideo, { once: true });

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.load();
    }

    if (video.readyState >= 2) {
      revealVideo();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', revealVideo);
      video.removeEventListener('seeked', revealVideo);
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
