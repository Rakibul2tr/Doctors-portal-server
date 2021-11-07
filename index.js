const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const app = express();
const port = 5000 || process.env.PORT;


app.use(cors());
app.use(express.json());


    
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ez3jy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    async function run() {
        try {
          await client.connect();
          const database = client.db("Doctors-portal");
          const services = database.collection("services");
          const apoinment = database.collection("apoinment");
          const users = database.collection("users");
          const apoinmentCartdata = database.collection("apoin_Cart_data");
          
          //service data getting
         app.get("/service",async(req,res)=>{
            const curser= services.find({});
            const result=await curser.toArray();
            res.send(result)
         })
          
        //apoinment insert of apoinment form 
        app.post("/apoinment",async(req,res)=>{
            const curser=req.body;
            const result=await apoinment.insertOne(curser);
            res.send(result);
        })

        //apoinment booking data by user email 
        app.get("/apoinment",async(req,res)=>{
            const email=req.query.email;
            const query= {email:email};
            const curser= apoinment.find(query);
            const result=await curser.toArray();
            res.send(result);
        })

        //apoinment cart data gettin
        app.get("/cartdata",async(req,res)=>{
            const curser= apoinmentCartdata.find({});
            const result=await curser.toArray();
            res.send(result)
        })
        //users api data insert by post

        app.post("/users",async(req,res)=>{
            const curser=req.body;
            const result=await users.insertOne(curser);
            res.send(result);
        })
        //cheking admin with email
        app.get("/users/:email",async(req,res)=>{
            const email= req.params.email;
            const query= {email:email}
            const user=await users.findOne(query);
            console.log(user);
            let isAdmin=false;
            if(user?.role==='admin'){
                isAdmin=true;
            }
            console.log('admin email',isAdmin);
            res.send({admin:isAdmin});
        })

        ///user cheeking and not duplecate
        app.put("/users",async(req,res)=>{
            const user=req.body;
            const filter={email:user.email};
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result=await users.updateOne(filter,updateDoc,options);
            res.send(result);
        })
        ///user make Admin
        app.put("/users/admin",async(req,res)=>{
            const user=req.body;
            const filter={email:user.email};
            const updateDoc = { $set: {role:'admin'} };
            const result=await users.updateOne(filter,updateDoc);
            res.send(result);
        })

        } finally {
        //   await client.close();
        }
      }
      run().catch(console.dir);


    app.get('/',(req,res)=>{
        res.send('i am from server')
    })

    app.listen(port,()=>{
        console.log('server ready to port',port);
    })

