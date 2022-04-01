import AbstractDataProvider from "./abstract-data-provider";
import {ProductData} from "../models/product-data";
import {catchError, Observable, Observer} from "rxjs";
import {CompatClient, Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {WsMessage} from "../models/common/ws-message-type";


export default class ProductServiceJava extends AbstractDataProvider<ProductData> {
    private WEBSOCKET_PRODUCT_THEME: string = "/topics/products";

    private productsCache: ProductData[] = [];
    stompClient: CompatClient | undefined;

    constructor(url: string, private wsUrl: string) {
        super(url);
    }
    async add(entity: ProductData): Promise<ProductData> {
        if(await this.exists(entity.productId as number)) {
            throw `Product with id ${entity.productId} already exists`
        }
        console.log("done")
        console.log(entity)
        return this.query(undefined,"POST", entity).then(r => r.json());
    }

    async exists(id: number): Promise<boolean> {
        const response = await this.query(id);
        return response.ok;
    }
    get(id?: number): Promise<ProductData> | Observable<ProductData[]> {
        if(id) {
            return this.query(id).then(r => r.json());
        } else {
           return (new Observable<ProductData[]>(observer => {
                   this.fetchData(observer);
                   this.connect(observer);
                   return () => {this.disconnect()};
               })
           )
        }
    }

    async remove(id: number): Promise<ProductData> {
        if(! await this.exists(id)) {
            throw `Product with id ${id} does not exist`
        }
        return this.query(id, "DELETE").then(r => r.json());
    }

    async update(id: number, newEntity: ProductData): Promise<ProductData> {
        console.log(id);
        console.log(newEntity);
        if(! await this.exists(id)) {
            throw `Product with id ${id} does not exist`
        }
        return this.query(id, "PUT", newEntity).then(r => r.json());
    }

    private fetchData(observer: Observer<ProductData[]>) {
        this.query()
            .then(r => r.json())
            .then(data => {
                if (this.productsCache != data) {
                    observer.next(data);
                    this.productsCache = data;
                }
            })
            .catch(err => observer.error(err));

    }

    private connect(observer: Observer<ProductData[]>) {
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

   private handleWsMessage(wsMessage: WsMessage,observer: Observer<ProductData[]>): void {
        switch (wsMessage.action) {
            case "created": {
                (this.get(wsMessage.entityId) as Promise<ProductData>)
                    .then(createdProductData => {
                        this.productsCache.push(createdProductData);
                        observer.next([...this.productsCache]);
                    })
                break;
            }
            case "updated": {
                (this.get(wsMessage.entityId) as Promise<ProductData>)
                    .then(createdProductData => {
                        const index = this.productsCache.findIndex(product => product.productId == wsMessage.entityId);
                        if (index >= 0) {
                            this.productsCache[index] = createdProductData;
                            observer.next([...this.productsCache]);
                        }
                    })
                break;
            }
            case "removed": {
                const index = this.productsCache.findIndex(product => product.productId == wsMessage.entityId);
                if (index >= 0) {
                    this.productsCache.splice(index, 1);
                    observer.next([...this.productsCache]);
                }
                break;
            }
        }
    }

    private disconnect() {
        this.stompClient?.disconnect();
    }
}