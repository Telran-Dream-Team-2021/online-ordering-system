import React, {useEffect, useRef, useState} from 'react';
import {LoginData} from "../../models/common/login-data";
import {
    Alert,
    AlertColor,
    Box,
    Button,
    ButtonGroup,
    Collapse,
    Container,
    CssBaseline,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import socialAuthProviders, {SocialProvider} from "../../config/firebase-auth-config";
import Spinner from "./spinner";
import {useSelector} from "react-redux";
import {errorCodeSelector} from "../../redux/store";
import ErrorCode from "../../models/common/error-code";

type RegistrationAuthType = {
    loginFn: (loginData: LoginData) => Promise<void>,
    isAdminsEmailFn: (email: string) => Promise<boolean>,
    passwordValidationFn: (password: string) => string,
    sentFn: () => void,
}

const initialLoginData: LoginData = {email: '', password: ''};

const RegistrationAuthForm: React.FC<RegistrationAuthType> = (props) => {
    const {loginFn, passwordValidationFn, isAdminsEmailFn, sentFn} = props;
    const [loginData, setLoginData] = useState<LoginData>(initialLoginData);
    const errorMessage = useRef<string>('');
    const [flValid, setValid] = useState<boolean>(false);
    const [alert, setAlert] = useState<AlertColor>();
    const [spinner, setSpinner] = useState(false);
    const withPassword = useRef<boolean>(false);
    const alertMessage = useRef<string>('');
    const error = useSelector((errorCodeSelector));

    useEffect(() => {
        if (error === ErrorCode.AUTH_ERROR) {
            alertMessage.current = 'Wrong credentials!';
            setAlert('error');
            setSpinner(false);
        } else if (error === ErrorCode.NO_ERROR) {
            alertMessage.current = '';
        }
    }, [error])

    useEffect(() => {
        setValid(validateEmailFormat(loginData.email) && (!withPassword.current || !passwordValidationFn(loginData.password)));
    }, [loginData]);// eslint-disable-line react-hooks/exhaustive-deps


    async function onSubmit(event: any) {
        event.preventDefault();
        setSpinner(true);

        await loginFn(loginData);

        if (!withPassword.current) {
            sentFn();
        }

        setSpinner(false);
    }

    async function loginWithSocial(provider: SocialProvider): Promise<void> {
        setSpinner(true);

        await loginFn({...loginData, provider});
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

    return <Container sx={{
        marginLeft: '55vw',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center'
    }} component="main" maxWidth="xs">
        <Spinner open={spinner} onClickFn={() => setSpinner(false)}/>
        <CssBaseline/>
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography component="h1" variant="h3">
                {!withPassword.current ? 'Enter your Email' : 'Enter your Password'}
            </Typography>
            <Collapse in={!!alert}>
                <Alert sx={{'& .MuiAlert-message': {zIndex: 1}}}
                       onClose={() => setAlert(undefined)} severity={alert}>{alertMessage.current}</Alert>
            </Collapse>
            <Box component="form" onSubmit={onSubmit} sx={{mt: 1}}>
                <TextField
                    margin="normal"
                    variant="standard"
                    label="Email"
                    type="email"
                    fullWidth
                    onChange={emailHandler}
                />
                {withPassword.current && <TextField
                    variant="standard"
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
                    color={!withPassword.current ? 'primary' : 'secondary'}
                    sx={{mt: 3, mb: 2, justifyContent: 'start'}}
                >
                    Send
                </Button>
            </Box>
            {!withPassword.current && <Box sx={{display: 'flex', my: 2, alignItems: 'center'}}>
                <ButtonGroup variant="text" aria-label="text button group"
                             sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
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