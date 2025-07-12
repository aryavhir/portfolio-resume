import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Terminal } from "./Terminal";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const toRotate = [ "Full Stack Developer", "React Specialist", "Problem Solver", "Code Artist" ];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [text])

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(500);
    }
  }

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="align-items-center">
          <Col xs={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                <div className="banner-intro">
                  <span className="tagline">$ whoami</span>
                  <h1>Hi! I'm <span className="highlight">Aryavhir Koul</span></h1>
                  <h2 className="rotating-text">
                    I'm a <span className="txt-rotate"><span className="wrap">{text}</span></span>
                  </h2>
                  <p className="terminal-intro">
                    Welcome to my interactive portfolio! Use the terminal below to explore my projects, skills, and experience. 
                    Type <code>help</code> to get started, or try commands like <code>skills</code>, <code>projects</code>, or <code>contact</code>.
                  </p>
                  <div className="terminal-hint">
                    <span className="blink">▶</span> Click on the terminal and start typing commands
                  </div>
                </div>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                  <Terminal />
                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
}