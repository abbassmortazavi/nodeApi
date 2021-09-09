const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  price: Number,
  amount: {
    type: Number,
    required: true
  },
  productImage:{
    type: String,
    required: false
  }
});


module.exports = mongoose.model('Product' , productSchema);
