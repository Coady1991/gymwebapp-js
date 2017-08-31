'use strict';

const express = require('express');
const router = express.Router();

const dashboard = require('./controllers/dashboard.js');
const trainerDashboard = require('./controllers/trainerDashboard.js');
const about = require('./controllers/about.js');
const accounts = require('./controllers/accounts.js');
const updateProfile = require('./controllers/updateProfile.js');
const classes = require('./controllers/classes.js');
const bookings = require('./controllers/bookings.js');

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

router.post('/dashboard/addAssessment', dashboard.addAssessment);
router.get('/dashboard/deleteAssessment/:assessmentid', dashboard.deleteAssessment);

router.get('/classes', classes.index);
router.get('/classes/memberClassView', classes.memberClassView);
router.post('/classes/addClass', classes.addClass);
router.get('/classes/deleteClass/:classId', classes.deleteClass);
router.get('/classes/:classId/deleteExClass/:exClassid', classes.deleteExClass);

router.get('/classes/updateClass/:classId', classes.updateClass);
router.post('/classes/editClass/:classId', classes.editClass);

router.get('/classes/:classId/enrollInExClass/:exClassid', classes.enrollInExClass);
router.get('/classes/:classId/unenrollInExClass/:exClassid', classes.unenrollInExClass);
router.get('/classes/enrollInAllClasses/:classId', classes.enrollInAllClasses);
router.get('/classes/unenrollInAllClasses/:classId', classes.unenrollInAllClasses);

router.get('/bookings', bookings.index);
router.get('/bookings/memberBookings', bookings.memberBookingView);
router.post('/bookings/addTrainerBooking', bookings.addTrainerBooking);
router.post('/bookings/addMemberBooking', bookings.addMemberBooking);

module.exports = router;
