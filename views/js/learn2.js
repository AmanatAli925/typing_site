var words_container=document.querySelector('.words_container');
var input_container=document.querySelector('.input_container');
var words=toArray(words_container.children);
words=words.map(word=> toArrayText(word.children))
text="";
words.forEach( word=> text+=word+" ")
input_container.setAttribute('maxlength', String(text.length))


var id=0;
toArray(words_container.children).forEach(function(span){
	toArray(span.children).forEach(function(span){
		span.id=id;
		id++;
	})
})


var url= window.location.href;
url=url.split('/');
if(+url[url.length-1]> 8)
	document.querySelector('.container').style.width="70%";

var layout= document.getElementById('k_layout').innerText;
var main_keys=[];
switch(layout){
	case "qwerty":
		main_keys=['F', 'J']
	break;
	case "dvorak":
		main_keys=['U', 'H']
	break;
	case "colemak":
		main_keys=['T', 'N']
	break;
	
	case "dvorak_r":
		main_keys=['E', 'D']
	break;
}
main_keys.forEach( function(key){
	document.getElementById(key).style.borderBottom= "4px solid black";
})




input_container.style.width= words_container.offsetWidth+"px";



var time;
var first=true;
var incorrect=0;

input_container.addEventListener("keyup", handle_key_press)

async function handle_key_press(event){
	
	var value= event.target.value;
	var matches= match_indices(value, text)
	console.log("VALUE LENGTH", value.length);
	console.log("KEY CODE", event.keyCode);
	if(first){
		time= new Date().getTime();
		first=false;
	}
	
	if(value[value.length-1]!= text[value.length-1]){
		var id=text[value.length-1].toUpperCase();
		var el=document.getElementById(id);
		el.style.backgroundColor="green";
		setInterval(()=> el.style.backgroundColor="white", 1000);
	}
	
	matches.forEach( function(match, index){
		if(match==-1)
			document.getElementById(String(index)).style.color="red"
		else
			document.getElementById(String(index)).style.color="black"
	})
	
	for(var i=matches.length; i<text.length; ++i)
		document.getElementById(String(i)).style.color="gray"
	
	if(matches[matches.length-1]==-1 && event.keyCode!=8){
		PlaySound("incorrect")
		incorrect++;
	}
	
	
	if(value.length >= text.length){
		var url_arr = window.location.href.split("/");
		var lesson  = url_arr[url_arr.length-3]+'-';
			lesson += url_arr[url_arr.length-2]+ '-';
			lesson += url_arr[url_arr.length-1];
		await fetch('/api/lessons/add_finished_lesson?lesson='+lesson)
		
		
		var t1=  new Date().getTime()
		var correct=0;
		var total_letters=text.split("").length;
		
		matches.forEach( match =>{
			if(match!=-1)
				++correct;
		})
		var final_time= t1-time;
		final_time= Math.floor(final_time/1000);
		final_time= final_time/60;
		var wpm= Math.ceil((total_letters/5)/final_time);
		
	
		
		var accuracy;
		accuracy= correct/total_letters*100;
		accuracy= Math.ceil(accuracy);
		
		var original_accuracy;
		original_accuracy= (total_letters-incorrect)/total_letters*100;
		original_accuracy= Math.ceil(original_accuracy);
		
		
		document.getElementById('accuracy').innerText= accuracy+"%"
		document.getElementById('original_accuracy').innerText= original_accuracy+"%"
		document.getElementById('speed').innerText= wpm+" wpm"
		document.getElementById('time').innerText= Math.floor(final_time*60)+ " secs"
		document.querySelector('.results').style.display="block";
		event.target.removeEventListener('keyup', handle_key_press)
	}
	
}
	
document.getElementById("next").addEventListener("click", function(){
	var url= window.location.href;
	url=url.split('/');
	var layout=url[4];
	
	if(+url[url.length-1]< 8)
		+url[url.length-1]++;
	else{
		console.log(url[5]);
		url=url.splice(0,3);
	}
	url=url.join("/")+"?layout="+layout;
	window.location.href=url;
})

function toArray(obj) {
  var array = [];
  // iterate backwards ensuring that length is an UInt32
  for (var i = obj.length >>> 0; i--;) { 
    array[i] = obj[i];
  }
  return array;
}

function toArrayText(obj) {
  var array = [];
  // iterate backwards ensuring that length is an UInt32
  for (var i = obj.length >>> 0; i--;) { 
    array[i] = obj[i].innerText;
  }
  return array.join("");
}


function PlaySound(soundObj) {
  var sound = document.getElementById(soundObj);
  sound.play();
}


function match_indices(str1, str2){
	var j=0;
	var matches=[];
	
	str1=str1.split("");
	str2=str2.split("");
	

	str1.forEach( function(l,i) {
		if(l!=str2[i])
			matches[j]=-1;
		else
			matches[j]=i;
		++j;
	})
	
	return matches;
	
}

