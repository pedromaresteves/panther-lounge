const { MongoClient, ServerApiVersion } = require("mongodb");
const { DBCONNECTION } = require("../stuff");
let pantherDb;
// Replace the placeholder with your Atlas connection string
const uri = DBCONNECTION;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
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