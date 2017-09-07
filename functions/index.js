const functions = require("firebase-functions");
const { request } = require("graphql-request");
const serverUrl = "https://michaellee8-nuclide-server.appspot.com/graphql";

exports.createNewUser = functions.auth.user().onCreate(event => {
  request(
    serverUrl,
    `
    mutation newUser($input:createUsersInput!){
      createUsers(input:$input){
        clientMutationId
      }
    }
    `,
    {
      input: {
        userFirebaseAuthId: event.data.uid,
        userName: event.data.displayName
          ? event.data.displayName
          : "New Email User",
        userPhotoUrl: event.data.photoURL ? event.data.photoURL : null,
        userCreateTimestamp: "",
        userLastInteractionTimestamp: ""
      }
    }
  ).catch(err => console.error(err));
});

exports.removeOldUser = functions.auth.user().onDelete(event => {
  request(
    serverUrl,
    `
    mutation removeUser($input:deleteUsersInput!){
      deleteUsers(input:$input){
        clientMutationId
      }
    }
    `,
    {
      input: {
        where: {
          userFirebaseAuthId: event.data.uid
        }
      }
    }
  ).catch(err => console.error(err));
});
