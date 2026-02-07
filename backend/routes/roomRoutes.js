const express =  require('express');
const roomRouter = express.Router();
const roomController = require('../controllers/Filectrl');

roomRouter.post('/upload', roomController.uploadFile);
roomRouter.get('/download', roomController.downloadFile);

module.exports = roomRouter;