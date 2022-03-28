import {nonAuthorizedUser, UserData} from "../models/common/user-data";
import {Observable, Observer} from "rxjs";
import AuthServiceRest from "./auth-service-rest";
import AuthPayload from "../models/common/auth-payload";
import {AUTH_TOKEN} from "../config/services-config";

export default class AuthServiceJava extends AuthServiceRest {
    private observer: Observer<UserData> | undefined;

    getUserData(): Observable<UserData> {
        return new Observable<UserData>(observer => {
            const userData: UserData = this.fetchUserData();
            observer.next(userData);
            this.observer = observer;
        });
    }

    tokenToUserData(accessToken: string): UserData {
        let resUserData = nonAuthorizedUser;

        if (!!accessToken) {
            const ud = localStorage.getItem(accessToken);

            if (!!ud) {
                resUserData = JSON.parse(ud);
            }
        }

        return resUserData;
    }

    storeUserData(payload: AuthPayload): void {
        const email = this.parseEmail(payload.accessToken);

        const userData: UserData = {
            email: email || '',
            displayName: payload.displayName ?? email ?? 'User',
            isAdmin: payload.role === 'ADMIN',
            uid: payload.uid || '',
        };

        localStorage.setItem(AUTH_TOKEN, payload.accessToken);
        localStorage.setItem(payload.accessToken, JSON.stringify(userData));

        this.observer?.next(userData);
    }

    parseEmail(accessToken: string) {
        const Buffer = require('buffer/').Buffer;
        const rawPayload: string = accessToken.split('.')[1];
        const payload: any = JSON.parse(Buffer.from(rawPayload, 'base64').toString('ascii'));

        return payload.sub;
    }
}