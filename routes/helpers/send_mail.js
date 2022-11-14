const nodemailer= require('nodemailer');
module.exports= function sendMail(to_email, subject, text){
	return new Promise(function(resolve, reject){
		const min= 10000;
		const max= 99999;
		var verify_code= Math.floor(Math.random() * (max - min + 1)) + min;
		verify_code= verify_code.toString()
		
		const transport= nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: "learnTypingWithUs@gmail.com",
				pass: "zspacyhxjzwyngvm"
			}
		})
		const options= {
			from: "TouchTying.Website",
			to: to_email,
			subject,
			text: text+verify_code
		}
		transport.sendMail(options, function(mail_error, info){
			console.log("Verify code is " , verify_code);
			
			resolve({mail_error,verify_code});
			
			
			
		})
	})
}	