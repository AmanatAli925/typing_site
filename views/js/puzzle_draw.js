const container   = document.getElementById("puzzle-container");

var matrix_size = 20;


matrix_size++; 		// one row and column for C1, C2.. and R1, R2..
container.style.gridTemplateColumns="repeat("+matrix_size+", 1fr)";

for(var i=0; i< matrix_size; ++i)
	for(var j=0; j< matrix_size; ++j){
		var id= i +','+ j ;
		var div= document.createElement('div')
		div.setAttribute('id', id);
		div.innerHTML="&#10060;";
		
	
		container.appendChild(div);
		//container.innerHTML+= '<div class="box" id="' + id + '">&#10060;</div>'
		//var el=document.getElementById(id);
		div.style.height=div.offsetWidth;
	}
var box_width 	 = document.getElementById('1,1').offsetWidth;

console.log("BOX WIDTH", box_width)

for(var i=1; i<matrix_size; ++i){
	var el=document.getElementById('0,'+i);
	el.innerText = 'C'+i;
	el.id="";
	el=document.getElementById(i+',0');
	el.innerText = 'R'+i;
	el.id="";
}

var el=document.getElementById('0,0');
el.innerText="";
el.id="";


for(var i=1; i<matrix_size; ++i){
	for(var j=1; j<matrix_size; ++j){
		document.getElementById(i+','+j)
				.addEventListener('click', change_to_input)
	}
}

function change_to_input(id){
	
	
	
	
	
	if(event.target.tagName=="DIV" ){
		var box_width = document.getElementById('1,1').offsetWidth;
		var div = event.target;
		var id = event.target.id;
		div.innerHTML ="<input id='"+id+"'/>";
		div.id ="";
		var input = document.getElementById(id);
		input.style.width = box_width+'px';
		input.style.height = box_width+'px';
		input.focus();
	}
	if(event.target.tagName=="INPUT" ){
		
		var id = event.target.id;
		var div= event.target.parentNode;
	
		event.target.remove();
		div.innerHTML='&#10060;'
		div.id=id;
	}
	
}

