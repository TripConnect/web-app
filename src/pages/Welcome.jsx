import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { useDispatch } from "react-redux";
import { updateToken } from "slices/user";
import { SIGNIN_INCORRECT, SIGNIN_INVALID } from "constants/messages";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const SIGNIN_MUTATION = gql`
    mutation Signin($username: String!, $password: String!) {
        signin(username: $username, password: $password) {
            userInfo {
                id
                username
                displayName
                avatar
            }
            token {
                accessToken
                refreshToken
            }
        }
    }
`;

export default function Welcome(props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [loginPayload, setLoginPayload] = useState({});
    const [signin, { data, loading, error }] = useMutation(SIGNIN_MUTATION);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!loginPayload.username || !loginPayload.password) {
            alert(SIGNIN_INVALID);
            return
        }

        signin({ variables: { ...loginPayload } })
            .then(response => {
                let { userInfo, token } = response.data.signin;
                let { id: userId, displayName, avatar } = userInfo;
                let { accessToken, refreshToken } = token;
                dispatch(updateToken({ userId, accessToken, refreshToken, displayName, avatar }));
                navigate("/home");

            })
            .catch(error => {
                console.error(error);
                alert(SIGNIN_INCORRECT);
            });
    }

    const handleRegister = (e) => {
        navigate("/signup");
    }


    const handleLoginChange = (e) => {
        setLoginPayload({
            ...loginPayload,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <Paper style={{
            maxWidth: 400,
            margin: 'auto',
            padding: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        }}>
            <Typography variant="h5" component="div" color="primary" gutterBottom>
                {t('LOGIN')}
            </Typography>
            <form
                style={{
                    width: '100%',
                }} 
                onSubmit={handleSubmit}
            >
                <TextField
                    name="username"
                    label={t("USERNAME")}
                    variant="outlined"
                    fullWidth
                    onChange={handleLoginChange}
                    required
                    style={{ marginBottom: '0.5rem' }}
                />
                <TextField
                    name="password"
                    label={t("PASSWORD")}
                    variant="outlined"
                    type="password"
                    fullWidth
                    onChange={handleLoginChange}
                    style={{ marginBottom: '0.5rem' }}
                    required
                />
                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                >
                    {t("LOGIN")}
                </Button>
            </form>
            <div style={{
                marginTop: 20,
                width: "100%",
                textAlign: "right",
            }}>
                <i>{t("NOW_HAVE_ACCOUNT_QUESTION")}</i> <span style={{cursor: "pointer", color: "darkblue"}} role="link" onClick={handleRegister}>{t("SIGNUP")}</span>
            </div>
        </Paper>
    )
}
