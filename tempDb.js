const ObjectId = require('mongodb').ObjectId;
const mongoDatabase = require("./databaseConnection");
const database = mongoDatabase.main();
const getData = async (queryParams, project) => {
    const db = await database;
    const collection = await db.collection(`${project}Db`);
    if (queryParams.open) {
        if (queryParams.open === "true") {
            queryParams.open = true;
        } else {
            queryParams.open = false;
        }
    }
    if (queryParams._id) queryParams._id = new ObjectId(queryParams._id);
    const allResults = await collection.find(queryParams).toArray();
    return allResults;
}

const addToDb = async (data, project) => {
    const db = await database;
    const collection = await db.collection(`${project}Db`);
    const insertRes = await collection.insertOne(data);
    const itemInserted = await collection.findOne(insertRes.insertedId);
    return itemInserted;
};

const updateDbItem = async (newData, project) => {
    newData.updated_on = new Date().toJSON();
    const { _id, ...itemData } = newData;
    const db = await database;
    const collection = await db.collection(`${project}Db`);
    const updateRes = await collection.updateOne({ _id: new ObjectId(_id) }, { $set: itemData })
    return updateRes;
};

const removeFromDSB = async (id, project) => {
    const db = await database;
    const collection = await db.collection(`${project}Db`);
    const deleteRes = await collection.deleteOne({ _id: new ObjectId(id) });
    return deleteRes;
};

const helperTesterGetOne = async () => {
    const db = await database;
    const collection = await db.collection(`postTestingDb`);
    const firstItem = await collection.findOne({});
    return firstItem;
}

module.exports = {
    getData: getData,
    addToDb: addToDb,
    updateDbItem: updateDbItem,
    removeFromDSB: removeFromDSB,
    helperTesterGetOne: helperTesterGetOne
}