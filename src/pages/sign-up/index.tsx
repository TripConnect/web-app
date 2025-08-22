import "./index.scss"
import {Button, Container, Grid, TextField, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {ChangeEvent, SyntheticEvent, useState} from "react";
import {graphql} from "../../gql";
import {useMutation} from "@apollo/client";
import {useNavigate} from "react-router-dom";

export function SignUp() {
  const {t} = useTranslation();
  const navigate = useNavigate();

    const SIGN_UP_MUTATION = graphql(`
        mutation SignUp($username: String!, $password: String!) {
            signUp(username: $username, password: $password) {
                userInfo {
                    id
                    displayName
                    avatar
                }
            }
        }
    `);

  const [signUp] = useMutation(SIGN_UP_MUTATION);

  let [signUpPayload, setSignUpPayload] = useState({
    username: '',
    password: ''
  });

  const handleFormChange = (e: ChangeEvent) => {
    let target = e.target as HTMLInputElement
    setSignUpPayload(prevState => ({
      ...prevState,
      [target.name]: target.value,
    }));
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    signUp({variables: {username: signUpPayload.username, password: signUpPayload.password}})
      .then(() => {
        navigate('/signin');
      })
      .catch(() => {
        navigate('/signup');
      });
  }

  return (
    <Container>
      <Grid container>
        <Grid item sm={0} md={6}>
          <img id="left-side-placeholder" src="/sign-up-left-placeholder.jpg" alt="Traveler walking a winding path"/>
        </Grid>
        <Grid item sm={12} md={6}>
          <Typography variant="h1" align="center" fontSize="32px" fontWeight="bold">
            Sign up for Trip Connect
          </Typography>
          <Grid
            container
            component="section"
            spacing={0}
            direction="column"
            alignItems="start"
            justifyContent="center"
            sx={{minHeight: '50vh'}}
          >
            <TextField
              name="username"
              label={t("USERNAME")}
              variant="outlined"
              onChange={handleFormChange}
              // value={signUpPayload.username}
              style={{marginBottom: '0.5rem'}}
              autoComplete="off"
              fullWidth
              required
            />
            <TextField
              type="password"
              name="password"
              label={t("PASSWORD")}
              variant="outlined"
              onChange={handleFormChange}
              // value={signUpPayload.username}
              style={{marginBottom: '0.5rem'}}
              autoComplete="off"
              fullWidth
              required
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              {t("SIGNUP")}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}
