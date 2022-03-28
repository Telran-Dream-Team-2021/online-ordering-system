import AuthService from "./auth-service";
import {LoginData} from "../models/common/login-data";
import {nonAuthorizedUser, UserData} from "../models/common/user-data";
import {Observable} from "rxjs";
import AuthPayload from "../models/common/auth-payload";
import {AUTH_TOKEN} from "../config/services-config";

export default abstract class AuthServiceRest implements AuthService {
    public constructor(private url: string) {
    }

    completeLogin(): Promise<boolean> {
        return Promise.resolve(false);
    }

    isAdminsEmail(email: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    isLoginLink(): boolean {
        return false;
    }

    abstract getUserData(): Observable<UserData>;

    /**
     * Transform accessToken from string to UserData object
     *
     * @param accessToken
     */
    abstract tokenToUserData(accessToken: string): UserData;

    abstract storeUserData(payload: AuthPayload): void;

    /**
     * Gets accessToken from localStorage
     *
     * @protected
     */
    protected fetchUserData(): UserData {
        const token: string | null = localStorage.getItem(AUTH_TOKEN);

        return !token ? nonAuthorizedUser : this.tokenToUserData(token);
    }

    async login(loginData: LoginData): Promise<boolean> {
        let res = false;
        const response = await fetch(`${this.url}/login`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const payload = await response.json();
            this.storeUserData(payload);
            res = true;
        }

        return res;
    }

    loginWithSocial(loginData: LoginData): Promise<boolean> {
        throw new Error("Social authentication is prohibited in this implementation.")
    }

    logout(): Promise<boolean> {
        localStorage.clear();

        return Promise.resolve(true);
    }
}