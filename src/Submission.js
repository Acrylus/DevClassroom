import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const Submission = () => {
    const [submission, setSubmission] = useState(null);
    const [score, setScore] = useState(""); // For teacher's score
    const [feedback, setFeedback] = useState(""); // For teacher's feedback

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scoreModalOpen, setScoreModalOpen] = useState(false);

    const { submissionId } = useParams();
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                // Conditional API URL based on userRole
                const apiUrl =
                    userRole === "teacher"
                        ? `${API_BASE_URL}/submission/view/${submissionId}`
                        : `${API_BASE_URL}/submission/student/${submissionId}`;

                const response = await axios.get(apiUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSubmission(response.data);
            } catch (err) {
                console.error("Error fetching submission:", err);
                setError("Unable to fetch submission details.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmission();
    }, [submissionId, userRole, token]);

    const handleScoreAndFeedbackSubmit = async (event) => {
        event.preventDefault();
        if (!score || feedback.trim() === "") {
            alert("Score and feedback are required.");
            return;
        }

        try {
            await axios.put(
                `${API_BASE_URL}/submissions/${submission.submission_id}/grade`,
                { score, feedback },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("Score and feedback submitted successfully!");
            setScoreModalOpen(false);
        } catch (err) {
            console.error("Error submitting score and feedback:", err);
            alert("Failed to submit score and feedback.");
        }
    };

    const handleViewFile = () => {
        // Open file in a new window or download it
        const filePath = submission.file_path;
        const fileUrl = `${API_BASE_URL}/${filePath}`;
        window.open(fileUrl, "_blank"); // Open the file in a new tab
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Submission
            </Typography>

            <Typography variant="body1" gutterBottom>
                <strong>Student:</strong> {submission.student.name} <br />
                <strong>Email:</strong> {submission.student.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
                <strong>File Path:</strong>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleViewFile}
                    sx={{ marginLeft: 2 }}
                >
                    View File
                </Button>
            </Typography>

            <Typography variant="body1" gutterBottom>
                Score: {submission.score}
            </Typography>

            <Typography variant="body1" gutterBottom>
                Feedback: {submission.feedback}
            </Typography>

            {userRole === "teacher" && (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setScoreModalOpen(true)}
                >
                    Provide Score and Feedback
                </Button>
            )}

            {/* Score and Feedback Modal */}
            <Dialog
                open={scoreModalOpen}
                onClose={() => setScoreModalOpen(false)}
            >
                <DialogTitle>Provide Score and Feedback</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleScoreAndFeedbackSubmit}>
                        <TextField
                            type="number"
                            label="Score"
                            fullWidth
                            value={score}
                            onChange={(e) =>
                                setScore(Number(e.target.value) || "")
                            }
                            required
                            margin="dense"
                        />
                        <TextField
                            label="Feedback"
                            multiline
                            rows={4}
                            fullWidth
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            required
                            margin="dense"
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setScoreModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleScoreAndFeedbackSubmit}
                        variant="contained"
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Submission;
