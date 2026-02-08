const express = require('express');
const app = express();
const cors = require('cors');
const Gun = require('gun');

const roomRouter = require('./routes/roomRoutes');
const messRouter = require('./routes/messageRoutes');
const fileRouter = require('./routes/fileRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/room', roomRouter);
app.use('/message', messRouter);
app.use('/file', fileRouter);

const PORT = 3000;

const Server = app.listen(PORT, ()=>{
  console.log('Server started on PORT: ', 3000 );
})

const gun = Gun({
  web: Server,
  file: 'data/gun/',
  peers: ['https://gun-manhattan.herokuapp.com/gun']
})



global.gun = gun;
console.log('Gun initialised');