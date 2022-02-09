import AuthService from "./auth-service";
import {getAuth, signInWithEmailAndPassword, signInWithPopup, signOut} from "firebase/auth";
import {authState} from "rxfire/auth";
import firebaseApp from "../config/fire-config";

import {LoginData} from "../models/common/login-data";
import {nonAuthorizedUser, UserData} from "../models/common/user-data";
import {from, Observable} from "rxjs";
import {map, mergeMap} from "rxjs/operators";
import {
    collection,
    CollectionReference, doc, DocumentReference,
    DocumentSnapshot, getDoc,
    getFirestore
} from "firebase/firestore";

export default class AuthServiceFire implements AuthService {
    private auth = getAuth(firebaseApp);
    private readonly adminsCollection: CollectionReference;

    constructor() {
        this.adminsCollection = collection(getFirestore(firebaseApp), 'administrators');
    }

    async isAdmin(id?: string): Promise<boolean> {
        if (!id) {
            return false;
        }

        const docRef: DocumentReference = doc(this.adminsCollection, id);
        const docSnap: DocumentSnapshot = await getDoc(docRef);

        return docSnap.exists();
    }

    getUserData(): Observable<UserData> {
        return authState(this.auth)
            .pipe(mergeMap(user => from(this.isAdmin(user?.uid))
                .pipe(map((isAdmin) => {
                    if (!!user) {
                        return {
                            username: user.uid,
                            displayName: user.displayName ?? user.email!,
                            isAdmin: isAdmin
                        };
                    }

                    return nonAuthorizedUser;
                }))
            ));
    }

    login(loginData: LoginData): Promise<boolean> {
        return signInWithEmailAndPassword(this.auth, loginData.email, loginData.password)
            .then(() => true).catch(() => false);
    }

    loginWithSocial(loginData: LoginData): Promise<boolean> {
        return signInWithPopup(this.auth, new loginData.provider!['class']())
            .then(() => true).catch(() => false);
    }

    logout(): Promise<boolean> {
        return signOut(this.auth).then(() => true).catch(() => false);
    }

}