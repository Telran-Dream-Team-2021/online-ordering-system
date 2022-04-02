import {BasketData, emptyBasket} from "../models/basket-data";
import {Observable, Observer} from "rxjs";
import {WsMessage} from "../models/common/ws-message-type";
import WsServiceAbstract from "./messaging/ws-service-abstract";

const WEBSOCKET_BASKET_THEME: string = "/topics/baskets";

export default class BasketServiceJava extends WsServiceAbstract<BasketData> {
    private basketCache: BasketData = emptyBasket;

    constructor(url: string, wsUrl: string) {
        super(wsUrl, WEBSOCKET_BASKET_THEME, (id) => this.get(id) as Promise<BasketData>, url);
    }

    async add(entity: BasketData): Promise<BasketData> {
        if (await this.exists(entity.userId as number)) {
            throw new Error(`Basket with id ${entity.userId} already exists`);
        }

        return this.query(undefined, "POST", entity).then(r => r.json());
    }

    async exists(id: number): Promise<boolean> {
        const response = await this.query(id);

        return response.ok;
    }

    get(id?: number): Observable<BasketData[]> | Promise<BasketData> {
        if (id) {
            return this.query(id).then(r => {
                return r.ok ? r.json() : emptyBasket;
            });
        } else {
            throw new Error("Method not available");
        }
    }

    getFirst(id: number): Observable<BasketData> {
        return (new Observable<BasketData>(observer => {
            this.query(id)
                .then(r => r.json())
                .then(data => {
                    if (!data.message && this.basketCache !== data) {
                        observer.next(data);
                        this.basketCache = data;
                    }
                })
                .catch(err => observer.error(err));

            this.connect(observer);

            return () => {
                this.disconnect()
            };
        }));
    }

    async remove(id: number): Promise<BasketData> {
        if (!await this.exists(id)) {
            throw new Error(`Basket with id ${id} does not exist`);
        }

        return this.query(id, "DELETE").then(r => r.json());
    }

    async update(id: number, newEntity: BasketData): Promise<BasketData> {
        if (!await this.exists(id)) {
            throw new Error(`Product with id ${id} does not exist`);
        }

        return this.query(id, "PUT", newEntity).then(r => r.json());
    }

    created(wsMessage: WsMessage, observer: Observer<BasketData>) {
        this.updated(wsMessage, observer);
    }

    updated(wsMessage: WsMessage, observer: Observer<BasketData>) {
        (this.get(wsMessage.entityId) as Promise<BasketData>)
            .then(createdBasketData => {
                this.basketCache = createdBasketData;
                observer.next(this.basketCache);
            });
    }

    removed(wsMessage: WsMessage, observer: Observer<BasketData>) {
        this.basketCache = emptyBasket;
        observer.next(this.basketCache);
    }
}