import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
const aboutPaperSrc = `${import.meta.env.BASE_URL}hero/About-Paper.mp4`;

const PAPER_START_TIME = 1.5;
const INITIAL_CROP_TOP = 25;
const INITIAL_CROP_BOTTOM = 66;
const FINAL_CROP_TOP = 1.5;
const FINAL_CROP_BOTTOM = 1.5;

export const About = forwardRef(function About({ reducedMotion }, ref) {
  const paperFrameRef = useRef(null);
  const paperVideoRef = useRef(null);
  const syncProgressRef = useRef(() => {});

  useImperativeHandle(ref, () => ({
    setProgress(progress) {
      syncProgressRef.current(progress);
    },
  }), []);

  useLayoutEffect(() => {
    const paperFrame = paperFrameRef.current;
    const paperVideo = paperVideoRef.current;

    if (!paperFrame || !paperVideo) {
      return undefined;
    }

    const paperProgress = { value: reducedMotion ? 1 : 0 };

    const setPaperCrop = (progress) => {
      const cropTop = FINAL_CROP_TOP + (INITIAL_CROP_TOP - FINAL_CROP_TOP) * Math.pow(1 - progress, 3);
      const cropBottom = gsap.utils.interpolate(INITIAL_CROP_BOTTOM, FINAL_CROP_BOTTOM, progress);
      const clipPath = `inset(${cropTop}% 2.5% ${cropBottom}% 2.5%)`;

      paperVideo.style.clipPath = clipPath;
      paperVideo.style.webkitClipPath = clipPath;
    };

    const syncPaper = () => {
      const progress = gsap.utils.clamp(0, 1, paperProgress.value);
      setPaperCrop(progress);

      if (!Number.isFinite(paperVideo.duration) || paperVideo.duration <= 0) {
        return;
      }

      const endTime = Math.max(paperVideo.duration - 0.02, PAPER_START_TIME);
      const nextTime = gsap.utils.interpolate(PAPER_START_TIME, endTime, progress);

      paperVideo.pause();
      if (Math.abs(paperVideo.currentTime - nextTime) > 0.016) {
        paperVideo.currentTime = nextTime;
      }
    };

    const revealPaperFrame = () => {
      gsap.set(paperVideo, { autoAlpha: 1 });
    };

    const showReducedMotionFrame = () => {
      if (!Number.isFinite(paperVideo.duration) || paperVideo.duration <= 0) {
        return;
      }

      paperProgress.value = 1;
      paperVideo.pause();
      setPaperCrop(1);

      const finalFrameTime = Math.max(paperVideo.duration - 0.02, 0);
      if (Math.abs(paperVideo.currentTime - finalFrameTime) > 0.02) {
        paperVideo.currentTime = finalFrameTime;
      } else {
        revealPaperFrame();
      }
    };

    const handlePaperMetadata = () => {
      if (reducedMotion) {
        showReducedMotionFrame();
      } else {
        paperVideo.pause();
        syncPaper();
      }
    };

    syncProgressRef.current = (progress) => {
      paperProgress.value = gsap.utils.clamp(0, 1, progress);
      gsap.set(paperFrame, { autoAlpha: paperProgress.value > 0 ? 1 : 0 });
      syncPaper();
    };

    gsap.set(paperFrame, { autoAlpha: reducedMotion ? 1 : 0 });
    gsap.set(paperVideo, { autoAlpha: 0 });
    setPaperCrop(reducedMotion ? 1 : 0);

    paperVideo.addEventListener('loadedmetadata', handlePaperMetadata);
    paperVideo.addEventListener('seeked', revealPaperFrame);

    if (paperVideo.readyState >= 1) {
      handlePaperMetadata();
    } else {
      paperVideo.load();
    }

    return () => {
      paperVideo.removeEventListener('loadedmetadata', handlePaperMetadata);
      paperVideo.removeEventListener('seeked', revealPaperFrame);
      syncProgressRef.current = () => {};
    };
  }, [reducedMotion]);

  return (
    <>
      <h2 className="visually-hidden" id="about-title">
        About me
      </h2>
      <div className="about__paper-frame" ref={paperFrameRef} aria-hidden="true">
        <video
          ref={paperVideoRef}
          className="about__paper"
          src={aboutPaperSrc}
          preload="auto"
          muted
          playsInline
          tabIndex={-1}
        />
      </div>
    </>
  );
});
