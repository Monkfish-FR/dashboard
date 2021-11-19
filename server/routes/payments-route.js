const express = require('express');

const paymentsRoutes = require('../controllers/payments-controller');

const router = express.Router();

/**
 * In `server.js`, payments route is specified as '/payments'
 * this means that '/all' translates to '/payments/all'
 */
// GET request to retrieve all payments
router.get('/some', paymentsRoutes.paymentsSome);

// POST request to add a payment
router.post('/add', paymentsRoutes.paymentAdd);

module.exports = router;
