import React, { useState, useEffect } from 'react'; 
import './forget.css';
import { useNavigate } from 'react-router-dom';

function Forget() {
    // email, password, and confirmPassword are states that save the user inputs for email, new password, and confirm password respectively
    const [email, setEmail] = useState('');  
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // message is a state that stores either success or error message
    // messageType is used to determine whether the message is an error or success (for styling)
    const [message, setMessage] = useState('');  
    const [messageType, setMessageType] = useState('');  

    // showPassword and showConfirmPassword are used to control whether the passwords should be displayed as plain text or hidden
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate(); // useNavigate hook for page navigation

    // useEffect to load email from sessionStorage when the component is mounted
    useEffect(() => {
        const storedEmail = sessionStorage.getItem('forgotPasswordEmail'); // Retrieve the email from sessionStorage
        if (storedEmail) {
            setEmail(storedEmail); // Set the email state
        }
    }, []);

    // This function validates the password complexity based on common password requirements:
    // At least 7 characters, one uppercase letter, one lowercase letter, one number, and one special character
    const validatePassword = (password) => {
        const minLength = 7;
        const hasUpperCase = /[A-Z]/.test(password);  // Must contain at least one uppercase letter
        const hasLowerCase = /[a-z]/.test(password);  // Must contain at least one lowercase letter
        const hasNumber = /[0-9]/.test(password);  // Must contain at least one number
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);  // Must contain at least one special character

        if (password.length < minLength) {
            return "Password must be at least 7 characters long";
        }
        if (!hasUpperCase) {
            return "Password must contain at least one uppercase letter";
        }
        if (!hasLowerCase) {
            return "Password must contain at least one lowercase letter";
        }
        if (!hasNumber) {
            return "Password must contain at least one number";
        }
        if (!hasSpecialChar) {
            return "Password must contain at least one special character";
        }
        return "";  // Password is valid if no errors
    };

    // handlePasswordChange and handleConfirmPasswordChange are called when the user types in the password or confirm password input fields, updating the respective states
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    // This function is called when the "Reset" button is clicked (submitting the form).
    // First, it checks if the password meets the complexity requirements.
    // Then, it compares the two passwords:
    // If there is a match and the password is valid, it clears the error message and sends the request to reset the password.
    // If the password does not meet the requirements, it sets an appropriate error message.
    const handleResetPassword = async (e) => {
      e.preventDefault();
  
      const passwordValidationError = validatePassword(password);
      if (passwordValidationError) {
          setMessageType('error');
          setMessage(passwordValidationError);
          return;
      }
  
      if (password !== confirmPassword) {
          setMessageType('error');
          setMessage("Passwords do not match");
          return;
      }
  
      setMessage('');
  
      try {
          const response = await fetch('http://localhost:5000/reset-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, newPassword: password }),
          });
  
          if (response.ok) {
              navigate('/login');
          } else {
              const result = await response.json();
              setMessageType('error');
              setMessage(result.message);
          }
      } catch (error) {
          setMessageType('error');
          setMessage('Error: Could not reset password');
      }
  };

    // Functions to toggle password visibility
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="forget-background">
          <div className="forget-container">
            <h2>Reset Your Password</h2>
            <form onSubmit={handleResetPassword}>
              
              <div className="forget-input-container">
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    value={email}
                    readOnly  // Set to read only
                    required
                    className="email-input forget-input"
                />
              </div>

              <div className="forget-input-container">
                <label htmlFor="new-password">New Password:</label>
                <div className="input-with-toggle">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="new-password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className="password-input" 
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="password-toggle-button"
                  >
                    <img 
                      src={showPassword ? "/Image/hide.jpg" : "/Image/show.jpg"} // Toggle showing and hiding pictures
                      alt={showPassword ? "Hide Password" : "Show Password"}
                      className="password-toggle-icon"
                    />
                  </button>
                </div>
              </div>
    
              <div className="forget-input-container">
                <label htmlFor="confirm-password">Confirm Password:</label>
                <div className="input-with-toggle">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    className="password-input" 
                  />
                  <button
                    type="button"
                    onClick={toggleShowConfirmPassword}
                    className="password-toggle-button"
                  >
                    <img 
                      src={showConfirmPassword ? "/Image/hide.jpg" : "/Image/show.jpg"} 
                      alt={showConfirmPassword ? "Hide Password" : "Show Password"}
                      className="password-toggle-icon"
                    />
                  </button>
                </div>
              </div>

              {/* Unified message display for error only */}
              {message && (
                <div className={`forget-message-container ${messageType === 'success' ? 'success' : 'error'}`}>
                  <span>{message}</span>
                </div>
              )}
    
              <button type="submit" className="forget-reset-button">Reset</button>
            </form>
          </div>
        </div>
      );
}

export default Forget;