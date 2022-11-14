const express= require("express")
const filesystem= require('fs')

const router= express.Router();
var data;
const prepositions=[
	'as','and', 'at', 'by', 'for', 'with', 'in',  'of', 'on', 'to', 'the', 'up' , 'from'
]
filesystem.readFile(__dirname+'/data/result.txt', function(err, content){
	if(err){
		console.log(err)
		return;
	}
	data= JSON.parse(content);
	data.forEach(function(record){
		if(record.word=="collapse")
			console.log(record);
	})
	
})

router.get('/', function(req, res){
	const clue= req.query.clue;
	const clue_length= req.query.clue_length;
	const word_length= parseInt(req.query.word_length);
	const min_percentage= 1;
	var result=filter_by_clue(clue, min_percentage);
	if(word_length)
		result = result.filter((record)=> record.word.length==word_length)
	if(clue_length=='smallest')
		result = result.sort((a, b) => (a.defination.length > b.defination.length ? -1 : 1)).reverse()
	
	if(clue_length=='largest')
		result = result.sort((a, b) => (a.defination.length > b.defination.length ? -1 : 1))
	
	if(clue_length=='closest')
		result = result.sort(function(a, b){
		
			if(a.length_difference> b.length_difference)
				return -1;
			else
				return 1;
		}).reverse()
	
	result = result.sort((a, b) => (a.percentage > b.percentage ? -1 : 1))
	result = result.sort((a, b) => (a.char_match > b.char_match ? -1 : 1))
	
	res.json(result);
})


console.log("to fall apart".includes(" apart"))

function filter_by_clue(clue, min_percentage){
	clue= clue.split(" ");
	clue=clue.sort(function(a, b){
		   // ASC  -> a.length - b.length
		   // DESC -> b.length - a.length
		   return b.length - a.length;
		 });
		 
	console.log("clue length", clue.length)
	console.log(clue);
	var percentage=0;
	var eligible_records=[];
	// For each record
	data.forEach(function(record){
		
		// For each defination for the record
		record.definations.forEach(function(defination){
			
			var matching_words_arr=[];
			// defination= " "+defination+" ";
			// clue.forEach(function(word, index){
				// var first= index==0;
				// var last = index==clue.length-1;
				// if(!first && !last)
					// word= " "+word+" ";
				
				// if(first)
					// word= word+" ";
				// if(last)
					// word= " "+word;
				
				
				
					
				
				// if(defination.includes(word))
					// matching_words++;
			// })
			
			defination= defination.split(" ");
			defination= defination.sort(function(a, b){
				   // ASC  -> a.length - b.length
				   // DESC -> b.length - a.length
				   return b.length - a.length;
				 });
			
			defination.forEach( function(def_word){
				if (/[^a-zA-Z]/.test(def_word))
					return;
				clue.forEach( function(clue_word){
					var already_exist=false;
					matching_words_arr.forEach(function(word){
						if(clue_word==word)
							already_exist=true;
					})
					
					var is_presposition= prepositions.join(" ").includes(clue_word)
					
					if(def_word==clue_word )
						if(!already_exist && !is_presposition){
							matching_words_arr.push(def_word);
							return;
						}
						
					var is_substr= def_word.includes(clue_word);
					is_substr= is_substr || clue_word.includes(def_word);
					var len_diff= Math.abs(def_word.length-clue_word.length);
					
					if(is_substr && len_diff<=2)
						if(!already_exist)
							matching_words_arr.push(def_word)
					
					matching_words_arr= Array.from(new Set(matching_words_arr))
					
				})
			})
			
			percentage= matching_words_arr.length/clue.length *100;

			var def= defination.join(" ");
			var clu= clue.join(" ");
			if(percentage>= min_percentage)
				eligible_records.push({
					word: record.word,
					word_length: record.word.length,
					defination : defination.join(" "),
					percentage,
					matching_words: matching_words_arr.length,
					matching_words_arr,
					length_difference: Math.abs(def.length - clu.length),
					char_match: matching_words_arr.join(" ").length
				})
		})
	})
	
	
	return eligible_records;
}

module.exports= router;