const express = require('express');

const quotationsRoutes = require('../controllers/quotations-controller');

const router = express.Router();

/**
 * In `server.js`, quotations route is specified as '/quotations'
 * this means that '/all' translates to '/quotations/all'
 */
// GET request to retrieve all quotations
router.get('/all', quotationsRoutes.quotationsAll);

// GET request to retrieve a quotation
router.get('/one', quotationsRoutes.quotationOne);
router.get('/last', quotationsRoutes.quotationLast);

// GET request to get the average of all quotations amount
router.get('/average', quotationsRoutes.quotationAverage);
router.get('/median', quotationsRoutes.quotationMedian);

// POST request to add a quotation
router.post('/add', quotationsRoutes.quotationAdd);

// PUT request to edit a quotation (by its ID)
router.put('/edit', quotationsRoutes.quotationEdit);
router.put('/validate', quotationsRoutes.quotationValidate);
router.put('/deactivate', quotationsRoutes.quotationDeactivate);

// PUT request to delete a quotation (by its ID)
router.put('/delete', quotationsRoutes.quotationDelete);

// PUT request to delete all quotations
router.put('/reset', quotationsRoutes.quotationsReset);

module.exports = router;
