import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import "./SubmissionCard.scss";

const SubmissionCard = ({ submission, onClick }) => {
    const handleFileClick = (e) => {
        e.stopPropagation();
    };

    return (
        <Card
            className="submission-card"
            onClick={() => onClick(submission.submission_id)}
            sx={{ marginBottom: 2 }}
        >
            <CardContent>
                <Typography variant="h6" className="submission-student">
                    {submission.student.name}
                </Typography>
                <Typography variant="body2" className="submission-email">
                    <strong>Email:</strong> {submission.student.email}
                </Typography>

                {submission.score !== undefined && (
                    <Typography variant="body2" className="submission-score">
                        <strong>Score:</strong> {submission.score}
                    </Typography>
                )}

                {submission.feedback && (
                    <Typography variant="body2" className="submission-feedback">
                        <strong>Feedback:</strong> {submission.feedback}
                    </Typography>
                )}

                {submission.file_path && (
                    <div className="submission-file">
                        <strong>File: </strong>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleFileClick}
                            href={`http://localhost:8000/${submission.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View File
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SubmissionCard;
