const express=require('express');
const app=express();
app.use(express.json());

require('dotenv').config();

const cors=require('cors');
app.use(cors());

const mongodb=require('mongodb');
const bcrypt=require('bcrypt');

const mongoClient=mongodb.MongoClient;
const objectId=mongodb.ObjectID;

const dbUrl=process.env.DB_URL || "mongodb://127.0.0.1:27017";
const port=process.env.PORT || 4000;


app.post("/signup", async (req,res)=>{
    
    const client = await mongoClient.connect(dbUrl);
    if(client){
        try {
           
            const {email}=req.body;
            const db = client.db("inventory");
                const documentFind = await db.collection("users").findOne({email:req.body.email});
                if(documentFind){
                    res.status(400).json({
                        message:"User already Exists"
                    })
                }else{
                   
                    let salt=await bcrypt.genSalt(10);
                    let hash=await bcrypt.hash(req.body.password,salt);
                    req.body.password=hash;
                    const newuser = {
                        firstName:req.body.name,
                        lastName:req.body.lastName,
                        email:req.body.email,
                        password:req.body.password

                    }
                    await db.collection("users").insertOne(req.body);
                }
            client.close();
        } catch (error) {
            console.log(error);
            client.close();
        }
    }else{
        res.sendStatus(500);
    }
})

// login

app.post("/login",async(req,res)=>{
    const client=await mongoClient.connect(dbUrl);
    if(client)
    {   const {email}=req.body;
        try{
            let db=client.db("inventory");
            let data=await db.collection("users").findOne({email:req.body.email});
            if(data)
            {
                   await bcrypt.compare(req.body.password,data.password); 
               
                    res.status(400).json({message:"Login Unsuccesful"})
                
            }
            else{
                res.status(400).json({message:"User Does Not Exists "});// 401 unauthorized
            }
            client.close();
        }
        catch(error){
            console.log(error);
            client.close();
        }
    }else{

        res.sendStatus(500);
    }
})

app.listen(port,()=>{console.log("App Started",port)});