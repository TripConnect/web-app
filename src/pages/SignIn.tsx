import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { useDispatch, useSelector } from "react-redux";
import { updateToken } from "slices/user";
import { OTP_INCORRECT, SIGNIN_INCORRECT, SIGNIN_INVALID } from "constants/messages";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { StatusCode } from "constants/graphql";

const SIGNIN_MUTATION = gql`
    mutation Signin($username: String!, $password: String!) {
        signin(username: $username, password: $password) {
            userInfo {
                id
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

type SignInPayload = {
    username: string;
    password: string;
}

export default function SignIn() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [signInPayload, setSignInPayload] = useState<SignInPayload>({
        username: '',
        password: ''
    });
    const [signin, { data, loading, error }] = useMutation(SIGNIN_MUTATION);

    const currentUser = useSelector((state: any) => state.user);
    const isAuthenticated = Boolean(currentUser.accessToken);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!signInPayload.username || !signInPayload.password) {
            alert(SIGNIN_INVALID);
            return
        }

        signin({ variables: { ...signInPayload } })
            .then(response => {
                let { userInfo, token } = response.data.signin;
                let { id: userId, displayName, avatar } = userInfo;
                let { accessToken, refreshToken } = token;
                dispatch(updateToken({ userId, accessToken, refreshToken, displayName, avatar }));
                navigate("/home");
            })
            .catch(error => {
                let statusCode = error?.graphQLErrors?.[0]?.extensions?.code ?? "UNKNOWN_ERROR";
                switch (statusCode) {
                    case StatusCode.MULTI_FACTOR_REQUIRED:
                        navigate('/otp-validation', {
                            state: signInPayload
                        });
                        break;
                    case StatusCode.MULTI_FACTOR_UNAUTHORIZED:
                        alert(OTP_INCORRECT);
                        break;
                    default:
                        alert(SIGNIN_INCORRECT);
                }

            });
    }

    const handleRegister = () => {
        navigate("/signup");
    }

    const handleLoginChange = (e: React.ChangeEvent) => {
        let target = e.target as HTMLInputElement
        setSignInPayload({
            ...signInPayload,
            [target.name]: target.value,
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
                {t('SIGN_IN')}
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
                    value={signInPayload.username}
                    style={{ marginBottom: '0.5rem' }}
                    autoComplete="off"
                    required
                />
                <TextField
                    name="password"
                    label={t("PASSWORD")}
                    variant="outlined"
                    type="password"
                    fullWidth
                    onChange={handleLoginChange}
                    value={signInPayload.password}
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
                <i>{t("NOW_HAVE_ACCOUNT_QUESTION")}</i> <span style={{ cursor: "pointer", color: "darkblue" }} role="link" onClick={handleRegister}>{t("SIGNUP")}</span>
            </div>
        </Paper>
    )
}
