import React, { useState, useEffect } from 'react'; 
import './verification.css'; 

function Verification() {
  const [counter, setCounter] = useState(30); 
  const [isCounting, setIsCounting] = useState(false); 
  const [userEmail, setUserEmail] = useState('');
  const [isEmailLoaded, setIsEmailLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const adminId = 1;

  const fetchAdminEmail = async () => {
    try {
      const response = await fetch(`http://localhost:5000/get_admin_email/${adminId}`); 
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      setUserEmail(data.email);
      setIsEmailLoaded(true);
    } catch (error) {
      console.error('Error fetching admin email:', error);
      setIsEmailLoaded(true);
    }
  };

  const startCountdown = () => {
    setCounter(5);
    setIsCounting(true);
  };

  useEffect(() => {
    if (!isCounting) return;

    const timer = setInterval(() => {
      setCounter(prevCounter => {
        if (prevCounter <= 1) {
          setIsCounting(false);
          clearInterval(timer);
          return 0;
        }
        return prevCounter - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCounting]);

  useEffect(() => {
    fetchAdminEmail();
    startCountdown();
  }, []);

  
  const handleSubmit = (event) => {
    event.preventDefault(); 
    if (verificationCode !== '123456') { 
      setErrorMessage('The code is wrong, please try again or resend a new code');
    } else {
      setErrorMessage(''); 
    }
  };

  return (
    <div className="verify-email-background">
      <div className="verify-email-container"> 
        <h2 className="verify-email-title">Verify Your Account</h2>
        <p className="verify-email-text">
          Please check your email (inbox and spam) and enter the verification code
        </p>
        <form className="verify-email-form" onSubmit={handleSubmit}> 
          <div className="ver-input-container">
            <label htmlFor="verificationCode">Verification Code:</label>
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              className="verify-input"
              required
              value={verificationCode} 
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
          <button type="submit" className="verify-email-button">Submit</button>
        </form>

        <p className="resend-text">
          Code will be sent to Email: <strong>{isEmailLoaded ? userEmail : "Loading..."}</strong>
          <br />
          <br />
          Didn't receive the code?{" "}
          <button type="button" className="resend-code-button" onClick={() => { fetchAdminEmail(); startCountdown(); }} disabled={isCounting}>
            {isCounting ? "Resend in " + counter + "s" : "Resend Code"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Verification;