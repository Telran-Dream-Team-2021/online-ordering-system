import AbstractDataProvider from "./abstract-data-provider";
import {Observable} from "rxjs";
import {OrderData} from "../models/order-data";
import {collectionData} from "rxfire/firestore";
import firebaseApp from "../config/fire-config";
import {CollectionReference, getFirestore, collection } from "firebase/firestore";

export default class OrdersServiceFire extends AbstractDataProvider<OrderData> {
    fireCollection: CollectionReference;
    constructor(collectionName: string) {
        super();
        this.fireCollection = collection(getFirestore(firebaseApp), collectionName);
    }

    exists(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    add(entity: OrderData): Promise<OrderData> {
        throw new Error('Not implemented yet!')
    }

    get(id?: number): Observable<OrderData[]> | Promise<OrderData> {
        throw new Error('Not implemented yet!')
    }

    remove(id: number): Promise<OrderData> {
        throw new Error('Not implemented yet!')
    }

    update(id: number, newEntity: OrderData): Promise<OrderData> {
        throw new Error('Not implemented yet!')
    }
}