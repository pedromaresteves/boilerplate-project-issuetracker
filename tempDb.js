const apitestDb = [];
const postTestingDb = [];
const getTestingDb = [{ "_id": "1", "open": true, "created_on": "2023-10-13T18:15:04.523Z", "updated_on": "2023-10-13T18:15:04.523Z", "issue_title": "Title", "issue_text": "Description", "created_by": "Mario Bro", "assigned_to": "Luigi Bro", "status_text": "QA" }, { "_id": "2", "open": true, "created_on": "2023-10-13T18:15:04.533Z", "updated_on": "2023-10-13T18:15:04.533Z", "issue_title": "Title", "issue_text": "Description", "created_by": "Mario Bro" }];
const counters = {
    apitestDbIdCounter: 1,
    postTestingDbIdCounter: 1,
    getTestingIdCounter: 1
};



const filterDbResults = (db, queryParams) => {
    for (let prop in queryParams) {
        if (queryParams[prop] === 'true') queryParams[prop] = true;
        if (queryParams[prop] === 'false') queryParams[prop] = false;
        db = db.filter(dbItem => {
            return dbItem[prop] === queryParams[prop]
        })
    }
    return db;
}

const getData = (db, queryParams) => {
    let results = db;
    const shouldFilterResults = Object.keys(queryParams).length > 0;
    if (shouldFilterResults) {
        results = filterDbResults(results, queryParams)
    }
    return results;
}

const addToDb = (data, db, dbName) => {
    data._id = counters[`${dbName}IdCounter`];
    db.push(data);
    counters[`${dbName}IdCounter`]++;
    return data;
};

const updateDbItem = (newData, db) => {
    newData.updated_on = new Date().toJSON();
    let propsUpdated = 0;
    db.forEach(item => {
        if (item._id === newData._id.toString()) {
            for (prop in newData) {
                if (newData[prop]) {
                    item[prop] = newData[prop];
                    propsUpdated++;
                }
            }
        }
    });
    return (propsUpdated > 0);
};

const removeFromDSB = (id, db) => {
    const currentDbLength = db.length;
    const newDb = db.filter(item => item._id !== id);
    db = newDb;
    const updatedDbLength = db.length;
    return (updatedDbLength < currentDbLength);
};

module.exports = {
    apitestDb: apitestDb,
    postTestingDb: postTestingDb,
    getTestingDb: getTestingDb,
    getData: getData,
    addToDb: addToDb,
    updateDbItem: updateDbItem,
    removeFromDSB: removeFromDSB
}