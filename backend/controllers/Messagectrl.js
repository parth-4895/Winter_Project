const express = require('express');

exports.sendMessage = (req,res,next)=>{
  const {RoomID, message} = req.body;
  const gun = global.gun;
  try{
    gun.get('rooms').get(RoomID).get(Date.now().toString()).put({message: message, sentAt:Date.now()});
  }catch(error){
    console.log(error);
    res.json({status:'error', error:error});
  }
  res.json({status: 'success'});
}

exports.receiveMessage = (req,res,next)=> {
  const {RoomID} = req.body;
  const gun = global.gun;
  try{
    gun.get('rooms').get(RoomID).map().on((data)=>{
      if(data.message){
        res.json({message: data.message, sentAt: data.sentAt});
      }
    });
  }catch(error){
    console.log(error);
    res.json({status:'error', error:error});
  }
}

exports.sendFiles = (req,res,next)=>{
  
}