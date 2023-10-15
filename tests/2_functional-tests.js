const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const tempDb = require('../tempDb');

chai.use(chaiHttp);

suite('Post Method tests', function () {
    test('Should create an issue with every field', function () {
        chai.request(server).post('/api/issues/postTesting').type("application/json").send({
            issue_title: 'Title',
            issue_text: 'Description',
            created_by: 'Mario Bro',
            assigned_to: 'Luigi Bro',
            status_text: 'QA'
        }).then(res => {
            assert.equal(res.statusCode, 200)
            assert.equal(res.text, JSON.stringify(res.body));
        });
    });
    test('Should create an issue only mandatory fields', function () {
        chai.request(server).post('/api/issues/postTesting').type("application/json").send({
            issue_title: 'Title',
            issue_text: 'Description',
            created_by: 'Mario Bro'
        }).then(res => {
            assert.equal(res.statusCode, 200)
            assert.equal(res.text, JSON.stringify(res.body));
        });
    });
    test('Should not create an issue without any of the mandatory fields', function () {
        chai.request(server).post('/api/issues/postTesting').type("application/json").send({
            assigned_to: 'Luigi Bro',
        }).then(res => {
            assert.equal(res.statusCode, 200)
            assert.equal(res.text, JSON.stringify({ error: 'required field(s) missing' }));
        });
    });
});

suite('Get Method tests', function () {
    test('Should get all issues', function () {
        chai.request(server).get('/api/issues/getTesting').then(res => {
            assert.equal(res.statusCode, 200);
            assert.deepEqual(res.body, tempDb.getTestingDb);
        });
    });
    test('Should get issues according to filters', function () {
        const expectedDatabaseResult = [{ "_id": "1", "open": true, "created_on": "2023-10-13T18:15:04.523Z", "updated_on": "2023-10-13T18:15:04.523Z", "issue_title": "Title", "issue_text": "Description", "created_by": "Mario Bro", "assigned_to": "Luigi Bro", "status_text": "QA" }, { "_id": "2", "open": true, "created_on": "2023-10-13T18:15:04.533Z", "updated_on": "2023-10-13T18:15:04.533Z", "issue_title": "Title", "issue_text": "Description", "created_by": "Mario Bro" }];
        chai.request(server).get('/api/issues/getTesting?open=true&issue_title=Title').then(res => {
            assert.equal(res.statusCode, 200);
            assert.deepEqual(res.body, expectedDatabaseResult);
        });
    });
    test('Should not get closed issues', function () {
        chai.request(server).get('/api/issues/getTesting?open=false').then(res => {
            assert.equal(res.statusCode, 200);
            assert.deepEqual(res.body, []);
        });
    });
});

suite('Put Method tests', function () {
    test('Should update an issue', function () {
        chai.request(server).put('/api/issues/getTesting').type("application/json").send({
            _id: 1,
            issue_title: 'Updated Title',
            issue_text: 'Updated Description',
            created_by: 'John Woo',
            assigned_to: 'Michael Bay',
            status_text: 'QA'
        }).then(res => {
            assert.equal(res.statusCode, 200);
            assert.deepEqual(res.text, JSON.stringify({ result: 'successfully updated', '_id': 1 }));
        });
    });
    test('Should return error if id is missing', function () {
        chai.request(server).put('/api/issues/getTesting').type("application/json").send({
            issue_title: 'Updated Title',
            issue_text: 'Updated Description',
            created_by: 'John Woo',
            assigned_to: 'Michael Bay',
            status_text: 'QA'
        }).then(res => {
            assert.equal(res.statusCode, 200);
            assert.deepEqual(res.text, JSON.stringify({ error: 'missing _id' }));
        });
    });
    test('Should return error if update fields are not present', function () {
        chai.request(server).put('/api/issues/getTesting').type("application/json").send({
            _id: 1
        }).then(res => {
            assert.equal(res.statusCode, 200);
            assert.deepEqual(res.text, JSON.stringify({ error: 'no update field(s) sent', '_id': 1 }));
        });
    });
    test('Should return error if id is not present in DB', function () {
        chai.request(server).put('/api/issues/getTesting').type("application/json").send({
            _id: 10,
            issue_title: 'Updated Title'
        }).then(res => {
            assert.equal(res.statusCode, 200);
            assert.deepEqual(res.text, JSON.stringify({ error: 'could not update', '_id': 10 }));
        });
    });
});

suite('Delete Method tests', function () {
    test('Should delete an issue', function () {
        chai.request(server).delete('/api/issues/getTesting').type("application/json").send({
            _id: 1
        }).then(res => {
            assert.equal(res.statusCode, 200);
            assert.deepEqual(res.text, JSON.stringify({ result: 'successfully deleted', '_id': 1 }));
        });
    });
});