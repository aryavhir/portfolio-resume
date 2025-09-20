import { useEffect } from 'react';
import 'react-multi-carousel/lib/styles.css';

import LogoLoop from '../asset/logos/LogoLoop';
import { SiSwift, SiFigma, SiLatex, SiGo, 
  SiReact, SiNextdotjs, SiTypescript, 
  SiBootstrap, SiNodedotjs, SiExpress, SiMongodb, 
  SiGit, SiVite, SiJavascript, 
  SiHtml5, SiCss3, SiDocker } from 'react-icons/si';
import ScrambledText from '../asset/text-animation/ScrambledText';

const techLogos = [
  { node: <SiReact color="#ffffffff" />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs color="#ffffffff" />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript color="#ffffffff" />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiGit color="#ffffffff" />, title: "Git", href: "https://git-scm.com" },
  { node: <SiVite color="#ffffffff" />, title: "Vite", href: "https://vitejs.dev" },
  { node: <SiDocker color="#ffffffff" />, title: "Docker", href: "https://www.docker.com" },
  { node: <SiJavascript color="#ffffffff" />, title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { node: <SiHtml5 color="#ffffffff" />, title: "HTML5", href: "https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5" },
  { node: <SiCss3 color="#ffffffff" />, title: "CSS3", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { node: <SiBootstrap color="#ffffffff" />, title: "Bootstrap", href: "https://getbootstrap.com" },
  { node: <SiNodedotjs color="#ffffffff" />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiExpress color="#ffffffff" />, title: "Express.js", href: "https://expressjs.com" },
  { node: <SiMongodb color="#ffffffff" />, title: "MongoDB", href: "https://www.mongodb.com" },
  { node: <SiSwift color="#ffffffff" />, title: "Swift", href: "https://swift.org" },
  { node: <SiGo color="#ffffffff" />, title: "Go", href: "https://golang.org" },
  { node: <SiFigma color="#ffffffff" />, title: "Figma", href: "https://figma.com" },
  { node: <SiLatex color="#ffffffff" />, title: "LaTeX", href: "https://www.latex-project.org" },
];

export const Skills = () => {
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

    // Observe all fade elements in skills section
    const fadeElements = document.querySelectorAll('#skills .fade-element');
    fadeElements.forEach(element => {
      observer.observe(element);
    });

    return () => {
      fadeElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <section className="skill" id="skills">
      <div className="container">
        <div className="row">
          <div className="col-12">
            
            {/* Skill box with fade-up effect */}
            <div className="skill-bx wow zoomIn fade-element fade-up">
              
              {/* Header text with fade-up effect */}
              <div className="fade-element fade-up">
                <ScrambledText
                  className="scrambled-text-demo"
                  radius={100}
                  duration={1.2}
                  speed={0.5}
                >
                  <h2>Skills</h2>
                  Skills here are strictly adhering to the technical aspects<br />
                  (referring to the coding front).
                </ScrambledText>
              </div>
              
              {/* Logo container with fade-scale effect (delayed) */}
              <div className="fade-element fade-scale">
                <div className="skills-logo-container" style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                  <LogoLoop
                    logos={techLogos}
                    speed={100}
                    direction="left"
                    logoHeight={70}
                    gap={80}
                    pauseOnHover
                    scaleOnHover
                    fadeOut
                    fadeOutColor="#0c0c0cff"
                    ariaLabel="Technology partners"
                  />
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};