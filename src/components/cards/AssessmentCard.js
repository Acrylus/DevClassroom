import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import "./AssessmentCard.scss";

const AssessmentCard = ({ assessment, onClick }) => {
    const handleAttachmentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <Card
            className="assessment-card"
            onClick={() => onClick(assessment.id)}
            sx={{ marginBottom: 2 }}
        >
            <CardContent>
                <Typography variant="h6" className="assessment-name">
                    {assessment.name}
                </Typography>
                <Typography variant="body2" className="assessment-description">
                    {assessment.description}
                </Typography>

                {assessment.score !== undefined && (
                    <Typography variant="body2" className="assessment-score">
                        <strong>Score:</strong> {assessment.score}/
                        {assessment.over}
                    </Typography>
                )}

                {assessment.feedback && (
                    <Typography variant="body2" className="assessment-feedback">
                        <strong>Feedback:</strong> {assessment.feedback}
                    </Typography>
                )}

                {assessment.attachment && (
                    <div className="assessment-attachment">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAttachmentClick}
                            href={`http://localhost:8000/${assessment.attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Attachment
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AssessmentCard;
