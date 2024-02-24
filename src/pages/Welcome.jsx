import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { useDispatch } from "react-redux";
import { updateToken } from "slices/user";
import { LOGIN_INCORRECT, LOGIN_INVALID } from "constants/messages";
import { Button, Paper, TextField, Typography } from "@mui/material";

const LOGIN_MUTATION = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            id
            username
            displayName
            token {
                accessToken
                refreshToken
            }
        }
    }
`;

export default function Welcome(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [loginPayload, setLoginPayload] = useState({});
    const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!loginPayload.username || !loginPayload.password) {
            alert(LOGIN_INVALID);
            return
        }

        login({ variables: { ...loginPayload } })
            .then(response => {
                let { id: userId, token, displayName } = response.data.login;
                let { accessToken, refreshToken } = token;
                dispatch(updateToken({ userId, accessToken, refreshToken, displayName }));
                navigate("/home");

            })
            .catch(error => {
                alert(LOGIN_INCORRECT);
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
                Login
            </Typography>
            <form
                style={{
                    width: '100%',
                }} 
                onSubmit={handleSubmit}
            >
                <TextField
                    name="username"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    onChange={handleLoginChange}
                    required
                    style={{ marginBottom: '0.5rem' }}
                />
                <TextField
                    name="password"
                    label="Password"
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
                    Log In
                </Button>
            </form>
            <div style={{
                marginTop: 20,
                width: "100%",
                textAlign: "right",
            }}>
                <i>Now have account?</i> <span style={{cursor: "pointer", color: "darkblue"}} role="link" onClick={handleRegister}>signup</span>
            </div>
        </Paper>
    )
}
