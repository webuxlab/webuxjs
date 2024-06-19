/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('Users').del()
  await knex('Users').insert([
    {id: 1, fullname: 'rowValue1'},
    {id: 2, fullname: 'rowValue2'},
    {id: 3, fullname: 'rowValue3'}
  ]);
};
