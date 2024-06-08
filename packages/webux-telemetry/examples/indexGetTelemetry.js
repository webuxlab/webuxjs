// eslint-disable-next-line import/no-extraneous-dependencies
import express from 'express';

const app = express();
const port = 3002;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// curl http://localhost:3002/telemetry
app.all('/telemetry', async (req, res) => {
  console.debug(JSON.stringify(req.body, null, 2));
  res.json({
    statusCode: 200,
    body: JSON.stringify({ message: 'Data successfully saved !', data: req.body }),
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
