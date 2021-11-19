const knex = require('knex');
const knexConfig = require('./knexfile');

// Create connection to SQLite database
// const db = knex(knexConfig.development);
const dbConfig = process.env.DB_CONFIG || 'development';
const db = knex(knexConfig[dbConfig]);

// Example to create a table named 'structures'
// db.schema
//   .hasTable('structures')
//   .then((exists) => {
//     if (!exists) {
//       return db.schema
//         .createTable('structures', (table) => {
//           table.increments('id').primary();
//           table.string('title').notNullable();
//           table.string('alias');
//           table.string('subtitle');
//           table.string('siret');
//           table.string('address').notNullable();
//           table.string('locality').notNullable();
//         })
//         .then(() => {
//           console.log('Table "Structures" created');
//         })
//         .catch((error) => {
//           console.error(`There was an error creating 'Structures' table: ${error}`);
//         });
//     }

//     return true;
//   })
//   .then(() => {
//     console.log('done');
//   })
//   .catch((error) => {
//     console.error(`There was an error setting up the database: ${error}`);
//   });

module.exports = db;
