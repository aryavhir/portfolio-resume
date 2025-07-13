
// We'll create dynamic SVG meters instead of static images
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import colorSharp from "../asset/img/color-sharp.png"

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

  // Skills data with modest percentages
  const skills = [
    { name: "React.js", percentage: 85 },
    { name: "JavaScript", percentage: 80 },
    { name: "HTML5", percentage: 90 },
    { name: "TypeScript", percentage: 70 },
    { name: "Node.js", percentage: 75 },
    { name: "CSS3", percentage: 85 },
    { name: "React Native", percentage: 65 },
    { name: "RESTful APIs", percentage: 70 },
    { name: "Git", percentage: 80 },
    { name: "SQL", percentage: 60 },
    { name: "Go", percentage: 50 },
    { name: "Swift", percentage: 45 },
    { name: "AWS", percentage: 40 },
    { name: "Figma", percentage: 55 },
    { name: "LaTeX", percentage: 35 }
  ];

  // Component to create dynamic circular progress meter
  const CircularMeter = ({ percentage, size = 120 }) => {
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
                        <h2>Skills</h2>
                        <p>Skills here are strictly adhering to the technical aspects<br></br>(referring to the coding front).</p>
                        <Carousel responsive={responsive} infinite={true} className="owl-carousel owl-theme skill-slider">
                            {skills.map((skill, index) => (
                                <div className="item" key={index}>
                                    <CircularMeter percentage={skill.percentage} />
                                    <h5>{skill.name}</h5>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
        <img className="background-image-left" src={colorSharp} alt="color" />
    </section>
  )
}
