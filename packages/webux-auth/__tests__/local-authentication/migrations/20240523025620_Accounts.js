// npx knex migrate:latest
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('accounts', function (table) {
    table.increments('id');
    table.string('username', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('accounts');
};
