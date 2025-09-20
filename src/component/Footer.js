import { useEffect, useRef } from 'react';
import ScrambledText from "../asset/text-animation/ScrambledText";
import linkedinIcon from "../asset/img/nav-icon1.svg";
import githubIcon from "../asset/img/nav-icon2.svg";
import instagramIcon from "../asset/img/nav-icon3.svg";

export const Footer = () => {
  const footerRef = useRef(null);
  const textRef = useRef(null);
  const iconsRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-visible');
        }
      });
    }, observerOptions);

    // Observe footer elements
    if (textRef.current) observer.observe(textRef.current);
    if (iconsRef.current) observer.observe(iconsRef.current);

    return () => {
      if (textRef.current) observer.unobserve(textRef.current);
      if (iconsRef.current) observer.unobserve(iconsRef.current);
    };
  }, []);

  return (
    <footer id="footer" className="footer">
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12, marginTop: '13%' }}>
        
        {/* Text with fade-up effect */}
        <div 
          ref={textRef}
          className="fade-element"
          style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.8s ease-out' }}
        >
          <ScrambledText className="scrambled-text-demo" radius={100} duration={1.2} speed={0.5}>
            Have a Figma? I'll turn it into a fast app.<br />
            Night owl, manga addict and someone who definitely has too many browser tabs open right now.
          </ScrambledText>
        </div>
    
        {/* Social icons with fade-up effect (delayed) */}
        <div 
          ref={iconsRef}
          className="social-icon fade-element" 
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0, 
            transform: 'translateY(30px)', 
            transition: 'all 0.8s ease-out 0.2s' // 0.2s delay
          }}
        >
          <a href="https://www.linkedin.com/in/" target="_blank" rel="noreferrer">
            <img src={linkedinIcon} alt="LinkedIn" />
          </a>
          <a href="https://github.com/aryavhir" target="_blank" rel="noreferrer">
            <img src={githubIcon} alt="GitHub" />
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noreferrer">
            <img src={instagramIcon} alt="Instagram" />
          </a>
        </div>
      </div>
    </footer>
  );
};