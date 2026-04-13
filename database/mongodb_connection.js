const { MongoClient, ServerApiVersion } = require("mongodb");
let pantherDb;
const DBCONNECTION = process.env.DBCONNECTION;
if (!DBCONNECTION) {
    throw new Error('Missing DBCONNECTION in environment variables. Add it to your .env file.');
}
const client = new MongoClient(DBCONNECTION, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    serverSelectionTimeoutMS: 5000,
    retryWrites: true,
    retryReads: true,
    maxPoolSize: 10,
    minPoolSize: 2
});

async function connectWithRetry(retries = 3, delay = 2000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await client.connect();
            await client.db('panterloungedb').command({ ping: 1 });
            return true;
        } catch (error) {
            console.error(`Connection attempt ${attempt}/${retries} failed:`, error.message);
            if (attempt < retries) await new Promise(r => setTimeout(r, delay));
        }
    }
    throw new Error('Failed to connect to MongoDB after retries');
}

async function run(db = "panterloungedb") {
    if (pantherDb) {
        return pantherDb;
    }

    try {
        await connectWithRetry();
        pantherDb = client.db(db);
        // Verify connection with ping
        await pantherDb.command({ ping: 1 });
        return pantherDb;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

const cleanup = async () => {
    await client.close();
    process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

module.exports = { run };