import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
    const [email, setEmail] = useState(''); // email: stores the email address entered by the user
    const [password, setPassword] = useState(''); // password: stores the password entered by the user
    const [showPassword, setShowPassword] = useState(false); // control password display/hiding
    const [message, setMessage] = useState(''); // message is used to display information about successful or failed login
    const [isSuccess, setIsSuccess] = useState(null); // isSuccess: tracks whether the login was successful
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();  
        try {
            const response = await fetch('http://localhost:5000/admin_login', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            }); 

            const result = await response.json();

            if (response.ok) {
                sessionStorage.setItem('authAction', 'signIn');
                sessionStorage.setItem('loggedInUserEmail', email); // login session
                navigate('/verification');
            } else {
                setMessage(result.message);
                setIsSuccess(false);
            }
        } catch (error) { 
            setMessage('Error: Could not reach server');
            setIsSuccess(false);
        }
    };

    const handleForgotPassword = () => { // handleForgotPassword handles the navigation to the forget password page
        sessionStorage.setItem('authAction', 'forgotPassword');
        sessionStorage.setItem('forgotPasswordEmail', email); // Store the email in sessionStorage
        navigate('/verification'); // Navigate to the forget password page
    };

    // show/hide password
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
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
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="login-input-container">
                        <label htmlFor="password">Password:</label>
                        <div className="input-with-toggle">
                            <input
                                className="login-input"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={toggleShowPassword}
                                className="password-toggle-button"
                            >
                                <img 
                                    src={showPassword ? "/Image/hide.jpg" : "/Image/show.jpg"}
                                    alt={showPassword ? "Hide Password" : "Show Password"}
                                    className="password-toggle-icon"
                                />
                            </button>
                        </div>
                    </div>
                    {message && (
                        <div className={`message ${isSuccess ? 'message-success' : 'message-error'}`}>
                            {message}
                        </div>
                    )}
                    <div className="forgot-password-link">
                        <div className="forgot-password-link">
                            <button type="button" onClick={handleForgotPassword} className="forgot-password-link-button">Forgot Password?</button>
                        </div>
                    </div>
                    <button type="submit" className="login-button">Sign in</button>
                </form>
            </div>
        </div>
    );
}

export default Login;