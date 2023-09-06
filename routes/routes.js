const express = require('express');
const path = require('path');

const { Model } = require('../models/models');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.post('/api/users', async (req, res) => {
  const user = new Model({
    username: req.body.username,
    count: 0,
    log: [],
  });
  try {
    const savedUser = await user.save();
    return res.json({
      username: savedUser.username,
      _id: savedUser._id,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
});

router.get('/api/users', async (req, res) => {
  const users = await Model.find({}).select('username __v');
  return res.json(users);
});

router.post('/api/users/:_id/exercises', async (req, res) => {
  const { description, duration, date } = req.body;

  try {
    const user = await Model.findById(req.params._id);
    if (!user) {
      return res.json({
        message: `User with id:${req.params._id} not found!`,
      });
    }
    const exercise = {
      description: description,
      duration: Number(duration),
      date: date === '' ? new Date() : new Date(date),
    };

    user.log.push(exercise);
    user.count = user.count + 1;

    const savedUser = await user.save();

    return res.json({
      _id: savedUser._id,
      username: savedUser.username,
      date: exercise.date.toDateString(),
      duration: exercise.duration,
      description: exercise.description,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
});

router.get('/api/users/:_id/logs', async (req, res) => {
  const { from, to, limit } = req.query;
  const fromDate = new Date(from);
  const toDate = new Date(to);

  const user = await Model.findOne({ _id: req.params._id }).select({
    'log._id': 0,
    __v: 0,
  });

  if (!user) {
    return res.json({
      error: 'Could not find user!',
    });
  }

  const filteredLogs = user.log.filter((exercise) => {
    if ((from && exercise.date < fromDate) || (to && exercise.date > toDate)) {
      return false;
    }
    return true;
  });

  if (limit) {
    user.log = filteredLogs.slice(0, Number(limit));
  } else {
    user.log = filteredLogs;
  }

  const formattedUser = {
    ...user._doc,
    log: user.log.map((logEntry) => ({
      ...logEntry._doc,
      date: logEntry.date.toDateString(),
    })),
  };

  return res.json(formattedUser);
});

module.exports = router;
