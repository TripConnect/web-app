import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { useDispatch } from "react-redux";
import { updateToken } from "slices/user";
import { LOGIN_INCORRECT, LOGIN_INVALID } from "constants/messages";
import { makeStyles } from "@mui/styles";
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

const useStyles = makeStyles((theme) => ({
    paper: {
        maxWidth: 400,
        margin: 'auto',
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(2),
    },
    textField: {
        marginBottom: theme.spacing(2), // Add margin to the bottom
    },
    submitButton: {
        marginTop: theme.spacing(2),
    },
}));

export default function Welcome(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [loginPayload, setLoginPayload] = useState({});
    const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

    const classes = useStyles();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!loginPayload.username || !loginPayload.password) {
            alert(LOGIN_INVALID);
            return
        }

        login({ variables: { ...loginPayload } })
            .then(response => {
                let { id: userId, token } = response.data.login;
                let { accessToken, refreshToken } = token;
                dispatch(updateToken({ accessToken, userId, refreshToken }));
                navigate("/home");

            })
            .catch(error => {
                alert(LOGIN_INCORRECT);
            });
    }

    const onLoginChange = (e) => {
        setLoginPayload({
            ...loginPayload,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <Paper className={classes.paper}>
            <Typography variant="h5" component="div" color="primary" gutterBottom>
                Login
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                    name="username"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    className={classes.textField}
                    onChange={onLoginChange}
                    required
                    style={{ marginBottom: '0.5rem' }}
                />
                <TextField
                    name="password"
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    className={classes.textField}
                    onChange={onLoginChange}
                    style={{ marginBottom: '0.5rem' }}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.submitButton}
                    onClick={handleSubmit}
                >
                    Log In
                </Button>
            </form>
        </Paper>
    )
}
