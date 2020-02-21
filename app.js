var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
var FileStore=require('session-file-store')(session);
var passport=require('passport');
var authenticate=require('./authenticate');
var config=require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter	= require('./routes/dishRouter');
var leaderRouter= require('./routes/leaderRouter');
var promoRouter	= require('./routes/promoRouter');
var uploadRouter	= require('./routes/uploadRouter');

const mongoose=require('mongoose'); 


console.log("Helloooooo");
//const url='mongodb://localhost:27017/conFusion';
const url=config.mongoUrl;
const connect=mongoose.connect(url);
connect.then((db)=>{
	console.log('Connected to the server');
},(err)=>{console.log(err);});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('halloweeen'));
// app.use(session({
// 	name: 'session-id',
// 	secret: 'halloweeen',
// 	saveUninitialized: false,
// 	resave: false,
// 	store: new FileStore()
// }));
app.use(passport.initialize());
// app.use(passport.session());
// function auth(req,res,next){
// 	console.log(req.signedCookies);
// 	if(!req.signedCookies.user){               //user hasn't been authorised yet. User property has to be setup in cookie.
// 		var authHeader=req.headers.authorization;
// 		if(!authHeader){
// 			var error=new Error('You are not authenticated');
// 			res.setHeader("WWW-Authenticate","Basic");
// 			err.status=401;
// 			return next(err);
// 		}
// 		var auth= new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');

// 		var username=auth[0];
// 		var password=auth[1];
		
// 		if(username==='admin'&& password==='password'){
// 			res.cookie('user','admin',{signed:true})   //(name, value ,properties)
// 			next();
// 		}
// 		else{
// 			var err= new Error('You are not authenticated');
// 			res.setHeader('WWW-Authenticate','Basic');
// 			err.status=401;
// 			return next(err);
// 		}	
// 	}
// 	else{
// 		if(req.signedCookies.user==='admin'){
// 			next();
// 		}
// 		else{
// 			var err= new Error('You are not authenticated');
// 			//res.setHeader('WWW-Authenticate','Basic');
// 			err.status=401;
// 			return next(err);
// 		}
// 	}
	
// }

app.use('/', indexRouter);
app.use('/users', usersRouter);
// function auth(req,res,next){
// 	console.log(req.session);
// 	if(!req.user){               //user hasn't been authorised yet. User property has to be setup in cookie.
// 		// var authHeader=req.headers.authorization;
// 		// if(!authHeader){
// 			var err=new Error('You are not authenticated');
// 			//res.setHeader("WWW-Authenticate","Basic");
// 			err.status=403;
// 			return next(err);
// 		}
// 		// var auth= new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');

// 		// // var username=auth[0];
// 		// // var password=auth[1];
		
// 		// if(req.session.user==='authenticated'){
// 		// 	//res.cookie('user','admin',{signed:true})   //(name, value ,properties)
// 		// 	req.session.user='admin';
// 		// 	next();
// 		// }
// 		// else{
// 		// 	var err= new Error('You are not authenticated');
// 		// 	res.setHeader('WWW-Authenticate','Basic');
// 		// 	err.status=401;
// 		// 	return next(err);
// 		// }	
	
// 	else{
// 		// if(req.session.user==='authenticated'){
// 		// 	next();
// 		// }
// 		// else{
// 		// 	var err= new Error('You are not authenticated');
// 		// 	//res.setHeader('WWW-Authenticate','Basic');
// 		// 	err.status=401;
// 		// 	return next(err);
// 		// }
// 		next();
// 	}
	
// }
// app.use(auth);
app.use(express. static(path.join(__dirname, 'public')));

const Dishes=require('./models/dishes');

app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter);
app.use('/dishes',dishRouter);
app.use('/imageUpload',uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
