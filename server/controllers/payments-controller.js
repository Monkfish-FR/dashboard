const db = require('../database/db');
const Utils = require('../utils');

const columns = [
  'p.id',
  'p.type',
  'p.reference',
  'p.invoice',
  'p.created_at as createdAt',
];

/**
 * Get some payments
 */
exports.paymentsSome = async (req, res) => {
  db('payments as p')
    .select(columns)
    .where(req.query)
    .options({ nestTables: true }) // doesn't work in SQLite
    .then((data) => Utils.formatRows(data))
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error retrieving payments: ${err}`,
        apiError: err.message,
      });
    });
};

/**
 * Add a payment
 */
exports.paymentAdd = async (req, res) => {
  const {
    type,
    reference,
    invoice,
  } = req.body.data;

  db('payments')
    .insert({
      type,
      reference,
      invoice,
    })
    .then(() => {
      res.json({ apiMessage: 'The payment was created.' });
    })
    .catch((err) => {
      res.json({
        apiMessage: `There was an error creating the payment for invoice ${invoice}: ${err}`,
        apiError: err.message,
      });
    });
};
