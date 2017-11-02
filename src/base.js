var Rebase = require('re-base');
var firebase = require('firebase');
var app = firebase.initializeApp({
    apiKey: "AIzaSyAp9txxRcx-hL23qwCdNc3cfW9LuOnC02U",
    authDomain: "michaellee8-sba-revisioner.firebaseapp.com",
    databaseURL: "https://michaellee8-sba-revisioner.firebaseio.com",
    projectId: "michaellee8-sba-revisioner",
    storageBucket: "michaellee8-sba-revisioner.appspot.com",
    messagingSenderId: "322651489781"
  });
var base = Rebase.createClass(app.database());
export default base;
