import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdfmwRhC7yDvYc0uL3NxjpfVCMK46wCMo",
  authDomain: "house-marketplace-app-60e82.firebaseapp.com",
  projectId: "house-marketplace-app-60e82",
  storageBucket: "house-marketplace-app-60e82.appspot.com",
  messagingSenderId: "835503065680",
  appId: "1:835503065680:web:fd1d35302eddb68aed9f55"
}

// Initialize Firebase
initializeApp(firebaseConfig)
export const db = getFirestore()