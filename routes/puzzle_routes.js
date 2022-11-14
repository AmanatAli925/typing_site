const express= require("express");

const router= express.Router();

router.get('/', function(req, res){
	
	var arr= Array.from(Array(15*15).keys());
	res.render('puzzle', { arr })
})

module.exports= router;