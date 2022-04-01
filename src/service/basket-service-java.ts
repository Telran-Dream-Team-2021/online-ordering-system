import AbstractDataProvider from "./abstract-data-provider";
import {BasketData} from "../models/basket-data";
import {Observable, Observer} from "rxjs";
import {CompatClient, Stomp} from "@stomp/stompjs";

export default class BasketServiceJava extends AbstractDataProvider<BasketData> {
    private WEBSOCKET_MAPPING: string = "/websocket-oos/v1";
    private WEBSOCKET_BASKET_THEME: string = "/topics/baskets";

    private stompClient?: CompatClient;

    constructor(url: string, private wsUrl: string) {
        super(url);
    }

    async add(entity: BasketData): Promise<BasketData> {
        if (await this.exists(entity.userId as number)) {
            throw `Basket with id ${entity.userId} already exists`;
        }

        return this.query(undefined,"POST", entity).then(r => r.json());
    }

    async exists(id: number): Promise<boolean> {
        const response = await this.query(id);

        return response.ok;
    }

    get(id?: number): Observable<BasketData[]> | Promise<BasketData> {
        if(id) {
            return this.query(id).then(r => r.json());
        } else {
            throw new Error("Method not available");
        }
    }

    async remove(id: number): Promise<BasketData> {
        if(! await this.exists(id)) {
            throw `Basket with id ${id} does not exist`;
        }

        return this.query(id, "DELETE").then(r => r.json());
    }

    async update(id: number, newEntity: BasketData): Promise<BasketData> {
        if(! await this.exists(id)) {
            throw `Product with id ${id} does not exist`
        }

        return this.query(id, "PUT", newEntity).then(r => r.json());
    }

    private connect(observer: Observer<BasketData[]>) {
        const webSocket = new SockJS(`${this.wsUrl}${(this.WEBSOCKET_MAPPING)}`);
        this.stompClient = Stomp.over(webSocket);

        this.stompClient.connect(
            {},
            (frames: any) => {
                this.stompClient?.subscribe(this.WEBSOCKET_PRODUCT_THEME, message => {
                    let wsMessage: WsMessage = JSON.parse(message.body);
                    console.log(wsMessage);
                    this.handleWsMessage(wsMessage, observer);
                })
            },
            (error: any) => observer.error(error),
            () => observer.error("disconnected")
        )
    }

}