import { Container, Row, Col } from "react-bootstrap";
import { Newsletter } from "./Newsletter";
import navIcon1 from "../asset/img/nav-icon1.svg";
import navIcon2 from "../asset/img/nav-icon2.svg";
import navIcon3 from "../asset/img/nav-icon3.svg";

export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <Newsletter />
          <Col size={12} sm={6}></Col>
          <Col size={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
              <a href="https://www.linkedin.com/in/aryavhir-koul-04a08k/">
                <img src={navIcon1} alt="Icon" />
              </a>
              <a href="https://www.github.com/aryavhir">
                <img src={navIcon2} alt="Icon" />
              </a>
              <a href="https://www.instagram.com/aryavhir_koul/">
                <img src={navIcon3} alt="Icon" />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
