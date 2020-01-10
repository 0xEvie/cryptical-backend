let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
var assert = require('chai').assert;

var request = require('supertest');
var app = require('../../app');
var mongoose = require('mongoose');

chai.use(require('chai-things'));
chai.use(chaiHttp);

const User = require('../../models/users');
const Event = require('../../models/userEvents');

describe('Event Routes', function () {
  describe('Un-authenticated', function () {
    var eventID = '5bdb6a1a46d5fb374330a7f4';
    describe('GET /events', function () {
      it('should return status 401', function (done) {
        chai.request(app)
          .get('/events/')
          .end(function (err, res) {
            expect(res).to.have.status(401);
            done();
          });
      });
    });

    describe('GET /event/event_id', function () {
      it('should return status 401', function (done) {
        chai.request(app)
          .get('/events/' + eventID)
          .end(function (err, res) {
            expect(res).to.have.status(401);
            done();
          });
      });
    });

    describe('DELETE /delete/event_id', function () {
      it('should return status 401', function (done) {
        chai.request(app)
          .del('/events/delete/' + eventID)
          .end(function (err, res) {
            expect(res).to.have.status(401);
            done();
          });
      });
    });

    describe('POST /add', function () {
      it('should return status 401', function (done) {
        var newEventDetails =
          {
            'title': 'my new event',
            'startdatetime': '2011-02-19T16:00:00Z',
            'enddatetime': '2011-03-19T16:00:00Z',
            'notes': 'test notes',
          };

        chai.request(app)
          .post('/events/add/')
          .send(newEventDetails)
          .end(function (err, res) {
            expect(res).to.have.status(401);
            done();
          });
      });
    });
    describe('PUT /edit/event_id', function () {
      it('should return status 401', function (done) {
        var editDetails =
          {
            'title': 'my edited event title',
            'startdatetime': '2011-02-19T16:00:00Z',
            'enddatetime': '2011-03-19T16:00:00Z',
            'notes':'my edited note',
          };

        chai.request(app)
          .put('/events/edit/' + eventID)
          .send(editDetails)
          .end(function (err, res) {
            expect(res).to.have.status(401);
            done();
          });
      });
    });
  });


  describe('Authenticated', function () {
    var authenticatedUser = request.agent(app); //superagent
    var eventID;
    var savedEvent;
    var savedUser;

    beforeEach(async function () {
      var user = new User();
      user.email = 'testuser@user.com';
      user.password = 'testuser';
      savedUser = await user.save();

      var event = new Event();
      event.title = 'my event title';
      event.startdatetime = '2016-05-18T16:00:00Z';
      event.enddatetime = '2016-06-18T16:00:00Z';
      event.notes = 'test notes';
      event.user = savedUser.id;
      savedEvent = await event.save();
      eventID = savedEvent.id;

      await authenticatedUser
        .post('/login')
        .send(
          {
            'email': user.email,
            'password': user.password,
          }
        );
    });

    afterEach(async function () {
      //Drop database after each test suite run
      await mongoose.connection.db.dropDatabase();
    });

    describe('GET /events', function () {
      it('should return an array of events with correct details', function (done) {
        authenticatedUser
          .get('/events/')
          .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.be.lengthOf(1);
            expect(res.body[0].title).to.equal(savedEvent.title);
            expect(new Date(res.body[0].startdatetime)).to.eql(savedEvent.startdatetime);
            expect(new Date(res.body[0].enddatetime)).to.eql(savedEvent.enddatetime);
            expect(res.body[0].notes).to.equal(savedEvent.notes);
            done();
          });
      });
    });

    describe('GET /event/event_id', function () {
      it('should return one event', function (done) {
        authenticatedUser
          .get('/events/' + eventID)
          .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.be.lengthOf(1);
            expect(res.body[0].title).to.equal(savedEvent.title);
            expect(new Date(res.body[0].startdatetime)).to.eql(savedEvent.startdatetime);
            expect(new Date(res.body[0].enddatetime)).to.eql(savedEvent.enddatetime);
            expect(res.body[0].notes).to.equal(savedEvent.notes);
            done();
          });
      });
    });

    describe('DELETE /delete/event_id', function () {
      it('should delete event', function (done) {
        authenticatedUser
          .del('/events/delete/' + eventID)
          .end(function (err, res) {

            Event.findById(eventID, function (event) {
              expect(event).to.not.exist;

              //Front-end response
              expect(res).to.have.status(200);
              expect(res.text).to.equal('Successfully deleted event!');
              done();
            });
          });
      });
    });

    describe('POST /add', function () {
      it('should return error when given invalid details', function (done) {
        var newEventDetails =
          {
            'title': '',
            'startdatetime': '2010-02-20T16:00:00Z',
            'enddatetime': '',
            'notes': '',
          };

        authenticatedUser
          .post('/events/add/')
          .send(newEventDetails)
          .end(function (err, res) {

            Event.findOne({
              title: newEventDetails.title,
              startdatetime: newEventDetails.startdatetime,
              enddatetime: newEventDetails.enddatetime,
              notes: newEventDetails.notes,
            })
              .then((event) => {
                assert.notExists(event, 'Event added when it should not have');
                //Front-end response
                expect(res).to.have.status(500);
                done();
              });
          });
      });

      it('should add event', function (done) {
        var newEventDetails =
          {
            'title': 'my new event',
            'startdatetime': '2013-05-20T16:00:00Z',
            'enddatetime': '2013-06-20T16:00:00Z',
            'notes': 'test note',
          };

        authenticatedUser
          .post('/events/add/')
          .send(newEventDetails)
          .end(function (err, res) {

            Event.findOne({
              title: newEventDetails.title,
              startdatetime: newEventDetails.startdatetime,
              enddatetime: newEventDetails.enddatetime,
              notes: newEventDetails.notes,
            })
              .then((event) => {
                assert.exists(event, 'Event not added correctly');
                eventID = event.id;
                //Front-end response
                expect(res).to.have.status(200);
                expect(res.text).to.equal('Event "' + newEventDetails.title + '" Added!');
                done();
              });
          });
      });
    });

    describe('PUT /edit/event_id', function () {
      it('should return error with invalid details', function (done) {
        var editDetails =
          {
            'title': '',
            'startdatetime': '2011-02-19T16:00:00.000Z',
            'enddatetime': '2011-03-19T16:00:00.000Z',
            'notes': 'test notes',
          };

        authenticatedUser
          .put('/events/edit/' + eventID)
          .send(editDetails)
          .end(function (err, res) {
            expect(res).to.have.status(500);
            done();
          });
      });

      it('should edit event', function (done) {
        var editDetails =
          {
            'title': 'my edited event title',
            'startdatetime': '2011-02-19T16:00:00.000Z',
            'enddatetime': '2011-02-19T16:00:00.000Z',
            'notes': 'edit test note',
          };

        authenticatedUser
          .put('/events/edit/' + eventID)
          .send(editDetails)
          .end(function (err, res) {
            //Expect saved doc in response to be new edited event
            expect(res.body.title).to.equal(editDetails.title);
            expect(res.body.startdatetime).to.equal(editDetails.startdatetime);
            expect(res.body.enddatetime).to.equal(editDetails.enddatetime);
            expect(res.body.notes).to.equal(editDetails.notes);
            expect(res).to.have.status(200);
            done();
          });
      });
    });
  });
});



