const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('E.G. Wallet Backend is running!');
});

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});