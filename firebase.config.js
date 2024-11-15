import firebase from '@react-native-firebase/app';
// import '@react-native-firebase/auth';  // Only if you're using Firebase Auth

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDP_aPifksFoUFVJtXgzyP7Eg7H6wiIvh4",
  authDomain: "stressbusters-36609.firebaseapp.com",
  projectId: "stressbusters-36609",
  storageBucket: "stressbusters-36609.appspot.com",
  messagingSenderId: "484224926717",
  appId: "1:484224926717:android:f3cda2ad6c05ce24",
};

// Initialize Firebase only if it hasn’t been initialized already
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
