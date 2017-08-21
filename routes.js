'use strict';

const express = require('express');
const router = express.Router();

const dashboard = require('./controllers/dashboard.js');
const trainerDashboard = require('./controllers/trainerDashboard.js');
const about = require('./controllers/about.js');
const accounts = require('./controllers/accounts.js');
const updateProfile = require('./controllers/updateProfile.js');

router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);

router.get('/dashboard', dashboard.index);
router.get('/about', about.index);

router.get('/updateProfile', updateProfile.index);
router.post('/updateProfile/setFirstName', updateProfile.setFirstName);
router.post('/updateProfile/setLastName', updateProfile.setLastName);
router.post('/updateProfile/setGender', updateProfile.setGender);
router.post('/updateprofile/setEmail', updateProfile.setEmail);
router.post('/updateProfile/setPassword', updateProfile.setPassword);
router.post('/updateProfile/setAddress', updateProfile.setAddress);
router.post('/updateProfile/setHeight', updateProfile.setHeight);
router.post('/updateProfile/setWeight', updateProfile.setWeight);

router.get('/trainerDashboard', trainerDashboard.index);
router.get('/trainerDashboard/trainerView/:id', trainerDashboard.trainerView);
router.get('/trainerDashboard/deleteUser/:id', trainerDashboard.deleteUser);
router.post('/trainerDashboard/:id/addComment/:assessmentid', trainerDashboard.addComment);

router.get('/trainerDashboard/classView', trainerDashboard.classView);

router.post('/dashboard/addAssessment', dashboard.addAssessment);
router.get('/dashboard/deleteAssessment/:assessmentid', dashboard.deleteAssessment);

module.exports = router;
