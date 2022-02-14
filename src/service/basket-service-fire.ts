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
            await setDoc(doc(this.fireCollection, entity.userId), entity);
        } catch (err) {
            throw ErrorCode.AUTH_ERROR;
        }
        return entity;
    }

    get(id?: string): Promise<BasketData> {
        const basketDocRef = doc(this.fireCollection, id);
        return getDoc(basketDocRef).then(resp => resp.data() as BasketData);
    }

    async remove(id: string): Promise<BasketData> {
        const basket = (await getDoc(doc(this.fireCollection, id))).data() as BasketData;
        const newBasket = {
            basketItems: basket.basketItems = [], userId: id
        }
        try {
            await setDoc(doc(this.fireCollection, id), newBasket);
        } catch (e) {
            throw ErrorCode.AUTH_ERROR;
        }
        return basket;
    }

    async update(id: string, newEntity: BasketData): Promise<BasketData> {
        const oldBasketSnapshot = await this.get(id) as BasketData;
        try {
            await setDoc(doc(this.fireCollection, id), newEntity);
        } catch (e) {
            throw ErrorCode.AUTH_ERROR;
        }
        return oldBasketSnapshot;
    }

}