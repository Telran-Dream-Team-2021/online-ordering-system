import {createTheme} from "@mui/material/styles";

export const theme = createTheme({
    typography: {
        fontFamily: 'Mulish, sans-serif',
        fontSize: 12,
    },
    palette: {
        mode: 'light',
        primary: {
            light: '#FBECDF',
            main: '#5C1200',
            contrastText: '#FFFFFF'
        },
        secondary: {
            light: '#EED7CA',
            main: '#9F5E39',
            contrastText: '#FFFFFF',
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
    components: {
        MuiTypography: {
            defaultProps: {
                zIndex: 1,
                color: '#535353',
            },
            variants: [
                {
                    props: {variant: 'h3'},
                    style: {
                        fontFamily: 'Mulish',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: '32px',
                        lineHeight: '40px',
                        letterSpacing: '0.1px',
                        textAlign: "left",
                    }
                }
            ]
        },
        MuiTextField: {
            defaultProps: {},
            variants: [
                {
                    props: {variant: 'standard'},
                    style: {
                        backgroundColor: '#FFFFFF',
                        color: '#737B7D',
                        '& .MuiInput-root:hover:not(.Mui-disabled):before': {border: 'none'},
                        '& .MuiInput-root': {
                            '&, &:hover, &:focus': {
                                '&:before, &:after': {
                                    border: 'none',
                                }
                            },
                            '& .MuiInput-input': {
                                paddingLeft: '2px',
                            },
                        },
                    }
                }
            ]
        },
        MuiButton: {
            defaultProps: {
                style: {
                    lineHeight: 1.5,
                    textTransform: 'none',
                    letterSpacing: '0.3px',
                    borderRadius: 0,
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    paddingLeft: '18px',
                    fontWeight: 'bold',
                },
            }
        },
    }
});