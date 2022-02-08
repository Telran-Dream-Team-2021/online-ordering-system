import {createTheme} from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#c5e2fc'
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});