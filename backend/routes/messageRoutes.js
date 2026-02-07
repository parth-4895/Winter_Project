const express =  require('express');
const messRouter = express.Router();
const messController = require('../controllers/Filectrl');

messRouter.post('/upload', messController.uploadFile);
messRouter.get('/download', messController.downloadFile);

module.exports = messRouter;