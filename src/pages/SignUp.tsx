import { gql, useMutation } from "@apollo/client";
import { Button, Paper, TextField, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { StatusCode } from "constants/graphql";
import { SIGNUP_INVALID, SOMETHING_WENT_WRONG } from "constants/messages";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client/react/hooks/useApolloClient.js";

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $password: String!, $displayName: String!, $avatar: Upload) {
    signup(username: $username, password: $password, displayName: $displayName, avatar: $avatar) {
      userInfo {
        id
        displayName
      }
      token {
        accessToken
        refreshToken
      }
    }
  }
`;

const UPLOAD_MUTATION = gql`
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file) {
      id
    }
  }
`;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function SignUp() {
  const navigate = useNavigate();
  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION);
  const [uploadFile, { loading: uploadLoading }] = useMutation(UPLOAD_MUTATION);
  const [payload, setPayload] = useState<any>({});
  const apolloClient = useApolloClient();

  const handlePayloadChange = (e: any) => {
    let { name, value } = e.target;

    if (name === "avatar" && e.target.validity.valid && e.target.files) {
      value = e.target.files[0];
    }
    setPayload({ ...payload, [name]: value });
  }

  const handleSubmit = (e: any) => {
    console.log({ payload });
    signup({ variables: payload })
      .then(response => {
        apolloClient.resetStore();
        let data = response.data.signup;
        navigate("/");
      })
      .catch(error => {
        console.log({ error });
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
        encType="multipart/form-data"
        style={{
          width: '100%',
        }}
      >
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          style={{ marginBottom: '0.5rem', marginRight: '0.5rem' }}
        >
          Avatar
          <VisuallyHiddenInput type="file" name="avatar" onChange={handlePayloadChange} />
        </Button>
        {payload?.avatar?.name || <i>not uploaded</i>}

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