const express=require("express");
const bodyParser=require("body-parser");
const Leaders=require('../models/leaders');
const leaderRouter=express.Router();
const authenticate=require('../authenticate');
const Dishes=require('../models/dishes');
leaderRouter.use(bodyParser.json());
leaderRouter.route("/")
// .all((req,res,next)=>{
// 	res.status=200;
// 	res.setHeader('Content-Type','text/plain');
// 	next();
// })
.get((req,res,next)=>{
	Leaders.find({})
	.then((leaders)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(leaders);
	},(err)=>next(err))
	.catch((err)=>next(err));
	//res.end("Will send all the leaders to you!");
})
.put(authenticate.verifyUser,(req,res,next)=>{
	res.status=403
	res.end("Put operation not supported on /leaders");
})
.post(authenticate.verifyUser,(req,res,next)=>{
	//res.end("Will add the leader: "+req.body.name+' with details: '+req.body.description);
	Leaders.create(req.body)
	.then((leader)=>{
		console.log("leader created",leader);
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(leader);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	//res.end("Deleting all leaders!	");
	Leaders.remove({})
	.then((resp)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
	},(err)=>next(err))
	.catch((err)=>next(err));
});
leaderRouter.route('/:leaderId')
// .all((req,res,next)=>{
// 	res.status=200;
// 	res.setHeader('Content-Type','text/plain');
// 	next();
// })
.get((req,res,next)=>{
	//res.end("Will send all details of "+req.params.dishId);
	Leaders.findById(req.params.leaderId)
	.then((leader)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(leader);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
	//res.end("Updating the leader: "+req.params.promoId+'\n'+'Will update leacer: '+req.body.name+' with details '+req.body.description);
	Leaders.findByIdAndUpdate(req.params.leaderId,{$set:req.body},{new:true})
	.then((leaders)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(leaders);
	},(err)=>next(err))
	.catch((err)=>next(err));

})
.post(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end("POST operation not supported on /leaders/ "+req.params.dishId);
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	//res.end("Deleting leader!	");
	Leaders.findByIdAndRemove(req.params.leaderId)
	.then((resp)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
	},(err)=>next(err))
	.catch((err)=>next(err));
});
module.exports=leaderRouter;