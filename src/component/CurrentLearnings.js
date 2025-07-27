
import { Container, Row, Col } from "react-bootstrap";
import { Workspace3D } from "./Workspace3D";
import colorSharp2 from "../asset/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const CurrentLearnings = () => {
  return (
    <section className="current-learnings" id="current-learnings">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn": ""}>
                <h2>Current Learnings</h2>
                <p>Explore my interactive 3D workspace and current learning journey. This immersive experience showcases ongoing projects and technologies I'm currently mastering.</p>
                
                <div className="current-learnings-content">
                  <div className="workspace-description">
                    <h3>Interactive 3D Workspace</h3>
                    <p>Built with Three.js and React Three Fiber, this immersive 3D experience showcases my skills in creating interactive web applications with realistic lighting, animations, and responsive controls.</p>
                  </div>
                  
                  <Workspace3D />
                  
                  <div className="learning-technologies">
                    <h3>Technologies Currently Learning</h3>
                    <div className="tech-grid">
                      <div className="tech-item">
                        <h4>Three.js & React Three Fiber</h4>
                        <p>3D graphics and interactive experiences</p>
                      </div>
                      <div className="tech-item">
                        <h4>Advanced React Patterns</h4>
                        <p>Custom hooks, context optimization, and performance</p>
                      </div>
                      <div className="tech-item">
                        <h4>WebGL & GLSL</h4>
                        <p>Custom shaders and graphics programming</p>
                      </div>
                      <div className="tech-item">
                        <h4>AI/ML Integration</h4>
                        <p>Implementing AI features in web applications</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2} alt="color"></img>
    </section>
  )
}
