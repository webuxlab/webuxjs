const express = require('express');

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/telemetry', (req, res) => {
  console.log(req.body);
  res.json({
    statusCode: 200,
    body: JSON.stringify({ message: 'Data successfully saved !', data: req.body }),
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
