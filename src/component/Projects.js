import { Container, Row, Col } from "react-bootstrap";


// Removed unused project image imports - now using optimized lazy loading
import colorSharp2 from "../asset/img/color-sharp2.png";
import 'animate.css';
import OptimizedCircularGallery from "../components/OptimizedCircularGallery"; 
import ScrambledText from '../asset/text-animation/ScrambledText';

export const Projects = () => {
  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
           
                <ScrambledText
                  className="scrambled-text-demo"
                  radius={100}
                  duration={1.2}
                  speed={0.5}
                >
               <h2>Courses Completed</h2> 
               This is a collection of online Courses completed by me  through sites such as coursera. 
               </ScrambledText> 
               <div style={{ height: '600px', position: 'relative' }}>
  <OptimizedCircularGallery bend={1} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02}/>
</div>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2} alt="color"></img>
    </section>
  )
}
