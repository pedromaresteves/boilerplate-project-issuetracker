'use strict';
const tempDb = require('../tempDb');
module.exports = function (app) {
  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      const dbName = `${project}Db`;
      const results = tempDb.getData(tempDb[dbName], req.query)
      return res.send(results);
    })

    .post(function (req, res) {
      let project = req.params.project;
      const dbName = `${project}Db`;
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.send({ error: 'required field(s) missing' });
      }
      const data = {
        open: true,
        created_on: new Date().toJSON(),
        updated_on: new Date().toJSON(),
        ...req.body
      };
      const dataStored = tempDb.addToDb(data, tempDb[dbName], dbName);
      return res.send(dataStored);
    })

    .put(function (req, res) {
      let project = req.params.project;
      const dbName = `${project}Db`;
      if (!req.body._id) return res.send({ error: 'missing _id' })
      if (Object.keys(req.body).length < 2) { return res.send({ error: 'no update field(s) sent', '_id': req.body._id }) }
      const updateSuccessful = tempDb.updateDbItem(req.body, tempDb[dbName]);
      if (!updateSuccessful) return res.send({ error: 'could not update', '_id': req.body._id })
      return res.send({ result: 'successfully updated', '_id': req.body._id });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      const dbName = `${project}Db`;
      if (!req.body._id) return res.send({ error: 'missing _id' })
      const removalSuccessful = tempDb.removeFromDSB(req.body._id, tempDb[dbName]);
      if (!removalSuccessful) return res.send({ error: 'could not delete', '_id': req.body._id })
      return res.send({ result: 'successfully deleted', '_id': req.body._id });
    });

};
