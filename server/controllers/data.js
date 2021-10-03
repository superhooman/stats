const express = require('express');
const verify = require('../utils/verify');

const uploader = require('../utils/uploader');

const upload = require('../handlers/data/upload');
const getData = require('../handlers/data/dashboard')
const byKey = require('../handlers/data/key');
const finish = require('../handlers/data/finish');
const add = require('../handlers/data/add');
const edit = require('../handlers/data/edit');

const vaccinations = require('../handlers/data/vaccinations')

class DataController {
  constructor() {
    this.path = '/data';
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/', getData);
    this.router.get('/key', byKey);
    this.router.get('/finish/:id', verify, finish)
    this.router.post('/add', verify, add);
    this.router.post('/edit/:id', verify, edit);
    this.router.post('/upload', [verify, uploader.single('file')], upload);

    this.router.get('/vaccinations', vaccinations.getOffice);
    this.router.post('/vaccinations', vaccinations.addOffice);
    this.router.post('/vaccinations/:id', vaccinations.editOffice);
    this.router.delete('/vaccinations/:id', vaccinations.removeOffice);
  }
}

module.exports = DataController;
