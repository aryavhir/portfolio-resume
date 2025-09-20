import { useEffect } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import colorSharp2 from "../asset/img/color-sharp2.png";
import 'animate.css';
import ConditionalRender from "../components/ConditionalRender";
import OptimizedCircularGallery from "../components/OptimizedCircularGallery";
import ScrambledText from '../asset/text-animation/ScrambledText';

export const Projects = () => {
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

    // Observe all fade elements in projects section
    const fadeElements = document.querySelectorAll('#projects .fade-element');
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
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            
            {/* Header text with fade-up effect */}
            <div className="fade-element fade-up">
              <ScrambledText
                className="scrambled-text-demo"
                radius={100}
                duration={1.2}
                speed={0.5}
              >
                <h2>Courses Completed</h2>
                This is a collection of online Courses completed by me through sites such as coursera.
              </ScrambledText>
            </div>
            
            {/* Gallery with fade-scale effect (delayed) */}
            <div className="fade-element fade-scale">
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
                  <OptimizedCircularGallery 
                    bend={1} 
                    textColor="#ffffff" 
                    borderRadius={0.05} 
                    scrollEase={0.02}
                  />
                </div>
              </ConditionalRender>
            </div>
            
          </Col>
        </Row>
      </Container>
      
      {/* Background image with fade-right effect */}
      <div className="fade-element fade-right">
        <img className="background-image-right" src={colorSharp2} alt="color" />
      </div>
    </section>
  )
}