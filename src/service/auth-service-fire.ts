import AuthService from "./auth-service";
import {
    getAuth, signInWithEmailAndPassword, signInWithPopup, signOut, sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    ActionCodeSettings
} from "firebase/auth";
import {authState} from "rxfire/auth";
import firebaseApp from "../config/fire-config";
import {LoginData} from "../models/common/login-data";
import {nonAuthorizedUser, UserData} from "../models/common/user-data";
import {from, Observable} from "rxjs";
import {map, mergeMap} from "rxjs/operators";
import {
    collection,
    CollectionReference, doc, DocumentReference,
    DocumentSnapshot, getDoc, getDocs,
    getFirestore,
    where, query
} from "firebase/firestore";
import {getUuidByUser} from "../utils/uuid";
import {PATH_LOGIN_STEP_2} from "../config/routes-config";

const EMAIL_STORAGE_KEY = 'emailForSignIn';

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

    async isAdminsEmail(email: string): Promise<boolean> {
        if (!email) {
            return false;
        }

        const docRef = query(this.adminsCollection, where("email", "==", email));
        const docSnap = await getDocs(docRef);

        return !docSnap.empty;
    }

    getUserData(): Observable<UserData> {
        return authState(this.auth)
            .pipe(mergeMap(user => from(this.isAdmin(user?.uid))
                .pipe(map((isAdmin) => {
                    if (!!user) {
                        return {
                            uid: user.uid,
                            displayName: user.displayName ?? user.email!,
                            isAdmin: isAdmin,
                            email: user.email || '',
                        };
                    }

                    return nonAuthorizedUser;
                }))
            ));
    }

    buildActionCodeSettings(): ActionCodeSettings {
        const hash = getUuidByUser();

        return {
            url: 'http://localhost:3000' + PATH_LOGIN_STEP_2 + '?hash=' + hash,
            handleCodeInApp: true,
        };
    }

    login(loginData: LoginData): Promise<boolean> {
        if (!!loginData.password) {
            return signInWithEmailAndPassword(this.auth, loginData.email, loginData.password)
                .then(() => true).catch(() => false);
        } else {
            return sendSignInLinkToEmail(this.auth, loginData.email, this.buildActionCodeSettings())
                .then(() => {
                    window.localStorage.setItem(EMAIL_STORAGE_KEY, loginData.email);
                    return true;
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                    return false;
                });
        }
    }

    isLoginLink(): boolean {
        return isSignInWithEmailLink(this.auth, window.location.href);
    }

    async completeLogin(): Promise<boolean> {
        let email = window.localStorage.getItem(EMAIL_STORAGE_KEY);
        if (!email) {
            email = window.prompt('Please provide your email for confirmation');
        }

        try {
            await signInWithEmailLink(this.auth, email as string, window.location.href);
            window.localStorage.removeItem(EMAIL_STORAGE_KEY);
            return true;
        } catch (error) {
            return false;
        }
    }

    loginWithSocial(loginData: LoginData): Promise<boolean> {
        return signInWithPopup(this.auth, new loginData.provider!['class']()).then(() => true).catch(() => false);
    }

    logout(): Promise<boolean> {
        return signOut(this.auth).then(() => true).catch(() => false);
    }

}