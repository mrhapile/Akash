import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const heroVideoSrc = `${import.meta.env.BASE_URL}hero/1786473783457496.mp4`;

export function Hero({ reducedMotion }) {
  const sectionRef = useRef(null);
  const navRef = useRef(null);
  const roleRef = useRef(null);
  const lineOneRef = useRef(null);
  const lineTwoRef = useRef(null);
  const copyRef = useRef(null);
  const ctaRef = useRef(null);
  const stripRef = useRef(null);
  const videoRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) {
      return undefined;
    }

    const titleLines = [lineOneRef.current, lineTwoRef.current].filter(Boolean);
    const motionTargets = [
      navRef.current,
      roleRef.current,
      ...titleLines,
      copyRef.current,
      ctaRef.current,
      stripRef.current,
    ].filter(Boolean);

    let videoTrigger = null;

    const syncVideoToScroll = (progress) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      const endTime = Math.max(video.duration - 0.01, 0);
      const nextTime = progress * endTime;

      if (Math.abs(video.currentTime - nextTime) > 0.03) {
        video.currentTime = nextTime;
      }
    };

    const setupVideoScroll = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      if (videoTrigger) {
        videoTrigger.kill();
        videoTrigger = null;
      }

      video.pause();
      video.currentTime = 0;

      videoTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.max(window.innerHeight * 2.5, 2200)}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => syncVideoToScroll(self.progress),
        onRefresh: (self) => syncVideoToScroll(self.progress),
      });

      syncVideoToScroll(0);
      ScrollTrigger.refresh();
    };

    const handleLoadedMetadata = () => {
      setupVideoScroll();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    if (reducedMotion) {
      gsap.set(motionTargets, { clearProps: 'all', opacity: 1, x: 0, y: 0 });
      video.pause();
      video.currentTime = 0;
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }

    const context = gsap.context(() => {
      gsap.set(motionTargets, { opacity: 0 });
      gsap.set(navRef.current, { y: -10 });
      gsap.set(roleRef.current, { y: 12 });
      gsap.set(titleLines, { y: 28 });
      gsap.set(copyRef.current, { y: 14 });
      gsap.set(ctaRef.current, { y: 14 });
      gsap.set(stripRef.current, { y: 16 });

      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

      intro
        .to(navRef.current, { opacity: 1, y: 0, duration: 0.45 })
        .to(roleRef.current, { opacity: 1, y: 0, duration: 0.45 }, 0.06)
        .to(lineOneRef.current, { opacity: 1, y: 0, duration: 0.74 }, 0.12)
        .to(lineTwoRef.current, { opacity: 1, y: 0, duration: 0.74 }, 0.2)
        .to(copyRef.current, { opacity: 1, y: 0, duration: 0.48 }, 0.34)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.45 }, 0.42)
        .to(stripRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.54);
    }, section);

    if (video.readyState >= 1) {
      setupVideoScroll();
    } else {
      video.load();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (videoTrigger) {
        videoTrigger.kill();
      }
      context.revert();
    };
  }, [reducedMotion]);

  return (
    <section className="hero" id="hero" ref={sectionRef} aria-labelledby="hero-title">
      <div className="hero__texture" aria-hidden="true" />

      <div className="hero__art" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero__video"
          src={heroVideoSrc}
          preload="auto"
          muted
          playsInline
          tabIndex={-1}
        />
        <div className="hero__videoShade" />
      </div>

      <header className="hero__nav" ref={navRef}>
        <a className="hero__brand" href="#hero" aria-label="Homepage">
          /
        </a>

        <nav className="hero__menu" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#notes">Notes</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <div className="hero__stage">
        <div className="hero__content">
          <p className="hero__role" ref={roleRef}>
            Designer • Developer
          </p>

          <h1 className="hero__title" id="hero-title">
            <span ref={lineOneRef}>I build animated</span>
            <span ref={lineTwoRef}>web experiences.</span>
          </h1>

          <p className="hero__lede" ref={copyRef}>
            Crafting performant, engaging websites with thoughtful design and precise motion.
          </p>

          <a className="hero__cta button button--outline" href="#work" ref={ctaRef}>
            <span>View selected work</span>
            <span className="button__arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>

      <footer className="hero__strip" id="work" ref={stripRef}>
        <span className="hero__strip-label">Selected Work</span>
        <div className="hero__strip-links" aria-label="Selected work categories">
          <span>UI / UX</span>
          <span>Motion</span>
          <span>Front-end</span>
        </div>
      </footer>
    </section>
  );
}
