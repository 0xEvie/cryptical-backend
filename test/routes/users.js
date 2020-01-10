let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;

var request = require('supertest');
var app = require('../../app');
var mongoose = require('mongoose');

chai.use(require('chai-things'));
chai.use(chaiHttp);

const User = require('../../models/users');

describe('User Routes', function () {
  var authenticatedUser = request.agent(app); //superagent
  var userID;

  describe('Login', function () {
    beforeEach('Creating User', async function () {
      var user = new User();
      user.email = 'testuser@user.com';
      user.password = 'testuser';
      var savedUser = await user.save();
      userID = savedUser.id;
    });

    afterEach('Dropping database', async function () {
      await mongoose.connection.db.dropDatabase();
    });

    it('should login successfully with correct details', function (done) {
      authenticatedUser
        .post('/login')
        .send(
          {
            'email': 'testuser@user.com',
            'password': 'testuser',
          }
        )
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should return an error with incorrect details', function (done) {
      authenticatedUser
        .post('/login')
        .send(
          {
            'email': 'incorrectuser@user.com',
            'password': 'testuser',
          }
        )
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return an error with invalid details', function (done) {
      authenticatedUser
        .post('/login')
        .send(
          {
            'email': 'incorrectuser',
            'password': 'testuser',
          }
        )
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  describe('Register', function () {
    beforeEach('Creating test user', async function () {
      //Create user for boundary case
      var user = new User();
      user.email = 'testuser@user.com';
      user.password = 'testuser';
      var savedUser = await user.save();
      userID = savedUser.id;
    });

    afterEach('Dropping database', async function () {
      //Drop database after each test suite run
      await mongoose.connection.db.dropDatabase();
    });

    it('should login successfully with correct details' , function (done) {

      //Checks if you can register without error
      authenticatedUser
        .post('/register')
        .send(
          {
            'email': 'testuser2@user.com',
            'password': 'testuser2',
          }
        )
        .end(function (err, res) {
          expect(res).to.have.status(200);

          //Checks if you can log in without error
          authenticatedUser
            .post('/login')
            .send(
              {
                'email': 'testuser2@user.com',
                'password': 'testuser2',
              }
            )
            .end(function (err, res) {
              expect(res).to.have.status(200);
              done();
            });
        });
    });

    it('should return error when invalid details passed', function (done) {
      //Checks if you can register without error
      authenticatedUser
        .post('/register')
        .send(
          {
            'email': 'notanemail',
            'password': 'password',
          }
        )
        .end(function (err, res) {
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  describe('Logout', function () {
    beforeEach('Creating test user and logging in', async function () {
      //Create user for boundary case
      var user = new User();
      user.email = 'testuser@user.com';
      user.password = 'testuser';
      var savedUser = await user.save();
      userID = savedUser.id;

      await authenticatedUser
        .post('/login')
        .send(
          {
            'email': 'testuser@user.com',
            'password': 'testuser',
          }
        );
    });

    afterEach('Dropping Database', async function () {
      //Drop database after each test suite run
      await mongoose.connection.db.dropDatabase();
    });

    it('should log user out correctly', function (done) {
      //Checks if you can register without error
      authenticatedUser
        .get('/logout')
        .end(function (err, res) {
          expect(res).to.have.status(200);

          //Checks if you can log in and get a 401
          authenticatedUser
            .get('/events/')
            .end(function (err, res) {
              expect(res).to.have.status(401);
              done();
            });
        });
    });
  });
  after((done) => {
    mongoose.connection.close(done);
  });
});




