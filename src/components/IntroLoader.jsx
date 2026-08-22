import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const introVideoSrc = `${import.meta.env.BASE_URL}hero/Loading.mp4`;
const EXIT_DURATION_MS = 450;
const SAFETY_TIMEOUT_MS = 12000;

export function IntroLoader({ reducedMotion, contentReady, onComplete }) {
  const [playbackEnded, setPlaybackEnded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const completionStartedRef = useRef(false);
  const exitTimerRef = useRef(0);

  const completeIntro = useCallback((immediate = false) => {
    if (completionStartedRef.current) {
      return;
    }

    completionStartedRef.current = true;

    if (immediate) {
      onComplete();
      return;
    }

    setIsExiting(true);
    exitTimerRef.current = window.setTimeout(onComplete, EXIT_DURATION_MS);
  }, [onComplete]);

  useLayoutEffect(() => {
    const supportsScrollRestoration = 'scrollRestoration' in window.history;
    const previousScrollRestoration = supportsScrollRestoration
      ? window.history.scrollRestoration
      : null;

    if (supportsScrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }

    document.body.classList.add('intro-active');
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const resetScrollFrame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    return () => {
      window.cancelAnimationFrame(resetScrollFrame);
      document.body.classList.remove('intro-active');
      window.clearTimeout(exitTimerRef.current);

      if (supportsScrollRestoration && previousScrollRestoration) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      completeIntro(true);
    }
  }, [completeIntro, reducedMotion]);

  useEffect(() => {
    if (playbackEnded && contentReady) {
      completeIntro();
    }
  }, [completeIntro, contentReady, playbackEnded]);

  useEffect(() => {
    const safetyTimer = window.setTimeout(() => completeIntro(), SAFETY_TIMEOUT_MS);
    return () => window.clearTimeout(safetyTimer);
  }, [completeIntro]);

  return (
    <div
      className={`intro-loader${isExiting ? ' intro-loader--exiting' : ''}`}
      role="dialog"
      aria-label="Portfolio introduction"
      aria-modal="true"
    >
      <video
        className="intro-loader__video"
        src={introVideoSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => setPlaybackEnded(true)}
        onError={() => completeIntro()}
        aria-hidden="true"
      />

      <button className="intro-loader__skip" type="button" onClick={() => completeIntro()} autoFocus>
        Skip intro
      </button>
    </div>
  );
}
