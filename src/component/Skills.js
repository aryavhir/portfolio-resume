
import { useState, useEffect, useRef } from "react";
import meter1 from "../asset/img/meter1.svg";
import meter2 from "../asset/img/meter2.svg";
import meter3 from "../asset/img/meter3.svg";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import colorSharp from "../asset/img/color-sharp.png"

export const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedSkills, setAnimatedSkills] = useState({});
  const skillsRef = useRef();

  const skillsData = [
    { name: "React.js", level: 90, category: "frontend" },
    { name: "JavaScript", level: 85, category: "frontend" },
    { name: "HTML/CSS", level: 92, category: "frontend" },
    { name: "Node.js", level: 78, category: "backend" },
    { name: "SQL", level: 80, category: "database" },
    { name: "React Native", level: 75, category: "mobile" },
    { name: "Git", level: 88, category: "tools" },
    { name: "Figma", level: 85, category: "design" },
    { name: "Swift", level: 70, category: "mobile" },
    { name: "LaTeX", level: 65, category: "tools" }
  ];

  const responsive = {
    superLargeDesktop: {
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

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate skills with staggered delays
          skillsData.forEach((skill, index) => {
            setTimeout(() => {
              setAnimatedSkills(prev => ({
                ...prev,
                [skill.name]: skill.level
              }));
            }, index * 200);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const SkillBar = ({ skill }) => (
    <div className="skill-item" key={skill.name}>
      <div className="skill-info">
        <span className="skill-name">{skill.name}</span>
        <span className="skill-percentage">{animatedSkills[skill.name] || 0}%</span>
      </div>
      <div className="skill-bar">
        <div 
          className={`skill-progress ${skill.category}`}
          style={{ 
            width: `${animatedSkills[skill.name] || 0}%`,
            transition: 'width 1.5s ease-in-out'
          }}
        ></div>
      </div>
    </div>
  );

  return (
    <section className="skill" id="skills" ref={skillsRef}>
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="skill-bx wow zoomIn">
                        <h2>Skills</h2>
                        <p>Interactive skill levels with real-time animations<br></br>showcasing technical expertise across different domains.</p>
                        
                        {/* Interactive Skills Chart */}
                        <div className="interactive-skills-section">
                          <h3>Technical Proficiency</h3>
                          <div className="skills-grid">
                            {skillsData.map(skill => (
                              <SkillBar key={skill.name} skill={skill} />
                            ))}
                          </div>
                        </div>

                        {/* Original Carousel */}
                        <div className="skills-carousel-section">
                          <h3>Technology Stack</h3>
                          <Carousel responsive={responsive} infinite={true} className="owl-carousel owl-theme skill-slider">
                            <div className="item">
                              <img src={meter1} alt="React.js skill level" />
                              <h5>React.js</h5>
                            </div>
                            <div className="item">
                              <img src={meter1} alt="Figma skill level" />
                              <h5>Figma</h5>
                            </div>
                            <div className="item">
                              <img src={meter1} alt="SQL skill level" />
                              <h5>SQL</h5>
                            </div>
                            <div className="item">
                              <img src={meter2} alt="React Native skill level" />
                              <h5>React Native</h5>
                            </div>
                            <div className="item">
                              <img src={meter2} alt="Canva skill level" />
                              <h5>Canva</h5>
                            </div>
                            <div className="item">
                              <img src={meter2} alt="Swift skill level" />
                              <h5>Swift</h5>
                            </div>
                            <div className="item">
                              <img src={meter2} alt="HTML skill level" />
                              <h5>HTML</h5>
                            </div>
                            <div className="item">
                              <img src={meter3} alt="CSS skill level" />
                              <h5>CSS</h5>
                            </div>
                            <div className="item">
                              <img src={meter3} alt="Git skill level" />
                              <h5>Git</h5>
                            </div>
                            <div className="item">
                              <img src={meter3} alt="LaTeX skill level" />
                              <h5>LaTeX</h5>
                            </div>
                          </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <img className="background-image-left" src={colorSharp} alt="color" />
    </section>
  )
}
