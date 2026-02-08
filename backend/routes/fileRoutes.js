const express =  require('express');
const fileRouter = express.Router();
const fileController = require('../controllers/Filectrl');

console.log('== This is the fileController: ', fileController);
console.log('uploadFile:', fileController.uploadFile);
console.log('downloadFile:', fileController.getFile);


fileRouter.post('/upload', fileController.uploadFile);
fileRouter.get('/download', fileController.getFile);

module.exports = fileRouter;

