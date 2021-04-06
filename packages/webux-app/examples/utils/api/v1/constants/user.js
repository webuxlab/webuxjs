const blacklist = [
  'refreshToken',
  'email',
];

const privateBlacklist = [
  'refreshToken',
  'lostPassword',
];

const privateSelect =
  'fullname url';

const select = 'fullname url profilePicture';

module.exports = {
  blacklist,
  select,
  privateBlacklist,
  privateSelect,
};
