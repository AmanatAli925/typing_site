const express= require("express")
var   all_words = require('./data/words.js');
var   k_layouts= require('./data/k_layouts.js');
const router= express.Router();

router.get("/:k_layout/:letters", (req, res) => {
	
	var k_layout= req.params.k_layout;
	var letters= req.params.letters;
	var title= "Learn Typing with Dvorak, Qwerty, Colemak layouts"
	res.render('learn', {
		letters ,
		k_layout,
		title,
		noindex: true
	});
})
router.get('/:k_layout/:letters/:length', (req, res) => {

	var letters= req.params.letters;
	var length= req.params.length;
	var k_layout= req.params.k_layout;
	var matchess=matches(letters, length);
	var message=false;
	var temp=k_layouts[k_layout];
	var title= "Learn Typing with Dvorak, Qwerty, Colemak layouts";
	
	

	k_layouts[k_layout].forEach( function(key_set, index){
	
		if(key_set.keys==letters){
			var prev_index = index-1<0 ? 0 : index-1;
			var prev_lesson_keys=k_layouts[k_layout][prev_index].keys
			var new_keys= letters.substr(prev_lesson_keys.length);
			console.log(new_keys);
			matchess= sort(matchess, new_keys);
		}
	})

	
	if(length <=7 )
		var container_style= "grid-template-columns: 1fr 1fr 1fr 1fr 1fr;"
	else
		var container_style= "grid-template-columns: 1fr 1fr 1fr 1fr ;font-size: 1.7rem"
	
	while(matchess.length < 16 && matchess.length!=0)
		matchess=matchess.concat(matchess);
	
	
	
	if(matchess.length==0 || /[^a-zA-z]/.test(letters)){
		message=true;
		matchess=[];
		for(var i=0; i<30; ++i){
			
			var shuffled = letters.split('').sort(function(){return 0.5-Math.random()})
			shuffled=[...shuffled, ...shuffled, ...shuffled];
			shuffled=shuffled.slice(0,length).join('');
			matchess[i]=shuffled
		}
	};
	
	if(matchess.length>50){
		
		var random= Math.random()*((matchess.length-50)/8);
		random=Math.floor(random)
		
		console.log(random);
		matchess=matchess.slice(random,random+50);
	}
	
	matchess.forEach((match, index, matchess)=> matchess[index]=match.split(""));

	
	res.render('learn2', { 
		matches:matchess, 
		style: container_style, 
		message,
		layout_keys: layout_keys(k_layout),
		k_layout,
		title,
		noindex: true
	});
	
});








function matches(letters, length){
	
	if(length==1)
		return letters.split("");
	

	var regex= "(";
	letters=letters.split("");
	letters.forEach( (l,i) => (letters.length-1==i) ? regex+=l: regex+=l+'|')
	regex+=`){${length}}`;
	regex=new RegExp(regex);

	var matches = all_words.filter( w => regex.test(w));
	matches= matches.filter( w => w.length==length)

	return matches;
}

function sort(strArr, keys){
	var arrWeight=[];
	keys=keys.split("");
	
	strArr.forEach(function(str, index){
		str=str.split("")
		var weight=0;
		str.forEach(function(letter){
			keys.forEach(function(key){
				if(letter== key)
					weight++
			})
		})
		str=str.join("");
		arrWeight[index]={
			str,
			weight,
			
		}
		
	
	})
	
	arrWeight=arrWeight.sort((a,b)=> a.weight>b.weight ?-1 :1)

	
	return arrWeight.map( el=> el.str )
}


function layout_keys(layout){
	if(layout=="qwerty")
		return [
		'QWERTYUIOP'.split(""),
		'ASDFGHJKL;'.split(""),
		'ZXCVBNM,./'.split("")
	]
	
	if(layout=="dvorak")
		return [
		'"<>PYFGCRL'.split(""),
		"AOEUIDHTNS".split(""),
		":QJKXBMWVZ".split("")
		]
		
	if(layout=="colemak")
		return[
		"QWFPGJLUY:".split(""),
		"ARSTDHNEIO".split(""),
		"ZXCVBNM<>?".split("")
	]
	
	if(layout=="dvorak_r")
		return [
		"#$jlmfp?".toUpperCase().split(""),
		"q>orsuyb".toUpperCase().split(""),
		"zaehtdck".toUpperCase().split(""),
		'x<lnwvg"'.toUpperCase().split(""),
		
	]
}



module.exports = router;