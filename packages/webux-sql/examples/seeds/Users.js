exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Users')
    .del()
    .then(() => knex('Users').insert([
      { id: 1, fullname: 'John Doe' },
      { id: 2, fullname: 'Jane Doe' },
      { id: 3, fullname: 'Junior Doe' },
    ]));
};
