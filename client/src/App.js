import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";


import Homepage from "./Homepage";
import Panels from "./Panels";
import "./App.css";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    {/*
                    Automatically navigate to home when visiting

                    <Route path="/" element={<Navigate to="/home" replace />} />
                    */}
                    
                    <Route
                        path="/home" // Change this to whatever path you want for the home page
                        element={<Homepage />} // Use element prop
                    />
                    <Route
                        path="/panels"
                        element={<Panels />} // Use element prop
                    />
                </Routes>
            </Router>
            <div>
                You can enter /Homepage after the url goto the login page, 
                <p></p>
                You can enter /panels after the url goto the panels, 

            </div>

        </>
    );
}

export default App;