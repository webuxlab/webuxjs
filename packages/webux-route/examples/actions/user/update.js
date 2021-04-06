const route = async (req, res) => {
  await setTimeout(() => {
    console.log("I'm doing something great, ");
  }, 5000);

  console.log(req.params.id);

  return res.status(200).send('Update !');
};

module.exports = { route };
