import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import { Workspace3D } from "./Workspace3D";
import projImg1 from "../asset/img/7.png";
import projImg2 from "../asset/img/5.png";
import projImg3 from "../asset/img/cert.png";
import projImg4 from "../asset/img/4.png";
import projImg5 from "../asset/img/cert1.png";
import projImg6 from "../asset/img/6.png";
import projImg7 from "../asset/img/2.png";
import colorSharp2 from "../asset/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';


export const Projects = () => {
  const projects = [
    {
      title: "React.js",
      description: "Development with react.js",
      imgUrl: projImg1,
      url: "https://coursera.org/share/aa40b99999eb9fc6b40adb6852667509"
    },
    {
      title: "Principles of UX/UI",
      description: "Working with figma/canva",
      imgUrl: projImg2,
      url:"https://coursera.org/share/a34bea8750201d2761cdf61db9767a3e"
    },
    {
      title: "Version Control",
      description: "Git",
      imgUrl: projImg3,
      url:"https://coursera.org/share/671acf667f98846ab0e414bc71212c62"
    },
    {
      title: "Javascript",
      description: "Design & Development",
      imgUrl: projImg4,
      url:"https://coursera.org/share/98cb29c56c04877968661737170dd83b"
    },
    {
      title: "IOS Mobile Development",
      description: "Working With Xcode",
      imgUrl: projImg5,
      url:"https://coursera.org/share/6be41773787ed7c1f15ea794be75de26"
    },
    {
      title: "Fundamentals of Swift",
      description: "Swift Language",
      imgUrl: projImg6,
      url:"https://coursera.org/share/6f541d69adae9545d6f6edb296e5f35e"
    },
    {
      title: "Advance Swift",
      description: "Swift Language",
      imgUrl: projImg7,
      url:"https://coursera.org/share/94003db48fd65d9975e3cfe0595970dc"
    }
  ];
  const firstTabProjects = projects.slice(0, 4);
  const secondTabProjects = projects.slice(4);
  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn": ""}>
                <h2>Courses Completed</h2>
                <p>This is a collection of online Courses completed by me  through sites such as coursera. The images on click would lead you to the actual certificate credentials.</p>
                <Tab.Container id="projects-tabs" defaultActiveKey="first">
                  <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                    <Nav.Item>
                      <Nav.Link eventKey="first">Tab 1</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">Tab 2</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="third">Tab 3</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                    <Tab.Pane eventKey="first">
                      <Row>
                        {
                          firstTabProjects.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                {...project}
                                />
                            )
                          })
                        }
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <Row>
                        {secondTabProjects.map((project, index) => (
                          <ProjectCard
                            key={index}
                            {...project}
                          />
                        ))}
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                      <p>Interactive 3D Workspace - Built with Three.js and React Three Fiber. This immersive 3D experience showcases my skills in creating interactive web applications with realistic lighting, animations, and responsive controls.</p>
                      <Workspace3D />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2} alt="color"></img>
    </section>
  )
}
