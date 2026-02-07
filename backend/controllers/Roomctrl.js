const express = require('express');

exports.createRoom = (req,res,next)=>{
  const RoomID = Date.now().toString();
  console.log(RoomID);

  const gun = global.gun;
  gun.get('rooms').get(RoomID).get(Date.now().toString()).put({createdAt: Date.now()});

  res.json({RoomID: RoomID});
}

exports.joinRoom = (req,res,next)=>{
  const {RoomID} = req.body;
  const gun = global.gun;
  try{
  gun.get('rooms').get(RoomID).get(Date.now().toString()).put({joinedAt: Date.now()});
}catch(error){
  console.log(error);
  res.json({status:'error', err: error});

}
res.json({status:'success'});
}