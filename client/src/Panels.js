import React from "react";
import "./App.css";
import { useNavigate } from "react-router-dom"; // Change import to useNavigate

function Panels() {
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const home = () => {
        navigate("/"); // Navigate to the home page
    };

    return (
        <>
            <button
                className="btn btn-success"
                onClick={home}
            >
                Back to Home
            </button>
        </>
    );
}

export default Panels;