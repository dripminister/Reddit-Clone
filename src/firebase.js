import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
	apiKey: "AIzaSyCadA_KI17q7jC8DaOmhSm_C4MnJRIKtyg",
	authDomain: "reddit-clone-fa15f.firebaseapp.com",
	projectId: "reddit-clone-fa15f",
	storageBucket: "reddit-clone-fa15f.appspot.com",
	messagingSenderId: "1059061387454",
	appId: "1:1059061387454:web:cc003b35cb875d7d7dceef",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const provider = new GoogleAuthProvider()