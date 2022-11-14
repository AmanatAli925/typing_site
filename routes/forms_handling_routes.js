const express= require("express");
const User = require("../models/users_model.js");
const bcrypt= require('bcrypt');
const verify_codes= require("../models/verify_codes");
const nodemailer= require('nodemailer');
const router= express.Router();

router.post("/sign-in", function(req, res){
	console.log("Email", req.body.email);
	const password= req.body.password;
	const email= req.body.email;
	const findUser=User.findOne({
		email : email
	})
	
	findUser.exec(function(err, user){
		if(!user){
			res.render('signin', {
				error_msg: "Sorry, no account registered with this email"
			})
			return;
		}
		
		
		bcrypt.compare(password, user.password).then(function(matched){
			if(!matched){
				res.redirect("/sign-in?error_msg=Incorrect password.")
				return;
			}
			
			req.session.user= {
				username: user.username,
				email: user.email,
				email_verified: user.email_verified,
				finished_lessons: user.finished_lessons
			};
			res.redirect('/');
		})
			
		
	})
	
})

router.get('/sign-out', function(req, res){
	req.session.user="";
	res.redirect('/');
})

router.post("/sign-up", function(req, res){
	const {username, email, password} = req.body;
	
	const findUser=User.findOne({
		email
	})
	
	findUser.exec(async function(err, user_doc){
		if(user_doc ){
			
			if(user_doc.email_verified)
				error_msg= 'This email is already registered.<a href="/sign-in">Sing In</a>'
			else
				error_msg= `This is email is already registered for an unverified account.
							<a href="/enter-code?email=${email}">Verify Account</a>
							OR
							<a href="/forms-handling/cancel-signup?email=${email}">Cancel Sign-up</a>`
			res.redirect('/sign-up?error_msg='+ error_msg )
			return;
		}
		const already_exist= await User.findOne({email})
		
		
		new User({
			email, 
			username,
			password
		}).save(function(err, doc){
			if(err){
				console.log(err)
				return;
			}
			req.session.user={
				username: doc.username,
				email: doc.email,
				email_verified: doc.email_verified
			}
			res.redirect('/enter-code/?email='+email)
		})
		
	})
})

router.get('/send-again', function(req, res){
	const email= req.query.email;
	const purpose= req.query.purpose;
	verify_codes.deleteOne({email}, function(err){
		error_msg="";
		if(err)
			error_msg= "An error occured while resending the code. Try again."
		
		res.redirect('/enter-code?email='+email+"&purpose="+purpose+"&error_msg="+error_msg);
	})
})

router.post('/finish-sign-up', function(req, res){
	console.log("REQUEST BODY ", req.body);
	const code = req.body.code; 
	const email = req.body.email;
	
	verify_codes.findOne({ email }, function(err, doc){
		if(err){
			console.log(err)
			return;
		}
		
		bcrypt.compare(code, doc.verify_code).then(async function(matched){
			if(!matched){
				const error_msg= "You entered the invalid code.";
				res.redirect('/enter-code?email='+email+'&error_msg='+ error_msg )
				return;
			}
			
			await verify_codes.findOneAndRemove({ email }).exec()
			
			User.findOneAndUpdate({ email }, { email_verified: true}, {new:true}, function(err, doc){
				if(err){
					error_msg= "Error saving the verification. Try again".
					res.redirect("/enter-code?email="+email+"&error_msg="+error_msg)
					return;
				}
				
				req.session.user={
					username: doc.username,
					email: doc.email,
					email_verified: doc.email_verified,
					finished_lessons: doc.finished_lessons
				}
				
				res.redirect('/');
				
			})
			
		})
		
	})
	
})

router.post('/enter-code-redirect', function(req,res){
	const email= req.body.email;
	res.redirect('/enter-code/?purpose=forgot-password&email='+email)
})

router.post('/forgot-password', function(req, res){
	const code= req.body.code;
	const email= req.body.email;
	
	verify_codes.findOne({ email }, function( err, doc ){
		if(err){
			console.log("Error retrieving the code from db");
			return;
		}
		
		
		
		
		bcrypt.compare(code, doc.verify_code).then(async function(matched){
			
			if(!matched){
				var error_msg= "INVALID CODE.";
				var redirect_url= '/enter-code?email='+email+"&purpose=forgot-password&error_msg="+error_msg
				res.redirect(redirect_url)
				return;
			}
			
			verify_codes.updateOne({ email }, { validated: true }, function(err, updated){
					if(err){ 
						console.log(err)
						return;
					}
					res.redirect('/enter-new-password?email='+email)
				})
		})
	})
	
})


router.post('/update-password', function(req, res){
	const password= req.body.password;
	const password1= req.body.password1;
	const email= req.body.email
	
	if(password!=password1){
		var error_msg= "Passwords does not match."
		res.redirect("/enter-new-password?error_msg="+error_msg);
		return;
	}
	verify_codes.findOne({ email }, async function(err, doc){
		
		if(!doc.validated){
			var error_msg="You did not verified the code";
			res.redirect("/enter-new-password?error_msg="+error_msg);
			return;
		}
		
		await verify_codes.findOneAndRemove({ email });
		
		User.updateOne({ email }, { password }, function(err, updated_doc){
			if(err){
				console.log(err)
				return;
			}
			var success_msg='Password Successfully updated.Now you can log in';
			res.redirect('/sign-in?success_msg=' + success_msg);
		})
		
	})
})


router.get('/cancel-signup', async function(req, res){
	const { email }= req.query;
	await User.findOneAndRemove({email}).exec()
	await verify_codes.findOneAndRemove({email}).exec()
	req.session.user="";
	res.redirect('/')
})








module.exports=router;