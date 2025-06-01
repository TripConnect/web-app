import { Avatar, Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { GraphQLModels } from "types/graphql.type";

export default function ChatMessage(props: GraphQLModels.Message) {
    const theme = useTheme();
    const currentUser = useSelector((state: RootState) => state.user);

    let isMine = currentUser.userId === props.fromUser?.id;

    return (
        <Stack
            direction="row"
            justifyContent={isMine ? 'flex-end' : 'flex-start'}
            alignItems="center"
            spacing={1.2}
            sx={{ my: 1 }}
        >
            {!isMine && <Avatar sx={{ ...theme.avatar.sm }} />}
            <Box>
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
