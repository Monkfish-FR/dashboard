# Manage the Database

We are using Knex [https://knexjs.org/] to build SQL queries for SQLite.

The Knex configuration is set in the `knexfile.js` and all the requirements are in this `database` folder :
- the database – `database.sqlite`
- the migrations folder – `migrations/`
- the seeds folder – `seeds/`

## Migrations

_documentation: [https://knexjs.org/#Migrations]_

To create a new migration file, a script is added to the `package.json` file to easily run the command:

```bash
yarn run migrate:make migration_name
```

It's create a new file `date_name.js`, with 2 functions:
- `up()` to write the ended database changes
- `down()` to undo these changes

To run the migration file, run the following command:

```bash
yarn run migrate:update
```

To cancel the changes, run the following command:

```bash
yarn run migrate:rollback
```

## Seeds

_documentation: [https://knexjs.org/#Seeds]_

On the same way, run these commands to populate the database:
```bash
yarn run seed:make seed_name
yarn run seed:run
```
