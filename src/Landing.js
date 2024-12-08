import React from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Box,
} from "@mui/material";

const Landing = () => {
    return (
        <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
            {/* Header Section */}
            <Box
                component="header"
                sx={{ bgcolor: "#3f51b5", p: 2, color: "#fff" }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h5" component="div" fontWeight="bold">
                        DevClassroom
                    </Typography>
                    <Box>
                        <Link
                            to="/login"
                            style={{ textDecoration: "none", marginRight: 8 }}
                        >
                            <Button variant="contained" color="primary">
                                Log In
                            </Button>
                        </Link>
                        <Link to="/register" style={{ textDecoration: "none" }}>
                            <Button variant="contained" color="secondary">
                                Sign Up
                            </Button>
                        </Link>
                    </Box>
                </Container>
            </Box>

            {/* Hero Section */}
            <Box
                component="section"
                sx={{ py: 8, bgcolor: "#e8eaf6", textAlign: "center" }}
            >
                <Container maxWidth="md">
                    <Typography
                        variant="h3"
                        component="h1"
                        fontWeight="bold"
                        gutterBottom
                    >
                        Welcome to DevClassroom
                    </Typography>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Your all-in-one classroom solution for managing
                        subjects, assessments, and feedback.
                    </Typography>
                </Container>
            </Box>

            {/* Features Section */}
            <Box component="section" sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h4"
                        component="h2"
                        fontWeight="bold"
                        textAlign="center"
                        gutterBottom
                    >
                        Core Features
                    </Typography>
                    <Grid container spacing={4}>
                        {[
                            {
                                title: "Manage Subjects",
                                description:
                                    "Create and organize subjects for your classroom with ease.",
                            },
                            {
                                title: "Track Assessments",
                                description:
                                    "Monitor student progress and performance through assessments.",
                            },
                            {
                                title: "Teacher Feedback",
                                description:
                                    "Provide insightful feedback to guide students in their learning journey.",
                            },
                        ].map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Footer Section */}
            <Box
                component="footer"
                sx={{
                    bgcolor: "#3f51b5",
                    color: "#fff",
                    py: 2,
                    textAlign: "center",
                }}
            >
                <Typography variant="body2">
                    &copy; 2024 DevClassroom. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
};

export default Landing;
