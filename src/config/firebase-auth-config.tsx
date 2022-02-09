import {FacebookAuthProvider, GoogleAuthProvider} from "firebase/auth";
import React from "react";
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

export type SocialProvider = {
    name: string,
    class: any,
    icon: React.ReactNode
}

const socialAuthProviders: SocialProvider[] = [
    {name: "google", class: GoogleAuthProvider, icon: <GoogleIcon/>},
    {name: "facebook", class: FacebookAuthProvider, icon: <FacebookIcon/>},
];

export default socialAuthProviders;