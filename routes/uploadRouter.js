const express=require('express');
const bodyParser=require('body-parser');
//const mongoose=require('mongoose');
const authenticate=require('../authenticate');
const multer=require('multer');
//const Dishes=require('../models/dishes');
//const cors=require('./cors');
var storage=multer.diskStorage({
	destination:(req,res,cb)=>{
		cb(null,'public/images');      //first parameter is error,second is destination where the images will be stored
	},
	filename:(req,file,cb)=>{
		cb(null,file.originalname);
	}
}

);

const imageFileFilter=(req,file,cb)=>{       // to define the upload type
	if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
		return cb(new Error("You can upload only image Files"),false);
	}
	cb(null,true);
};
const upload=multer({storage:storage,fileFilter:imageFileFilter})
const uploadRouter=express.Router();
uploadRouter.use(bodyParser.json());
uploadRouter.route('/')
.get(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end("GET operation not supported on /upload");
})
.post(authenticate.verifyUser, upload.single('imageFile'),(req,res,next)=>{
	res.statusCode=200;
	res.setHeader("Content-Type","application/json");
	res.json(req.file);
})
.put(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end("PUT operation not supported on /upload");
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end("DELETE operation not supported on /upload");
});

module.exports=uploadRouter;