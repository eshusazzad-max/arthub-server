require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

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
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});