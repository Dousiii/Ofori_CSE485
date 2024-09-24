import React from "react";
import "./App.css";
import { useNavigate } from "react-router-dom"; // Change import to useNavigate

function Panels() {
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    return (
        <>
            <div>
                <h1>Hello from admin panels!</h1>
            </div>
        </>
    );
}

export default Panels;