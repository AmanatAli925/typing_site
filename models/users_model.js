const mongoose= require('mongoose');
const bcrypt  = require('bcrypt');

function encrypt_pass( plain_pass ){
	return bcrypt.hashSync( plain_pass, 10 ) 
}

module.exports= mongoose.model( 'User',{ 
	username: String,
	email 	: String,
	email_verified: {
		type: Boolean,
		default: false
	},
	finished_lessons: {
		type: [String],	
		default: []
	},
	password: {
		type: String,
		set: encrypt_pass
	}	
})

