const express = require('express');

const invoicesRoutes = require('../controllers/invoices-controller');

const router = express.Router();

/**
 * In `server.js`, invoices route is specified as '/invoices'
 * this means that '/all' translates to '/invoices/all'
 */
// GET request to retrieve all invoices
router.get('/all', invoicesRoutes.invoicesAll);
router.get('/some', invoicesRoutes.invoicesSome);

// GET request to retrieve a invoice
router.get('/one', invoicesRoutes.invoiceOne);
router.get('/last', invoicesRoutes.invoiceLast);

// GET request to retrieve total of invoices
router.get('/total', invoicesRoutes.invoiceTotal);

// POST request to add a invoice
router.post('/add', invoicesRoutes.invoiceAdd);

// PUT request to edit a invoice (by its ID)
router.put('/edit', invoicesRoutes.invoiceEdit);
router.put('/validate', invoicesRoutes.invoiceValidate);

// PUT request to delete a invoice (by its ID)
router.put('/delete', invoicesRoutes.invoiceDelete);

// PUT request to delete all invoices
router.put('/reset', invoicesRoutes.invoicesReset);

module.exports = router;
