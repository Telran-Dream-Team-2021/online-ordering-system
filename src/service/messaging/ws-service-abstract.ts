import WsService from "./ws-service";
import {CompatClient, Stomp} from "@stomp/stompjs";
import {WsMessage} from "../../models/common/ws-message-type";
import {Observer} from "rxjs";
import SockJS from "sockjs-client";
import AbstractDataProvider from "../abstract-data-provider";

export default abstract class WsServiceAbstract<T> extends AbstractDataProvider<T> implements WsService<T> {
    private stompClient?: CompatClient;
    constructor(
        protected wsUrl: string,
        protected theme: string,
        protected getFn: (id?: number) => Promise<T>,
        protected url?: string) {
        super(url);
    }

    connect(observer: Observer<T>): void {
        const webSocket = new SockJS(this.wsUrl);
        this.stompClient = Stomp.over(webSocket);

        this.stompClient.connect(
            {},
            () => {
                this.stompClient?.subscribe(this.theme, message => {
                    let wsMessage: WsMessage = JSON.parse(message.body);
                    this.handleWsMessage(wsMessage, observer);
                })
            },
            (error: any) => observer.error(error),
            () => observer.error("disconnected")
        );
    }


    disconnect(): void {
        this.stompClient?.disconnect();
    }

    handleWsMessage(wsMessage: WsMessage, observer: Observer<T>): void {
        if (!!(this as any)[wsMessage.action]) {
            (this as any)[wsMessage.action](wsMessage, observer);
        }
    }

    abstract created(wsMessage: WsMessage, observer: Observer<T>): void;

    abstract removed(wsMessage: WsMessage, observer: Observer<T>): void;

    abstract updated(wsMessage: WsMessage, observer: Observer<T>): void;

}