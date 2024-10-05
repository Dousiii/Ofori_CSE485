import React, { useState } from 'react';
import './forget.css';

function Forget() {
    // password and confirmPassword are two states, which are used to save the password and confirm password entered by the user in the two input boxes respectively
    // errorMessage is another state, which is used to save error prompt information. For example, when the two passwords do not match, a prompt "Passwords do not match" will be displayed.
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // These two functions are event handling functions, which are called when the user enters a password and confirms the password respectively.
    // Whenever the user types something in the input box, setPassword and setConfirmPassword will update the state (i.e. password and confirmPassword) with the input value.
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
    const handleResetPassword = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrorMessage('');
        } else {
            setErrorMessage('Passwords do not match'); 
        }
    };

    return (
        <div className="forget-container">
        <h2>Reset Your Password</h2>
        <form onSubmit={handleResetPassword}>
            <div className="forget-input-container">
            <label htmlFor="new-password">New Password:</label>
            <input
                type="password"
                id="new-password"
                value={password}
                onChange={handlePasswordChange}
                required
            />
            </div>
            <div className="forget-input-container">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
            />
            {errorMessage && <span className="forget-error-message">{errorMessage}</span>}
            </div>
            <button type="submit" className="forget-reset-button">Reset</button>
        </form>
        </div>
    );
}

export default Forget;