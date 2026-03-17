require('dotenv').config();
const { MongoClient, ServerApiVersion } = require("mongodb");
let pantherDb;
// use environment variable instead of hardcoding secrets
console.log(process.env.DBCONNECTION)
const DBCONNECTION = process.env.DBCONNECTION;
if (!DBCONNECTION) {
    throw new Error('Missing DBCONNECTION in environment variables. Add it to your .env file.');
}
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(DBCONNECTION, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);
async function run(db = "panterloungedb") {
    console.log("Connecting to MongoDB")
    if (pantherDb) {
        console.log("Already connected to MongoDB")
        return pantherDb;
    }
    try {
        await client.connect();
        pantherDb = await client.db(db)
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return pantherDb;
    } catch (error) {
        console.log(error)
    }
}

const cleanup = async () => {
    console.log("Clean up time")
    await client.close();
    process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

module.exports = { run };