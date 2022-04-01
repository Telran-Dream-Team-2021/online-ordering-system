import AbstractDataProvider from "./abstract-data-provider";
import {
    collection,
    CollectionReference,
    doc,
    DocumentReference, DocumentSnapshot,
    getDoc,
    getFirestore,
    setDoc
} from "firebase/firestore";
import firebaseApp from "../config/fire-config";
import ErrorCode from "../models/common/error-code";
import {BasketData} from "../models/basket-data";
import {from, Observable} from "rxjs";
import {collectionData, docData} from "rxfire/firestore";
import {map} from "rxjs/operators";
import { ItemData } from "../models/item-data";
import {DocumentData} from "rxfire/firestore/interfaces";
import {ProductData} from "../models/product-data";


export default class BasketServiceFire extends AbstractDataProvider<BasketData> {
    fireCollection: CollectionReference;

    constructor(collectionName: string) {
        super();
        this.fireCollection = collection(getFirestore(firebaseApp), collectionName);
    }

    async exists(id: string): Promise<boolean> {
        const docRef: DocumentReference = doc(this.fireCollection, id.toString());
        const docSnap: DocumentSnapshot = await getDoc(docRef);
        return docSnap.exists();
    }

    async add(entity: BasketData): Promise<BasketData> {
        try {
            await setDoc(doc(this.fireCollection, entity.userId as string), entity);
        } catch (err) {
            throw ErrorCode.AUTH_ERROR;
        }
        return entity;
    }

    get(id?: string): Observable<BasketData[]> | Promise<BasketData> {
        if(id){
            const productDocRef = doc(this.fireCollection, id.toString());
            return getDoc(productDocRef).then(resp => resp.data() as BasketData)
        } else {
            throw new Error("not implement")
        }

    }

    getFirst(id: string | number): Observable<BasketData> {
        const docRef: DocumentReference = doc(this.fireCollection, id.toString())
        return docData(docRef) as Observable<BasketData>
    }

    async remove(id: string): Promise<BasketData> {
        const basket = (await getDoc(doc(this.fireCollection, id))).data() as BasketData;
        const newBasket = {
            ...basket, basketItems : [], userId: id
        }
        try {
            await setDoc(doc(this.fireCollection, id), newBasket);
        } catch (e) {
            throw ErrorCode.AUTH_ERROR;
        }
        return basket;
    }

    async update(id: string, newEntity: BasketData): Promise<BasketData> {
        try {
            await setDoc(doc(this.fireCollection, id), newEntity);
        } catch (e) {
            console.log('err')
            console.log(e)
            throw ErrorCode.AUTH_ERROR;
        }
        return newEntity;
    }

}