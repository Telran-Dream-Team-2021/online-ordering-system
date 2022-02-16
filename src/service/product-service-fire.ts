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
        if(await this.exists(entity.productId as number)) {
            throw `Product with id ${entity.productId} already exists`
        }
        const productDocRef = doc(this.fireCollection, entity.productId.toString());
        try {
            await setDoc(productDocRef, entity);
        } catch (e) {
            throw ErrorCode.AUTH_ERROR;
        }
        return entity;
    }
    async exists(id: number): Promise<boolean> {
        const productDocRef = doc(this.fireCollection, id.toString());
        const productDocSnap = await getDoc(productDocRef);
        return productDocSnap.exists();
    }
    get(id?: number): Promise<ProductData> | Observable<ProductData[]> {
        if(id) {
            const productDocRef = doc(this.fireCollection, id.toString());
            return getDoc(productDocRef).then(resp => resp.data() as ProductData)
        } else {
           return (collectionData(this.fireCollection) as Observable<ProductData[]>).pipe(
                catchError(err => {
                    throw err.code ?  ErrorCode.AUTH_ERROR : ErrorCode.SERVER_UNAVAILABLE;
                })
            )
        }
    }
    async remove(id: number): Promise<ProductData> {
        const productDocRef = doc(this.fireCollection, id.toString());
        const productSnapshot = await this.get(id) as ProductData;
        try {
            await deleteDoc(productDocRef);
        } catch (e) {
            throw ErrorCode.AUTH_ERROR;
        }
        return productSnapshot;
    }
    async update(id: number, newEntity: ProductData): Promise<ProductData> {
        console.log(id);
        console.log(newEntity);

        const productDocRef = doc(this.fireCollection, id.toString());
        const oldProductSnapshot = await this.get(id) as ProductData;
        try {
            await setDoc(productDocRef, newEntity);
        } catch(e) {
            throw ErrorCode.AUTH_ERROR;
        }
        return oldProductSnapshot;
    }
}