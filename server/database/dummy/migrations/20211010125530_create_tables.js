exports.up = function up(knex) {
  return knex.schema
    .createTable('structures', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('alias').defaultTo(null);
      table.string('subtitle').defaultTo(null);
      table.string('siret').defaultTo(null);
      table.string('address').notNullable();
      table.string('locality').notNullable();
      table.timestamps(false, true);
    })
    .createTable('clients', (table) => {
      table.increments('id').primary();
      table.string('firstName').notNullable();
      table.string('lastName').notNullable();
      table.string('email').notNullable();
      table.string('phone').defaultTo(null);
      table.integer('structure').notNullable();
      table.timestamps(false, true);

      table.foreign('structure')
        .references('structures.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('quotations', (table) => {
      table.increments('id').primary();
      table.string('number').notNullable();
      table.string('project').notNullable();
      table.string('work').defaultTo(null);
      table.string('subtitle').defaultTo(null);
      table.integer('amount').notNullable();
      table.json('items').notNullable();
      table.string('comment').defaultTo(null);
      table.integer('status').notNullable().defaultTo(0);
      table.integer('active').notNullable().defaultTo(1);
      table.integer('client').notNullable();
      table.timestamps(false, true);

      table.foreign('client')
        .references('clients.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('invoices', (table) => {
      table.increments('id').primary();
      table.string('number').notNullable();
      table.string('type').notNullable().defaultTo('invoice');
      table.integer('status').notNullable().defaultTo(0);
      table.integer('amount').notNullable().defaultTo(0);
      table.json('discount').defaultTo(null);
      table.string('comment').defaultTo(null);
      table.integer('client').notNullable();
      table.integer('quotation').notNullable();
      table.timestamps(false, true);

      table.foreign('client')
        .references('clients.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.foreign('quotation')
        .references('quotations.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('payments', (table) => {
      table.increments('id').primary();
      table.string('type').notNullable();
      table.string('reference').notNullable();
      table.integer('invoice').notNullable();
      table.timestamps(false, true);

      table.foreign('invoice')
        .references('invoices.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });
};

exports.down = function down(knex) {
  return knex.schema
    .dropTable('payments')
    .dropTable('invoices')
    .dropTable('quotations')
    .dropTable('clients')
    .dropTable('structures');
};
