import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import "./SubjectCard.scss";

const SubjectCard = ({ subject, onClick }) => {
    const [creatorName, setCreatorName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCreatorName = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/user/${subject.creator_id}`
                ); // Assuming creator_id is userID
                if (!response.ok) {
                    throw new Error("Failed to fetch creator name");
                }
                const data = await response.json();
                setCreatorName(`${data.firstName} ${data.lastName}`); // Set the full name
            } catch (err) {
                setError(err.message); // Handle errors
            } finally {
                setLoading(false); // Done loading
            }
        };

        fetchCreatorName();
    }, [subject.creator_id]);

    if (loading) {
        return (
            <Card className="subject-card" sx={{ padding: 2 }}>
                <CardContent>
                    <CircularProgress />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="subject-card" sx={{ padding: 2 }}>
                <CardContent>
                    <Typography variant="body2" color="error">
                        Error: {error}
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            className="subject-card"
            onClick={() => onClick(subject.id)}
            sx={{ marginBottom: 2 }}
        >
            <CardContent>
                <Typography variant="h6" className="subject-name">
                    {subject.name}
                </Typography>
                <Typography variant="body2" className="subject-code">
                    Code: {subject.code}
                </Typography>
                <Typography variant="body2" className="subject-creator">
                    Created by: Teacher {creatorName}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default SubjectCard;
