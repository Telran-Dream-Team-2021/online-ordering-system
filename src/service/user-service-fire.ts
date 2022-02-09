import AbstractDataProvider from "./abstract-data-provider";
import {UserData} from "../models/common/user-data";
import {Observable} from "rxjs";

export default class UserServiceFire extends AbstractDataProvider<UserData> {
    exists(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    add(entity: UserData): Promise<UserData> {
        throw new Error('Not implemented yet!')
    }

    get(id?: number): Observable<UserData[]> | Promise<UserData> {
        throw new Error('Not implemented yet!')
    }

    remove(id: number): Promise<UserData> {
        throw new Error('Not implemented yet!')
    }

    update(id: number, newEntity: UserData): Promise<UserData> {
        throw new Error('Not implemented yet!')
    }
}