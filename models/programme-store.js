'use strict'

const _ = require('lodash');
const JsonStore = require('./json-store');

const programmeStore = {

  store: new JsonStore('./models/programme-store.json', { programmes: [] }),
  collection: 'programmes',

  getAllProgrammes() {
    return this.store.findAll(this.collection);
  },

  addProgramme(newProgramme) {
    this.store.add(this.collection, newProgramme);
    this.store.save();
  },

  getProgrammeById(programmeId) {
    return this.store.findOneBy(this.collection, { programmeId: programmeId });
  },

  getSessionById(programmeId, sessionId) {
    const programme = this.getProgrammeById(programmeId);
    for (let i = 0; i < programme.sessions.length; i++) {
      if (programme.session[i].sessionId === sessionId) {
        return programme.session[i];
      }
    }
  },

  deleteProgramme(programmeId) {
    const programme = this.getProgrammeById(programmeId);
    this.store.remove(this.collection, programme);
    this.store.save();
  },

  deleteSession(programmeId, sessionId) {
    const programme = this.getProgrammeById(programmeId);
    _.remove(programme.session, { sessionId: sessionId });
    this.store.save();
  },
};

module.exports = programmeStore;
