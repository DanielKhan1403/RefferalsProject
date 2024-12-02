import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState("");
    const [errors, setErrors] = useState({});
    const [isRegistered, setIsRegistered] = useState(false); // Состояние для отслеживания регистрации
    const [isReferralSkipped, setIsReferralSkipped] = useState(false);
    const navigate = useNavigate();

    const reg = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/v1/auth/register/", {
                username,
                password,
                phone_number: phoneNumber,
            });
            setTimeout(() => {
                setMessage('Потвердите номер телефона');
            }, 1000);
            setTimeout(() => {
                setMessage('Ура! вы успешно зарегистрировались, пожалуйста потвердите номер вашего телефона');
                setIsRegistered(true);
            }, 2000);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                if (errorData.username) {
                    setErrors((prevErrors) => ({ ...prevErrors, username: errorData.username }));
                }
                if (errorData.phone_number) {
                    setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: errorData.phone_number }));
                }
                setMessage('Ошибка при регистрации. Проверьте данные.');
            }
        }
    };

    const login = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/v1/auth/login/", {
                username,
                password
            });
            const token = response.data.access;
            setToken(token);
            localStorage.setItem('token', token); // Сохраняем токен в localStorage
            setMessage('Вы успешно вошли в систему. Введите реферальный код, если он у вас есть.');
        } catch (err) {
            console.error(err);
            const errorMessage = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : 'Ошибка при входе в систему. Проверьте данные.';
            setMessage(errorMessage);
        }
    };

    const activateReferralCode = async () => {
        try {
            if (!referralCode) {
                setMessage('Введите реферальный код.');
                return;
            }
            await axios.post(
                "http://127.0.0.1:8000/api/v1/auth/activate/",
                { invite_code: referralCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Реферальный код успешно активирован!');
            navigate('/profile');  // Перенаправление на страницу профиля
        } catch (err) {
            console.error(err);
            const errorMessage = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : 'Произошла ошибка при запросе. Пожалуйста, попробуйте позже.';
            setMessage(errorMessage);
        }
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        reg();
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        login();
    };

    const handleActivateSubmit = (e) => {
        e.preventDefault();
        activateReferralCode();
    };

    const handleSkipReferral = () => {
        setIsReferralSkipped(true);
        const savedToken = localStorage.getItem('token'); // Проверяем наличие токена в localStorage
        if (savedToken) {
            navigate('/profile'); // Переход на профиль
        } else {
            setMessage('Ошибка: токен не найден. Пожалуйста, войдите снова.');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" align="center" color="primary" gutterBottom>
                    Регистрация
                </Typography>

                {/* Отображаем форму регистрации только если пользователь еще не зарегистрирован */}
                {!isRegistered && (
                    <form onSubmit={handleRegisterSubmit}>
                        <TextField
                            label="Имя пользователя"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                            required
                            error={!!errors.username}  // Добавляем ошибку для этого поля
                            helperText={errors.username && errors.username.join(', ')}  // Выводим ошибки для username
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
                        <TextField
                            label="Номер телефона"
                            variant="outlined"
                            fullWidth
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            margin="normal"
                            required
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber && errors.phoneNumber.join(', ')}  // Выводим ошибки для phone_number
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ marginTop: 2 }}
                        >
                            Зарегистрироваться
                        </Button>
                    </form>
                )}

                {/* После регистрации показываем сообщение и форму для входа */}
                {isRegistered && (
                    <>
                        <Typography variant="h6" align="center" gutterBottom>
                            Пожалуйста, войдите, чтобы получить токен
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
                                color="secondary"
                                fullWidth
                                sx={{ marginTop: 2 }}
                            >
                                Войти
                            </Button>
                        </form>
                    </>
                )}

                {message && <Typography variant="body2" color="textSecondary" align="center" sx={{ marginTop: 2 }}>{message}</Typography>}

                {/* После входа показываем форму для активации реферального кода */}
                {token && !isReferralSkipped && (
                    <form onSubmit={handleActivateSubmit} sx={{ marginTop: 2 }}>
                        <TextField
                            label="Реферальный код"
                            variant="outlined"
                            fullWidth
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value)}
                            margin="normal"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            fullWidth
                            sx={{ marginTop: 2 }}
                        >
                            Активировать реферальный код
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            color="default"
                            fullWidth
                            sx={{ marginTop: 2 }}
                            onClick={handleSkipReferral}
                        >
                            Продолжить без реферального кода
                        </Button>
                    </form>
                )}
            </Box>
        </Container>
    );
}

export default Register;
