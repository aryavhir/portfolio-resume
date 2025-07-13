import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import navIcon1 from "../asset/img/nav-icon1.svg";
import navIcon2 from "../asset/img/nav-icon2.svg";
import navIcon3 from "../asset/img/nav-icon3.svg";
import { HashLink } from "react-router-hash-link";
import { BrowserRouter as Router } from "react-router-dom";

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Apply theme to document body
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  };

  return (
    <Router>
      <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                href="#home"
                className={
                  activeLink === "home" ? "active navbar-link" : "navbar-link"
                }
                onClick={() => onUpdateActiveLink("home")}
              >
                Home
              </Nav.Link>
              <Nav.Link
                href="#terminal"
                className={
                  activeLink === "terminal"
                    ? "active navbar-link"
                    : "navbar-link"
                }
                onClick={() => onUpdateActiveLink("terminal")}
              >
                Terminal
              </Nav.Link>
              <Nav.Link
                href="#skills"
                className={
                  activeLink === "skills" ? "active navbar-link" : "navbar-link"
                }
                onClick={() => onUpdateActiveLink("skills")}
              >
                Skills
              </Nav.Link>
              <Nav.Link
                href="#projects"
                className={
                  activeLink === "projects"
                    ? "active navbar-link"
                    : "navbar-link"
                }
                onClick={() => onUpdateActiveLink("projects")}
              >
                Attestations
              </Nav.Link>
            </Nav>
            <span className="navbar-text">
              <div className="social-icon">
                <a href="https://www.linkedin.com/in/aryavhir-koul-04a08k/">
                  <img src={navIcon1} alt="" />
                </a>
                <a href="https://www.github.com/aryavhir">
                  <img src={navIcon2} alt="" />
                </a>
                <a href="https://www.instagram.com/aryavhir_koul/">
                  <img src={navIcon3} alt="" />
                </a>
              </div>
              <label className="bb8-toggle">
                <input 
                  className="bb8-toggle__checkbox" 
                  type="checkbox" 
                  checked={!isDarkMode}
                  onChange={toggleTheme}
                />
                <div className="bb8-toggle__container">
                  <div className="bb8-toggle__scenery">
                    <div className="bb8-toggle__star"></div>
                    <div className="bb8-toggle__star"></div>
                    <div className="bb8-toggle__star"></div>
                    <div className="bb8-toggle__star"></div>
                    <div className="bb8-toggle__star"></div>
                    <div className="bb8-toggle__star"></div>
                    <div className="bb8-toggle__star"></div>
                    <div className="tatto-1"></div>
                    <div className="tatto-2"></div>
                    <div className="gomrassen"></div>
                    <div className="hermes"></div>
                    <div className="chenini"></div>
                    <div className="bb8-toggle__cloud"></div>
                    <div className="bb8-toggle__cloud"></div>
                    <div className="bb8-toggle__cloud"></div>
                  </div>
                  <div className="bb8">
                    <div className="bb8__head-container">
                      <div className="bb8__antenna"></div>
                      <div className="bb8__antenna"></div>
                      <div className="bb8__head"></div>
                    </div>
                    <div className="bb8__body"></div>
                  </div>
                  <div className="artificial__hidden">
                    <div className="bb8__shadow"></div>
                  </div>
                </div>
              </label>
              <HashLink to="#connect">
                <button className="vvd">
                  <span>Let’s Connect</span>
                </button>
              </HashLink>
            </span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Router>
  );
};