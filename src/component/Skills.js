import 'react-multi-carousel/lib/styles.css';

import LogoLoop from '../asset/logos/LogoLoop';
import { SiSwift, SiFigma, SiLatex, SiGo, 
  SiReact, SiNextdotjs, SiTypescript, 
  SiBootstrap, SiNodedotjs, SiExpress, SiMongodb, 
  SiGit, SiVite, SiJavascript, 
  SiHtml5, SiCss3, SiDocker } from 'react-icons/si';
import ScrambledText from '../asset/text-animation/ScrambledText';
// import './Skills.css'; // We'll need this for custom styles

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
  return (
    <section className="skill" id="skills">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="skill-bx wow zoomIn">
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
    </section>
  );
};