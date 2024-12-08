import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import SubmissionCard from "./components/cards/SubmissionCard"; // Assuming this is the correct path

const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const Assessment = () => {
    const [assessment, setAssessment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [file, setFile] = useState(null); // For student file submission
    const [fileModalOpen, setFileModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { assessmentId } = useParams();
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");
    const [submitted, setSubmitted] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/assessments/id/${assessmentId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAssessment(response.data);
            } catch (err) {
                console.error("Error fetching assessment:", err);
                setError("Unable to fetch assessment details.");
            } finally {
                setLoading(false);
            }
        };

        fetchAssessment();
    }, [assessmentId, token]);

    useEffect(() => {
        if (userRole === "student" && assessmentId) {
            const checkSubmission = async () => {
                try {
                    const response = await axios.get(
                        `${API_BASE_URL}/submission/check/${assessmentId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setSubmitted(response.data.submission_exists);
                } catch (err) {
                    console.error("Error checking submission status:", err);
                    setError("Unable to check submission status.");
                }
            };

            checkSubmission();
        }
    }, [assessmentId, userRole, token]);

    useEffect(() => {
        if (userRole === "teacher" && assessmentId) {
            const fetchSubmissions = async () => {
                try {
                    const response = await axios.get(
                        `${API_BASE_URL}/submissions/view/${assessmentId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setSubmissions(response.data.submissions);
                } catch (err) {
                    console.error("Error fetching submissions:", err);
                    setError("Unable to fetch submissions.");
                }
            };

            fetchSubmissions();
        }
    }, [assessmentId, userRole, token]);

    const handleFileSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            console.error("No file selected");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);
            await axios.post(
                `${API_BASE_URL}/submission/${assessmentId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("File submitted successfully!");
            setFileModalOpen(false);
            setSubmitted(true);
        } catch (err) {
            console.error("Error submitting file:", err);
            alert("Failed to submit file.");
        }
    };

    if (loading) return <CircularProgress />;
    if (!assessment) return <Alert severity="info">No assessment found</Alert>;

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h3" gutterBottom>
                Assessment
            </Typography>
            <Typography variant="h4" gutterBottom>
                {assessment.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {assessment.description}
            </Typography>

            <Box className="button-container">
                {assessment.attachment && (
                    <Box>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                                window.open(
                                    `${API_BASE_URL}/${assessment.attachment}`,
                                    "_blank"
                                )
                            }
                        >
                            View Attachment
                        </Button>
                    </Box>
                )}

                {userRole === "student" && submitted === false && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setFileModalOpen(true)}
                    >
                        Submit Assessment
                    </Button>
                )}

                {userRole === "student" && submitted === true && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/submission/${assessmentId}`)}
                    >
                        View Submission
                    </Button>
                )}
            </Box>

            {userRole === "teacher" && (
                <Box mt={3}>
                    <Typography variant="h5">Submissions</Typography>
                    {submissions.length === 0 ? (
                        <Typography>No submissions found</Typography>
                    ) : (
                        submissions.map((submission) => (
                            <SubmissionCard
                                key={submission.submission_id}
                                submission={submission}
                                onClick={(id) => navigate(`/submission/${id}`)}
                            />
                        ))
                    )}
                </Box>
            )}

            {/* File Submission Modal */}
            <Dialog
                open={fileModalOpen}
                onClose={() => setFileModalOpen(false)}
            >
                <DialogTitle>Submit Your File</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleFileSubmit}>
                        <TextField
                            type="file"
                            fullWidth
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFileModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleFileSubmit} variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Assessment;
