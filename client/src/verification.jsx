import React, { useState, useEffect, useCallback } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './verification.css'; 
import Cookies from 'js-cookie';

function Verification() {
  const [counter, setCounter] = useState(60);   //set the timer to 60 seconds
  const [isCounting, setIsCounting] = useState(false);  //check if timer end
  const [userEmail, setUserEmail] = useState('');
  const [isEmailLoaded, setIsEmailLoaded] = useState(false);  //load the email
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState(''); //use to check user enter code
  const [sentCode, setSentCode] = useState('');   //store the send code
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState(null); //set admin id
  const [skipVerification, setSkipVerification] = useState(false);  //set for skip verification
  const authAction = sessionStorage.getItem("authAction");    //check which page will redirect to
  const isSignIn = authAction === "signIn";   //check if from login page

  //use the session email to get the adminID
  const fetchAdminIdByEmail = useCallback(async () => {
    const email = sessionStorage.getItem('loggedInUserEmail') || sessionStorage.getItem('forgotPasswordEmail');
    if (!email) {
      console.error('No email found in sessionStorage');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/get_admin_id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        setAdminId(data.admin_id); // set fetched adminId
      } else {
        console.error('Error fetching admin ID:', data.error);
      }
    } catch (error) {
      console.error('Error fetching admin ID:', error);
    }
  }, []);
  
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
    if (!adminId) return;
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
    setCounter(60);   //countdown from 60 seconds
    setIsCounting(true);
  };

  //check if user from login page or reset password page, if it is direct access, send user to login page
  useEffect(() => {
    const authAction = sessionStorage.getItem('authAction');
  
    if (!authAction) {
      sessionStorage.removeItem('loggedInUserEmail');
      sessionStorage.removeItem('forgotPasswordEmail');
      navigate('/login', { replace: true });  // Use replace to prevent back navigation or direct access
    }
  }, []);  

  //for resend code counting
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

  //get admidID first
  useEffect(() => {
    fetchAdminIdByEmail();
  }, [sessionStorage.getItem('loggedInUserEmail')]);

  //get email address
  useEffect(() => {
    if (adminId) {
      fetchAdminEmail();
    }
  }, [adminId, fetchAdminEmail]);

  //get the email address and start the timer when the page load
  useEffect(() => {
    if (isEmailLoaded && userEmail) {
      sendVerificationEmail();
      startCountdown();
    }
  }, [isEmailLoaded, userEmail, sendVerificationEmail]);

  //use to check if the code is correct
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        if (skipVerification) {
          Cookies.set("skipVerification", "true", { expires: 7, secure: true }); // cookies for 7 days
        }

        const authAction = sessionStorage.getItem("authAction");
        //if user is login
        if (authAction === "signIn") {
          sessionStorage.clear(); 
          sessionStorage.setItem("verified", "true");
          navigate("/admin");
        }
        //if user is reset password 
        else if (authAction === "forgotPassword") {
          const forgotPasswordEmail = sessionStorage.getItem("forgotPasswordEmail");
          sessionStorage.clear(); 
          navigate("/forget", { state: { email: forgotPasswordEmail } });
        }
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setErrorMessage("An error occurred. Please try again.");
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
              placeholder="Enter verification code"
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* check the code */}
          </div>
          {/* Skip verification for 7 days checkbox */}
          <div className="skip-verification-container">
            <input
              type="checkbox"
              id="skipVerification"
              disabled={!isSignIn}
              checked={skipVerification}
              onChange={(e) => setSkipVerification(e.target.checked)}
            />
            <label htmlFor="skipVerification">Skip verification for 7 days</label>
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