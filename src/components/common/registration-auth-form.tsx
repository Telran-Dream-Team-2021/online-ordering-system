import React, {useEffect, useRef, useState} from 'react';
import {LoginData} from "../../models/common/login-data";
import {
    Alert, AlertColor,
    Avatar, Backdrop,
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Collapse,
    Container, CssBaseline,
    IconButton, TextField,
    Typography
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import socialAuthProviders, {SocialProvider} from "../../config/firebase-auth-config";

type RegistrationAuthType = {
    loginFn: (loginData: LoginData) => Promise<boolean>,
    isAdminsEmailFn: (email: string) => Promise<boolean>,
    passwordValidationFn: (password: string) => string
}

const initialLoginData: LoginData = {email: '', password: ''};

const RegistrationAuthForm: React.FC<RegistrationAuthType> = (props) => {
    const {loginFn, passwordValidationFn, isAdminsEmailFn} = props;
    const [loginData, setLoginData] = useState<LoginData>(initialLoginData);
    const errorMessage = useRef<string>('');
    const [flValid, setValid] = useState<boolean>(false);
    const [alert, setAlert] = useState<AlertColor>();
    const [spinner, setSpinner] = useState(false);
    const withPassword = useRef<boolean>(false);
    const alertMessage = useRef<string>('');

    useEffect(() => {
        setValid(validateEmailFormat(loginData.email) && (!withPassword.current || !passwordValidationFn(loginData.password)));
    }, [loginData]);// eslint-disable-line react-hooks/exhaustive-deps


    async function onSubmit(event: any) {
        event.preventDefault();
        setSpinner(true);
        const res: boolean = await loginFn(loginData);
        // TODO если вернулось тру и это без пароля, то показывать сообщение что отправлена ссыль
        if (!res) {
            alertMessage.current = 'Wrong credentials!';
            setAlert('error');
        } else if (!withPassword.current) {
            alertMessage.current = 'Email with link for login was successfully send.';
            setAlert('success');
        }

        setSpinner(false);
    }

    async function loginWithSocial(provider: SocialProvider): Promise<void> {
        setSpinner(true);
        const res: boolean = await loginFn({...loginData, provider});

        if (!res) {
            alertMessage.current = 'Wrong provider!';
            setAlert('error');
            setSpinner(false);
        }
    }

    function validateEmailFormat(email: string) {
        const template = /\S+@\S+\.\S+/;
        return template.test(email);
    }

    async function emailHandler(event: any) {
        const email = event.target.value;

        if (validateEmailFormat(email)) {
            withPassword.current = await isAdminsEmailFn(email);
        }

        setLoginData({...loginData, email});
    }

    function passwordHandler(event: any) {
        const password: string = event.target.value;
        errorMessage.current = passwordValidationFn(password);

        setLoginData({...loginData, password});
    }

    return <Container component="main" maxWidth="xs">
        <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={spinner}
            onClick={() => setSpinner(false)}
        >
            <CircularProgress color="inherit"/>
        </Backdrop>
        <CssBaseline/>
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{m: 1, bgcolor: alert ? 'error.main' : 'primary.main'}}>
                <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
                Login
            </Typography>
            <Collapse in={!!alert}>
                <Alert onClose={() => setAlert(undefined)} severity={alert}>{alertMessage.current}</Alert>
            </Collapse>
            <Box component="form" onSubmit={onSubmit} sx={{mt: 1}}>
                <TextField
                    margin="normal"
                    label="Email"
                    type="email"
                    fullWidth
                    onChange={emailHandler}
                />
                {withPassword.current && <TextField
                    margin="normal"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    error={!!errorMessage.current}
                    helperText={errorMessage.current}
                    fullWidth
                    onChange={passwordHandler}
                />}
                <Button
                    disabled={!flValid}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                >
                    Sign In
                </Button>
            </Box>
            {!withPassword.current && <Box sx={{display: 'flex', m: 2, alignItems: 'center'}}>
                <Typography>Or enter with: </Typography>
                <ButtonGroup variant="text" aria-label="text button group">
                    {socialAuthProviders.map(provider => (
                        <IconButton key={provider.name} onClick={() => loginWithSocial(provider)}>
                            {provider.icon}
                        </IconButton>
                    ))}
                </ButtonGroup>
            </Box>}
        </Box>
    </Container>
};

export default RegistrationAuthForm;