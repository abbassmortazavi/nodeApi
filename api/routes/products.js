const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
	destination: function(req , file , cb) {
		cb(null , './uploads/');
	},
	filename: function (req , file , cb) {
		cb(null , file.originalname);
	}
});

const fileFilter = (req , file , cb)=>{
	//reject filter
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null , true);
	}else {
		// cb(new Error('cant file uplaod') , false);
		 cb(null , false);
	}
};
const upload = multer({
	storage: storage ,
	 limits:{
		 fileSize: 1024 * 1024 * 4
	},
	fileFilter : fileFilter
});

router.get('/' , checkAuth , (req , res , next)=>{
	// Product.find().then((users) => {
	// 	res.status(200).json({
	// 		data: users
	// 	});
	// });
	Product.find()
	.select('name price productImage')
	.exec()
	.then(docs=>{
		const response = {
			count: docs.length,
			products: docs.map((doc) => {
				return{
					name: doc.name,
					price: doc.price,
					amount: doc.amount,
					productImage: doc.productImage,
					_id: doc._id,
					request:{
						type: 'GET',
						url: 'http://localhost:3000/products/' + doc._id
					}
				};
			})
		};
		res.status(200).json(response);
	})
	.catch((err) => {
		res.status(400).json(err);
	});
});

router.post('/', checkAuth , upload.single('productImage') , (req , res , next)=>{
	//console.log(req.file.originalname);
	const product = new Product({
		_id: new mongoose.Types.ObjectId,
		name: req.body.name,
		price: req.body.price,
		amount: req.body.amount,
		// productImage: req.file.originalname
		productImage: req.file.path
	});
	product.save().then((result) => {
		console.log(result);
		res.status(200).json({
			result,
			request:{
				type:'GET',
				url: 'http://localhost:3000/products/' + result._id
			}
		});
	}).catch((err) => {
		console.log(err);
		res.status(400).json(err);
	});
});

router.get('/:productId', checkAuth , (req , res , next)=>{
	let id = req.params.productId;
	Product.findById(id)
	.exec()
	.then(doc=>{
		console.log('from databse:',doc);
		if (doc) {
			res.status(200).json(doc);
		}else {
			res.status(404).json({
				message: 'No valid Id!'
			});
		}

	})
	.catch(err =>{
		console.log(err);
		res.status(500).json(err);
	});
});

router.patch('/:productId' , checkAuth , (req , res , next)=>{
	let id = req.params.productId;
	const updateOps = {};
	for (let ops of req.body) {
		console.log(req);
		updateOps[ops.propName] = ops.value;
	}
	Product.update({_id: id} , {$set: updateOps})
	.exec()
	.then(result=>{
		res.status(200).json(result);
	})
	.catch((err) => {
		res.status(400).json(err);
	});

});

router.delete('/:productId' , checkAuth , (req , res , next)=>{
	let id = req.params.productId;
	// Product.findByIdAndRemove(id).then((ok) => {
	// 	if (ok) {
	// 		res.status(200).json({
	// 			message : 'Delete product'
	// 		});
	// 	}else {
	// 		res.status(400).json({
	// 			message : 'product not found!'
	// 		});
	// 	}
	// });
	// Product.remove({_id:id});
	Product.findByIdAndRemove(id)
	.exec()
	.then(doc=>{
		if (doc) {
			res.status(200).json({
				message : 'Delete product'
			});
		}else {
			res.status(400).json({
				message : 'product not found!'
			});
		}
	})
	.catch((err) => {
		res.status(400).json({
			message : err
		});
	});
});



module.exports = router;
