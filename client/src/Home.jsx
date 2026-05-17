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
    // Track scroll progress against the container boundary
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
        
        {/* Main layout container to hold both items side-by-side */}
        <div className="video-text-container">
          
          {/* Left Side: The Video Frame */}
          <video
            ref={videoRef}
            src="client\src\assets\EB4E4FC6-F60D-41FA-B9AA-3EBE0CFBF4AF.mp4" 
            playsInline
            muted
            preload="auto"
            className="scrub-video-frame"
          />

          {/* Right Side: The New Medium-Pink Text Box */}
          <div className="info-text-box">
            <h1 className="display-4 cute-brand-font mb-3">Hello there<span>&#128075;</span> </h1>
            <h4 className="display-6 cute-brand-font mb-3"> Welcome to my personal website! My name is Vittoria and 
                I'm so excited to show you around my site!</h4>
            <p className="fs-4 cute-navbar-font">
              Up above, you will see tabs that reflect some of my interests. In the Coding Projects tab, you can see 
              what I've been working beginning from the sixth grade! When you click on the Study Abroad Newsletter tab, 
              you can view my reflections from my semester in Madrid, Spain. Lastly, in the Opinions on the World tab, 
              I share some of my perspectives on international relations, technology policy, and beyond. Enjoy!
            </p>
          </div>

        </div>
        
      </div>
    </div>
  );
}

export default Home;