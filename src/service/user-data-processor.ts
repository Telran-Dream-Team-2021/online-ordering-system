import DataProvider from "./data-provider";
import {UserData} from "../models/common/user-data";
import AuthService from "./auth-service";
import {from, mergeMap, Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import {authService} from "../config/services-config";

export default class UserDataProcessor {
    constructor(private authService: AuthService, private userService: DataProvider<UserData>) {
    }

    private static mergeUserData(userData: UserData, user: UserData): UserData {
        return !user ? userData : {...user, isAdmin: userData.isAdmin};
    }

    getUserData(): Observable<UserData> {
        return this.authService.getUserData()
            .pipe(mergeMap(userData => {
                console.log(userData, 'getUserData');
                if (!!userData.username) {
                    return from(this.userService.get(userData.username) as Promise<UserData>)
                        .pipe(map(user => {
                            return UserDataProcessor.mergeUserData(userData, user);
                        }));
                }

                return of(userData);
            }));
        // .pipe(mergeMap(userData => {
        //     if (!!userData.username) {
        //         return this.userService.getFirst(userData.username)
        //             .pipe(map(user => UserDataProcessor.mergeUserData(userData, user)))
        //     }
        //
        //     return of(userData);
        // }));
    }

    async updateData(newUserData: UserData): Promise<UserData> {
        const user: any = this.userService.get(newUserData.username);
        let userData: UserData;

        if (!user) {
            userData = await this.userService.add(newUserData);
        } else {
            userData = await this.userService.update(newUserData.username, newUserData);
        }

        return UserDataProcessor.mergeUserData(userData, user);
    }

    async logout() {
        return await authService.logout();
    }
}