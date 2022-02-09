import AbstractDataProvider from "./abstract-data-provider";
import {ProductData} from "../models/product-data";
import { Observable } from "rxjs";
import {collectionData} from "rxfire/firestore";
import firebaseApp from "../config/fire-config";
import {CollectionReference, getFirestore, collection } from "firebase/firestore";


export default class ProductServiceFire extends AbstractDataProvider<ProductData> {
    fireCollection: CollectionReference;
    constructor(collectionName: string) {
        super();
        this.fireCollection = collection(getFirestore(firebaseApp), collectionName);
    }

    add(entity: ProductData): Promise<ProductData> {
        throw new Error("Method not implemented.");
    }
    exists(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    get(id?: number): Promise<ProductData> | Observable<ProductData[]> {
        throw new Error("Method not implemented.");
    }
    remove(id: number): Promise<ProductData> {
        throw new Error("Method not implemented.");
    }
    update(id: number, newEntity: ProductData): Promise<ProductData> {
        throw new Error("Method not implemented.");
    }
}