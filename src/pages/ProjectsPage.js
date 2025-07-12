
import React from 'react';
import { Projects } from "../component/Projects";
import { Container, Row, Col } from 'react-bootstrap';

export const ProjectsPage = () => {
  return (
    <div style={{ paddingTop: '100px' }}>
      {/* Hero Section */}
      <section style={{ padding: '80px 0', background: '#121212' }}>
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center">
                <h1 style={{ 
                  fontSize: '55px', 
                  fontWeight: '700',
                  background: 'linear-gradient(45deg, #AA367C, #4A2FBD)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '30px'
                }}>
                  My Projects & Achievements
                </h1>
                <p style={{ 
                  color: '#B8B8B8', 
                  fontSize: '20px', 
                  lineHeight: '1.6',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}>
                  A comprehensive collection of my learning journey, certifications, 
                  and projects that showcase my growth as a developer.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Projects />
    </div>
  );
};
