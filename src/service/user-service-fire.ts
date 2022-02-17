import AbstractDataProvider from "./abstract-data-provider";
import {UserData} from "../models/common/user-data";
import {Observable} from "rxjs";
import firebaseApp from "../config/fire-config";
import {
    CollectionReference,
    getFirestore,
    collection,
    DocumentReference,
    doc,
    DocumentSnapshot, getDoc, setDoc
} from "firebase/firestore";
import ErrorCode from "../models/common/error-code";
import {docData} from "rxfire/firestore";

export default class UserServiceFire extends AbstractDataProvider<UserData> {
    private readonly fireCollection: CollectionReference;

    constructor(private collectionName: string) {
        super();
        this.fireCollection = collection(getFirestore(firebaseApp), this.collectionName);
    }

    async exists(id: string): Promise<boolean> {
        const docRef: DocumentReference = doc(this.fireCollection, id.toString());
        const docSnap: DocumentSnapshot = await getDoc(docRef);

        return docSnap.exists();
    }

    async add(entity: UserData): Promise<UserData> {
        try {
            const id = entity.username;
            await setDoc(doc(this.fireCollection, id), entity);

            return entity;
        } catch (e) {
            throw ErrorCode.AUTH_ERROR;
        }
    }

    get(id?: string): Observable<UserData[]> | Promise<UserData> {
        if (!!id) {
            const docRef: DocumentReference = doc(this.fireCollection, id.toString());

            return getDoc(docRef).then(docSnap => docSnap.data() as UserData);
        }

        throw new Error('Illegal argument.');
    }

    getFirst(id: number | string): Observable<UserData> {
        const docRef: DocumentReference = doc(this.fireCollection, id.toString());

        return docData(docRef) as Observable<UserData>;
    }

    remove(id: string): Promise<UserData> {
        throw new Error('Unusable method.');
    }

    async update(id: string, newEntity: UserData): Promise<UserData> {
        try {
            const oldEntity = await this.get(id.toString()) as UserData;
            await setDoc(doc(this.fireCollection, id.toString()), newEntity);

            return oldEntity;
        } catch (e) {
            throw ErrorCode.AUTH_ERROR;
        }
    }

    getFirst(id: string | number): Observable<UserData> {
        throw new Error("not implements")
    }

}