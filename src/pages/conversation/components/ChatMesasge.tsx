import { Avatar, Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "store";
import {User} from "../state";

interface ChatMessageProps {
    id?: string;
    user: User;
    content: string;
    sentTime?: string;
}

export default function ChatMessage(props: ChatMessageProps) {
    const theme = useTheme();
    const currentUser = useSelector((state: RootState) => state.user);

    let isMine = currentUser.userId === props.user.id;

    return (
        <Stack
            direction="row"
            justifyContent={isMine ? 'flex-end' : 'flex-start'}
            alignItems="center"
            spacing={1.2}
            sx={{ my: 1 }}
        >
            {!isMine && <Avatar sx={{ ...theme.avatar.sm }} />}
            <Box title={props.sentTime ? new Date(props.sentTime).toLocaleString() : "..."}>
                <Paper
                    sx={{
                        p: 0.8,
                        borderRadius: 2,
                        backgroundColor: isMine ? '#3949ab' : 'grey.200',
                        color: isMine ? '#e8eaf6' : 'black',
                    }}
                >

                    <Typography variant="body1">
                        {props.content}
                    </Typography>
                </Paper>
            </Box>
        </Stack>
    );
}
