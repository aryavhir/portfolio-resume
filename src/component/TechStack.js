
import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export const TechStack = () => {
  const [hoveredTech, setHoveredTech] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const techStack = {
    frontend: [
      { name: 'React', proficiency: 90, color: '#61DAFB', description: 'Primary framework for building user interfaces' },
      { name: 'JavaScript', proficiency: 85, color: '#F7DF1E', description: 'Core programming language for web development' },
      { name: 'HTML5', proficiency: 92, color: '#E34F26', description: 'Semantic markup and modern web standards' },
      { name: 'CSS3', proficiency: 88, color: '#1572B6', description: 'Styling and responsive design' },
      { name: 'Bootstrap', proficiency: 80, color: '#7952B3', description: 'CSS framework for responsive layouts' }
    ],
    backend: [
      { name: 'Node.js', proficiency: 78, color: '#339933', description: 'Server-side JavaScript runtime' },
      { name: 'Express', proficiency: 75, color: '#000000', description: 'Web application framework for Node.js' },
      { name: 'REST APIs', proficiency: 82, color: '#FF6B6B', description: 'RESTful web services design and implementation' }
    ],
    mobile: [
      { name: 'React Native', proficiency: 75, color: '#61DAFB', description: 'Cross-platform mobile development' },
      { name: 'Swift', proficiency: 70, color: '#FA7343', description: 'iOS native app development' }
    ],
    database: [
      { name: 'SQL', proficiency: 80, color: '#336791', description: 'Relational database management' },
      { name: 'MongoDB', proficiency: 72, color: '#47A248', description: 'NoSQL document database' }
    ],
    tools: [
      { name: 'Git', proficiency: 88, color: '#F05032', description: 'Version control and collaboration' },
      { name: 'Figma', proficiency: 85, color: '#F24E1E', description: 'UI/UX design and prototyping' },
      { name: 'VS Code', proficiency: 90, color: '#007ACC', description: 'Integrated development environment' }
    ]
  };

  const categories = ['all', 'frontend', 'backend', 'mobile', 'database', 'tools'];

  const getFilteredTech = () => {
    if (selectedCategory === 'all') {
      return Object.values(techStack).flat();
    }
    return techStack[selectedCategory] || [];
  };

  const TechBubble = ({ tech, index }) => (
    <div 
      className={`tech-bubble ${hoveredTech === tech.name ? 'hovered' : ''}`}
      style={{
        '--tech-color': tech.color,
        '--proficiency': tech.proficiency,
        animationDelay: `${index * 0.1}s`
      }}
      onMouseEnter={() => setHoveredTech(tech.name)}
      onMouseLeave={() => setHoveredTech(null)}
    >
      <div className="tech-name">{tech.name}</div>
      <div className="tech-proficiency">{tech.proficiency}%</div>
      {hoveredTech === tech.name && (
        <div className="tech-tooltip">
          {tech.description}
        </div>
      )}
    </div>
  );

  return (
    <section className="tech-stack" id="tech-stack">
      <Container>
        <Row>
          <Col size={12}>
            <div className="tech-stack-bx">
              <h2>Technology Stack</h2>
              <p>Interactive visualization of my technical expertise</p>
              
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              <div className="tech-visualization">
                <div className="tech-grid">
                  {getFilteredTech().map((tech, index) => (
                    <TechBubble key={tech.name} tech={tech} index={index} />
                  ))}
                </div>
              </div>

              <div className="proficiency-legend">
                <div className="legend-item">
                  <div className="legend-color expert"></div>
                  <span>Expert (80-100%)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color intermediate"></div>
                  <span>Intermediate (60-79%)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color beginner"></div>
                  <span>Beginner (40-59%)</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
