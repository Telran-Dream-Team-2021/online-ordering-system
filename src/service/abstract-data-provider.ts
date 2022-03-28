import DataProvider from "./data-provider";
import {Observable} from "rxjs";
import ErrorCode from "../models/common/error-code";
import {AUTH_TOKEN} from "../config/services-config";

export default abstract class AbstractDataProvider<T> implements DataProvider<T>{
    public constructor(protected url?: string) {}

    abstract add(entity: T): Promise<T>;

    abstract exists(id: number | string): Promise<boolean>;

    abstract get(id?: number | string): Observable<T[]> | Promise<T>;

    abstract remove(id: number | string): Promise<T>;

    abstract update(id: number | string, newEntity: T): Promise<T>;

    getFirst(id: number | string): Observable<T> {
        throw new Error('Method is not implemented');
    }

    protected getHeaders(): HeadersInit {
        return {
            "Authorization": "" + localStorage.getItem(AUTH_TOKEN),
            "Content-Type": "application/json"
        };
    }

    protected async query(id?: number, method?: string, data?: any): Promise<Response> {
        if (!this.url) {
            throw new Error('url must be not empty');
        }

        const url: RequestInfo = id !== undefined ? this.getUrlId(id) : this.url;
        const queryParams: RequestInit = {
            headers: this.getHeaders()
        };

        if (method !== undefined) {
            queryParams.method = method;
        }

        if (data !== undefined) {
            queryParams.body = JSON.stringify(data);
        }

        const response = await fetch(url, queryParams);

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem(AUTH_TOKEN);
            throw ErrorCode.AUTH_ERROR;
        }

        return response;
    }

    protected getUrlId(id: number) {
        return `${this.url}/${id}`;
    }
}