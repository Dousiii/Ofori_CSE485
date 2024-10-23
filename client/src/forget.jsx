import React, { useState } from 'react';
import './forget.css';

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

    // handlePasswordChange and handleConfirmPasswordChange are called when the user types in the password or confirm password input fields, updating the respective states
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    // This function is called when the "Reset" button is clicked (submitting the form).
    // And then compares the two passwords:
    // If there is a match, clear the error message (setErrorMessage('')).
    // If they do not match, an error message is set to “Passwords do not match” and displayed next to the input box.
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessageType('error');  // Set message type to error
            setMessage("Passwords do not match");
            return;
        }

        setMessage('');  // Clear any previous messages

        // Send POST request to the backend
        const response = await fetch('http://localhost:5000/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                newPassword: password,
            }),
        });

        const result = await response.json();
        if (response.ok) {
            setMessageType('success');  // Set message type to success
            setMessage(result.message);
        } else {
            setMessageType('error');  // Set message type to error
            setMessage(result.message);
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
                    onChange={(e) => setEmail(e.target.value)}
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

              {/* Unified message display for both error and success */}
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

