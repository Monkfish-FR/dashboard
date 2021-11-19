const db = require('../database/db');
const Utils = require('../utils');

/**
 * Get all structures
 */
exports.structuresAll = async (req, res) => {
  db('structures')
    .select('*')
    .orderBy(['title'])
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error retrieving structures: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Get a structure
 */
exports.structureOne = async (req, res) => {
  db('structures')
    .where('id', req.query.id)
    .first()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error retrieving structure "${req.query.id}": ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Add a structure
 */
exports.structureAdd = async (req, res) => {
  const {
    title,
    alias,
    subtitle,
    siret,
    address,
    locality,
  } = req.body.data;

  db('structures')
    .insert({
      title,
      alias,
      subtitle,
      siret,
      address,
      locality,
    })
    .then(() => {
      res.json({ apiMessage: `The structure "${title}" was created.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error creating ${title} structure: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Edit a structure
 */
exports.structureEdit = async (req, res) => {
  const {
    title,
    alias,
    subtitle,
    siret,
    address,
    locality,
  } = req.body.data;

  db('structures')
    .where('id', req.body.id)
    .update({
      title,
      alias,
      subtitle,
      siret,
      address,
      locality,
      updated_at: Utils.convertIso(new Date().toISOString()),
    })
    .then(() => {
      res.json({ apiMessage: `The structure "${title}" was updated.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error updating ${req.body.id} structure`,
        apiError: err.message,
      });
    });
};

/**
 * Delete a structure
 */
exports.structureDelete = async (req, res) => {
  db('structures')
    .where('id', req.body.id)
    .del()
    .then(() => {
      res.json({ apiMessage: `The structure #${req.body.id} was deleted.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error deleting structure ${req.body.id}: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Delete all structures
 */
exports.structuresReset = async (req, res) => {
  db
    .select('*')
    .from('structures')
    .truncate()
    .then(() => {
      res.json({ apiMessage: 'Structures table cleared.' });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error resetting structures table: ${err}.`,
        apiError: err.message,
      });
    });
};
