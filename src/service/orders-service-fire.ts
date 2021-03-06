import AbstractDataProvider from "./abstract-data-provider";
import {catchError, Observable} from "rxjs";
import {OrderData} from "../models/order-data";
import {collectionData} from "rxfire/firestore";
import firebaseApp from "../config/fire-config";
import {
    CollectionReference,
    getFirestore,
    collection,
    doc,
    setDoc,
    deleteDoc,
    query,
    where
} from "firebase/firestore";
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
        entity.orderId = getUuidByOrder()
        console.log(entity)
        try{
            await setDoc(doc(this.fireCollection, entity.orderId as string), this.convertOrder(entity));
        } catch(err){
            console.log('error')
            console.log(err)
            throw ErrorCode.AUTH_ERROR
        }
        return entity
    }

    convertOrder(order: OrderData){
        return {...order,
            orderId: order.orderId,
            deliveryDate: order.deliveryDate.toISOString(),
            lastEditionDate: order.lastEditionDate.toISOString()
        }
    }

    get(id?: string): Observable<OrderData[]> | Promise<OrderData> {
        if(id) {
            return (collectionData(query(this.fireCollection, where("userId", "==", id.toString()))) as Observable<OrderData[]>).pipe(
                catchError(err => {
                    throw err.code ?  ErrorCode.AUTH_ERROR : ErrorCode.SERVER_UNAVAILABLE;
                })
            )
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
        if(newEntity.orderItems.length>0){
            try{
                await setDoc(doc(this.fireCollection, id), this.convertOrder(newEntity))
            } catch (e) {
                console.log(e)
                throw ErrorCode.AUTH_ERROR
            }
        } else {
            return this.remove(id)
        }

        return oldOrderSnapshot
    }

    getFirst(id: string | number): Observable<OrderData> {
        throw new Error("not implements")
    }


}