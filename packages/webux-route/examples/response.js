/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const WebuxRoute = require('../src/index');

const app = express();

const webuxRoute = new WebuxRoute();

// Static Function
webuxRoute.LoadResponse(app);

app.get('/success', (req, res) => {
  res.success({ message: 'success' }, 'success', 'success');
});

app.get('/created', (req, res) => {
  res.created({ message: 'created' }, 'created', 'created');
});

app.get('/updated', (req, res) => {
  res.updated({ message: 'updated' }, 'updated', 'updated');
});

app.get('/deleted', (req, res) => {
  res.deleted({ message: 'deleted' }, 'deleted', 'deleted');
});

app.get('/forbidden', (req, res) => {
  // msg, devMsg
  res.forbidden();
});

app.get('/badrequest', (req, res) => {
  // msg, devMsg
  res.badRequest();
});

app.get('/servererror', (req, res) => {
  // msg, devMsg
  res.serverError();
});

app.get('/notFound', (req, res) => {
  // msg, devMsg
  res.notFound();
});

app.get('/unprocessable', (req, res) => {
  // msg, devMsg
  res.unprocessable();
});

app.get('/custom', (req, res) => {
  res.custom(200, { message: 'Custom  response', user: 'User Name' });
});

app.listen(1337, () => {
  console.log('Server is listening on port 1337');
});
