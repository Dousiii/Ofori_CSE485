import React, { useState } from 'react';
import './login.css';

function Login() {
    const [email, setEmail] = useState(''); // email: stores the email address entered by the user
    const [password, setPassword] = useState(''); // password: stores the password entered by the user.
    const [message, setMessage] = useState(''); // message is used to display information about successful or failed login
    const [isSuccess, setIsSuccess] = useState(null); // isSuccess: tracks whether the login was successful

    const handleLogin = async (e) => { // handleLogin is the event processing function when the form is submitted
        e.preventDefault();  
        try {
            const response = await fetch('http://localhost:5000/admin_login', { // Use the fetch method to send a login request to the backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // Convert the input email and password into JSON format and send it to the backend
            }); 

            const result = await response.json(); // Parse the JSON data returned by the backend

            if (response.ok) {
                setMessage('Login successful!');
                setIsSuccess(true); // set success flag to true
            } else {
                setMessage(result.message); // failed login message
                setIsSuccess(false); // set success flag to false
            }
        } catch (error) { 
            setMessage('Error: Could not reach server');
            setIsSuccess(false); // set success flag to false on error
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-background">
            <div className="login-container">
                <h2 className="login-title">Login</h2>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="login-input-container">
                        <label htmlFor="email">Email:</label>
                        <input
                            className="login-input"
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}  // get email
                        />
                    </div>
                    <div className="login-input-container">
                        <label htmlFor="password">Password:</label>
                        <input
                            className="login-input"
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}  // get password
                        />
                    </div>
                    {message && ( // show error message
                        <div 
                            className={`message ${isSuccess ? 'message-success' : 'message-error'}`}>
                            {message}
                        </div>
                    )}
                    <div className="forgot-password-link">
                        <a href="/forgot-password">Forgot Password?</a>
                    </div>
                    <button type="submit" className="login-button">Sign in</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
