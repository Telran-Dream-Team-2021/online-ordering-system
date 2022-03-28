import AbstractDataProvider from "./abstract-data-provider";
import {UserData} from "../models/common/user-data";
import {Observable} from "rxjs";

export default class UserServiceJava extends AbstractDataProvider<UserData> {
    add(entity: UserData): Promise<UserData> {
        return this.query(undefined, "POST", entity).then(r => r.json());
    }

    async exists(id: number | string): Promise<boolean> {
        const response = await this.query(id as number);
        return response.ok;
    }

    get(id?: number | string): Observable<UserData[]> | Promise<UserData> {
        if (id) {
            return this.query(id as number).then(r => r.json());
        }

        throw new Error('Illegal argument.');
    }

    async remove(id: number | string): Promise<UserData> {
        throw new Error('Unusable method.');
    }

    async update(id: number | string, newEntity: UserData): Promise<UserData> {
        const oldEntity = await this.get(id);
        await this.query(id as number, "PUT", newEntity);

        return oldEntity as UserData;
    }

}