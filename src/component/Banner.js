import { useState, useEffect } from "react";
// other imports are commented out in your original code

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = [ "Front-end Developer", "Web Developer", "Web Designer", "UI/UX Designer"];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  useEffect(() => {
    // Add Stripe script dynamically
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up on unmount
      document.body.removeChild(script);
    };
  }, []);

  const tick = () => {
    // ... existing tick function logic
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
      
      {/* Stripe Buy Button */}
      <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
      <script async
  src="https://js.stripe.com/v3/buy-button.js">
</script>

<stripe-buy-button
  buy-button-id="buy_btn_1QsIZ1FEErnFqFOO01f0YNgw"
  publishable-key="pk_test_51QDfchFEErnFqFOO0R34Z6QgDqAzjj2dBEjb5I7knAUWM2RKFhksdjGsZwqDxJldw0ecDMNgq6QDfpP6wgLQKdJj003Q3z2WHf"
>
</stripe-buy-button>
      </div>
      
      {/* The rest of your commented out code */}
    </section>
  );
};