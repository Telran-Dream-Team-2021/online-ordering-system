import DataProvider from "./data-provider";
import {Observable} from "rxjs";

export default abstract class AbstractDataProvider<T> implements DataProvider<T>{
    abstract add(entity: T): Promise<T>;

    abstract exists(id: number): Promise<boolean>;

    abstract get(id?: number): Observable<T[]> | Promise<T>;

    abstract remove(id: number): Promise<T>;

    abstract update(id: number, newEntity: T): Promise<T>;
}