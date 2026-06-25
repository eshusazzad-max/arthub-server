require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    console.log(" MongoDB Connected");

    const database = client.db("arthubDB");
    const artworksCollection = database.collection("artworks");
    const usersCollection = database.collection("users");

    app.get("/", (req, res) => {
      res.send("ArtHub Server Running");
    });

    app.get("/artworks", async (req, res) => {
     const result = await artworksCollection.find().toArray();
     res.send(result);
    });

    app.post("/artworks", async (req, res) => {
     const newArtwork = req.body;
     const result = await artworksCollection.insertOne(newArtwork);
     res.send(result);
    });

    app.get("/artworks/:id", async (req, res) => {
     const id = req.params.id;

     const query = { _id: new ObjectId(id) };

     const result = await artworksCollection.findOne(query);

     res.send(result);
    });

    app.patch("/artworks/:id", async (req, res) => {
     const id = req.params.id;
     const updatedArtwork = req.body;

     const filter = { _id: new ObjectId(id) };

     const updatedDoc = {
      $set: updatedArtwork,
     };

     const result = await artworksCollection.updateOne(filter, updatedDoc);

     res.send(result);
    });

    app.delete("/artworks/:id", async (req, res) => {
     const id = req.params.id;

     const query = { _id: new ObjectId(id) };

     const result = await artworksCollection.deleteOne(query);

     res.send(result);
    });

    app.post("/users", async (req, res) => {
     const user = req.body;

     const existingUser = await usersCollection.findOne({
      email: user.email,
    });

     if (existingUser) {
      return res.send({
        message: "User already exists",
        inserted: false,
     });
    }

     user.role = "user";
     user.createdAt = new Date();

      const result = await usersCollection.insertOne(user);

      res.send(result);
    });

    app.get("/users", async (req, res) => {
     const result = await usersCollection.find().toArray();
     res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
     const email = req.params.email;

     const query = { email: email };

     const result = await usersCollection.findOne(query);

     res.send(result);
    });

    app.patch("/users/role/:id", async (req, res) => {
     const id = req.params.id;
     const { role } = req.body;

     const filter = { _id: new ObjectId(id) };

     const updatedDoc = {
       $set: {
       role: role,
      },
    };

    const result = await usersCollection.updateOne(filter, updatedDoc);

    res.send(result);
   });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});