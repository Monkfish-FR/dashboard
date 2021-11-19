const express = require('express');

const structuresRoutes = require('../controllers/structures-controller');

const router = express.Router();

/**
 * In `server.js`, structures route is specified as '/structures'
 * this means that '/all' translates to '/structures/all'
 */
// GET request to retrieve all structures
router.get('/all', structuresRoutes.structuresAll);

// GET request to retrieve a structure
router.get('/one', structuresRoutes.structureOne);

// POST request to add a structure
router.post('/add', structuresRoutes.structureAdd);

// PUT request to edit a structure (by its ID)
router.put('/edit', structuresRoutes.structureEdit);

// PUT request to delete a structure (by its ID)
router.put('/delete', structuresRoutes.structureDelete);

// PUT request to delete all structures
router.put('/reset', structuresRoutes.structuresReset);

module.exports = router;
