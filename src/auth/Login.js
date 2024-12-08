import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Link,
} from "@mui/material";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/login", {
                email,
                password,
            });
            localStorage.setItem("access_token", response.data.access_token);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password");
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
                        Login
                    </Typography>
                    <form onSubmit={handleLogin} style={{ width: "100%" }}>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            fullWidth
                        >
                            Login
                        </Button>
                    </form>
                    <Box mt={2} display="flex" justifyContent="center">
                        <Typography variant="body2">
                            Don't have an account?{" "}
                            <Link href="/register" variant="body2">
                                Go to Register
                            </Link>
                        </Typography>
                    </Box>
                    {error && (
                        <Typography
                            color="error"
                            variant="body2"
                            align="center"
                        >
                            {error}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}

export default Login;
