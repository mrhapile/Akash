import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Hero } from './components/Hero';
import { ThirdScreen } from './components/ThirdScreen';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', prefersReducedMotion);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.09,
    });

    lenis.on('scroll', ScrollTrigger.update);

    let frameId = 0;
    const raf = (time) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    frameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#hero">
        Skip to content
      </a>
      <Hero reducedMotion={prefersReducedMotion} />
      <ThirdScreen reducedMotion={prefersReducedMotion} />
    </div>
  );
}
