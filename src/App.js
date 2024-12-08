import "./App.scss";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import Subject from "./Subject";
import Assessment from "./Assessment";
import Submission from "./Submission";
import Navbar from "./components/nav/NavBar";

function AppContent() {
    const location = useLocation(); // Get current location

    // Paths where the Navbar should not be displayed
    const hideNavbarPaths = ["/", "/login", "/register"];

    return (
        <>
            {/* Render Navbar only if the current path is not in the hideNavbarPaths */}
            {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/subject/:subjectId" element={<Subject />} />
                <Route
                    path="/assessment/:assessmentId"
                    element={<Assessment />}
                />
                <Route
                    path="/submission/:submissionId"
                    element={<Submission />}
                />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
