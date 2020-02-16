var express = require('express');
var router = express.Router();
var bodyParser=require('body-parser');
var User=require('../models/user');
var router=express.Router();
var passport=require('passport');
var authenticate=require('../authenticate'); 		//introduced to get token from the module
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// router.post('/signup',function(req,res,next){
// 	//User.findOne({username:req.body.username})
// 	User.register(new User({username:req.body.username}),
// 	req.body.password,(err,user)=> { //.register will be used instead of .findone which takes password and callback as an argument,therefore removing then
// 	// .then((user)=>{
// 		if(user!=null){
// 			var err=new Error('Username '+req.body.username+' already exists!');
// 			err.status=403;
// 			next(err);
// 		}
// 		else{
// 			return User.create({
// 				username:req.body.username,
// 				password:req.body.password
// 			});
// 		}

// 	})
// 	.then((user)=>{
// 		res.statusCode=200;
// 		res.setHeader('Content-Type','application/json');
// 		res.json({status:'Registration Successful',user:user});
// 	},(err)=>next(err))
// 	.catch((error)=>next(error));
// })
router.post('/signup',function(req,res,next){
	//User.findOne({username:req.body.username})
	User.register(new User({username:req.body.username}),
	req.body.password,(err,user)=> { //.register will be used instead of .findone which takes password and callback as an argument,therefore removing then
	// // .then((user)=>{
	// 	if(user!=null){
	// 		var err=new Error('Username '+req.body.username+' already exists!');
	// 		err.status=403;
	// 		next(err);
	// 	}
		if(err){
			res.statusCode=500;
			res.setHeader('Content-Type','application/json');
			res.json({err:err});
		}

		else{
			if(req.body.firstname)user.firstname=req.body.firstname;
			if(req.body.lastname)user.lastname=rq.body.lastname;
			user.save((err,user)=>{
				if(err){
					res.statusCode=500;
					res.setHeader('Content-Type','application/json');
					res.json({err:err});
				}
				passport.authenticate('local')(req,res,()=>{
				res.statusCode=200;
				res.setHeader('Content-Type','application/json');
				res.json({status:'Registration Successful',success:true});
			});
			});
			
		}

	});
})
router.post('/login',passport.authenticate('local'),(req,res)=>{        //passport.authenticate is called first to verify authentication process
	var token=authenticate.getToken({_id:req.user._id})
	res.statusCode=200;
	res.setHeader('Content-Type','application/json');
	res.json({success:true,token:token,status:'You are logged in'});
})
// router.post('/login',(req,res,next)=>{
// 	// 	if(!req.session.user){               //user hasn't been authorised yet. User property has to be setup in cookie.
// 	// 	var authHeader=req.headers.authorization;
// 	// 	if(!authHeader){
// 	// 		var err=new Error('You are not authenticated');
// 	// 		res.setHeader("WWW-Authenticate","Basic");
// 	// 		err.status=401;
// 	// 		return next(err);
// 	// 	}
// 	// 	var auth= new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');

// 	// 	var username=auth[0];
// 	// 	var password=auth[1];
// 	// 	User.findOne({username:username})
// 	// 	.then((user)=>{
// 	// 		if(user===null){
// 	// 			var err= new Error('User' + username +' does not exist');
// 	// 			//res.setHeader('WWW-Authenticate','Basic');
// 	// 			err.status=403;
// 	// 			return next(err);			
// 	// 		}
// 	// 		else if(user.password!=password){
// 	// 			var err= new Error('Wrong Password');
// 	// 			//res.setHeader('WWW-Authenticate','Basic');
// 	// 			err.status=403;
// 	// 			return next(err);
// 	// 		}
// 	// 		else if(user.username===username&& user.password===password){
// 	// 		//res.cookie('user','admin',{signed:true})   //(name, value ,properties)
// 	// 			req.session.user='authenticated';
// 	// 			//next();
// 	// 			res.statusCode=200;
// 	// 			res.setHeader('Content-Type','text/plain');
// 	// 			res.end('You are authenticated!');
// 	// 		}
// 	// 	})
// 	// 	.catch((err)=>next(err));
			
// 	// }
// 	// else{
// 	// 	res.statusCode=200;
// 	// 	res.setHeader('Content-Type','text/plain');
// 	// }

// })
router.get('/logout',(req,res)=>{
	if(req.session){
		req.session.destroy();
		res.clearCookie('session-id');
		res.redirect('/');
	}
	else{
		var err=new Error('You are not logged in!');
		err.statusCode=403;
		next(err);
	}
})

module.exports = router;
