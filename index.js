
/** requiring packages */
const express=require('express');
const mongodb=require('mongodb');
const cors=require('cors');
require("dotenv").config();



const mongoClient=mongodb.MongoClient;
const objectId=mongodb.ObjectId;
const app=express();
app.use(cors());
app.use(express.json());

/** connecting to db */

const dbUrl= process.env.DB_URL ||"mongodb://127.0.0.1:27017"
const port=process.env.PORT || 4000 ;


/**   */
app.get("/upcoming",async(req, res)=>{
    try{

        let client=await mongoClient.connect(dbUrl);
        let db= client.db("inventory");
        let data= await db.collection("upcoming").find().toArray();
        res.status(200).json(data);
        client.close();

    }catch(err){
        console.log(err)
    }
})



app.post("/createMovie",async(req, res)=>{
    try{

        let client= await mongoClient.connect(dbUrl);
        let db= client.db("inventory");
         let newMovie={
             "id":req.body.id,
             "name":req.body.name,
             "language":req.body.language,
             "date":req.body.date,
             "actors":req.body.actors,
             "director":req.body.director,
             "musicdirector":req.body.musicdirector,
             "synopsis":req.body.synopsis,
            }
            await db.collection("upcoming").insertOne(newMovie);
            res.status(200).json({message:"created"});
            client.close();
    }catch(err){
        console.log(err)
    }
})

/** creating current movie */
app.post("/createCurrentMovie",async(req, res)=>{
    try{
        const client= await mongoClient.connect(dbUrl);
        const db= client.db("inventory");
        let newMovie={
            "id":req.body.id,
            "name":req.body.name,
            "language":req.body.language,
            "date":req.body.date,
            "actors":req.body.actors,
            "director":req.body.director,
            "musicdirector":req.body.musicdirector,
            "synopsis":req.body.synopsis,
            "img":req.body.img
           }
        await db.collection("current").insertOne(newMovie);
        res.status(200).json({message:"created"});
        client.close();
    }catch(err){
        console.log(err)
    }
})

/** get current movie */

app.get("/current",async(req, res)=>{
    try{
      const client= await mongoClient.connect(dbUrl);
      const db= client.db("inventory");
      const data=await db.collection("current").find().toArray();
      res.status(200).json(data);
      client.close();

    }catch(err){
        console.log(err)
    }
})

/** filters  */

app.get("/tamil",async(req,res)=>{
    try{
        const client=await mongoClient.connect(dbUrl);
        const db= client.db("inventory");
        const data=await db.collection("current").find({language:"Tamil"}).toArray();
        res.status(200).json(data);
        client.close();
}catch(err){
        console.log(err)
    }
})

app.get("/hindi",async(req,res)=>{
    try{
        const client=await mongoClient.connect(dbUrl);
        const db= client.db("inventory");
        const data=await db.collection("current").find({language:"Hindi"}).toArray();
        res.status(200).json(data);
        client.close();
}catch(err){
        console.log(err)
    }
})
app.get("/malayalam",async(req,res)=>{
    try{
        const client=await mongoClient.connect(dbUrl);
        const db= client.db("inventory");
        const data=await db.collection("current").find({language:"Malayalam"}).toArray();
        res.status(200).json(data);
        client.close();
}catch(err){
        console.log(err)
    }
})
app.get("/english",async(req,res)=>{
    try{
        const client=await mongoClient.connect(dbUrl);
        const db= client.db("inventory");
        const data=await db.collection("current").find({language:"English"}).toArray();
        res.status(200).json(data);
        client.close();
}catch(err){
        console.log(err)
    }
})












app.listen(port,()=>console.log(`app runs with${port}`))