import AbstractDataProvider from "./abstract-data-provider";
import {UserData} from "../models/common/user-data";
import {Observable} from "rxjs";

export default class UserServiceFire extends AbstractDataProvider<UserData> {
    exists(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    add(entity: UserData): Promise<UserData> {
        throw new Error('Not implemented yet!')
    }

    get(id?: string): Observable<UserData[]> | Promise<UserData> {
        throw new Error('Not implemented yet!')
    }

    remove(id: string): Promise<UserData> {
        throw new Error('Not implemented yet!')
    }

    update(id: string, newEntity: UserData): Promise<UserData> {
        throw new Error('Not implemented yet!')
    }
}