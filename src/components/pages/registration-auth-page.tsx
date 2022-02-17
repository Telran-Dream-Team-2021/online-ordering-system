import React, {useState} from 'react';
import {LoginData} from "../../models/common/login-data";
import {Box, Button, Typography} from "@mui/material";
import {authService} from "../../config/services-config";
import {PATH_LISTING} from "../../config/routes-config";
import authConfig from "../../config/auth-config.json";
import RegistrationAuthForm from "../common/registration-auth-form";
import {Navigate} from "react-router-dom";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const RegistrationAuthPage = () => {
    const [flNavigate, setFlNavigate] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [emailSent, setEmailSent] = useState<boolean>(false);

    async function login(loginData: LoginData): Promise<boolean> {
        let res: boolean;

        if (!loginData.provider) {//TODO dispatch
            res = await authService.login(loginData);
        } else {
            res = await authService.loginWithSocial(loginData);
        }

        if (res && (!!loginData.provider || !!loginData.password)) {
            setFlNavigate(true);
        }

        return res;
    }

    function passwordValidation(password: string): string {
        if (password.length < authConfig.minPasswordLength) {
            return `Length of password can't be less than ${authConfig.minPasswordLength}`;
        }

        return '';
    }

    async function isAdminsEmail(email: string): Promise<boolean> {
        const res = await authService.isAdminsEmail(email);
        setIsAdmin(res);
        return res;
    }

    return <Box>{emailSent
        ? <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '90vh'
        }}>
            <Typography variant="h2">
                GOOD JOB!
                <ThumbUpIcon sx={{color: "primary.main", fontSize: 'inherit', mx: 2, verticalAlign: 'text-top'}}/>
                <br/>
                NOW VERIFY YOUR EMAIL
            </Typography>
        </Box>
        : <Box sx={{
            backgroundImage: "url('/login-bg.png')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: '60vw',
            position: 'relative',
            height: '100vh'
        }}>
            <Box sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '60vw',
                backgroundColor: !isAdmin ? 'primary.light' : 'secondary.light',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                borderRadius: '40vh 0 0 40vh',
            }}>
                <Button sx={{float: 'right', fontSize: '1.5rem', m: '2vw'}} variant="text"
                        onClick={() => setFlNavigate(true)}>Catalog</Button>
            </Box>
            {flNavigate && <Navigate to={PATH_LISTING}/>}
            <RegistrationAuthForm
                loginFn={login}
                sentFn={() => setEmailSent(true)}
                passwordValidationFn={passwordValidation}
                isAdminsEmailFn={isAdminsEmail}/>
        </Box>}
    </Box>
};

export default RegistrationAuthPage;