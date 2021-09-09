const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');


//check db is connected
//console.log(mongoose.connection.readyState);
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const usersRoutes = require('./api/routes/users');

app.use(morgan('dev'));
app.use('/uploads' , express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req , res , next)=>{
  res.header('Access-Control-Allow-Origin' , '*');
  res.header('Access-Control-Allow-Headers' , 'Origin , X-Requested-With , Content-Type , Accept , Authorization');
  if (req.method === "OPTIONS") {
    res.header('Access-Control-Allows-Methods' , 'PUT , POST , PATCH , DELETE , GET');
    return res.status(200).json({});
  }
  next();
});

//route
app.use('/products' , productsRoutes);
app.use('/orders' , ordersRoutes);
app.use('/users' , usersRoutes);

app.use((req , res , next)=>{
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

app.use((error , req , res , next)=>{
  res.status(error.status || 500);
  res.json({
    error:{
      message: error.message
    }
  });
});
module.exports = app;
