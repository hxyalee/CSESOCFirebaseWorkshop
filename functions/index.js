const functions = require("firebase-functions");
const admin = require("firebase-admin");

// How to retrieve your service account key:
// 1. Create your firebase project
// 2. Go to project settings
// 3. Go to service accounts tab
// 4. Generate new private key
// 5. Save the file on your working directory
const ServiceAccount = require("./ServiceAccountKey.json");
const express = require("express");
const app = express();
const firebase = require("firebase");
const cors = require('cors');
app.use(cors({origin: true}));

// How to retrieve your firebase config:
// 1. Create your firebase project
// 2. Go to project settings
// 3. On the bottom part of the General tab, click the </> icon
// 4. Follow the command shown on the prompt
// 5. You can now access the config on the "Firebase SDK snippet" section
// 5. Save the file on your working directory
/* FORMAT OF THE CONFIG FILE: 
    const firebaseConfig = {
      apiKey: "randomcharactershereasdfghjkl",
      authDomain: "csesocworkshop.firebaseapp.com",
      databaseURL: "https://xxxxxx.firebaseio.com",
      projectId: "csesocworkshop",
      storageBucket: "csesocworkshop.appspot.com",
      messagingSenderId: "xxxxxxxxxx",
      appId: "x:xxxxx:xxxxxx:Xxxxx",
      measurementId: "X-XXXXXX"
    };
*/
const config = require("./FirebaseConfig");

firebase.initializeApp(config);
admin.initializeApp({
  credential: admin.credential.cert(ServiceAccount),
  databaseURL: "https://`csesocworkshop.firebaseio.com",
});

const db = admin.firestore();

app.get("/getMovies", (request, response) => {
  db.collection("movies")
    .orderBy("title")
    .get()
    .then((data) => {
      let movies = new Array();
      data.forEach((doc) => {
        movies.push(doc.data());
      });
      return response.json({ movies });
    });
});
app.post("/createNewMovie", (request, response) => {
  const genres = request.body.genres.split(",");
  const newMovie = {
    title: request.body.title,
    yearReleased: parseInt(String(request.body.yearReleased)),
    imageURL: request.body.imageURL,
    genres: genres,
  };
  db.collection("movies")
    .add(newMovie)
    .then((data) => {
      return response.json({
        status: "success",
        details: `movie ID ${data.id} added`,
      });
    })
    .catch((err) =>
      response.status(500).json({ status: "failed", error: err.code })
    );
});

app.get("/movie/:movieId", (request, response) => {
  const id = request.params.movieId;
  db.collection("movies")
    .doc(id)
    .get()
    .then((data) => {
      if (data.exists) {
        console.log(data);
        return response.json({ status: "success", movie: data.data() });
      }
      return response
        .status(404)
        .json({ status: "failed", error: "Movie not found" });
    })
    .catch((err) =>
      response.status(500).json({ status: "failed", error: err.code })
    );
});

app.post("/signup", (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password,
  };
  firebase
    .auth()
    .createUserWithEmailAndPassword(user.email, user.password)
    .then((data) => data.user.getIdToken())
    .then((token) => {
      return response.json({ token });
    })
    .catch((err) => response.status(500).json({ error: err.code }));
});

app.post("login", (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password,
  };
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => data.user.getIdToken())
    .then((token) => response.json({ token }))
    .catch((err) => response.status(500).json({ error: err.code }));
});

exports.api = functions.region("asia-east2").https.onRequest(app);
