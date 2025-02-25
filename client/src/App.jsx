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
import Login from "./login";
import VF from "./verification";
import Forget from "./forget";
import Popup from "./popup";
import Adminedit from "./Adminedit";
import Adminupload from "./Adminupload";
import EncryptionTest from "./EncryptionTest";
import Preview from "./Preview";
import "./App.css";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    {/*
                    Automatically navigate to home when visiting*/}

                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route
                        path="/home"
                        element={<Homepage />}
                    />
                    <Route
                        path="/admin"
                        element={<Panels />}
                    />
                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route
                        path="/verification"
                        element={<VF />}
                    />
                    <Route
                        path="/forget"
                        element={<Forget />}
                    />
                    <Route
                        path="/popup"
                        element={<Popup />}
                    />
                    <Route
                        path="/encr"
                        element={<EncryptionTest />}
                    />
                    <Route
                        path="/preview"
                        element={<Preview />}
                    />
                </Routes>
            </Router>

        </>
    );
}

export default App;
