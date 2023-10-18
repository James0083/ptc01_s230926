// server.js
const express = require('express');
const app = express();

app.get('/api/some-endpoint', (req, res) => {
  // Simulate a server error (500 Internal Server Error)
  res.status(500).send('Internal Server Error');
});

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = server;
