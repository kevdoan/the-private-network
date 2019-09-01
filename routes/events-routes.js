const db = require('../models');
const { getCommunity } = require('./auth/validate');
const wrap = fn => (...args) => fn(...args).catch(args[2]);

module.exports = function(app) {
  app.get('/api/events/', wrap( async function(req, res, next) {
    console.log('gettin events')
    const events = await db.Event.findAll();

    if(events.length === 0) {
      console.log('no results');
      res.status(501).send('No Events Here.\nMake One!');
    } else {
      res.status(200).json(events);
      console.log(events);
    }
  }));

  app.post('/api/events/create', wrap( async function(req, res, next) {
    console.log(req.body);
    const user = await db.User.findOne({
      where: {
        id: req.token.UserId
      }
    });

    const newEvent = await db.Event.create({
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      founderId: user
    });

    console.log(newEvent);
    res.status(200).json(newEvent);
  }));
}

