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
        userName: event.data.displayName,
        userPhotoUrl: event.data.photoURL
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
      where: {
        userFirebaseAuthId: event.data.uid
      }
    }
  ).catch(err => console.error(err));
});
