/* eslint-disable no-console */
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const clientsRouter = require('./routes/clients-route');
const invoicesRouter = require('./routes/invoices-route');
const paymentsRouter = require('./routes/payments-route');
const quotationsRouter = require('./routes/quotations-route');
const structuresRouter = require('./routes/structures-route');

const SERVER_PORT = process.env.PORT || 4001;

const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Implement routes
app.use('/clients', clientsRouter);
app.use('/invoices', invoicesRouter);
app.use('/payments', paymentsRouter);
app.use('/quotations', quotationsRouter);
app.use('/structures', structuresRouter);

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something is broken.');
});

app.use((req, res) => {
  res.status(404).send('Sorry we could not find this page.');
});

// Start the server
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on: ${SERVER_PORT}`);
});
