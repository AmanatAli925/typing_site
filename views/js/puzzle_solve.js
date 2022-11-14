// var dictionary=['fick', 'sick', 'rick']
var words_solved=0;
var solutions_tested=0;
var verbs_added=false;
import {words_arr as dictionary} from "./words_result.js";




var info=[];
var first=true;

document.getElementById('solveBtn').addEventListener('click', solve);
document.getElementById('lockBtn').addEventListener('click', lockWord);
		
// document.getElementById('addVerbs').addEventListener('click', get_verbs);
document.getElementById('prevBtn').addEventListener('click', add_prev);

function add_prev(){
	solutions_tested-=2;;
	document.getElementById('solveBtn').removeAttribute('disabled');
	document.getElementById('solveBtn').click();
}

function lockWord(){
			info[words_solved].letters_positions.forEach(function(letter_pos){
				document.getElementById(letter_pos).setAttribute('disabled', 'true');
			})
			document.getElementById('solveBtn').removeAttribute('disabled');
			document.getElementById('prevBtn').removeAttribute('disabled')
			++words_solved; 
			solutions_tested=0;
			first=true;		
}
function get_verbs(){
	verbs_added=true;
	
	event.target.remove();
	var positions=[];
	var html="";
	info = get_info('h').concat(get_info('v'));
	info.forEach(function(input){
		var line_name=get_line_name(input);
		html += '<div class="input-field"><label for="'+line_name+'">Helping Verb for '+line_name+'</label>';
		html += '<input id="'+line_name+'"/></div>'
	})

	var verbFields_el= document.getElementById('verbFields');
	verbFields_el.innerHTML+=html;
	
}


function solve(){
	document.getElementById('prevBtn').removeAttribute('disabled');
	if(first)
		info = get_info('h').concat(get_info('v'));
	
	if(!info[0]){
		var msg= "Please Draw the puzzle first.";
		document.getElementById('message').innerText= msg;
		first=true;
		return;
	}
	
	console.log("WORD SOLVED", words_solved, "INFO LENGTH", info.length);
	
	
	if(words_solved==info.length){
		var msg= "Puzzle finished.";
		document.getElementById('message').innerText= msg;
		first=true;
		document.getElementById('solveBtn').setAttribute('disabled', 'true')
		document.getElementById('lockBtn').setAttribute('disabled', 'true')
		document.getElementById('prevBtn').setAttribute('disabled', 'true')
		document.getElementById('addVerbs').setAttribute('disabled', 'true')
		return;
	}
	
	
	if(first){
		info = add_solutions(info);
		info = sort_by_min_solution(info);
		info[words_solved]= sort_sol_by_verb(info[words_solved]);
		first=false;	
	}

	
	
	
	if(info[0]){
		event.target.innerText= "Next";
		document.getElementById('prevBtn').style.display="inline-block";
		document.getElementById('message').innerText= "";
	}
	console.log("INFO", info);
	
	
	
	console.log("END CONDITION: ", words_solved,'==',info.length-1, '&&', solutions_tested,'==',info[words_solved].length-1)
	if(solutions_tested==info[words_solved].solutions.length){
		var msg;
		if(info[words_solved].solutions.length==1)
			msg="This is the only solution available. You can add your own solution in above fields and continue, if its not correct";
		else
			msg="This is the last solution. Press previous to go backward. Or add solution by yourself and continue solving";
		
		document.getElementById('message').innerText= msg;
		event.target.setAttribute('disabled', 'true');
	}
	
	if(solutions_tested<0){
		var msg;
		if(info[words_solved].solutions.length==1)
			msg="This is the only solution available. You can add your own solution in above fields and continue, if its not correct";
		else
			msg="This is the first solution. Press Next to go forward. Or add solution by yourself and continue solving";
		
		solutions_tested=0;
		document.getElementById('message').innerText= msg;
		document.getElementById('prevBtn').setAttribute('disabled', 'true');
	}
	if(words_solved!=info.length-1 && solutions_tested==info[words_solved].solutions.length-1){
		
	}
	
	
	var reg=make_word(info[0].letters_positions);
	var solution_word=info[words_solved].solutions[solutions_tested];
	var letters_positions=info[words_solved].letters_positions;
	
	console.log( "INFO", info);
	console.log( 'info[',words_solved,'].solutions[', solutions_tested)
	console.log( 'put_word(',solution_word, letters_positions)
	put_word(solution_word, letters_positions)
	

	++solutions_tested;
	
	console.log("\n\n\n\n")
	
}

function addVerbs(info){
	info.forEach(function(input, index, info){
		var line_name= get_line_name(input);
		var field=document.getElementById(line_name);
		if(field)
			info[index].verb=field.value;
	})
	return info;
}

function get_line_name(input){
	if(input.direction=='h')
		return 'R'+ input.letters_positions[0].split(',')[0];
	else
		return 'C'+ input.letters_positions[0].split(',')[1];
}


function sort_by_min_solution(input_info){
	if(!input_info)
		return;
	
	return input_info = input_info.sort(function(a, b) {
		return a.solutions.length - b.solutions.length;
	});
}


function make_word(letters_positions){
	var word="";
	letters_positions.forEach(function(letter_pos){
		var value=document.getElementById(letter_pos).value;
		if(!value) value='?';
		word+=value;
	})
	return word;
}
function equal(regexStr, str){
	
	
	regexStr=regexStr.split("");
	
	if(str.length!=regexStr.length)
		return false;
	
	if(!regexStr.includes('?'))
		return false;
	
	return regexStr.every(function(letter, index){
		if(letter=="?")
			return true;
		
		if(letter.toLowerCase()==str[index].toLowerCase())
			return true;
		
		return false;
	})
}

function get_info(direction){
	var finished=false;
	var input_info =[];
	var input_info_index =0;
	var letters_positions_index=0;
	for(var i=1; i<matrix_size; ++i)
		for(var j=1; j<matrix_size; ++j){
			var id, next_id;
		
			if(direction=='v'){
				id= j+','+i;
				next_id= (j+1)+','+i;
			}else{
				id= i+','+j;
				next_id= i+','+(j+1);
			}
			var element= document.getElementById(id);
			
			if(element.tagName=='INPUT'){
				
				if(!input_info[input_info_index])
					input_info[input_info_index]={
						letters_positions: [],
						direction
					};
	
				var next_el = document.getElementById(next_id);
				if(element.tagName=="INPUT"){
					input_info[input_info_index].letters_positions[letters_positions_index]= id;
					letters_positions_index++;
				}
				
				finished =  !next_el || next_el.tagName!='INPUT';
				
				if(finished){
					input_info_index++;
					letters_positions_index=0;
				}
			}
				
		}
	input_info= input_info.filter( el=> el.letters_positions.length>1);
	input_info= addVerbs(input_info);
	
	return input_info;
}
function put_word(word, letters_positions){
	if(!word)
		return;
	letters_positions.forEach(function(pos, index){
		document.getElementById(pos).value= word[index].toUpperCase();
	})
}

function sort_sol_by_verb(input){
	if(!input)
		return;
	
	if(!verbs_added)
		return input;
	
	var solutions= input.solutions;
	var ing=[], ed=[], en=[], simple=[];
	
	solutions.forEach(function(sol){
		if(sol.substr(-3)=='ing'){
			ing.push(sol);
			return;
		}
		
		if(sol.substr(-2)=='ed'){
			ed.push(sol);
			return;
		}
		
		if(sol.substr(-2)=='en'){
			en.push(sol);
			return;
		}
		simple.push(sol);
	})

	switch(input.verb){
		case 'was':
		case 'were':
			solutions=ing.concat(en, simple, ed)
		break;
		
		case 'is':
		case 'am':
		case 'are':
			solutions=ing.concat(simple,en, ed)
		break;
		
		case 'has':
		case 'have':
		case 'had':
		case 'will has':
		case 'will have':
			solutions=en.concat(ed,simple,ing)
		break;
		
		case 'has been':
		case 'have been':
		case 'had been':
		case 'will has been':
		case 'will have been':
			solutions=ing.concat(en,ed,simple)
		break;
		
		default:
			solutions=ed.concat(simple, en, ing);
	}
	
	input.solutions=solutions;
	return input;
}

function add_solutions(input_info){
	input_info.forEach(function(input){
		dictionary.forEach(function(word){
			if(!input.solutions) input.solutions=[];
			var reg=make_word(input.letters_positions);
			if(equal(reg, word))
				input.solutions.push(word)
		})
		
	})
	
	
	return input_info;
}
