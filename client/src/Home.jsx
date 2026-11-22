import { useEffect, useRef } from 'react';
import { HeroCollageBack, HeroCollageFront } from './garden/scenes';
import { useSite } from './site/context';
import './Home.css';

function Intro({ paragraphs, className }) {
  return (
    <div className={`home-intro ${className}`}>
      {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
    </div>
  );
}

/**
 * Landing page. Scrolling through the tall track scrubs the hero video
 * frame-by-frame while the hero stays pinned. All copy and the video come
 * from the private site content (/api/site).
 */
function Home() {
  const { site, loading } = useSite();
  const home = site.home ?? {};
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const video = videoRef.current;
    if (!track) return undefined;

    const stacked = window.matchMedia('(max-width: 900px)');
    let frame = 0;
    const update = () => {
      frame = 0;
      let progress;
      if (stacked.matches) {
        // Phones: no pinned hero; scrub as the frame travels up the screen.
        const r = (video ?? track).getBoundingClientRect();
        progress = (window.innerHeight - r.bottom) / (window.innerHeight * 0.75);
      } else {
        const max = track.offsetHeight - window.innerHeight;
        progress = max > 0 ? (window.scrollY - track.offsetTop) / max : 0;
      }
      progress = Math.min(1, Math.max(0, progress));
      if (video?.duration) video.currentTime = video.duration * progress;
      if (dotRef.current) dotRef.current.style.setProperty('--progress', progress);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };

    video?.addEventListener('loadedmetadata', update);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      cancelAnimationFrame(frame);
      video?.removeEventListener('loadedmetadata', update);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [home.heroVideo?.url]);

  if (loading) return <div className="home-placeholder" />;

  const intro = home.intro ?? [];
  return (
    <div className="home-track" ref={trackRef}>
      <section className="home-hero">
        <div className="home-text">
          {home.greeting && <p className="home-greeting">{home.greeting}</p>}
          <h1 className="home-title">
            {(home.titleLines ?? []).map((line, i) => (
              <span key={i} className={line.accent ? 'accent' : undefined}>{line.text}</span>
            ))}
          </h1>
          <Intro paragraphs={intro} className="desktop-only" />
        </div>

        <div className="home-visual">
          <HeroCollageBack />
          <div className="home-frame">
            {home.heroVideo?.url && (
              <video ref={videoRef} src={home.heroVideo.url} muted playsInline preload="auto"
                     aria-label={home.heroAlt} />
            )}
          </div>
          <HeroCollageFront />
        </div>

        {home.scrollHint && (
          <div className="home-scroll" aria-hidden="true">
            <span className="home-scroll-label">{home.scrollHint}</span>
            <span className="home-scroll-line"><span ref={dotRef} className="home-scroll-dot" /></span>
          </div>
        )}
      </section>
      <Intro paragraphs={intro} className="mobile-only" />
    </div>
  );
}

export default Home;
