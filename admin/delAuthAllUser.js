var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey-food-shop.json");


// You should replae databaseURL with your own
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://food-bfabd.firebaseio.com"
});


listAllUsers();


function listAllUsers(nextPageToken) {
  // List batch of users, 1000 at a time.
  admin.auth().listUsers(1000, nextPageToken)
    .then(function (listUsersResult) {
      listUsersResult.users.forEach(function (userRecord) {
      //  console.log("user", userRecord.toJSON());
        admin.auth().deleteUser(userRecord.uid)
          .then(function () {
            console.log("userRecord.uid: ", userRecord.uid);
            console.log("Successfully deleted user");
          })
          .catch(function (error) {
            console.log("Error deleting user:", error);
          });
      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
        listAllUsers(listUsersResult.pageToken)
      }
    })
    .catch(function (error) {
      console.log("Error listing users:", error);
    });
}


