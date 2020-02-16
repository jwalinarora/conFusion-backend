const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const Promotions=require('../models/promotions');
const promoRouter=express.Router();
const authenticate=require('../authenticate');
promoRouter.use(bodyParser.json());
promoRouter.route("/")
// .all((req,res,next)=>{
// 	res.status=200;
// 	res.setHeader('Content-Type',"text/plain");
// 	next();
// })
.get((req,res,next)=>{
	//res.end("Will send all the promotions to you!");
	Promotions.find({})
	.then((promotions)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(promotions);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
	res.status=403
	res.end("Put operation not supported on /promotions");
})
.post(authenticate.verifyUser,(req,res,next)=>{
	//res.end("Will add the promotion: "+req.body.name+' with details: '+req.body.description);
	Promotions.create(req.body)
	.then((promotion)=>{
		console.log("promotion created",promotion);
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(promotion);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	//res.end("Deleting all promotions!	");
	Promotions.remove({})
	.then((resp)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
		},(err)=>next(err))
	.catch((err)=>next(err));
});
promoRouter.route("/:promoId")
.all((req,res,next)=>{
	res.status=200;
	res.setHeader('Content-Type',"text/plain");
	next();
})
.get((req,res,next)=>{
	//res.end("Will send all details of "+req.params.promoId);
	Promotions.findById(req.params.promoId)
	.then((promotions)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(promotions);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
	//res.end("Updating the promotion: "+req.params.promoId+'\n'+'Will update promotion: '+req.body.name+' with details '+req.body.description);
	Promotions.findByIdAndUpdate(req.params.promotionId,{
		$set:req.body
	},{new:true})
.then((promotion)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(promotion);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end("POST operation not supported on /promotions/ "+req.params.dishId);
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	//res.end("Deleting promotion!");
	Promotions.findByIdAndRemove(req.params.promotionId)
	.then((promotion)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(promotion);
	},(err)=>next(err))
	.catch((err)=>next(err));

});
module.exports=promoRouter;