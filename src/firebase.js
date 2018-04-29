import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyCW9edjZ8aAodJGeQr1o0826I0drkpEeFg",
  authDomain: "note-55c7f.firebaseapp.com",
  databaseURL: "https://note-55c7f.firebaseio.com",
  projectId: "note-55c7f",
  storageBucket: "",
  messagingSenderId: "964733442078"
};

firebase.initializeApp(config);

export default firebase;
export const db = firebase.database();
export const auth = firebase.auth();
