
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';

export const AdminPanel = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    const stored = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    setSubmissions(stored.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  };

  const markAsRead = (id) => {
    const updated = submissions.map(sub => 
      sub.id === id ? { ...sub, read: true } : sub
    );
    setSubmissions(updated);
    localStorage.setItem('contactSubmissions', JSON.stringify(updated));
  };

  const deleteSubmission = (id) => {
    const updated = submissions.filter(sub => sub.id !== id);
    setSubmissions(updated);
    localStorage.setItem('contactSubmissions', JSON.stringify(updated));
  };

  const handleLogin = () => {
    // Simple password protection - you can change this password
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="p-4">
              <h3>Admin Login</h3>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control mb-3"
              />
              <Button onClick={handleLogin}>Login</Button>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Contact Submissions ({submissions.filter(s => !s.read).length} unread)</h2>
          {submissions.length === 0 ? (
            <p>No submissions yet.</p>
          ) : (
            submissions.map(submission => (
              <Card key={submission.id} className={`mb-3 ${!submission.read ? 'border-warning' : ''}`}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{submission.firstName} {submission.lastName}</strong>
                    {!submission.read && <Badge bg="warning" className="ms-2">New</Badge>}
                  </div>
                  <small>{new Date(submission.timestamp).toLocaleString()}</small>
                </Card.Header>
                <Card.Body>
                  <p><strong>Email:</strong> {submission.email}</p>
                  <p><strong>Phone:</strong> {submission.phone}</p>
                  <p><strong>Message:</strong> {submission.message}</p>
                  <div className="d-flex gap-2">
                    {!submission.read && (
                      <Button size="sm" variant="primary" onClick={() => markAsRead(submission.id)}>
                        Mark as Read
                      </Button>
                    )}
                    <Button size="sm" variant="danger" onClick={() => deleteSubmission(submission.id)}>
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};
