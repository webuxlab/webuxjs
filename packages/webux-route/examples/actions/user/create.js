const route = async (req, res) => {
  await setTimeout(() => {
    console.log("I'm doing something great, ");
  }, 5000);

  return res.status(200).send('Create !');
};

module.exports = { route };
