window.localStorage;
var board = new Array(9); 
var diffLevel = "Easy";
var levels = {'Easy': 45, 'Medium': 32, 'Hard': 25};
var timeTaken = 0;
var timerVar;
var isComplete = false;
var errors = 0;

for(var i=0;i<9;i++){
	board[i]=new Array(9);
    for(var j=0;j<9;j++){
    	board[i][j]=0;
    }
}

$(document).ready(function(){

	var abc = document.body.innerHTML;
    document.body.innerHTML = String(abc).replace(/\u200B/g,'');

    if(localStorage.getItem("username") != null){
		$('.popup-name').attr('style','display: none;');
		$('.popup-level').attr('style','');
    }
	var table = $("#sudoku tr");
	var row = 0;
	var focused = $('[data-row="1"][data-col="1"]');

	table.each(function(i)  {
		var col = 0;
		var boxes = $( this ).find('td');
		

		boxes.each(function(j) {

			var content = "<table cellspacing='0' cellpadding='0'>";

			for (var r = row; r < row+3 ; r++){
				content += "<tr>";
				for (var c = col; c < col+3; c++){
					content += "<td><input data-row="+r+" data-col="+c+" type='text' class='cell' maxlength='1'></td>";
				}
				content += "</tr>";
			}
			col += 3;
			content += "</table>";
			$(this).append(content);
	
		});
		row += 3;
	});

	$('#sudoku td').each(function(){
		if( $(this).attr('data-box')%2 == 0){
			$(this).addClass("gray-box")
		}
	});	

	$('.cell').attr('readonly','readonly');

	$('.cell').keypress(function(e){
		var field = $(e.target);
		if(field.attr('data-input') == 'false'){
			return false;
		}

        var charValue = String.fromCharCode(e.which);
        var valid = /^[1-9]$/.test(charValue);

        if (!valid) {
            return false;
        }
        else{
        	field.val( charValue );
        	var iserror = checkValidEntry(field.attr('data-row') , field.attr('data-col'));
        	console.log(checkComplete());
        	if(iserror){
        		errors ++;
				$('#errorcount').text(errors + '/3');
				if(errors == 3){
					alert("Game ended!! You have made 3 mistakes.\nDo you want to start new game ?");
					window.location.href = 'index.html';	
				}
		    }
        }
        e.preventDefault();
	});

	$('.cell').keydown(function(e){
		var field = $(e.target);
		var r = field.attr('data-row');
		var c = field.attr('data-col');
		
        switch(e.which) {
            case 37: // left
            	if (c>0) c--;
            break;

            case 38: // up
            	if (r>0) r--;
            break;

            case 39: // right
            	if (c<8) c++;
            break;

            case 40: // down
            	if (r<8) r++;
            break;

            case 46: //delete
            	if(field.attr('data-input') != 'false'){
		            field.val("");
				}
            break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault();
        $('[data-row="'+r+'"][data-col="'+c+'"]').focus();
        
    });

	$('.cell').focus(function(e){
		var field = $(e.target);
		focused = field;
		var r = field.attr('data-row');
		var c = field.attr('data-col');
		$('.cell').attr("style","");
		$('[data-row="'+r+'"]').attr("style", "background-color: rgba(0,100,255,0.15)");
		$('[data-col="'+c+'"]').attr("style", "background-color: rgba(0,100,255,0.15)");
        field.attr("style","");
        if(field.val() != "")
        	checkValidEntry(field.attr('data-row') , field.attr('data-col'));
	});

	$('.input-buttons span').click(function(e){
		var button = $(e.target);
		

		if(focused.attr('data-input') == 'false'){
		}
		else if(button.attr('id') == "bx" && focused.attr('disabled') != 'disabled')
			focused.val('');
		else{
			if (focused.attr('disabled') != 'disabled'){
				focused.val(button.text());
	        	checkComplete();
	        	var iserror = checkValidEntry(focused.attr('data-row') , focused.attr('data-col'));
		        if(iserror){
	        		errors ++;
					$('#errorcount').text(errors + '/3');
					if(errors == 3){
						alert("Game ended!! You have made 3 mistakes.\nDo you want to start new game ?")
					}
			    }
	        }
        	
		}
		focused.focus();
	});

	$('.action-buttons #newgame').click(function(e){
		if(checkComplete()){
			window.location.href = 'index.html';
		}
		else{
			if(confirm("Puzzle not finished. Do you want to start new game ?")){
				window.location.href = 'index.html';
			}
		}
	});

	$('#name-btn').click(function(e){
		var name = $('.nameip').val() ? $('.nameip').val() : 'Mawa';
		localStorage.setItem("username", name);
		localStorage.setItem("Easy", "[]");
		localStorage.setItem("Medium", "[]");
		localStorage.setItem("Hard", "[]");

		localStorage.setItem("EasyGames", 0);
		localStorage.setItem("MediumGames", 0);
		localStorage.setItem("HardGames", 0);


		$('.popup-name').attr('style','display: none;');
		$('.popup-level').attr('style','');
		console.log( localStorage.getItem("username"));
	});

	//level controls / start game
	$('.levels').click(function(e){
		diffLevel = $(e.target).text();
		var Gamescount = Number(localStorage.getItem(diffLevel+"Games")) + 1;
		localStorage.setItem(diffLevel+"Games", Gamescount);

		$('#diff').text(diffLevel);
		$('#status').text("Hello " + localStorage.getItem("username") + "!");
		fillBoard(diffLevel);
		timerVar = setInterval(updateDisplay, 1000); // every millisecond call updateDisplay
		console.log(diffLevel);
		changeTheme();
		$('.full-popup').attr('style','display: none;');
	});

	//darktheme toggle
	$('.switch-theme').click(function(e){
		changeTheme();
	});
	
	$('#reset').click(function(e){
		resetBoard();
		focused.focus();

	});

	$('#view-sol').click(function(e){
		viewSol();
		focused.focus();
		checkValidEntry();
		validateGrid(true);
	});

});

//--------------------------------------------------------------
function fillBoard(l){
	//generate board 
	solve();
	console.log(board);
	var puzzle = level(board, levels[l]); 
	console.log(puzzle);
	//insert values into table
	for (var i = 0; i < 9; i++){
		for (var j = 0; j < 9; j++){
			if(puzzle[i][j] != 0){
				$('[data-row="'+i+'"][data-col="'+j+'"]').val(puzzle[i][j]);
				$('[data-row="'+i+'"][data-col="'+j+'"]').attr('data-input', 'false');
			}
		}
	}
}

function resetBoard(){
	if(isComplete==true){
		alert('Puzzle already solved');
		return;
	}
	for (var i = 0; i < 9; i++){
		for (var j = 0; j < 9; j++){
			var cellval = $('[data-row="'+i+'"][data-col="'+j+'"]');
			if(cellval.attr('data-input') != 'false'){
				cellval.val('');
			}
		}
	}
}

function viewSol(){
	for (var i = 0; i < 9; i++){
		for (var j = 0; j < 9; j++){
			$('[data-row="'+i+'"][data-col="'+j+'"]').val(board[i][j]);
		}
	}
}

function changeTheme(){
		if ($('.switch-theme input').is(':checked')){
			$('body').addClass('darkbg');
			$('.cell').addClass('cellcolor');
			$('[data-input="false"]').addClass('cellcolorfalse');
			$('.input-buttons span').addClass('cellcolorfalse');
			$('#difficulty').addClass('cellcolorfalse');
			$('#timer').addClass('cellcolorfalse');
			$('#reset').addClass('cellcolorfalse');
			$('#sudoku').addClass('white-border');
			$('.action-buttons button').addClass('white-border');
			$('#status').addClass('yellowtext');
			$('#view-sol').addClass('cellcolorfalse');
			$('.perfclass').addClass('whitetext');
		}
		else{
			$('body').removeClass('darkbg');
			$('.cell').removeClass('cellcolor');
			$('[data-input="false"]').removeClass('cellcolorfalse');
			$('.input-buttons span').removeClass('cellcolorfalse');
			$('#difficulty').removeClass('cellcolorfalse');
			$('#timer').removeClass('cellcolorfalse');
			$('#reset').removeClass('cellcolorfalse');
			$('#sudoku').removeClass('white-border');
			$('.action-buttons button').removeClass('white-border');
			$('#status').removeClass('yellowtext');
			$('#view-sol').removeClass('cellcolorfalse');
			$('.perfclass').removeClass('whitetext');


		}
}
function updateDisplay() {
    var TimeValue = parseInt($('#timer').find('.timeValue').attr('data-time'), 10);
    TimeValue++;
    $('#timer').find('.timeValue').attr('data-time',TimeValue);
    $('#timer').find('.timeValue').text(
    	pad2(Math.floor(TimeValue/3600)) +":"+
    	pad2(Math.floor((TimeValue%3600)/60)) +":"+
    	pad2(Math.floor(TimeValue%60)) ) ;
}

function pad2(number) {
   return (number < 10 ? '0' : '') + number
}

function checkComplete(){
	for (var r = 0; r < 9; r++) {
		for (var c = 0; c < 9; c++) {
			if( $('[data-row="'+r+'"][data-col="'+c+'"]').val() == ""){
				return false;
			}
		}
	}
	validateGrid(false);
	return true;
}

function checkValidEntry(row,col){
	var field = $('[data-row="'+row+'"][data-col="'+col+'"]');
	var value = field.val();
	var hasError = 0;

	field.closest("[data-box]").find(".cell").each(function(i){

		if( $(this).val()==value && !($(this).attr('data-row')==field.attr('data-row') && $(this).attr('data-col')==field.attr('data-col')) ){
			$(this).attr('style','color: red !important; background-color: rgba(0,100,255,0.15)');
			hasError = 1;
		}
		else{
			$(this).attr('style','color: none; ');
		}

	});

	for (var c = 0; c < 9; c++) {
		if( $('[data-row="'+row+'"][data-col="'+c+'"]').val()==value && col!=c ){
			$('[data-row="'+row+'"][data-col="'+c+'"]').attr('style','color: red !important; background-color: rgba(0,100,255,0.15)');
			hasError = 1;
		}
		else{
			$('[data-row="'+row+'"][data-col="'+c+'"]').attr('style','color: none; background-color: rgba(0,100,255,0.15)');
		}
	}

	for (var r = 0; r < 9; r++) {
		if( $('[data-row="'+r+'"][data-col="'+col+'"]').val()==value && row!=r){
			$('[data-row="'+r+'"][data-col="'+col+'"]').attr('style','color: red !important; background-color: rgba(0,100,255,0.15)');
			hasError = 1;
		}
		else{
			$('[data-row="'+r+'"][data-col="'+col+'"]').attr('style','color: none; background-color: rgba(0,100,255,0.15)');
			
		}
	}

	if(hasError == 1){
		field.attr('style','color: red;');
	}
	else
		field.attr('style','color: none;');		
	return hasError;
}


//--------------------------------------------------------------------
//Sudoku Generator


function check(){
	for(var i=0;i<9;i++){
    	for(var j=0;j<9;j++){
        	if(board[i][j]==0){
            	return [i,j];
            }
        }
    }
    return 0;
}
function col_Check(i,j,k){
	for(var l=0;l<9;l++){
    	if(board[l][j]==k){
        	return 0;
        }
    }
  	return 1;
}
function row_Check(i,j,k){
	for(var l=0;l<9;l++){
    	if(board[i][l]==k){
        	return 0;
        }
    }
  	return 1;
}
function box_Check(i,j,k){
	for(var l=0;l<3;l++){
    	for(var m=0;m<3;m++){
        	if(board[l+i][j+m]==k){
        		return 0;
            }
        }
    }
  	return 1;
}
function safe(i,j,k){

	if(col_Check(i,j,k) && row_Check(i,j,k) && box_Check(i-(i%3),j-(j%3),k)){
    	return 1;
    }
    return 0;
}


function solve(){
	if(check()==0){
    	return 1;
    }
    var values = new Array(2);
    values=check();
    var i=values[0];
    var j=values[1];
	var k;
    var x= new Array(9);
    var o=0;
    while(1){
    	k=Math.floor(Math.random() * (9)) + 1;
    	if(!x.includes(k)){
        	x[o]=k;
            o=o+1;
        	if(safe(i,j,k)){
            	board[i][j]=k;
            	if(solve()){
                	return 1;
                    }
            	board[i][j]=0;
             }
        }
		if(o==9){
        	/*for(var f=0;f<9;f++){
            	document.write(x[f]+" ");
            }
            document.write("<br>")*/
			break;
        }
    }
 }

function level(board, n){
	var grid = new Array(9);

	for(var i=0;i<9;i++){
		grid[i]=new Array(9);
	    for(var j=0;j<9;j++){
	    	grid[i][j]=0;
	    }
	}
	var points = new Array(n);
	var c = 0;
	while (true){
		var j = Math.floor(Math.random() * (9));
		var k = Math.floor(Math.random() * (9));
		var index = [j,k].toString() + ';';
		if (points.includes(index))
			continue;
		else{
			points[c] = index;
			c++;
			grid[j][k] = board[j][k];
		}
		if(c==n){
			break;
		}
	}
	return grid;
}

function validateGrid(viewsol){
	var isValid = true;
	for (var row = 0; row < 9; row++) {
		for (var col = 0; col < 9; col++) {
			console.log('k');
			var field = $('[data-row="'+row+'"][data-col="'+col+'"]');
			var value = field.val();

			field.closest("[data-box]").find(".cell").each(function(i){
				if( $(this).val()==value && !($(this).attr('data-row')==row && $(this).attr('data-col')==col) ){
					isValid = false;
				}
			});

			for (var c = 0; c < 9; c++) {
				if( $('[data-row="'+row+'"][data-col="'+c+'"]').val()==value && col!=c ){
					isValid = false;
					break;
				}
			}

			for (var r = 0; r < 9; r++) {
				if( $('[data-row="'+r+'"][data-col="'+col+'"]').val()==value && row!=r){
					isValid = false;
					break;
				}
			}

			if(isValid == false)
				break;
		}
		if(isValid == false)
			break;
	}
	if(isValid==false){
		$('#status').text("Wrong Solution, Try again");
	}
	else{
		$('#status').text("Perfect !");
    	timeTaken = parseInt($('#timer').find('.timeValue').attr('data-time'), 10);
    	clearInterval(timerVar);
    	$('.cell').attr('disabled', 'disabled');
    	$('#sudoku').attr('style', 'background-color: rgba(0,255,0,0.1)');
    	isComplete = true;
    	console.log(timeTaken);
	}
	if(viewsol == false){
		var currentLevelArray = JSON.parse(localStorage.getItem(diffLevel));
		currentLevelArray.push(''+timeTaken);
		localStorage.setItem(diffLevel, JSON.stringify(currentLevelArray));
	}
}
