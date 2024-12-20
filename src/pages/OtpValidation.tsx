import React, { useState, useRef } from "react";
import { TextField, Box, Button } from "@mui/material";

const OTPInput: React.FC = () => {
    const otpLength = 6;
    const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>(Array(otpLength).fill(null));

    const handleValidateOtp = () => {
        if (otp.length !== otpLength || otp.some(d => Number.isNaN(parseInt(d)))) {
            alert("Invalid OTP");
        }
    }

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent multiple characters
        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        // Move focus to the next cell if a digit is entered
        if (value && index < otpLength - 1) {
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
        const pastedOtp = clipboardData.split("").slice(0, otpLength);
        const updatedOtp = Array(otpLength).fill("");
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
            <section style={{ margin: '40px 0' }}>
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
                                style: { textAlign: "center", width: "2rem" },
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
                    style={{ display: 'block', width: "30vw", margin: '0 auto' }}
                >
                    Verify
                </Button>
            </section>
        </main>
    );
};

export default OTPInput;
