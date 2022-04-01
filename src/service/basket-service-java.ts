import AbstractDataProvider from "./abstract-data-provider";
import {BasketData, emptyBasket} from "../models/basket-data";
import {Observable, Observer} from "rxjs";
import {CompatClient, Stomp} from "@stomp/stompjs";
import {WsMessage} from "../models/common/ws-message-type";
import SockJS from "sockjs-client";

export default class BasketServiceJava extends AbstractDataProvider<BasketData> {
    private WEBSOCKET_BASKET_THEME: string = "/topics/baskets";

    private stompClient?: CompatClient;
    private basketCache: BasketData = emptyBasket;

    constructor(url: string, private wsUrl: string) {
        super(url);
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

    private connect(observer: Observer<BasketData>) {
        const webSocket = new SockJS(`${this.wsUrl}${(this.WEBSOCKET_MAPPING)}`);
        this.stompClient = Stomp.over(webSocket);

        this.stompClient.connect(
            {},
            () => {
                this.stompClient?.subscribe(this.WEBSOCKET_BASKET_THEME, message => {
                    let wsMessage: WsMessage = JSON.parse(message.body);
                    this.handleWsMessage(wsMessage, observer);
                })
            },
            (error: any) => observer.error(error),
            () => observer.error("disconnected")
        );
    }

    private handleWsMessage(wsMessage: WsMessage, observer: Observer<BasketData>): void {
        switch (wsMessage.action) {
            case "created":
            case "updated":
                (this.get(wsMessage.entityId) as Promise<BasketData>)
                    .then(createdBasketData => {
                        this.basketCache = createdBasketData;
                        observer.next(this.basketCache);
                    });
                break;
            case "removed":
                this.basketCache = emptyBasket;
                observer.next(this.basketCache);
                break;
        }
    }

    private disconnect() {
        this.stompClient?.disconnect();
    }
}