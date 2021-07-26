window.localStorage;

$(document).ready(function(){
	$('.switch-theme').click(function(e){
		changeTheme();
	});

	var name = localStorage.getItem("username");
	var easydata = JSON.parse(localStorage.getItem("Easy"));
	var mediumdata = JSON.parse(localStorage.getItem("Medium"));
	var harddata = JSON.parse(localStorage.getItem("Hard"));

	console.log(name);
	console.log(easydata);
	console.log(mediumdata);
	console.log(harddata);

	var inteasy = easydata.map((i) => Number(i));
	var intmedium = mediumdata.map((i) => Number(i));
	var inthard = harddata.map((i) => Number(i));

	$('#greet').text('Hi '+name);

	//Easy graph
	var ctx = document.getElementById("easyChart").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        labels: Array.from(Array(inteasy.length+1).keys()).slice(1),
	        datasets: [{
	            label: 'Time Taken in seconds',
	            data: inteasy, // Specify the data values array
	            fill: true,
	            borderColor: 'rgb(75, 192, 192)',
	            backgroundColor: 'rgba(91, 252, 134, 0.3)',
    			tension: 0.1
	        }]
	    },
	    options: {
	      responsive: true, 
	      maintainAspectRatio: false,
	      scales: {
		      y: {
		        beginAtZero: true
		      }
		    },
	    },
	    
	});

	$('#easygames').text( localStorage.getItem('EasyGames'));
	$('#easycount').text( inteasy.length);
	$('#easybest').text( secondsToTime(Math.min(...inteasy)) );
	var sum = inteasy.reduce(function(a, b){
        return a + b;
    }, 0);
	$('#easyavg').text( secondsToTime(sum/inteasy.length) );

	//Medium graph
	var ctx = document.getElementById("mediumChart").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        labels: Array.from(Array(intmedium.length+1).keys()).slice(1),
	        datasets: [{
	            label: 'Time Taken in seconds',
	            data: intmedium, // Specify the data values array
	            fill: true,
	            borderColor: 'rgb(255, 204, 20)',
	            backgroundColor: 'rgba(255, 253, 107, 0.3)',
    			tension: 0.1
	        }]
	    },
	    options: {
	      responsive: true, 
	      maintainAspectRatio: false,
	      scales: {
		      y: {
		        beginAtZero: true
		      }
		    },
	    },
	    
	});
	$('#medgames').text( localStorage.getItem('MediumGames'));
	$('#medcount').text( intmedium.length);
	console.log(Math.min(...intmedium));
	$('#medbest').text( secondsToTime(Math.min(...intmedium)));
	var sum2 = intmedium.reduce(function(a, b){
        return a + b;
    }, 0);
	$('#medavg').text( secondsToTime(sum2/intmedium.length) );

	//Hard graph
	var ctx = document.getElementById("hardChart").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        labels: Array.from(Array(inthard.length+1).keys()).slice(1),
	        datasets: [{
	            label: 'Time Taken in seconds',
	            data: inthard, // Specify the data values array
	            fill: true,
	            borderColor: 'rgb(247, 62, 62)',
	            backgroundColor: 'rgba(255, 120, 120, 0.3)',
    			tension: 0.1
	        }]
	    },
	    options: {
	      responsive: true, 
	      maintainAspectRatio: false,
	      scales: {
		      y: {
		        beginAtZero: true
		      }
		    },
	    },
	    
	});
	$('#hardgames').text( localStorage.getItem('HardGames'));
	$('#hardcount').text( inthard.length);

	$('#hardbest').text( secondsToTime(Math.min(...inthard)) );
	var sum3 = inthard.reduce(function(a, b){
        return a + b;
    }, 0);
	$('#hardavg').text( secondsToTime(sum3/inthard.length) );


});

function changeTheme(){
		if ($('.switch-theme input').is(':checked')){
			$('body').addClass('darkbg');
			$('.perfclass').addClass('whitetext');
		}
		else{
			$('body').removeClass('darkbg');
			$('.perfclass').removeClass('whitetext');
		}
}

function secondsToTime(seconds){

    	var time = pad2(Math.floor(seconds/3600)) +":"+ pad2(Math.floor((seconds%3600)/60)) +":"+
    	pad2(Math.floor(seconds%60)) ;
    	return time;
}

function pad2(number) {
   return (number < 10 ? '0' : '') + number
}