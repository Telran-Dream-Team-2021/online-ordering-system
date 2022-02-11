import {FacebookAuthProvider, GoogleAuthProvider, GithubAuthProvider} from "firebase/auth";
import React from "react";
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';

export type SocialProvider = {
    name: string,
    class: any,
    icon: React.ReactNode
}

const socialAuthProviders: SocialProvider[] = [
    {name: "google", class: GoogleAuthProvider, icon: <GoogleIcon/>},
    {name: "facebook", class: FacebookAuthProvider, icon: <FacebookIcon/>},
    {name: "github", class: GithubAuthProvider, icon: <GitHubIcon/>},
];

export default socialAuthProviders;