const db = require('../database/db');
const Utils = require('../utils');

const columns = [
  'c.id',
  'c.firstName',
  'c.lastName',
  'c.email',
  'c.phone',
  'c.structure',
  's.id as structure_id',
  's.title as structure_title',
  's.alias as structure_alias',
  's.subtitle as structure_subtitle',
  's.siret as structure_siret',
  's.address as structure_address',
  's.locality as structure_locality',
];

const cSelect = () => db('clients as c')
  .leftJoin('structures as s', 's.id', 'c.structure')
  .select(columns);

/**
 * Get all clients
 */
exports.clientsAll = async (req, res) => {
  cSelect()
    .orderBy(['lastName', 'firstName'])
    .options({ nestTables: true }) // doesn't work in SQLite
    .then((data) => Utils.formatRows(data))
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error retrieving clients: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Get a client
 */
exports.clientOne = async (req, res) => {
  cSelect()
    .where('c.id', req.query.id)
    .first()
    .options({ nestTables: true }) // doesn't work in SQLite
    .then((data) => Utils.formatRow(data))
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error retrieving client "${req.query.id}": ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Add a client
 */
exports.clientAdd = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    structure,
  } = req.body.data;

  db('clients')
    .insert({
      firstName,
      lastName,
      email,
      phone,
      structure,
    })
    .then(() => {
      res.json({ apiMessage: `The client "${email}" was created.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error creating ${email} client: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Edit a client
 */
exports.clientEdit = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    structure,
  } = req.body.data;

  db('clients')
    .where('id', req.body.id)
    .update({
      firstName,
      lastName,
      email,
      phone,
      structure,
      updated_at: Utils.convertIso(new Date().toISOString()),
    })
    .then(() => {
      res.json({ apiMessage: `The client "${req.body.id}" was updated.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error updating ${req.body.id} client`,
        apiError: err.message,
      });
    });
};

/**
 * Delete a client
 */
exports.clientDelete = async (req, res) => {
  db('clients')
    .where('id', req.body.id)
    .del()
    .then(() => {
      res.json({ apiMessage: `The client #${req.body.id} was deleted.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error deleting client ${req.body.id}: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Delete all clients
 */
exports.clientsReset = async (req, res) => {
  db
    .select('*')
    .from('clients')
    .truncate()
    .then(() => {
      res.json({ apiMessage: 'Clients table cleared.' });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error resetting clients table: ${err}.`,
        apiError: err.message,
      });
    });
};
