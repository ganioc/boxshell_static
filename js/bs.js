// javascript for bs_main.html manipulation
teapot = {};
teapot.HOME = "http://127.0.0.1:8000/";
//teapot.HOME = "http://www.boxshell.com/";

teapot.read_data = function(myurl, mydata, success_function){
  $.get(myurl,
	mydata,
	success_function,
	"json");
};

teapot.menu_activate = function(str){
    var link = teapot.HOME;

    $("#nav_menu li").removeClass("active");
    if( str === link){
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




