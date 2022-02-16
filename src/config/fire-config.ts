// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries

/**** Dreamteam firebase config ****/
// const firebaseConfig = {
//     apiKey: "AIzaSyDr-SsCUZOqiLiWQvzVWDQeYICYFOYFAEQ",
//     authDomain: "online-ordering-system-b8343.firebaseapp.com",
//     projectId: "online-ordering-system-b8343",
//     storageBucket: "online-ordering-system-b8343.appspot.com",
//     messagingSenderId: "401694133740",
//     appId: "1:401694133740:web:fd968bbf90704f679bc4c9"
// };

/**** Personal firebase config ****/
const firebaseConfig = {
    apiKey: "AIzaSyAchI7h6ndVkt_pEOx3DOFp25PdJzmVPW0",
    authDomain: "online-ordering-system-39e01.firebaseapp.com",
    projectId: "online-ordering-system-39e01",
    storageBucket: "online-ordering-system-39e01.appspot.com",
    messagingSenderId: "807419609598",
    appId: "1:807419609598:web:cbb21a5a6dab85ff1cc0af"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;