import React, { useEffect, useRef } from 'react';
import './Home.css'; 
 
function Home() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
 
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
 
    if (!video || !container) return;
 
    video.load();
 
    const handleScroll = () => {
      const scrollTop = window.scrollY - container.offsetTop;
      const maxScroll = container.scrollHeight - window.innerHeight;
 
      let scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
      
      const speedMultiplier = 2.5; 
      scrollFraction = Math.min(1, scrollFraction * speedMultiplier);
      if (video.duration) {
        video.currentTime = video.duration * scrollFraction;
      }
    };
 
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
 
  return (
    <div ref={containerRef} className="scrub-container">
      <div className="sticky-video-wrapper">
        
        {/* Main layout container — video and text box side by side */}
        <div className="video-text-container">
          
          {/* Left Side: Video */}
          <div className="video-panel">
            <video
              ref={videoRef}
              src="client\src\assets\EB4E4FC6-F60D-41FA-B9AA-3EBE0CFBF4AF.mp4"
              playsInline
              muted
              preload="auto"
              className="scrub-video-frame"
            />
          </div>
 
          {/* Right Side: Text Box */}
          <div className="info-text-box">
            <h1 className="display-4 cute-brand-font mb-3">
              Hello there<span>&#128075;</span> Welcome to my personal website! My name is Vittoria and 
              I'm so excited to show you around my site!
            </h1>
            <p className="fs-4 cute-navbar-font">
              Up above, you will see tabs that reflect some of my interests. In the <b className="cute-font">Coding Projects</b> tab, you can see 
              what I've been working on beginning from the sixth grade! When you click on the <b className="cute-font">Study Abroad Newsletter</b> tab, 
              you can view my reflections from my semester in Madrid, Spain. Next, in the <b className="cute-font">Opinions on the World</b> tab, 
              I share some of my perspectives on international relations, technology policy, and beyond. Lastly, you can 
              check out some of my book reviews in the <b className="cute-font">What I'm Reading</b> tab. Enjoy!
            </p>
          </div>
 
        </div>
        
      </div>
    </div>
  );
}
 
export default Home;