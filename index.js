require("dotenv").config();
const express = require("express");
const mongodb = require("mongodb");

const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const app = express();

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const port = process.env.PORT || 4000;

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    let clientInfo = await mongoClient.connect(dbUrl);
    let db = clientInfo.db("inventory");
    let data = await db.collection("products").find().toArray();
    res.status(200).json(data);
    clientInfo.close();
  } catch (error) {
    console.log(error);
  }
});

app.post("/create-product", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db("inventory");
    let newproduct={
       "id":req.body.id,
       "name":req.body.name,
      "img":req.body.img,
      "price":req.body.price,
      "info":req.body.info,  
      "review":req.body.review,
      "Like":req.body.like,
      "dislike":req.body.dislike
      }
    await db.collection("products").insertOne(req.body);
    res.status(200).json({ message: "product created" });
    client.close();
  } catch (error) {
    console.log(error);
  }
});



app.listen(port, () => console.log("App runs with 4000"));