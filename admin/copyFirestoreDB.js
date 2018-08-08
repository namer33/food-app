const firebase = require('firebase-admin');

var serviceAccountSource = require("./serviceAccountKey-food-shop.json"); // source DB key start
var serviceAccountDestination = require("./serviceAccountKey-food-app.json"); // destiny DB key end

const sourceAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountSource)
});

const destinationAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountDestination)
}, "destination");


var source = sourceAdmin.firestore();
var destination = destinationAdmin.firestore();

const copy = (sourceDBrep, destinationDBref, aux) => {
  return Promise.all(Object.keys(aux).map((collection) => {
    return sourceDBrep.collection(collection).get()
      .then((data) => {
        let promises = [];
        data.forEach((doc) => {
          const data = doc.data();
          promises.push(
            destinationDBref.collection(collection).doc(doc.id).set(data).then((data) => {
              return copy(sourceDBrep.collection(collection).doc(doc.id),
              destinationDBref.collection(collection).doc(doc.id),
              aux[collection])
            })
          ); 
        })
      return Promise.all(promises);
    })
  }));
};

copy(source, destination, aux).then(() => {
  console.log('copied');
});


