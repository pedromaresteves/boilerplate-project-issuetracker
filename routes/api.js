'use strict';
const tempDb = require('../tempDb');


module.exports = function (app) {
  app.route('/api/issues/:project')

    .get(async function (req, res) {
      let project = req.params.project;
      const results = await tempDb.getData(req.query, project)
      return res.send(results);
    })

    .post(async function (req, res) {
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
      const dataStored = await tempDb.addToDb(data, project);
      return res.send(dataStored);
    })

    .put(async function (req, res) {
      let project = req.params.project;
      if (!req.body._id) return res.send({ error: 'missing _id' })
      if (Object.keys(req.body).length < 2) { return res.send({ error: 'no update field(s) sent', '_id': req.body._id }) }
      const updateRes = await tempDb.updateDbItem(req.body, project);
      if (updateRes.matchedCount <= 0) return res.send({ error: 'could not update', '_id': req.body._id })
      return res.send({ result: 'successfully updated', '_id': req.body._id });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      if (!req.body._id) return res.send({ error: 'missing _id' });
      const deleteRes = tempDb.removeFromDSB(req.body._id, project);
      if (deleteRes.deletedCount <= 0) return res.send({ error: 'could not delete', '_id': req.body._id })
      return res.send({ result: 'successfully deleted', '_id': req.body._id });
    });

};
