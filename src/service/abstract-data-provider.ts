import DataProvider from "./data-provider";
import {Observable} from "rxjs";

export default abstract class AbstractDataProvider<T> implements DataProvider<T>{
    abstract add(entity: T): Promise<T>;

    abstract exists(id: number | string): Promise<boolean>;

    abstract get(id?: number | string): Observable<T[]> | Promise<T>;

    abstract remove(id: number | string): Promise<T>;

    abstract update(id: number | string, newEntity: T): Promise<T>;

    abstract getFirst(id: string | number): Observable<T>;
}