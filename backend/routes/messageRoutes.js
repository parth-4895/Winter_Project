const express =  require('express');
const messRouter = express.Router();
const messController = require('../controllers/Messagectrl');

console.log('== This is the messageController: ', messController);

console.log('sendMessage:', messController.sendMessage);
console.log('receiveMessage:', messController.receiveMessage);


messRouter.post('/upload', messController.sendMessage);
messRouter.get('/download', messController.receiveMessage);

module.exports = messRouter;