'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const userStore = require('../models/user-store');
const analytics = require('../utils/analytics');
const uuid = require('uuid');

const updateProfile = {
  index(request, response) {
    logger.info('updateProfile rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      user: loggedInUser,
    };
    logger.info('about to render');
    response.render('updateProfile', viewData);
  },

  setFirstName(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.firstName = request.body.firstName;
    userStore.store.save();
    response.redirect('/updateProfile');
  },

  setLastName(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.lastName = request.body.lastName;
    userStore.store.save();
    response.redirect('/updateProfile');
  },

  setGender(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.gender = request.body.gender;
    userStore.store.save();
    response.redirect('/updateProfile');
  },

  setEmail(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.email = request.body.email;
    userStore.store.save();
    response.redirect('/updateProfile');
  },

  setPassword(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.password = request.body.password;
    userStore.store.save();
    response.redirect('/updateProfile');
  },

  setAddress(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.address = request.body.address;
    userStore.store.save();
    response.redirect('/updateProfile');
  },

  setHeight(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.height = request.body.height;
    userStore.store.save();
    response.redirect('/updateProfile');
  },

  setWeight(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.weight = request.body.weight;
    userStore.store.save();
    response.redirect('/updateProfile');
  },

};

module.exports = updateProfile;