import React from 'react';
import './verification.css'; 

function verification(){
    return (
        <div className="verify-email-background"> {/* background */}
        <div className="verify-email-container"> {/* container */}
          <h2 className="verify-email-title">Verify Your Email</h2>
          <p className="verify-email-text">
            Please check your email (inbox and spam) and enter the verification code
          </p>
          <form className="verify-email-form">  {/* code and submit button */}
            <div className="ver-input-container">
              <label htmlFor="verificationCode">Verification Code:</label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                className="verify-input"
                required
              />
            </div>
            <button type="submit" className="verify-email-button">Submit</button>
          </form>
          <p className="resend-text"> {/* resend */}
            Didn't receive the code?{" "}
            <button type="button" className="resend-code-button">Resend Code</button>
          </p>
        </div>
      </div>
    );
};

export default verification;