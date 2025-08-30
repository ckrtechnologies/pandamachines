import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pmLogo from "../../Assets/img/Logos/newPMLogo.png";
import './AnimatedLogo.css';

const AnimatedLogo = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState(0);

  const taglines = [
    "Innovate. Create. Deliver.",
    "Excellence in Every Project"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentView(prev => (prev + 1) % (taglines.length + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [taglines.length]);

  const showLogo = currentView === 0;
  const taglineIndex = currentView - 1;

  return (
    <div 
      onClick={() => navigate("/")}
      className="animated-logo-container relative cursor-pointer group"
    >
      {/* Glass morphism background */}
      <div className="glass-background"></div>
      
      {/* Floating particles */}
      <div className="floating-particles">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>

      {/* Neon glow effect */}
      <div className="neon-glow"></div>

      <div className="logo-content relative z-10">
        {/* Logo with 3D effect */}
        <div className={`logo-wrapper ${showLogo ? 'active' : 'hidden'}`}>
          <div className="logo-3d-container">
            <img
              className="logo-3d"
              src={pmLogo}
              alt="pm-Logo"
            />
            <div className="logo-reflection"></div>
          </div>
          <div className="logo-orbits">
            <div className="orbit orbit-1"></div>
            <div className="orbit orbit-2"></div>
            <div className="orbit orbit-3"></div>
          </div>
        </div>
        
        {/* Tagline with modern typography */}
        {!showLogo && (
          <div className="tagline-modern">
            <div className="tagline-glitch"></div>
            <p className="tagline-text-modern">
              <span className="text-gradient">{taglines[taglineIndex]}</span>
            </p>
            <div className="tagline-sparkles">
              <div className="sparkle sparkle-1">✦</div>
              <div className="sparkle sparkle-2">✦</div>
              <div className="sparkle sparkle-3">✦</div>
            </div>
          </div>
        )}
      </div>

      {/* Hover effect */}
      <div className="hover-ripple"></div>
    </div>
  );
};

export default AnimatedLogo;