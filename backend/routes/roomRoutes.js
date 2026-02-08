const express =  require('express');
const roomRouter = express.Router();
const roomController = require('../controllers/Roomctrl');

console.log('== This is the roomController: ', roomController);
console.log('roomController:', roomController);
console.log('createRoom:', roomController.createRoom);
console.log('joinRoom:', roomController.joinRoom);


roomRouter.post('/createRoom', roomController.createRoom);
roomRouter.get('/joinRoom', roomController.joinRoom);

module.exports = roomRouter;