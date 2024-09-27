import './login.css';
import React from 'react';

function login() {
    return (
    <div className="login-background"> {/* background: login-background */}
      <div className="login-container"> {/* login framework: login-container */} 
        <h2 className="login-title">Login</h2> {/* title: login-title */}
        <form className="login-form"> {/* email and password framework: login-form */}
          <div className="login-input-container">
            <label htmlFor="username">Email:</label>
            <input className="login-input" type="text" id="username" name="username" />
          </div>
          <div className="login-input-container">
            <label htmlFor="password">Password:</label>
            <input className="login-input" type="password" id="password" name="password" />
          </div>
          <div className="forgot-password-link">
            <a href="/forgot-password">Forgot Password?</a> {/* forgot password link */}
          </div>
          <button type="submit" className="login-button">Sign in</button> {/* login button: login-button */}
        </form>
      </div>
    </div>
    );
};

export default login;
