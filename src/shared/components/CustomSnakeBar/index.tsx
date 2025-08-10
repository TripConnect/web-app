import { useState } from "react";
import { Snackbar, SnackbarCloseReason } from "@mui/material";

type CustomSnakeBarProps = {
    message: string,
    autoHideDuration?: number | 3000,
    transitionDuration?: number | 400,
}


export default function CustomSnakeBar({ message }: CustomSnakeBarProps) {
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return <Snackbar
        open={open}
        onClose={handleClose}
        transitionDuration={400}
        autoHideDuration={3000}
        message={message}
    />
}
