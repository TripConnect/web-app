import React, {useRef, useState} from "react";
import {Box, Button, TextField} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {gql, useMutation} from "@apollo/client";
import {useDispatch} from "react-redux";

import {updateInfo} from "slices/user";
import {StatusCode} from "constants/graphql";
import {OTP_INCORRECT, SIGN_IN_INCORRECT} from "constants/messages";

const SIGNIN_MUTATION = gql`
    mutation SigninWithOTP($username: String!, $password: String!, $otp: String!) {
        signIn(username: $username, password: $password, otp: $otp) {
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

export default function OtpValidation() {
  const OTP_LENGTH = 6;
  const {state} = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [signin, {data, loading, error}] = useMutation(SIGNIN_MUTATION);
  const inputsRef = useRef<Array<HTMLInputElement | null>>(Array(OTP_LENGTH).fill(null));
  let {username, password} = state;

  const handleValidateOtp = () => {
    if (otp.length !== OTP_LENGTH || otp.some(d => Number.isNaN(parseInt(d)))) {
      alert("Invalid OTP");
    }
    signin({variables: {username, password, otp: otp.join('')}})
      .then(response => {
        let {userInfo} = response.data.signin;
        let {id: userId, displayName, avatar} = userInfo;
        dispatch(updateInfo({userId, displayName, avatar}));
        navigate("/home");
      })
      .catch(error => {
        let statusCode = error.graphQLErrors[0].extensions.code;
        switch (statusCode) {
          case StatusCode.MULTI_FACTOR_UNAUTHORIZED:
            alert(OTP_INCORRECT);
            break;
          default:
            alert(SIGN_IN_INCORRECT);
        }
      });
  }

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move focus to the next cell if a digit is entered
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const updatedOtp = [...otp];
      updatedOtp[index - 1] = "";
      setOtp(updatedOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const clipboardData = event.clipboardData.getData("Text");
    if (!/^\d+$/.test(clipboardData)) return; // Only accept numeric values
    const pastedOtp = clipboardData.split("").slice(0, OTP_LENGTH);
    const updatedOtp = Array(OTP_LENGTH).fill("");
    pastedOtp.forEach((digit, i) => {
      updatedOtp[i] = digit;
    });
    setOtp(updatedOtp);
    inputsRef.current[pastedOtp.length - 1]?.focus();
  };

  return (
    <main style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
      flexDirection: 'column',
    }}>
      <h1>OTP Verification</h1>
      <section style={{margin: '40px 0'}}>
        <Box display="flex" gap={1} justifyContent="center">
          {otp.map((value, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputsRef.current[index] = el)}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e: any) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              variant="outlined"
              inputProps={{
                maxLength: 1,
                style: {textAlign: "center", width: "2rem"},
              }}
            />
          ))}
        </Box>
      </section>
      <section>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={handleValidateOtp}
          style={{display: 'block', width: "30vw", margin: '0 auto'}}
        >
          Verify
        </Button>
      </section>
    </main>
  );
};
