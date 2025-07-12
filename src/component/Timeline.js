
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Timeline.css';

export const Timeline = () => {
  const experiences = [
    {
      year: '2024',
      title: 'Full Stack Developer',
      company: 'Your Company',
      description: 'Building modern web applications with React and Node.js',
      icon: '💼'
    },
    {
      year: '2023',
      title: 'Learning Three.js',
      company: 'Self-taught',
      description: 'Exploring 3D web development and interactive experiences',
      icon: '🎓'
    },
    {
      year: '2022',
      title: 'Web Development Journey',
      company: 'Personal Projects',
      description: 'Started building projects with HTML, CSS, and JavaScript',
      icon: '🚀'
    }
  ];

  return (
    <section className="timeline" id="timeline">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="timeline-bx">
              <h2>My Journey</h2>
              <div className="timeline-container">
                {experiences.map((exp, index) => (
                  <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                    <div className="timeline-content">
                      <div className="timeline-icon">{exp.icon}</div>
                      <h3>{exp.title}</h3>
                      <h4>{exp.company}</h4>
                      <span className="timeline-year">{exp.year}</span>
                      <p>{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
