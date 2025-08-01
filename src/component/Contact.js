import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import contactImg from "../asset/img/contact-img.svg";
import emailjs from 'emailjs-com';
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Contact = () => {
  const formInitialDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  }
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState('Send');
  const [status, setStatus] = useState({});

  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Sending...");

    try {
      // Store submission locally
      const submission = {
        id: Date.now(),
        firstName: formDetails.firstName,
        lastName: formDetails.lastName,
        email: formDetails.email,
        phone: formDetails.phone,
        message: formDetails.message,
        timestamp: new Date().toISOString(),
        read: false
      };

      // Get existing submissions
      const existingSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      existingSubmissions.push(submission);
      localStorage.setItem('contactSubmissions', JSON.stringify(existingSubmissions));

      // Request notification permission if not granted
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }

      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification('New Contact Form Submission!', {
          body: `${formDetails.firstName} ${formDetails.lastName} sent you a message`,
          icon: '/logo.svg',
          tag: 'contact-form'
        });
      }

      setButtonText("Send");
      setFormDetails(formInitialDetails);
      setStatus({ success: true, message: 'Message submitted successfully! Check your admin panel to view it.' });

      // Clear status after 5 seconds
      setTimeout(() => {
        setStatus({});
      }, 5000);

    } catch (error) {
      console.error('Submission error:', error);
      setButtonText("Send");
      setStatus({ success: false, message: 'Something went wrong, please try again later.' });

      // Clear status after 5 seconds
      setTimeout(() => {
        setStatus({});
      }, 5000);
    }
  };

  return (
    <section className="contact" id="connect">
      <Container>
        <Row className="align-items-center">
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) =>
                <img className={isVisible ? "animate__animated animate__zoomIn" : ""} src={contactImg} alt="Contact Us"/>
              }
            </TrackVisibility>
          </Col>
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <h2>Get In Touch</h2>
                  <form onSubmit={handleSubmit}>
            <Row>
                      <Col size={12} sm={6} className="px-1">
                        <input type="text" value={formDetails.firstName} placeholder="First Name" onChange={(e) => onFormUpdate('firstName', e.target.value)} />
                      </Col>
                      <Col size={12} sm={6} className="px-1">
                        <input type="text" value={formDetails.lastName} placeholder="Last Name" onChange={(e) => onFormUpdate('lastName', e.target.value)}/>
                      </Col>
                      <Col size={12} sm={6} className="px-1">
                        <input type="email" value={formDetails.email} placeholder="Email Address" onChange={(e) => onFormUpdate('email', e.target.value)} />
                      </Col>
                      <Col size={12} sm={6} className="px-1">
                        <input type="tel" value={formDetails.phone} placeholder="Phone No." onChange={(e) => onFormUpdate('phone', e.target.value)}/>
                      </Col>
                      <Col size={12} className="px-1">
                        <textarea rows="6" value={formDetails.message} placeholder="Message" onChange={(e) => onFormUpdate('message', e.target.value)}></textarea>
                        <button type="submit"><span>{buttonText}</span></button>
                      </Col>
                      {
                        status.message &&
                        <Col>
                          <div className={`contact-status ${status.success === false ? "error" : "success"}`}>
                            <span className="status-icon">{status.success === false ? "❌" : "✅"}</span>
                            <span>{status.message}</span>
                          </div>
                        </Col>
                      }
                    </Row>
                  </form>
                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
}