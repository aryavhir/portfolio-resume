import { useState, useEffect } from "react";
import './a.css';

// XMoney API Configuration
const XMONEY_API_ROOT = "https://merchants.api.sandbox.crypto.xmoney.com/api/stores/orders"; // Use sandbox for testing: "https://merchants.api.sandbox.crypto.xmoney.com/api/stores/orders"
const XMONEY_API_KEY = "u_test_api_41940342-91ed-4c7c-b7a4-da50ea5ee6bc"; // Replace with your actual API key or fetch from environment variables

// XMoney API Service
const xMoneyApi = {
  createOrder:
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
      {/* Payment form removed as per request */}
    </section>
  );
};