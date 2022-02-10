import AbstractDataProvider from "./abstract-data-provider";
import {ProductData} from "../models/product-data";
import {catchError, Observable} from "rxjs";
import {collectionData} from "rxfire/firestore";
import firebaseApp from "../config/fire-config";
import {CollectionReference, getFirestore, collection, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import ErrorCode from "../models/common/error-code";


export default class ProductServiceFire extends AbstractDataProvider<ProductData> {
    fireCollection: CollectionReference;
    constructor(collectionName: string) {
        super();
        this.fireCollection = collection(getFirestore(firebaseApp), collectionName);
    }
    async add(entity: ProductData): Promise<ProductData> {
        if(await this.exists(entity.productId as string)) {
            throw `Product with id ${entity.productId} already exists`
        }
        const productDocRef = doc(this.fireCollection, entity.productId as string);
        try {
            await setDoc(productDocRef, entity);
        } catch (e) {
            throw ErrorCode.AUTH_ERROR;
        }
        return entity;
    }
    async exists(id: string): Promise<boolean> {
        const productDocRef = doc(this.fireCollection, id);
        const productDocSnap = await getDoc(productDocRef);
        return productDocSnap.exists();
    }
    get(id?: string): Promise<ProductData> | Observable<ProductData[]> {
        if(id) {
            const productDocRef = doc(this.fireCollection, id);
            return getDoc(productDocRef).then(resp => resp.data() as ProductData)
        } else {
           return (collectionData(this.fireCollection) as Observable<ProductData[]>).pipe(
                catchError(err => {
                    throw err.code ?  ErrorCode.AUTH_ERROR : ErrorCode.SERVER_UNAVAILABLE;
                })
            )
        }
    }
    async remove(id: string): Promise<ProductData> {
        const productDocRef = doc(this.fireCollection, id);
        const productSnapshot = await this.get(id) as ProductData;
        try {
            await deleteDoc(productDocRef);
        } catch (e) {
            throw ErrorCode.AUTH_ERROR;
        }
        return productSnapshot;
    }
    async update(id: string, newEntity: ProductData): Promise<ProductData> {
        const productDocRef = doc(this.fireCollection, id);
        const oldProductSnapshot = await this.get(id) as ProductData;
        try {
            await setDoc(productDocRef, newEntity);
        } catch(e) {
            throw ErrorCode.AUTH_ERROR;
        }
        return oldProductSnapshot;
    }
}