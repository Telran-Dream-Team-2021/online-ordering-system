import {Observable} from "rxjs";
import {UserData} from "../models/common/user-data";
import {LoginData} from "../models/common/login-data";

export default interface AuthService {
    getUserData(): Observable<UserData>;
    login(loginData: LoginData): Promise<boolean>;
    loginWithSocial(loginData: LoginData): Promise<boolean>;
    logout(): Promise<boolean>;

    isLoginLink(): boolean;
    completeLogin(): Promise<boolean>;
    isAdminsEmail(email: string): Promise<boolean>;
}