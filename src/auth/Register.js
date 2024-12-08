import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Link,
    Box,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Card,
    CardContent,
} from "@mui/material";

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        role: "student",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Registration successful!");
            } else {
                const data = await response.json();
                alert(data.detail || "Registration failed!");
            }
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 5 }}>
            <Card>
                <CardContent>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        align="center"
                    >
                        Register
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <TextField
                            label="First Name"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Last Name"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="teacher">Teacher</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            fullWidth
                        >
                            Register
                        </Button>
                    </form>
                    <Box mt={2} display="flex" justifyContent="center">
                        <Typography variant="body2">
                            Already have an account?{" "}
                            <Link href="/login" variant="body2">
                                Go to Login
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Register;
