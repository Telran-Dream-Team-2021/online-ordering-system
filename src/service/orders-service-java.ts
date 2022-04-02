import AbstractDataProvider from "./abstract-data-provider";
import {OrderData} from "../models/order-data";
import {Observable, Observer} from "rxjs";
import {CompatClient, Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {WsMessage} from "../models/common/ws-message-type";


export default class OrdersServiceJava extends AbstractDataProvider<OrderData>{
    private WEBSOCKET_PRODUCT_THEME: string = "/topics/orders";
    private ordersCache: OrderData[] = [];
    stompClient: CompatClient | undefined;

    constructor(url: string, private wsUrl: string) {
        super(url);
    }

    add(entity: OrderData): Promise<OrderData> {
        return this.query(undefined, "POST", entity).then(r => r.json());
    }

    async exists(id: number | string): Promise<boolean> {
        const response = await this.query(id as number);
        return response.ok;
    }

    get(id: number | string | undefined): Observable<OrderData[]> | Promise<OrderData> {

        return (new Observable<OrderData[]>(observer => {
                this.fetchData(observer, id as number);
                this.connect(observer);
                return () => {this.disconnect()};
            })
        )

    }

    async remove(id: number | string): Promise<OrderData> {
        if(! await this.exists(id)) {
            throw `Order with id ${id} does not exist`
        }
        return this.query(id as number, "DELETE").then(r => r.json());
    }

    async update(id: number | string, newEntity: OrderData): Promise<OrderData> {
        if(! await this.exists(id)) {
            throw `Order with id ${id} does not exist`
        }
        return this.query(id as number, "PUT", newEntity).then(r => r.json());
    }

    private fetchData(observer: Observer<OrderData[]>, id?: number) {
        this.query(id)
            .then(r => r.json())
            .then(data => {
                if (this.ordersCache != data) {
                    observer.next(data);
                    this.ordersCache = data;
                }
            })
            .catch(err => observer.error(err));

    }

    private connect(observer: Observer<OrderData[]>) {
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

    private handleWsMessage(wsMessage: WsMessage,observer: Observer<OrderData[]>): void {
        switch (wsMessage.action) {
            case "created": {
                (this.get(wsMessage.entityId) as Promise<OrderData>)
                    .then(createdOrderData => {
                        this.ordersCache.push(createdOrderData);
                        observer.next([...this.ordersCache]);
                    })
                break;
            }
            case "updated": {
                (this.get(wsMessage.entityId) as Promise<OrderData>)
                    .then(createdOrderData => {
                        const index = this.ordersCache.findIndex(order => order.orderId == wsMessage.entityId);
                        if (index >= 0) {
                            this.ordersCache[index] = createdOrderData;
                            observer.next([...this.ordersCache]);
                        }
                    })
                break;
            }
            case "removed": {
                const index = this.ordersCache.findIndex(order => order.orderId == wsMessage.entityId);
                if (index >= 0) {
                    this.ordersCache.splice(index, 1);
                    observer.next([...this.ordersCache]);
                }
                break;
            }
        }
    }

    private disconnect() {
        this.stompClient?.disconnect();
    }

}