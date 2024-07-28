import { useState } from "react";
import { Col, Row, Alert } from "react-bootstrap";
import emailjs from 'emailjs-com';

export const Newsletter = ({ status, message }) => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.indexOf("@") > -1) {
      setSending(true);
      // Send email using EmailJS
      emailjs.send(
        'Aryavhir123',  // Replace with your EmailJS service ID
        'template_zlgcdbf',  // Replace with your EmailJS template ID
        { to_email: email }, // Replace with the variables your template expects
        'wKOTaMefm5dYIMivs'       // Replace with your EmailJS user ID
      ).then((result) => {
        setSending(false);
        setEmail('');
        alert('Email sent successfully!');
      }, (error) => {
        setSending(false);
        alert('Failed to send email.');
      });
    }
  };

  return (
    <Col lg={12}>
      <div className="newsletter-bx wow slideInUp">
        <Row>
          <Col lg={12} md={6} xl={5}>
            <h3>Want My Details Through An Email?</h3>
            {sending && <Alert>Sending...</Alert>}
            {status === 'error' && <Alert variant="danger">{message}</Alert>}
            {status === 'success' && <Alert variant="success">{message}</Alert>}
          </Col>
          <Col md={6} xl={7}>
            <form onSubmit={handleSubmit}>
              <div className="new-email-bx">
                <input
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Recipient Email Address"
                />
                <button type="submit">Send Email</button>
              </div>
            </form>
          </Col>
        </Row>
      </div>
    </Col>
  );
}
