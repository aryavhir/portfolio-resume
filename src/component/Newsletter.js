import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import emailjs from 'emailjs-com';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.indexOf("@") > -1) {
      setSending(true);
      setStatus('');
      setMessage('');

      // Your actual EmailJS credentials
      const serviceId = 'Aryavhir123';
      const templateId = 'template_zlgcdbf';
      const publicKey = 'wKOTaMefm5dYIMivs';

      // Template parameters - make sure these match your EmailJS template variables
      const templateParams = {
        to_email: 'aryavhirkoul2@gmail.com',
        user_email: email,
        message: `User ${email} wants to receive details about your portfolio.`,
        from_name: 'Portfolio Website'
      };

      emailjs.send(serviceId, templateId, templateParams, publicKey)
        .then((result) => {
          setSending(false);
          setStatus('success');
          setMessage('Details will be sent to your email successfully!');
          setEmail('');
          console.log('Email sent successfully:', result);
        }, (error) => {
          setSending(false);
          setStatus('error');
          setMessage('Failed to send email. Please try again.');
          console.error('EmailJS error:', error);
        });
    } else {
      setStatus('error');
      setMessage('Please enter a valid email address.');
    }
  };

  return (
    <Col lg={12}>
      <div className="newsletter-bx wow slideInUp">
        <Row>
          <Col lg={12} md={6} xl={5}>
            <h3>Want My Details Through An Email?</h3>
            {sending && (
              <div className="newsletter-status sending">
                <span className="status-icon">⏳</span>
                <span>Sending your request...</span>
              </div>
            )}
            {status === 'error' && (
              <div className="newsletter-status error">
                <span className="status-icon">❌</span>
                <span>{message}</span>
              </div>
            )}
            {status === 'success' && (
              <div className="newsletter-status success">
                <span className="status-icon">✅</span>
                <span>{message}</span>
              </div>
            )}
          </Col>
          <Col md={6} xl={7}>
            <form onSubmit={handleSubmit}>
              <div className="new-email-bx">
                <input
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
                <button type="submit" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Details'}
                </button>
              </div>
            </form>
          </Col>
        </Row>
      </div>
    </Col>
  );
}