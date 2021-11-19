const structuresData = require('../data/structures');
const clientsData = require('../data/clients');
const quotationsData = require('../data/quotations');
const invoicesData = require('../data/invoices');

exports.seed = function seed(knex) {
  // Deletes ALL existing entries (think about foreign keys!)
  return knex('invoices').del()
    .then(() => knex('quotations').del())
    .then(() => knex('clients').del())
    .then(() => knex('structures').del())
    .then(() => (
      knex('structures').insert(structuresData)
    ))
    .then(() => (
      knex('clients').insert(clientsData)
    ))
    .then(() => (
      knex('quotations').insert(quotationsData)
    ))
    .then(() => (
      knex('invoices').insert(invoicesData)
    ));
};
