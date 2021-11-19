const express = require('express');

const clientsRoutes = require('../controllers/clients-controller');

const router = express.Router();

/**
 * In `server.js`, clients route is specified as '/clients'
 * this means that '/all' translates to '/clients/all'
 */
// GET request to retrieve all clients
router.get('/all', clientsRoutes.clientsAll);

// GET request to retrieve a client
router.get('/one', clientsRoutes.clientOne);

// POST request to add a client
router.post('/add', clientsRoutes.clientAdd);

// PUT request to edit a client (by its ID)
router.put('/edit', clientsRoutes.clientEdit);

// PUT request to delete a client (by its ID)
router.put('/delete', clientsRoutes.clientDelete);

// PUT request to delete all clients
router.put('/reset', clientsRoutes.clientsReset);

module.exports = router;
