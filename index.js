var express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const path = require("path");
const url = "mongodb://localhost:27017/cardsdb";
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/secret", (req, res) =>
  res.sendFile(path.join(__dirname, "index.html"))
);

app.post("/secret", function(req, response) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    else {
      var dbo = db.db("mydb");
      const KeyValuePair = {
        name: req.body.name.toLowerCase(),
        card: req.body.number + "_of_" + req.body.suit
      };
      dbo.collection("customers").insertOne(KeyValuePair, function(err, res) {
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
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    else {
      var dbo = db.db("mydb");
      // dbo.collection("customers")
      // .countDocuments('', (err,res)=>{
      //   console.log(res);
      //   response.send(`Deleted ${res}`);
      // })
      dbo.collection("customers").deleteMany();
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
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    else {
      var dbo = db.db("mydb");
      dbo.collection("customers").findOne({ name: search }, function(req, res) {
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

app.listen(3000 || process.env.PORT);
