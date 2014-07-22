// javascript for bs_main.html manipulation
teapot = {};

teapot.HOME ="";

if(window.location.host === "127.0.0.1:8000"){
  teapot.HOME = "http://127.0.0.1:8000/";
}
else{
  teapot.HOME = "http://www.boxshell.com/";
}

// recommended method to do animation
window.requestNextAnimationFrame = 
    (function(){
	return window.requestAnimationFrame ||
	    window.webkitRequestAnimationFrame ||
	    window.mozRequestAnimationFrame ||
	    window.msRequestAnimationFrame ||
	    function( callback, element){
		var self = this, start, finish;
		window.setTimeout( function(){
		    start = +new Date();
		    callback(start);
		    finish = +new Date();
		    self.timeout = 1000/60 - (finish - start);
		}, self.timeout);
	    };
    })();



teapot.read_data = function(myurl, mydata, success_function){
  $.get(myurl,
	mydata,
	success_function,
	"json");
};
teapot.is_command_link = function(str){
    if(str.search('/command/')!== -1){
	return true;
    }
    else{
	return false;
    }
};
teapot.menu_activate = function(str){
    var link = teapot.HOME;
    console.log("into menu_activate");

    $("#nav_menu li").removeClass("active");

    if( teapot.is_command_link(str)){
	return false;
    }
    else if( str === link){
	$("#menu_home").addClass("active");
    }
    else if( str === link + "register/"){
	$("#menu_" + "signin").addClass("active");
    }
    else{
	var directory = str.replace(link,"");
	var key_word = directory.replace('/',"").toLowerCase();
	$("#menu_" + key_word).addClass("active");
    }
    console.log("out of menu_activate");
};

$(document).ready(function() {
    console.log("begin bs function");
    console.log(document.URL);

    // highlight active menu
    teapot.menu_activate(document.URL);

    $("#switch_english").click(function(){
    	console.log("switch english");
    	teapot.read_data("/switch_language/",
    			 {language:"english"},
    			 function(data, status){
    			     console.log(data);
    			     window.location.reload();
    			 });
    });

    $("#switch_chinese").click(function(){
    	console.log("switch chinese");
    	teapot.read_data("/switch_language/",
    			 {language:"chinese"},
    			 function(data, status){
    			     console.log(data);
    			     window.location.reload();
    			 });
    });
});




