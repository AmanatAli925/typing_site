const mongoose= require('mongoose');
const bcrypt  = require('bcrypt');
const verify_codes_schema= new mongoose.Schema({
	email: String,
	verify_code: {
		type:String,
		set: (code)=>  bcrypt.hashSync(code, 10) 
	},
	validated: { type: Boolean, default: false },
	createdAt: { 
		type: Date,
		expires: 1800,
		default: Date.now
	}
})
module.exports=mongoose.model("verify_codes", verify_codes_schema)