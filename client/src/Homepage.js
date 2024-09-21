import React from 'react';
import { useNavigate } from "react-router-dom"; // Change to useNavigate
import "./App.css";

function Homepage() {
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const panelsPage = () => {
        navigate("/panels"); // Navigate to the panels page
    };

    return (

        
        <>
            <div className="home-container">
                <title>Fumbling Virtual Gazelle</title>
                <meta property="og:title" content="Fumbling Virtual Gazelle" />
            <span className="home-text1">
                Login
                <span
                dangerouslySetInnerHTML={{
                    __html: ' ',
                }}
                />
            </span>
            <span className="home-text2">Username: </span>
            <span className="home-text3">Password: </span>
            <input
                type="text"
                placeholder="placeholder"
                className="home-textinput1 input"
            />
            <input
                type="text"
                placeholder="placeholder"
                className="home-textinput2 input"
            />
            <button type="button" className="home-button button" onClick={panelsPage}>
                        Login
                    </button>
            </div>
        </>
    );
}

export default Homepage;
