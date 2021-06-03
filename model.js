const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyBoHNPj2ZdvrBBbyR0qDVs9hsHUP6rMSII",
    authDomain: "mystockbot-ea13f.firebaseapp.com",
    projectId: "mystockbot-ea13f",
    storageBucket: "mystockbot-ea13f.appspot.com",
    messagingSenderId: "1076084122520",
    appId: "1:1076084122520:web:eee6cf0dd8d3ffe700c1ed",
    measurementId: "G-SN2SRME0RG"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);


module.exports = firebaseApp;