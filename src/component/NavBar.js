import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import logo from '../asset/img/s1.svg';
import navIcon1 from '../asset/img/nav-icon1.svg';
import navIcon2 from '../asset/img/nav-icon2.svg';
import navIcon3 from '../asset/img/nav-icon3.svg';

export const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const isActivePage = (path) => {
    return location.pathname === path;
  }

  return (
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className={isActivePage('/') ? 'active navbar-link' : 'navbar-link'}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className={isActivePage('/about') ? 'active navbar-link' : 'navbar-link'}>
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/projects" className={isActivePage('/projects') ? 'active navbar-link' : 'navbar-link'}>
              Projects
            </Nav.Link>
            <Nav.Link as={Link} to="/workspace" className={isActivePage('/workspace') ? 'active navbar-link' : 'navbar-link'}>
              Workspace
            </Nav.Link>
          </Nav>
          <span className="navbar-text">
            <div className="social-icon">
              <a href="https://www.linkedin.com/in/aryavhir-koul-04a08k/"><img src={navIcon1} alt="" /></a>
              <a href="https://www.github.com/aryavhir"><img src={navIcon2} alt="" /></a>
              <a href="https://www.instagram.com/aryavhir_koul/"><img src={navIcon3} alt="" /></a>
            </div>
            <Link to='/contact'>
              <button className="vvd"><span>Let's Connect</span></button>
            </Link>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}