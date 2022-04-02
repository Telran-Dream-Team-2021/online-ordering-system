import {WsMessage} from "../../models/common/ws-message-type";
import {Observer} from "rxjs";

export default interface WsService<T> {
    connect(observer: Observer<T>): void;
    handleWsMessage(wsMessage: WsMessage, observer: Observer<T>): void;
    disconnect(): void;

    created(wsMessage: WsMessage, observer: Observer<T>): void;
    updated(wsMessage: WsMessage, observer: Observer<T>): void;
    removed(wsMessage: WsMessage, observer: Observer<T>): void;
}