const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const authenticate=require('../authenticate');
const Dishes=require('../models/dishes');
//const cors=require('./cors');

const dishRouter=express.Router();
dishRouter.use(bodyParser.json());
dishRouter.route('/')
//.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
// .all((req,res,next)=>{
// 	res.statusCode=200;
// 	res.setHeader("Content-Type",'text/plain');
// 	next();
// })
.get((req,res,next)=>{
	//res.end("Will send all dishes to you");
	Dishes.find({})
	.populate('comments.author')
	.then((dishes)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dishes); 
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{    //adding authenticate middleware to verify user. It will automatically  handle the error as well as authenticate user.
	//res.end("Will add the dishes later "+req.body.name+' with details: '+req.body.description);
	Dishes.create(req.body)
	.then((dish)=>{
		console.log("dish created",dish);
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dish);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end("PUT operation not supported on /dishes");
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	//re.statusCode=403;
	//res.end("Deleting all dishes!	");
	Dishes.remove({})
	.then((resp)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
	},(err)=>next(err))
	.catch((err)=>next(err));
});
dishRouter.route('/:dishId')
.get((req,res,next)=>{
	//res.end("Will send all details of "+req.params.dishId);
	Dishes.findById(req.params.dishId)
		.populate('comments.author')
	.then((dishes)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dishes);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
	//res.end("Will add the dishes later"+req.body.name+' with details: '+req.body.description);
	res.statusCode=403;
	res.end("POST operation not supported on /dishes/ "+req.params.dishId);
})
.put(authenticate.verifyUser,(req,res,next)=>{
	//re.statusCode=403;
	// res.write("Updating the dish: "+req.params.dishId);
	// res.end("Will update dish: "+req.body.name+" with details "+req.body.description);
	Dishes.findByIdAndUpdate(req.params.dishId,{
		$set:req.body
	},{new:true})
.then((dishes)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dishes);
	},(err)=>next(err))
	.catch((err)=>next(err));

})
.delete(authenticate.verifyUser,(req,res,next)=>{
	//re.statusCode=403;
	//res.end("Deleting dish!	");
	Dishes.findByIdAndRemove(req.params.dishId)
	.then((dishes)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dishes);
	},(err)=>next(err))
	.catch((err)=>next(err));
});
dishRouter.route('/:dishId/comments')
// .all((req,res,next)=>{
// 	res.statusCode=200;
// 	res.setHeader("Content-Type",'text/plain');
// 	next();
// })
.get((req,res,next)=>{
	//res.end("Will send all dishes to you");
	Dishes.findById(req.params.dishId)
		.populate('comments.author')
	.then((dish)=>{
		if(dish!=null){
			res.statusCode=200;
			res.setHeader('Content-Type','application/json');
			res.json(dish.comments);
		}
		else{
			err=new Error('Dish '+req.params.dishId+' not found');
			err.status=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
	//res.end("Will add the dishes later "+req.body.name+' with details: '+req.body.description);
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish!=null){
			// res.statusCode=200;
			// res.setHeader('Content-Type','application/json');
				req.body.author=req.user._id;
			dish.comments.push(req.body);
			dish.save()
			.then((dish)=>{
				Dishes.findById(dish._id)
					.populate('comments.author')
					.then((dish)=>{
						res.statusCode=200;
						res.setHeader('Content-Type','application/json');
						res.json(dish);
					})
				
			},(err)=>next(err));
			//res.json(dish.comments);
		}
		else{
			err=new Error('Dish '+req.params.dishId+' not found');
			err.status=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end("PUT operation not supported on /dishes/"+req.params.dishId+'/comments');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	//re.statusCode=403;
	//res.end("Deleting all dishes!	");
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish!=null){
			// res.statusCode=200;
			// res.setHeader('Content-Type','application/json');
			// dish.comments.push(req.body);
			// dish.save()
			// .then((dish)=>{
			// 	res.statusCode=200;
			// 	res.setHeader('Content-Type','application/json');
			// 	res.json(dish);

			// },(err)=>next(err);
			//res.json(dish.comments);
			for(var i=dish.comments.length-1;i>=0;i--){
				dish.comments.id(dish.comments[i]._id).remove();
			}
			dish.save()
			.then((dish)=>{
				res.statusCode=200;
				res.setHeader('Content-Type','application/json');
				res.json(dish);
			},(err)=>next(err));
		}
		else{
			err=new Error('Dish '+req.params.dishId+' not found');
			err.status=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=>next(err));
});
dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next)=>{
	//res.end("Will send all details of "+req.params.dishId);
	//	.populate('comments.author')
	Dishes.findById(req.params.dishId)
	.then((dishes)=>{
		// res.statusCode=200;
		// res.setHeader('Content-Type','application/json');
		// res.json(dishes);
		if(dish!=null && dish.comments.id(req.params.commentId)!=null){
			res.statusCode=200;
			res.setHeader('Content-Type','application/json');
			res.json(dish.comments.id(req.params.commentId));
		}
		else if(dish==null){
			err=new Error('Dish '+req.params.dishId+' not found');
			err.status=404;
			return next(err);
		}
		else{
			err=new Error('Comment '+req.params.commentId+' not found');
			err.status=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
	//res.end("Will add the dishes later"+req.body.name+' with details: '+req.body.description);
	res.statusCode=403;
	res.end("POST operation not supported on /dishes/ "+req.params.dishId+ '/comments/'+req.params.commentId);
})
.put(authenticate.verifyUser,(req,res,next)=>{
	//re.statusCode=403;
	// res.write("Updating the dish: "+req.params.dishId);
	// res.end("Will update dish: "+req.body.name+" with details "+req.body.description);
// 	Dishes.findByIdAndUpdate(req.params.dishId,{
// 		$set:req.body
// 	},{new:true})
// .then((dishes)=>{
// 		res.statusCode=200;
// 		res.setHeader('Content-Type','application/json');
// 		res.json(dishes);
// 	},(err)=>next(err))
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		// res.statusCode=200;
		// res.setHeader('Content-Type','application/json');
		// res.json(dishes);
		if(dish!=null && dish.comments.id(req.params.commentId)!=null){
			if(req.body.rating){
					dish.comments.id(req.params.commentId).rating=req.body.rating;
			}
			if(req.body.comment){
					dish.comments.id(req.params.commentId).comment=req.body.comment;
			}
			dish.save()
			.then((dish)=>{
				Dishes.findById(dish._id)
				.populate('comments.author')
				.then((dish)=>{
					res.statusCode=200;
					res.setHeader('Content-Type','application/json');
					res.json(dish);
				})
			},(err)=>next(err));
		}
		else if(dish==null){
			err=new Error('Dish '+req.params.dishId+' not found');
			err.status=404;
			return next(err);
		}
		else{
			err=new Error('Comment '+req.params.commentId+' not found');
			err.status=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=>next(err));

})
.delete(authenticate.verifyUser,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
	if(dish!=null && dish.comments.id(req.params.commentId)!=null){
			// res.statusCode=200;
			// res.setHeader('Content-Type','application/json');
			// dish.comments.push(req.body);
			// dish.save()
			// .then((dish)=>{
			// 	res.statusCode=200;
			// 	res.setHeader('Content-Type','application/json');
			// 	res.json(dish);

			// },(err)=>next(err);
			//res.json(dish.comments);
			dish.comments.id(req.params.commentId).remove();
			dish.save()
			.then((dish)=>{
				// res.statusCode=200;
				// res.setHeader('Content-Type','application/json');
				// res.json(dish);
				Dishes.findById(dish._id)
				.populate('comments.author')
				.then((dish)=>{
					res.statusCode=200;
					res.setHeader('Content-Type','application/json');
					res.json(dish);
				})
			},(err)=>next(err));
		}
		else if(dish==null){
			err=new Error('Dish '+req.params.dishId+' not found');
			err.status=404;
			return next(err);
		}
		else{
			err=new Error('Comment '+req.params.commentId+' not found');
			err.status=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=>next(err));
});

module.exports=dishRouter;