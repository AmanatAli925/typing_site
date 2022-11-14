const express= require("express")
const sendMail= require("./helpers/send_mail.js")
const router= express.Router();

router.get("/", (req,res)=>{
	var title= "Test Your Typing";
	var k_layout= req.query.layout;
	var matchess="Although most people consider piranhas to be quite dangerous, they are, for the most part, entirely harmless. Piranhas rarely feed on large animals; they eat smaller fish and aquatic plants. When confronted with humans, piranhas' first instinct is to flee, not attack. Their fear of humans makes sense. Far more piranhas are eaten by people than people are eaten by piranhas. If the fish are well-fed, they won't bite humans."
	matchess=matchess.split(" ");
	matchess.forEach((match, index, matchess)=> matchess[index]=match.split(""))
		
	var container_style= "width:90%; display:block;"
	res.render("test", {
		matches: matchess,
		style: container_style,
		layout_keys: layout_keys(k_layout),
		title
	});
})


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

module.exports= router;