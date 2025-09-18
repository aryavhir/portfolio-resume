
// We'll create dynamic SVG meters instead of static images
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import colorSharp from "../asset/img/color-sharp.png"
import LogoLoop from '../asset/logos/LogoLoop';
import { SiGithub, SiInstagram, SiLinkedin, 
  SiReact, SiNextdotjs, SiTypescript, 
  SiBootstrap, SiNodedotjs, SiExpress, SiMongodb, 
  SiGit, SiVite, SiJavascript, 
  SiHtml5, SiCss3, SiDocker, SiGmail  } from 'react-icons/si';
  import ScrambledText from '../asset/text-animation/ScrambledText';

const techLogos = [
  { node: <SiGithub color="#ffffffff" />, title: "GitHub", href: "https://github.com" },
  { node: <SiInstagram color="#ffffffff"  />, title: "Instagram", href: "https://instagram.com" },
  { node: <SiLinkedin color="#ffffffff" />, title: "LinkedIn", href: "https://linkedin.com" },
  { node: <SiReact color="#ffffffff"  />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs color="#ffffffff"  />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript color="#ffffffff"  />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiGmail color="#ffffffff" />, title: "Email", href: "mailto:yourmail@example.com" },
  { node: <SiGit color="#ffffffff" />, title: "Git", href: "https://git-scm.com" },
  { node: <SiVite  color="#ffffffff" />, title: "Vite", href: "https://vitejs.dev" },
  { node: <SiDocker  color="#ffffffff" />, title: "Docker", href: "https://www.docker.com" },
];
export const Skills = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  // Skills data with React.js as highest at 70%
  const skills = [
    { name: "React.js", percentage: 70 },
    { name: "JavaScript", percentage: 65 },
    { name: "HTML5", percentage: 68 },
    { name: "TypeScript", percentage: 55 },
    { name: "Node.js", percentage: 60 },
    { name: "CSS3", percentage: 65 },
    { name: "React Native", percentage: 50 },
    { name: "RESTful APIs", percentage: 58 },
    { name: "Git", percentage: 62 },
    { name: "SQL", percentage: 45 },
    { name: "Go", percentage: 40 },
    { name: "Swift", percentage: 35 },
    { name: "AWS", percentage: 30 },
    { name: "Figma", percentage: 42 },
    { name: "LaTeX", percentage: 25 }
  ];

  // Component to create dynamic circular progress meter
  const CircularMeter = ({ percentage, size = 150 }) => {
    const radius = 45;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            stroke="#2a2a2a"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            stroke="url(#gradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#AA367C" />
              <stop offset="100%" stopColor="#4A2FBD" />
            </linearGradient>
          </defs>
        </svg>
        {/* Percentage text in center */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '18px',
            fontWeight: '700',
            color: '#fff',
            textShadow: '0 0 10px rgba(170, 54, 124, 0.5)'
          }}
        >
          {percentage}%
        </div>
      </div>
    );
  };

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
                       
Skills here are strictly adhering to the technical aspects<br></br>(referring to the coding front).
                        </ScrambledText>
        <div style={{ height: '200px', position: 'relative', overflow: 'hidden'}}>
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
  )
}
