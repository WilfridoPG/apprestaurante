import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAHg7TbzbdypnwtUubAV0VB47c2BL--3SI",
  authDomain: "receta-d897c.firebaseapp.com",
  databaseURL: "https://receta-d897c.firebaseio.com",
  projectId: "receta-d897c",
  storageBucket: "receta-d897c.appspot.com",
  messagingSenderId: "1078218990258",
  appId: "1:1078218990258:web:fa51fc7c5df68c16f51fab",
  measurementId: "G-V7XY970L0V",
};
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
