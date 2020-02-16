var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User=require('./models/user');
var JwtStrategy=require('passport-jwt').Strategy;
var ExtractJwt=require('passport-jwt').ExtractJwt;
var jwt=require('jsonwebtoken');

var config=require('./config');

exports.local=passport.use(new LocalStrategy(User.authenticate()));  
passport.serializeUser(User.serializeUser());   //serializeUser determines which data of the user object should be stored in the session. The result of the serializeUser method is attached to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide the user id as the key) req.session.passport.user = {id: 'xyz'}
passport.deserializeUser(User.deserializeUser());

exports.getToken=function(user){
	return jwt.sign(user,config.secretKey,
		{expiresIn:3600});  // expiresIN seconds
};

var opts={};   //options to specify JWT strategy
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken()                          //how token should be extracted
opts.secretOrKey=config.secretKey

exports.jwtPassport=passport.use(new JwtStrategy(opts,									
									(jwt_payload,done)=>{
										console.log("JWT payload: ",jwt_payload);
										User.findOne({_id:jwt_payload._id},(err,user)=>{
											if(err){
												return done(err,false);
											}
											else if(user){
												return done(null,user);
											}
											else{
												return done(null,false);
											}
										});
									}));                                    //creating new JWT strategy. Second funtion supplied is the verify function. Done is a callback. It is the information used to load on request message. 

exports.verifyUser=passport.authenticate('jwt',{session:false});			//checks the token and verifies the user