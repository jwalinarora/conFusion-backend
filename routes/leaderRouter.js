const express=require("express");
const bodyParser=require("body-parser");
const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter.route("/")
.all((req,res,next)=>{
	res.status=200;
	res.setHeader('Content-Type','text/plain');
	next();
})
.get((req,res,next)=>{
	res.end("Will send all the leaders to you!");
})
.put((req,res,next)=>{
	res.status=403
	res.end("Put operation not supported on /leaders");
})
.post((req,res,next)=>{
	res.end("Will add the leader: "+req.body.name+' with details: '+req.body.description);
})
.delete((req,res,next)=>{
	res.end("Deleting all leaders!	");
});
leaderRouter.route('/:leaderId')
.all((req,res,next)=>{
	res.status=200;
	res.setHeader('Content-Type','text/plain');
	next();
})
.get((req,res,next)=>{
	res.end("Will send all details of "+req.params.dishId);
})
.put((req,res,next)=>{
	res.end("Updating the leader: "+req.params.promoId+'\n'+'Will update leacer: '+req.body.name+' with details '+req.body.description);
})
.post((req,res,next)=>{
	res.statusCode=403;
	res.end("POST operation not supported on /leaders/ "+req.params.dishId);
})
.delete((req,res,next)=>{
	res.end("Deleting leader!	");
});
module.exports=leaderRouter;