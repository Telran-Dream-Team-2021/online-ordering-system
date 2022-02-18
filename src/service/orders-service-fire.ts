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
    getDoc,
    deleteDoc,
    query,
    where
} from "firebase/firestore";
import ErrorCode from "../models/common/error-code";
import {getUuidByOrder} from "../utils/uuid";
import {UserData} from "../models/common/user-data";

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
        console.log('add')
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
            deliveryDate: typeof order.deliveryDate !== "string" ? order.deliveryDate.toISOString(): order.deliveryDate,
            lastEditionDate: typeof order.lastEditionDate !== "string" ? order.lastEditionDate.toISOString(): order.lastEditionDate
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
        try{
            await setDoc(doc(this.fireCollection, id), this.convertOrder(newEntity))
        } catch (e) {
            console.log(e)
            throw ErrorCode.AUTH_ERROR
        }
        return oldOrderSnapshot
    }

    getFirst(id: string | number): Observable<OrderData> {
        throw new Error("not implements")
    }


}