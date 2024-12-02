import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const login = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/v1/auth/login/", {
                username,
                password
            });
            // Сохраняем токен в localStorage
            const token = response.data.access;
            localStorage.setItem('token', token);

            setMessage('Вы успешно вошли в систему.');
            navigate('/profile');
        } catch (err) {
            console.error(err);
            const errorMessage = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : 'Ошибка при входе в систему. Проверьте данные.';
            setMessage(errorMessage);
        }
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        login();
    };

    return (
        <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" align="center" color="primary" gutterBottom>
                    Вход в систему
                </Typography>
                <form onSubmit={handleLoginSubmit}>
                    <TextField
                        label="Имя пользователя"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        margin="normal"
                        required
                        error={!!errors.username}
                        helperText={errors.username && errors.username.join(', ')}
                    />
                    <TextField
                        label="Пароль"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        Войти
                    </Button>
                </form>

                {message && <Typography variant="body2" color="textSecondary" align="center" sx={{ marginTop: 2 }}>{message}</Typography>}
            </Box>
        </Container>
    );
}

export default Login;
