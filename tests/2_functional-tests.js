const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { helperTesterGetOne } = require('../tempDb')

chai.use(chaiHttp);

suite('Post Method tests', function () {
    test('Should create an issue with every field', async function () {
        const res = await chai.request(server).post('/api/issues/postTesting').type("application/json").send({
            issue_title: 'Title',
            issue_text: 'Description',
            created_by: 'Mario Bro',
            assigned_to: 'Luigi Bro',
            status_text: 'QA'
        });
        assert.equal(res.statusCode, 200)
        assert.equal(res.text, JSON.stringify(res.body));
    });
    test('Should create an issue only mandatory fields', async function () {
        const res = await chai.request(server).post('/api/issues/postTesting').type("application/json").send({
            issue_title: 'Title',
            issue_text: 'Description',
            created_by: 'Mario Bro'
        });
        assert.equal(res.statusCode, 200)
        assert.equal(res.text, JSON.stringify(res.body));
    });
    test('Should not create an issue without any of the mandatory fields', async function () {
        const res = await chai.request(server).post('/api/issues/postTesting').type("application/json").send({
            assigned_to: 'Luigi Bro',
        });
        assert.equal(res.statusCode, 200)
        assert.equal(res.text, JSON.stringify({ error: 'required field(s) missing' }));
    });
});

suite('Get Method tests', function () {
    test('Should get all issues', async function () {
        const res = await chai.request(server).get('/api/issues/getTesting');
        assert.equal(res.statusCode, 200);
    });
    test('Siew issues on a project with one filter', async function () {
        const res = await chai.request(server).get('/api/issues/getTesting?open=true');
        assert.equal(res.statusCode, 200);
    });
    test('Should get issues according to filters', async function () {
        const res = await chai.request(server).get('/api/issues/getTesting?open=true&assigned_to=Luigi Bro');
        assert.equal(res.statusCode, 200);
    });
    test('Should not get closed issues', async function () {
        chai.request(server).get('/api/issues/getTesting?open=false').then(res => {
            assert.equal(res.statusCode, 200);
            assert.deepEqual(res.body, []);
        });
    });
});

suite('Put Method tests', function () {
    test('Should update an a field on a issue', async function () {
        const res = await chai.request(server).put('/api/issues/getTesting').type("application/json").send({
            _id: "652c4c03b2277955e25b2d61",
            issue_title: 'Dang!',
        });
        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.text, JSON.stringify({ result: 'successfully updated', '_id': "652c4c03b2277955e25b2d61" }));
        await chai.request(server).put('/api/issues/getTesting').type("application/json").send({
            _id: "652c4c03b2277955e25b2d61",
            issue_title: 'Mario Bro',
            issue_text: 'Description',
            created_by: 'Mario Bro',
            assigned_to: 'Luigi Bro',
            status_text: 'QA'
        });
    });
    test('Should update an issue', async function () {
        const res = await chai.request(server).put('/api/issues/getTesting').type("application/json").send({
            _id: "652c4c03b2277955e25b2d61",
            issue_title: 'Updated Title',
            issue_text: 'Updated Description',
            created_by: 'John Woo',
            assigned_to: 'Michael Bay',
            status_text: 'QA'
        });
        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.text, JSON.stringify({ result: 'successfully updated', '_id': "652c4c03b2277955e25b2d61" }));
        await chai.request(server).put('/api/issues/getTesting').type("application/json").send({
            _id: "652c4c03b2277955e25b2d61",
            issue_title: 'Mario Bro',
            issue_text: 'Description',
            created_by: 'Mario Bro',
            assigned_to: 'Luigi Bro',
            status_text: 'QA'
        });
    });
    test('Should return error if id is missing', async function () {
        const res = await chai.request(server).put('/api/issues/getTesting').type("application/json").send({
            issue_title: 'Updated Title',
            issue_text: 'Updated Description',
            created_by: 'John Woo',
            assigned_to: 'Michael Bay',
            status_text: 'QA'
        });
        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.text, JSON.stringify({ error: 'missing _id' }));
    });
    test('Should return error if update fields are not present', async function () {
        const res = await chai.request(server).put('/api/issues/getTesting').type("application/json").send({
            _id: "652c4c03b2277955e25b2d61"
        });
        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.text, JSON.stringify({ error: 'no update field(s) sent', '_id': "652c4c03b2277955e25b2d61" }));
    });
    test('Should return error if id is not present in DB', async function () {
        const res = await chai.request(server).put('/api/issues/getTesting').type("application/json").send({
            _id: "000c0c00b0000000e00b0d00",
            issue_title: 'Updated Title'
        });
        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.text, JSON.stringify({ error: 'could not update', '_id': "000c0c00b0000000e00b0d00" }));
    });
});

suite('Delete Method tests', function () {
    test('Should delete an issue', async function () {
        const firstItem = await helperTesterGetOne();
        const res = await chai.request(server).delete('/api/issues/postTesting').type("application/json").send({
            _id: firstItem._id
        })
        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.text, JSON.stringify({ result: 'successfully deleted', '_id': firstItem._id }));
    });
    test('Should return error if ID is not valid', async function () {
        const _id = "000c0c00b0000000e00b0d00";
        const res = await chai.request(server).delete('/api/issues/postTesting').type("application/json").send({
            _id: _id
        })
        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.text, JSON.stringify({ error: 'could not delete', '_id': _id }));
    });
    test('Should return error if ID is not sent', async function () {
        const res = await chai.request(server).delete('/api/issues/postTesting').type("application/json").send()
        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.text, JSON.stringify({ error: 'missing _id' }));
    });
});