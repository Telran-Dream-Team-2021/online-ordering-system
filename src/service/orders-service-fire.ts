import AbstractDataProvider from "./abstract-data-provider";
import {catchError, Observable} from "rxjs";
import {OrderData} from "../models/order-data";
import {collectionData} from "rxfire/firestore";
import firebaseApp from "../config/fire-config";
import {CollectionReference, getFirestore, collection, doc, setDoc, getDoc, deleteDoc} from "firebase/firestore";
import ErrorCode from "../models/common/error-code";
import {getUuidByOrder} from "../utils/uuid";

export default class OrdersServiceFire extends AbstractDataProvider<OrderData> {
    fireCollection: CollectionReference;
    constructor(collectionName: string) {
        super();
        this.fireCollection = collection(getFirestore(firebaseApp), collectionName);
    }

    exists(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async add(entity: OrderData): Promise<OrderData> {
        const orderId = getUuidByOrder()

        try{
            await setDoc(doc(this.fireCollection, orderId as string), {...entity,
                orderId,
                deliveryDate: entity.deliveryDate.toISOString(),
                lastEditionDate: entity.lastEditionDate.toISOString()
            });
        } catch(err){
            throw ErrorCode.AUTH_ERROR
        }
        return entity
    }

    get(id?: string): Observable<OrderData[]> | Promise<OrderData> {
        if(id) {
            const productDocRef = doc(this.fireCollection, id);
            return getDoc(productDocRef).then(resp => resp.data() as OrderData)
        } else {
            return (collectionData(this.fireCollection) as Observable<OrderData[]>).pipe(
                catchError(err => {
                    throw err.code ?  ErrorCode.AUTH_ERROR : ErrorCode.SERVER_UNAVAILABLE;
                })
            )
        }
    }

    async remove(id: string): Promise<OrderData> {
        const orderDocRef = doc(this.fireCollection, id)
        const orderSnapshot = await this.get(id) as OrderData
        try{
            await deleteDoc(orderDocRef)
        } catch (e) {
            throw ErrorCode.AUTH_ERROR
        }
        return orderSnapshot
    }

    async update(id: string, newEntity: OrderData): Promise<OrderData> {
        const oldOrderSnapshot = await this.get(id) as OrderData
        try{
            await setDoc(doc(this.fireCollection, id), newEntity)
        } catch (e) {
            throw ErrorCode.AUTH_ERROR
        }
        return oldOrderSnapshot
    }


}