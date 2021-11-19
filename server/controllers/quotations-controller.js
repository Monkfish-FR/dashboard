const db = require('../database/db');
const Utils = require('../utils');

const columns = [
  'q.id',
  'q.number',
  'q.project',
  'q.work',
  'q.subtitle',
  'q.amount',
  'q.items',
  'q.comment',
  'q.status',
  'q.client',
  'q.active',
  'q.created_at as createdAt',
  'c.id as client_id',
  'c.firstName as client_firstName',
  'c.lastName as client_lastName',
  'c.email as client_email',
  'c.phone as client_phone',
  'c.structure as client_structure',
  's.id as client_structure_id',
  's.title as client_structure_title',
  's.alias as client_structure_alias',
  's.subtitle as client_structure_subtitle',
  's.siret as client_structure_siret',
  's.address as client_structure_address',
  's.locality as client_structure_locality',
  'i.id as deposit_id',
  'i.number as deposit_number',
  'i.amount as deposit_amount',
];

const qSelect = () => db('quotations as q')
  .leftJoin('clients as c', 'c.id', 'q.client')
  .leftJoin('structures as s', 's.id', 'c.structure')
  .leftJoin('invoices as i', function joinDeposit() {
    this
      .on('i.quotation', '=', 'q.id')
      .andOn('i.type', '=', db.raw('?', ['deposit']));
  })
  .select(columns);

/**
 * Get all (active?) quotations
 */
exports.quotationsAll = async (req, res) => {
  qSelect()
    // .where('q.active', 1)
    .orderBy('q.number', 'desc')
    .options({ nestTables: true }) // doesn't work in SQLite
    .then((data) => Utils.formatRows(data))
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error retrieving quotations: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Get a quotation by its ID
 */
exports.quotationOne = async (req, res) => {
  qSelect()
    .where('q.id', req.query.id)
    // .andWhere('q.active', 1)
    .first()
    .options({ nestTables: true }) // doesn't work in SQLite
    .then((data) => Utils.formatRow(data))
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error retrieving quotation "${req.query.id}": ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Get the last quotation
 */
exports.quotationLast = async (req, res) => {
  qSelect()
    .orderBy('q.number', 'desc')
    .first()
    .options({ nestTables: true }) // doesn't work in SQLite
    .then((data) => Utils.formatRow(data))
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error retrieving the last quotation: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Get the average amount of all quotations
 */
exports.quotationAverage = async (req, res) => {
  db('quotations as q')
    .avg('q.amount as avg')
    .first()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error retrieving the average amount of the quotations: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Get the median amount of all quotations
 * @see https://stackoverflow.com/a/15766121
 */
exports.quotationMedian = async (req, res) => {
  db('quotations')
    .count('id as c')
    // .where('active', 1)
    .first()
    .then((data) => {
      const limit = 2 - (data.c % 2);
      const offset = (data.c - 1) / 2;

      return db('quotations')
        .select('amount')
        .orderBy('amount')
        .limit(limit)
        .offset(offset);
    })
    .then((response) => {
      const sum = response.reduce((previous, current) => (
        previous + current.amount
      ), 0);
      const median = sum / response.length;

      res.json({ median });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error retrieving the median amount of the quotations: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Add a quotation
 */
exports.quotationAdd = async (req, res) => {
  const {
    number,
    project,
    work,
    subtitle,
    amount,
    items,
    comment,
    client,
  } = req.body.data;

  db('quotations')
    .insert({
      number,
      project,
      work,
      subtitle,
      amount,
      items,
      comment,
      client,
    })
    .then(() => {
      res.json({ apiMessage: `The quotation "${number}" was created.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error creating ${number} quotation: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Edit a quotation
 */
exports.quotationEdit = async (req, res) => {
  const {
    number,
    project,
    work,
    subtitle,
    amount,
    items,
    comment,
    client,
  } = req.body.data;

  db('quotations')
    .where('id', req.body.id)
    .update({
      number,
      project,
      work,
      subtitle,
      amount,
      items,
      comment,
      client,
      updated_at: Utils.convertIso(new Date().toISOString()),
    })
    .then(() => {
      res.json({ apiMessage: `The quotation "${req.body.id}" was updated.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error updating ${req.body.id} quotation`,
        apiError: err.message,
      });
    });
};

/**
 * Validate a quotation
 */
exports.quotationValidate = async (req, res) => {
  db('quotations')
    .where('id', req.body.id)
    .update({
      status: 1,
      updated_at: Utils.convertIso(new Date().toISOString()),
    })
    .then(() => {
      res.json({ apiMessage: `The quotation "${req.body.id}" was validated.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error updating ${req.body.id} quotation`,
        apiError: err.message,
      });
    });
};

/**
 * Deactivate a quotation
 */
exports.quotationDeactivate = async (req, res) => {
  db('quotations')
    .where('id', req.body.id)
    .update({
      active: 0,
      updated_at: Utils.convertIso(new Date().toISOString()),
    })
    .then(() => {
      res.json({ apiMessage: `The quotation "${req.body.id}" was deactivated.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error deactivating ${req.body.id} quotation`,
        apiError: err.message,
      });
    });
};

/**
 * Delete a quotation
 */
exports.quotationDelete = async (req, res) => {
  db('quotations')
    .where('id', req.body.id)
    .del()
    .then(() => {
      res.json({ apiMessage: `The quotation #${req.body.id} was deleted.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error deleting quotation ${req.body.id}: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Delete all quotations
 */
exports.quotationsReset = async (req, res) => {
  db
    .select('*')
    .from('quotations')
    .truncate()
    .then(() => {
      res.json({ apiMessage: 'quotations table cleared.' });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error resetting quotations table: ${err}.`,
        apiError: err.message,
      });
    });
};
