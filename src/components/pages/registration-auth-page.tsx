import React, {useState} from 'react';
import {LoginData} from "../../models/common/login-data";
import {Box} from "@mui/material";
import {authService} from "../../config/services-config";
import {PATH_LISTING} from "../../config/routes-config";
import authConfig from "../../config/auth-config.json";
import RegistrationAuthForm from "../common/registration-auth-form";
import {Navigate} from "react-router-dom";

const RegistrationAuthPage = () => {
    const [flNavigate, setFlNavigate] = useState(false);

    async function login(loginData: LoginData): Promise<boolean> {
        let res: boolean;

        if (!loginData.provider) {
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
        return await authService.isAdminsEmail(email);
    }

    return <Box sx={{m: 2}}>
        {flNavigate && <Navigate to={PATH_LISTING}/>}
        <RegistrationAuthForm
            loginFn={login}
            passwordValidationFn={passwordValidation}
            isAdminsEmailFn={isAdminsEmail}/>
    </Box>
};

export default RegistrationAuthPage;