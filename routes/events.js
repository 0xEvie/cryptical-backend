var express = require('express');
var router = express.Router();
const Event = require('../models/userEvents');
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

/* GET specific user event*/
router.getEvent = function (req, res)
{
  var event_id = req.params.event_id;
  var user = req.user;

  Event.find({_id: event_id, user: user}, function (err, data)
  {
    if (err)
      res.status(500).send(err);
    else
      res.send(data);
  });
};

router.getAllEvents = function (req, res)
{
  var user = req.user;

  Event.find({user: user}, function (err, data)
  {
    if (err)
      res.status(500).send(err);
    else
      res.send(data);
  });
};

router.addEvent = function (req, res)
{
  var user = req.user;

  req.checkBody('title', 'Event title is required').notEmpty();
  req.checkBody('title', 'Event title must be a string').notEmpty().isString();
  req.checkBody('startdatetime', 'Event datetime is required').notEmpty();
  req.checkBody('enddatetime', 'Event datetime is required').notEmpty();


  var errors = req.validationErrors();

  if (errors)
  {
    res.status(500).send(errors);
  }
  else
  {
    var newEvent = new Event();
    newEvent.title = req.body.title;
    newEvent.startdatetime = req.body.startdatetime;
    newEvent.enddatetime = req.body.enddatetime;
    newEvent.notes = req.body.notes;
    newEvent.user = user;

    newEvent.save(function (err)
    {
      if (err)
        res.status(500).send(errors);
      else
        res.send('Event "' + newEvent.title + '" Added!');
    });
  }
};

router.deleteEvent = function (req, res)
{
  var event_id = req.params.event_id;
  var user = req.user;

  Event.findOneAndDelete({_id: event_id, user: user}, function (err)
  {
    if (err)
      res.status(500).send(err);
    else
      res.send('Successfully deleted event!');
  });
};

router.editEvent = function (req, res)
{
  req.checkBody('title', 'Event title is required').notEmpty();
  req.checkBody('title', 'Event title must be a string').notEmpty().isString();
  req.checkBody('startdatetime', 'Event datetime is required').notEmpty();
  req.checkBody('startdatetime', 'Event datetime must be in date format ie. DD/MM/YY').notEmpty();
  req.checkBody('enddatetime', 'Event datetime is required').notEmpty();
  req.checkBody('enddatetime', 'Event datetime must be in date format ie. DD/MM/YY').notEmpty();

  var errors = req.validationErrors();

  var event_id = req.params.event_id;
  var eventTitle = req.body.title;
  var eventstartdatetime = req.body.startdatetime;
  var eventenddatetime = req.body.enddatetime;
  var notes = req.body.notes;
  var user = req.user;

  if (errors)
  {
    res.status(500).send(errors);
  }
  else
  {
    Event.findOneAndUpdate(
      {_id: event_id, user:user}, {
        $set:
          {
            title: eventTitle,
            startdatetime: eventstartdatetime,
            enddatetime: eventenddatetime,
            notes: notes,
          }
      },{new: true}, function (err, doc)
      {
        if (err)
          res.status(500).send(err);
        else
        {
          doc.save().then(function(doc)
          {
            res.setHeader('Content-Type', 'application/json');
            res.send(doc);
          });
        }
      });
  }
};

function ensureAuthenticated(req, res, next)
{
  if (req.isAuthenticated())
  {
    return next();
  } else
  {
    res.status(401).send('You\'re not logged in');
  }
}

/* GET All users events*/
router.get('/', ensureAuthenticated, router.getAllEvents);

/* GET specific user event*/
router.get('/:event_id', ensureAuthenticated, router.getEvent);

/* Add Event */
router.post('/add', ensureAuthenticated, router.addEvent);

/* Delete Event */
router.delete('/delete/:event_id', ensureAuthenticated, router.deleteEvent);

/* edit event */
router.put('/edit/:event_id', ensureAuthenticated, router.editEvent);

module.exports = router;
