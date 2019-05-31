var express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const path = require("path");
const PORT = 3000;
const DB_NAME = "cardsdb";
const URI = "mongodb://localhost:27017/"
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Sab Sahi"));

app.get("/secret", (req, res) =>
  res.sendFile(path.join(__dirname, "index.html"))
);

app.post("/secret", function(req, response) {
  MongoClient.connect(URI, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    else {
      var dbo = db.db(DB_NAME);
      const KeyValuePair = {
        name: req.body.name.toLowerCase(),
        card: req.body.number + "_of_" + req.body.suit
      };
      dbo.collection("names").insertOne(KeyValuePair, function(err, res) {
        if (err) throw err;
        else {
          response.send("Inserted into DB");
        }
      });
    }
    db.close();
  });
  // Connection to the MongoDB
  // Get the information to enter inside the MongoDB
  // Display 200: Inserted into the DB
});

app.get("/deleteAll", function(req, response) {
  MongoClient.connect(URI, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    else {
      var dbo = db.db(DB_NAME);
      // dbo.collection("names")
      // .countDocuments('', (err,res)=>{
      //   console.log(res);
      //   response.send(`Deleted ${res}`);
      // })
      dbo.collection("names").deleteMany();
      response.send(`Deleted All`);
    }
    db.close();
  });
  // Connection to the MongoDB
  // DeleteAll Entries from the DB
});

app.get("/:params*", function(req, response) {
  // Connection to the MongoDB
  // Get the param from url and search in the DB
  // Use find function to search through the DB
  var search = req.params.params.toLowerCase();
  MongoClient.connect(URI, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    else {
      var dbo = db.db(DB_NAME);
      dbo.collection("names").findOne({ name: search }, function(req, res) {
        if (err || res === null) {
          response.send("<h1>404 Not Found</h1>");
        } else {
          const PNG = path.join(__dirname, "cards", `${res.card}.png`);
          response.sendFile(PNG);
        }
      });
    }
    db.close();
  });
});

app.listen(PORT);
