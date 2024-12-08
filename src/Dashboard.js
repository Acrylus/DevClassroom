import React, { useEffect, useState } from "react";
import axios from "axios";
import SubjectCard from "./components/cards/SubjectCard"; // Import the SubjectCard component
import {
    Container,
    Typography,
    Button,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [subjects, setSubjects] = useState([]);
    const [userRole, setUserRole] = useState(null); // "teacher" or "student"
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [newSubject, setNewSubject] = useState({ name: "", code: "" }); // New subject data
    const [subjectCode, setSubjectCode] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token"); // Assume JWT token is stored here

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                // Fetch user details to determine role
                const userResponse = await axios.get(
                    "http://localhost:8000/users/details",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUserRole(userResponse.data.role);
                localStorage.setItem("user_role", userResponse.data.role);
                localStorage.setItem(
                    "user_name",
                    userResponse.data.firstname +
                        " " +
                        userResponse.data.lastname
                );

                // Fetch subjects based on role
                const endpoint =
                    userResponse.data.role === "teacher"
                        ? "http://localhost:8000/teacher/subjects"
                        : "http://localhost:8000/student/subjects";

                const subjectsResponse = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSubjects(subjectsResponse.data);
            } catch (error) {
                console.error(
                    "Error fetching subjects or user details:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, [token, subjects]);

    const handleSubjectClick = (subjectId) => {
        navigate(`/subject/${subjectId}`);
    };

    const generateSubjectCode = () => {
        // Get the current timestamp
        const timestamp = Date.now().toString(24).toUpperCase(); // Convert to base 36 for compactness
        // Generate a random suffix
        const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        // Combine timestamp and random suffix
        return `${timestamp}-${randomSuffix}`;
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setNewSubject((prev) => ({
            ...prev,
            name: name,
            code: generateSubjectCode(),
        }));
    };

    const handleCodeChange = (e) => {
        setSubjectCode(e.target.value);
    };

    const handleCreateSubject = async () => {
        try {
            await axios.post("http://localhost:8000/subjects", newSubject, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowCreateModal(false); // Close the modal
            setNewSubject({ name: "", code: "" }); // Reset form
        } catch (error) {
            console.error("Error creating subject:", error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    const handleJoinSubject = async (subjectCode) => {
        try {
            if (!token) {
                console.error("No token found");
                return;
            }

            const response = await axios.post(
                `http://localhost:8000/subjects/${subjectCode}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("Successfully joined the subject:", response.data);
            // You can navigate to the subject page or show a success message here
        } catch (error) {
            console.error("Error joining subject:", error);
        }
    };

    return (
        <Container className="dashboard">
            <Typography variant="h3" component="h1" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="h5">
                {userRole === "teacher"
                    ? "Subjects You Created"
                    : "Subjects You Are Enrolled In"}
            </Typography>

            {userRole === "teacher" ? (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowCreateModal(true)}
                    sx={{ mt: 2 }}
                >
                    Create Subject
                </Button>
            ) : (
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setShowJoinModal(true)}
                    sx={{ mt: 2, ml: 2 }}
                >
                    Join Subject
                </Button>
            )}

            <Grid container spacing={2} sx={{ mt: 2 }}>
                {subjects.length > 0 ? (
                    subjects.map((subject, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={subject.id || index}
                        >
                            <SubjectCard
                                subject={subject}
                                onClick={handleSubjectClick}
                            />
                        </Grid>
                    ))
                ) : (
                    <Typography>No subjects to display.</Typography>
                )}
            </Grid>

            {/* Modal for creating a subject */}
            <Dialog
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            >
                <DialogTitle>Create New Subject</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Subject Name"
                        type="text"
                        fullWidth
                        value={newSubject.name}
                        onChange={handleNameChange}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowCreateModal(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleCreateSubject} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal for joining a subject */}
            <Dialog
                open={showJoinModal}
                onClose={() => setShowJoinModal(false)}
            >
                <DialogTitle>Join a Subject</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Subject Code"
                        type="text"
                        fullWidth
                        value={subjectCode}
                        onChange={handleCodeChange}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowJoinModal(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleJoinSubject(subjectCode)}
                        color="primary"
                    >
                        Join
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Dashboard;
