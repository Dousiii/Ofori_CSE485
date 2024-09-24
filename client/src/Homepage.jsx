import React from 'react';
import { useNavigate } from "react-router-dom"; // Change to useNavigate
import "./App.css";

function Homepage() {
    const navigate = useNavigate(); // Use useNavigate instead of useHistory


    return (
        <div>
            <h1>Hello from Opt-in Page!</h1>
        </div>
    );
}

export default Homepage;
