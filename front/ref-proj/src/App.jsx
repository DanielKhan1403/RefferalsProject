import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Menu, MenuItem, Container } from "@mui/material";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Router>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                            RefferalsTest
                        </Link>
                    </Typography>

                    {token ? (
                        <>
                            <Button color="inherit" onClick={handleMenuOpen}>
                                Меню
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleMenuClose}>
                                    <Link to="/profile" style={{ textDecoration: "none", color: "black" }}>
                                        Профиль
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button color="inherit">
                                <Link to="/login" style={{ textDecoration: "none", color: "white" }}>
                                    Войти
                                </Link>
                            </Button>
                            <Button color="inherit">
                                <Link to="/register" style={{ textDecoration: "none", color: "white" }}>
                                    Регистрация
                                </Link>
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 3 }}>
                <Routes>
                    <Route path="/" element={token ? <Profile /> : <Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </Container>

            <footer style={{ textAlign: "center", padding: "20px", background: "#f1f1f1" }}>
                <Typography variant="body2">© 2024 Моя платформа</Typography>
            </footer>
        </Router>
    );
};

export default App;
