import {Box, Button, Container, Grid, TextField, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {ChangeEvent, SyntheticEvent, useState} from "react";
import {graphql} from "../../gql";
import {useMutation} from "@apollo/client";
import {Link, useNavigate} from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";

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
        <Grid item md={6} paddingRight={2}
              display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Box id="screen-left" width="100%" height="100vh" sx={{display: {xs: 'none', sm: 'none', md: 'block'}}}>
            <img id="screen-left__image" src="/sign-up-left-placeholder.jpg" alt="The discovery cover art"/>
            <Box id="screen-left__floating-text">
              <Typography variant="h4" component="p">Connect with travelers worldwide</Typography>
              <Typography variant="h5" component="p">
                Share experiences, discover hidden gems, and plan your next adventure with like-minded explorers.
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item sm={12} md={6} paddingLeft={2}
              display="flex" height="100vh" flexDirection="column" justifyContent="center" alignItems="center">
          <Box width={"100%"}>
            <Typography variant="h1" component="h1" color="primary" fontSize={28} fontWeight={"bold"} gutterBottom>
              <span style={{display: 'flex', alignItems: 'center', marginBottom: 40}}>
                <PublicIcon fontSize={"large"} style={{marginRight: 8}}/>
                TripConnect
              </span>
            </Typography>
            <Typography variant="h2" component="h2" color="black" fontSize={24} fontWeight={"bold"} gutterBottom>
              {t("SIGN_UP_PAGE.CREATE_ACCOUNT")}
            </Typography>
            <Typography variant="subtitle1" component="p" color="black" gutterBottom>
              {t("SIGN_UP_PAGE.SUBTITLE")}
            </Typography>
          </Box>

          <Box width={"100%"}>
            <TextField
              name="username"
              label="Enter your username"
              variant="outlined"
              onChange={handleFormChange}
              value={signUpPayload.username}
              style={{margin: '1rem 0'}}
              autoComplete="off"
              fullWidth
              required
            />
            <TextField
              name="password"
              label="Enter your password"
              variant="outlined"
              type="password"
              onChange={handleFormChange}
              value={signUpPayload.password}
              style={{marginBottom: '1.2rem'}}
              fullWidth
              required
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              size="large"
              disabled={!signUpPayload.username || !signUpPayload.password}
              onClick={handleSubmit}
              fullWidth
            >
              {t("SIGN_UP")}
            </Button>
          </Box>

          <Box style={{
            marginTop: 20,
            width: "100%",
            textAlign: "right",
          }}>
            <i>{t("SIGN_UP_PAGE.SIGN_IN_QUESTION")} </i>
            <Link style={{textDecoration: "none"}} to={"/signin"}>{t("SIGN_IN")}</Link>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
