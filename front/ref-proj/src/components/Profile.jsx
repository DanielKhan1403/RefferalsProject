import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, List, ListItem, CircularProgress, Box, Button, TextField } from "@mui/material";

function Profile() {
    const [userData, setUserData] = useState(null);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [newInviteCode, setNewInviteCode] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            fetchUserData();
        } else {
            setMessage("Вы не авторизованы. Пожалуйста, войдите в систему.");
        }
    }, [token]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/v1/auth/profile/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(response.data);
            setInviteCode(response.data.invite_code);
            setInvitedUsers(response.data.users_who_used_invite_code);
        } catch (err) {
            setMessage("Ошибка при загрузке данных профиля.");
        }
    };

    const handleAddInviteCode = async () => {
        if (!newInviteCode) {
            setMessage("Пожалуйста, введите код пригласившего пользователя.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/v1/auth/activate/",  // Эндпоинт активации кода
                { invite_code: newInviteCode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Обновляем данные пользователя, чтобы отобразить изменения после активации кода
            fetchUserData();

            setInviteCode(newInviteCode);
            setMessage("Код пригласившего пользователя успешно добавлен!");
            setNewInviteCode(""); // Очистить поле ввода
        } catch (err) {
            setMessage("Ошибка при добавлении кода пригласившего пользователя. Проверьте код или попробуйте снова.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Ваш профиль
            </Typography>

            {message && <Typography color="error">{message}</Typography>}

            {userData ? (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="body1">
                        <strong>Имя:</strong> {userData.username}
                    </Typography>

                    <Typography variant="body1">
                        <strong>Реферальный код:</strong> {userData.invite_code || "Не установлен"}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Номер телефона:</strong> {userData.phone_number}
                    </Typography>

                    {/* Выводим код пригласившего пользователя */}
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        <strong>Код пригласившего пользователя:</strong> {userData.activated_invite_code || "Не установлен"}
                    </Typography>

                    {/* Если у пользователя нет активированного кода пригласившего, показываем форму для ввода */}
                    {!userData.activated_invite_code && (
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="Введите код пригласившего пользователя"
                                variant="outlined"
                                fullWidth
                                value={newInviteCode}
                                onChange={(e) => setNewInviteCode(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddInviteCode}
                                disabled={loading}
                            >
                                {loading ? "Добавление..." : "Добавить код пригласившего"}
                            </Button>
                        </Box>
                    )}

                    <Typography variant="h6" sx={{ mt: 3 }}>
                        Приглашенные пользователи
                    </Typography>
                    {invitedUsers.length > 0 ? (
                        <List>
                            {invitedUsers.map((user) => (
                                <ListItem key={user.id}>
                                    {user.username} ({user.phone_number})
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1">Вы пока не пригласили никого.</Typography>
                    )}
                </Box>
            ) : (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}
        </Container>
    );
}

export default Profile;
