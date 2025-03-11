import { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './a.css';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51QDfchFEErnFqFOO0R34Z6QgDqAzjj2dBEjb5I7knAUWM2RKFhksdjGsZwqDxJldw0ecDMNgq6QDfpP6wgLQKdJj003Q3z2WHf');

// XMoney API Configuration
const XMONEY_API_ROOT = "https://merchants.api.sandbox.crypto.xmoney.com/api/stores/orders"; // Use sandbox for testing: "https://merchants.api.sandbox.crypto.xmoney.com/api/stores/orders"
const XMONEY_API_KEY = "u_test_api_41940342-91ed-4c7c-b7a4-da50ea5ee6bc"; // Replace with your actual API key or fetch from environment variables

// XMoney API Service
const xMoneyApi = {
  createOrder: (params) =>
    fetch(XMONEY_API_ROOT, {
      method: "POST",
      headers: {
        "content-type": "application/vnd.api+json",
        authorization: "Bearer " + XMONEY_API_KEY,
      },
      body: JSON.stringify({
        "data": {
        "type": "orders",
        "attributes": {
        "order": {
        "reference": "order-1977",
        "amount": {
        "total": "1.00",
        "currency": "USD",
        "details": {
        "subtotal": "98.00",
        "shipping": "10.00",
        "tax": "3.00",
        "discount": "2.00"
        }
        },
        "return_urls": {
        "return_url": "http://example.com/return",
        "cancel_url": "http://example.com/cancel",
        "callback_url": "http://example.com/callback"
        },
        "line_items": [
        {
        "sku": "tsh-6110",
        "name": "T-Shirt White Large",
        "price": "100.00",
        "currency": "USD",
        "quantity": 5
        }
        ]
        },
        "customer": {
        "name": "John Doe",
        "first_name": "",
        "last_name": "",
        "email": "john@example.com",
        "billing_address": "118 Main St",
        "address1": "",
        "address2": "",
        "city": "New York",
        "state": "New York",
        "postcode": "",
        "country": "US"
        }
        }
        }
        }),
    }).then(response => response.json()),
};

// Payment Form Component with both Stripe and XMoney options
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // Default to Stripe

  // Handles Stripe payment submission
  const handleStripeSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    try {
      // Create PaymentIntent on your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 2000 }), // $20.00
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Customer Name',
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handles XMoney payment submission
  const handleXMoneySubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create XMoney order parameters
      const orderParams = {
        data: {
          type: "orders",
          attributes: {
            order: {
              reference: `order-${Date.now()}`, // Generate a unique reference
              amount: {
                total: "20.00", // Match the Stripe amount of $20.00
                currency: "EUR",
              },
              return_urls: {
                return_url: window.location.origin + "/success", // Redirect to your success page
              }
            },
            customer: {
              email: 'customer@example.com', // You should collect this from the user
              country: 'US'
            },
          },
        },
      };

      // Create XMoney order
      const response = await xMoneyApi.createOrder(orderParams);
      
      if (response.data && response.data.attributes.redirect_url) {
        // Redirect to XMoney payment page
        window.location.href = response.data.attributes.redirect_url;
      } else {
        setError('Failed to create cryptocurrency payment. Please try again.');
      }
    } catch (err) {
      setError('Cryptocurrency payment setup failed. Please try again.');
      console.error('XMoney error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission based on selected payment method
  const handleSubmit = (event) => {
    if (paymentMethod === 'stripe') {
      handleStripeSubmit(event);
    } else if (paymentMethod === 'xmoney') {
      handleXMoneySubmit(event);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-method-selector">
        <button 
          type="button" 
          className={`method-button ${paymentMethod === 'stripe' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('stripe')}
        >
          Pay with Credit Card
        </button>
        <button 
          type="button" 
          className={`method-button ${paymentMethod === 'xmoney' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('xmoney')}
        >
          Pay with Cryptocurrency
        </button>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        {paymentMethod === 'stripe' && (
          <div className="card-element-container">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }} />
          </div>
        )}

        {paymentMethod === 'xmoney' && (
          <div className="xmoney-info">
            <p>You will be redirected to complete your cryptocurrency payment.</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Payment successful!</div>}
        
        <button 
          type="submit" 
          disabled={(paymentMethod === 'stripe' && !stripe) || loading}
          className="payment-button"
        >
          {loading ? 'Processing...' : paymentMethod === 'stripe' ? 'Pay with Card' : 'Pay with Crypto'}
        </button>
      </form>
    </div>
  );
};

// Main Banner Component
export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = ["Front-end Developer", "Web Developer", "Web Designer", "UI/UX Designer"];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex((prevIndex) => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <section className="banner" id="home">
      <h1 style={{textAlign: 'center'}}> Hello</h1>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px',
      }}>
        <div className="txt-rotate">
          <span>I am a </span>
          <span>{text}</span>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
        padding: '20px',
      }}>
        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      </div>
    </section>
  );
};