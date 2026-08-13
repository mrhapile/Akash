import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const heroPosterSrc = `${import.meta.env.BASE_URL}hero/Initial-hero.png`;
const heroVideoSrc = `${import.meta.env.BASE_URL}hero/1786473783457496.mp4`;
const heroCharacterSrc = `${import.meta.env.BASE_URL}hero/character.png`;

export function Hero({ reducedMotion }) {
  const sectionRef = useRef(null);
  const navRef = useRef(null);
  const roleRef = useRef(null);
  const lineOneRef = useRef(null);
  const lineTwoRef = useRef(null);
  const copyRef = useRef(null);
  const ctaRef = useRef(null);
  const stripRef = useRef(null);
  const posterRef = useRef(null);
  const videoRef = useRef(null);
  const characterRef = useRef(null);

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
    const textFadeTargets = [roleRef.current, ...titleLines, copyRef.current, ctaRef.current].filter(Boolean);

    let scrollTimeline = null;

    const syncVideoToScroll = (progress) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      const endTime = Math.max(video.duration - 0.01, 0);
      const nextTime = progress * endTime;

      if (Math.abs(video.currentTime - nextTime) > 0.02) {
        video.currentTime = nextTime;
      }
    };

    const setupVideoScroll = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      if (scrollTimeline) {
        scrollTimeline.kill();
        scrollTimeline = null;
      }

      video.pause();
      video.currentTime = 0;

      scrollTimeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(window.innerHeight * 2.8, 2600)}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => syncVideoToScroll(self.progress),
          onRefresh: (self) => syncVideoToScroll(self.progress),
        },
      });

      scrollTimeline
        .to(posterRef.current, { autoAlpha: 0, duration: 0.2 }, 0)
        .to(video, { autoAlpha: 1, duration: 0.2 }, 0)
        .to(textFadeTargets, { autoAlpha: 0, duration: 0.08 }, 0.01)
        .to(stripRef.current, { autoAlpha: 0, duration: 0.08 }, 0.01)
        .to(characterRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: 'power2.out' }, 0.16);

      syncVideoToScroll(0);
      ScrollTrigger.refresh();
    };

    const handleLoadedMetadata = () => {
      setupVideoScroll();
    };

    gsap.set(posterRef.current, { autoAlpha: 1 });
    gsap.set(video, { autoAlpha: 0 });
    gsap.set(characterRef.current, { autoAlpha: 0, y: '28vh', scale: 0.98 });
    gsap.set(navRef.current, { autoAlpha: 1, y: 0 });

    if (reducedMotion) {
      gsap.set(posterRef.current, { autoAlpha: 1 });
      gsap.set(video, { autoAlpha: 0 });
      gsap.set(characterRef.current, { autoAlpha: 0, y: 0, scale: 1 });
      gsap.set(motionTargets, { autoAlpha: 1, x: 0, y: 0 });
      video.pause();
      video.currentTime = 0;
      return () => {
      };
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    gsap.set(motionTargets, { autoAlpha: 1, y: 0 });

    if (video.readyState >= 1) {
      setupVideoScroll();
    } else {
      video.load();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (scrollTimeline) {
        scrollTimeline.kill();
      }
    };
  }, [reducedMotion]);

  return (
    <section className="hero" id="hero" ref={sectionRef} aria-labelledby="hero-title">
      <div className="hero__art" aria-hidden="true">
        <img ref={posterRef} className="hero__poster" src={heroPosterSrc} alt="" loading="eager" decoding="async" />
        <video
          ref={videoRef}
          className="hero__video"
          src={heroVideoSrc}
          preload="auto"
          muted
          playsInline
          tabIndex={-1}
        />
        <img
          ref={characterRef}
          className="hero__character"
          src={heroCharacterSrc}
          alt=""
          loading="eager"
          decoding="async"
          draggable="false"
        />
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
