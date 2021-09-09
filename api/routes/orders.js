const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const Order = require('../models/orders');
const Product = require('../models/product');
const orderController = require('../controller/order');
const checkAuth = require('../middleware/check-auth');


router.get('/' , checkAuth , orderController.orders_get_all);

router.post('/' , (req , res , next)=>{
	// let order = new Order({
	// 	_id: mongoose.Types.ObjectId(),
	// 	product: req.body.productId,
	// 	quantity: req.body.quantity
	// });
	// order.save().then((doc) => {
	// 	res.status(200).json(order);
	// }).catch((err) => {
	// 	res.status(400).json(err);
	// });

	Product.findById(req.body.productId)
	.then(product => {
		if (!product) {
			return res.status(404).json({
				message: 'Product not found!'
			});
		}
		let order = new Order({
			_id: mongoose.Types.ObjectId(),
			product: req.body.productId,
			quantity: req.body.quantity
		});
		return order.save();
	}).then((result) => {
		res.status(200).json({
			message: 'oreder stored',
			order : result
		});
	})
	.catch((err) => {
		res.status(500).json(err);
	});



});

router.get('/:orderId' , checkAuth , orderController.orders_get_by_id);

router.delete('/:orderId' , (req , res , next)=>{
	let id = req.params.orderId;
	Order.findByIdAndRemove(id)
	.exec()
	.then(order=>{
		res.status(200).json({
			message: "order was deleted!"
		}).catch((err) => {
			res.status(500).json({
				message:err
			});
		});
	});

});

module.exports = router;
