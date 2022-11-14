const express= require('express')
const k_layouts= require("./data/k_layouts.js")
const router = express.Router();
const verify_codes = require('../models/verify_codes')
const sendMail = require("./helpers/send_mail.js")

const meta={
	home:{
		title: "Learn Typing with Qwerty, Dvorak and Colemak layouts.",
		description: "Learn to type at your own pace with advance feature of our web. We allow you to learn typing in all three popular layouts"
	},
	about:{
		title: "About - Learn Typing with Dvorak, Qwerty, Colemak layouts"
	},
	finger_placement:{
		title: "Finger Placement Demonstration for Typing."
	},
	signin:{
		title:"Sign in to you account",
		description: "Log in to get show all of your progress and continue saving the progress you make. Making your journey easier."
	},
	signup:{
		title:"Sign up for new account.",
		description: "Create a account to keep track your progress as you go. Knowing what you achieved and whats left is key to success."
	},
	crossword_puzzle_solver:{
		title: "Solve crossword with few clicks.",
		description: "Sloving Crossword is now made easy. Just draw your puzzle and after clicks its solved."
	},
	enter_email:{
		title: "Enter your Email.",
		description: "A code will be sent on this email to verify your ownership."
	},
	enter_new_password:{
		title: "Enter New Password.",
		description: "This password will be used to log in to your account in future"
	}
	
	
}

// app pages serving
router.get('/links', (req, res) => {
	res.sendFile(__dirname+'/links.html');
});

router.get('/enter-code', function(req, res){
	
	const email = req.query.email;
	var error_msg = req.query.error_msg;
	
	var endpoint= req.query.purpose;
	
	if(!endpoint) endpoint= "finish-sign-up";
	console.log("End point ", endpoint);


	
	if(!email){
		res.render('enter-code', { email, error_msg, endpoint });
		return;
	}
	
	verify_codes.findOne({ email }, function(err, found_doc){
	
		if(found_doc){ 		// if code is already sent, dont send again.
			res.render('enter-code', { email, error_msg, endpoint });
			return;  		
		}
		// Otherwise Send Code
		const subject =req.domain_name+' - Account Verification Code';
		const text = "Your Verification Code is ";
		sendMail(email, subject, text).then(function(obj){
			console.log("GOT BACK FROM SENDMAIL FUNCTION")
			const mail_error= obj.mail_error;
			const verify_code= obj.verify_code;
			if(mail_error){
				console.log(mail_error)
				error_msg= "Error sending the authentication code. Try again."
				res.render('signup', {  error_msg })
				return;
			}
			
			const query={ email },
				  update= { email: email, verify_code },
				  options= { upsert: true, setDefaultsOnInsert: true }
			verify_codes.findOneAndUpdate(query, update, options).exec(function(update_error, result) {
				if (update_error){
					error_msg= "Error updating the authentication code. Try again."
					res.render('enter-code', { email, error_msg, endpoint })
					return;
				}
				res.render('enter-code', { email, error_msg, endpoint })
				// do something with the document
				});
			
		})
		
	})
	
	
	
})






router.get('/', (req, res) => {	
	var k_layout= req.query.layout || "qwerty";
	
	res.render('home', { 
		k_layout, 
		tags: k_layouts[k_layout],
		title: meta.home.title,
		description: meta.home.description,
		
	});
});

router.get('/about', (req, res) => {
		
	res.render('about',{
		title: meta.about.title
	});
});
router.get('/fingers-placement', (req, res) => {
	
	res.render('fingers-placement', {
		title: meta.finger_placement.title
	});
});

router.get('/sign-in', (req, res) => {
	var error_msg= req.query.error_msg;
	var success_msg= req.query.success_msg;
	res.render('signin', {
		title: meta.signin.title,
		description: meta.signin.description,
		error_msg,
		success_msg
	});
});

router.get('/sign-up', (req, res) => {
	
	var error_msg= req.query.error_msg;
	res.render('signup', {
		title: meta.signup.title,
		error_msg
	});
});


router.get('/crossword-puzzle-solver', (req, res) => {

	res.render('puzzle', {
		title: meta.crossword_puzzle_solver.title,
		description: meta.crossword_puzzle_solver.description
	});
});

router.get('/enter-email', (req, res) => {
	res.render('enter-email',{
		title: meta.enter_email.title
	})
});

router.get('/enter-new-password', (req, res) => {
	const error_msg= req.query.error_msg;
	const email= req.query.email;
	
	res.render('enter-new-password', { 
		error_msg ,
		email,
		title: meta.enter_new_password.title
	})
});

module.exports= router;