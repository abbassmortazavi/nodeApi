const mongoose = require('mongoose');
const Order = require('../models/orders');
const checkAuth = require('../middleware/check-auth');

exports.orders_get_all = (req , res , next)=>{
	Order.find()
	.populate('product' , 'name')
	.exec()
	.then(results=>{
		const response = {
			count: results.length,
			orders: results.map((result) => {
				return {
					_id: result._id,
					product: result.product,
					quantity: result.quantity,
					request:{
						type: 'GET',
						url: 'localhost:3000/orders/' + result._id
					}
				}
			})
		}
		res.status(200).json(response);
	}).catch((err) => {
			res.status(500).json(err);
	});
}
exports.orders_get_by_id = (req , res , next)=>{
	let id = req.params.orderId;
	Order.findById(id)
	.select('_id product quantity')
	.exec()
	.then(result=>{
		if (result) {
			res.status(200).json(result);
		}else {
			res.status(404).json({
				message: "Ids is wrong!"
			});
		}
	}).catch((err) => {
		res.status(500).json({
			message:err
		});
	});

}
