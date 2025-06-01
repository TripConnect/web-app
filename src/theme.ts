import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Size {
        width: string;
        height: string;
    }

    interface Avatar {
        sm: Size;
        md: Size;
    }

    interface Theme {
        contentAvailableHeight: string,
        avatar: Avatar;
    }

    interface ThemeOptions {
        contentAvailableHeight: string,
        avatar?: Avatar;
    }
}

const theme = createTheme({
    spacing: 8,
    contentAvailableHeight: "90vh",
    avatar: {
        sm: {
            width: "30px",
            height: "30px"
        },
        md: {
            width: "54px",
            height: "54px"
        }
    }
});

export default theme;