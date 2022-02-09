// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDr-SsCUZOqiLiWQvzVWDQeYICYFOYFAEQ",
    authDomain: "online-ordering-system-b8343.firebaseapp.com",
    projectId: "online-ordering-system-b8343",
    storageBucket: "online-ordering-system-b8343.appspot.com",
    messagingSenderId: "401694133740",
    appId: "1:401694133740:web:fd968bbf90704f679bc4c9"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;