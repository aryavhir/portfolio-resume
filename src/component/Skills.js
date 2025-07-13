
import meter1 from "../asset/img/meter1.svg";
import meter2 from "../asset/img/meter2.svg";
import meter3 from "../asset/img/meter3.svg";
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

  // Skills data with percentages and corresponding meters
  const skills = [
    // High proficiency (70-80%) - meter1
    { name: "React.js", percentage: 70, meter: meter1 },
    { name: "JavaScript", percentage: 70, meter: meter1 },
    { name: "HTML5", percentage: 70, meter: meter1 },
    
    // Medium proficiency (50-69%) - meter2
    { name: "TypeScript", percentage: 60, meter: meter2 },
    { name: "Node.js", percentage: 65, meter: meter2 },
    { name: "CSS3", percentage: 65, meter: meter2 },
    { name: "React Native", percentage: 55, meter: meter2 },
    { name: "RESTful APIs", percentage: 60, meter: meter2 },
    { name: "Git", percentage: 60, meter: meter2 },
    { name: "SQL", percentage: 55, meter: meter2 },
    
    // Learning/Moderate proficiency (30-49%) - meter3
    { name: "Go", percentage: 45, meter: meter3 },
    { name: "Swift", percentage: 40, meter: meter3 },
    { name: "AWS", percentage: 35, meter: meter3 },
    { name: "Figma", percentage: 45, meter: meter3 },
    { name: "LaTeX", percentage: 35, meter: meter3 }
  ];

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
                                    <img src={skill.meter} alt={`${skill.name} skill level`} />
                                    <h5>{skill.name}</h5>
                                    <span className="skill-percentage">{skill.percentage}%</span>
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
