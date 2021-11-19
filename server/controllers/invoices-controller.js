const db = require('../database/db');
const Utils = require('../utils');

const columns = [
  'i.id',
  'i.number',
  'i.type',
  'i.status',
  'i.created_at as createdAt',
  'i.amount',
  'i.discount',
  'i.comment',
  'i.client',
  'i.quotation',
  'q.id as quotation_id',
  'q.number as quotation_number',
  'q.project as quotation_project',
  'q.work as quotation_work',
  'q.subtitle as quotation_subtitle',
  'q.amount as quotation_amount',
  'q.items as quotation_items',
  'q.status as quotation_status',
  'q.comment as quotation_comment',
  'q.client as quotation_client',
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
  'd.id as deposit_id',
  'd.number as deposit_number',
  'd.amount as deposit_amount',
  'd.created_at as deposit_createdAt',
];

const iSelect = () => db('invoices as i')
  .leftJoin('quotations as q', 'q.id', 'i.quotation')
  .leftJoin('clients as c', 'c.id', 'i.client')
  .leftJoin('structures as s', 's.id', 'c.structure')
  .leftJoin('invoices as d', function joinDeposit() {
    this
      .on('d.quotation', '=', 'i.quotation')
      .andOn('i.type', '=', db.raw('?', ['invoice']))
      .andOn('d.type', '=', db.raw('?', ['deposit']));
  })
  .select(columns);

/**
 * Get all invoices
 */
exports.invoicesAll = async (req, res) => {
  iSelect()
    .orderBy('i.number', 'desc')
    .options({ nestTables: true }) // doesn't work in SQLite
    .then((data) => Utils.formatRows(data))
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error retrieving invoices: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Get some invoices
 */
exports.invoicesSome = async (req, res) => {
  iSelect()
    .where(req.query)
    .orderBy('i.number', 'desc')
    .options({ nestTables: true }) // doesn't work in SQLite
    .then((data) => Utils.formatRows(data))
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error retrieving invoices: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Get an invoice by its ID
 */
exports.invoiceOne = async (req, res) => {
  iSelect()
    .where('i.id', req.query.id)
    .first()
    .options({ nestTables: true }) // doesn't work in SQLite
    .then((data) => Utils.formatRow(data))
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error retrieving invoice "${req.query.id}": ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Get the last invoice
 */
exports.invoiceLast = async (req, res) => {
  iSelect()
    .orderBy('i.number', 'desc')
    .first()
    .options({ nestTables: true }) // doesn't work in SQLite
    .then((data) => Utils.formatRow(data))
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error retrieving the last invoice: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Get the total of invoices amount
 */
exports.invoiceTotal = async (req, res) => {
  const totalQueryBuilder = db('invoices as i');

  if (req.query.groupBy) {
    // totalQueryBuilder.groupBy(req.body.groupBy);
    totalQueryBuilder
      .select(
        'i.status',
        db.raw('strftime("%Y", i.updated_at) as year'),
        db.raw('strftime("%m", i.updated_at) as month'),
        db.raw('SUM(i.amount) as total'),
      )
      .groupBy('year', 'month', 'i.status');
  } else {
    totalQueryBuilder.sum({ total: 'amount' });
  }

  totalQueryBuilder
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error calculating the total: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Add an invoice
 */
exports.invoiceAdd = async (req, res) => {
  const {
    number,
    type,
    amount,
    discount,
    comment,
    client,
    quotation,
  } = req.body.data;

  db('invoices')
    .insert({
      number,
      type,
      amount,
      discount,
      comment,
      client,
      quotation,
    })
    .then(() => {
      res.json({ apiMessage: `The invoice "${number}" was created.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error creating ${number} invoice: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Edit an invoice
 */
exports.invoiceEdit = async (req, res) => {
  const {
    number,
    status,
    amount,
    discount,
    comment,
    client,
    quotation,
  } = req.body.data;

  db('invoices')
    .where('id', req.body.id)
    .update({
      number,
      status,
      amount,
      discount,
      comment,
      client,
      quotation,
      updated_at: Utils.convertIso(new Date().toISOString()),
    })
    .then(() => {
      res.json({ apiMessage: `The invoice "${req.body.id}" was updated.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error updating ${req.body.id} invoice`,
        apiError: err.message,
      });
    });
};

/**
 * Validate an invoice
 */
exports.invoiceValidate = async (req, res) => {
  db('invoices')
    .where('id', req.body.id)
    .update({
      status: 1,
      updated_at: Utils.convertIso(new Date().toISOString()),
    })
    .then(() => {
      res.json({ apiMessage: `The invoice "${req.body.id}" was marked as paid.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error updating ${req.body.id} invoice`,
        apiError: err.message,
      });
    });
};

/**
 * Delete an invoice
 */
exports.invoiceDelete = async (req, res) => {
  db('invoices')
    .where('id', req.body.id)
    .del()
    .then(() => {
      res.json({ apiMessage: `The invoice #${req.body.id} was deleted.` });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error deleting invoice ${req.body.id}: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Delete all invoices
 */
exports.invoicesReset = async (req, res) => {
  db
    .select('*')
    .from('invoices')
    .truncate()
    .then(() => {
      res.json({ apiMessage: 'invoices table cleared.' });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error resetting invoices table: ${err}.`,
        apiError: err.message,
      });
    });
};
