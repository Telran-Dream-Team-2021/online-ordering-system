import {SocialProvider} from "../../config/firebase-auth-config";

export type LoginData = {
    email: string,
    password: string,
    provider?: SocialProvider
}