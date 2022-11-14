const express= require('express')
const User = require('../../models/users_model.js')
const router = express.Router();

router.get('/add_finished_lesson', async function(req, res){
	var lesson= req.query.lesson;
	var lesson_keys= lesson[0]
	var lesson_num = lesson[1]
	
	if(!req.session.user){
		res.end()
		return;
	}
	
	var email= req.session.user.email;
	User.findOneAndUpdate(
		{ email }, 
		{ $push: { finished_lessons: lesson}},
		{ new: true },
		function(err, doc){
			if(err){
				console.log(err)
				return;
			}
			req.session.user.finished_lessons= doc.finished_lessons;
			res.end()
		})
	
	
	
})

module.exports= router;