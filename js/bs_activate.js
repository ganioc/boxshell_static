// javascript for bs_activate_ok.html manipulation
var remain = 5;

function count_down(){
    $("#timer").html(remain);
    remain = remain -1;
    
    if(remain === 0){
	window.location= window.location.protocol + "//" + window.location.host + "/signin/";
    }
    else{
	setTimeout(count_down,1000);
	console.log("--" + remain);
    }
};


$(document).ready(function(){
    console.log("into activate.js");
    setTimeout(count_down,1000);
    console.log("out of activate.js ready()");
});


