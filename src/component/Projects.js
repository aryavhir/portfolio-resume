import { Container, Row, Col } from "react-bootstrap";

// Removed unused project image imports - now using optimized lazy loading
import colorSharp2 from "../asset/img/color-sharp2.png";
import 'animate.css';
import ConditionalRender from "../components/ConditionalRender";
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
               <ConditionalRender
                 fallback={
                   <div style={{ 
                     height: '600px', 
                     display: 'flex', 
                     alignItems: 'center', 
                     justifyContent: 'center',
                     color: '#fff',
                     background: 'rgba(0,0,0,0.1)',
                     borderRadius: '10px' 
                   }}>
                     <div>
                       <div style={{ marginBottom: '10px' }}>Loading certificates...</div>
                       <div style={{
                         width: '50px',
                         height: '3px',
                         background: 'linear-gradient(90deg, #AA367C, #4A2FBD)',
                         borderRadius: '2px',
                         animation: 'loadingPulse 1.5s ease-in-out infinite'
                       }} />
                     </div>
                   </div>
                 }
                 once={true}
               >
                 <div style={{ height: '600px', position: 'relative' }}>
                   <OptimizedCircularGallery bend={1} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02}/>
                 </div>
               </ConditionalRender>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2} alt="color"></img>
    </section>
  )
}
