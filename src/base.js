var Rebase = require('re-base');
var firebase = require('firebase');
var app = firebase.initializeApp({
    apiKey: "AIzaSyCMtO5Lx8oDnIto0TguGttu6tslbtAlMDo",
    authDomain: "revisioner-3c321.firebaseapp.com",
    databaseURL: "https://revisioner-3c321.firebaseio.com",
    projectId: "revisioner-3c321",
    storageBucket: "revisioner-3c321.appspot.com",
    messagingSenderId: "1035995091286"
  });
var base = Rebase.createClass(app.database());
export default base;
export {firebase as firebaseInstance};