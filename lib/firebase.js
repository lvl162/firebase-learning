import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
const firebaseConfig = {
  apiKey: 'AIzaSyA1SCzKUxacvl_8-a1TFD4S5brb1jUez4Q',
  authDomain: 'next-depzai.firebaseapp.com',
  projectId: 'next-depzai',
  storageBucket: 'next-depzai.appspot.com',
  messagingSenderId: '813608130199',
  appId: '1:813608130199:web:ab5ac9970c4fdb6da07bd2',
  measurementId: 'G-H7G40DRRP2',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// firebase.initializeApp(firebaseConfig);
// export const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const increment = firebase.firestore.FieldValue.increment;
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

export const getUserWithUsername = async (username) => {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);

  const userDoc = (await query.get()).docs[0];
  return userDoc;
};
export const {serverTimestamp} = firebase.firestore.FieldValue;
export const postToJson = (doc) => {
  const data = doc.data();
  return {
    ...data,
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
};
