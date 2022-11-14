const express= require('express');
const router= express.Router();
const words= require("./data/words.js");

router.get('/', function(req, res){
	var found_words= find_words(req.query.letters)
	res.render('scrabble', {
		words:found_words
	})
})


function find_words(letters){
	if(!letters)
		return [];

	console.log("LEtters was", letters);


	var arr=[];
	for(var i=0; i< words.length; ++i){
		var valid=true;
		for( var j=0; j< words[i].length; ++j){
			if(!letters.includes(words[i][j])){
				valid=false;
				break;
			}			
		}
		if(valid)
			arr.push(words[i])					

	}

	return arr;
}

module.exports= router;