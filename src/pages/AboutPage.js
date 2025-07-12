
import React from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { Terminal } from "../component/Terminal";
import { GitHubDashboard } from "../component/GitHubDashboard";

export const AboutPage = () => {
  const skillsData = [
    { name: 'React.js', level: 90, color: '#61DAFB' },
    { name: 'JavaScript', level: 85, color: '#F7DF1E' },
    { name: 'HTML/CSS', level: 95, color: '#E34F26' },
    { name: 'Swift', level: 75, color: '#FA7343' },
    { name: 'React Native', level: 80, color: '#61DAFB' },
    { name: 'Git', level: 85, color: '#F05032' },
    { name: 'Figma/Design', level: 80, color: '#F24E1E' },
    { name: 'SQL', level: 70, color: '#336791' }
  ];

  const timeline = [
    {
      year: '2024',
      title: 'Advanced React Development',
      description: 'Mastered React.js with focus on modern hooks and state management'
    },
    {
      year: '2024',
      title: 'iOS Development Journey',
      description: 'Learned Swift and iOS app development fundamentals'
    },
    {
      year: '2023',
      title: 'Web Development Foundation',
      description: 'Built strong foundation in HTML, CSS, and JavaScript'
    },
    {
      year: '2023',
      title: 'UI/UX Design Principles',
      description: 'Studied user experience design and interface development'
    }
  ];

  return (
    <div style={{ paddingTop: '100px' }}>
      {/* Hero Section */}
      <section style={{ padding: '80px 0', background: '#121212' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 style={{ 
                fontSize: '55px', 
                fontWeight: '700',
                background: 'linear-gradient(45deg, #AA367C, #4A2FBD)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '30px'
              }}>
                About Me
              </h1>
              <p style={{ 
                color: '#B8B8B8', 
                fontSize: '20px', 
                lineHeight: '1.6',
                marginBottom: '30px'
              }}>
                I'm a passionate developer on a continuous learning journey, 
                exploring the intersection of technology and creativity. My focus 
                lies in building user-centered applications that solve real-world problems.
              </p>
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(170, 54, 124, 0.1) 0%, rgba(74, 47, 189, 0.1) 100%)',
                border: '1px solid rgba(170, 54, 124, 0.3)',
                borderRadius: '15px',
                padding: '25px',
                marginTop: '30px'
              }}>
                <h4 style={{ color: '#fff', marginBottom: '15px' }}>Current Focus</h4>
                <p style={{ color: '#B8B8B8', marginBottom: '0' }}>
                  🎯 Advancing React.js skills<br/>
                  📱 Exploring mobile development<br/>
                  🎨 Improving UI/UX design capabilities<br/>
                  🚀 Building innovative projects
                </p>
              </div>
            </Col>
            <Col lg={4}>
              <div style={{
                background: 'linear-gradient(135deg, #AA367C 0%, #4A2FBD 100%)',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#fff', marginBottom: '20px' }}>Quick Facts</h3>
                <div style={{ color: '#fff' }}>
                  <p><strong>💻 Primary Stack:</strong> React, JavaScript</p>
                  <p><strong>🎓 Learning:</strong> Always expanding skills</p>
                  <p><strong>🌟 Passion:</strong> Clean, functional code</p>
                  <p><strong>🎯 Goal:</strong> Full-stack mastery</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Skills Section */}
      <section style={{ padding: '80px 0', background: '#0a0a0a' }}>
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mb-5">
                <h2 style={{ 
                  fontSize: '40px', 
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '20px'
                }}>
                  Technical Skills
                </h2>
                <p style={{ color: '#B8B8B8', fontSize: '18px' }}>
                  My proficiency across different technologies and tools
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={8} className="mx-auto">
              {skillsData.map((skill, index) => (
                <div key={index} style={{ marginBottom: '30px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <span style={{ color: '#fff', fontWeight: '600' }}>{skill.name}</span>
                    <span style={{ color: skill.color, fontWeight: '600' }}>{skill.level}%</span>
                  </div>
                  <ProgressBar 
                    now={skill.level} 
                    style={{ 
                      height: '10px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '10px'
                    }}
                  >
                    <ProgressBar 
                      now={skill.level}
                      style={{ 
                        backgroundColor: skill.color,
                        borderRadius: '10px'
                      }}
                    />
                  </ProgressBar>
                </div>
              ))}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Timeline Section */}
      <section style={{ padding: '80px 0', background: '#121212' }}>
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mb-5">
                <h2 style={{ 
                  fontSize: '40px', 
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '20px'
                }}>
                  Learning Journey
                </h2>
                <p style={{ color: '#B8B8B8', fontSize: '18px' }}>
                  Key milestones in my development journey
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={8} className="mx-auto">
              {timeline.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex',
                  marginBottom: '40px',
                  position: 'relative'
                }}>
                  <div style={{
                    background: 'linear-gradient(45deg, #AA367C, #4A2FBD)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '30px',
                    flexShrink: 0
                  }}>
                    <span style={{ color: '#fff', fontWeight: '700' }}>{item.year}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#fff', marginBottom: '10px' }}>{item.title}</h4>
                    <p style={{ color: '#B8B8B8', lineHeight: '1.6' }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Terminal and GitHub Dashboard */}
      <Terminal />
      <GitHubDashboard />
    </div>
  );
};
