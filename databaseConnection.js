const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.mongoURI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function main() {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect();
            console.log("Connected to DB")
            const db = await client.db("issueTracker");
            resolve(db)

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = { main };