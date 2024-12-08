import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
    const userName = localStorage.getItem("user_name"); // Get the name from localStorage

    return (
        <AppBar position="static">
            <Toolbar>
                <div className="navbar-logo">
                    DevClassroom
                </div>
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, textAlign: "center" }}
                >
                    {userName ? `Welcome, ${userName}` : "Welcome!"}{" "}
                    {/* Display user's name in the middle */}
                </Typography>
                <Button color="inherit" component={Link} to="/profile">
                    Profile
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
