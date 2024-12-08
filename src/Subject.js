import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AssessmentCard from "./components/cards/AssessmentCard";
import { useNavigate } from "react-router-dom";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";

const Subject = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newAssessment, setNewAssessment] = useState({
        name: "",
        description: "",
        over: "",
        attachment: null,
    });
    const token = localStorage.getItem("access_token");
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const userRole = localStorage.getItem("user_role");

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const endpoint = `http://localhost:8000/assessments/${subjectId}`;
                const response = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAssessments(response.data);
            } catch (error) {
                console.error("Error fetching assessments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, [token, subjectId]);

    const handleCreateAssessment = async (event) => {
        event.preventDefault();

        if (!newAssessment.attachment) {
            alert("No attachment selected");
            return;
        }

        try {
            const endpoint = `http://localhost:8000/subjects/${subjectId}/assessments`;

            const formData = new FormData();
            formData.append("name", newAssessment.name);
            formData.append("description", newAssessment.description);
            formData.append("over", newAssessment.over);
            formData.append("attachment", newAssessment.attachment);

            const response = await axios.post(endpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            setAssessments((prev) => [...prev, response.data]);
            setShowModal(false);
            setNewAssessment({
                name: "",
                description: "",
                over: "",
                attachment: null,
            });
        } catch (error) {
            console.error("Error creating assessment:", error);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    const handleAssessmentClick = (assessmentId) => {
        navigate(`/assessment/${assessmentId}`);
    };

    return (
        <Box sx={{ padding: "2rem" }}>
            <Typography variant="h4" gutterBottom>
                Subject
            </Typography>
            <Typography variant="h6" gutterBottom>
                Assessments
            </Typography>
            {userRole === "teacher" && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowModal(true)}
                >
                    Create Assessment
                </Button>
            )}

            <Dialog open={showModal} onClose={() => setShowModal(false)}>
                <DialogTitle>Create Assessment</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Assessment Name"
                        type="text"
                        fullWidth
                        value={newAssessment.name}
                        onChange={(e) =>
                            setNewAssessment({
                                ...newAssessment,
                                name: e.target.value,
                            })
                        }
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Assessment Over"
                        type="number"
                        fullWidth
                        value={newAssessment.over}
                        onChange={(e) =>
                            /^\d*$/.test(e.target.value) &&
                            setNewAssessment({
                                ...newAssessment,
                                over: e.target.value,
                            })
                        }
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Assessment Description"
                        type="text"
                        multiline
                        rows={4}
                        fullWidth
                        value={newAssessment.description}
                        onChange={(e) =>
                            setNewAssessment({
                                ...newAssessment,
                                description: e.target.value,
                            })
                        }
                        required
                    />
                    <Button
                        variant="contained"
                        component="label"
                        sx={{ mt: 2 }}
                    >
                        Upload File
                        <input
                            type="file"
                            hidden
                            onChange={(e) =>
                                setNewAssessment({
                                    ...newAssessment,
                                    attachment: e.target.files[0],
                                })
                            }
                        />
                    </Button>
                    {newAssessment.attachment ? (
                        <Typography sx={{ mt: 1 }}>
                            Selected file: {newAssessment.attachment.name}
                        </Typography>
                    ) : (
                        <Typography sx={{ mt: 1, color: "red" }}>
                            No file selected. Please upload a file.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowModal(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleCreateAssessment} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ mt: 4 }}>
                {assessments.length > 0 ? (
                    assessments.map((assessment) => (
                        <AssessmentCard
                            key={assessment.id}
                            assessment={assessment}
                            onClick={() => handleAssessmentClick(assessment.id)}
                        />
                    ))
                ) : (
                    <Typography>No assessments to display.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default Subject;
