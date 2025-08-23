import {SyntheticEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useMutation} from '@apollo/client';
import {useDispatch, useSelector} from "react-redux";
import {updateInfo} from "../../slices/user";
import {OTP_INCORRECT, SIGN_IN_INCORRECT, SIGN_IN_INVALID} from "../../constants/messages";
import {Box, Button, Container, Grid, TextField, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {StatusCode} from "../../constants";
import {graphql} from "../../gql";
import PublicIcon from '@mui/icons-material/Public';

const SIGN_IN_MUTATION = graphql(`
    mutation SignIn($username: String!, $password: String!) {
        signIn(username: $username, password: $password) {
            userInfo {
                id
                displayName
                avatar
            }
        }
    }
`);

export default function Index() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let [signInPayload, setSignInPayload] = useState({
    username: '',
    password: ''
  });
  const [signIn] = useMutation(SIGN_IN_MUTATION);

  const currentUser = useSelector((state: any) => state.user);
  const isAuthenticated = Boolean(currentUser.accessToken);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!signInPayload.username || !signInPayload.password) {
      alert(SIGN_IN_INVALID);
      return
    }

    signIn({variables: {...signInPayload}})
      .then(response => {
        if (!response.data) {
          throw Error(SIGN_IN_INVALID);
        }

        let signInData = response.data.signIn;

        let action = updateInfo({
          userId: signInData.userInfo!.id,
          displayName: signInData.userInfo!.displayName,
          avatar: signInData.userInfo!.avatar
        });
        dispatch(action);
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
            alert(SIGN_IN_INCORRECT);
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
    <Container>
      <Grid container>
        <Grid item md={6} paddingRight={2}
              display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Box id="screen-left" width="100%" height="100vh" sx={{display: {xs: 'none', sm: 'none', md: 'block'}}}>
            <img id="screen-left__image" src="/sign-up-left-placeholder.jpg" alt="The discovery cover art"/>
            <Box id="screen-left__floating-text">
              <Typography variant="h4" component="p">Discover the world with us</Typography>
              <Typography variant="h5" component="p">
                Join our community of travelers and share your adventures
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
              {t("SIGN_IN")}
            </Typography>
            <Typography variant="subtitle1" component="p" color="black" gutterBottom>
              Welcome back! Please login to your account
            </Typography>
          </Box>

          <Box width={"100%"}>
            <TextField
              name="username"
              label="Enter your username"
              variant="outlined"
              onChange={handleLoginChange}
              value={signInPayload.username}
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
              onChange={handleLoginChange}
              value={signInPayload.password}
              style={{marginBottom: '1.2rem'}}
              fullWidth
              required
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSignIn}
              fullWidth
            >
              {t("SIGN_IN")}
            </Button>
          </Box>

          <Box style={{
            marginTop: 20,
            width: "100%",
            textAlign: "right",
          }}>
            <i>{t("NOW_HAVE_ACCOUNT_QUESTION")} </i>
            <span
              style={{cursor: "pointer", color: "darkblue"}}
              role="link"
              onClick={handleRegister}
            >
              {t("SIGN_UP")}
              </span>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
