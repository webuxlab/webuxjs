exports.up = function (knex) {
  return knex.schema.createTable('Users', (table) => {
    table.increments(); // id (PK)
    table.string('fullname').unique(); // fullname (varchar(255))
    table.timestamps(); // created_at & updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Users');
};
