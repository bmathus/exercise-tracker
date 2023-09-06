const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('./routes/routes');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(router);

const start = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log('Your app is listening on port ' + listener.address().port);
    });
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

start();
