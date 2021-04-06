const route = async (req, res) => res.status(200).json({ msg: 'Find !', user: req.user });

module.exports = { route };
