const express =  require('express');
const fileRouter = express.Router();
const fileController = require('../controllers/Filectrl');

fileRouter.post('/upload', fileController.uploadFile);
fileRouter.get('/download', fileController.downloadFile);

module.exports = fileRouter;

