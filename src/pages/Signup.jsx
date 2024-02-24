import { gql, useMutation } from "@apollo/client";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { StatusCode } from "constants/graphql";
import { SIGNUP_INVALID, SOMETHING_WENT_WRONG } from "constants/messages";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SIGNUP_MUTATION = gql`
    mutation Signup($username: String!, $password: String!, $displayName: String!) {
        signup(username: $username, password: $password, displayName: $displayName) {
            displayName
            id
            token {
                accessToken
                refreshToken
            }
            username
        }
    }
`;

export default function Signup() {
    const navigate = useNavigate();
    const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION);
    const [payload, setPayload] = useState({});
    const handlePayloadChange = (e) => {
        let { name, value } = e.target;
        setPayload({ ...payload, [name]: value });
    }

    const handleSubmit = (e) => {
        signup({ variables: payload })
            .then(response => {
                let data = response.data.signup;
                navigate("/");
            })
            .catch(error => {
                let statusCode = error.graphQLErrors[0].extensions.code;
                switch (statusCode) {
                    case StatusCode.CONFLICT: {
                        alert(SIGNUP_INVALID);
                        break;
                    }
                    default: {
                        alert(SOMETHING_WENT_WRONG);
                        break;
                    }
                }
            });
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
            <Typography variant="h1" component="div" color="primary" gutterBottom>
                Register
            </Typography>
            <form
                style={{
                    width: '100%',
                }}
            >
                <TextField
                    name="displayName"
                    label="Display name"
                    variant="outlined"
                    type="text"
                    fullWidth
                    style={{ marginBottom: '0.5rem' }}
                    onChange={handlePayloadChange}
                    required
                />
                <TextField
                    name="username"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: '0.5rem' }}
                    onChange={handlePayloadChange}
                    required
                />
                <TextField
                    name="password"
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    style={{ marginBottom: '0.5rem' }}
                    onChange={handlePayloadChange}
                    required
                />

                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                >
                    Sign up
                </Button>
            </form>
        </Paper>
    );
}