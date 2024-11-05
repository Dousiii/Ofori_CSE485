import React, { useState, useEffect, useCallback } from 'react'; 
import './verification.css'; 

function Verification() {
  const [counter, setCounter] = useState(30);   //set the timer to 30 seconds
  const [isCounting, setIsCounting] = useState(false);  //check if timer end
  const [userEmail, setUserEmail] = useState('');
  const [isEmailLoaded, setIsEmailLoaded] = useState(false);  //load the email
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState(''); //use to check user enter code
  const [sentCode, setSentCode] = useState('');   //store the send code
  const [initialCodeSent, setInitialCodeSent] = useState(false); // track initial send

  //just use for now, set the adminId from login page when user login
  //will use User Session to get the id from login page in future
  const adminId = 2;

  //request the code and send to email, will call the function in server
  const sendVerificationEmail = useCallback(async () => {
    if (!userEmail) return;
    try {
      const response = await fetch('http://localhost:5000/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email:userEmail })
      });
  
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setSentCode(data.code);   //set the code for check
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
    }
  },[userEmail]);

  //use adminId to get the email address
  const fetchAdminEmail = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/get_admin_email/${adminId}`); 
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      //after get the email, set the email, send the code
      setUserEmail(data.email);
      setIsEmailLoaded(true);
    } catch (error) {
      console.error('Error fetching admin email:', error);
      setIsEmailLoaded(true);
    }
  }, [adminId]);

  //set for timer countdown
  const startCountdown = () => {
    setCounter(30);   //countdown from 30 seconds
    setIsCounting(true);
  };


  useEffect(() => {
    //ensure the resend button and timer can work multiple time
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
  }, [fetchAdminEmail]);

  //get the email address and start the timer when the page load
  useEffect(() => {
    if (isEmailLoaded && userEmail) {
      sendVerificationEmail();
      startCountdown();
    }
  }, [isEmailLoaded, userEmail, sendVerificationEmail]);

  //use to check if the code is correct
  const handleSubmit = (event) => {
    event.preventDefault(); 
    if (verificationCode !== sentCode) { 
      setErrorMessage('The code is wrong, please try again or resend a new code');
    } else {
      setErrorMessage('Your code is Correct!'); 
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
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* check the code */}
          </div>
          <button type="submit" className="verify-email-button">Submit</button>
        </form>

        <p className="resend-text"> {/* resend */}
          Code will be sent to Email: <strong>{isEmailLoaded ? userEmail : "Loading..."}</strong>
          <br />
          <br />
          Didn't receive the code?{" "}
          <button type="button" className="resend-code-button" onClick={() => { sendVerificationEmail(); startCountdown(); }} disabled={isCounting}>
            {isCounting ? "Resend in " + counter + "s" : "Resend Code"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Verification;