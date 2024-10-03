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

  return (
    <section className="skill" id="skills">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="skill-bx wow zoomIn">
                        <h2>Skills</h2>
                        <p>skills here are strictly adhering to the technical aspects<br></br>(refering to the coding front).</p>
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
        <img className="background-image-left" src={colorSharp} alt="color" />
    </section>
  )
}
