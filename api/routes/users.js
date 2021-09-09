const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');
const User = require('../models/user');


router.post('/signup' , (req , res , next)=>{
  let email = req.body.email;
  User.find({email: req.body.email})
  .exec()
  .then(result=>{
    if (result.length>= 1) {
       res.status(200).json({
        message: "email exist"
      });
    }else {
      bcrypt.hash(req.body.password , 10 , (err , hash)=>{
       if (err) {
         return res.status(400).json({
           error: err
         });
       }else {
         const user = new User({
           _id: new mongoose.Types.ObjectId(),
           email: req.body.email,
           password: hash
           });
           user.save().then((user) => {
             res.status(200).json({
               message: 'User was created!',
               data: user
             });
           }).catch((err) => {
             res.status(500).json({
               message: err
             });
           });
       }

     });
    }
  }).catch((err) => {
    res.status(400).json({
     message: err
   });
  })

});
router.post('/login' , (req , res , next)=>{
  User.find({email: req.body.email})
  .exec()
  .then(user=> {
    if (user.length < 1) {
      res.status(422).json({
        message: 'Auth failed!!'
      });
    }
    bcrypt.compare(req.body.password , user[0].password , (err , result)=>{
      if (err) {
        res.status(400).json({
          message: 'password is wrong!!'
        });
      }
      if (result) {
        let token = jwt.sign({
          email: user[0].email,
          userId: user[0]._id
        },'secret',
      {
        expiresIn: "2h"
      }
    );
        res.status(200).json({
          message: 'Auth ok!!',
          token: token
        });
      }

    });
  }).catch((err) => {
    res.status(400).json({
      message: err
    });
  });
});

router.delete('/:userId' , (req , res , next)=>{
  let id = req.params.userId;
  User.findByIdAndRemove(id)
  .then((result) => {
    if (result) {
      res.status(200).json({
        message: 'User is deleted Successfully!',
        data: result
      });
    }else {
      res.status(404).json({
        message: 'User not found!',
      });
    }
  }).catch((err) => {
    res.status(404).json({
      message: 'User not found!',
    });
  })
});


module.exports = router;
